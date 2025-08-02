import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore';
import formatDate from '../utils/formatDate';

import { db, churchId } from '../firebase/config';

function MessagingPage({ members, userId, showModal }) {
    const [selectedMember, setSelectedMember] = useState(null);
    const [message, setMessage] = useState('');
    const [communicationLog, setCommunicationLog] = useState([]);

    useEffect(() => {
        if (!selectedMember) return;

        const logRef = collection(db, `churches/${churchId}/members/${selectedMember.id}/communicationLog`);
        const q = query(logRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            logs.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
            setCommunicationLog(logs);
        }, (err) => {
            console.error("Error fetching communication log:", err);
            showModal("Failed to load communication history.");
        });

        return () => unsubscribe();
    }, [selectedMember, showModal]);

    const handleSendMessage = async () => {
        if (!selectedMember || !message) {
            showModal('Please select a member and write a message.');
            return;
        }
        const logRef = collection(db, `churches/${churchId}/members/${selectedMember.id}/communicationLog`);
        try {
            await addDoc(logRef, {
                message: message,
                timestamp: new Date(),
                loggedBy: userId, // Changed 'sentBy' to 'loggedBy' for clarity
                channel: 'Internal Note'
            });
            showModal('Message logged successfully!');
            setMessage('');
        } catch (error) {
            console.error('Error logging message:', error);
            showModal('Failed to log message.');
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Bespoke Messaging</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-3">Select a Member</h3>
                    <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                        {members.map(member => (
                            <li key={member.id} onClick={() => setSelectedMember(member)} className={`p-3 rounded-lg cursor-pointer ${selectedMember?.id === member.id ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                {member.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    {selectedMember ? (
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Contacting: {selectedMember.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Email: {selectedMember.email}</p>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Phone: {selectedMember.phone}</p>
                            <div className="mb-4">
                                <h4 className="font-bold mb-2">Log a new message or note:</h4>
                                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Write a message or note for ${selectedMember.name}...`} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg h-32"></textarea>
                                <button onClick={handleSendMessage} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">Log Communication</button>
                            </div>
                            <hr className="my-6 dark:border-gray-600"/>
                            <div>
                                <h4 className="font-bold mb-4">Communication History</h4>
                                <ul className="space-y-4 max-h-80 overflow-y-auto">
                                    {communicationLog.length > 0 ? (
                                        communicationLog.map(log => (
                                            <li key={log.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="text-sm">{log.message}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                    {formatDate(log.timestamp)} - {log.channel}
                                                </p>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No communication history for this member.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Please select a member to view messaging options.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessagingPage;
