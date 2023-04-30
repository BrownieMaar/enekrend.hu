import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {CantusData} from "../../../model/types/CantusTypes";
import {DatabaseContext, UserContext} from "../../App";
import CantusEditor from "../../Components/CantusEditor";
import {
    Avatar,
    Button,
    Menu,
    MenuItem,
    MenuList,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CantusViewer from "../../Components/CantusViewer";
import {CantusVersionDto} from "../../../model/types/Dto";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {UserDao} from "../../../model/UserDao";
import {AppUser} from "../../../model/types/UserTypes";

const ViewEditPicker = ({
                            editing,
                            setEditing
                        }: { editing: boolean, setEditing: React.Dispatch<React.SetStateAction<boolean>> }) =>
    <ToggleButtonGroup size={"small"} value={editing} color={"primary"}>
        <ToggleButton value={false} onClick={() => setEditing(false)}>
            <VisibilityIcon fontSize={"small"}/>
        </ToggleButton>
        <ToggleButton value={true} onClick={() => setEditing(true)}>
            <ModeEditIcon fontSize={"small"}/>
        </ToggleButton>
    </ToggleButtonGroup>

const VersionPicker = ({
                           versions,
                           versionId,
                           setVersionId,
                           userDb
                       }: {
    versions: CantusVersionDto[],
    versionId: string | undefined,
    setVersionId: React.Dispatch<React.SetStateAction<string | undefined>>,
    userDb: UserDao,
}) => {
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
            endIcon={<ExpandMoreIcon/>}
            variant={"outlined"}
        >
            Versions
        </Button>
        <Menu open={open} anchorEl={anchorEl} onClose={handleClose} id="versions-menu"
              aria-labelledby="versions-button">
            <MenuList>
                {versions.map(version => {
                    const [user, setUser] = useState<AppUser | undefined>(undefined)

                    useEffect(() => {
                        userDb.getAppUserData(version.userId).then(user => {
                            setUser(user)
                        })
                    }, [version.userId])

                    return <MenuItem
                        key={version.docId}
                        onClick={() => {
                            setVersionId(version.docId)
                            handleClose()
                        }}
                        selected={versionId === version.docId}
                    >
                        <Stack direction={"row"} spacing={2}>

                            <Avatar
                                alt={user?.displayName || undefined}
                                src={user?.photoUrl || undefined}
                            >
                                {user?.displayName?.charAt(0) || ""}
                            </Avatar>
                            <Stack>
                            <Typography variant={"body2"}>
                                {version.created.toLocaleDateString() + " " + version.created.toLocaleTimeString()}
                            </Typography>
                                <Typography variant={"caption"}>
                                    {user?.displayName || "Unknown"}
                                </Typography>
                            </Stack>
                        </Stack>
                    </MenuItem>
                })}
            </MenuList>
        </Menu>
    </>
}

export default function CantusPage() {
    const db = useContext(DatabaseContext);
    const user = useContext(UserContext);
    const {id} = useParams();
    const [cantusData, setCantusData] = useState<CantusData | undefined>(undefined);
    const [versionId, setVersionId] = useState<string | undefined>(new URLSearchParams(useLocation().search).get("versionId") || undefined);
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
                <VersionPicker versions={versions} versionId={versionId} setVersionId={setVersionId} userDb={db.user}/>
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