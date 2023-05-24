import { Stack, Dialog, DialogTitle, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { LiturgyData } from "../../../model/types/LiturgyTypes";
import { useState } from "react";

export function LiturgyPartForm({ open, onClose }: { open: boolean; onClose: () => void; liturgyData: LiturgyData; setLiturgyData: (liturgyData: LiturgyData) => void; }) {
    const [partType, setPartType] = useState("cantus");

    const handlePartTypeChange = (event: React.MouseEvent<HTMLElement>, newPartType: string) => {
        setPartType(newPartType);
    };

    const closeWithoutSaving = () => {
        onClose();
    };

    return <Dialog
        open={open}
        onClose={closeWithoutSaving}
        fullWidth
        maxWidth="md"
    >
        <DialogTitle>Add liturgy part</DialogTitle>
        <Stack m={2}>
            <ToggleButtonGroup
                fullWidth
                color="primary"
                value={partType}
                exclusive
                onChange={handlePartTypeChange}
            >
                <ToggleButton value={"cantus"}>
                    Cantus
                </ToggleButton>
                <ToggleButton value={"recitable"}>
                    Recitable
                </ToggleButton>
                <ToggleButton value={"versicle"}>
                    Versicle
                </ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    </Dialog>;
}
