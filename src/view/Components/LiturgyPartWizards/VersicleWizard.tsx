import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getPlainTextBySyllablesAccented } from "../../../controller/recitableTools";
import { LiturgyPart } from "../../../model/types/LiturgyTypes";
import { Versicle } from "../../../model/types/RecitableTypes";

export default function VersicleWizard({ submitPart, onClose }: { submitPart: (part: LiturgyPart) => void, onClose: () => void }) {
    const [versus, setVersus] = useState("");
    const [responsum, setResponsum] = useState("");

    const handleSubmitPart = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!versus || !responsum) return;
        onClose();
        submitPart({
            uniqueId: uuidv4(),
            contents: {
                versus: getPlainTextBySyllablesAccented(versus),
                responsum: getPlainTextBySyllablesAccented(responsum),
            },
            type: "versicle",

        } as Versicle)
    }

    return (
        <form onSubmit={handleSubmitPart}>
            <Stack spacing={2}>
                <Typography variant={"h5"}>Add Versicle</Typography>
                <TextField variant="outlined" label="Versum" onChange={(e) => setVersus(e.target.value)} />
                <TextField variant="outlined" label="Responsum" onChange={(e) => setResponsum(e.target.value)} />
                <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                    <Button variant="contained" onClick={onClose} startIcon={<CloseIcon />}>Close</Button>
                    <Button variant="contained" type="submit" color="success" startIcon={<AddIcon />} disabled={!versus || !responsum}>Add</Button>
                </Stack>
            </Stack>
        </form>
    )
}