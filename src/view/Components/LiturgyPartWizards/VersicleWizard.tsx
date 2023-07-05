import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getPlainTBSA, getStringFromTBSA } from "../../../controller/recitableTools";
import { LiturgyPart } from "../../../model/types/LiturgyTypes";
import { Versicle } from "../../../model/types/RecitableTypes";

export default function VersicleWizard({ submitPart, onClose, part }: { submitPart: (part: LiturgyPart) => void, onClose: () => void, part?: LiturgyPart }) {
    const [versus, setVersus] = useState(part ? getStringFromTBSA((part as Versicle).contents.versus) : "");
    const [responsum, setResponsum] = useState(part ? getStringFromTBSA((part as Versicle).contents.responsum) : "");

    const handleSubmitPart = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!versus || !responsum) return;
        onClose();
        submitPart({
            uniqueId: uuidv4(),
            contents: {
                versus: getPlainTBSA(versus),
                responsum: getPlainTBSA(responsum),
            },
            type: "versicle",
            genre: "Versic",
        } as Versicle)
    }

    return (
        <form onSubmit={handleSubmitPart}>
            <Stack spacing={2}>
                <Typography variant={"h5"}>{part ? "Edit" : "Add"} Versicle</Typography>
                <TextField variant="outlined" defaultValue={versus} label="Versum" onChange={(e) => setVersus(e.target.value)} />
                <TextField variant="outlined" defaultValue={responsum} label="Responsum" onChange={(e) => setResponsum(e.target.value)} />
                <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                    <Button variant="contained" onClick={onClose} startIcon={<CloseIcon />}>Close</Button>
                    <Button variant="contained" type="submit" color="success" startIcon={part ? <SaveIcon /> : <AddIcon />} disabled={!versus || !responsum}>{part ? "Save" : "Add"}</Button>
                </Stack>
            </Stack>
        </form>
    )
}