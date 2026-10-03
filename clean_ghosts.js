import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSy...", // Not needed for admin sdk? Wait, I'll just use my token script or admin sdk
};
