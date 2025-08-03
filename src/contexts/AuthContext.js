import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, churchId } from '../firebase/config'; // Import churchId

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch the user's profile from Firestore to get their role
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                  setUser({ uid: firebaseUser.uid, ...firebaseUser, ...userDoc.data() });
                } else {
                  // This case might happen if a user is created in Auth but not Firestore
                  // We can create a default profile here or just treat them as a basic user
                  setUser({ uid: firebaseUser.uid, ...firebaseUser, role: 'member', churchId: churchId });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signup = async (email, password, name) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        // Create a user document in Firestore
        const userDocRef = doc(db, 'users', newUser.uid);
        await setDoc(userDocRef, {
            name: name,
            email: email,
            role: 'member', // Default role for new sign-ups
            churchId: churchId, // Assign them to the default church
            createdAt: new Date(),
        });

        // This will trigger onAuthStateChanged to set the user state
    };

    const login = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const value = {
        user,
        userId: user?.uid,
        role: user?.role,
        churchId: user?.churchId,
        isAuthenticated: !!user,
        loading,
        signup,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
