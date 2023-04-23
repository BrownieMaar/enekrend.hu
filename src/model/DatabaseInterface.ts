import { User } from "firebase/auth";
import { AppUser } from "./types/UserTypes";

export interface DatabaseInterface {
    AddUser(userData: User): Promise<boolean>;
    getAppUserData(uid: string): Promise<AppUser>;
}