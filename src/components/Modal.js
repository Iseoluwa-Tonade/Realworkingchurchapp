import React from 'react';

function Modal({ message, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-sm text-center">
                <p className="mb-6 text-lg">{message}</p>
                <button onClick={onClose} className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                    OK
                </button>
            </div>
        </div>
    );
}

export default Modal;
