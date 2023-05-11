import {BibleBooksWithLabels, BibleQuote} from "../model/types/CantusTypes";

export const isBibleQuoteValid = (bibleQuote: BibleQuote): boolean => {
    const areNumberFieldsPositiveOrUndefined = (bibleQuote.startChapter === undefined || bibleQuote.startChapter > 0) &&
        (bibleQuote.endChapter === undefined || bibleQuote.endChapter > 0) &&
        (bibleQuote.startVerse === undefined || bibleQuote.startVerse > 0) &&
        (bibleQuote.endVerse === undefined || bibleQuote.endVerse > 0);
    return !!bibleQuote.book && !!bibleQuote.startChapter && !!bibleQuote.endChapter
        && bibleQuote.startChapter <= bibleQuote.endChapter
        && (!bibleQuote.startVerse || !bibleQuote.endVerse || bibleQuote.startVerse <= bibleQuote.endVerse)
        && ((!bibleQuote.startVerse && !bibleQuote.endVerse) || (!!bibleQuote.startChapter && !!bibleQuote.endChapter))
        && areNumberFieldsPositiveOrUndefined;
}

export const bibleQuoteToString = (bibleQuote: BibleQuote, lang?: "hun" | "lat"): string => {
    const book = BibleBooksWithLabels.find(book => book.value === bibleQuote.book);
    const bookShort = (lang !== "hun" ? book?.value : book?.hunShort) || "";

    const startLabel = !bibleQuote.startVerse ? bibleQuote.startChapter : (bibleQuote.startChapter + "," + bibleQuote.startVerse);

    const isInSameChapter = bibleQuote.startChapter === bibleQuote.endChapter;
    const endLabel = isInSameChapter ? bibleQuote.endVerse : !bibleQuote.endVerse ? bibleQuote.endChapter : (bibleQuote.endChapter + "," + bibleQuote.endVerse);

    return isBibleQuoteValid(bibleQuote) ? `${bookShort} ${startLabel}${!!bibleQuote.startChapter ? "-": ""}${endLabel}` : "err"
}