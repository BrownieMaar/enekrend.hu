import { Cantus } from "../../model/types/CantusTypes"

interface CantusEditorProps {
    onSave: (cantus: Cantus) => void
    onCancel: () => void
    cantus?: Cantus
}

export default function CantusEditor({onSave, onCancel, cantus}: CantusEditorProps) {

    return <>CantusEditor</>
}