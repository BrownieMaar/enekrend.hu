// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createContext, useEffect, useState } from "react";
import { DatabaseFirestore } from "../model/DatabaseFirestore";
import { DatabaseInterface } from "../model/DatabaseInterface";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import { ROUTES } from "./Pages/routes";
import Home from "./Pages/Home/Home";
import { GoogleAuthProvider, User, getAuth, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
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
const analytics = getAnalytics(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();
const db: DatabaseFirestore = new DatabaseFirestore(app)

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


export const DatabaseContext = createContext<DatabaseInterface>(db)
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
