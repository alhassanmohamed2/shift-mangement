'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import OfficeScene from '@/components/OfficeScene';
import MemberAvatar from '@/components/MemberAvatar';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function LivePage() {
    const [shifts, setShifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        api.get('/shifts/current')
            .then(res => {
                setShifts(res.data);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Failed to load live shifts');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            api.get('/shifts/current')
                .then(res => setShifts(res.data))
                .catch(() => {}); // silently ignore refresh errors
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="flex-grow flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

    const currentHour = currentTime.getHours();
    let currentType = 'morning';
    if (currentHour >= 14 && currentHour < 22) currentType = 'evening';
    else if (currentHour >= 22 || currentHour < 6) currentType = 'night';

    const currentShift = shifts.find(s => s.shift_type === currentType);

    return (
        <div className="flex-grow p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-space font-bold text-white mb-2">Live Status</h1>
                    <p className="text-slate-400 text-sm sm:text-base">Current shift: <span className="text-indigo-400 font-bold uppercase">{currentType}</span></p>
                </div>
                <div className="text-xl sm:text-2xl font-mono text-slate-300 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 shadow-inner w-full sm:w-auto text-center">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                {currentShift && <OfficeScene members={currentShift.assignments} shiftType={currentType} />}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['morning', 'evening', 'night'].map((type, i) => {
                    const shift = shifts.find(s => s.shift_type === type);
                    const isActive = type === currentType;
                    return (
                        <motion.div 
                            key={type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className={`p-6 rounded-2xl border ${isActive ? 'bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]' : 'bg-slate-800/50 border-slate-700'}`}
                        >
                            <h3 className="text-lg font-space font-bold uppercase text-slate-300 mb-4 flex items-center gap-2">
                                {type === 'morning' ? '🌅' : type === 'evening' ? '🌇' : '🌙'} {type}
                                {isActive && <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {shift?.assignments.length ? (
                                    shift.assignments.map((a: any) => (
                                        <MemberAvatar key={a.id} index={a.user.avatar_index} name={a.user.name} size="md" />
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-sm">No members assigned</p>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
}
