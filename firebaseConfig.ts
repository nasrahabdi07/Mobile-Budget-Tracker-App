import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCAj5JHlVim6kS8HkhBJ5qgBmFA-w-TSRA",
    authDomain: "mobile-budget-tracker.firebaseapp.com",
    projectId: "mobile-budget-tracker",
    storageBucket: "mobile-budget-tracker.firebasestorage.app",
    messagingSenderId: "498788004960",
    appId: "1:498788004960:web:9b3e73c72550b221c3bf05",
    measurementId: "G-K483H8W92L"
};

let app;

// Initialize Firebase (Compat)
if (!firebase.apps.length) {
    console.log("🔥 Initializing Firebase (Compat Mode)...");
    app = firebase.initializeApp(firebaseConfig);
} else {
    console.log("♻️ Firebase already initialized");
    app = firebase.app();
}

const auth = firebase.auth();

try {
    if (getReactNativePersistence) {
        auth.setPersistence(getReactNativePersistence(ReactNativeAsyncStorage))
            .then(() => console.log("💾 Persistence set to ASYNC_STORAGE (Native)"))
            .catch((e) => console.warn("⚠️ Persistence error:", e));
    } else {
        console.warn("⚠️ Persistence module missing. Defaulting to MEMORY.");
        auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
    }
} catch (e) {
    console.error("Auth Setup Error", e);
    auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
}

const db = firebase.firestore();

export { app, auth, db };
