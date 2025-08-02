import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send } from 'lucide-react';
import { db, churchId } from '../../firebase/config';
import formatDate from '../../utils/formatDate';

function GroupChat({ group, userId, memberMap }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        const messagesRef = collection(db, `churches/${churchId}/groups/${group.id}/messages`);
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [group.id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messagesRef = collection(db, `churches/${churchId}/groups/${group.id}/messages`);

        await addDoc(messagesRef, {
            text: newMessage,
            senderId: userId,
            timestamp: serverTimestamp(),
        });
        setNewMessage('');
    };

    return (
        <>
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map(msg => {
                    const isSender = msg.senderId === userId;
                    const senderName = memberMap[msg.senderId]?.name || 'Unknown User';
                    return (
                        <div key={msg.id} className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-xs ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                {!isSender && <p className="text-xs font-bold mb-1">{senderName}</p>}
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 ${isSender ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {msg.timestamp ? formatDate(msg.timestamp) : 'Sending...'}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700 flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                />
                <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded-lg">
                    <Send className="h-5 w-5" />
                </button>
            </form>
        </>
    );
}

export default GroupChat;
