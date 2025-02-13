// /firebase/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDGvkxxmZ6aOl034EBYRvMm0zmXSEO35rI",
    authDomain: "memorywall-ef97d.firebaseapp.com",
    projectId: "memorywall-ef97d",
    storageBucket: "memorywall-ef97d.firebasestorage.app",
    messagingSenderId: "658075080202",
    appId: "1:658075080202:web:566e67c29bfcfc15ce71f3",
    measurementId: "G-85RZ5JTS2K"
  };
  

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
