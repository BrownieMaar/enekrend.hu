import {CantusData} from "./types/CantusTypes";

export interface CantusDao {
    addNewCantus(cantusData: CantusData, userId: string): Promise<boolean>;
}