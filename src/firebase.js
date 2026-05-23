import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Paste your Firebase config here after creating the project
const firebaseConfig = {
  apiKey: "AIzaSyC8cpQzKMfnCjp29-gbDU9naOWFbvkB3MM",
  authDomain: "meudashboard-4dfcc.firebaseapp.com",
  projectId: "meudashboard-4dfcc",
  storageBucket: "meudashboard-4dfcc.firebasestorage.app",
  messagingSenderId: "61463910528",
  appId: "1:61463910528:web:346165baff11b696cdae65",
  measurementId: "G-JL5SY6GFSF"
}

const isConfigured = !Object.values(firebaseConfig).includes("REPLACE_ME")

export const app = isConfigured ? initializeApp(firebaseConfig) : null
export const db = isConfigured ? getFirestore(app) : null
export const auth = isConfigured ? getAuth(app) : null
export const googleProvider = new GoogleAuthProvider()
