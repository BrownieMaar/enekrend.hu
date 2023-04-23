import { MelodyWithText, separatorCharactersInGuido } from "../model/types/CantusTypes";
import { getCharacterWidthInPixels } from "./fontTools";

export class RendererTools {
    lineStarting: string;
    GUIDO_FONTSIZE = 40;
    GUIDO_FONT = "Guido HU";
    TEXT_FONTSIZE = 20;
    TEXT_FONT = "Book Antiqua";
    DEFAULT_WHITESPACE_BEFORE = "--"
    DEFAULT_WHITESPACE_AFTER = "-"
    SPACER_CHARACTER = "¨"

    constructor(
        lineStarting: string,
        guidoFont?: number,
        guidoFontSize?: string,
        textFont?: string,
        textFontSize?: number,
        defaultWhitespaceBefore?: string,
        defaultWhitespaceAfter?: string,
        spacerCharacter?: string,
    ) {
        this.lineStarting = lineStarting;
        if (guidoFont) this.GUIDO_FONTSIZE = guidoFont;
        if (guidoFontSize) this.GUIDO_FONT = guidoFontSize;
        if (textFont) this.TEXT_FONT = textFont;
        if (textFontSize) this.TEXT_FONTSIZE = textFontSize;
        if (defaultWhitespaceBefore) this.DEFAULT_WHITESPACE_BEFORE = defaultWhitespaceBefore;
        if (defaultWhitespaceAfter) this.DEFAULT_WHITESPACE_AFTER = defaultWhitespaceAfter;
        if (spacerCharacter) this.SPACER_CHARACTER = spacerCharacter;
    }

    getInfoToCalculatePosition = (curr: MelodyWithText, index?: number) => {
        const isFirst = index === 0;
        const separator = separatorCharactersInGuido.find((str) => curr.melody.endsWith("-" + str))
        const actualMelody = separator ? curr.melody.substring(0, curr.melody.length - 1 - separator.length) : curr.melody;

        const melodyWidth = getCharacterWidthInPixels(actualMelody, this.GUIDO_FONT, this.GUIDO_FONTSIZE);
        const textWidth = getCharacterWidthInPixels(curr.text.trim(), this.TEXT_FONT, this.TEXT_FONTSIZE);

        const isTextLongerThanMelody = textWidth > melodyWidth;
        const differenceInLengthOnSides = isTextLongerThanMelody ? (textWidth - melodyWidth) / 2 : textWidth - melodyWidth;


        return { isFirst, separator, actualMelody, melodyWidth, textWidth, isTextLongerThanMelody, differenceInLengthOnSides }
    }

    trimMelodyFromSeparator = (curr: MelodyWithText) => {
        const currentInfo = this.getInfoToCalculatePosition(curr);
        curr.melody = currentInfo.separator ? curr.melody.substring(0, curr.melody.length - 1 - currentInfo.separator.length) : curr.melody;
    }

    getWhiteSpaceCharsBefore = (info: ReturnType<typeof this.getInfoToCalculatePosition>) => info.isFirst
        ? info.isTextLongerThanMelody
            ? info.differenceInLengthOnSides > getCharacterWidthInPixels(this.lineStarting, this.GUIDO_FONT, this.GUIDO_FONTSIZE)
                ? (() => {
                    const lineStartLength = getCharacterWidthInPixels(this.lineStarting, this.GUIDO_FONT, this.GUIDO_FONTSIZE);
                    const overflowInPx = info.differenceInLengthOnSides - lineStartLength;
                    const SPACER_CHARACTER = "¨"
                    const spacerCharacterLength = getCharacterWidthInPixels(SPACER_CHARACTER, this.GUIDO_FONT, this.GUIDO_FONTSIZE);
                    const spacerCharacterNeeded = Math.ceil(overflowInPx / spacerCharacterLength);
                    return SPACER_CHARACTER.repeat(spacerCharacterNeeded)
                })()
                : ""
            : ""
        : this.DEFAULT_WHITESPACE_BEFORE

    getWhiteSpaceCharsAfter = (isSpaceAfter: boolean, currentInfo: ReturnType<typeof this.getInfoToCalculatePosition>, nextInfo?: ReturnType<typeof this.getInfoToCalculatePosition>) => {
        const expectedWhiteSpaceAfter = currentInfo.separator
            ? this.DEFAULT_WHITESPACE_AFTER + currentInfo.separator
            : this.DEFAULT_WHITESPACE_AFTER
        const expectedWhiteSpaceAfterLength = getCharacterWidthInPixels(expectedWhiteSpaceAfter, this.GUIDO_FONT, this.GUIDO_FONTSIZE);
        const whiteSpaceBeforeNextLength = getCharacterWidthInPixels(this.DEFAULT_WHITESPACE_BEFORE, this.GUIDO_FONT, this.GUIDO_FONTSIZE);
        const minWhiteSpaceAfterLength = (nextInfo && nextInfo.isTextLongerThanMelody ? nextInfo.differenceInLengthOnSides : 0)
            + (currentInfo.isTextLongerThanMelody ? currentInfo.differenceInLengthOnSides : 0)
            + (isSpaceAfter ? getCharacterWidthInPixels(" ", this.TEXT_FONT, this.TEXT_FONTSIZE) : getCharacterWidthInPixels("-", this.TEXT_FONT, this.TEXT_FONTSIZE)); //TODO: Figure out dashless linebreaks

        return minWhiteSpaceAfterLength > expectedWhiteSpaceAfterLength + whiteSpaceBeforeNextLength
            ? (() => {
                const overflowInPx = minWhiteSpaceAfterLength - (expectedWhiteSpaceAfterLength + whiteSpaceBeforeNextLength)
                const SPACER_CHARACTER = "¨"
                const spacerCharacterLength = getCharacterWidthInPixels(SPACER_CHARACTER, this.GUIDO_FONT, this.GUIDO_FONTSIZE);
                const spacerCharacterNeeded = Math.ceil(overflowInPx / spacerCharacterLength);
                return SPACER_CHARACTER.repeat(spacerCharacterNeeded)
            })() + expectedWhiteSpaceAfter
            : expectedWhiteSpaceAfter
    }
}