import { Cantus, CantusComponentProps, CantusData, Clef, KeySignature, MelodyWithText, Tone, } from "../model/types/CantusTypes";
import { KeysAsGuido, getCharacterWidthInPixels, getKeyFromString, } from "./fontTools";
import { InputControl } from "./inputControl";
import { RendererTools } from "./rendererTools";
import { useState } from "react";


export class CantusImpl implements Cantus {
    cantusId?: string | undefined;
    uniqueId?: string | undefined;
    codexSourceId?: string | undefined;
    contents: { signatures: { signature: KeySignature; position: number; }[]; melody: MelodyWithText[]; clef: Clef };
    genre?: string | undefined;
    tone?: Tone | undefined;

    constructor(sourceData?: MelodyWithText[] | CantusData) {
        if (sourceData) {
            if (Array.isArray(sourceData)) {
                this.contents = {
                    signatures: [{ signature: getKeyFromString(sourceData[0].melody.substring(1)), position: 0 }],
                    melody: sourceData.slice(1),
                    clef: sourceData[0].melody[0] as Clef
                };
            } else {
                this.cantusId = sourceData.cantusId;
                this.uniqueId = sourceData.uniqueId;
                this.codexSourceId = sourceData.codexSourceId;
                this.genre = sourceData.genre;
                this.tone = sourceData.tone;
                this.contents = sourceData.contents;
            }
        } else {
            this.contents = {
                signatures: [],
                melody: [],
                clef: "M"
            };
        }
    }

    getCantusData(): CantusData {
        return {
            cantusId: this.cantusId,
            uniqueId: this.uniqueId,
            codexSourceId: this.codexSourceId,
            contents: this.contents,
            genre: this.genre,
            tone: this.tone
        };
    }


    getText(): string {
        return this.contents.melody.map(melodyWithText => melodyWithText.text + (melodyWithText.isSpaceAfter ? " " : "")).join("");
    }

    getIncipit(): string {
        return this.getText().split(" ").slice(0, 3).join(" ")
    }

    getMusicScript(): string {
        throw new Error("Method not implemented.");
    }

