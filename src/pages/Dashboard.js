import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, CalendarCheck, DollarSign, ArrowRight } from 'lucide-react';

function Dashboard({ attendance, members, donations, sermons, devotions, setPage }) {
    const [period, setPeriod] = useState('monthly');
    const membersCount = members.length;
    const totalGiving = useMemo(() => donations.reduce((sum, d) => sum + d.amount, 0), [donations]);
    const membersToFollowUp = useMemo(() => members.filter(m => m.status === 'Sick' || m.status === 'Traveled'), [members]);
    const recentDonations = useMemo(() => donations.slice(0, 5), [donations]);
    const memberMap = useMemo(() => members.reduce((map, member) => { map[member.id] = member.name; return map; }, {}), [members]);

    const chartData = useMemo(() => {
        const data = {};
        attendance.forEach(record => {
            const recordDate = record.date?.toDate ? record.date.toDate() : new Date(record.date);
            if(isNaN(recordDate.getTime())) return;
            let key;
            if (period === 'weekly') {
                const weekStart = new Date(recordDate);
                weekStart.setDate(recordDate.getDate() - recordDate.getDay());
                key = weekStart.toLocaleDateString('en-CA');
            } else if (period === 'monthly') {
                key = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
            } else { key = recordDate.getFullYear().toString(); }
            if (!data[key]) data[key] = { name: key, attendance: 0 };
            data[key].attendance += record.headcount || (record.presentMembers ? record.presentMembers.length : 0);
        });
        return Object.values(data).sort((a, b) => a.name.localeCompare(b.name));
    }, [attendance, period]);

    const stats = [
        { title: 'Total Members', value: membersCount, icon: Users, color: 'text-blue-500' },
        { title: 'Avg Attendance', value: chartData.length > 0 ? Math.round(chartData.reduce((acc, item) => acc + item.attendance, 0) / chartData.length) : 0, icon: CalendarCheck, color: 'text-green-500' },
        { title: 'Total Giving', value: `$${totalGiving.toLocaleString()}`, icon: DollarSign, color: 'text-yellow-500' },
    ];
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <div key={stat.title} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                        <div className={`p-3 rounded-full bg-opacity-20 ${stat.color.replace('text-', 'bg-')}`}><stat.icon className={`h-8 w-8 ${stat.color}`} /></div>
                        <div className="ml-4">
                            <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="font-bold mb-4">Follow Ups ({membersToFollowUp.length})</h3>
                    <div className="space-y-3">
                        {membersToFollowUp.length > 0 ? membersToFollowUp.map(member => (
                            <div key={member.id} className="flex items-center justify-between text-sm">
                                <p>{member.name}</p>
                                <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${member.status === 'Sick' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{member.status}</span>
                            </div>
                        )) : <p className="text-sm text-gray-500">No members need follow up.</p>}
                    </div>
                </div>
                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="font-bold mb-4">Recent Giving</h3>
                    <div className="space-y-3">
                        {recentDonations.length > 0 ? recentDonations.map(d => (
                             <div key={d.id} className="flex items-center justify-between text-sm">
                                <p>{memberMap[d.memberId] || 'Unknown'}</p>
                                <p className="font-semibold">${d.amount.toFixed(2)}</p>
                            </div>
                        )) : <p className="text-sm text-gray-500">No recent donations.</p>}
                    </div>
                </div>
                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="font-bold mb-4">Latest Resources</h3>
                    <div className="space-y-3">
                        {devotions.length > 0 && (
                             <div onClick={() => setPage('resources')} className="text-sm cursor-pointer group">
                                <p className="text-gray-500 text-xs">DEVOTION</p>
                                <p className="font-semibold group-hover:text-blue-500 flex items-center">{devotions[0].title} <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" /></p>
                            </div>
                        )}
                        {sermons.length > 0 && (
                             <div onClick={() => setPage('resources')} className="text-sm cursor-pointer group">
                                <p className="text-gray-500 text-xs">SERMON</p>
                                <p className="font-semibold group-hover:text-blue-500 flex items-center">{sermons[0].title} <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" /></p>
                            </div>
                        )}
                         {sermons.length === 0 && devotions.length === 0 && <p className="text-sm text-gray-500">No resources added yet.</p>}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Attendance Trends</h3>
                    <div className="flex space-x-2">
                        <button onClick={() => setPeriod('weekly')} className={`px-3 py-1 text-sm rounded ${period === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Weekly</button>
                        <button onClick={() => setPeriod('monthly')} className={`px-3 py-1 text-sm rounded ${period === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Monthly</button>
                        <button onClick={() => setPeriod('yearly')} className={`px-3 py-1 text-sm rounded ${period === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Yearly</button>
                    </div>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                            <XAxis dataKey="name" /><YAxis />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: 'rgba(128, 128, 128, 0.5)', color: '#fff' }}/>
                            <Legend /><Bar dataKey="attendance" fill="#3b82f6" name="Total Attendance" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
