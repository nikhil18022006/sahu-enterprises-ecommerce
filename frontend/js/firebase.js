// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDeB2_K65-jckMT6El4Dh56ZIOmUAf6GTw",
  authDomain: "sahu-enterprises-f1bfc.firebaseapp.com",
  projectId: "sahu-enterprises-f1bfc",
  storageBucket: "sahu-enterprises-f1bfc.firebasestorage.app",
  messagingSenderId: "962344883705",
  appId: "1:962344883705:web:f146478fba63b654079928"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

export { auth };