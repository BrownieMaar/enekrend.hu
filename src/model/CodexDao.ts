import {CodexData} from "./types/CodexTypes";

export interface CodexDao {
    addNewCodex(codexData: CodexData, userId: string): Promise<boolean>;
}

