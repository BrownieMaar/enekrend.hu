import {Cantus, CantusComponentProps, MelodyWithText,} from "../model/types/CantusTypes";
import {getCharacterWidthInPixels, KeysAsGuido,} from "./fontTools";
import {InputControl} from "./inputControl";
import {RendererTools} from "./rendererTools";
import React, {useState} from "react";
import {CantusImpl} from "./CantusImpl";


export function CantusRenderer(
        { width: parentWidthPx, sheetType = "ELTE", editable = false, fontSize = 20, maxLines, cantus, setCantus }: CantusComponentProps & {cantus: Cantus, setCantus?:  React.Dispatch<React.SetStateAction<Cantus>>}
    ): JSX.Element {
        const [stateMelody, setStateMelody] = useState([...cantus.contents.melody]);
        const [editedElement, setEditedElement] = useState<{ index: number, target: "text" | "melody" | undefined }>({ index: -1, target: undefined });

        const setCantusMelody = (value: MelodyWithText[]) => {
            if (!setCantus) {
                alert("You shouldn't be able to do this. Are you sure you haven't added an editable prop by accident somewhere?")
                return;
            }
            const newCantus: Cantus = new CantusImpl(cantus.getCantusData());
            newCantus.contents.melody = value;
            setCantus(newCantus);
        }

        const inputControl = new InputControl(stateMelody, (value) => { setStateMelody(value); setCantusMelody(value) }, editedElement, setEditedElement, cantus.uniqueId,)


        const GUIDO_FONTSIZE = fontSize * 2;
        const GUIDO_FONT = "Guido HU";
        const TEXT_FONTSIZE = fontSize;
        const TEXT_FONT = sheetType === "ELTE" ? "Book Antiqua" : "Times New Roman";


        const getLineStarting = (_elementIndex: number) => {
            return cantus.contents.clef + KeysAsGuido[cantus.contents.signatures[0].signature] + "-"
        }

        const { music, text, lineLength, lines, savedLineLengths } = cantus.contents.melody
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
                    <span key={`${cantus.uniqueId} music span before ${i}`}>{renderTools.getWhiteSpaceCharsBefore(currentInfo)}</span>,
                    isElementEdited("melody") && editable
                        ? <input
                            id={`input-melody-${cantus.uniqueId}-${i}`}
                            className="inline-input"
                            type="text"
                            key={`${cantus.uniqueId} music input for ${i}`}
                            defaultValue={currentInfo.actualMelody}
                            style={{ width: currentInfo.melodyWidth, textAlign: "center", fontSize: GUIDO_FONTSIZE, fontFamily: GUIDO_FONT }}
                            onInput={(e) => inputControl.handleInput(e, i, "melody")}
                            onBlur={(_e) => setEditedElement({ index: -1, target: undefined })}
                            onKeyDown={(e) => inputControl.handleInputKeyDown(e, i, "melody")}
                        />
                        : <span key={`${cantus.uniqueId} music span ${i}`} onDoubleClick={(e) => inputControl.handleDoubleClick(e, i, "melody")}>{currentInfo.actualMelody}</span>,
                    <span key={`${cantus.uniqueId} music span after ${i}`} onDoubleClick={(e) => inputControl.handleDoubleClick(e, i, "melody")}>{renderTools.getWhiteSpaceCharsAfter(curr.isSpaceAfter, currentInfo, nextInfo)}</span>
                ];
                const returnTextSpans = [
                    <SpacedSpan width={beforeWhiteSpaceWidth} key={`${cantus.uniqueId} text span before ${i}`} />,
                    isElementEdited("text") && editable
                        ? <input
                            id={`input-text-${cantus.uniqueId}-${i}`}
                            className="inline-input"
                            type="text"
                            key={`${cantus.uniqueId} text input for ${i}`}
                            defaultValue={curr.text}
                            style={{ width: currentInfo.textWidth, fontSize: TEXT_FONTSIZE, fontFamily: TEXT_FONT }}
                            onInput={(e) => inputControl.handleInput(e, i, "text")}
                            onBlur={(_e) => setEditedElement({ index: -1, target: undefined })}
                            onKeyDown={(e) => inputControl.handleInputKeyDown(e, i, "text")}
                        />
                        : <span key={`${cantus.uniqueId} text span ${i}`} onDoubleClick={(e) => inputControl.handleDoubleClick(e, i, "text")}>{currentInfo.isFirst ? <><em>{curr.text[0]}</em>{curr.text.slice(1)}</> : <>{curr.text}</>}</span>,
                    <SpacedSpan key={`${cantus.uniqueId} text span after ${i}`} onDoubleClick={(e) => inputControl.handleDoubleClick(e, i, "text")} width={afterWhiteSpaceWidth} >{textSeparator}</SpacedSpan>
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
                        const lineEnderSpan = <span style={{ color: "gray" }}>
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
            {lines.slice(0, maxLines).map((line, i) => {
                return <div className="line" key={`${cantus.uniqueId} line ${i + 1}`}>
                    <div className="music" style={{ fontSize: fontSize * 2 }}>{line.music}</div>
                    <div className="musictext" style={{ fontSize: fontSize }}>{line.text}</div>
                </div>
            })}
        </div>
    }

function SpacedSpan({ width, children, id, onDoubleClick }: { width?: number, children?: JSX.Element | string | string[], id?: string, onDoubleClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void }) {
    return <span onDoubleClick={onDoubleClick} style={{ display: "inline-block", width: width }} id={id} >{children ?? ""}</span>
}
