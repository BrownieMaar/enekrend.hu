import { useState } from "react";
import { LiturgyPart } from "../../../model/types/LiturgyTypes";
import { v4 as uuidv4 } from "uuid";
import { Dialogus } from "../../../model/types/RecitableTypes";
import { getPlainTextBySyllablesAccented, getStringFromTextBySyllablesAccented } from "../../../controller/recitableTools";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

const getStringContentsFromDialogContents = (content: Dialogus["contents"][number]) => {
    return { versum: getStringFromTextBySyllablesAccented(content.versus), responsum: getStringFromTextBySyllablesAccented(content.responsum)}
}

export default function DialogWizard({ submitPart, onClose, part }: { submitPart: (part: LiturgyPart) => void, onClose: () => void, part?: LiturgyPart }) {
    const [dialogs, setDialogs] = useState(
        part 
        ? (part as Dialogus).contents.map(getStringContentsFromDialogContents) 
        : [{ versum: "", responsum: "" }]
        );

    const areInputsValid = () => dialogs.every((v) => v.versum && v.responsum);

    const setDialogElement = (index: number, key: "versum" | "responsum", value: string) => {
        setDialogs([...dialogs.slice(0, index), { ...dialogs[index], [key]: value }, ...dialogs.slice(index + 1)])
    }

    const addEmptyToEnd = () => {
        setDialogs([...dialogs, { versum: "", responsum: "" }])
    }

    const deleteLast = () => {
        setDialogs(dialogs.slice(0, dialogs.length - 1))
    }


    const handleSubmitPart = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!areInputsValid()) return;
        onClose();
        submitPart({
            uniqueId: uuidv4(),
            contents: dialogs.map((v) => {
                return {
                    versus: getPlainTextBySyllablesAccented(v.versum),
                    responsum: getPlainTextBySyllablesAccented(v.responsum),
                }
            }),
            type: "dialogus",
        } as Dialogus)
    }

    return (
        <form onSubmit={handleSubmitPart}>
            <Stack spacing={4}>
                <Typography variant={"h5"}>{part ? "Edit" : "Add"} Text</Typography>
                <Stack spacing={2} divider={<Divider />}>
                {dialogs.map((_, index) => (
                    <Stack key={index} spacing={2}>
                        <TextField variant="outlined" defaultValue={dialogs[index].versum} label={`Versum ${index+1}.`} onChange={(e) => setDialogElement(index, "versum", e.target.value)} />
                        <TextField variant="outlined" defaultValue={dialogs[index].responsum} label={`Responsum ${index+1}.`} onChange={(e) => setDialogElement(index, "responsum", e.target.value)} />
                    </Stack>
                ))}
                </Stack>
                <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
                <Stack direction={"row"} spacing={2}>
                    <Button variant="outlined" onClick={deleteLast} disabled={dialogs.length === 1} startIcon={<DeleteIcon />}>Less line</Button>
                    <Button variant="outlined" onClick={addEmptyToEnd} startIcon={<PlaylistAddIcon />}>New line</Button>
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