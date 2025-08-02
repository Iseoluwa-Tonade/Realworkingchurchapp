import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, churchId } from '../firebase/config';

function AddDevotionForm({ onCancel, showModal }) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [scripture, setScripture] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const docData = { title, date: new Date(date), scripture, body };
        try {
            await addDoc(collection(db, `churches/${churchId}/devotions`), docData);
            showModal("Devotion added successfully!");
            onCancel();
        } catch (error) {
            console.error("Error adding devotion:", error);
            showModal("Failed to add devotion.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-6">New Daily Devotion</h3>
                <div className="space-y-4">
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg" required />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg" required />
                    <input type="text" placeholder="Scripture (e.g., John 3:16)" value={scripture} onChange={e => setScripture(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg" required />
                    <textarea placeholder="Devotion body..." value={body} onChange={e => setBody(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg h-40" required></textarea>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Add Devotion</button>
                </div>
            </form>
        </div>
    );
}

export default AddDevotionForm;
