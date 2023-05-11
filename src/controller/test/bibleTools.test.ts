import { describe, expect, it } from "vitest"
import { BibleQuote } from "../../model/types/CantusTypes"
import { bibleQuoteToString } from "../bibleTools"

describe("#bibleString", () => {
    it("should return only a verse if no end is passed", () => {
        const bibleQuote: BibleQuote = {
            book: "Gen",
            startChapter: 1,
            startVerse: 1,
        }
        const expected = "Gen 1,1"
        expect(bibleQuoteToString(bibleQuote)).toBe(expected)
    });
})
