import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDCIrqf96Qvzgg3R6udQPFAk4O7vz28NQU",
    authDomain: "funds-app-d5671.firebaseapp.com",
    projectId: "funds-app-d5671",
    storageBucket: "funds-app-d5671.appspot.com",
    messagingSenderId: "501604709262",
    appId: "1:501604709262:web:38ae3a6f133fb640c12adf",
    measurementId: "G-14KCNWDEF1"
};

export const app = initializeApp(firebaseConfig);