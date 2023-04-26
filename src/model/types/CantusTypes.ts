export interface Cantus extends CantusData {
    getText(): string;
    getMusicScript(): string;
    getCantusData(): CantusData;
    getIncipit(): string;
    Component({ }: CantusComponentProps): JSX.Element;
}

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
    genre?: Genre;
    tone?: Tone;
    notes?: string;
    bibleQuote?: BibleQuote[];
}


export interface BibleQuote {
    book: typeof BibleBooksWithLabels[number]["value"];
    startChapter: number;
    startVerse: number;
    endChapter: number;
    endVerse: number;
}

export const BibleBooksWithLabels = [
    { value: "Gen", label: "Genesis" },
    { value: "Exod", label: "Exodus" },
    { value: "Lev", label: "Leviticus" },
    { value: "Num", label: "Numeri" },
    { value: "Deut", label: "Deuteronomium" },
    { value: "Ios", label: "Iosue" },
    { value: "Iud", label: "Iudicum" },
    { value: "Ruth", label: "Ruth" },
    { value: "I Reg", label: "I Regum" },
    { value: "II Reg", label: "II Regum" },
    { value: "III Reg", label: "III Regum" },
    { value: "IV Reg", label: "IV Regum" },
    { value: "I Par", label: "I Paralipomenon" },
    { value: "II Par", label: "II Paralipomenon" },
    { value: "I Esd", label: "I Esdrae" },
    { value: "II Esd", label: "II Esdrae" },
    { value: "Tob", label: "Tobias" },
    { value: "Iudith", label: "Iudith" },
    { value: "Esth", label: "Esther" },
    { value: "Iob", label: "Iob" },
    { value: "Ps", label: "Psalmi" },
    { value: "Prov", label: "Proverbia" },
    { value: "Eccl", label: "Ecclesiastes" },
    { value: "Cant", label: "Canticum Canticorum" },
    { value: "Sap", label: "Sapientia" },
    { value: "Eccli", label: "Ecclesiasticus" },
    { value: "Is", label: "Isaias" },
    { value: "Ier", label: "Ieremias" },
    { value: "Lam", label: "Lamentationes" },
    { value: "Bar", label: "Baruch" },
    { value: "Ez", label: "Ezechiel" },
    { value: "Dan", label: "Daniel" },
    { value: "Os", label: "Osee" },
    { value: "Ioel", label: "Ioel" },
    { value: "Am", label: "Amos" },
    { value: "Abd", label: "Abdias" },
    { value: "Ion", label: "Ionas" },
    { value: "Mich", label: "Michaeas" },
    { value: "Nah", label: "Nahum" },
    { value: "Hab", label: "Habacuc" },
    { value: "Soph", label: "Sophonias" },
    { value: "Agg", label: "Aggaeus" },
    { value: "Zach", label: "Zacharias" },
    { value: "Mal", label: "Malachias" },
    { value: "I Mach", label: "I Machabaeorum" },
    { value: "II Mach", label: "II Machabaeorum" },
    { value: "Mt", label: "Matthaeus" },
    { value: "Mc", label: "Marcus" },
    { value: "Lc", label: "Lucas" },
    { value: "Io", label: "Ioannes" },
    { value: "Act", label: "Actus Apostolorum" },
    { value: "Rom", label: "Ad Romanos" },
    { value: "I Cor", label: "Ad Corinthios I" },
    { value: "II Cor", label: "Ad Corinthios II" },
    { value: "Gal", label: "Ad Galatas" },
    { value: "Eph", label: "Ad Ephesios" },
    { value: "Phil", label: "Ad Philippenses" },
    { value: "Col", label: "Ad Colossenses" },
    { value: "I Thess", label: "Ad Thessalonicenses I" },
    { value: "II Thess", label: "Ad Thessalonicenses II" },
    { value: "I Tim", label: "Ad Timotheum I" },
    { value: "II Tim", label: "Ad Timotheum II" },
    { value: "Tit", label: "Ad Titum" },
    { value: "Phlm", label: "Ad Philemonem" },
    { value: "Heb", label: "Ad Hebraeos" },
    { value: "Iac", label: "Iacobi" },
    { value: "I Pet", label: "I Petri" },
    { value: "II Pet", label: "II Petri" },
    { value: "I Io", label: "I Ioannes" },
    { value: "II Io", label: "II Ioannes" },
    { value: "III Io", label: "III Ioannes" },
    { value: "Iudae", label: "Iudae" },
    { value: "Apoc", label: "Apocalypsis Ioannis" }
] as const;

export type Genre = typeof GenreOptionsWithLabels[number]["value"];

export const GenreOptionsWithLabels = [
    { value: "Intr", label: "Introitus" },
    { value: "IntrV", label: "Introitus verse" },
    { value: "Gr", label: "Graduale" },
    { value: "GrV", label: "Graduale verse" },
    { value: "Tr", label: "Tractus" },
    { value: "All", label: "Alleluia" },
    { value: "Seq", label: "Sequentia" },
    { value: "Off", label: "Offertorium" },
    { value: "OffV", label: "Offertorium verse" },
    { value: "Comm", label: "Communio" },
    { value: "Resp", label: "Responsorium" },
    { value: "RespV", label: "Responsorium verse" },
    { value: "Hymn", label: "Hymnus" },
    { value: "Ant", label: "Antiphona" },
] as const;


export interface CantusComponentProps {
    width: number,
    sheetType?: SheetType,
    editable?: boolean,
    fontSize?: number,
    maxLines?: number,
}

export interface AntiphonaOfficium extends Cantus {
    genre: Genre;
    tone: Tone;
}
//These are te symbols that should be available as literals: >#&@{}
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

