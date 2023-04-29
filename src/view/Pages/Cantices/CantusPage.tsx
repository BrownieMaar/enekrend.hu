import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {CantusData} from "../../../model/types/CantusTypes";
import {DatabaseContext, UserContext} from "../../App";
import CantusEditor from "../../Components/CantusEditor";
import {Paper, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

export default function CantusPage() {
    const db = useContext(DatabaseContext);
    const user = useContext(UserContext);
    const {id} = useParams();
    const [cantusData, setCantusData] = useState<CantusData | undefined>(undefined);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            alert("No id provided")
            return
        }
        db.cantus.getCantusById(id).then(data => {
            const newCantus: CantusData = data.cantusData
            setCantusData(newCantus)
        });
    }, [id]);

    const onSave = () => {
        if (!user) {
            alert("Not logged in. You can't save this way!")
            return;
        }
        if (!cantusData) {
            alert("No cantus loaded")
            return;
        }
        db.cantus.addNewCantusVersion(cantusData, user.uid).then(docId => {
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
            <Stack direction={"row"} spacing={2} justifyContent={"flex-end"} sx={{marginBlock: 2}}>
                <ToggleButtonGroup size={"small"} value={editing} color={"primary"}>
                    <ToggleButton  value={false} onClick={() => setEditing(false)}>
                        <VisibilityIcon fontSize={"small"}/>
                    </ToggleButton>
                    <ToggleButton  value={true} onClick={() => setEditing(true)}>
                        <ModeEditIcon fontSize={"small"}/>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>
            {
                editing
                    ?
                    <Paper sx={{padding: 4}}>
                        <CantusEditor onSave={onSave} onCancel={onCancel} cantusData={cantusData} loggedIn={!!user}/>
                    </Paper>
                    : <div>{JSON.stringify(cantusData)}</div>
            }
        </>
        : <div>Loading...</div>

}