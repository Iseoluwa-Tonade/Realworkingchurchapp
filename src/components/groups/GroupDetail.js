import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import GroupChat from './GroupChat';

function GroupDetail({ group, members, userId, onBack }) {
    const memberMap = useMemo(() =>
        members.reduce((map, member) => {
            map[member.id] = { name: member.name, profilePicUrl: member.profilePicUrl };
            return map;
        }, {}),
    [members]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="flex items-center text-blue-500 hover:underline mr-4">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Groups
                </button>
                <h2 className="text-3xl font-bold">{group.name}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                <div className="lg:col-span-2 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <GroupChat group={group} userId={userId} memberMap={memberMap} />
                </div>
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="font-bold mb-4">Members ({group.members.length})</h3>
                    <div className="space-y-3">
                        {group.members.map(memberId => (
                            <div key={memberId} className="flex items-center">
                                <img
                                    src={memberMap[memberId]?.profilePicUrl || `https://placehold.co/40x40/E2E8F0/4A5568?text=${memberMap[memberId]?.name.charAt(0) || '?'}`}
                                    alt={memberMap[memberId]?.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/E2E8F0/4A5568?text=${memberMap[memberId]?.name.charAt(0) || '?'}`}}
                                />
                                <span className="ml-3">{memberMap[memberId]?.name || 'Unknown User'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupDetail;
