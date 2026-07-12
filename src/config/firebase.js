import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
export const firebaseConfig = {
  apiKey: "AIzaSyA_EOPHGYMV8z1itWvL9yEXanGnnjiZaYM",
  authDomain: "iedc-cuk.firebaseapp.com",
  projectId: "iedc-cuk",
  storageBucket: "iedc-cuk.firebasestorage.app",
  messagingSenderId: "1081319258572",
  appId: "1:1081319258572:web:918de8b922cb3a9f764569",
  measurementId: "G-PTSYHKBC1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services your app needs
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;