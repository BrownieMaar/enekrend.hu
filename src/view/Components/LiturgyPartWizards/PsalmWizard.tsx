import { Stack, Typography, Divider, TextField, Tooltip, IconButton, Button, Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getPlainTBSA, getStringFromTBSA } from "../../../controller/recitableTools";
import { LiturgyPart } from "../../../model/types/LiturgyTypes";
import { Dialogus, Psalmus } from "../../../model/types/RecitableTypes";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import SaveIcon from '@mui/icons-material/Save';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';

const getStringContentsFromPsalmContents = (content: Psalmus["contents"][number]) => {
    return { flexa: content.flexa ? getStringFromTBSA(content.flexa) : undefined, mediatio: getStringFromTBSA(content.mediatio), terminatio: getStringFromTBSA(content.terminatio) }
}

type stringPsalmLines = { flexa?: string, mediatio: string, terminatio: string }[];

const TextareaWizardBody = ({ psalmLines, setPsalmLines }: { psalmLines: stringPsalmLines, setPsalmLines: React.Dispatch<React.SetStateAction<stringPsalmLines>> }) => {
    const [errorMessage, setErrorMessage] = useState("");

    const getTextareaString = () => psalmLines.reduce((acc, cur) => {
        if (cur.flexa) return acc + `\n\n${cur.flexa}\n${cur.mediatio}\n${cur.terminatio}`;
        return acc + `\n\n${cur.mediatio}\n${cur.terminatio}`;
    }, "").trim();

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const versi = e.target.value
            .trim()
            .split("\n\n")
            .map((v) => {
                const lines = v.split("\n");
                if (lines.length === 1) {
                    setErrorMessage("Each verse must have at least two lines.")
                }
                if (lines.length === 2) return { mediatio: lines[0], terminatio: lines[1] } as { flexa?: string, mediatio: string, terminatio: string };
                if (lines.length === 3) return { flexa: lines[0], mediatio: lines[1], terminatio: lines[2] } as { flexa?: string, mediatio: string, terminatio: string };
                setErrorMessage("Each verse must have at most three lines.")
                return undefined;
            })
        if (versi.every(v => v !== undefined)) setErrorMessage("");

        setPsalmLines(versi.filter(v => v !== undefined) as stringPsalmLines);
    }

    return <Stack spacing={2}>
        <Stack spacing={2} divider={<Divider flexItem orientation="vertical" />} direction={"row"}>
            <textarea defaultValue={getTextareaString()} name="input psalms" key="textarea for inputting psalms" onChange={handleTextareaChange} rows={20} style={{ resize: "none", width: "100%", flexBasis: 0, flexGrow: 1 }} />
            <div style={{ flexBasis: 0, flexGrow: 1, fontFamily: "Times New Roman, serif" }}>
                {psalmLines.map((verse, index) => (
                    <div key={`psalmLine ${index}`}>
                        {verse.flexa && <div>{verse.flexa} †</div>}
                        <div>{verse.mediatio} *</div>
                        <div>{verse.terminatio}</div>
                    </div>
                ))}
            </div>
        </Stack>
        <Typography variant={"body2"} sx={{ color: "red" }}>{errorMessage}</Typography>
    </Stack>
}


