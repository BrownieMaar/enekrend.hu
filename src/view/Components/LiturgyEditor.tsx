import { Stack, TextField, Typography } from "@mui/material";
import { LiturgyData } from "../../model/types/LiturgyTypes";


interface LiturgyEditorProps {
    onSave: (liturgyData: LiturgyData) => void
    onCancel: () => void
    liturgyData?: LiturgyData
    loggedIn?: boolean
}

export default function LiturgyEditor({ liturgyData, loggedIn, onSave, onCancel }: LiturgyEditorProps) {

    return <Stack mt={2} gap={2}>
        <Typography variant="h4">
            {liturgyData?.name ?? <i>[New Liturgy]</i>}
        </Typography>

    </Stack>
}