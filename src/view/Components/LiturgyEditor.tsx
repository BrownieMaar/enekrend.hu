import { LiturgyData } from "../../model/types/LiturgyTypes"

interface LiturgyEditorProps {
    onSave: (cantusData: LiturgyData) => void
    onCancel: () => void
    cantusData?: LiturgyData;
    loggedIn?: boolean
}

export default function LiturgyEditor() {

    return <>LiturgyEditor</>
}