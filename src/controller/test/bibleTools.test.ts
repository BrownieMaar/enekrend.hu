import { describe, expect, it } from "vitest"
import { BibleErrorMessage, bibleQuoteToString, getErrorsInBibleQuote } from "../bibleTools"
import { BibleQuote } from "../../model/types/LiturgyTypes";

describe("#bibleQuoteErrors", () => {

    it("should return an error in every number field and a message describing that they are below 1", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            startChapter: 0,
            startVerse: 0,
            endChapter: 0,
            endVerse: 0,
        }
        const expected: BibleErrorMessage[] = [
            {errorIn: "startChapter", errorMessage: "Minimum value is 1."},
            {errorIn: "startVerse", errorMessage: "Minimum value is 1."},
            {errorIn: "endChapter", errorMessage: "Minimum value is 1."},
            {errorIn: "endVerse", errorMessage: "Minimum value is 1."},
        ]
        expect(getErrorsInBibleQuote(bibleQuote)).toEqual(expect.arrayContaining(expected))
    });

    it ("should return an error in endChapter and a message describing that it is smaller than startChapter", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            startChapter: 2,
            endChapter: 1,
        }
        const expected: BibleErrorMessage[] = [
            {errorIn: "endChapter", errorMessage: "Cannot be smaller than start chapter."}
        ]
        expect(getErrorsInBibleQuote(bibleQuote)).toEqual(expect.arrayContaining(expected))
    });

    it ("should return an error in endVerse and a message describing that it is smaller than startVerse", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            startChapter: 2,
            startVerse: 2,
            endChapter: 2,
            endVerse: 1,
        }
        const expected: BibleErrorMessage[] = [
            {errorIn: "endVerse", errorMessage: "Cannot be smaller than start verse."}
        ]
        expect(getErrorsInBibleQuote(bibleQuote)).toEqual(expect.arrayContaining(expected))
    });

    it ("should return an error in startChapter and a message describing that it must be specified if startVerse is specified", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            startVerse: 2,
        }
        const expected: BibleErrorMessage[] = [
            {errorIn: "startChapter", errorMessage: "Must be specified if start verse is specified."}
        ]
        expect(getErrorsInBibleQuote(bibleQuote)).toEqual(expect.arrayContaining(expected))
    });

    it ("should return an error in startChapter and a message describing that it must be specified if endChapter is specified", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            endChapter: 2,
        }
        const expected: BibleErrorMessage[] = [
            {errorIn: "startChapter", errorMessage: "Must be specified if end chapter is specified."}
        ]
        expect(getErrorsInBibleQuote(bibleQuote)).toEqual(expect.arrayContaining(expected))
    });

    it ("should return an error in startChapter and a message describing that it must be specified if endVerse is specified", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            endVerse: 2,
        }
        const expected: BibleErrorMessage[] = [
            {errorIn: "startChapter", errorMessage: "Must be specified if end verse is specified."}
        ]
        expect(getErrorsInBibleQuote(bibleQuote)).toEqual(expect.arrayContaining(expected))
    });

    it ("should return an error in startVerse and a message describing that it must be specified if endVerse is specified", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            endVerse: 2,
        }
        const expected: BibleErrorMessage[] = [
            {errorIn: "startChapter", errorMessage: "Must be specified if end verse is specified."}
        ]
        expect(getErrorsInBibleQuote(bibleQuote)).toEqual(expect.arrayContaining(expected))
    });

    it ("should return an error in endChapter and a message describing that it must be specified if endVerse is specified", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            endVerse: 2,
        }
        const expected: BibleErrorMessage[] = [
            {errorIn: "startChapter", errorMessage: "Must be specified if end verse is specified."}
        ]
        expect(getErrorsInBibleQuote(bibleQuote)).toEqual(expect.arrayContaining(expected))
    });

    it("should return errors for startChapter and endChapter if startChapter and endChapter are not specified and endVerse is", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            endVerse: 2,
        }
        const expected: BibleErrorMessage[] = [
            {errorIn: "startChapter", errorMessage: "Must be specified if end verse is specified."},
            {errorIn: "endChapter", errorMessage: "Must be specified if end verse is specified."},
        ]
        expect(getErrorsInBibleQuote(bibleQuote)).toEqual(expect.arrayContaining(expected))
    });

    //test for when no errors are in the bibleQuote
    it("should return an empty array if no errors are in the bibleQuote", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            startChapter: 1,
            startVerse: 1,
        }
        const expected: BibleErrorMessage[] = []
        expect(getErrorsInBibleQuote(bibleQuote)).toEqual(expect.arrayContaining(expected))
    });

    //test for when no bibleQuote is passed
    it("should return an empty array if no bibleQuote is passed", () => {
        const bibleQuote: BibleQuote = {}
        const expected: BibleErrorMessage[] = []
        expect(getErrorsInBibleQuote(bibleQuote)).toEqual(expect.arrayContaining(expected))
    });


});

describe("#emptyBibleQuote", () => {
    it("should return an empty string if no bibleQuote is passed", () => {
        const bibleQuote: BibleQuote = {}
        const expected = ""
        expect(bibleQuoteToString(bibleQuote)).toBe(expected)
    });
})

describe("#bibleStringFromSingleQuote", () => {
    it("should return only a verse if no end is passed", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            startChapter: 1,
            startVerse: 1,
        }
        const expected = "Gen 1, 1"
        expect(bibleQuoteToString(bibleQuote)).toBe(expected)
    });

    it("should return only a verse if end is same as start", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            startChapter: 1,
            startVerse: 1,
            endChapter: 1,
            endVerse: 1,
        }
        const expected = "Gen 1, 1"
        expect(bibleQuoteToString(bibleQuote)).toBe(expected)
    });

    it("should return a range of verses if end is in same chapter", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            startChapter: 1,
            startVerse: 1,
            endChapter: 1,
            endVerse: 2,
        }
        const expected = "Gen 1, 1-2"
        expect(bibleQuoteToString(bibleQuote)).toBe(expected)
    });

    //test for when the end is not in the same chapter
    it("should return a range of verses if end is in different chapter", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            startChapter: 1,
            startVerse: 1,
            endChapter: 2,
            endVerse: 5,
        }
        const expected = "Gen 1, 1-2, 5"
        expect(bibleQuoteToString(bibleQuote)).toBe(expected)
    });
})

