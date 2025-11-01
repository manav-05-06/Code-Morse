// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLJ3Az5yx4je1ppwZJKrWikXOFg-LbpIM",
  authDomain: "morse-code-6549a.firebaseapp.com",
  projectId: "morse-code-6549a",
  storageBucket: "morse-code-6549a.firebasestorage.app",
  messagingSenderId: "561405376505",
  appId: "1:561405376505:web:36b14aea004f866592af28",
  measurementId: "G-SD7YT8ET0G"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
