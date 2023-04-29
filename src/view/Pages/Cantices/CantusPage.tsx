import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {Cantus} from "../../../model/types/CantusTypes";
import {DatabaseContext, UserContext} from "../../App";
import {CantusImpl} from "../../../controller/CantusImpl";
import CantusEditor from "../../Components/CantusEditor";

export default function CantusPage() {
    const db = useContext(DatabaseContext);
    const user = useContext(UserContext);
    const { id } = useParams();
    const [cantus, setCantus] = useState<Cantus | undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            alert("No id provided")
            return
        }
        db.cantus.getCantusById(id).then(data => {
            const newCantus: Cantus = new CantusImpl(data.cantusData);
            setCantus(newCantus)
        });
    }, [id]);

    const onSave = () => {
        if (!user) {
            alert("Not logged in. You can't save this way!")
            return;
        }
        if (!cantus) {
            alert("No cantus loaded")
            return;
        }
        db.cantus.addNewCantusVersion(cantus.getCantusData(), user.uid).then(docId => {
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

    return cantus
        ? <CantusEditor onSave={onSave} onCancel={onCancel} cantusData={cantus.getCantusData()} loggedIn={!!user} />
        : <div>Loading...</div>

}