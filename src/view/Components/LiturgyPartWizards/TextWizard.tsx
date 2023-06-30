import { useState } from "react";
import { Genre, GenreOptionsWithLabels, LiturgyPart } from "../../../model/types/LiturgyTypes";
import { getPlainTextBySyllablesAccented } from "../../../controller/recitableTools";
import { RecitableText } from "../../../model/types/RecitableTypes";
import { v4 as uuidv4 } from "uuid";
import { Autocomplete, Button, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

export default function TextWizard({ submitPart, onClose }: { submitPart: (part: LiturgyPart) => void, onClose: () => void }) {
    const [text, setText] = useState("");
    const [genre, setGenre] = useState<Genre | null>(null);

    const handleSubmitPart = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text) return;
        onClose();
        const recitableText = {
            uniqueId: uuidv4(),
            contents: getPlainTextBySyllablesAccented(text),
            type: "recitableText",
        } as RecitableText
        if (genre) recitableText.genre = genre;
        submitPart(recitableText)
    }

    return (
        <form onSubmit={handleSubmitPart}>
            <Stack spacing={2}>
                <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
                    <Typography variant={"h5"}>Add Text</Typography>
                    <Autocomplete
                        options={GenreOptionsWithLabels.filter(option => option.partType === "recitableText")}
                        getOptionLabel={(option) => option.label}
                        sx={{minWidth: 200}}
                        renderInput={(params) => <TextField {...params} label="Genre" variant="outlined" />}
                        onChange={(_, value) => setGenre(value?.value as Genre | null)}
                    />
                </Stack>
                <TextField variant="outlined" multiline minRows={3} maxRows={10} label="Text" onChange={(e) => setText(e.target.value)} />
                <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                    <Button variant="contained" onClick={onClose} startIcon={<CloseIcon />}>Close</Button>
                    <Button variant="contained" type="submit" color="success" startIcon={<AddIcon />} disabled={!text}>Add</Button>
                </Stack>
            </Stack>
        </form>
    )
}