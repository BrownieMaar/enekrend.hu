import Cantices from "./Cantices/Cantices";
import CantusPage from "./Cantices/CantusPage";
import NewCantus from "./Cantices/NewCantus";
import Home from "./Home/Home";
import Liturgies from "./Liturgy/Liturgies";
import Liturgy from "./Liturgy/Liturgy";
import NewLiturgy from "./Liturgy/NewLiturgy";
import Profile from "./Profile/Profile";

export const ROUTES = [
    {
        path: '/',
        element: <Home />,
        mainPath: false,
        name: "Home"
    },
    {
        path: '/profile/:uid',
        element: <Profile />,
        mainPath: false,
        name: "Profile"
    },
    {
        path: '/cantices',
        element: <Cantices />,
        mainPath: true,
        name: "Cantices"
    },
    {
        path: "/cantus/new",
        element: <NewCantus />,
        mainPath: false,
        name: "NewCantus"
    },
    {
        path: '/cantus/:id',
        element: <CantusPage />,
        mainPath: false,
        name: "CantusPage"
    },
    {
        path: '/liturgy/:id',
        element: <Liturgy />,
        mainPath: false,
        name: "Liturgy Page"
    },
    {
        path: '/liturgy/new',
        element: <NewLiturgy />,
        mainPath: false,
        name: "New Liturgy"
    },
    {
        path: '/liturgies',
        element: <Liturgies />,
        mainPath: true,
        name: "Liturgies"
    },
]

export const setWindowTitle = (title: string) => {
    document.title = title
}