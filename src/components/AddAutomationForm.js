import React, { useState } from 'react';

function AddAutomationForm({ onAddRule, onCancel }) {
    const [ruleName, setRuleName] = useState('Follow up with Sick Members');
    const [triggerStatus, setTriggerStatus] = useState('Sick');
    const [actionType, setActionType] = useState('sendEmail');
    const [messageContent, setMessageContent] = useState('Hi {memberName},\n\nWe noticed you were feeling unwell and wanted to let you know that our church family is thinking of you and praying for a swift recovery.\n\nPlease let us know if there is anything you need.\n\nBlessings,\nYour Church');
    const [emailSubject, setEmailSubject] = useState('Thinking of you');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRule = {
            name: ruleName,
            trigger: {
                type: 'statusChange',
                status: triggerStatus,
            },
            action: {
                type: actionType,
                body: messageContent,
                ...(actionType === 'sendEmail' && { subject: emailSubject }),
            },
            createdAt: new Date(),
        };
        onAddRule(newRule);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-6">Create New Automation Rule</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Rule Name</label>
                        <input type="text" value={ruleName} onChange={e => setRuleName(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Trigger: When a member's status changes to...</label>
                        <select value={triggerStatus} onChange={e => setTriggerStatus(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <option value="Sick">Sick</option>
                            <option value="Traveled">Traveled</option>
                            <option value="On Leave">On Leave</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Action</label>
                        <select value={actionType} onChange={e => setActionType(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <option value="sendEmail">Send Email</option>
                            <option value="sendWhatsApp">Send WhatsApp</option>
                        </select>
                    </div>
                    {actionType === 'sendEmail' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Email Subject</label>
                            <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg" required />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">{actionType === 'sendEmail' ? 'Email Body' : 'WhatsApp Message'}</label>
                        <p className="text-xs text-gray-500 mb-1">You can use {'{memberName}'} as a placeholder.</p>
                        <textarea value={messageContent} onChange={e => setMessageContent(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg h-40" required></textarea>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Create Rule</button>
                </div>
            </form>
        </div>
    );
}

export default AddAutomationForm;
