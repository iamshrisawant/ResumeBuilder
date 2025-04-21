// scripts/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your Firebase config (replace with your actual keys)
const firebaseConfig = {
  apiKey: "AIzaSyAvxqNzTwuh1fKgifECXFTAI-T0K-fdn1k",
  authDomain: "wtresumebuilder.firebaseapp.com",
  projectId: "wtresumebuilder",
  appId: "1:183745191420:web:863a07b0a00f985290e679",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
};
