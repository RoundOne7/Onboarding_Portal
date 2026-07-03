import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyB8zRmlZjIheh6TvodyQpQUro7pdOBqvK8",
  authDomain: "quiick-check.firebaseapp.com",
  projectId: "quiick-check",
  storageBucket: "quiick-check.firebasestorage.app",
  messagingSenderId: "759271228197",
  appId: "1:759271228197:web:b484afc399e85cf8f750cc",
  measurementId: "G-4S6CXH545K"
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getDatabase(app)
export const storage = getStorage(app)
