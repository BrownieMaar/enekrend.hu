import { Autocomplete, Box, Button, Divider, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { CantusImpl } from "../../controller/CantusRenderer"
import { BibleBooksWithLabels, BibleQuote, CantusData, Genre, GenreOptionsWithLabels, Tone, ToneOptionsWithLabels } from "../../model/types/CantusTypes"
import { useEffect, useState } from "react"

interface CantusEditorProps {
    onSave: (cantusData: CantusData) => void
    onCancel: () => void
    cantusData?: CantusData
    loggedIn?: boolean
}

export default function CantusEditor({ onSave, onCancel, cantusData, loggedIn }: CantusEditorProps) {
    const [cantus, setCantus] = useState(new CantusImpl(cantusData));
    const [melodyContainerWidth, setMelodyContainerWidth] = useState(document.getElementById("cantus-component-container")?.clientWidth ?? 200);

    const updateCantus = {
        genre: (genre?: Genre) => {
            const newCantus = new CantusImpl(cantus.getCantusData());
            newCantus.genre = genre;
            setCantus(newCantus);
        },
        cantusId: (cantusId: string) => {
            const newCantus = new CantusImpl(cantus.getCantusData());
            newCantus.cantusId = cantusId;
            setCantus(newCantus);
        },
        tone: (tone?: Tone) => {
            const newCantus = new CantusImpl(cantus.getCantusData());
            newCantus.tone = tone;
            setCantus(newCantus);
        },
        notes: (notes: string) => {
            const newCantus = new CantusImpl(cantus.getCantusData());
            newCantus.notes = notes;
            setCantus(newCantus);
        },
        bibleQuote: (index: number, bibleQuote: BibleQuote) => {
            const newCantus = new CantusImpl(cantus.getCantusData());
            if (!newCantus.bibleQuote) newCantus.bibleQuote = [];
            newCantus.bibleQuote[index] = bibleQuote;
            setCantus(newCantus);
        },
    }

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


    return <Stack gap={3} marginTop={2}>
        <Stack direction="row" gap={2} flexWrap={"wrap"}>
            <Typography variant="h4" sx={{ minWidth: "fit-content", flexGrow: 10 }}>
                {cantus.getIncipit().trim().length === 0 ? <em>[New Cantus]</em>
                    :
                    <>{cantus.genre ? cantus.genre + ". " : ""}{cantus.getIncipit()}</>
                }
            </Typography>
            <Stack direction="row" gap={2} flexGrow={1} >
                <Button fullWidth size="large" variant="contained" onClick={() => onCancel()}>Cancel</Button>
                <Tooltip title={loggedIn ? "" : "You need to be logged in to save data."}>
                    <Box sx={{width: "100%"}}>
                        <Button fullWidth disabled={!loggedIn} size="large" variant="contained" color="success" onClick={() => onSave(cantus.getCantusData())}>Save</Button>
                    </Box>
                </Tooltip>
            </Stack>
        </Stack>
        <Stack direction="row" gap={2} flexWrap={"wrap"}>
            <Autocomplete
                disablePortal
                options={GenreOptionsWithLabels}
                sx={{ minWidth: 200, flexGrow: 1 }}
                renderInput={(params) => <TextField {...params} label="Genre" />}
                onChange={(_e, newValue) => newValue?.value ? updateCantus.genre(newValue?.value) : updateCantus.genre(undefined)}
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
                onInput={(e) => updateCantus.cantusId((e.target as HTMLInputElement).value)}
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
                onChange={(_e, newValue) => newValue?.value ? updateCantus.tone(newValue?.value) : updateCantus.tone(undefined)}
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
                        onChange={(_e, newValue) => newValue && newValue.value ? updateCantus.bibleQuote(index, { ...bibleQuote, book: newValue.value }) : updateCantus.bibleQuote(index, { ...bibleQuote, book: undefined })}
                    />
                    <TextField
                        label="Start Chapter"
                        type="number"
                        sx={{ minWidth: 125, flexGrow: 1 }}
                        value={bibleQuote.startChapter}
                        onInput={(e) => updateCantus.bibleQuote(index, { ...bibleQuote, startChapter: (e.target as HTMLInputElement).valueAsNumber || undefined })}
                    />
                    <TextField
                        label="Start Verse"
                        type="number"
                        sx={{ minWidth: 125, flexGrow: 1 }}
                        value={bibleQuote.startVerse}
                        onInput={(e) => updateCantus.bibleQuote(index, { ...bibleQuote, startVerse: (e.target as HTMLInputElement).valueAsNumber || undefined })}
                    />
                    <TextField
                        label="End Chapter"
                        type="number"
                        sx={{ minWidth: 125, flexGrow: 1 }}
                        value={bibleQuote.endChapter}
                        onInput={(e) => updateCantus.bibleQuote(index, { ...bibleQuote, endChapter: (e.target as HTMLInputElement).valueAsNumber || undefined })}
                    />
                    <TextField
                        label="End Verse"
                        type="number"
                        sx={{ minWidth: 125, flexGrow: 1 }}
                        value={bibleQuote.endVerse}
                        onInput={(e) => updateCantus.bibleQuote(index, { ...bibleQuote, endVerse: (e.target as HTMLInputElement).valueAsNumber || undefined })}
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
            onInput={(e) => updateCantus.notes((e.target as HTMLInputElement).value)}
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
            {cantus.Component({ width: melodyContainerWidth - 30, editable: true })}
        </Box>
    </Stack>
}