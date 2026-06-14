'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ShiftTimer({ shift }: { shift: any }) {
    const [timeLeft, setTimeLeft] = useState<{ label: string, value: string, isLive: boolean } | null>(null);

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            
            // Parse shift date (e.g. "2026-06-14")
            const shiftDateStr = shift.date;
            
            // Calculate exact start and end times based on shift type
            const startTime = new Date(`${shiftDateStr}T00:00:00`);
            const endTime = new Date(`${shiftDateStr}T00:00:00`);
            
            if (shift.shift_type === 'morning') {
                startTime.setHours(6, 0, 0);
                endTime.setHours(14, 0, 0);
            } else if (shift.shift_type === 'evening') {
                startTime.setHours(14, 0, 0);
                endTime.setHours(22, 0, 0);
            } else {
                startTime.setHours(22, 0, 0);
                endTime.setDate(endTime.getDate() + 1);
                endTime.setHours(6, 0, 0);
            }

            if (now < startTime) {
                // Shift has not started yet
                const diff = startTime.getTime() - now.getTime();
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft({
                    label: 'Starts in',
                    value: `${hours}h ${mins}m ${secs}s`,
                    isLive: false
                });
            } else if (now >= startTime && now < endTime) {
                // Shift is currently running
                const diff = endTime.getTime() - now.getTime();
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft({
                    label: 'Ends in',
                    value: `${hours}h ${mins}m ${secs}s`,
                    isLive: true
                });
            } else {
                // Shift is over
                setTimeLeft({
                    label: 'Status',
                    value: 'Completed',
                    isLive: false
                });
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [shift]);

    if (!timeLeft) return null;

    if (timeLeft.value === 'Completed') {
        return (
            <div className="flex items-center gap-2 text-emerald-400 font-medium bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                <CheckCircle2 size={18} /> Completed
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-3 font-medium px-4 py-2 rounded-lg border ${timeLeft.isLive ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'}`}>
            {timeLeft.isLive ? <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}><div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" /></motion.div> : <Clock size={18} />}
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider opacity-80">{timeLeft.label}</span>
                <span className="font-space font-bold text-lg leading-tight text-white">{timeLeft.value}</span>
            </div>
        </div>
    );
}
