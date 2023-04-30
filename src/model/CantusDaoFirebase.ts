import {CantusDao} from "./CantusDao";
import {CantusData} from "./types/CantusTypes";
import {
    addDoc,
    collection,
    doc,
    Firestore,
    getDoc,
    getDocs,
    getFirestore,
    serverTimestamp,
    setDoc
} from "firebase/firestore";
import {FirebaseApp} from "firebase/app";
import {CantusDto, CantusVersionDto} from "./types/Dto";

export class CantusDaoFirebase implements CantusDao {
    db: Firestore;

    constructor(app: FirebaseApp) {
        this.db = getFirestore(app);
    }

    async addNewCantus(cantusData: CantusData, userId: string): Promise<string> {
        try {
            const docRef = doc(this.db, "cantus", cantusData.uniqueId)

            await setDoc(docRef, {creatorId: userId})

            const subcollectionRef = collection(docRef, "versions");

            await addDoc(subcollectionRef, {
                userId: userId,
                created: serverTimestamp(),
                cantusData: cantusData,
            });

            console.log("Cantus written with ID: ", subcollectionRef.id);
            return docRef.id
        } catch (e) {
            console.log("Error adding cantus: ", e);
            throw e;
        }
    }

    async addNewCantusVersion(cantusData: CantusData, userId: string): Promise<string> {
        try {
            const docRef = doc(this.db, "cantus", cantusData.uniqueId)

            const subcollectionRef = collection(docRef, "versions");

            await addDoc(subcollectionRef, {
                userId: userId,
                created: serverTimestamp(),
                cantusData: cantusData,
            });

            console.log("Cantus written with ID: ", subcollectionRef.id);
            return docRef.id
        } catch (e) {
            console.log("Error adding cantus: ", e);
            throw e;
        }
    }

    async getCantusById(uniqueId: string, versionId?: string): Promise<CantusDto> {

        if (versionId) {

            const docRef = doc(this.db, "cantus", uniqueId, "versions", versionId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) throw new Error("Cantus with id " + uniqueId + " and versionId " + versionId + " does not exist");

            return {
                docId: docSnap.id,
                userId: docSnap.data().userId,
                created: docSnap.data().created.toDate(),
                cantusData: docSnap.data().cantusData,
            }
        }

        const docRef = collection(this.db, "cantus", uniqueId, "versions");

        const querySnapshot = await getDocs(docRef);
        if (querySnapshot.empty) throw new Error("Cantus with id " + uniqueId + " empty");
        const version = querySnapshot.docs.sort((a, b) => b.data().created.toDate().getTime() - a.data().created.toDate().getTime())[0];

        return {
            docId: version.id,
            userId: version.data().userId,
            created: version.data().created.toDate(),
            cantusData: version.data().cantusData,
        }
    }

    async getCanticesWithUserIdAndTimestamp(): Promise<CantusDto[]> {
        const cantusRef = collection(this.db, "cantus");

        const returnArray: CantusDto[] = [];
        const querySnapshot = await getDocs(cantusRef);

        for (const querySnapshotElement of querySnapshot.docs) {
            const versionsArray: CantusDto[] = [];

            const versionsRef = collection(querySnapshotElement.ref, "versions");
            const versionsSnapshot = await getDocs(versionsRef);

            for (const versionsSnapshotElement of versionsSnapshot.docs) {
                versionsArray.push({
                    docId: versionsSnapshotElement.id,
                    userId: versionsSnapshotElement.data().userId,
                    created: versionsSnapshotElement.data().created.toDate(),
                    cantusData: versionsSnapshotElement.data().cantusData,
                })
            }

            const mostRecentVersion = versionsArray.sort((a, b) => b.created.getTime() - a.created.getTime())[0];
            returnArray.push(mostRecentVersion);
        }

        return returnArray;

    }

    async getCantusVersionDTOsById(uniqueId: string): Promise<CantusVersionDto[]> {
        const docRef = collection(this.db, "cantus", uniqueId, "versions");
        const querySnapshot = await getDocs(docRef);
        if (querySnapshot.empty) throw new Error("Cantus with id " + uniqueId + " empty");
        const versionDTOs: CantusVersionDto[] = [];
        querySnapshot.forEach((doc) => {
            versionDTOs.push({
                docId: doc.id,
                userId: doc.data().userId,
                created: doc.data().created.toDate(),
            })
        });
        return versionDTOs.sort((a, b) => b.created.getTime() - a.created.getTime());
    }

}