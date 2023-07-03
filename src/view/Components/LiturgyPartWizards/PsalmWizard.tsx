import { Stack, Typography, Divider, TextField, Tooltip, IconButton, Button, Box } from "@mui/material";
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

const getStringContentsFromPsalmContents = (content: Psalmus["contents"][number]) => {
    // return { versum: getStringFromTBSA(content.versus), responsum: getStringFromTBSA(content.responsum) }
    return { flexa: content.flexa ? getStringFromTBSA(content.flexa) : undefined, mediatio: getStringFromTBSA(content.mediatio), terminatio: getStringFromTBSA(content.terminatio) }
}

export default function PsalmWizard({ submitPart, onClose, part }: { submitPart: (part: LiturgyPart) => void, onClose: () => void, part?: LiturgyPart }) {
    const [psalmLines, setPsalmLines] = useState<{ flexa?: string, mediatio: string, terminatio: string }[]>(
        part
            ? (part as Psalmus).contents.map(getStringContentsFromPsalmContents)
            : [{ flexa: undefined, mediatio: "", terminatio: "" }]
    );

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

    return (
        <form onSubmit={handleSubmitPart}>
            <Stack spacing={4}>
                <Typography variant={"h5"}>{part ? "Edit" : "Add"} Text</Typography>
                <Stack spacing={2} divider={<Divider />}>
                    {psalmLines.map((_, index) => (
                        <Stack key={index} spacing={2}>
                            {psalmLines[index].flexa !== undefined &&
                                <Stack direction={"row"} spacing={2}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        defaultValue={psalmLines[index].flexa}
                                        label={`Pre-Flexa ${index + 1}.`}
                                        onChange={(e) => addPsalmLineAtIndex(index, "flexa", e.target.value)}
                                    />
                                    <Box alignSelf={"center"}>
                                        <Tooltip title="Remove preflexa part" placement="left">
                                            <IconButton onClick={(_) => addPsalmLineAtIndex(index, "flexa", undefined)} size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Stack>
                            }
                            <Stack direction={"row"} spacing={2}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    defaultValue={psalmLines[index].mediatio}
                                    label={`Pre-Mediatio ${index + 1}.`}
                                    onChange={(e) => addPsalmLineAtIndex(index, "mediatio", e.target.value)}
                                />
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
                                onChange={(e) => addPsalmLineAtIndex(index, "terminatio", e.target.value)}
                            />
                        </Stack>
                    ))}
                </Stack>
                <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
                    <Stack direction={"row"} spacing={2}>
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