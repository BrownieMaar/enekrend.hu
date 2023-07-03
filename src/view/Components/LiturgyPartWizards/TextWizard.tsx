import { useState } from "react";
import { Genre, GenreOptionsWithLabels, LiturgyPart } from "../../../model/types/LiturgyTypes";
import { getPlainTBSA, getStringFromTBSA } from "../../../controller/recitableTools";
import { RecitableText } from "../../../model/types/RecitableTypes";
import { v4 as uuidv4 } from "uuid";
import { Autocomplete, Button, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

export default function TextWizard({ submitPart, onClose, part }: { submitPart: (part: LiturgyPart) => void, onClose: () => void, part?: LiturgyPart }) {
    const [text, setText] = useState(part ? getStringFromTBSA((part as RecitableText).contents) : "");
    const [genre, setGenre] = useState<Genre | undefined>(part ? (part as RecitableText).genre : undefined);

    const handleSubmitPart = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text) return;
        onClose();
        const recitableText = {
            uniqueId: uuidv4(),
            contents: getPlainTBSA(text),
            type: "recitableText",
        } as RecitableText
        if (genre) recitableText.genre = genre;
        submitPart(recitableText)
    }

    return (
        <form onSubmit={handleSubmitPart}>
            <Stack spacing={2}>
                <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
                    <Typography variant={"h5"}>{part ? "Edit" : "Add"} Text</Typography>
                    <Autocomplete
                        options={GenreOptionsWithLabels.filter(option => option.partType === "recitableText")}
                        getOptionLabel={(option) => option.label}
                        defaultValue={GenreOptionsWithLabels.find(option => option.value === genre)}
                        sx={{minWidth: 200}}
                        renderInput={(params) => <TextField {...params} label="Genre" variant="outlined" />}
                        onChange={(_, value) => setGenre(value?.value as Genre | undefined)}
                    />
                </Stack>
                <TextField variant="outlined" multiline defaultValue={text} minRows={3} maxRows={10} label="Text" onChange={(e) => setText(e.target.value)} />
                <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                    <Button variant="contained" onClick={onClose} startIcon={<CloseIcon />}>Close</Button>
                    <Button variant="contained" type="submit" color="success" startIcon={part ? <SaveIcon /> : <AddIcon />} disabled={!text}>{part ? "Save" : "Add"}</Button>
                </Stack>
            </Stack>
        </form>
    )
}