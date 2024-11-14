import { initializeApp } from "firebase/app";
import config from "../config/config";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);