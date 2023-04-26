import { useNavigate } from "react-router-dom";
import { CantusData } from "../../../model/types/CantusTypes";
import CantusEditor from "../../Components/CantusEditor";
import { DatabaseContext } from "../../App";
import { useContext } from "react";
import { UserContext } from "../../App";


export default function NewCantus() {
    const navigate = useNavigate();
    const db = useContext(DatabaseContext);
    const user = useContext(UserContext);
    
    const onSave = (cantus: CantusData) => {
        if (!user) return
        db.cantus.addNewCantus(cantus, user.uid).then(() => navigate(-1))
    }
    const onCancel = () => navigate(-1)

    return <CantusEditor onSave={onSave} onCancel={onCancel} loggedIn={!!user} />
}