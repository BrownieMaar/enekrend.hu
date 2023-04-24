import { Grid, Paper, Typography } from "@mui/material"
import { getCantusFromCantusScript } from "../../../controller/fontTools"
import { useEffect, useState } from "react"

const mockData = [
    getCantusFromCantusScript("(MX)Ky(5z)ri(tT4)e(tGW1-:) e(345zZ5T4eE2W1)lé(0)i(1)son.(1-.) "),
    getCantusFromCantusScript("(M)Tho(1)mas,(12e) qui(1) dí(qQ0)ci(3)tur(4) Dí(3)dy(4t)mus,(5-:) non(5) e(5u)rat(5) cum(4) e(5)is,(4) quan(5)do(rR3) ve(2e)nit(4) Ie(eE2)sus.(1-,) Di(1)xé(1)runt(12e) á(1)li(qQ0e)i(3) di(4)scí(3)pu(4t)li:(5-:) Ví(5)di(4)mus(4) Dó(5)mi(eE2)num,(qQ0) al(1)le(eE2)lú(1)ia.(1-.)"),
    getCantusFromCantusScript("(MX)Ky(5z)ri(tT4)e(tGW1-:) e(345zZ5T4eE2W1)lé(0)i(1)son.(1-.) "),
    getCantusFromCantusScript("(M)Tho(1)mas,(12e) qui(1) dí(qQ0)ci(3)tur(4) Dí(3)dy(4t)mus,(5-:) non(5) e(5u)rat(5) cum(4) e(5)is,(4) quan(5)do(rR3) ve(2e)nit(4) Ie(eE2)sus.(1-,) Di(1)xé(1)runt(12e) á(1)li(qQ0e)i(3) di(4)scí(3)pu(4t)li:(5-:) Ví(5)di(4)mus(4) Dó(5)mi(eE2)num,(qQ0) al(1)le(eE2)lú(1)ia.(1-.)"),
    getCantusFromCantusScript("(MX)Ky(5z)ri(tT4)e(tGW1-:) e(345zZ5T4eE2W1)lé(0)i(1)son.(1-.) "),
    getCantusFromCantusScript("(M)Tho(1)mas,(12e) qui(1) dí(qQ0)ci(3)tur(4) Dí(3)dy(4t)mus,(5-:) non(5) e(5u)rat(5) cum(4) e(5)is,(4) quan(5)do(rR3) ve(2e)nit(4) Ie(eE2)sus.(1-,) Di(1)xé(1)runt(12e) á(1)li(qQ0e)i(3) di(4)scí(3)pu(4t)li:(5-:) Ví(5)di(4)mus(4) Dó(5)mi(eE2)num,(qQ0) al(1)le(eE2)lú(1)ia.(1-.)"),
    getCantusFromCantusScript("(MX)Ky(5z)ri(tT4)e(tGW1-:) e(345zZ5T4eE2W1)lé(0)i(1)son.(1-.) "),
    getCantusFromCantusScript("(M)Tho(1)mas,(12e) qui(1) dí(qQ0)ci(3)tur(4) Dí(3)dy(4t)mus,(5-:) non(5) e(5u)rat(5) cum(4) e(5)is,(4) quan(5)do(rR3) ve(2e)nit(4) Ie(eE2)sus.(1-,) Di(1)xé(1)runt(12e) á(1)li(qQ0e)i(3) di(4)scí(3)pu(4t)li:(5-:) Ví(5)di(4)mus(4) Dó(5)mi(eE2)num,(qQ0) al(1)le(eE2)lú(1)ia.(1-.)"),
]

export default function Cantices() {
    const [elementWidth, setElementWidth] = useState(document.getElementById("grid-item-0")?.clientWidth ?? 0);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setElementWidth(document.getElementById("grid-item-0")?.clientWidth ?? 0);
        });
        requestAnimationFrame(() => {
            setElementWidth(document.getElementById("grid-item-0")?.clientWidth ?? 0);
        });
    }, []);

    return <Grid container spacing={2}>
        {mockData.map((cantus, i) =>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={i}>
                <Paper elevation={3} id={`grid-item-${i}`} style={{ padding: 10, cursor: "pointer" }}>
                    <Typography variant="h5" style={{ marginBottom: 10 }}>
                        {cantus.getIncipit()}
                    </Typography>
                    <div style={{userSelect: "none", border: "1px solid black", borderRadius: 10, padding: 10}}>
                        {cantus.Component({ width: elementWidth - 40, fontSize: 15, maxLines: 2 })}
                    </div>
                </Paper>
            </Grid>
        )}
    </Grid>
}