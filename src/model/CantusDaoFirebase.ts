import {CantusDao} from "./CantusDao";
import {CantusData} from "./types/CantusTypes";
import {addDoc, collection, doc, Firestore, getDocs, getFirestore, serverTimestamp, setDoc} from "firebase/firestore";
import {FirebaseApp} from "firebase/app";
import {CantusDto} from "./types/Dto";

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

    async getCantusById(uniqueId: string): Promise<CantusDto> {

        const docRef = collection(this.db, "cantus", uniqueId, "versions");

        const querySnapshot = await getDocs(docRef);
        if (querySnapshot.empty) throw new Error("Cantus with id " + uniqueId + " empty");
        const versions = querySnapshot.docs.sort((a, b) => b.data().created.toDate().getTime() - a.data().created.toDate().getTime());

        return {
            docId: versions[0].id,
            userId: versions[0].data().userId,
            created: versions[0].data().created.toDate(),
            cantusData: versions[0].data().cantusData,
        }
    }

    async getCanticesWithUserIdAndTimestamp(): Promise<CantusDto[]> {
        const cantusRef = collection(this.db, "cantus");
        console.log("starting query...")

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

}