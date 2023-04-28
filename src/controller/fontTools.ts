import {Cantus, KeySignature} from "../model/types/CantusTypes";
import {CantusImpl} from "./CantusImpl";

export function getCharacterWidthInPixels(
    character: string,
    font: string,
    fontSize: number
): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Could not create 2D context');
    }

    context.font = `${fontSize}px ${font}`;

    const metrics = context.measureText(character);

    return metrics.width;
}

export function getCantusFromCantusScript(cantusScript: string): Cantus {
    const [text, music] = splitCharacters(" " + cantusScript)

    const melodyWithText = music.map((melody, index) => {
        return {
            melody: melody,
            isSpaceAfter: !text[index] || text[index].endsWith(" ") || !text[index + 1] || text[index + 1]?.startsWith(" "),
            text: text[index] ? text[index].trim() : "", 
        }
    })

    return new CantusImpl(melodyWithText)
}

function splitCharacters(str: string): [string[], string[]] {
    const regularStrings: string[] = [];
    const parensChars: string[] = [];
    let inParens = false;
    let escape = false;
    let currentStr = '';

    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        if (char === '(' && !escape) {
            if (currentStr) {
                regularStrings.push(currentStr);
                currentStr = '';
            }
            inParens = true;
        } else if (char === ')' && !escape) {
            inParens = false;
            parensChars.push(currentStr);
            currentStr = '';
        } else {
            if (char === '\\' && !escape) {
                escape = true;
            } else {
                if (inParens) {
                    currentStr += char;
                } else {
                    currentStr += char;
                    if ((i === str.length - 1 || str.charAt(i + 1) === '(') && !escape) {
                        regularStrings.push(currentStr);
                        currentStr = '';
                    }
                }
                escape = false;
            }
        }
    }

    return [regularStrings, parensChars];
}

export const KeysAsGuido = {
    "C": "",
    "G": "ô",
    "D": "ôþ",
    "A": "ôþù",
    "E": "ôþùû",
    "B": "ôþùßÑ",
    "F#": "ôþùßÑò",
    "C#": "ôþùßÑòÒ",
    "F": "X",
    "Bb": "XB",
    "Eb": "XBY",
    "Ab": "XBYV",
    "Db": "XBYVÍ",
    "Gb": "XBYVÍC",
    "Cb": "XBYVÍCS",
}
export const getKeyFromString = (keyString: string): KeySignature => {
    if (Object.values(KeysAsGuido).includes(keyString)) {
        return Object.keys(KeysAsGuido).find((_key, i) => Object.values(KeysAsGuido)[i] === keyString) as KeySignature;
    } else {
        console.log("Key not found");
        return "C";
    }
}