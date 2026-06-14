'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import MemberAvatar from '@/components/MemberAvatar';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/auth';
import { AlertTriangle, Plus, X } from 'lucide-react';

export default function SchedulePage() {
    const { user } = useAuth();
    const [shifts, setShifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        const day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff)).toISOString().split('T')[0];
    });

    useEffect(() => {
        api.get(`/shifts/week?start=${startDate}`)
            .then(res => {
                setShifts(res.data);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Failed to load schedule');
                setLoading(false);
            });
    }, [startDate]);

    if (loading) return <div className="flex-grow flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        days.push(d.toISOString().split('T')[0]);
    }

    const getShiftsByDayAndType = (date: string, type: string) => {
        return shifts.find(s => s.date === date && s.shift_type === type) || null;
    };

    return (
        <div className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-space font-bold text-white mb-2">Weekly Schedule</h1>
                    <p className="text-slate-400">Week of {startDate}</p>
                </div>
            </motion.div>

            <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-800/50 shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 border-b border-slate-700 bg-slate-900/50 text-slate-300 font-space uppercase">Shift</th>
                            {days.map(d => (
                                <th key={d} className="p-4 border-b border-slate-700 bg-slate-900/50 text-slate-300 font-space text-center">
                                    <div className="text-sm font-normal text-slate-400">{new Date(d).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                    <div>{new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {['morning', 'evening', 'night'].map((type, rowIndex) => (
                            <tr key={type} className="border-b border-slate-700/50 last:border-0">
                                <td className="p-4 bg-slate-900/30 font-space font-bold uppercase text-slate-300 align-top">
                                    {type === 'morning' ? '🌅 ' : type === 'evening' ? '🌇 ' : '🌙 '} {type}
                                </td>
                                {days.map((day, colIndex) => {
                                    const shift = getShiftsByDayAndType(day, type);
                                    const assignments = shift?.assignments || [];
                                    const isInvalid = assignments.length < 2 || assignments.length > 3;
                                    
                                    return (
                                        <motion.td 
                                            key={`${day}-${type}`} 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: rowIndex * 0.1 + colIndex * 0.05 }}
                                            className="p-3 border-l border-slate-700/50 hover:bg-slate-700/30 transition-colors align-top min-w-[140px]"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {assignments.map((a: any) => (
                                                        <MemberAvatar key={a.id} index={a.user.avatar_index} name={a.user.name} size="sm" />
                                                    ))}
                                                </div>
                                                {isInvalid && (
                                                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded">
                                                        <AlertTriangle size={14} /> 2-3 required
                                                    </div>
                                                )}
                                                {user?.role === 'admin' && (
                                                    <button className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center gap-1 bg-indigo-500/10 py-1 rounded hover:bg-indigo-500/20 transition-colors">
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                        </motion.td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
