'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Calendar, Gamepad2, Bell } from 'lucide-react';
import SnakeGame from '@/components/SnakeGame';
import ShiftTimer from '@/components/ShiftTimer';

export default function MemberPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'shifts' | 'arcade'>('shifts');
    const [pastShifts, setPastShifts] = useState<any[]>([]);
    const [upcomingShifts, setUpcomingShifts] = useState<any[]>([]);
    
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            api.get('/shifts/my-history').then(res => setPastShifts(res.data)).catch(() => toast.error('Failed to load past shifts'));
            api.get('/shifts/my-upcoming').then(res => setUpcomingShifts(res.data)).catch(() => toast.error('Failed to load upcoming shifts'));
        }
    }, [user]);

    if (loading || !user) return null;

    return (
        <div className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-space font-bold text-white mb-2">My Space</h1>
                    <p className="text-slate-400">View your history and take a break</p>
                </div>
            </motion.div>

            {/* Upcoming Shifts Banner */}
            {upcomingShifts.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-r from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Bell className="text-indigo-400" /> Assigned Shifts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingShifts.map(shift => (
                            <div key={shift.id} className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex flex-col justify-between shadow-lg">
                                <div className="mb-4">
                                    <h3 className="font-bold text-lg text-white mb-1">
                                        {shift.shift_type === 'morning' ? '🌅 Morning' : shift.shift_type === 'evening' ? '🌇 Evening' : '🌙 Night'}
                                    </h3>
                                    <p className="text-slate-400 text-sm">{new Date(shift.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                </div>
                                <ShiftTimer shift={shift} />
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <div className="flex gap-4 border-b border-slate-700">
                <button 
                    onClick={() => setActiveTab('shifts')}
                    className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'shifts' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                    <Calendar size={18} /> My Past Shifts
                </button>
                <button 
                    onClick={() => setActiveTab('arcade')}
                    className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'arcade' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                    <Gamepad2 size={18} /> Arcade
                </button>
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {activeTab === 'shifts' ? (
                    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                        {pastShifts.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">You have no past shifts yet.</div>
                        ) : (
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-slate-900/50 border-b border-slate-700">
                                    <tr>
                                        <th className="p-4 text-slate-300 font-medium">Date</th>
                                        <th className="p-4 text-slate-300 font-medium">Shift Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastShifts.map(shift => (
                                        <tr key={shift.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/80 transition-colors">
                                            <td className="p-4 text-slate-200 font-medium">{new Date(shift.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                            <td className="p-4 flex items-center gap-2">
                                                {shift.shift_type === 'morning' ? <span className="text-sky-400">🌅 Morning</span> : 
                                                 shift.shift_type === 'evening' ? <span className="text-indigo-400">🌇 Evening</span> : 
                                                 <span className="text-slate-400">🌙 Night</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                ) : (
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center justify-center min-h-[500px]">
                        <h2 className="text-2xl font-bold mb-6 font-space">IT Dept Snake</h2>
                        <SnakeGame />
                    </div>
                )}
            </motion.div>
        </div>
    );
}
