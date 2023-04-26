import { User } from "firebase/auth";
import { AppUser } from "./types/UserTypes";
import { CantusData } from "./types/CantusTypes";

export interface DatabaseInterface {
    AddUser(userData: User): Promise<boolean>;
    getAppUserData(uid: string): Promise<AppUser>;
    addNewCantus(cantusData: CantusData, userId: string): Promise<boolean>;
}