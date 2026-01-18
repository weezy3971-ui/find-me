
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUImLu8KFdrGXCJ8MR2rZUbbmVeMRZLKo",
  authDomain: "findme-fa34e.firebaseapp.com",
  projectId: "findme-fa34e",
  storageBucket: "findme-fa34e.firebasestorage.app",
  messagingSenderId: "138306586462",
  appId: "1:138306586462:web:391dc95739ff74380771cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut,
  sendEmailVerification
};
