import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query, doc } from 'firebase/firestore';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { db } from './firebase/config';

// Import pages
import Dashboard from './pages/Dashboard';
import MembersPage from './pages/MembersPage';
import AttendancePage from './pages/AttendancePage';
import MessagingPage from './pages/MessagingPage';
import EmailPage from './pages/EmailPage';
import AutomationsPage from './pages/AutomationsPage';
import ResourcesPage from './pages/ResourcesPage';
import GivingPage from './pages/GivingPage';
import GroupsPage from './pages/GroupsPage';

// Import shared components
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';

// This is the main application content, rendered after authentication is checked.
function AppContent() {
    const { user, userId, churchId, loading } = useAuth();

    // State for the application
    const [page, setPage] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Data states
    const [churchName, setChurchName] = useState('My Church');
    const [members, setMembers] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [automations, setAutomations] = useState([]);
    const [devotions, setDevotions] = useState([]);
    const [sermons, setSermons] = useState([]);
    const [donations, setDonations] = useState([]);
    const [groups, setGroups] = useState([]);

    // Modal state
    const [modal, setModal] = useState({ show: false, message: '' });
    const showModal = (message) => setModal({ show: true, message });
    const closeModal = () => setModal({ show: false, message: '' });

    // Effect to subscribe to all Firestore data
    useEffect(() => {
        if (!user || !churchId) {
            // If there's no user or churchId, don't fetch data.
            setMembers([]);
            setAttendance([]);
            // etc. for all data states
            return;
        }

        // Using the new, centralized data paths
        const listeners = [
            onSnapshot(doc(db, `churches/${churchId}/config/main`), (doc) => { if (doc.exists()) setChurchName(doc.data().name); }),
            onSnapshot(query(collection(db, `churches/${churchId}/members`)), (snapshot) => setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))),
            onSnapshot(query(collection(db, `churches/${churchId}/attendance`)), (snapshot) => setAttendance(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))),
            onSnapshot(query(collection(db, `churches/${churchId}/automations`)), (snapshot) => setAutomations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))),
            onSnapshot(query(collection(db, `churches/${churchId}/devotions`)), (snapshot) => setDevotions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.date.toDate() - a.date.toDate()))),
            onSnapshot(query(collection(db, `churches/${churchId}/sermons`)), (snapshot) => setSermons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.date.toDate() - a.date.toDate()))),
            onSnapshot(query(collection(db, `churches/${churchId}/donations`)), (snapshot) => setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.date.toDate() - a.date.toDate()))),
            onSnapshot(query(collection(db, `churches/${churchId}/groups`)), (snapshot) => setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))))
        ];

        // Unsubscribe from all listeners on cleanup
        return () => listeners.forEach(unsub => unsub());
    }, [user, churchId]);

    const handleSetChurchName = async (name) => {
        // This function would now be part of a dedicated service, but for now we keep it here.
        const churchConfigRef = doc(db, `churches/${churchId}/config/main`);
        try {
            await setDoc(churchConfigRef, { name: name }, { merge: true });
            setChurchName(name);
        } catch (error) {
            console.error("Error setting church name:", error);
            showModal("Failed to update church name.");
        }
    };

    const renderPage = () => {
        // The logic for showing MemberProfile or GroupDetail is now handled within their respective page components.
        switch (page) {
            case 'dashboard':
                return <Dashboard attendance={attendance} members={members} donations={donations} sermons={sermons} devotions={devotions} setPage={setPage} />;
            case 'members':
                return <MembersPage members={members} userId={userId} showModal={showModal} />;
            case 'attendance':
                return <AttendancePage members={members} userId={userId} showModal={showModal} />;
            case 'messaging':
                return <MessagingPage members={members} userId={userId} showModal={showModal} />;
            case 'email':
                return <EmailPage members={members} showModal={showModal} />;
            case 'automations':
                return <AutomationsPage automations={automations} userId={userId} showModal={showModal} />;
            case 'resources':
                return <ResourcesPage devotions={devotions} sermons={sermons} showModal={showModal} />;
            case 'giving':
                return <GivingPage donations={donations} members={members} showModal={showModal} userId={userId} />;
            case 'groups':
                return <GroupsPage groups={groups} members={members} showModal={showModal} userId={userId} />;
            default:
                return <Dashboard attendance={attendance} members={members} donations={donations} sermons={sermons} devotions={devotions} setPage={setPage} />;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
    }

    if (!user) {
        // In a real app, this would be a login screen.
        return <div className="flex justify-center items-center h-screen"><p>Please log in.</p></div>;
    }

    return (
        <div className={`${isDarkMode ? 'dark' : ''}`}>
            {modal.show && <Modal message={modal.message} onClose={closeModal} />}
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
                <Sidebar
                    setPage={setPage}
                    currentPage={page}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    churchName={churchName}
                    handleSetChurchName={handleSetChurchName}
                />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}


// The root component wraps the app in the AuthProvider.
export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
