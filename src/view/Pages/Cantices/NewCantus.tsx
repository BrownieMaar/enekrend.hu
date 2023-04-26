import { CantusData } from "../../../model/types/CantusTypes";
import CantusEditor from "../../Components/CantusEditor";


export default function NewCantus() {
    
    const onSave = (cantus: CantusData) => {}
    const onCancel = () => {}

    return <CantusEditor onSave={onSave} onCancel={onCancel} />
}