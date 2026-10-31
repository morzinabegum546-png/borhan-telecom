import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
const e = import.meta.env
const firebaseConfig = {
  apiKey: e.VITE_FIREBASE_API_KEY || 'AIzaSyC_r7Ua27n0Jwc6UH-WkcrewWiNEE_mOp0',
  authDomain: e.VITE_FIREBASE_AUTH_DOMAIN || 'borhan-telecom-d86df.firebaseapp.com',
  projectId: e.VITE_FIREBASE_PROJECT_ID || 'borhan-telecom-d86df',
  storageBucket: e.VITE_FIREBASE_STORAGE_BUCKET || 'borhan-telecom-d86df.firebasestorage.app',
  messagingSenderId: e.VITE_FIREBASE_MESSAGING_SENDER_ID || '1022670931888',
  appId: e.VITE_FIREBASE_APP_ID || '1:1022670931888:web:48dd219f0c0fe2c4b7f875',
  databaseURL: e.VITE_FIREBASE_DATABASE_URL || 'https://borhan-telecom-d86df-default-rtdb.firebaseio.com',
  measurementId: e.VITE_FIREBASE_MEASUREMENT_ID || 'G-J7PGY22FBL'
}
const app = initializeApp(firebaseConfig)
const auth = getAuth(app), db = getDatabase(app)
// stay signed in across restarts until the user taps Logout
setPersistence(auth, browserLocalPersistence).catch(() => {})
let analytics = null
isSupported().then(s => { if (s) analytics = getAnalytics(app) })
export { app, auth, db, analytics }
