import { useNavigate } from "react-router-dom";
import { LiturgyData } from "../../../model/types/LiturgyTypes";
import LiturgyEditor from "../../Components/LiturgyEditor";
import { useContext } from "react";
import { UserContext } from "../../App";

export default function NewLiturgy() {
    const navigate = useNavigate();
    const user = useContext(UserContext);

    const onSave = (liturgyData: LiturgyData) => {
        console.log(liturgyData);
    }

    return <LiturgyEditor onSave={onSave} onCancel={() => navigate("/")} loggedIn={!!user} />
}