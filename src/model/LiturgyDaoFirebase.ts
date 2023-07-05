import { LiturgyData } from "./types/LiturgyTypes";
import { LiturgyDao } from "./LiturgyDao";
import { Firestore, addDoc, collection, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { FirebaseApp } from "firebase/app";
import { LiturgyDto, LiturgyVersionDto } from "./types/Dto";

export class LiturgyDaoFirebase implements LiturgyDao {
    db: Firestore;

    constructor(app: FirebaseApp) {
        this.db = getFirestore(app);
    }
    
    async getLiturgyById(uniqueId: string, versionId?: string | undefined): Promise<LiturgyDto> {
        if (versionId) {

            const docRef = doc(this.db, "liturgy", uniqueId, "versions", versionId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) throw new Error("Cantus with id " + uniqueId + " and versionId " + versionId + " does not exist");

            return {
                docId: docSnap.id,
                userId: docSnap.data().userId,
                created: docSnap.data().created.toDate(),
                liturgyData: docSnap.data().cantusData,
            } as LiturgyDto
        }

        const docRef = collection(this.db, "liturgy", uniqueId, "versions");

        const querySnapshot = await getDocs(docRef);
        if (querySnapshot.empty) throw new Error("Cantus with id " + uniqueId + " empty");
        const version = querySnapshot.docs.sort((a, b) => b.data().created.toDate().getTime() - a.data().created.toDate().getTime())[0];

        return {
            docId: version.id,
            userId: version.data().userId,
            created: version.data().created.toDate(),
            liturgyData: version.data().liturgyData,
        } as LiturgyDto
    }
    getLiturgyVersionDTOsById(uniqueId: string): Promise<LiturgyVersionDto[]> {
        throw new Error("Method not implemented.");
    }
    getLiturgyWithUserIdAndTimestamp(): Promise<LiturgyDto[]> {
        throw new Error("Method not implemented.");
    }

    async uploadLiturgy(liturgyData: LiturgyData, userId: string): Promise<string> {
        console.log(liturgyData)
        try {
            const docRef = doc(this.db, "liturgy", liturgyData.uniqueId)
            const docSnapshot = await getDoc(docRef);
            if (!docSnapshot.exists()) {
                console.log("No such document yet!")
                await setDoc(docRef, { creatorId: userId })

                const subcollectionRef = collection(docRef, "versions");

                await addDoc(subcollectionRef, {
                    userId: userId,
                    created: serverTimestamp(),
                    liturgyData: liturgyData,
                });

                console.log("Cantus written with ID: ", subcollectionRef.id);
                return docRef.id
            }
            else {
                const subcollectionRef = collection(docRef, "versions");

                await addDoc(subcollectionRef, {
                    userId: userId,
                    created: serverTimestamp(),
                    liturgyData: liturgyData,
                });

                console.log("Liturgy saved with ID: ", subcollectionRef.id);
                return docRef.id
            }
        } catch (e) {
            console.log("Error adding liturgy: ", e);
            throw e;
        }
    }
}