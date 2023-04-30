import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {CantusData} from "../../../model/types/CantusTypes";
import {DatabaseContext, UserContext} from "../../App";
import CantusEditor from "../../Components/CantusEditor";
import {Button, Menu, MenuItem, Paper, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CantusViewer from "../../Components/CantusViewer";
import {CantusVersionDto} from "../../../model/types/Dto";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ViewEditPicker = ({editing, setEditing}: {editing: boolean, setEditing:  React.Dispatch<React.SetStateAction<boolean>>}) => <ToggleButtonGroup size={"small"} value={editing} color={"primary"}>
        <ToggleButton value={false} onClick={() => setEditing(false)}>
            <VisibilityIcon fontSize={"small"}/>
        </ToggleButton>
        <ToggleButton value={true} onClick={() => setEditing(true)}>
            <ModeEditIcon fontSize={"small"}/>
        </ToggleButton>
    </ToggleButtonGroup>

const VersionPicker = ({versions, versionId, setVersionId}: {versions: CantusVersionDto[], versionId: string | undefined, setVersionId: React.Dispatch<React.SetStateAction<string | undefined>>}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    return <>
        <Button
            id="versions-button"
            aria-controls={open ? "versions-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            endIcon={<ExpandMoreIcon />}
            variant={"outlined"}
        >
            Versions
        </Button>
        <Menu open={open} anchorEl={anchorEl} onClose={handleClose} id="versions-menu" aria-labelledby="versions-button">
            {versions.map(version => <MenuItem key={version.docId} onClick={() => {
                setVersionId(version.docId)
                handleClose()
            }}>{version.created.toISOString()}
            </MenuItem>)}
        </Menu>
    </>
}

export default function CantusPage() {
    const db = useContext(DatabaseContext);
    const user = useContext(UserContext);
    const {id} = useParams();
    const [cantusData, setCantusData] = useState<CantusData | undefined>(undefined);
    const [versionId, setVersionId] = useState<string | undefined>(undefined);
    const [versions, setVersions] = useState<CantusVersionDto[]>([]);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            alert("No id provided")
            return
        }
        db.cantus.getCantusVersionDTOsById(id).then(data => {
            setVersions(data)
        })
    }, [id])

    useEffect(() => {
        if (!id) {
            alert("No id provided")
            return
        }
        db.cantus.getCantusById(id, versionId).then(data => {
            const newCantus: CantusData = data.cantusData
            setCantusData(newCantus)
        });
    }, [id, versionId]);

    const onSave = (cantusDataModified: CantusData) => {
        if (!user) {
            alert("Not logged in. You can't save this way!")
            return;
        }
        db.cantus.addNewCantusVersion(cantusDataModified, user.uid).then(docId => {
            db.cantus.getCantusById(docId).then(cantusDto => {
                console.log(cantusDto)
                navigate(-1)
            })
        }).catch(err => {
            console.log(err)
        })
    }
    const onCancel = () => {
        setEditing(false)
    }


    return cantusData
        ? <>
            <Stack direction={"row"} gap={2} justifyContent={"flex-end"} sx={{marginBlock: 2}}>
                    <VersionPicker versions={versions} versionId={versionId} setVersionId={setVersionId}/>
                {user ? <ViewEditPicker editing={editing} setEditing={setEditing}/> : <></>}
                </Stack>

            {
                user && editing
                    ?
                    <Paper sx={{padding: 4}}>
                        <CantusEditor onSave={onSave} onCancel={onCancel} cantusData={cantusData} loggedIn={!!user}/>
                    </Paper>
                    :
                    <Paper sx={{padding: 4}}>
                        <CantusViewer cantusData={cantusData}/>
                    </Paper>
            }
        </>
        : <div>Loading...</div>

}