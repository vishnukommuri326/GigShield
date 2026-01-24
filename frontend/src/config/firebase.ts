// frontend/src/config/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDt5KJbF2q17R1qlK0C-YMUly0Ves0n3KY",
  authDomain: "gigshield-22319.firebaseapp.com",
  projectId: "gigshield-22319",
  storageBucket: "gigshield-22319.firebasestorage.app",
  messagingSenderId: "246609720480",
  appId: "1:246609720480:web:09a5540f2dc162fc41c5c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;