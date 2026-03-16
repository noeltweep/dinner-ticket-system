import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBP6h0AM3XdUuGAolDwTA1GzqtMXOotwe4",
  authDomain: "dinnernight-da674.firebaseapp.com",
  projectId: "dinnernight-da674",
  storageBucket: "dinnernight-da674.firebasestorage.app",
  messagingSenderId: "552954408587",
  appId: "1:552954408587:web:9d7b8cf2cbdc3b5a886e8e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);