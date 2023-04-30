import {CantusData} from "./types/CantusTypes";
import {CantusDto, CantusVersionDto} from "./types/Dto";

export interface CantusDao {
    addNewCantus(cantusData: CantusData, userId: string): Promise<string>;
    addNewCantusVersion(cantusData: CantusData, userId: string): Promise<string>;
    getCantusById(uniqueId: string, versionId?: string): Promise<CantusDto>;
    getCantusVersionDTOsById(uniqueId: string): Promise<CantusVersionDto[]>;
    getCanticesWithUserIdAndTimestamp(): Promise<CantusDto[]>
}