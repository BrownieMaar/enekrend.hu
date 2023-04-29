import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {CantusData} from "../../../model/types/CantusTypes";
import {DatabaseContext, UserContext} from "../../App";
import CantusEditor from "../../Components/CantusEditor";

export default function CantusPage() {
    const db = useContext(DatabaseContext);
    const user = useContext(UserContext);
    const { id } = useParams();
    const [cantusData, setCantusData] = useState<CantusData | undefined>(undefined);
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
        navigate(-1)
    }

    return cantusData
        ? <CantusEditor onSave={onSave} onCancel={onCancel} cantusData={cantusData} loggedIn={!!user} />
        : <div>Loading...</div>

}