import { FirebaseApp } from "firebase/app";
import { Firestore, addDoc, collection, doc, getDocs, getFirestore, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { DatabaseInterface } from "./DatabaseInterface";
import { AppUser } from "./types/UserTypes";
import { User } from "firebase/auth";

export class DatabaseFirestore implements DatabaseInterface {
    db: Firestore;

    constructor(app: FirebaseApp) {
        this.db = getFirestore(app);
    }

    async getAppUserData(uid: string): Promise<AppUser> {
        const usersRef = collection(this.db, "users");

        const q = query(usersRef, where("uid", "==", uid))

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) throw new Error("No user with uid " + uid + " found");
        if (querySnapshot.size > 1) throw new Error("An error occured. Multiple users with uid " + uid);

        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
            displayName: data.displayName,
            email: data.email,
            photoUrl: data.photoUrl,
            uid: data.uid,
            created: data.created
        }
    }
    
    async AddUser(userData: User): Promise<boolean> {

        const usersRef = collection(this.db, "users");
        
        const q = query(usersRef, where("uid", "==", userData.uid))
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            const docRef = await addDoc(collection(this.db, "users"), {
                displayName: userData.displayName,
                email: userData.email,
                photoUrl: userData.photoURL,
                uid: userData.uid,
                created: serverTimestamp()
            });
            console.log("Document written with ID: ", docRef.id);
            return true
        }
        if (querySnapshot.size > 1) {
            throw new Error("An error occured. Multiple users with uid " + userData.uid);
        }
        else return false
    }

    // async addUser(firstName: string, lastName: string, born: number) {
    //     try {
    //         const docRef = await addDoc(collection(this.db, "users"), {
    //             firstName: firstName,
    //             lastName: lastName,
    //             born: born,
    //         });
    //         console.log("Document written with ID: ", docRef.id);
    //     } catch (e) {
    //         console.error("Error adding document: ", e);
    //     }
    // }

    // async readUsersToConsole() {
    //     const querySnapshot = await getDocs(collection(this.db, "users"));
    //     querySnapshot.forEach(doc => {
    //         console.log(doc.id)
    //         console.log(doc.data())
    //     })
    // }

    // usersCollectionData() {
    //     const usersRef = collection(this.db, "users");
    //     const queryResult = query(usersRef, orderBy("born"), limit(25))
    //     return useCollectionData(queryResult)?.[0]
    // }

    // async testAddingData() {
    //     // await setDoc(doc(collection(this.db, "users")), {
    //     //     first: "Ada",
    //     //     last: "Lovelace",
    //     //     born: 1815,
    //     //     created: serverTimestamp()
    //     // })
    //     await updateDoc(doc(this.db, "users", "M8qBRokqu0xiHRhmPQgm"), {
    //         first: "Evaa"
    //     } )
    // }
}