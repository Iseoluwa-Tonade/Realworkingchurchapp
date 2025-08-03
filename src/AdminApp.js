import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query, doc, setDoc } from 'firebase/firestore';
import { useAuth } from './contexts/AuthContext';
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

// This component contains the entire admin-facing application.
function AdminApp() {
    const { user, userId, churchId, loading } = useAuth();

    const [page, setPage] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [churchName, setChurchName] = useState('My Church');
    const [members, setMembers] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [automations, setAutomations] = useState([]);
    const [devotions, setDevotions] = useState([]);
    const [sermons, setSermons] = useState([]);
    const [donations, setDonations] = useState([]);
    const [groups, setGroups] = useState([]);

    const [modal, setModal] = useState({ show: false, message: '' });
    const showModal = (message) => setModal({ show: true, message });
    const closeModal = () => setModal({ show: false, message: '' });

    useEffect(() => {
        if (!user || !churchId) {
            return;
        }

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

        return () => listeners.forEach(unsub => unsub());
    }, [user, churchId]);

    const handleSetChurchName = async (name) => {
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

export default AdminApp;
