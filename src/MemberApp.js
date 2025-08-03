import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { useAuth } from './contexts/AuthContext';
import { db } from './firebase/config';

// Import Member-specific pages
import ResourcesPage from './pages/ResourcesPage';
import GroupsPage from './pages/GroupsPage';
import ProfilePage from './pages/ProfilePage';

// Import shared and member-specific components
import MemberSidebar from './components/MemberSidebar';
import Modal from './components/Modal';

// This component is the main view for users with the 'member' role.
function MemberApp() {
    const { user, userId, churchId } = useAuth();

    const [page, setPage] = useState('profile'); // Default to profile page
    const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode can be a shared setting

    // Data states needed for the member view
    const [members, setMembers] = useState([]); // Needed for groups page
    const [devotions, setDevotions] = useState([]);
    const [sermons, setSermons] = useState([]);
    const [groups, setGroups] = useState([]);

    const [modal, setModal] = useState({ show: false, message: '' });
    const showModal = (message) => setModal({ show: true, message });
    const closeModal = () => setModal({ show: false, message: '' });

    // Effect to subscribe to data needed for the member view
    useEffect(() => {
        if (!user || !churchId) {
            return;
        }

        // Members only need to fetch a subset of the data
        const listeners = [
            onSnapshot(query(collection(db, `churches/${churchId}/members`)), (snapshot) => setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))),
            onSnapshot(query(collection(db, `churches/${churchId}/devotions`)), (snapshot) => setDevotions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.date.toDate() - a.date.toDate()))),
            onSnapshot(query(collection(db, `churches/${churchId}/sermons`)), (snapshot) => setSermons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.date.toDate() - a.date.toDate()))),
            onSnapshot(query(collection(db, `churches/${churchId}/groups`)), (snapshot) => setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))))
        ];

        return () => listeners.forEach(unsub => unsub());
    }, [user, churchId]);

    const renderPage = () => {
        switch (page) {
            case 'profile':
                return <ProfilePage />;
            case 'resources':
                // ResourcesPage doesn't need db/appId props anymore
                return <ResourcesPage devotions={devotions} sermons={sermons} showModal={showModal} />;
            case 'groups':
                // GroupsPage also doesn't need db/appId props
                return <GroupsPage groups={groups} members={members} showModal={showModal} userId={userId} />;
            default:
                return <ProfilePage />;
        }
    };

    return (
        <div className={`${isDarkMode ? 'dark' : ''}`}>
            {modal.show && <Modal message={modal.message} onClose={closeModal} />}
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
                <MemberSidebar
                    setPage={setPage}
                    currentPage={page}
                />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}

export default MemberApp;
