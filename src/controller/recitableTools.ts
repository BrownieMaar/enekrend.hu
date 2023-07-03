import { TextBySyllablesAccented } from "../model/types/RecitableTypes";

export const getPlainTBSA = (string: string): TextBySyllablesAccented => {
    return {
        text: string.split(" ").filter(syllable => syllable !== "").map((syllable, index, array) => {
            return {
                syllable: syllable,
                isSpaceAfter: index !== array.length - 1,
                isAccent: false,
            }
        })
    }
}

export const getStringFromTBSA = (text: TextBySyllablesAccented): string => {
    return text.text.reduce((acc, curr) => {
        return acc + curr.syllable + (curr.isSpaceAfter ? " " : "");
    }, "");
}