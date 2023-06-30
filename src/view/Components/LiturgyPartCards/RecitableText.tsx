import { Typography } from "@mui/material";
import { GenreOptionsWithLabels } from "../../../model/types/LiturgyTypes";
import { RecitableText } from "../../../model/types/RecitableTypes";
import { getStringFromTextBySyllablesAccented } from "../../../controller/recitableTools";

export default function RecitableTextCard({part}: {part: RecitableText}) {
    const genreLabel = GenreOptionsWithLabels.find(genre => genre.value === part.genre)?.label || part.genre
    return <div>
        <Typography variant="h6">{genreLabel}</Typography>
        <Typography variant="body1">{getStringFromTextBySyllablesAccented(part.contents)}</Typography>
    </div>
}