import { MelodyWithText } from "../model/types/CantusTypes";


export class InputControl {
    stateMelody: MelodyWithText[];
    setStateMelody: (value: MelodyWithText[]) => void;
    editedElement: {
        index: number;
        target: "text" | "melody" | undefined;
    }
    setEditedElement: React.Dispatch<React.SetStateAction<{
        index: number;
        target: "text" | "melody" | undefined;
    }>>;
    uniqueId: string;

    constructor(
        stateMelody: MelodyWithText[],
        setStateMelody: (value: MelodyWithText[]) => void,
        editedElement: {
            index: number;
            target: "text" | "melody" | undefined;
        },
        setEditedElement: React.Dispatch<React.SetStateAction<{
            index: number;
            target: "text" | "melody" | undefined;
        }>>,
        uniqueId: string,
    ) {
        this.stateMelody = stateMelody;
        this.setStateMelody = setStateMelody;
        this.editedElement = editedElement;
        this.setEditedElement = setEditedElement;
        this.uniqueId = uniqueId;
    }

    handleMelodyUpdate = (index: number, target: "text" | "melody", value: string) => {
        const newStateMelody = [...this.stateMelody];
        newStateMelody[index][target] = value;
        this.setStateMelody(newStateMelody);
    }

    handleIsSpaceAfterUpdate = (index: number, value: boolean) => {
        const newStateMelody = [...this.stateMelody];
        newStateMelody[index].isSpaceAfter = value;
        this.setStateMelody(newStateMelody);
    }

    emptyInput = (target: "text" | "melody", index: number ) => {
        requestAnimationFrame(() => {
            const element = document.getElementById(`input-${target}-${this.uniqueId}-${index}`);
            if (element && element instanceof HTMLInputElement) {
                element.value = "";
            }
        });
    }

    gotoIndexInInput = (target: "text" | "melody", melodyIndex: number, indexToGoTo: number) => {
        requestAnimationFrame(() => {
            const element = document.getElementById(`input-${target}-${this.uniqueId}-${melodyIndex}`);
            if (element && element instanceof HTMLInputElement) {
                element.setSelectionRange(indexToGoTo, indexToGoTo);
            }
        });
    }

    addNewElementAfter = (melodyIndex: number, inputIndex: number, target: "text" | "melody", isSpaceAfter: boolean = true) => {
        const newStateMelody = [...this.stateMelody];
        const isLast = target === "text" ? inputIndex === newStateMelody[melodyIndex].text.length : inputIndex === newStateMelody[melodyIndex].melody.length;
        const isFirst = inputIndex === 0;
        const [newMelodyWithTextA, newMelodyWithTextB] = isLast ? [
            {
                melody: newStateMelody[melodyIndex].melody,
                isSpaceAfter: isSpaceAfter,
                text: newStateMelody[melodyIndex].text,
            },
            {
                melody: "",
                isSpaceAfter: newStateMelody[melodyIndex].isSpaceAfter,
                text: "",
            }
        ] : isFirst ? [
            {
                melody: "",
                isSpaceAfter: isSpaceAfter,
                text: "",
            },
            {
                melody: newStateMelody[melodyIndex].melody,
                isSpaceAfter: newStateMelody[melodyIndex].isSpaceAfter,
                text: newStateMelody[melodyIndex].text,
            }
        ] : target === "text" ? [
            {
                melody: newStateMelody[melodyIndex].melody,
                isSpaceAfter: isSpaceAfter,
                text: newStateMelody[melodyIndex].text.slice(0, inputIndex),
            },
            {
                melody: "",
                isSpaceAfter: newStateMelody[melodyIndex].isSpaceAfter,
                text: newStateMelody[melodyIndex].text.slice(inputIndex),
            }
        ] : [
            {
                melody: newStateMelody[melodyIndex].melody.slice(0, inputIndex),
                isSpaceAfter: isSpaceAfter,
                text: newStateMelody[melodyIndex].text,
            },
            {
                melody: newStateMelody[melodyIndex].melody.slice(inputIndex),
                isSpaceAfter: newStateMelody[melodyIndex].isSpaceAfter,
                text: "",
            }
        ];

        newStateMelody.splice(melodyIndex, 1, newMelodyWithTextA, newMelodyWithTextB);
        this.setStateMelody(newStateMelody);
    }

    mergeWithPrevious = (melodyIndex: number) => {
        const newStateMelody = [...this.stateMelody];
        const previousMelody = newStateMelody[melodyIndex - 1];
        const currentMelody = newStateMelody[melodyIndex];
        newStateMelody.splice(melodyIndex - 1, 2, {
            melody: previousMelody.melody + currentMelody.melody,
            isSpaceAfter: currentMelody.isSpaceAfter,
            text: previousMelody.text + currentMelody.text,
        });
        this.setStateMelody(newStateMelody);
    }

    deleteCurrentElement = (index: number) => {
        const newStateMelody = [...this.stateMelody];
        if (newStateMelody.length === 1) {
            newStateMelody[0].melody = "";
            newStateMelody[0].text = "";
            newStateMelody[0].isSpaceAfter = true;
            this.setStateMelody(newStateMelody);
            if (this.editedElement.target) this.emptyInput(this.editedElement.target, 0);
        } else {
            newStateMelody.splice(index, 1);
            this.setStateMelody(newStateMelody);
        }
    }

