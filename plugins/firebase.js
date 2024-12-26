// ~/plugins/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyIB_82NDxwvJd7qYqEzYe1JG_5_Qrfns",
  authDomain: "fire-cclient.firebaseapp.com",
  projectId: "fire-cclient",
  storageBucket: "fire-cclient.appspot.com",
  messagingSenderId: "963564192836",
  appId: "1:963564192836:web:8608c28b38e4b9bff26811"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);

// Create Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Export the services
export { auth, googleProvider, firestore };