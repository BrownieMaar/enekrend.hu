import {CantusDao} from "./CantusDao";
import {CantusData} from "./types/CantusTypes";

export class CantusDaoFirebase implements CantusDao {
    addNewCantus(cantusData: CantusData, userId: string): Promise<boolean> {
        return Promise.resolve(false);
    }
}