import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { LiturgyData } from "../../../model/types/LiturgyTypes";
import { UserContext, DatabaseContext } from "../../App";
import LiturgyEditor from "../../Components/LiturgyEditor";

export default function Liturgy() {
    const [liturgy, setLiturgy] = useState<LiturgyData | null>(null)
    const { id } = useParams()
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

    useEffect( () => {
        if (!id) return
        db.liturgy.getLiturgyById(id).then(liturgy => {
            console.log("finished getting liturgy")
            console.log(liturgy)
            setLiturgy(liturgy.liturgyData)
        }
        ).catch(err => console.log(err))
    }, []);

    return liturgy === null 
    ? <div>Loading...</div>
    : <LiturgyEditor onSave={onSave} onCancel={onCancel} liturgyData={liturgy} loggedIn={!!user} />
}