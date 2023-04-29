import Cantices from "./Cantices/Cantices";
import CantusPage from "./Cantices/CantusPage";
import NewCantus from "./Cantices/NewCantus";
import Home from "./Home/Home";
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
]

export const setWindowTitle = (title: string) => {
    document.title = title
}