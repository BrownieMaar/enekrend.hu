import { useContext } from "react"
import { DatabaseContext, UserContext } from "../../App"
import LiturgyEditor from "../../Components/LiturgyEditor"
import { useNavigate } from "react-router-dom";
import { LiturgyData } from "../../../model/types/LiturgyTypes";

export default function NewLiturgy() {
    const user = useContext(UserContext)
    const db = useContext(DatabaseContext)
    const navigate = useNavigate();
    const onSave = (liturgy: LiturgyData) => {
        if (!user) return
        db.liturgy.uploadLiturgy(liturgy, user.uid).then((id) => {
            db.liturgy.getLiturgyById(id).then(liturgyDto => {
                console.log(liturgyDto)
            })
        }
        ).catch(err => console.log(err))
    }
    const onCancel = () => navigate("/liturgies");

    return <LiturgyEditor onSave={onSave} onCancel={onCancel} loggedIn={!!user} />
}