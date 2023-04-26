import {LiturgyData} from "./types/LiturgyTypes";

export interface LiturgyDao {
    addNewLiturgy(liturgyData: LiturgyData, userId: string): Promise<boolean>;
}