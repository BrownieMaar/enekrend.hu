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
    
    const onSave = async (cantus: CantusData) => {
        if (!user) return
        try {
            const docId = await db.cantus.addNewCantus(cantus, user.uid)
            db.cantus.getCantusById(docId).then(cantusDto => {
                console.log(cantusDto)
            })
        }
        catch (err) {
            console.log(err)
        }
    }
    const onCancel = () => navigate(-1)

    return <CantusEditor onSave={onSave} onCancel={onCancel} loggedIn={!!user} />
}