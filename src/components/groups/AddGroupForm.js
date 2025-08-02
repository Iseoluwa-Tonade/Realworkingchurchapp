import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { UserCheck } from 'lucide-react';
import { db, churchId } from '../../firebase/config';

function AddGroupForm({ members, onCancel, showModal, userId }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState(new Set());

    const handleToggleMember = (memberId) => {
        setSelectedMembers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(memberId)) {
                newSet.delete(memberId);
            } else {
                newSet.add(memberId);
            }
            return newSet;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            showModal("Please provide a group name.");
            return;
        }
        const docData = {
            name,
            description,
            members: Array.from(selectedMembers),
            createdAt: new Date()
        };
        try {
            // This path will be updated later
            await addDoc(collection(db, `artifacts/${appId}/public/data/groups`), docData);
            showModal("Group created successfully!");
            onCancel();
        } catch (error) {
            console.error("Error creating group:", error);
            showModal("Failed to create group.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl">
                <h3 className="text-2xl font-bold mb-6">Create New Group</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <input type="text" placeholder="Group Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg" required />
                        <textarea placeholder="Group Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg h-24"></textarea>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Select Members</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            {members.map(member => (
                                <div key={member.id} onClick={() => handleToggleMember(member.id)} className={`p-2 rounded-lg cursor-pointer flex items-center ${selectedMembers.has(member.id) ? 'bg-blue-100 dark:bg-blue-800' : ''}`}>
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${selectedMembers.has(member.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                                        {selectedMembers.has(member.id) && <UserCheck className="h-3 w-3 text-white" />}
                                    </div>
                                    <span className="ml-3">{member.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Create Group</button>
                </div>
            </form>
        </div>
    );
}

export default AddGroupForm;