export default function PsalmWizard({ submitPart, onClose, part }: { submitPart: (part: LiturgyPart) => void, onClose: () => void, part?: LiturgyPart }) {
    const [psalmLines, setPsalmLines] = useState<stringPsalmLines>(
        part
            ? (part as Psalmus).contents.map(getStringContentsFromPsalmContents)
            : [{ flexa: undefined, mediatio: "", terminatio: "" }]
    );
    const [inputMode, setInputMode] = useState<"mui" | "textarea">("mui");

    const areInputsValid = () => psalmLines.every((v) => v.mediatio && v.terminatio);

    const addPsalmLineAtIndex = (index: number, key: "flexa" | "mediatio" | "terminatio", value: string | undefined) => {
        setPsalmLines([...psalmLines.slice(0, index), { ...psalmLines[index], [key]: value }, ...psalmLines.slice(index + 1)])
    }

    const addEmptyToEnd = () => {
        setPsalmLines([...psalmLines, { mediatio: "", terminatio: "" }])
    }

    const deleteLast = () => {
        setPsalmLines(psalmLines.slice(0, psalmLines.length - 1))
    }


    const handleSubmitPart = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!areInputsValid()) return;
        onClose();
        submitPart({
            uniqueId: uuidv4(),
            contents: psalmLines.map((verse) => {
                return verse.flexa ? {
                    flexa: getPlainTBSA(verse.flexa),
                    mediatio: getPlainTBSA(verse.mediatio),
                    terminatio: getPlainTBSA(verse.terminatio),
                } : {
                    mediatio: getPlainTBSA(verse.mediatio),
                    terminatio: getPlainTBSA(verse.terminatio),
                }
            }),
            type: "psalmus",
        } as Psalmus)
    }

    const MuiWizardBody = <Stack spacing={2} divider={<Divider />}>
        {psalmLines.map((_, index) => (
            <Stack key={index} spacing={2}>
                {psalmLines[index].flexa !== undefined &&
                    <Stack direction={"row"} spacing={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            defaultValue={psalmLines[index].flexa}
                            label={`Pre-Flexa ${index + 1}.`}
                            onChange={(e) => addPsalmLineAtIndex(index, "flexa", e.target.value)} />
                        <Box alignSelf={"center"}>
                            <Tooltip title="Remove preflexa part" placement="left">
                                <IconButton onClick={(_) => addPsalmLineAtIndex(index, "flexa", undefined)} size="small">
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Stack>}
                <Stack direction={"row"} spacing={2}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        defaultValue={psalmLines[index].mediatio}
                        label={`Pre-Mediatio ${index + 1}.`}
                        onChange={(e) => addPsalmLineAtIndex(index, "mediatio", e.target.value)} />
                    {psalmLines[index].flexa === undefined && <Box alignSelf={"center"}>
                        <Tooltip title="Add preflexa part" placement="left">
                            <IconButton onClick={(_) => addPsalmLineAtIndex(index, "flexa", "")} size="small">
                                <ContentCutIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>}
                </Stack>
                <TextField
                    variant="outlined"
                    defaultValue={psalmLines[index].terminatio}
                    label={`Pre-Terminatio ${index + 1}.`}
                    onChange={(e) => addPsalmLineAtIndex(index, "terminatio", e.target.value)} />
            </Stack>
        ))}
    </Stack>;


    return (
        <form onSubmit={handleSubmitPart}>
            <Stack spacing={4}>
                <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
                    <Typography variant={"h5"}>{part ? "Edit" : "Add"} Text</Typography>
                    <ToggleButtonGroup
                        value={inputMode}
                        exclusive
                        onChange={(_, value) => setInputMode(value)}
                        aria-label="muiInput or textarea"
                        size="small"
                    >
                        <ToggleButton value={"mui"} aria-label="muiInput">
                            <MenuIcon />
                        </ToggleButton>
                        <ToggleButton value={"textarea"} aria-label="muiInput">
                            <VerticalSplitIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
                {inputMode === "mui" ? MuiWizardBody : <TextareaWizardBody psalmLines={psalmLines} setPsalmLines={setPsalmLines} />}
                <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
                    <Stack >
                        <div style={{ display: inputMode === "mui" ? "flex" : "none" }}>
                            <Tooltip title="Delete last verse" placement="top">
                                <span>
                                    <IconButton onClick={deleteLast} disabled={psalmLines.length === 1}>
                                        <PlaylistRemoveIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title="Add new verse" placement="top">
                                <span>
                                    <IconButton onClick={addEmptyToEnd}>
                                        <PlaylistAddIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </div>
                    </Stack>
                    <Stack direction={"row"} spacing={2}>
                        <Button variant="contained" onClick={onClose} startIcon={<CloseIcon />}>Close</Button>
                        <Button variant="contained" type="submit" color="success" startIcon={part ? <SaveIcon /> : <AddIcon />} disabled={!areInputsValid()}>{part ? "Save" : "Add"}</Button>
                    </Stack>

                </Stack>
            </Stack>
        </form>
    )
}