    Component({ width: parentWidthPx, sheetType = "ELTE", editable = false, fontSize = 20 }: CantusComponentProps): JSX.Element {
        const [stateMelody, setStateMelody] = useState([...this.contents.melody]);
        const [editedElement, setEditedElement] = useState<{ index: number, target: "text" | "melody" | undefined }>({ index: -1, target: undefined });

        

        const inputControl = new InputControl(stateMelody, (value) => {setStateMelody(value); this.contents.melody = value;}, editedElement, setEditedElement, this.getIncipit(),)


        const GUIDO_FONTSIZE = 40;
        const GUIDO_FONT = "Guido HU";
        const TEXT_FONTSIZE = 20;
        const TEXT_FONT = sheetType === "ELTE" ? "Book Antiqua" : "Times New Roman";


        const getLineStarting = (_elementIndex: number) => {
            return this.contents.clef + KeysAsGuido[this.contents.signatures[0].signature] + "-"
        }

        const { music, text, lineLength, lines, savedLineLengths } = this.contents.melody
            .reduce((acc: {
                music: JSX.Element[];
                text: JSX.Element[];
                leftOverPx: number;
                lineLength: number;
                lines: {
                    music: JSX.Element[];
                    text: JSX.Element[];
                }[];
                savedLineLengths: number[];
            }, curr, i) => {

                const returnObj = { ...acc };
                const isLast = i === stateMelody.length - 1;
                const next = isLast ? undefined : stateMelody[i + 1];

                // additional spacing if previous element was off spaced
                // due to anything, currently only due to a separatorlessness
                let leftOverPx = 0;

                const DEFAULT_WHITESPACE_BEFORE = "--"
                const DEFAULT_WHITESPACE_AFTER = "-"
                const SPACER_CHARACTER = "¨"

                const renderTools = new RendererTools(getLineStarting(0), GUIDO_FONTSIZE, GUIDO_FONT, TEXT_FONT, TEXT_FONTSIZE, DEFAULT_WHITESPACE_BEFORE, DEFAULT_WHITESPACE_AFTER, SPACER_CHARACTER)

                const currentInfo = renderTools.getInfoToCalculatePosition(curr, i);
                const nextInfo = !next ? undefined : renderTools.getInfoToCalculatePosition(next, i + 1);

                const beforeWhiteSpaceWidth = currentInfo.isFirst
                    ? currentInfo.isTextLongerThanMelody
                        ? getCharacterWidthInPixels(getLineStarting(0), GUIDO_FONT, GUIDO_FONTSIZE) > currentInfo.differenceInLengthOnSides
                            ? getCharacterWidthInPixels(getLineStarting(0), GUIDO_FONT, GUIDO_FONTSIZE) - currentInfo.differenceInLengthOnSides
                            : 0
                        : getCharacterWidthInPixels(getLineStarting(0), GUIDO_FONT, GUIDO_FONTSIZE)
                    : 0

                let afterWhiteSpaceWidth = acc.leftOverPx + (
                    !nextInfo ? 0 : nextInfo.isTextLongerThanMelody
                        ? getCharacterWidthInPixels(
                            renderTools.getWhiteSpaceCharsAfter(curr.isSpaceAfter, currentInfo, nextInfo) + renderTools.getWhiteSpaceCharsBefore(nextInfo),
                            GUIDO_FONT,
                            GUIDO_FONTSIZE
                        ) - currentInfo.differenceInLengthOnSides - nextInfo.differenceInLengthOnSides
                        : getCharacterWidthInPixels(
                            renderTools.getWhiteSpaceCharsAfter(curr.isSpaceAfter, currentInfo, nextInfo) + renderTools.getWhiteSpaceCharsBefore(nextInfo),
                            GUIDO_FONT,
                            GUIDO_FONTSIZE
                        ) - currentInfo.differenceInLengthOnSides
                )

                const textSeparator = curr.isSpaceAfter
                    ? " "
                    : afterWhiteSpaceWidth > getCharacterWidthInPixels("-", TEXT_FONT, TEXT_FONTSIZE)
                        ? "-"
                        : ""
                if (textSeparator === "") {
                    leftOverPx = afterWhiteSpaceWidth;
                    afterWhiteSpaceWidth = 0;
                }

                const isElementEdited = (target: "text" | "melody") => editedElement.index === i && editedElement.target === target;



                const returnMusic = [
                    <span key={`${this.getIncipit()} music span before ${i}`}>{renderTools.getWhiteSpaceCharsBefore(currentInfo)}</span>,
                    isElementEdited("melody") && editable
                        ? <input
                            id={`input-melody-${this.getIncipit()}-${i}`}
                            className="music inline-input"
                            type="text"
                            key={`${this.getIncipit()} music input for ${i}`}
                            defaultValue={currentInfo.actualMelody}
                            style={{ width: currentInfo.melodyWidth, textAlign: "center" }}
                            onInput={(e) => inputControl.handleInput(e, i, "melody")}
                            onBlur={(_e) => setEditedElement({ index: -1, target: undefined })}
                            onKeyDown={(e) => inputControl.handleInputKeyDown(e, i, "melody")}
                        />
                        : <span key={`${this.getIncipit()} music span ${i}`} onDoubleClick={(e) => inputControl.handleDoubleClick(e, i, "melody")}>{currentInfo.actualMelody}</span>,
                    <span key={`${this.getIncipit()} music span after ${i}`} onDoubleClick={(e) => inputControl.handleDoubleClick(e, i, "melody")}>{renderTools.getWhiteSpaceCharsAfter(curr.isSpaceAfter, currentInfo, nextInfo)}</span>
                ];
                const returnTextSpans = [
                    <SpacedSpan width={beforeWhiteSpaceWidth} key={`${this.getIncipit()} text span before ${i}`} />,
                    isElementEdited("text") && editable
                        ? <input
                            id={`input-text-${this.getIncipit()}-${i}`}
                            className="musictext inline-input"
                            type="text"
                            key={`${this.getIncipit()} text input for ${i}`}
                            defaultValue={curr.text}
                            style={{ width: currentInfo.textWidth }}
                            onInput={(e) => inputControl.handleInput(e, i, "text")}
                            onBlur={(_e) => setEditedElement({ index: -1, target: undefined })}
                            onKeyDown={(e) => inputControl.handleInputKeyDown(e, i, "text")}
                        />
                        : <span key={`${this.getIncipit()} text span ${i}`} onDoubleClick={(e) => inputControl.handleDoubleClick(e, i, "text")}>{currentInfo.isFirst ? <><em>{curr.text[0]}</em>{curr.text.slice(1)}</> :  <>{curr.text}</> }</span>,
                    <SpacedSpan key={`${this.getIncipit()} text span after ${i}`} onDoubleClick={(e) => inputControl.handleDoubleClick(e, i, "text")} width={afterWhiteSpaceWidth} >{textSeparator}</SpacedSpan>
                ];

                const currentMusicWidth = getCharacterWidthInPixels(renderTools.getWhiteSpaceCharsBefore(currentInfo) + currentInfo.actualMelody + renderTools.getWhiteSpaceCharsAfter(curr.isSpaceAfter, currentInfo, nextInfo), GUIDO_FONT, GUIDO_FONTSIZE)
                const currentTextWidth = beforeWhiteSpaceWidth + getCharacterWidthInPixels(curr.text, TEXT_FONT, TEXT_FONTSIZE) + afterWhiteSpaceWidth; // FIXME: check if text has overflown


                const wouldThisLineBeTooLong = currentMusicWidth + acc.lineLength > parentWidthPx;


                if (wouldThisLineBeTooLong || isLast) {
                    const widthToLineEnd = Math.abs(parentWidthPx - acc.lineLength);

                    const getLineStarterElements = () => {
                        return {
                            music: [<span>{getLineStarting(0)}</span>, ...returnMusic.slice(1)],
                            text: [
                                <SpacedSpan
                                    width={
                                        getCharacterWidthInPixels(getLineStarting(0) + renderTools.getWhiteSpaceCharsBefore({ ...currentInfo, isFirst: true }), GUIDO_FONT, GUIDO_FONTSIZE)
                                        - (currentInfo.isTextLongerThanMelody ? currentInfo.differenceInLengthOnSides : 0)
                                    } />,
                                ...returnTextSpans
                            ],
                            leftOverPx: leftOverPx,
                            lineLength: getCharacterWidthInPixels(
                                getLineStarting(0), GUIDO_FONT, GUIDO_FONTSIZE)
                                + getCharacterWidthInPixels(currentInfo.actualMelody + renderTools.getWhiteSpaceCharsAfter(curr.isSpaceAfter, currentInfo, nextInfo), GUIDO_FONT, GUIDO_FONTSIZE
                                ),
                        }
                    }

                    if (!isLast || (isLast && wouldThisLineBeTooLong)) {
                        const spacerCharacterWidth = getCharacterWidthInPixels("¨", GUIDO_FONT, GUIDO_FONTSIZE);
                        // TODO: remove inline style & add global component option to opt out of this
                        const lineEnderSpan = <span className="music" style={{ color: "gray" }}>
                            {"¨".repeat(Math.floor(widthToLineEnd / spacerCharacterWidth))}
                        </span>
                        acc.music.push(lineEnderSpan)
                    }

                    if (isLast && wouldThisLineBeTooLong) {
                        acc.lines = [...acc.lines, {
                            music: [...acc.music],
                            text: [...acc.text],
                        }]
                        acc.savedLineLengths.push(acc.lineLength)
                        acc.music = getLineStarterElements().music
                        acc.text = getLineStarterElements().text
                        acc.lineLength = getLineStarterElements().lineLength
                    }

                    if (isLast && !wouldThisLineBeTooLong) {
                        acc.music.push(...returnMusic)
                        acc.text.push(...returnTextSpans)
                        acc.lineLength += currentMusicWidth
                    }

                    return {
                        ...getLineStarterElements(),
                        lines: [...acc.lines, {
                            music: [...acc.music],
                            text: [...acc.text],
                        }],
                        savedLineLengths: [...acc.savedLineLengths, acc.lineLength]
                    }
                }


                returnObj.lineLength += currentMusicWidth
                returnObj.music = [...acc.music, ...returnMusic]
                returnObj.text = [...acc.text, ...returnTextSpans]
                returnObj.leftOverPx = leftOverPx

                return returnObj
            }, {
                music: [<span>{getLineStarting(0)}</span>],
                text: [],
                leftOverPx: 0,
                lineLength: getCharacterWidthInPixels(getLineStarting(0), GUIDO_FONT, GUIDO_FONTSIZE),
                lines: [],
                savedLineLengths: [], // TODO: remove development variables
            })


        return <div style={{ overflow: "hidden" }} >
            {lines.map((line, i) => {
                return <div className="line" key={`${this.getIncipit()} line ${i + 1}`}>
                    <div className="music">{line.music}</div>
                    <div className="musictext">{line.text}</div>
                </div>
            })}
        </div>
    }
}

function SpacedSpan({ width, children, id, onDoubleClick }: { width?: number, children?: JSX.Element | string | string[], id?: string, onDoubleClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void }) {
    return <span onDoubleClick={onDoubleClick} className="musictext" id={id} style={(width !== undefined ? { width: width + "px" } : undefined)}>{children ?? ""}</span>
}
