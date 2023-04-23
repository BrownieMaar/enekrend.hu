import { useEffect } from "react";
import { setWindowTitle } from "../routes";

export default function Home() {

    useEffect( () => {
        setWindowTitle("Home")
    }, []);

    return <>Home</>
}