    handleInput = (e: React.FormEvent<HTMLInputElement>, index: number, target: "text" | "melody") => {
        this.handleMelodyUpdate(index, target, e.currentTarget.value);
    }

    handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, target: "text" | "melody") => {

        const indexInInput = e.currentTarget.selectionStart;
        const isLastInInput = indexInInput === e.currentTarget.value.length;
        const isFirstInInput = indexInInput === 0;

        const gotoNextIfAvailable = (selectAll: boolean = false) => {
            if (index < this.stateMelody.length - 1) {
                this.setEditedElement({ index: index + 1, target });
                requestAnimationFrame(() => {
                    const element = document.getElementById(`input-${target}-${this.uniqueId}-${index + 1}`);
                    element?.focus();
                    if (element && element instanceof HTMLInputElement) {
                        element.selectionStart = 0;
                        if (selectAll) {
                            element.selectionEnd = element.value.length;
                        } else {
                            element.selectionEnd = 0;
                        }
                    }
                })
            }
            return index < this.stateMelody.length - 1;
        }

        const gotoPreviousIfAvailable = () => {
            if (index > 0) {
                this.setEditedElement({ index: index - 1, target });
                requestAnimationFrame(() => {
                    const element = document.getElementById(`input-${target}-${this.uniqueId}-${index - 1}`);
                    element?.focus();
                    if (element && element instanceof HTMLInputElement) {
                        element.selectionStart = element.value.length;
                    }
                })
            }
            return index > 0;
        }

        if (e.key === "Tab") {
            e.preventDefault();
            if (e.shiftKey) {
                gotoPreviousIfAvailable();
            } else {
                gotoNextIfAvailable();
            }
        }

        if (e.key === "Escape") {
            this.setEditedElement({ index: -1, target: undefined });
        }
        if (e.key === "Enter") {
            e.preventDefault()
            this.setEditedElement({ index: -1, target: undefined });
        }

        if (e.key === "Spacebar" || e.key === " ") {
            e.preventDefault();
            if ((target === "text" && this.stateMelody[index + 1]?.melody !== "" && this.stateMelody[index + 1]?.text === "") || (target === "melody" && this.stateMelody[index + 1]?.text !== "" && this.stateMelody[index + 1]?.melody === "")) {
                gotoNextIfAvailable()
            } else {
                this.addNewElementAfter(index, indexInInput ?? 0, target)
                if (!isFirstInInput || isLastInInput) gotoNextIfAvailable();
                else this.emptyInput(target, index)
            }
        }
        
        if (e.key === "-" && target === "text") {
            e.preventDefault();
            if (this.stateMelody[index + 1]?.melody !== "" && this.stateMelody[index + 1]?.text === "") {
                this.handleIsSpaceAfterUpdate(index, false)
                gotoNextIfAvailable()
            } else {
                this.addNewElementAfter(index, indexInInput ?? 0, target, false);
                if (!isFirstInInput || isLastInInput) gotoNextIfAvailable();
                else this.emptyInput(target, index)
            }
        }

        if (e.key === "Backspace" && isFirstInInput && index > 0) {
            e.preventDefault();
            const lengthOfPrevious = target === "text" ? this.stateMelody[index - 1].text.length : this.stateMelody[index - 1].melody.length;
            this.mergeWithPrevious(index);
            gotoPreviousIfAvailable();
            this.gotoIndexInInput(target, index - 1, lengthOfPrevious);
        }

        if (e.key === "ArrowLeft" && isFirstInInput) {
            gotoPreviousIfAvailable();
        }
        if (e.key === "ArrowRight" && isLastInInput) {
            gotoNextIfAvailable();
        }

        if (e.key === "ArrowDown" && target === "melody") {
            this.setEditedElement({ index: index, target: "text" });
            requestAnimationFrame(() => {
                document.getElementById(`input-text-${this.uniqueId}-${index}`)?.focus();
            })
        }

        if (e.key === "ArrowUp" && target === "text") {
            this.setEditedElement({ index: index, target: "melody" });
            requestAnimationFrame(() => {
                document.getElementById(`input-melody-${this.uniqueId}-${index}`)?.focus();
            })
        }

        if (e.ctrlKey) { // TODO: fix ability to add last element and focus it
            if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                this.handleIsSpaceAfterUpdate(index, true);
                gotoNextIfAvailable();
            }
            if (e.key === "-") {
                e.preventDefault();
                this.handleIsSpaceAfterUpdate(index, false);
                gotoNextIfAvailable();
            }
            if (e.key === "Backspace") {
                e.preventDefault();
                this.deleteCurrentElement(index);
                requestAnimationFrame(() => {
                    gotoPreviousIfAvailable()
                })
            }
        }

    }

    handleDoubleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, index: number, target: "text" | "melody") => {
        e.preventDefault();
        if (window.getSelection) {
            window.getSelection()?.removeAllRanges();
        }
        this.setEditedElement({ index, target })
        requestAnimationFrame(() => {
            document.getElementById(`input-${target}-${this.uniqueId}-${index}`)?.focus();
        })
    }
}