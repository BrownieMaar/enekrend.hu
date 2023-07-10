import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Button, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LiturgyData, LiturgyPart } from "../../model/types/LiturgyTypes";
import { AddLiturgyPartMenu } from "./LiturgyEditor/AddLiturgyPartMenu";
import { LiturgyPartWrapper } from "./LiturgyEditor/LiturgyPartWrapper";
import { PopupWrapper } from "./LiturgyEditor/PopupWrapper";
import DialogWizard from "./LiturgyPartWizards/DialogWizard";
import PsalmWizard from "./LiturgyPartWizards/PsalmWizard";
import RubricWizard from "./LiturgyPartWizards/RubricWizard";
import TextWizard from "./LiturgyPartWizards/TextWizard";
import VersicleWizard from "./LiturgyPartWizards/VersicleWizard";

interface LiturgyEditorProps {
    onSave: (liturgyData: LiturgyData) => void
    onCancel: () => void
    liturgyData?: LiturgyData;
    loggedIn?: boolean
}

const getEmptyLiturgyData = () => {
    return {
        uniqueId: uuidv4(),
        name: "",
        dies: "",
        hora: "",
        parts: [] as LiturgyPart[]
    } as LiturgyData;
}

export default function LiturgyEditor({ onSave, onCancel, liturgyData, loggedIn }: LiturgyEditorProps) {
    const [liturgy, setLiturgy] = useState(liturgyData || getEmptyLiturgyData());
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [popupContent, setPopupContent] = useState<React.ReactNode>(null);
    const [indexToInsert, setIndexToInsert] = useState<number | null>(null);

    const onPopupClose = () => setPopupContent(null);

    const addPartToLiturgy = (part: LiturgyPart) => {
        const index = indexToInsert || liturgy.parts.length;
        setLiturgy({
            ...liturgy,
            parts: [...liturgy.parts.slice(0, index), part, ...liturgy.parts.slice(index)]
        })
    }

    const replacePartInLiturgy = (index: number, newPart: LiturgyPart) => {
        setLiturgy({
            ...liturgy,
            parts: [...liturgy.parts.slice(0, index), newPart, ...liturgy.parts.slice(index + 1)]
        })
    }

    const deletePartFromLiturgy = (index: number) => {
        setLiturgy({
            ...liturgy,
            parts: [...liturgy.parts.slice(0, index), ...liturgy.parts.slice(index + 1)]
        })
    }

    const handleAddPartMenu = (event: React.MouseEvent<HTMLButtonElement>, index: number | null = null) => {
        setAnchorEl(event.currentTarget);
        setIndexToInsert(index);
    };

    const moveLiturgyPart = (index: number, direction: "up" | "down") => {
        if (direction === "up") {
            if (index === 0) return;
            setLiturgy({
                ...liturgy,
                parts: [...liturgy.parts.slice(0, index - 1), liturgy.parts[index], liturgy.parts[index - 1], ...liturgy.parts.slice(index + 1)]
            })
        } else {
            if (index === liturgy.parts.length - 1) return;
            setLiturgy({
                ...liturgy,
                parts: [...liturgy.parts.slice(0, index), liturgy.parts[index + 1], liturgy.parts[index], ...liturgy.parts.slice(index + 2)]
            })
        }
    }

    const handleClose = () => {
        setAnchorEl(null);
        setIndexToInsert(null);
    };

    const MetaEditor = () => {
        const [name, setName] = useState(liturgy.name);
        const [dies, setDies] = useState(liturgy.dies);
        const [hora, setHora] = useState(liturgy.hora);

        const handleSubmit = () => {
            setLiturgy({
                ...liturgy,
                name,
                dies,
                hora
            })
            onPopupClose();
        }

        return <Stack spacing={2}>
            <Typography variant="h5">Edit liturgy metadata</Typography>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Day" value={dies} onChange={(e) => setDies(e.target.value)} />
            <TextField label="Hour" value={hora} onChange={(e) => setHora(e.target.value)} />
            <Stack direction={"row"} spacing={2}>
                <Button variant="contained" onClick={onPopupClose}>Cancel</Button>
                <Button variant="contained" color="success" onClick={handleSubmit}>Save</Button>
            </Stack>

        </Stack>
    }

    return <div>
        <Stack spacing={2} >
            <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={2}>
                    <Typography variant="h3">{liturgy.dies || "[Liturgical day]"}</Typography>
                    <Typography variant="h5">{liturgy.hora || "[Liturgical hour]"}</Typography>
                    <p>ID: <code>{liturgy.uniqueId}</code></p>
                    <Button sx={{ width: "fit-content" }} startIcon={<EditIcon />} onClick={_ => setPopupContent(<MetaEditor />)}>Edit liturgy data</Button>
                </Stack>
                <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="flex-start">
                    <Button variant="contained" onClick={onCancel}>Cancel</Button>
                    <Button variant="contained" color="success" onClick={(_) => onSave(liturgy)} disabled={!loggedIn}>Save</Button>
                </Stack>
            </Stack>
            {liturgy.parts.map((part, index) => <Stack key={`LiturgyCard with index ${index}`} direction={"row"} spacing={1} justifyContent={"stretch"} alignItems={"center"}>
                <div style={{ flexGrow: 1 }}>
                    <LiturgyPartWrapper
                        part={part}
                        submitPart={(newPart) => replacePartInLiturgy(index, newPart)}
                        deletePart={() => deletePartFromLiturgy(index)}
                        setPopupContent={setPopupContent}
                    />
                </div>
                <Stack justifyContent={"center"}>
                    <Tooltip title="Move up" placement="left">
                        <span>
                            <IconButton aria-label="move up" onClick={() => moveLiturgyPart(index, "up")} size="small" disabled={index === 0}>
                                <KeyboardArrowUpIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Add after this" placement="left">
                        <span>
                            <IconButton aria-label="add after this" onClick={(e) => handleAddPartMenu(e, index + 1)} size="small">
                                <PlaylistAddIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Move down" placement="left">
                        <span>
                            <IconButton aria-label="move down" onClick={() => moveLiturgyPart(index, "down")} size="small" disabled={index === liturgy.parts.length - 1}>
                                <KeyboardArrowDownIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            </Stack>)}
            {!liturgy.parts.length && <Button variant="contained" onClick={handleAddPartMenu} startIcon={<AddIcon />} >Add part</Button>}
        </Stack>

        <AddLiturgyPartMenu anchorEl={anchorEl} onClose={handleClose} submitPart={addPartToLiturgy} setPopupContent={setPopupContent} />
        <PopupWrapper onClose={onPopupClose}>{popupContent}</PopupWrapper>

    </div >
}

export function GetWizardComponentFromPartType(partType: LiturgyPart["type"], props: { submitPart: (part: LiturgyPart) => void, onClose: () => void, part?: LiturgyPart }) {
    switch (partType) {
        case "versicle":
            return <VersicleWizard {...props} />;
        case "psalmus":
            return <PsalmWizard {...props} />;
        case "recitableText":
            return <TextWizard {...props} />;
        case "rubric":
            return <RubricWizard {...props} />;
        case "dialogus":
            return <DialogWizard {...props} />;
        case "cantus":
            return <div>chant</div>;
    }
}