import { LiturgyPart } from "./LiturgyTypes";

export interface Cantus extends CantusData {
    getText(): string;
    getMusicScript(): string;
    getCantusData(): CantusData;
    getIncipit(): string;
}

export interface CantusData extends LiturgyPart {
    contents: {
        signatures: {
            signature: KeySignature,
            position: number
        }[],
        melody: MelodyWithText[],
        clef: Clef,
    };
    tone?: Tone;
}

export interface CantusComponentProps {
    width: number,
    sheetType?: SheetType,
    editable?: boolean,
    fontSize?: number,
    maxLines?: number,
}

export type Clef = ">" | "#" | "&" | "@" | "{" | "}" | "<" | "M";

export type MelodyWithText = {
    melody: string;
    text: string;
    isSpaceAfter: boolean
}

export type Tone = typeof ToneOptionsWithLabels[number]["value"];

export const ToneOptionsWithLabels = [
    { value: "I", label: "I", arabic: 1 },
    { value: "II", label: "II", arabic: 2 },
    { value: "III", label: "III", arabic: 3 },
    { value: "IV", label: "IV", arabic: 4 },
    { value: "V", label: "V", arabic: 5 },
    { value: "VI", label: "VI", arabic: 6 },
    { value: "VII", label: "VII", arabic: 7 },
    { value: "VIII", label: "VIII", arabic: 8 },
] as const;

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

