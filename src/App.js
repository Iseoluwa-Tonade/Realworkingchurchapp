import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import App Views
import AdminApp from './AdminApp';
import MemberApp from './MemberApp';

// Import Auth Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

// A wrapper for routes that require authentication.
// If the user is not authenticated, they are redirected to the login page.
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}

// This component determines which main application to show based on the user's role.
function RoleBasedRouter() {
    const { role } = useAuth();

    if (role === 'admin') {
        return <AdminApp />;
    }

    if (role === 'member') {
        return <MemberApp />;
    }

    // If the role is not determined yet or is something else, show a loading or error state.
    // For a new user, their role might take a moment to sync from Firestore.
    return <div className="flex justify-center items-center h-screen"><p>Loading user role...</p></div>;
}


// The root component that defines the application's routes.
export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <RoleBasedRouter />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
