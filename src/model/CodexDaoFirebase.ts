import {CodexData} from "./types/CodexTypes";
import {CodexDao} from "./CodexDao";
import {Firestore, getFirestore} from "firebase/firestore";
import {FirebaseApp} from "firebase/app";

export class CodexDaoFirebase implements CodexDao {
    db: Firestore;

    constructor(app: FirebaseApp) {
        this.db = getFirestore(app);
    }

    addNewCodex(codexData: CodexData, userId: string): Promise<boolean> {
        return Promise.resolve(false);
    }
}