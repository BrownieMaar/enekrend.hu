import { useNavigate } from "react-router-dom";
import { CantusData } from "../../../model/types/CantusTypes";
import CantusEditor from "../../Components/CantusEditor";


export default function NewCantus() {
    const navigate = useNavigate();
    
    const onSave = (cantus: CantusData) => {}
    const onCancel = () => navigate(-1)

    return <CantusEditor onSave={onSave} onCancel={onCancel} />
}