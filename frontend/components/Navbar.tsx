'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { LogOut, Calendar, MonitorPlay, FileText, Settings, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import UserProfileModal from './UserProfileModal';

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    if (!user || pathname === '/login') return null;

    const navLinks = [
        { href: '/live', label: 'Live', icon: <MonitorPlay size={18} /> },
        ...(user.role === 'admin' 
            ? [{ href: '/schedule', label: 'Schedule', icon: <Calendar size={18} /> }] 
            : [{ href: '/me', label: 'My Space', icon: <Calendar size={18} /> }]),
        { href: '/logs', label: 'Logs', icon: <FileText size={18} /> },
        ...(user.role === 'admin' 
            ? [{ href: '/admin', label: 'Admin', icon: <Settings size={18} /> }] 
            : [])
    ];

    return (
        <>
        <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4 sm:gap-8 overflow-hidden w-full md:w-auto">
                        <Link href="/live" className="text-xl font-space font-bold text-indigo-400 shrink-0">
                            Shifts
                        </Link>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-2 py-1">
                            {navLinks.map(link => (
                                <Link key={link.href} href={link.href} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.href ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                                    {link.icon} {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 ml-auto md:ml-0">
                        <button onClick={() => setShowProfileModal(true)} className="text-sm font-medium text-slate-300 hidden sm:block hover:text-white transition-colors">
                            {user.sub}
                        </button>
                        <button onClick={logout} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-full transition-colors" title="Logout">
                            <LogOut size={20} />
                        </button>
                        {/* Mobile Menu Toggle */}
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-md transition-colors border border-slate-700">
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-lg px-4 py-4 space-y-2 shadow-2xl absolute w-full">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${pathname === link.href ? 'text-white bg-indigo-500/20 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                            {link.icon} {link.label}
                        </Link>
                    ))}
                    <button onClick={() => setShowProfileModal(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-400 hover:text-white hover:bg-slate-800 sm:hidden transition-colors text-left">
                        <div className="w-[18px] h-[18px] rounded-full bg-slate-700 border border-slate-600"></div> Profile ({user.sub})
                    </button>
                </div>
            )}
        </nav>
        {showProfileModal && <UserProfileModal onClose={() => setShowProfileModal(false)} />}
        </>
    );
}
