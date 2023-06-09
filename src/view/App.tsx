// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {createContext} from "react";
import {UserDaoFirebase} from "../model/UserDaoFirebase";
import {UserDao} from "../model/UserDao";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Layout from "./Pages/Layout";
import {ROUTES} from "./Pages/routes";
import {getAuth, GoogleAuthProvider, signInWithPopup, User} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {CantusDaoFirebase} from "../model/CantusDaoFirebase";
import {CantusDao} from "../model/CantusDao";
import {LiturgyDao} from "../model/LiturgyDao";
import {LiturgyDaoFirebase} from "../model/LiturgyDaoFirebase";
import {CodexDaoFirebase} from "../model/CodexDaoFirebase";
import {CodexDao} from "../model/CodexDao";
import {ThemeProvider, useMediaQuery} from "@mui/material";
import {enekrendThemeDark, enekrendThemeLight} from "./Themes";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = {
    user: new UserDaoFirebase(app) as UserDao,
    cantus: new CantusDaoFirebase(app) as CantusDao,
    liturgy: new LiturgyDaoFirebase(app) as LiturgyDao,
    codex: new CodexDaoFirebase(app) as CodexDao,
}

const googlePopUpSignIn = async () => {
    const res = await signInWithPopup(auth, provider)

    try {
        if (await db.user.AddUser(res.user)) {
            console.log("User added to database")
        }
    } catch (error) {
        console.error(error)
    }

    return res.user.uid
}
const signOut = () => auth.signOut()

export const DatabaseContext = createContext<typeof db>(db)
export const UserContext = createContext<User | null | undefined>(null)


function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [user] = useAuthState(auth)

    return <DatabaseContext.Provider value={db}>
        <UserContext.Provider value={user}>
            <ThemeProvider theme={prefersDarkMode ? enekrendThemeDark : enekrendThemeLight}>
                <Router>
                    <Routes>
                        <Route element={<Layout signIn={googlePopUpSignIn} signOut={signOut}/>}>
                            {ROUTES.map((route, index) => <Route key={index} path={route.path}
                                                                 element={route.element}/>)}
                        </Route>
                    </Routes>
                </Router>
            </ThemeProvider>
        </UserContext.Provider>
    </DatabaseContext.Provider>
}

export default App
