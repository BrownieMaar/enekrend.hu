import {Grid, Paper, Typography} from "@mui/material"
import {useContext, useEffect, useState} from "react"
import {CantusDto} from "../../../model/types/Dto";
import {DatabaseContext} from "../../App";
import {CantusImpl} from "../../../controller/CantusImpl";
import {CantusRenderer} from "../../../controller/CantusRenderer";
import {useNavigate} from "react-router-dom";

export default function Cantices() {
    const db = useContext(DatabaseContext);
    const [elementWidth, setElementWidth] = useState(document.getElementById("grid-item-0")?.clientWidth ?? 0);
    const [cantices, setCantices] = useState<CantusDto[] | undefined>(undefined)
    const navigate = useNavigate();


    useEffect(() => {
        db.cantus.getCanticesWithUserIdAndTimestamp().then(data => setCantices(data))
    }, []);

    useEffect(() => {
        const resize = () => {
            setElementWidth(document.getElementById("grid-item-0")?.clientWidth ?? 0);
        }
        window.addEventListener("resize", resize);
        requestAnimationFrame(resize);
        return () => {
            window.removeEventListener("resize", resize);
        }
    }, [cantices]);

    return !cantices ? <Typography variant={"h4"}>Loading...</Typography> : <Grid container spacing={2}>
        {cantices.map((cantusDto, i) => {
                const cantus = new CantusImpl(cantusDto.cantusData);
                return <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={i}>
                    <Paper elevation={3} id={`grid-item-${i}`}
                           style={{padding: 10, cursor: "pointer"}}
                           onClick={(_e) => navigate("/cantus/" + cantusDto.cantusData.uniqueId)}
                    >
                        <Typography variant="h5" style={{marginBottom: 10}}>
                            {cantus.getIncipit()}
                        </Typography>
                        <div style={{userSelect: "none", border: "1px solid black", borderRadius: 10, padding: 10}}>
                            <CantusRenderer cantus={cantus} width={elementWidth - 40} fontSize={15} maxLines={2} />
                        </div>
                    </Paper>
                </Grid>
            }
        )}
    </Grid>
}