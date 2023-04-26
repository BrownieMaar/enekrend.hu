import { Autocomplete, Box, Button, Divider, FormControl, FormHelperText, FormLabel, Input, InputLabel, OutlinedInput, Stack, TextField, Typography } from "@mui/material"
import { CantusImpl } from "../../controller/CantusRenderer"
import { BibleBooksWithLabels, BibleQuote, CantusData, GenreOptionsWithLabels, ToneOptionsWithLabels } from "../../model/types/CantusTypes"
import { useEffect, useState } from "react"

interface CantusEditorProps {
    onSave: (cantusData: CantusData) => void
    onCancel: () => void
    cantusData?: CantusData
}

export default function CantusEditor({ onSave, onCancel, cantusData }: CantusEditorProps) {
    const [cantus, setCantus] = useState(new CantusImpl(cantusData));
    const [melodyContainerWidth, setMelodyContainerWidth] = useState(document.getElementById("cantus-component-container")?.clientWidth ?? 200);

    useEffect(() => {
        const handleResize = () => {
            const width = document.getElementById("cantus-component-container")?.clientWidth;
            if (width) setMelodyContainerWidth(width);
        }
        window.addEventListener("resize", handleResize);
        requestAnimationFrame(() => handleResize());
        return () => window.removeEventListener("resize", handleResize);
    }, [])

    
    const deleteBibleQuote = (index: number) => {
        const newCantus = new CantusImpl(cantus.getCantusData());
        if (!newCantus.bibleQuote) return
        newCantus.bibleQuote.splice(index, 1);
        setCantus(newCantus);
    }


    return <Stack gap={3}>
        <Typography variant="h4">{cantus.genre ? cantus.genre + ". " : ""}{cantus.getIncipit()}</Typography>
        <Stack direction="row" gap={2} flexWrap={"wrap"}>
            <Autocomplete
                disablePortal
                options={GenreOptionsWithLabels}
                sx={{ minWidth: 200, flexGrow: 1 }}
                renderInput={(params) => <TextField {...params} label="Genre" />}
            />
            <TextField
                label="Incipit"
                sx={{ minWidth: 300, flexGrow: 10 }}
                value={cantus.getIncipit().trim()}
                InputProps={{
                    readOnly: true,
                }}
            />
        </Stack>
        <Stack direction="row" gap={2} flexWrap={"wrap"}>
            <TextField
                label="Cantus ID"
                sx={{ minWidth: 200, flexGrow: 1 }}
                value={cantus.cantusId}
            />
            <TextField
                label="Source Book"
                sx={{ minWidth: 300, flexGrow: 1 }}
                disabled
            />
            <Autocomplete
                disablePortal
                options={ToneOptionsWithLabels}
                sx={{ minWidth: 200, flexGrow: 1 }}
                renderInput={(params) => <TextField {...params} label="Tone" />}
            />
        </Stack>
        {
            cantus.bibleQuote && cantus.bibleQuote?.length !== 0 && <>
                <Divider textAlign="left">Bible quotes</Divider>
                {cantus.bibleQuote?.map((bibleQuote, index) => <Stack direction={"row"} gap={2} flexWrap={"wrap"} >
                    <Autocomplete
                        disablePortal
                        options={BibleBooksWithLabels}
                        sx={{ minWidth: 200, flexGrow: 5 }}
                        renderInput={(params) => <TextField {...params} label="Book" />}
                    />
                    <TextField
                        label="Start Chapter"
                        type="number"
                        sx={{ minWidth: 125, flexGrow: 1 }}
                        value={bibleQuote.startChapter}
                    />
                    <TextField
                        label="Start Verse"
                        type="number"
                        sx={{ minWidth: 125, flexGrow: 1 }}
                        value={bibleQuote.startVerse}
                    />
                    <TextField
                        label="End Chapter"
                        type="number"
                        sx={{ minWidth: 125, flexGrow: 1 }}
                        value={bibleQuote.endChapter}
                    />
                    <TextField
                        label="End Verse"
                        type="number"
                        sx={{ minWidth: 125, flexGrow: 1 }}
                        value={bibleQuote.endVerse}
                    />
                    <Button
                        onClick={(_e) => deleteBibleQuote(index)}
                        variant="contained"
                        color="error"
                    >Delete</Button>
                </Stack>)}</>
        }
        <Button onClick={(_e) => {
            const newCantus = new CantusImpl(cantus.getCantusData());
            if (!newCantus.bibleQuote) newCantus.bibleQuote = [];
            newCantus.bibleQuote.push({} as BibleQuote);
            setCantus(newCantus);
        }}>Add Bible quote</Button>
        <TextField
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={cantus.notes}
        />
        <Divider textAlign="left">Melody</Divider>
        <Box
            sx={{
                flexGrow: 1,
                border: "1px solid #0000003b",
                borderRadius: "5px",
                padding: "15px",
                "&:hover": {
                    border: "1px solid #black",
                },
            }}
            id="cantus-component-container"
        >
            {cantus.Component({width: melodyContainerWidth - 30, editable: true})}
        </Box>
    </Stack>
}