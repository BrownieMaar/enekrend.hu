import { useParams } from "react-router-dom";
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

    useEffect(() => {
        if (!id) {
            alert("No id provided")
            return
        }
        db.cantus.getCantusByDocId(id).then(data => setCantus(new CantusImpl(data.cantusData)));
    }, [id]);

    const onSave = () => {}
    const onCancel = () => {}

    return cantus
        ? <CantusEditor onSave={onSave} onCancel={onCancel} cantusData={cantus.getCantusData()} loggedIn={!!user} />
        : <div>Loading...</div>

}