describe("#bibleStringFromMultipleQuotes", () => {
    //test for when multiple biblequotes are passed form the same chapter
    it("should return multiple verses when single verse quotes are in same chapter", () => {
        const bibleQuoteWithTwoVerses: BibleQuote[] = [{
            book: "Gen",
            startChapter: 1,
            startVerse: 1,
        },
        {
            book: "Gen",
            startChapter: 1,
            startVerse: 6,
        }]
        const expectedWithTwoVerses = "Gen 1, 1.6"
        expect(bibleQuoteToString(bibleQuoteWithTwoVerses)).toBe(expectedWithTwoVerses)
        
        const bibleQuoteWithThreeVerses: BibleQuote[] = [...bibleQuoteWithTwoVerses, {
            book: "Gen",
            startChapter: 1,
            startVerse: 2,
        }]
        const expectedWithThreeVerses = "Gen 1, 1.6.2"
        expect(bibleQuoteToString(bibleQuoteWithThreeVerses)).toBe(expectedWithThreeVerses)
    })

    //test for when multiple biblequotes are passed form the same chapter, single verse and multiple verse quotes
    it("should return multiple verses when single and multiple verse quotes are in same chapter", () => {
        const bibleQuoteWithTwoVerses: BibleQuote[] = [{
            book: "Gen",
            startChapter: 1,
            startVerse: 1,
        },
        {
            book: "Gen",
            startChapter: 1,
            startVerse: 6,
            endVerse: 7,
        }]
        const expectedWithTwoVerses = "Gen 1, 1.6-7"
        expect(bibleQuoteToString(bibleQuoteWithTwoVerses)).toBe(expectedWithTwoVerses)
        
        const bibleQuoteWithThreeVerses: BibleQuote[] = [...bibleQuoteWithTwoVerses, {
            book: "Gen",
            startChapter: 1,
            startVerse: 2,
        }]
        const expectedWithThreeVerses = "Gen 1, 1.6-7.2"
        expect(bibleQuoteToString(bibleQuoteWithThreeVerses)).toBe(expectedWithThreeVerses)
    });

    //tests for when multiple biblequotes are passed form the same book, but different chapters
    it("should return multiple verses when single verse quotes are in different chapters", () => {
        const bibleQuoteWithTwoVerses: BibleQuote[] = [{
            book: "Gen",
            startChapter: 1,
            startVerse: 1,
        },
        {
            book: "Gen",
            startChapter: 2,
            startVerse: 6,
        }]
        const expectedWithTwoVerses = "Gen 1, 1; 2, 6"
        expect(bibleQuoteToString(bibleQuoteWithTwoVerses)).toBe(expectedWithTwoVerses)
    });

    it("should return multiple verses when single and multiple verse quotes are in different chapters", () => {
        const bibleQuoteWithTwoVerses: BibleQuote[] = [{
            book: "Gen",
            startChapter: 1,
            startVerse: 1,
        },
        {
            book: "Gen",
            startChapter: 2,
            startVerse: 6,
            endVerse: 7,
        }]
        const expectedWithTwoVerses = "Gen 1, 1; 2, 6-7"
        expect(bibleQuoteToString(bibleQuoteWithTwoVerses)).toBe(expectedWithTwoVerses)
    });

    it("should return multiple verses when single and multiple verse and chapter quotes are in different chapters", () => {
        const bibleQuoteWithTwoVerses: BibleQuote[] = [{
            book: "Gen",
            startChapter: 1,
            startVerse: 25,
        },
        {
            book: "Gen",
            startChapter: 2,
            startVerse: 1,
            endChapter: 3,
            endVerse: 5,
        }]
        const expectedWithTwoVerses = "Gen 1, 25; 2, 1-3, 5"
        expect(bibleQuoteToString(bibleQuoteWithTwoVerses)).toBe(expectedWithTwoVerses)
    });

    //tests for when different bibleQuotes are in different books
    it("should return multiple verses when quotes are in different books", () => {
        const bibleQuoteWithTwoVerses: BibleQuote[] = [{
            book: "Gen",
            startChapter: 1,
            startVerse: 25,
        },
        {
            book: "Exod",
            startChapter: 2,
            startVerse: 1,
            endChapter: 3,
            endVerse: 5,
        }]
        const expectedWithTwoVerses = "Gen 1, 25; Exod 2, 1-3, 5"
        expect(bibleQuoteToString(bibleQuoteWithTwoVerses)).toBe(expectedWithTwoVerses)
    });

})

describe("#bibleQuoteDataTypes", () => {
    //test for when one biblequote is in an array
    it("should return a string for one bibleQuote if array only has one element", () => {
        const bibleQuote: BibleQuote[] = [{
            book: "Gen",
            startChapter: 1,
            startVerse: 1,
        }]
        const expected = "Gen 1, 1"
        expect(bibleQuoteToString(bibleQuote)).toBe(expected)
    });

    //test for when only one bibleQuote is passed
    it("should return a string for one bibleQuote if no array, just a BibleQuote is passed", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            startChapter: 1,
            startVerse: 1,
        }
        const expected = "Gen 1, 1"
        expect(bibleQuoteToString(bibleQuote)).toBe(expected)
    });   

});
