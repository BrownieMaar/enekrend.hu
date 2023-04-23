import { Slider } from "@mui/material";
import { CanvasTest, GuidoScriptToScore } from "./TestComponents";
import { useEffect, useState } from "react";
import { getCantusFromCantusScript } from "../../../controller/fontTools";

const testScript1 = "(M)Tho(1)mas,(12e) qui(1) dí(qQ0)ci(3)tur(4) Dí(3)dy(4t)mus,(5-:) non(5) e(5u)rat(5) cum(4) e(5)is,(4) quan(5)do(rR3) ve(2e)nit(4) Ie(eE2)sus.(1-,) Di(1)xé(1)runt(12e) á(1)li(qQ0e)i(3) di(4)scí(3)pu(4t)li:(5-:) Ví(5)di(4)mus(4) Dó(5)mi(eE2)num,(qQ0) al(1)le(eE2)lú(1)ia.(1-.)"

export default function NewCantus({ }: {}) {
    const [widthPercent, setWidthPercent] = useState(100);
    const [clientWidthContainer, setClientWidthContainer] = useState(document.getElementById("score-container")?.clientWidth ?? 0);
    const [clientWidthContainerB, setClientWidthContainerB] = useState(document.getElementById("score-container2")?.clientWidth ?? 0);
    const [cantusScript, setCantusScript] = useState(testScript1)
    const [testCantus, setTestCantus] = useState(getCantusFromCantusScript(cantusScript));
    const testCantusB = getCantusFromCantusScript("(MX)Ky(5z)ri(tT4)e(tGW1-:) e(345zZ5T4eE2W1)lé(0)i(1)son.(1-.) ");

    useEffect(() => {
        console.log("Client width: ", document.getElementById("score-container")?.clientWidth)
        requestAnimationFrame(() => {
            setClientWidthContainer(document.getElementById("score-container")?.clientWidth ?? 0);
            setClientWidthContainerB(document.getElementById("score-container2")?.clientWidth ?? 0);
        });
    }, []);


    const handleResize = (newValue: number | number[]) => {
        setWidthPercent(typeof newValue === "number" ? newValue : newValue[0])
        requestAnimationFrame(() => {
            console.log("Client width: ", document.getElementById("score-container")?.clientWidth)
            setClientWidthContainer(document.getElementById("score-container")?.clientWidth ?? 0);
            setClientWidthContainerB(document.getElementById("score-container2")?.clientWidth ?? 0);
        });
    }

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setCantusScript(e.currentTarget.value);
        const newCantus = getCantusFromCantusScript(e.currentTarget.value);
        setTestCantus(newCantus);
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "(") {
            e.preventDefault()
            const value = e.currentTarget.value
            const [startPosition, endPosition] = [e.currentTarget.selectionStart, e.currentTarget.selectionEnd]
            e.currentTarget.value = value.substring(0, e.currentTarget.selectionStart) + "()" + value.substring(e.currentTarget.selectionEnd, value.length)
            e.currentTarget.selectionEnd = startPosition + 1;
            e.currentTarget.selectionStart = endPosition + 1;
        }
        if (e.key === ")" && e.currentTarget.value[e.currentTarget.selectionStart] === ")") {
            e.preventDefault()
            e.currentTarget.selectionStart++;
            e.currentTarget.selectionEnd++;
        }
    }

    return <>
        <h1>New Cantus</h1>
        <p>Here you can create a new cantus.</p>
        <textarea rows={4} defaultValue={testScript1} style={{ width: "95%", margin: "5px" }} onInput={handleInput} onKeyDown={handleInputKeyDown} />
        <div className="BNS-textus">{testCantus.getText()}</div>
        <div style={{ width: "90%", margin: "auto" }}>
            <Slider defaultValue={100} onChange={(_e, newValue) => handleResize(newValue)} />
        </div>
        <div style={{ width: `${widthPercent}%`, border: "1px solid black", padding: "0px" }} id="score-container">
            {testCantus.Component({ width: clientWidthContainer, editable: true })}
        </div>
        <div style={{ width: `${widthPercent}%`, border: "1px solid black", padding: "0px" }} id="score-container2">
            {testCantusB.Component({ width: clientWidthContainerB, editable: true })}
        </div>
    </>
}