import {CantusData} from "./types/CantusTypes";
import {CantusDto} from "./types/Dto";

export interface CantusDao {
    addNewCantus(cantusData: CantusData, userId: string): Promise<string>;
    addNewCantusVersion(cantusData: CantusData, userId: string): Promise<string>;
    getCantusById(uniqueId: string): Promise<CantusDto>;
    getCanticesWithUserIdAndTimestamp(): Promise<CantusDto[]>
}