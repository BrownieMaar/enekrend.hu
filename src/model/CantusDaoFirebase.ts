import {CantusDao} from "./CantusDao";
import {CantusData} from "./types/CantusTypes";
import {Firestore, getFirestore} from "firebase/firestore";
import {FirebaseApp} from "firebase/app";

export class CantusDaoFirebase implements CantusDao {
    db: Firestore;

    constructor(app: FirebaseApp) {
        this.db = getFirestore(app);
    }

    addNewCantus(cantusData: CantusData, userId: string): Promise<boolean> {
        return Promise.resolve(false);
    }
}