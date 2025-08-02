import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import AddMemberForm from '../components/AddMemberForm';
import MemberProfile from '../components/MemberProfile';

// This page component now manages its own state, including the selected member.
// This is a cleaner approach than managing it in the top-level App component.
function MembersPage({ members, userId, showModal }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    // If a member is selected, render the profile view.
    if (selectedMember) {
        return <MemberProfile
            member={selectedMember}
            setSelectedMember={setSelectedMember}
            userId={userId}
            showModal={showModal}
        />
    }

    // Otherwise, render the list of members.
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Church Members</h2>
                <button onClick={() => setShowAddForm(true)} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
                    <UserPlus className="h-5 w-5 mr-2" /> Add Member
                </button>
            </div>
            {showAddForm && <AddMemberForm setShowAddForm={setShowAddForm} userId={userId} showModal={showModal} />}
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                    {members.map(member => (
                        <div key={member.id} onClick={() => setSelectedMember(member)} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center text-center">
                            <img src={member.profilePicUrl || `https://placehold.co/100x100/E2E8F0/4A5568?text=${member.name.charAt(0)}`} alt={member.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-200 dark:border-gray-600" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/E2E8F0/4A5568?text=${member.name.charAt(0)}`}}/>
                            <h4 className="font-bold text-lg">{member.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                            {member.status && (<span className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full ${member.status === 'Sick' ? 'bg-red-200 text-red-800' : member.status === 'Traveled' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{member.status}</span>)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MembersPage;
