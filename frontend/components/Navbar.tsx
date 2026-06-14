'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { LogOut, Calendar, MonitorPlay, FileText, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useState } from 'react';
import UserProfileModal from './UserProfileModal';

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [showProfileModal, setShowProfileModal] = useState(false);

    if (!user || pathname === '/login') return null;

    return (
        <>
        <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/live" className="text-xl font-space font-bold text-indigo-400">
                            Shifts
                        </Link>
                        <div className="flex overflow-x-auto space-x-2 scrollbar-hide py-1 max-w-[60vw]">
                            <Link href="/live" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/live' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                                <MonitorPlay size={18} /> Live
                            </Link>
                            {user.role === 'admin' ? (
                                <Link href="/schedule" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/schedule' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                                    <Calendar size={18} /> Schedule
                                </Link>
                            ) : (
                                <Link href="/me" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/me' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                                    <Calendar size={18} /> My Shifts
                                </Link>
                            )}
                            <Link href="/logs" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/logs' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                                <FileText size={18} /> Logs
                            </Link>
                            {user.role === 'admin' && (
                                <Link href="/admin" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/admin' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                                    <Settings size={18} /> Admin
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setShowProfileModal(true)} className="text-sm font-medium text-slate-300 hidden sm:block hover:text-white transition-colors">
                            {user.sub}
                        </button>
                        <button onClick={logout} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-full transition-colors" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        {showProfileModal && <UserProfileModal onClose={() => setShowProfileModal(false)} />}
        </>
    );
}
