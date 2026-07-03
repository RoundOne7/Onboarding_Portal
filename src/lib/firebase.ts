import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query as fsQuery, 
  where 
} from 'firebase/firestore'

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
export const db = getFirestore(app)
export const storage = getStorage(app)

// ----------------------------------------------------
// REALTIME DATABASE EMULATION ON FIRESTORE
// ----------------------------------------------------

export function ref(dbInstance: any, path?: string) {
  return { db: dbInstance, path: path || '' }
}

export function query(refObj: any, ...constraints: any[]) {
  return { ...refObj, constraints }
}

export function orderByChild(childPath: string) {
  return { type: 'orderBy', path: childPath }
}

export function equalTo(value: any) {
  return { type: 'equalTo', value }
}

export async function get(queryOrRef: any) {
  const path = queryOrRef.path
  const dbInstance = queryOrRef.db
  
  const parts = path.split('/').filter(Boolean)
  
  if (parts.length === 0) {
    throw new Error("Invalid path")
  }
  
  // If it's a doc-level path (even number of parts, e.g. 'hospitals/hosp-1')
  if (parts.length % 2 === 0) {
    const docRef = doc(dbInstance, parts[0], parts.slice(1).join('/'))
    const snap = await getDoc(docRef)
    return {
      exists: () => snap.exists(),
      val: () => snap.exists() ? { id: snap.id, ...snap.data() } : null,
      key: snap.id,
      forEach: (callback: (child: any) => void) => {}
    }
  } else {
    // It's a collection-level path (odd number of parts, e.g. 'hospitals')
    const colRef = collection(dbInstance, parts[0])
    let q: any = colRef
    
    // Apply constraints if it's a query
    if (queryOrRef.constraints) {
      let whereField: string | null = null
      let whereValue: any = null
      
      for (const constr of queryOrRef.constraints) {
        if (constr.type === 'orderBy') {
          whereField = constr.path
        } else if (constr.type === 'equalTo') {
          whereValue = constr.value
        }
      }
      
      if (whereField && whereValue !== undefined) {
        q = fsQuery(colRef, where(whereField, '==', whereValue))
      }
    }
    
    const snap = await getDocs(q)
    const resultVal: any = {}
    snap.forEach(d => {
      resultVal[d.id] = { id: d.id, ...d.data() }
    })
    
    return {
      exists: () => !snap.empty,
      val: () => snap.empty ? null : resultVal,
      forEach: (callback: (child: any) => void) => {
        snap.forEach(d => {
          callback({
            key: d.id,
            val: () => ({ id: d.id, ...d.data() })
          })
        })
      }
    }
  }
}

export async function set(refObj: any, value: any) {
  const parts = refObj.path.split('/').filter(Boolean)
  const col = parts[0]
  const docPath = parts.slice(1).join('/')
  
  if (parts.length % 2 === 0) {
    const docRef = doc(refObj.db, col, docPath)
    if (value === null) {
      await deleteDoc(docRef)
    } else {
      await setDoc(docRef, value, { merge: true })
    }
  } else {
    // If setting a whole collection
    if (value === null) {
      const colRef = collection(refObj.db, col)
      const snap = await getDocs(colRef)
      const promises = snap.docs.map(d => deleteDoc(d.ref))
      await Promise.all(promises)
    } else {
      const colRef = collection(refObj.db, col)
      const promises = Object.keys(value).map(key => {
        return setDoc(doc(colRef, key), value[key])
      })
      await Promise.all(promises)
    }
  }
}

export async function push(refObj: any, value?: any) {
  const parts = refObj.path.split('/').filter(Boolean)
  const colRef = collection(refObj.db, parts[0])
  const newDocRef = doc(colRef)
  
  if (value) {
    const newItem = { ...value, id: newDocRef.id }
    await setDoc(newDocRef, newItem)
  }
  
  return {
    key: newDocRef.id,
    ref: { db: refObj.db, path: `${parts[0]}/${newDocRef.id}` }
  }
}

export async function update(refObj: any, values: any) {
  const parts = refObj.path.split('/').filter(Boolean)
  
  if (parts.length % 2 === 0) {
    const docRef = doc(refObj.db, parts[0], parts.slice(1).join('/'))
    await updateDoc(docRef, values)
  } else {
    const promises = Object.keys(values).map(async (keyPath) => {
      const keyParts = keyPath.split('/')
      const docId = keyParts[0]
      const docRef = doc(refObj.db, parts[0], docId)
      
      if (keyParts.length > 1) {
        const fieldName = keyParts.slice(1).join('.')
        await updateDoc(docRef, { [fieldName]: values[keyPath] })
      } else {
        await setDoc(docRef, values[keyPath], { merge: true })
      }
    })
    await Promise.all(promises)
  }
}

export function onValue(queryOrRef: any, callback: (snapshot: any) => void, cancelCallback?: (error: any) => void) {
  const parts = queryOrRef.path.split('/').filter(Boolean)
  const col = parts[0]
  const docPath = parts.slice(1).join('/')
  
  if (parts.length % 2 === 0) {
    const docRef = doc(queryOrRef.db, col, docPath)
    return onSnapshot(docRef, (snap) => {
      callback({
        exists: () => snap.exists(),
        val: () => snap.exists() ? { id: snap.id, ...snap.data() } : null,
        key: snap.id
      })
    }, cancelCallback)
  } else {
    const colRef = collection(queryOrRef.db, col)
    return onSnapshot(colRef, (snap) => {
      const resultVal: any = {}
      snap.forEach(d => {
        resultVal[d.id] = { id: d.id, ...d.data() }
      })
      callback({
        exists: () => !snap.empty,
        val: () => snap.empty ? null : resultVal,
        forEach: (cb: (child: any) => void) => {
          snap.forEach(d => {
            cb({
              key: d.id,
              val: () => ({ id: d.id, ...d.data() })
            })
          })
        }
      })
    }, cancelCallback)
  }
}
