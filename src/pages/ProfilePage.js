import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { User, HeartPulse, Plane, Briefcase, Save } from 'lucide-react';

// This page is for members to view their own profile and update their status.
function ProfilePage() {
    const { user, userId, churchId } = useAuth();
    const [memberData, setMemberData] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId || !churchId) return;

        // Find the member document that corresponds to the logged-in user's email.
        // In a more robust system, the user's profile might directly link to their member ID.
        // For now, we assume the user's email is a unique identifier in the members collection.
        // This is a simplification. A better approach would be to store the memberID on the user object.
        // For now, let's assume the user's UID is the same as their Member ID for simplicity.
        const memberRef = doc(db, `churches/${churchId}/members`, userId);

        const unsubscribe = onSnapshot(memberRef, (doc) => {
            if (doc.exists()) {
                const data = { id: doc.id, ...doc.data() };
                setMemberData(data);
                setStatus(data.status || 'Active');
            } else {
                // Handle case where no member profile exists for this user
                setMemberData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId, churchId]);

    const handleStatusUpdate = async () => {
        if (!memberData) return;
        const memberRef = doc(db, `churches/${churchId}/members`, memberData.id);
        try {
            await updateDoc(memberRef, {
                status: status,
                lastUpdatedAt: new Date(),
            });
            alert("Status updated successfully!");
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    const statusOptions = [
        { value: 'Active', label: 'Active', icon: User },
        { value: 'Sick', label: 'Sick', icon: HeartPulse },
        { value: 'Traveled', label: 'Traveled', icon: Plane },
        { value: 'On Leave', label: 'On Leave', icon: Briefcase },
    ];

    if (loading) {
        return <div className="text-center p-4">Loading Profile...</div>;
    }

    if (!memberData) {
        return <div className="text-center p-4">Could not find a member profile for {user.email}. Please contact an administrator.</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-row items-center md:items-start">
                <img
                    src={memberData.profilePicUrl || `https://placehold.co/150x150/E2E8F0/4A5568?text=${memberData.name.charAt(0)}`}
                    alt={memberData.name}
                    className="w-36 h-36 rounded-full object-cover border-4 border-blue-200 dark:border-blue-700"
                />
                <div className="md:ml-8 mt-6 md:mt-0 text-center md:text-left">
                    <h2 className="text-4xl font-bold">{memberData.name}</h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">{memberData.email}</p>
                    <p className="text-lg text-gray-500 dark:text-gray-400">{memberData.phone}</p>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">My Status:</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                            {statusOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                    </div>

                     <div className="mt-6">
                        <button onClick={handleStatusUpdate} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition flex items-center">
                            <Save className="h-5 w-5 mr-2"/> Update My Status
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
