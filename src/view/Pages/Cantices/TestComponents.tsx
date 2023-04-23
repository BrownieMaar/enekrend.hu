import { useState } from "react";
import { getCharacterWidthInPixels } from "../../../controller/fontTools";


export function CanvasTest() {
    const [widthInPx, setWidthInPx] = useState(0);
    const [cantusScript, setCantusScript] = useState("");

    const handleScriptInput = (e: React.FormEvent<HTMLInputElement>) => {
        const script = e.currentTarget.value;
        setCantusScript(script);
        const width = script.split("").map(char => getCharacterWidthInPixels(char, "Guido HU", 40)).reduce((a, b) => a + b, 0);
        setWidthInPx(width);
        writeScriptToCanvas(40, "Guido HU", script);
    }

    const writeScriptToCanvas = (fontSize: number, font: string, script: string) => {
        const canvas = document.getElementById("music-canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            console.log("No context found");
            return;
        }

        ctx.font = `${fontSize}px ${font}`;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(cantusScript, 0, fontSize);
    }

    return <div style={{ border: "1px solid black" }}>
        <input type="text" placeholder="cantus script" onInput={handleScriptInput} />
        <div className="music" style={{ fontSize: "40px" }}>{cantusScript}</div>
        <div><div style={{ width: `${widthInPx}px`, height: "50px", borderRight: "1px solid black" }}> </div></div>
        <p>Width: {widthInPx} px</p>
        <canvas id="music-canvas" />
    </div>
}

export function GuidoScriptToScore() {
    const [script, setScript] = useState("(M)Tho(1)mas,(12e) qui(1) dí(qQ0)ci(3)tur(4) Dí(3)dy(4t)mus,(5-,)");
    
    const handleScriptInput = (e: React.FormEvent<HTMLInputElement>) => {
        setScript(" " + e.currentTarget.value);
        console.table({music: music, text: text})
    }
    
    function splitCharacters(str: string): [string[], string[]] {
        const regularStrings: string[] = [];
        const parensChars: string[] = [];
        let inParens = false;
        let escape = false;
        let currentStr = '';

        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            if (char === '(' && !escape) {
                if (currentStr) {
                    regularStrings.push(currentStr);
                    currentStr = '';
                }
                inParens = true;
            } else if (char === ')' && !escape) {
                inParens = false;
                parensChars.push(currentStr);
                currentStr = '';
            } else {
                if (char === '\\' && !escape) {
                    escape = true;
                } else {
                    if (inParens) {
                        currentStr += char;
                    } else {
                        currentStr += char;
                        if ((i === str.length - 1 || str.charAt(i + 1) === '(') && !escape) {
                            regularStrings.push(currentStr);
                            currentStr = '';
                        }
                    }
                    escape = false;
                }
            }
        }


        return [regularStrings, parensChars];
    }


    const [text, music] = splitCharacters(script);

    return <div style={{ border: "1px solid black", minHeight: "10rem", padding: ".5rem" }}>
        <input type="text" placeholder="cantus script" style={{width: "95%"}} defaultValue={"(M)Tho(1)mas,(12e) qui(1) dí(qQ0)ci(3)tur(4) Dí(3)dy(4t)mus,(5-,)"} onInput={handleScriptInput} />
        <div className="music" style={{ fontSize: "40px" }}>{music.join("---")}</div>
        <div style={{ fontSize: "20px" }}>{text}</div>
    </div>
}