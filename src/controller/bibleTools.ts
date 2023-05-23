import { BibleBooksWithLabels, BibleQuote } from "../model/types/LiturgyTypes";

export type BibleErrorMessage = { errorIn: keyof BibleQuote, errorMessage: string }

export const getErrorsInBibleQuote = (bibleQuote: BibleQuote): BibleErrorMessage[] => {
    const errorMessages: BibleErrorMessage[] = [];

    ["startChapter", "startVerse", "endChapter", "endVerse"].forEach(key => {
        const keyWithTypeGuard = key as keyof BibleQuote;
        const currentChild = bibleQuote[keyWithTypeGuard];
        if (typeof currentChild !== "number") return
        if (currentChild < 1) {
            errorMessages.push({ errorIn: keyWithTypeGuard, errorMessage: "Minimum value is 1." })
            return;
        }
    })

    if (bibleQuote.startChapter && bibleQuote.endChapter && bibleQuote.startChapter > bibleQuote.endChapter)
        errorMessages.push({ errorIn: "endChapter", errorMessage: "Cannot be smaller than start chapter." })

    if (bibleQuote.startChapter && bibleQuote.endChapter && bibleQuote.startChapter === bibleQuote.endChapter && bibleQuote.startVerse && bibleQuote.endVerse && bibleQuote.startVerse > bibleQuote.endVerse)
        errorMessages.push({ errorIn: "endVerse", errorMessage: "Cannot be smaller than start verse." })

    if (!bibleQuote.startChapter && bibleQuote.startVerse)
        errorMessages.push({ errorIn: "startChapter", errorMessage: "Must be specified if start verse is specified." })

    if (!bibleQuote.startChapter && bibleQuote.endChapter)
        errorMessages.push({ errorIn: "startChapter", errorMessage: "Must be specified if end chapter is specified." })
    
    if (!bibleQuote.startChapter && bibleQuote.endVerse)
        errorMessages.push({ errorIn: "startChapter", errorMessage: "Must be specified if end verse is specified." })
    
    if (!bibleQuote.startVerse && bibleQuote.endVerse)
        errorMessages.push({ errorIn: "startVerse", errorMessage: "Must be specified if end verse is specified." })
    
    if (!bibleQuote.endChapter && bibleQuote.endVerse)
        errorMessages.push({ errorIn: "endChapter", errorMessage: "Must be specified if end verse is specified." })
    

    return errorMessages;
}

const bibleVersesToString = (bibleQuote: BibleQuote): string => {
    const startLabel = !bibleQuote.startVerse ? bibleQuote.startChapter : (bibleQuote.startChapter + ", " + bibleQuote.startVerse);

    const isEndUnspecified = !bibleQuote.endChapter && !bibleQuote.endVerse;
    const isStartSameAsEnd = bibleQuote.startChapter === bibleQuote.endChapter && bibleQuote.startVerse === bibleQuote.endVerse;

    if (isEndUnspecified || isStartSameAsEnd) return `${startLabel}`

    const isInSameChapter = bibleQuote.startChapter === bibleQuote.endChapter || bibleQuote.endChapter === undefined;
    const endLabel = isInSameChapter ? bibleQuote.endVerse : !bibleQuote.endVerse ? bibleQuote.endChapter : (bibleQuote.endChapter + ", " + bibleQuote.endVerse);

    return `${startLabel}${!!bibleQuote.startChapter ? "-" : ""}${endLabel}`
}

const singleBibleQuoteToString = (bibleQuote: BibleQuote, lang?: "hun" | "lat"): string => {
    const book = BibleBooksWithLabels.find(book => book.value === bibleQuote.book);
    const bookShort = (lang !== "hun" ? book?.value : book?.hunShort) || "";
    if (!bibleQuote.startChapter && !bibleQuote.startVerse) return "";

    return `${bookShort} ${bibleVersesToString(bibleQuote)}`
}

const multipleBibleQuotesToString = (bibleQuotes: BibleQuote[], lang?: "hun" | "lat"): string => {
    return bibleQuotes
        .map((bibleQuote, i) => {

            if (!bibleQuote.startChapter && !bibleQuote.startVerse) return "";
            if (i === 0) return singleBibleQuoteToString(bibleQuote, lang);

            const isPreviousInSameBook = bibleQuotes[i - 1].book === bibleQuote.book;
            const isPreviousSingleChapter = bibleQuotes[i - 1].endChapter === undefined || bibleQuotes[i - 1].endChapter === bibleQuotes[i - 1].startChapter;
            const isCurrentSingleChapter = bibleQuote.endChapter === undefined || bibleQuote.endChapter === bibleQuote.startChapter;
            const isPreviousInSameChapter = bibleQuotes[i - 1].startChapter === bibleQuote.startChapter && isPreviousSingleChapter && isCurrentSingleChapter;

            if (isPreviousInSameBook) {
                if (isPreviousInSameChapter) {
                    const isCurrentSingleVerse = bibleQuote.endVerse === undefined || bibleQuote.endVerse === bibleQuote.startVerse;
                    const currentVerseString = isCurrentSingleVerse ? `${bibleQuote.startVerse}` : `${bibleQuote.startVerse}-${bibleQuote.endVerse}`;
                    return `.${currentVerseString}`;
                }
                else {
                    return `; ${bibleVersesToString(bibleQuote)}`
                }
            }
            return `; ${singleBibleQuoteToString(bibleQuote, lang)}`
        })
        .join("");
}

export const bibleQuoteToString = (bibleQuote: BibleQuote | BibleQuote[], lang?: "hun" | "lat"): string => {
    if (Array.isArray(bibleQuote) && bibleQuote.length === 1) return singleBibleQuoteToString(bibleQuote[0], lang);
    if (Array.isArray(bibleQuote)) return multipleBibleQuotesToString(bibleQuote, lang);
    return singleBibleQuoteToString(bibleQuote, lang);
}