import { LiturgyPart } from "./LiturgyTypes";

export interface RecitableText extends LiturgyPart {
    contents: TextBySyllablesAccented
}

export interface Versicle extends LiturgyPart {
    contents: {
        versus: TextBySyllablesAccented,
        responsum: TextBySyllablesAccented,
    }
}

export interface Dialogus extends LiturgyPart {
    contents: {
        versus: TextBySyllablesAccented,
        responsum: TextBySyllablesAccented,
    }[]
}

export interface Psalmus extends LiturgyPart {
    contents: {
        flexa: TextBySyllablesAccented,
        mediatio: TextBySyllablesAccented,
        terminatio: TextBySyllablesAccented,
    }[]
}

export type TextBySyllablesAccented = {
    text: [
        {
            syllable: string,
            isSpaceAfter: boolean,
            isAccent: boolean,
        }
    ]
}