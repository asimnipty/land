import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyDWPtQsJioxMhzG3LmR3D1cv659y7Z4Knw",
  authDomain: "banded-adviser-7qvh5.firebaseapp.com",
  projectId: "banded-adviser-7qvh5",
  storageBucket: "banded-adviser-7qvh5.firebasestorage.app",
  messagingSenderId: "637277610894",
  appId: "1:637277610894:web:dc93ad0d75b1d662ea3adf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
