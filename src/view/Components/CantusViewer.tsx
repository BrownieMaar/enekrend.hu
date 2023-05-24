import {Cantus, CantusData, ToneOptionsWithLabels} from "../../model/types/CantusTypes";
import {Box, Divider, Link, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import {CantusImpl} from "../../controller/CantusImpl";
import {useEffect, useState} from "react";
import {CantusRenderer} from "../../controller/CantusRenderer";
import { GenreOptionsWithLabels } from "../../model/types/LiturgyTypes";

export default function CantusViewer({cantusData}: { cantusData: CantusData }) {
    const isMoreThanLg = useMediaQuery(useTheme().breakpoints.up('lg'));
    const [containerWidth, setContainerWidth] = useState(document.getElementById("cantus-component-container")?.clientWidth ?? 200)
    const cantus: Cantus = new CantusImpl(cantusData)

    useEffect(() => {
        const handleResize = () => {
            const width = document.getElementById("cantus-component-container")?.clientWidth;
            if (width) setContainerWidth(width);
        }
        window.addEventListener('resize', handleResize)
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, []);

    return <Stack direction={isMoreThanLg ? "row" : "column"} spacing={2}>

        <Stack spacing={2} flexGrow={1}>
            <Typography variant={"body1"}>
                <b>Genre:</b> {GenreOptionsWithLabels.find(genre => cantus.genre === genre.value)?.label ??
                <i>unknown</i>}
            </Typography>
            <Typography variant={"body1"}>
                <b>Cantus ID:</b> {cantus.cantusId ? <Link href={`https://cantusindex.org/id/${cantus.cantusId}`} target={"_blank"}>{cantus.cantusId}</Link> : <i>unknown</i>}
            </Typography>
            <Typography variant={"body1"}>
                <b>Tone:</b> {ToneOptionsWithLabels.find(tone => cantus.tone === tone.value)?.label + "." ??
                <i>unknown</i>}
            </Typography>
            <Typography variant={"body1"}>
                <b>Bible quote:</b> {
                cantus.bibleQuote && cantus.bibleQuote.length !== 0
                    ? cantus.bibleQuote.map((bibleQuote) => {
                        return `${bibleQuote.book} ${bibleQuote.startChapter},${bibleQuote.startVerse}-${bibleQuote.endChapter},${bibleQuote.endVerse}`
                    }).join("; ")
                    : <i>unknown</i>
            }
            </Typography>
            {
                cantus.notes
                    ? <Typography variant={"body1"}>
                        <b>Notes:</b> {cantus.notes ?? <i>unknown</i>}
                    </Typography>
                    : undefined
            }
        </Stack>

        <Divider orientation={isMoreThanLg ? "vertical" : "horizontal"} flexItem/>

        <Box
            flexGrow={1}
            id={"cantus-component-container"}
        >
            <CantusRenderer width={containerWidth} cantus={cantus}/>
        </Box>

    </Stack>
}