import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { 
  getDatabase, 
  ref, 
  query, 
  orderByChild, 
  equalTo, 
  get, 
  set, 
  push, 
  update, 
  onValue 
} from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyB8zRmlZjIheh6TvodyQpQUro7pdOBqvK8",
  authDomain: "quiick-check.firebaseapp.com",
  databaseURL: "https://quiick-check-default-rtdb.firebaseio.com",
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

export { ref, query, orderByChild, equalTo, get, set, push, update, onValue }

