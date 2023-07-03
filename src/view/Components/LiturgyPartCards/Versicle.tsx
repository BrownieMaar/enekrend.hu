import { Typography } from "@mui/material";
import { Versicle } from "../../../model/types/RecitableTypes";
import { getStringFromTBSA } from "../../../controller/recitableTools";

export default function VersicleCard({part}: {part: Versicle}) {
    return <div>
        <Typography variant="h6">Versicle</Typography>
        <div>
        <Typography variant="body1"><b>V.</b> {getStringFromTBSA(part.contents.versus)}</Typography>
        <Typography variant="body1"><b>R.</b> {getStringFromTBSA(part.contents.responsum)}</Typography>
        </div>
    </div>
}