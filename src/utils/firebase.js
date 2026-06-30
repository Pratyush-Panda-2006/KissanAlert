import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBgeFRPmmeX-qryI89Upk7gGXHaVMpPPGI",
  authDomain: "kissan-alert.firebaseapp.com",
  projectId: "kissan-alert",
  storageBucket: "kissan-alert.firebasestorage.app",
  messagingSenderId: "128502669846",
  appId: "1:128502669846:web:345d688b5250978d644b37",
  measurementId: "G-L0TCG6Q40K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
