import {CantusData} from "./CantusTypes";

export interface CantusDto {
    docId: string;
    cantusData: CantusData;
    userId: string;
    created: Date;
}

export interface CantusVersionDto {
    docId: string;
    userId: string;
    created: Date;
}