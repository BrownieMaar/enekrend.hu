import { LiturgyPart } from "./LiturgyTypes";

export interface RecitableText extends LiturgyPart {
    contents: TextBySyllablesAccented;
    tpye: "recitableText";
}

export interface Versicle extends LiturgyPart {
    contents: {
        versus: TextBySyllablesAccented,
        responsum: TextBySyllablesAccented,
    };
    type: "versicle";
}

export interface Dialogus extends LiturgyPart {
    contents: {
        versus: TextBySyllablesAccented,
        responsum: TextBySyllablesAccented,
    }[];
    type: "dialogus";
}

export interface Psalmus extends LiturgyPart {
    contents: {
        flexa: TextBySyllablesAccented,
        mediatio: TextBySyllablesAccented,
        terminatio: TextBySyllablesAccented,
    }[];
    type: "psalmus";
}

export type TextBySyllablesAccented = {
    text: {
        syllable: string,
        isSpaceAfter: boolean,
        isAccent: boolean,
    }[]

}