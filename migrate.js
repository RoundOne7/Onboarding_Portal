const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { getDatabase, ref, set } = require('firebase/database');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyB8zRmlZjIheh6TvodyQpQUro7pdOBqvK8",
  authDomain: "quiick-check.firebaseapp.com",
  databaseURL: "https://quiick-check-default-rtdb.firebaseio.com",
  projectId: "quiick-check",
  storageBucket: "quiick-check.firebasestorage.app",
  messagingSenderId: "759271228197",
  appId: "1:759271228197:web:b484afc399e85cf8f750cc",
  measurementId: "G-4S6CXH545K"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const rtdb = getDatabase(app);
const auth = getAuth(app);

const collections = [
  'hospitals',
  'doctors',
  'specializations',
  'qualifications',
  'appointments',
  'patients',
  'doctor_schedules',
  'internal_users',
  'appointment_slots',
  'profiles'
];

async function migrate() {
  console.log("Starting authenticated data migration from Cloud Firestore to Realtime Database...");
  
  try {
    console.log("Authenticating as admin...");
    await signInWithEmailAndPassword(auth, "admn@hospital.com", "Paasword");
    console.log("Authentication successful!");
  } catch (authErr) {
    console.warn("Authentication failed (migration will run unauthenticated):", authErr.message);
  }
  
  for (const col of collections) {

    console.log(`Migrating collection: '${col}'...`);
    try {
      const colRef = collection(firestore, col);
      const snap = await getDocs(colRef);
      console.log(`  Found ${snap.size} documents in Firestore.`);
      
      if (snap.size > 0) {
        let count = 0;
        for (const doc of snap.docs) {
          const docId = doc.id;
          const docData = doc.data();
          
          // Write to Realtime Database
          const rtdbRef = ref(rtdb, `${col}/${docId}`);
          await set(rtdbRef, {
            id: docId,
            ...docData
          });
          count++;
        }
        console.log(`  Successfully migrated ${count} documents for '${col}'.`);
      } else {
        console.log(`  Collection '${col}' was empty. Skipping write.`);
      }
    } catch (err) {
      console.error(`  Error migrating collection '${col}':`, err.message);
    }
  }
  
  console.log("Migration complete!");
  process.exit(0);
}

migrate();
