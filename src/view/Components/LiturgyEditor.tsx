import { Stack, TextField, Typography, SpeedDial, SpeedDialIcon, SpeedDialAction, Dialog, DialogTitle, Button, Paper } from "@mui/material";
import { LiturgyData } from "../../model/types/LiturgyTypes";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';


interface LiturgyEditorProps {
    onSave: (liturgyData: LiturgyData) => void
    onCancel: () => void
    liturgyData?: LiturgyData
    loggedIn?: boolean
}

function LiturgyMetaEditor({ open, onClose, newLiturgyData, setNewLiturgyData }: { open: boolean, newLiturgyData: LiturgyData, setNewLiturgyData: (newLiturgyData: LiturgyData) => void, onClose: () => void }) {
    const [currentMod, setCurrentMod] = useState(newLiturgyData);

    const saveAndExit = () => {
        setNewLiturgyData(currentMod);
        onClose();
    }

    return <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
    >
        <DialogTitle>Edit liturgy info</DialogTitle>
        <Stack gap={2} m={2}>
            <TextField
                fullWidth
                label="Name"
                defaultValue={currentMod.name}
                onChange={(e) => setCurrentMod({ ...currentMod, name: e.target.value })}
            />
            <TextField
                label="Liturgical day"
                defaultValue={currentMod.dies}
                onChange={(e) => setCurrentMod({ ...currentMod, dies: e.target.value })}
            />
            <TextField
                label="Office"
                defaultValue={currentMod.hora}
                onChange={(e) => setCurrentMod({ ...currentMod, hora: e.target.value })}
            />
            <Stack direction="row" gap={2}>
                <Button
                    variant="outlined"
                    onClick={onClose}
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
    </Dialog>
}

export default function LiturgyEditor({ liturgyData, loggedIn, onSave, onCancel }: LiturgyEditorProps) {
    const [newLiturgyData, setNewLiturgyData] = useState(liturgyData ?? {} as LiturgyData);
    const [openDialog, setOpenDialog] = useState("");

    const speedDialActions = [
        {
            name: "Save",
            icon: <SaveIcon />,
            onClick: () => console.log("save")
        },
        {
            name: "Edit info",
            icon: <EditIcon />,
            onClick: () => setOpenDialog("meta")
        },
    ]

    return <>
        <LiturgyMetaEditor open={openDialog === "meta"} newLiturgyData={newLiturgyData} setNewLiturgyData={setNewLiturgyData} onClose={() => setOpenDialog("")} />
        <SpeedDial
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            ariaLabel="SpeedDial for liturgy editor"
            icon={<SpeedDialIcon />}
        >
            {speedDialActions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={action.onClick}
                />
            ))}

        </SpeedDial>
        <Stack mt={2} gap={2}>
            <Typography variant="h4">
                {newLiturgyData?.name ?? <i>[New Liturgy]</i>}
            </Typography>

        </Stack>
    </>
}