import {LiturgyData} from "./types/LiturgyTypes";
import {LiturgyDao} from "./LiturgyDao";
import {Firestore, getFirestore} from "firebase/firestore";
import {FirebaseApp} from "firebase/app";

export class LiturgyDaoFirebase implements LiturgyDao {
    db: Firestore;

    constructor(app: FirebaseApp) {
        this.db = getFirestore(app);
    }

    addNewLiturgy(liturgyData: LiturgyData, userId: string): Promise<boolean> {
        return Promise.resolve(false);
    }
}