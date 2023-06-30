import { Typography } from "@mui/material";
import { Rubric } from "../../../model/types/LiturgyTypes";

export default function RubricCard({part}: {part: Rubric}) {

    return <Typography variant={"subtitle2"} color="textSecondary">{part.contents}</Typography>
}