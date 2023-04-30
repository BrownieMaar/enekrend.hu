import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {CantusData} from "../../../model/types/CantusTypes";
import {DatabaseContext, UserContext} from "../../App";
import CantusEditor from "../../Components/CantusEditor";
import {Paper, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CantusViewer from "../../Components/CantusViewer";

const ViewEditPicker = ({editing, setEditing}: {editing: boolean, setEditing:  React.Dispatch<React.SetStateAction<boolean>>}) => <Stack direction={"row"} spacing={2} justifyContent={"flex-end"} sx={{marginBlock: 2}}>
    <ToggleButtonGroup size={"small"} value={editing} color={"primary"}>
        <ToggleButton value={false} onClick={() => setEditing(false)}>
            <VisibilityIcon fontSize={"small"}/>
        </ToggleButton>
        <ToggleButton value={true} onClick={() => setEditing(true)}>
            <ModeEditIcon fontSize={"small"}/>
        </ToggleButton>
    </ToggleButtonGroup>
</Stack>

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
            {user ? <ViewEditPicker editing={editing} setEditing={setEditing}/> : <></>}

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