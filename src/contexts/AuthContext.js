import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // In a real app, you'd fetch the user's profile from your 'users' collection
                // to get their role and other app-specific data.
                // For this refactoring, we will SIMULATE this by assigning a role directly.

                // const userDocRef = doc(db, 'users', firebaseUser.uid);
                // const userDoc = await getDoc(userDocRef);
                // if (userDoc.exists()) {
                //   setUser({ uid: firebaseUser.uid, ...firebaseUser, ...userDoc.data() });
                // } else {
                //   // Handle case where user exists in Auth but not in Firestore
                //   setUser({ uid: firebaseUser.uid, ...firebaseUser, role: 'member' }); // default role
                // }

                // --- SIMULATED USER ---
                // To demonstrate RBAC, we'll hardcode a user with an 'admin' role.
                const simulatedUser = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || 'pastor@grace.org',
                    displayName: 'Pastor John',
                    role: 'admin', // Key for RBAC
                    churchId: 'grace-fellowship-main' // The church they belong to
                };
                setUser(simulatedUser);
                // --- END SIMULATION ---

            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

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
