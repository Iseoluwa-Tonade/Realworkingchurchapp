import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

function EmailPage({ members, showModal }) {
    const [recipients, setRecipients] = useState(new Set());
    const [recipientFilter, setRecipientFilter] = useState('all');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        let selected = new Set();
        if (recipientFilter === 'all') {
            selected = new Set(members.map(m => m.id));
        } else if (recipientFilter !== 'none' && recipientFilter !== 'individual') {
            selected = new Set(members.filter(m => m.status === recipientFilter).map(m => m.id));
        }
        setRecipients(selected);
    }, [recipientFilter, members]);

    const handleToggleRecipient = (memberId) => {
        setRecipientFilter('individual');
        setRecipients(prev => {
            const newSet = new Set(prev);
            if (newSet.has(memberId)) {
                newSet.delete(memberId);
            } else {
                newSet.add(memberId);
            }
            return newSet;
        });
    };

    const handleSendEmail = () => {
        if (recipients.size === 0) {
            showModal("Please select at least one recipient.");
            return;
        }
        if (!subject.trim() || !body.trim()) {
            showModal("Please enter a subject and a message body.");
            return;
        }
        const recipientEmails = members.filter(m => recipients.has(m.id)).map(m => m.email);

        // In a real application, this would be a call to a backend service (e.g., a Firebase Function)
        console.log("--- SIMULATING EMAIL SEND ---");
        console.log("Recipients:", recipientEmails.join(', '));
        console.log("Subject:", subject);
        console.log("Body:", body);
        console.log("-----------------------------");

        showModal(`Simulated sending email to ${recipients.size} recipient(s). Check the console for details.`);
        setSubject('');
        setBody('');
    };

    const statusFilters = ['all', 'Active', 'Sick', 'Traveled', 'On Leave', 'individual'];

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Compose Email</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4">Message Details</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="subject">Subject</label>
                        <input id="subject" type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Your email subject" className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="body">Body</label>
                        <textarea id="body" value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message here..." className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg h-64"></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleSendEmail} className="flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition">
                            <Send className="h-5 w-5 mr-2" /> Send Email
                        </button>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4">Recipients ({recipients.size})</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Filter by Status</label>
                        <select value={recipientFilter} onChange={e => setRecipientFilter(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            {statusFilters.map(filter => (
                                <option key={filter} value={filter} className="capitalize">
                                    {filter === 'individual' ? 'Select Individual' : filter}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {members.map(member => (
                            <div key={member.id} onClick={() => handleToggleRecipient(member.id)} className={`p-3 rounded-lg cursor-pointer transition flex items-center ${recipients.has(member.id) ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-50 dark:bg-gray-700'}`}>
                                <div className={`w-4 h-4 rounded-sm mr-3 border-2 flex-shrink-0 ${recipients.has(member.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}></div>
                                <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailPage;
