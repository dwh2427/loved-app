// Import necessary Firebase modules
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Firebase configuration
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

export { auth, firestore, RecaptchaVerifier, signInWithPhoneNumber };