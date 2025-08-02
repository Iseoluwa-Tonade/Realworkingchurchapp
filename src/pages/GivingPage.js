import React, { useState, useMemo } from 'react';
import { UserPlus } from 'lucide-react';
import AddDonationForm from '../components/AddDonationForm';
import formatDate from '../utils/formatDate';

function GivingPage({ donations, members, showModal, userId }) {
    const [showAddForm, setShowAddForm] = useState(false);

    const memberMap = useMemo(() =>
        members.reduce((map, member) => {
            map[member.id] = member.name;
            return map;
        }, {}),
    [members]);

    return (
        <div>
            {showAddForm && <AddDonationForm members={members} onCancel={() => setShowAddForm(false)} showModal={showModal} userId={userId} />}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Giving Records</h2>
                <button onClick={() => setShowAddForm(true)} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Record Donation
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4">Date</th>
                            <th className="p-4">Member</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Fund</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map(d => (
                            <tr key={d.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="p-4">{formatDate(d.date)}</td>
                                <td className="p-4">{memberMap[d.memberId] || 'Unknown Member'}</td>
                                <td className="p-4">${d.amount.toFixed(2)}</td>
                                <td className="p-4">{d.fund}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GivingPage;
