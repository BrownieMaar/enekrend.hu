import { Stack, TextField, Dialog, DialogTitle, Button } from "@mui/material";
import { LiturgyData } from "../../../model/types/LiturgyTypes";
import SaveIcon from '@mui/icons-material/Save';
import { useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';

export function LiturgyMetaEditor({ open, onClose, newLiturgyData, setNewLiturgyData }: { open: boolean; newLiturgyData: LiturgyData; setNewLiturgyData: (newLiturgyData: LiturgyData) => void; onClose: () => void; }) {
    const [currentMod, setCurrentMod] = useState(newLiturgyData);

    const saveAndExit = () => {
        setNewLiturgyData(currentMod);
        onClose();
    };

    const exitWithoutSaving = () => {
        setCurrentMod(newLiturgyData);
        onClose();
    };

    return <Dialog
        open={open}
        onClose={exitWithoutSaving}
        maxWidth="md"
        fullWidth
    >
        <DialogTitle>Edit liturgy info</DialogTitle>
        <Stack gap={2} m={2}>
            <TextField
                fullWidth
                label="Name"
                defaultValue={currentMod.name}
                onChange={(e) => setCurrentMod({ ...currentMod, name: e.target.value })} />
            <TextField
                label="Liturgical day"
                defaultValue={currentMod.dies}
                onChange={(e) => setCurrentMod({ ...currentMod, dies: e.target.value })} />
            <TextField
                label="Office"
                defaultValue={currentMod.hora}
                onChange={(e) => setCurrentMod({ ...currentMod, hora: e.target.value })} />
            <Stack direction="row" gap={2}>
                <Button
                    variant="outlined"
                    onClick={exitWithoutSaving}
                    fullWidth
                    startIcon={<ClearIcon />}
                >
                    Close
                </Button>
                <Button
                    variant="contained"
                    onClick={saveAndExit}
                    startIcon={<SaveIcon />}
                    fullWidth
                >
                    Save
                </Button>
            </Stack>
        </Stack>
    </Dialog>;
}
