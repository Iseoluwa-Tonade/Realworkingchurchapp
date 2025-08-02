import React, { useState, useMemo } from 'react';
import { Church, Users, UserPlus, CalendarCheck, BarChart3, MessageSquare, Sun, Moon, LogOut, Edit, Save, XCircle, Mail, Zap, BookOpenCheck, DollarSign, Users2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const allNavItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', roles: ['admin', 'leader', 'member'] },
    { id: 'members', icon: Users, label: 'Members', roles: ['admin', 'leader'] },
    { id: 'groups', icon: Users2, label: 'Groups', roles: ['admin', 'leader', 'member'] },
    { id: 'attendance', icon: CalendarCheck, label: 'Attendance', roles: ['admin', 'leader'] },
    { id: 'giving', icon: DollarSign, label: 'Giving', roles: ['admin'] },
    { id: 'resources', icon: BookOpenCheck, label: 'Resources', roles: ['admin', 'leader', 'member'] },
    { id: 'messaging', icon: MessageSquare, label: 'Messaging', roles: ['admin', 'leader'] },
    { id: 'email', icon: Mail, label: 'Email', roles: ['admin', 'leader'] },
    { id: 'automations', icon: Zap, label: 'Automations', roles: ['admin'] },
];

function Sidebar({ setPage, currentPage, isDarkMode, setIsDarkMode, churchName, handleSetChurchName }) {
    const { role, logout } = useAuth();
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(churchName);

    const navItems = useMemo(() => {
        return allNavItems.filter(item => item.roles.includes(role));
    }, [role]);

    const onNameSave = () => {
        handleSetChurchName(newName);
        setIsEditingName(false);
    }

    return (
        <nav className="w-16 md:w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-center md:justify-start p-4 border-b border-gray-200 dark:border-gray-700 h-[65px]">
                    <Church className="h-8 w-8 text-blue-500" />
                    <div className="ml-4 hidden md:block">
                        {isEditingName ? (
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="bg-gray-200 dark:bg-gray-700 text-sm p-1 rounded w-32"
                                    autoFocus
                                />
                                <Save className="h-4 w-4 ml-2 cursor-pointer text-green-500" onClick={onNameSave} />
                                <XCircle className="h-4 w-4 ml-1 cursor-pointer text-red-500" onClick={() => setIsEditingName(false)} />
                            </div>
                        ) : (
                             <div className="flex items-center">
                                <h1 className="text-lg font-bold text-gray-700 dark:text-gray-200">{churchName}</h1>
                                <Edit className="h-4 w-4 ml-2 cursor-pointer text-gray-400 hover:text-blue-500" onClick={() => { setNewName(churchName); setIsEditingName(true); }} />
                            </div>
                        )}
                    </div>
                </div>
                <ul>
                    {navItems.map(item => (
                        <li key={item.id} className="mt-2">
                            <a
                                href="#"
                                onClick={(e) => {e.preventDefault(); setPage(item.id)}}
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
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center p-2 rounded-lg w-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span className="ml-4 hidden md:block">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button onClick={logout} className="flex items-center p-2 mt-2 rounded-lg w-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <LogOut className="h-5 w-5" />
                    <span className="ml-4 hidden md:block">Logout</span>
                </button>
            </div>
        </nav>
    );
}

export default Sidebar;
