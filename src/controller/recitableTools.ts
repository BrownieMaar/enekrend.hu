import { TextBySyllablesAccented } from "../model/types/RecitableTypes";

export const getPlainTextBySyllablesAccented = (string: string): TextBySyllablesAccented => {
    return {
        text: [{
            syllable: string,
            isSpaceAfter: false,
            isAccent: false,
        }]
    }
}

export const getStringFromTextBySyllablesAccented = (text: TextBySyllablesAccented): string => {
    return text.text.reduce((acc, curr) => {
        return acc + curr.syllable + (curr.isSpaceAfter ? " " : "");
    }, "");
}