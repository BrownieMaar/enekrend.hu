import { LiturgyDto, LiturgyVersionDto } from "./types/Dto";
import {LiturgyData} from "./types/LiturgyTypes";

export interface LiturgyDao {
    uploadLiturgy(liturgyData: LiturgyData, userId: string): Promise<string>;
    getLiturgyById(uniqueId: string, versionId?: string): Promise<LiturgyDto>;
    getLiturgyVersionDTOsById(uniqueId: string): Promise<LiturgyVersionDto[]>;
    getLiturgyWithUserIdAndTimestamp(): Promise<LiturgyDto[]>
}