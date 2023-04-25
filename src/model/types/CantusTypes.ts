export interface CantusData {
    cantusId?: string;
    uniqueId: string;
    codexSourceId?: string;
    contents: {
        signatures: {
            signature: KeySignature,
            position: number
        }[],
        melody: MelodyWithText[],
        clef: Clef,
    };
    genre?: string;
    tone?: Tone;
}


export interface Cantus extends CantusData {
    getText(): string;
    getMusicScript(): string;
    getCantusData(): CantusData;
    getIncipit(): string;
    Component({}: CantusComponentProps ): JSX.Element;
}


export interface CantusComponentProps {
    width: number,
    sheetType?: SheetType,
    editable?: boolean,
    fontSize?: number,
    maxLines?: number,
}

export interface AntiphonaOfficium extends Cantus {
    genre: string;
    tone: Tone;
}
//These are te symbols that should be available as literals: >#&@{}
export type Clef = ">" | "#" | "&" | "@" | "{" | "}" | "<" | "M";

export type MelodyWithText = {
    melody: string;
    text: string;
    isSpaceAfter: boolean
}

export type Tone = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII";

export type KeySignature = "C" | "G" | "D" | "A" | "E" | "B" | "F#" | "C#" | "F" | "Bb" | "Eb" | "Ab" | "Db" | "Gb" | "Cb";

export type SheetType = "ELTE" | "OffParvum";

export const separatorCharactersInGuido = [
    "§",
    "'",
    "\"",
    "+",
    "!",
    "%",
    "/",
    "=",
    "(",
    ")",
    "Ö",
    "Ü",
    "Ó",
    ",",
    ",,",
    ".",
    "?",
    ":",
    ";",
]

