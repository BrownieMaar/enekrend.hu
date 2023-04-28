import {
    BibleQuote,
    Cantus,
    CantusData,
    Clef,
    Genre,
    KeySignature,
    MelodyWithText,
    Tone,
} from "../model/types/CantusTypes";
import {getKeyFromString,} from "./fontTools";
import {v4 as uuidv4} from "uuid";


export class CantusImpl implements Cantus {
    cantusId?: string | undefined;
    uniqueId: string;
    codexSourceId?: string | undefined;
    contents: { signatures: { signature: KeySignature; position: number; }[]; melody: MelodyWithText[]; clef: Clef };
    genre?: Genre;
    tone?: Tone | undefined;
    notes?: string;
    bibleQuote?: BibleQuote[];

    constructor(sourceData?: MelodyWithText[] | CantusData) {
        if (sourceData) {
            if (Array.isArray(sourceData)) {
                this.uniqueId = uuidv4();
                this.contents = {
                    signatures: [{ signature: getKeyFromString(sourceData[0].melody.substring(1)), position: 0 }],
                    melody: sourceData.slice(1),
                    clef: sourceData[0].melody[0] as Clef
                };
            } else {
                this.cantusId = sourceData.cantusId;
                this.uniqueId = sourceData.uniqueId;
                this.codexSourceId = sourceData.codexSourceId;
                this.genre = sourceData.genre;
                this.tone = sourceData.tone;
                this.contents = sourceData.contents;
                this.notes = sourceData.notes;
                this.bibleQuote = sourceData.bibleQuote;
            }
        } else {
            this.uniqueId = uuidv4();
            this.contents = {
                signatures: [{
                    signature: "C",
                    position: 0
                }],
                melody: [{
                    melody: "",
                    text: "",
                    isSpaceAfter: true
                }],
                clef: "M"
            };
        }
    }

    getCantusData(): CantusData {
        const returnObj: CantusData = {
            uniqueId: this.uniqueId,
            contents: this.contents,
        }
        if (this.cantusId) returnObj.cantusId = this.cantusId;
        if (this.codexSourceId) returnObj.codexSourceId = this.codexSourceId;
        if (this.genre) returnObj.genre = this.genre;
        if (this.tone) returnObj.tone = this.tone;
        if (this.notes) returnObj.notes = this.notes;
        if (this.bibleQuote) returnObj.bibleQuote = this.bibleQuote;
        return returnObj;
    }


    getText(): string {
        return this.contents.melody.map(melodyWithText => melodyWithText.text + (melodyWithText.isSpaceAfter ? " " : "")).join("");
    }

    getIncipit(): string {
        return this.getText().split(" ").slice(0, 3).join(" ")
    }

    getMusicScript(): string {
        throw new Error("Method not implemented.");
    }
}
