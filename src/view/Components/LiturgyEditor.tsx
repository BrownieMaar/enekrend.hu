import { useState } from "react";
import { LiturgyData, LiturgyPart, liturgyPartTypes } from "../../model/types/LiturgyTypes"
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Container, Dialog, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

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
            <Box>
                <Button variant="contained" onClick={handleClick} startIcon={<AddIcon />} >Add part</Button>
            </Box>
        </Stack>

        <AddLiturgyPartMenu anchorEl={anchorEl} onClose={handleClose} />


    </div >
}

function AddLiturgyPartMenu({ anchorEl, onClose }: { anchorEl: HTMLElement | null, onClose: () => void }) {
    const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(null);

    const open = Boolean(anchorEl);
    const onDialogClose = () => setDialogContent(null);

    const wizardComponents: { [K in LiturgyPart["type"]]: React.ReactNode } = {
        "versicle": <div>versicle</div>,
        "psalmus": <div>psalm</div>,
        "recitableText": <div>reading</div>,
        "cantus": <div>chant</div>,
        "rubric": <div>rubric</div>,
        "dialogus": <div>dialog</div>,
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
                    onClick={(_) => { onClose(); setDialogContent(wizardComponents[partType.value]); }}
                >
                    {partType.name}
                </MenuItem>
            )}
        </Menu>
        <DialogWrapper onClose={onDialogClose}>{dialogContent}</DialogWrapper>
    </>
    )
}

function DialogWrapper({ children, onClose }: { children: React.ReactNode | null, onClose: () => void }) {
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