import { useState } from "react";
import { LiturgyData, LiturgyPart, liturgyPartTypes } from "../../model/types/LiturgyTypes"
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Container, Dialog, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import VersicleWizard from "./LiturgyPartWizards/VersicleWizard";
import PsalmWizard from "./LiturgyPartWizards/PsalmWizard";
import TextWizard from "./LiturgyPartWizards/TextWizard";
import RubricWizard from "./LiturgyPartWizards/RubricWizard";
import DialogWizard from "./LiturgyPartWizards/DialogWizard";

interface LiturgyEditorProps {
    onSave: (cantusData: LiturgyData) => void
    onCancel: () => void
    cantusData?: LiturgyData;
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

export default function LiturgyEditor({ onSave, onCancel, cantusData, loggedIn }: LiturgyEditorProps) {
    const [liturgy, setLiturgy] = useState(cantusData || getEmptyLiturgyData());
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const addPartToLiturgy = (part: LiturgyPart, index: number = liturgy.parts.length - 1) => {
        setLiturgy({
            ...liturgy,
            parts: [...liturgy.parts.slice(0, index), part, ...liturgy.parts.slice(index)]
        })
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return <div>
        <h1>{liturgy.dies || "[Liturgical day]"}</h1>
        <h2>{liturgy.hora || "[Liturgical hour]"}</h2>
        <p>ID: <code>{liturgy.uniqueId}</code></p>
        <Stack spacing={2} alignItems={"center"}>
            {liturgy.parts.map((part, index) => <LiturgyPartWrapper key={index} part={part} />)}
            <Button variant="contained" onClick={handleClick} startIcon={<AddIcon />} >Add part</Button>
        </Stack>

        <AddLiturgyPartMenu anchorEl={anchorEl} onClose={handleClose} submitPart={addPartToLiturgy} />

    </div >
}

function AddLiturgyPartMenu({ anchorEl, onClose, submitPart }: { anchorEl: HTMLElement | null, onClose: () => void, submitPart: (part: LiturgyPart) => void }) {
    const [popupContent, setPopupContent] = useState<React.ReactNode | null>(null);

    const open = Boolean(anchorEl);
    const onPopupClose = () => setPopupContent(null);

    const wizardComponents: { [K in LiturgyPart["type"]]: React.ReactNode } = {
        "versicle": <VersicleWizard submitPart={submitPart} />,
        "psalmus": <PsalmWizard submitPart={submitPart} />,
        "recitableText": <TextWizard submitPart={submitPart} />,
        "rubric": <RubricWizard submitPart={submitPart} />,
        "dialogus": <DialogWizard submitPart={submitPart} />,
        "cantus": <div>chant</div>,
    }

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
                    sx={{ px: 3 }}
                    key={index}
                    onClick={(_) => { onClose(); setPopupContent(wizardComponents[partType.value]); }}
                >
                    {partType.name}
                </MenuItem>
            )}
        </Menu>
        <PopupWrapper onClose={onPopupClose}>{popupContent}</PopupWrapper>
    </>
    )
}

function PopupWrapper({ children, onClose }: { children: React.ReactNode | null, onClose: () => void }) {
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

function LiturgyPartWrapper({ part }: { part: LiturgyPart }) {
    return <div>
        <h3>{part.genre}</h3>
        <div>{JSON.stringify(part.contents)}</div>
    </div>
}