import React from 'react';
import { BookOpenCheck, Users2, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function MemberSidebar({ setPage, currentPage }) {
    const { user, logout } = useAuth();

    const navItems = [
        { id: 'profile', icon: User, label: 'My Profile' },
        { id: 'groups', icon: Users2, label: 'My Groups' },
        { id: 'resources', icon: BookOpenCheck, label: 'Resources' },
    ];

    return (
        <nav className="w-16 md:w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-center md:justify-start p-4 border-b border-gray-200 dark:border-gray-700 h-[65px]">
                    <User className="h-8 w-8 text-blue-500" />
                    <div className="ml-4 hidden md:block">
                        <h1 className="text-lg font-bold text-gray-700 dark:text-gray-200">{user?.name || 'Member'}</h1>
                    </div>
                </div>
                <ul>
                    {navItems.map(item => (
                        <li key={item.id} className="mt-2">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setPage(item.id) }}
                                className={`flex items-center p-4 text-sm ${currentPage === item.id ? 'bg-blue-50 dark:bg-gray-700 text-blue-500 border-r-4 border-blue-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="ml-4 hidden md:block">{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={logout} className="flex items-center p-2 mt-2 rounded-lg w-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <LogOut className="h-5 w-5" />
                    <span className="ml-4 hidden md:block">Logout</span>
                </button>
            </div>
        </nav>
    );
}

export default MemberSidebar;
