'use client';
import { motion } from 'framer-motion';

import { useState } from 'react';

export default function MemberAvatar({ index, name, size = 'md' }: { index: number, name: string, size?: 'sm' | 'md' | 'lg' }) {
    const [showName, setShowName] = useState(false);
    
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

    const avatarUrl = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(name + '-' + index)}`;

    return (
        <div className="relative flex flex-col items-center">
            <motion.div 
                whileHover={{ scale: 1.1 }}
                onMouseEnter={() => setShowName(true)}
                onMouseLeave={() => setShowName(false)}
                onClick={() => setShowName(!showName)}
                className={`${sizeClasses[size]} ${color} rounded-full flex items-center justify-center shadow-lg border-2 border-slate-800 overflow-hidden bg-white cursor-pointer`}
            >
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover pointer-events-none" />
            </motion.div>
            
            {showName && (
                <div className="absolute top-full mt-2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 border border-slate-700 animate-in fade-in zoom-in duration-200">
                    {name}
                </div>
            )}
        </div>
    );
}
