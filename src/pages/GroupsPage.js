import React, { useState } from 'react';
import { UserPlus, Users2 } from 'lucide-react';
import AddGroupForm from '../components/groups/AddGroupForm';
import GroupDetail from '../components/groups/GroupDetail';

function GroupsPage({ groups, members, showModal, userId }) {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    if (selectedGroup) {
        return <GroupDetail
            group={selectedGroup}
            members={members}
            userId={userId}
            onBack={() => setSelectedGroup(null)}
            showModal={showModal}
        />
    }

    return (
        <div>
            {showAddForm && <AddGroupForm members={members} onCancel={() => setShowAddForm(false)} showModal={showModal} userId={userId} />}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Groups</h2>
                <button onClick={() => setShowAddForm(true)} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
                    <UserPlus className="h-5 w-5 mr-2" />
                    New Group
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(group => (
                    <div key={group.id} onClick={() => setSelectedGroup(group)} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-bold">{group.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{group.description}</p>
                        <div className="flex items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
                            <Users2 className="h-4 w-4 mr-2" />
                            <span>{group.members.length} members</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GroupsPage;
