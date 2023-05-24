import { Stack, Typography, SpeedDial, SpeedDialIcon, SpeedDialAction, Paper } from "@mui/material";
import { LiturgyData } from "../../model/types/LiturgyTypes";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from "@mui/icons-material/Edit";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useState } from "react";
import { LiturgyMetaEditor } from "./LiturgyEditor/LiturgyMetaEditor";
import { LiturgyPartForm } from "./LiturgyEditor/LiturgyPartForm";


interface LiturgyEditorProps {
    onSave: (liturgyData: LiturgyData) => void
    onCancel: () => void
    liturgyData?: LiturgyData
    loggedIn?: boolean
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
        {
            name: "Add element",
            icon: <PlaylistAddIcon />,
            onClick: () => setOpenDialog("liturgyPart")
        }
    ]

    return <>
        <LiturgyPartForm open={openDialog === "liturgyPart"} onClose={() => setOpenDialog("")} liturgyData={newLiturgyData} setLiturgyData={setNewLiturgyData} />
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
            <Typography variant="h6">
                {[newLiturgyData?.dies, newLiturgyData?.hora].filter(val => !!val).join(" · ")}
            </Typography>
        </Stack>
    </>
}