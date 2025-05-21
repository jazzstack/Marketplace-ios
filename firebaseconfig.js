// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-gRJvCpbdeVvViEVX46mwPuIiJIeMKOA",
    authDomain: "tutorial-a62a2.firebaseapp.com",
    projectId: "tutorial-a62a2",
    storageBucket: "tutorial-a62a2.firebasestorage.app",
    messagingSenderId: "650791339305",
    appId: "1:650791339305:web:c9fa29b0b29d0cac06e338"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);