import { TextBySyllablesAccented } from "../model/types/RecitableTypes";

export const getPlainTextBySyllablesAccented = (string: string): TextBySyllablesAccented => {
    return {
        text: string.split("").reduce((acc, curr) => {
            if (curr === " " && acc.length > 0) {
                acc.at(-1)!.isSpaceAfter = true;
            } else {
                acc.push({ syllable: curr, isSpaceAfter: false, isAccent: false });
            }
            return acc;
        }, [] as TextBySyllablesAccented["text"])
    }
}

export const getStringFromTextBySyllablesAccented = (text: TextBySyllablesAccented): string => {
    return text.text.reduce((acc, curr) => {
        return acc + curr.syllable + (curr.isSpaceAfter ? " " : "");
    }, "");
}