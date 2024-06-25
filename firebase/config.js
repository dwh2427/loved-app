// import serviceAccount from "@/loved-c863b-firebase-admin.json";
// import admin from "firebase-admin";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCg0YXtbPlqx0LYTWCpnzqmdoFmtOe8EJc",
  authDomain: "loved-c863b.firebaseapp.com",
  projectId: "loved-c863b",
  storageBucket: "loved-c863b.appspot.com",
  messagingSenderId: "1045665191000",
  appId: "1:1045665191000:web:9f4962e9849b85cf18662d",
  measurementId: "G-095N36T9NE",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
