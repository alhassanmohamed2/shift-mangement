'use client';
import { motion } from 'framer-motion';

export default function MemberAvatar({ index, name, size = 'md' }: { index: number, name: string, size?: 'sm' | 'md' | 'lg' }) {
    const colors = [
        'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
        'bg-fuchsia-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-orange-500'
    ];
    const color = colors[(index - 1) % colors.length] || colors[0];
    
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-lg',
        lg: 'w-16 h-16 text-2xl'
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.1 }}
            className={`${sizeClasses[size]} ${color} text-white rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-slate-800`}
            title={name}
        >
            {name.charAt(0).toUpperCase()}
        </motion.div>
    );
}
