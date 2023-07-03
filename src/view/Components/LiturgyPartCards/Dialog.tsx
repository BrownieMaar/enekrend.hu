import { Typography } from "@mui/material";
import { Dialogus } from "../../../model/types/RecitableTypes";
import { getStringFromTextBySyllablesAccented } from "../../../controller/recitableTools";

export default function DialogCard({part}: {part: Dialogus}) {

    return <div>
    <Typography variant="h6">Dialog</Typography>
    {part.contents.map(verse => 
    <div style={{marginTop: ".5rem"}}>
    <Typography variant="body1"><b>V.</b> {getStringFromTextBySyllablesAccented(verse.versus)}</Typography>
    <Typography variant="body1"><b>R.</b> {getStringFromTextBySyllablesAccented(verse.responsum)}</Typography>
    </div>
        )}
</div>
}