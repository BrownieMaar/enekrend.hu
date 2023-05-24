import { Stack, Dialog, DialogTitle, ToggleButtonGroup, ToggleButton, Button } from "@mui/material";
import { LiturgyData, LiturgyPart } from "../../../model/types/LiturgyTypes";
import { useState } from "react";
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';

const AddCantusWizard = ({ }: {}) => {
    return <div>AddCantusWizard</div>
}


export function LiturgyPartForm({ open, onClose, liturgyData, setLiturgyData }: { open: boolean; onClose: () => void; liturgyData: LiturgyData; setLiturgyData: (liturgyData: LiturgyData) => void; }) {
    const [newLiturgyPart, setNewLiturgyPart] = useState<LiturgyPart | undefined>(undefined);

    const editorOptions = {
        cantus: {
            name: "Cantus",
            component: <div>Cantus</div>
        },
        recitable: {
            name: "Recitable",
            component: <div>Recitable</div>
        },
        versicle: {
            name: "Versicle",
            component: <div>Versicle</div>
        }
    } as const;
    const [partType, setPartType] = useState<keyof typeof editorOptions>("cantus");

    const handlePartTypeChange = (_event: React.MouseEvent<HTMLElement>, newPartType: string) => {
        if (newPartType in editorOptions) {
            setPartType(newPartType as keyof typeof editorOptions);
        }
    };

    const exitWithoutSaving = () => {
        onClose();
    };

    const saveAndExit = () => {
        if (newLiturgyPart) {
            setLiturgyData({
                ...liturgyData,
                parts: [...liturgyData.parts, newLiturgyPart]
            });
        }
        onClose();
    };


    return <Dialog
        open={open}
        onClose={exitWithoutSaving}
        fullWidth
        maxWidth="md"
    >
        <DialogTitle>Add liturgy part</DialogTitle>
        <Stack m={2} gap={2}>
            <ToggleButtonGroup
                fullWidth
                color="primary"
                value={partType}
                exclusive
                onChange={handlePartTypeChange}
            >
                {Object.entries(editorOptions).map(([key, value]) => {
                    return <ToggleButton key={key} value={key}>
                        {value.name}
                    </ToggleButton>
                })
                }
            </ToggleButtonGroup>
            {editorOptions[partType].component}
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
                    disabled={!newLiturgyPart}
                    startIcon={<SaveIcon />}
                    fullWidth
                >
                    Save
                </Button>
            </Stack>
        </Stack>
    </Dialog>;
}
