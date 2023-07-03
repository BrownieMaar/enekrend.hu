import { Typography } from "@mui/material";
import { Versicle } from "../../../model/types/RecitableTypes";
import { getStringFromTextBySyllablesAccented } from "../../../controller/recitableTools";

export default function VersicleCard({part}: {part: Versicle}) {
    return <div>
        <Typography variant="h6">Versicle</Typography>
        <div>
        <Typography variant="body1"><b>V.</b> {getStringFromTextBySyllablesAccented(part.contents.versus)}</Typography>
        <Typography variant="body1"><b>R.</b> {getStringFromTextBySyllablesAccented(part.contents.responsum)}</Typography>
        </div>
    </div>
}