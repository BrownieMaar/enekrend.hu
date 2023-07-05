import { Typography } from "@mui/material";
import { getStringFromTBSA } from "../../../controller/recitableTools";
import { Psalmus } from "../../../model/types/RecitableTypes";

export default function PsalmCard({ part }: { part: Psalmus }) {
    const getTitle = () => {
        if (part.title) {
            if (part.genre === "Psalm") return "Psalmus " + part.title
            return part.title
        }
        part.genre === "Psalm" ? "Psalmus" : "Canticum"
    }

    return <div>
        <Typography variant="h6">{getTitle()}</Typography>
        {part.contents.map((verse, index) =>
            <div key={`psalmus ${part.uniqueId} verse ${index}`} style={{ marginTop: ".5rem" }}>
                {verse.flexa && <Typography variant="body1">{getStringFromTBSA(verse.flexa)}&nbsp;†</Typography>}
                <Typography variant="body1">{getStringFromTBSA(verse.mediatio)}&nbsp;*</Typography>
                <Typography variant="body1">{getStringFromTBSA(verse.terminatio)}</Typography>
            </div>
        )}
    </div>
}