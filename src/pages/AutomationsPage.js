import React, { useState } from 'react';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { UserPlus, Bot, Trash2 } from 'lucide-react';
import AddAutomationForm from '../components/AddAutomationForm';

import { db, churchId } from '../firebase/config';
import AddAutomationForm from '../components/AddAutomationForm';

function AutomationsPage({ automations, userId, showModal }) {
    const [showAddForm, setShowAddForm] = useState(false);

    const handleAddRule = async (rule) => {
        const automationsRef = collection(db, `churches/${churchId}/automations`);
        try {
            await addDoc(automationsRef, { ...rule, createdBy: userId });
            showModal("Automation rule created successfully!");
            setShowAddForm(false);
        } catch (error) {
            console.error("Error adding automation rule:", error);
            showModal("Failed to create automation rule.");
        }
    };

    const handleDeleteRule = async (ruleId) => {
        const ruleRef = doc(db, `churches/${churchId}/automations`, ruleId);
        try {
            await deleteDoc(ruleRef);
            showModal("Automation rule deleted.");
        } catch (error) {
            console.error("Error deleting rule:", error);
            showModal("Failed to delete rule.");
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Automations</h2>
                <button onClick={() => setShowAddForm(true)} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
                    <UserPlus className="h-5 w-5 mr-2" />New Rule
                </button>
            </div>
            {showAddForm && <AddAutomationForm onAddRule={handleAddRule} onCancel={() => setShowAddForm(false)} />}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Active Rules</h3>
                {automations.length > 0 ? (
                    <div className="space-y-4">
                        {automations.map(rule => (
                            <div key={rule.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                    <Bot className="h-8 w-8 text-blue-500 mr-4"/>
                                    <div>
                                        <p className="font-semibold">{rule.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            When a member's status is set to <span className="font-medium text-red-500">'{rule.trigger.status}'</span>, send a {rule.action.type === 'sendWhatsApp' ? 'WhatsApp message' : 'Email'}.
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteRule(rule.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900">
                                    <Trash2 className="h-5 w-5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">You have no active automation rules.</p>
                        <p className="text-gray-500 text-sm">Click "New Rule" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AutomationsPage;
