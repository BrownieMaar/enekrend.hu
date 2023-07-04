import { useState } from "react";
import { LiturgyData, LiturgyPart, Rubric, liturgyPartTypes } from "../../model/types/LiturgyTypes"
import { v4 as uuidv4 } from "uuid";
import { Box, Button, ButtonGroup, Card, Container, Dialog, IconButton, Menu, MenuItem, Stack, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import VersicleWizard from "./LiturgyPartWizards/VersicleWizard";
import PsalmWizard from "./LiturgyPartWizards/PsalmWizard";
import TextWizard from "./LiturgyPartWizards/TextWizard";
import RubricWizard from "./LiturgyPartWizards/RubricWizard";
import DialogWizard from "./LiturgyPartWizards/DialogWizard";
import { Dialogus, Psalmus, RecitableText, Versicle } from "../../model/types/RecitableTypes";
import VersicleCard from "./LiturgyPartCards/Versicle";
import RubricCard from "./LiturgyPartCards/Rubric";
import DialogCard from "./LiturgyPartCards/Dialog";
import PsalmCard from "./LiturgyPartCards/Psalm";
import RecitableTextCard from "./LiturgyPartCards/RecitableText";
import DeleteIcon from '@mui/icons-material/Delete';

interface LiturgyEditorProps {
    onSave: (cantusData: LiturgyData) => void
    onCancel: () => void
    cantusData?: LiturgyData;
    loggedIn?: boolean
}

const getEmptyLiturgyData = () => {
    return {
        "uniqueId": "47652167-0685-4c9f-b450-46929f2cc934",
        "name": "",
        "dies": "",
        "hora": "",
        "parts": [
            {
                "uniqueId": "c52ffa5b-b44f-44a2-878c-c5d1685f8fdf",
                "contents": {
                    "text": [
                        {
                            "syllable": "Let the fun begin!",
                            "isSpaceAfter": false,
                            "isAccent": false
                        }
                    ]
                },
                "type": "recitableText",
                "genre": "Oratio"
            },
            {
                "uniqueId": "72163a58-09d4-433b-9461-02427d777a59",
                "contents": "This is where the fun begins.",
                "type": "rubric"
            }
        ]
    } as LiturgyData;
    return {
        uniqueId: uuidv4(),
        name: "",
        dies: "",
        hora: "",
        parts: [] as LiturgyPart[]
    } as LiturgyData;
}

export default function LiturgyEditor({ onSave, onCancel, cantusData, loggedIn }: LiturgyEditorProps) {
    const [liturgy, setLiturgy] = useState(cantusData || getEmptyLiturgyData());
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

    return <div>
        <h1>{liturgy.dies || "[Liturgical day]"}</h1>
        <h2>{liturgy.hora || "[Liturgical hour]"}</h2>
        <p>ID: <code>{liturgy.uniqueId}</code></p>
        <Stack spacing={2} >
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

function AddLiturgyPartMenu(
    { anchorEl, onClose, submitPart, setPopupContent }: {
        anchorEl: HTMLElement | null,
        onClose: () => void,
        submitPart: (part: LiturgyPart) => void,
        setPopupContent: (content: React.ReactNode) => void,
    }) {

    const open = Boolean(anchorEl);
    const onPopupClose = () => setPopupContent(null);

    const wizardProps = { submitPart, onClose: onPopupClose };
    return (<>
        <Menu
            id="liturgy-part-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            {liturgyPartTypes.map((partType, index) =>
                <MenuItem
                    sx={{ px: 2 }}
                    key={index}
                    onClick={(_) => { onClose(); setPopupContent(GetWizardComponentFromPartType(partType.value, wizardProps)); }}
                >
                    {partType.name}
                </MenuItem>
            )}
        </Menu>
    </>
    )
}

function PopupWrapper({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
    const open = Boolean(children);
    return open
        ? (
            <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
                <Box p={2}>
                    {children}
                </Box>
            </Dialog>
        )
        : null;
}

function LiturgyPartWrapper({ part, submitPart, deletePart, setPopupContent }: {
    part: LiturgyPart,
    submitPart: (part: LiturgyPart) => void,
    deletePart: () => void,
    setPopupContent: (content: React.ReactNode) => void,
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
    }

    const wizardProps = { submitPart, part, setPopupContent, onClose: () => setPopupContent(null) };

    return <Card sx={{ p: 2 }} elevation={4} >
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
    </Card>
}

function GetWizardComponentFromPartType(partType: LiturgyPart["type"], props: { submitPart: (part: LiturgyPart) => void, onClose: () => void, part?: LiturgyPart }) {
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