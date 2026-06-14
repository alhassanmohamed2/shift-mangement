'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Calendar, Gamepad2 } from 'lucide-react';
import SnakeGame from '@/components/SnakeGame';

export default function MemberPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'shifts' | 'arcade'>('shifts');
    const [shifts, setShifts] = useState<any[]>([]);
    
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            api.get('/shifts/my-history').then(res => setShifts(res.data)).catch(() => toast.error('Failed to load past shifts'));
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
                        {shifts.length === 0 ? (
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
                                    {shifts.map(shift => (
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
