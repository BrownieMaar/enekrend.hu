import { Timestamp } from "firebase/firestore";

export interface AppUser {
    displayName: string | null;
    email: string | null;
    photoUrl: string | null;
    uid: string;
    created: Timestamp;
}