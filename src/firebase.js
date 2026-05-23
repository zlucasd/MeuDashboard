import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Paste your Firebase config here after creating the project
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
}

const isConfigured = !Object.values(firebaseConfig).includes("REPLACE_ME")

export const app = isConfigured ? initializeApp(firebaseConfig) : null
export const db = isConfigured ? getFirestore(app) : null
export const auth = isConfigured ? getAuth(app) : null
export const googleProvider = new GoogleAuthProvider()
