import React, { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { UserPlus, Trash2 } from 'lucide-react';
import AddDevotionForm from '../components/AddDevotionForm';
import AddSermonForm from '../components/AddSermonForm';
import formatDate from '../utils/formatDate';

import { db, churchId } from '../firebase/config';
import formatDate from '../utils/formatDate';

function ResourcesPage({ devotions, sermons, showModal }) {
    const [activeTab, setActiveTab] = useState('devotions');
    const [showAddDevotion, setShowAddDevotion] = useState(false);
    const [showAddSermon, setShowAddSermon] = useState(false);

    const handleDelete = async (type, id) => {
        const collectionName = type === 'devotion' ? 'devotions' : 'sermons';
        const docRef = doc(db, `churches/${churchId}/${collectionName}`, id);
        try {
            await deleteDoc(docRef);
            showModal(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            showModal(`Failed to delete ${type}.`);
        }
    };

    return (
        <div>
            {showAddDevotion && <AddDevotionForm onCancel={() => setShowAddDevotion(false)} showModal={showModal} />}
            {showAddSermon && <AddSermonForm onCancel={() => setShowAddSermon(false)} showModal={showModal} />}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Resources</h2>
                <button
                    onClick={() => activeTab === 'devotions' ? setShowAddDevotion(true) : setShowAddSermon(true)}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                >
                    <UserPlus className="h-5 w-5 mr-2" /> Add New {activeTab === 'devotions' ? 'Devotion' : 'Sermon'}
                </button>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button onClick={() => setActiveTab('devotions')} className={`px-4 py-2 text-lg font-medium ${activeTab === 'devotions' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}>
                    Daily Devotions
                </button>
                <button onClick={() => setActiveTab('sermons')} className={`px-4 py-2 text-lg font-medium ${activeTab === 'sermons' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}>
                    Sermon Outlines
                </button>
            </div>

            {activeTab === 'devotions' && (
                <div className="space-y-4">
                    {devotions.map(item => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative">
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{formatDate(item.date)} - {item.scripture}</p>
                            <p className="whitespace-pre-wrap">{item.body}</p>
                            <button onClick={() => handleDelete('devotion', item.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'sermons' && (
                <div className="space-y-4">
                    {sermons.map(item => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative">
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{formatDate(item.date)} - Speaker: {item.speaker}</p>
                            <p className="whitespace-pre-wrap">{item.outline}</p>
                            <button onClick={() => handleDelete('sermon', item.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ResourcesPage;
