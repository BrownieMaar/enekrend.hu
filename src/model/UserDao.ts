import {User} from "firebase/auth";
import {AppUser} from "./types/UserTypes";

export interface UserDao {
    AddUser(userData: User): Promise<boolean>;
    getAppUserData(uid: string): Promise<AppUser>;
}