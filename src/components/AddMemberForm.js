import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, churchId } from '../../firebase/config';

function AddMemberForm({ setShowAddForm, userId, showModal }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [whatsAppOptIn, setWhatsAppOptIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email) {
            showModal("Please fill in at least name and email.");
            return;
        }
        try {
            const membersRef = collection(db, `churches/${churchId}/members`);
            await addDoc(membersRef, {
                name,
                email,
                phone,
                profilePicUrl,
                status: 'Active',
                whatsAppOptIn,
                joinedDate: new Date(),
                createdBy: userId,
            });
            setShowAddForm(false);
            showModal("Member added successfully!");
        } catch (error) {
            console.error("Error adding member:", error);
            showModal("Failed to add member.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6">New Member Registration</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg" required />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg" required />
                    <input type="tel" placeholder="Phone Number (for WhatsApp)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                    <input type="text" placeholder="Profile Picture URL" value={profilePicUrl} onChange={e => setProfilePicUrl(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                    <div className="flex items-center">
                        <input type="checkbox" id="whatsapp-opt-in" checked={whatsAppOptIn} onChange={e => setWhatsAppOptIn(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                        <label htmlFor="whatsapp-opt-in" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Member agrees to receive WhatsApp messages.</label>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Add Member</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMemberForm;
