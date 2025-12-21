import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
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
