import {CantusData} from "./types/CantusTypes";
import {CantusDto} from "./types/Dto";

export interface CantusDao {
    addNewCantus(cantusData: CantusData, userId: string): Promise<string>;
    getCantusByDocId(docId: string): Promise<CantusDto>;
    getCanticesWithUserIdAndTimestamp(): Promise<CantusDto[]>
}