import { useState } from "react";
import { LiturgyPart, Rubric } from "../../../model/types/LiturgyTypes";
import { v4 as uuidv4 } from "uuid";
import { Button, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

export default function RubricWizard({submitPart, onClose}: {submitPart: (part: LiturgyPart) => void, onClose: () => void}) {
    const [rubric, setRubric] = useState("");

    const handleSubmitPart = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!rubric) return;
        onClose();
        submitPart({
            uniqueId: uuidv4(),
            contents: rubric,
            type: "rubric",
        } as Rubric)
    }

    return (
        <form onSubmit={handleSubmitPart}>
            <Stack spacing={2}>
                <Typography variant={"h5"}>Add Rubric</Typography>
                <TextField variant="outlined" multiline minRows={3} label="Rubric" onChange={(e) => setRubric(e.target.value)} />
                <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                    <Button variant="contained" onClick={onClose} startIcon={<CloseIcon />}>Close</Button>
                    <Button variant="contained" type="submit" color="success" startIcon={<AddIcon />} disabled={!rubric}>Add</Button>
                </Stack>
            </Stack>
        </form>
    )
}