import React, { useState } from 'react';
import { User, HeartPulse, Plane, Briefcase, ArrowLeft, Save, Trash2 } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, churchId } from '../../firebase/config';
import formatDate from '../utils/formatDate';

function MemberProfile({ member, setSelectedMember, userId, showModal }) {
    const [status, setStatus] = useState(member.status || 'Active');
    const [whatsAppOptIn, setWhatsAppOptIn] = useState(!!member.whatsAppOptIn);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const statusOptions = [
        { value: 'Active', label: 'Active', icon: User },
        { value: 'Sick', label: 'Sick', icon: HeartPulse },
        { value: 'Traveled', label: 'Traveled', icon: Plane },
        { value: 'On Leave', label: 'On Leave', icon: Briefcase },
    ];

    const handleSaveChanges = async () => {
        const memberRef = doc(db, `churches/${churchId}/members`, member.id);
        try {
            await updateDoc(memberRef, {
                status: status,
                whatsAppOptIn: whatsAppOptIn,
                lastUpdatedBy: userId,
                lastUpdatedAt: new Date(),
            });
            showModal("Changes saved successfully!");
        } catch (error) {
            console.error("Error saving changes:", error);
            showModal("Failed to save changes.");
        }
    };

    const handleDelete = async () => {
        setShowConfirmDelete(false);
        const memberRef = doc(db, `churches/${churchId}/members`, member.id);
        try {
            await deleteDoc(memberRef);
            setSelectedMember(null); // Go back to the list view
            showModal("Member deleted successfully.");
        } catch (error) {
            console.error("Error deleting member:", error);
            showModal("Failed to delete member.");
        }
    }

    return (
        <>
            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-sm text-center">
                        <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-300">Do you really want to delete {member.name}? This action cannot be undone.</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setShowConfirmDelete(false)} className="px-6 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400">Cancel</button>
                            <button onClick={handleDelete} className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl relative">
                <button onClick={() => setSelectedMember(null)} className="absolute top-4 left-4 flex items-center text-blue-500 hover:underline"><ArrowLeft className="h-4 w-4 mr-1" /> Back to List</button>
                <div className="flex flex-col md:flex-row items-center md:items-start mt-10">
                    <img src={member.profilePicUrl || `https://placehold.co/150x150/E2E8F0/4A5568?text=${member.name.charAt(0)}`} alt={member.name} className="w-36 h-36 rounded-full object-cover border-4 border-blue-200 dark:border-blue-700" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x150/E2E8F0/4A5568?text=${member.name.charAt(0)}`}}/>
                    <div className="md:ml-8 mt-6 md:mt-0 text-center md:text-left">
                        <h2 className="text-4xl font-bold">{member.name}</h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">{member.email}</p>
                        <p className="text-lg text-gray-500 dark:text-gray-400">{member.phone}</p>
                        <p className="text-sm text-gray-400 mt-2">Joined: {formatDate(member.joinedDate)}</p>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status:</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                {statusOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                            </select>
                        </div>
                        <div className="mt-4 flex items-center">
                            <input type="checkbox" id="profile-whatsapp-opt-in" checked={whatsAppOptIn} onChange={e => setWhatsAppOptIn(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            <label htmlFor="profile-whatsapp-opt-in" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Agrees to receive WhatsApp messages</label>
                        </div>
                         <div className="mt-6">
                            <button onClick={handleSaveChanges} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition flex items-center"><Save className="h-5 w-5 mr-2"/> Save Changes</button>
                        </div>
                    </div>
                </div>
                 <div className="absolute top-4 right-4"><button onClick={() => setShowConfirmDelete(true)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900"><Trash2 className="h-5 w-5"/></button></div>
            </div>
        </>
    );
}

export default MemberProfile;
