import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, churchId } from '../firebase/config';

function AttendancePage({ members, userId, showModal }) {
    const [mode, setMode] = useState('individual');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [headcount, setHeadcount] = useState('');
    const [presentMembers, setPresentMembers] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    const handleToggleMember = (memberId) => {
        setPresentMembers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(memberId)) {
                newSet.delete(memberId);
            } else {
                newSet.add(memberId);
            }
            return newSet;
        });
    };

    const handleSubmit = async () => {
        const attendanceRef = collection(db, `churches/${churchId}/attendance`);
        const attendanceDate = new Date(date);
        attendanceDate.setUTCHours(12, 0, 0, 0); // Normalize date to avoid timezone issues

        try {
            if (mode === 'headcount' && headcount > 0) {
                await addDoc(attendanceRef, {
                    date: attendanceDate,
                    type: 'headcount',
                    headcount: parseInt(headcount, 10),
                    recordedBy: userId
                });
                showModal('Headcount attendance saved!');
                setHeadcount('');
            } else if (mode === 'individual' && presentMembers.size > 0) {
                await addDoc(attendanceRef, {
                    date: attendanceDate,
                    type: 'individual',
                    presentMembers: Array.from(presentMembers),
                    headcount: presentMembers.size,
                    recordedBy: userId
                });
                showModal('Individual attendance saved!');
                setPresentMembers(new Set());
            } else {
                showModal('No attendance data to save.');
            }
        } catch (error) {
            console.error("Error saving attendance:", error);
            showModal('Failed to save attendance.');
        }
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Take Attendance</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                    <div className="flex space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <button onClick={() => setMode('individual')} className={`px-4 py-2 text-sm font-medium rounded-md ${mode === 'individual' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Individual</button>
                        <button onClick={() => setMode('headcount')} className={`px-4 py-2 text-sm font-medium rounded-md ${mode === 'headcount' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Headcount</button>
                    </div>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 border rounded-lg bg-gray-100 dark:bg-gray-700" />
                </div>
                {mode === 'individual' ? (
                    <div>
                        <input type="text" placeholder="Search for a member..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                            {filteredMembers.map(member => (
                                <div key={member.id} onClick={() => handleToggleMember(member.id)} className={`p-3 rounded-lg cursor-pointer transition flex items-center ${presentMembers.has(member.id) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                    <div className={`w-4 h-4 rounded-full mr-3 border-2 ${presentMembers.has(member.id) ? 'bg-white border-white' : 'border-gray-400'}`}></div>
                                    <span className="font-medium">{member.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className="block text-lg font-medium mb-2">Total Attendance Count</label>
                        <input type="number" value={headcount} onChange={e => setHeadcount(e.target.value)} placeholder="e.g., 150" className="w-full p-3 text-2xl bg-gray-100 dark:bg-gray-700 rounded-lg" />
                    </div>
                )}
                <div className="mt-8 flex justify-end"><button onClick={handleSubmit} className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition text-lg font-bold">Save Attendance</button></div>
            </div>
        </div>
    );
}

export default AttendancePage;
