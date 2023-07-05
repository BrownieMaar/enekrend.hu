import {CantusData} from "./CantusTypes";
import { LiturgyData } from "./LiturgyTypes";

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

export interface LiturgyDto {
    docId: string;
    liturgyData: LiturgyData;
    userId: string;
    created: Date;
}

export interface LiturgyVersionDto {
    docId: string;
    userId: string;
    created: Date;
}