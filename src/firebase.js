import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCtHgNEfVYAbIHydtrhN1PQlzUQ5wWLPo",
  authDomain: "proyecto-web-papers.firebaseapp.com",
  projectId: "proyecto-web-papers",
  storageBucket: "proyecto-web-papers.firebasestorage.app",
  messagingSenderId: "215495321567",
  appId: "1:215495321567:web:6adef5130f6bf5a1e2866a",
  measurementId: "G-KV5SBCCZTM"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);