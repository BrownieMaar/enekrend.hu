import { MelodyWithText } from "../model/types/CantusTypes";


export class InputControl {
    stateMelody: MelodyWithText[];
    setStateMelody: React.Dispatch<React.SetStateAction<MelodyWithText[]>>;
    editedElement: {
        index: number;
        target: "text" | "melody" | undefined;
    }
    setEditedElement: React.Dispatch<React.SetStateAction<{
        index: number;
        target: "text" | "melody" | undefined;
    }>>;
    incipit: string;

    constructor(
        stateMelody: MelodyWithText[],
        setStateMelody: React.Dispatch<React.SetStateAction<MelodyWithText[]>>,
        editedElement: {
            index: number;
            target: "text" | "melody" | undefined;
        },
        setEditedElement: React.Dispatch<React.SetStateAction<{
            index: number;
            target: "text" | "melody" | undefined;
        }>>,
        incipit: string,
    ) {
        this.stateMelody = stateMelody;
        this.setStateMelody = setStateMelody;
        this.editedElement = editedElement;
        this.setEditedElement = setEditedElement;
        this.incipit = incipit;
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

    addNewElementAfter = (index: number, isSpaceAfter: boolean = true) => {
        const newStateMelody = [...this.stateMelody];
        newStateMelody.splice(index + 1, 0, {
            melody: "",
            isSpaceAfter: isSpaceAfter,
            text: "",
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
        } else {
            newStateMelody.splice(index, 1);
            this.setStateMelody(newStateMelody);
        }
    }

    handleInput = (e: React.FormEvent<HTMLInputElement>, index: number, target: "text" | "melody") => {
        this.handleMelodyUpdate(index, target, e.currentTarget.value);
    }

    handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, target: "text" | "melody") => {

        const isLastInInput = e.currentTarget.selectionStart === e.currentTarget.value.length;
        const isFirstInInput = e.currentTarget.selectionStart === 0;

        const gotoNextIfAvailable = (selectAll: boolean = false) => {
            if (index < this.stateMelody.length - 1) {
                this.setEditedElement({ index: index + 1, target });
                requestAnimationFrame(() => {
                    const element = document.getElementById(`input-${target}-${this.incipit}-${index + 1}`);
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
                    const element = document.getElementById(`input-${target}-${this.incipit}-${index - 1}`);
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

        if (e.key === "Spacebar" || e.key === " " && isLastInInput) {
            e.preventDefault();
            if (target === "text") {
                this.handleIsSpaceAfterUpdate(index, true);
            }
            gotoNextIfAvailable(true);
        }

        if (e.key === "-" && target === "text" && isLastInInput) {
            e.preventDefault();
            this.handleIsSpaceAfterUpdate(index, false);
            gotoNextIfAvailable(true);
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
                document.getElementById(`input-text-${this.incipit}-${index}`)?.focus();
            })
        }

        if (e.key === "ArrowUp" && target === "text") {
            this.setEditedElement({ index: index, target: "melody" });
            requestAnimationFrame(() => {
                document.getElementById(`input-melody-${this.incipit}-${index}`)?.focus();
            })
        }

        if (e.ctrlKey || (index === this.stateMelody.length - 2 && isLastInInput)) { // TODO: fix ability to add last element and focus it
            if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                this.addNewElementAfter(index);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        document.getElementById(`input-melody-${this.incipit}-${index + 1}`)?.focus();
                    })
                });
            }
            if (e.key === "-") {
                e.preventDefault();
                this.addNewElementAfter(index, target === "text");
                requestAnimationFrame(() => {
                    gotoNextIfAvailable();
                })
            }
        }
        if (e.key === "Backspace" && e.ctrlKey) {
            e.preventDefault();
            this.deleteCurrentElement(index);
            requestAnimationFrame(() => {
                gotoPreviousIfAvailable()
            })

        }

    }

    handleDoubleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, index: number, target: "text" | "melody") => {
        e.preventDefault();
        if (window.getSelection) {
            window.getSelection()?.removeAllRanges();
        }
        this.setEditedElement({ index, target })
        requestAnimationFrame(() => {
            document.getElementById(`input-${target}-${this.incipit}-${index}`)?.focus();
        })
    }
}