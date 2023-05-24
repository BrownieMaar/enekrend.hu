import Cantices from "./Cantices/Cantices";
import CantusPage from "./Cantices/CantusPage";
import NewCantus from "./Cantices/NewCantus";
import Home from "./Home/Home";
import NewLiturgy from "./Liturgies/NewLiturgy";
import Profile from "./Profile/Profile";

type Route = {
    path: string;
    element: JSX.Element;
    mainPath: boolean;
    name: string;
}

const CANTUS_ROUTES: Route[] = [
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
]

const LITURGY_ROUTES: Route[] = [
    {
        path: "/liturgy/new",
        element: <NewLiturgy />,
        mainPath: false,
        name: "NewLiturgy",
    },
]

export const ROUTES: Route[] = [
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
    ...CANTUS_ROUTES,
    ...LITURGY_ROUTES,
]


export const setWindowTitle = (title: string) => {
    document.title = title
}