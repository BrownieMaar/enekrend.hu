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
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "enekrend-hu.firebaseapp.com",
  projectId: "enekrend-hu",
  storageBucket: "enekrend-hu.appspot.com",
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();
const db: UserDaoFirebase = new UserDaoFirebase(app)

const googlePopUpSignIn = async () => {
  const res = await signInWithPopup(auth, provider)

  try {
    if (await db.AddUser(res.user)) {
      console.log("User added to database")
    }
  } catch (error) {
    console.error(error)
  }

  return res.user.uid
}
const signOut = () => auth.signOut()


export const DatabaseContext = createContext<UserDao>(db)
export const UserContext = createContext<User | null | undefined>(null)



function App() {
  const [user] = useAuthState(auth)

  return <DatabaseContext.Provider value={db}>
    <UserContext.Provider value={user}>
      <Router>
        <Routes>
          <Route element={<Layout signIn={googlePopUpSignIn} signOut={signOut} />} >
            {ROUTES.map((route, index) => <Route key={index} path={route.path} element={route.element} />)}
          </Route>
        </Routes>
      </Router>
    </UserContext.Provider>
  </DatabaseContext.Provider>
}

export default App
