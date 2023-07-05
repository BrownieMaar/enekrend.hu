import { useState } from "react";
import { LiturgyPart, Rubric } from "../../../model/types/LiturgyTypes";
import { Button, ButtonGroup, Card, Stack } from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Dialogus, Psalmus, RecitableText, Versicle } from "../../../model/types/RecitableTypes";
import VersicleCard from "../LiturgyPartCards/Versicle";
import RubricCard from "../LiturgyPartCards/Rubric";
import DialogCard from "../LiturgyPartCards/Dialog";
import PsalmCard from "../LiturgyPartCards/Psalm";
import RecitableTextCard from "../LiturgyPartCards/RecitableText";
import DeleteIcon from '@mui/icons-material/Delete';
import { GetWizardComponentFromPartType } from "../LiturgyEditor";

export function LiturgyPartWrapper({ part, submitPart, deletePart, setPopupContent }: {
    part: LiturgyPart;
    submitPart: (part: LiturgyPart) => void;
    deletePart: () => void;
    setPopupContent: (content: React.ReactNode) => void;
}) {
    const [askedToDelete, setAskedToDelete] = useState(false);
    const handleSureToDelete = () => {
        if (askedToDelete) {
            deletePart();
            setAskedToDelete(false);
        }
        else {
            setAskedToDelete(true);
            setTimeout(() => setAskedToDelete(false), 5000);
        }
    };

    const wizardProps = { submitPart, part, setPopupContent, onClose: () => setPopupContent(null) };

    return <Card sx={{ p: 2 }} elevation={4}>
        <Stack spacing={2} sx={{ flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between" }}>
            {part.type === "versicle" && <VersicleCard part={part as Versicle} />}
            {part.type === "rubric" && <RubricCard part={part as Rubric} />}
            {part.type === "dialogus" && <DialogCard part={part as Dialogus} />}
            {part.type === "recitableText" && <RecitableTextCard part={part as RecitableText} />}
            {part.type === "psalmus" && <PsalmCard part={part as Psalmus} />}
            <ButtonGroup size="small" sx={{ alignSelf: "flex-end", flexBasis: 0 }}>
                <Button color="primary" aria-label="edit" onClick={(_) => setPopupContent(GetWizardComponentFromPartType(part.type, wizardProps))} startIcon={<ModeEditIcon />}>
                    Edit
                </Button>
                <Button color="primary" sx={{ minWidth: 600 }} variant={askedToDelete ? "contained" : "outlined"} aria-label="delete" onClick={(_) => handleSureToDelete()} startIcon={<DeleteIcon />}>
                    {askedToDelete ? "Sure?" : "Delete"}
                </Button>
            </ButtonGroup>
        </Stack>
    </Card>;
}
