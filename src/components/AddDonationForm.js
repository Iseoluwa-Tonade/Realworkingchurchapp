import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, churchId } from '../firebase/config';

function AddDonationForm({ members, onCancel, showModal, userId }) {
    const [memberId, setMemberId] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [fund, setFund] = useState('Tithes & Offerings');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!memberId || !amount || !date || !fund) {
            showModal("Please fill out all fields.");
            return;
        }
        const docData = {
            memberId,
            amount: parseFloat(amount),
            date: new Date(date),
            fund
        };
        try {
            // This path will be updated later
            await addDoc(collection(db, `artifacts/${appId}/public/data/donations`), docData);
            showModal("Donation recorded successfully!");
            onCancel();
        } catch (error) {
            console.error("Error recording donation:", error);
            showModal("Failed to record donation.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-6">Record a Donation</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Member</label>
                        <select value={memberId} onChange={e => setMemberId(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg" required>
                            <option value="">Select a member...</option>
                            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount ($)</label>
                        <input type="number" placeholder="50.00" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Fund</label>
                        <select value={fund} onChange={e => setFund(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg" required>
                            <option>Tithes & Offerings</option>
                            <option>Building Fund</option>
                            <option>Missions</option>
                            <option>Special Event</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Record Donation</button>
                </div>
            </form>
        </div>
    );
}

export default AddDonationForm;
