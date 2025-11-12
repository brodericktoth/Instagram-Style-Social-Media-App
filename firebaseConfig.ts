// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCc3xLSG95D4-qdTQzyx1khf0Ejtit37kE",
  authDomain: "sproject2025-13d24.firebaseapp.com",
  projectId: "sproject2025-13d24",
  storageBucket: "sproject2025-13d24.firebasestorage.app",
  messagingSenderId: "176833091469",
  appId: "1:176833091469:web:87a3ae397489f3c0e90fc4",
  measurementId: "G-6M1K7Z95XJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FIREBASE_STORAGE = getStorage(app);
export const FIREBASE_DB = getFirestore(app);
export const FIREBASE_AUTH = getAuth(app);