import { Typography } from "@mui/material";
import { getStringFromTBSA } from "../../../controller/recitableTools";
import { Psalmus } from "../../../model/types/RecitableTypes";

export default function PsalmCard({ part }: { part: Psalmus }) {

    return <div>
        <Typography variant="h6">Dialog</Typography>
        {part.contents.map((verse, index) =>
            <div key={`psalmus ${part.uniqueId} verse ${index}`} style={{ marginTop: ".5rem" }}>
                {verse.flexa && <Typography variant="body1">{getStringFromTBSA(verse.flexa)}&nbsp;+</Typography>}
                <Typography variant="body1">{getStringFromTBSA(verse.mediatio)}&nbsp;*</Typography>
                <Typography variant="body1">{getStringFromTBSA(verse.terminatio)}</Typography>
            </div>
        )}
    </div>
}