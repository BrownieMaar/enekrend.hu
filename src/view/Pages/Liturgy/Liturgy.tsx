import { useParams } from "react-router-dom"

export default function Liturgy() {
    const { id } = useParams()

    return <>Liturgy {id}</>
}