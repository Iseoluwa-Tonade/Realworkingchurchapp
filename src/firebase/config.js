import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// These global variables are provided by the environment, or should be in a .env file.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

// This would be dynamically determined based on the logged-in user.
// For this refactoring, we'll hardcode it to represent a single church instance.
export const churchId = 'grace-fellowship-main';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };
