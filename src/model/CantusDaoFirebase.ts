import {CantusDao} from "./CantusDao";
import {CantusData} from "./types/CantusTypes";
import {addDoc, collection, doc, Firestore, getDoc, getDocs, getFirestore, serverTimestamp} from "firebase/firestore";
import {FirebaseApp} from "firebase/app";
import {CantusDto} from "./types/Dto";

export class CantusDaoFirebase implements CantusDao {
    db: Firestore;

    constructor(app: FirebaseApp) {
        this.db = getFirestore(app);
    }

    async addNewCantus(cantusData: CantusData, userId: string): Promise<string> {
        try {
            const docRef = await addDoc(collection(this.db, "cantus"), {
                cantusData: cantusData,
                userId: userId,
                created: serverTimestamp()
            })
            console.log("Cantus written with ID: ", docRef.id);
            return docRef.id
        } catch (e) {
            console.log("Error adding cantus: ", e);
            throw e;
        }
    }

    async getCantusByDocId(docId: string): Promise<CantusDto> {

        const docRef = doc(this.db, "cantus", docId);

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) throw new Error("No cantus with docId " + docId + " found");
        return {
            docId: docSnap.id,
            userId: docSnap.data().userId,
            created: docSnap.data().created.toDate(),
            cantusData: docSnap.data().cantusData,
        };

    }

    async getCanticesWithUserIdAndTimestamp(): Promise<CantusDto[]> {
        const cantusRef = collection(this.db, "cantus");

        const returnArray: CantusDto[] = [];
        const querySnapshot = await getDocs(cantusRef);
        querySnapshot.forEach((doc) => {
            returnArray.push({
                docId: doc.id,
                userId: doc.data().userId,
                created: doc.data().created.toDate(),
                cantusData: doc.data().cantusData,
            });
        });

        return returnArray;

    }


}