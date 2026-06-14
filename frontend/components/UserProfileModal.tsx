'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Key, User as UserIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/auth';
import MemberAvatar from './MemberAvatar';

export default function UserProfileModal({ onClose }: { onClose: () => void }) {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
    
    // Password state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Profile state
    const [name, setName] = useState('');
    const [avatarIndex, setAvatarIndex] = useState(1);
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch current user details
        api.get('/users/me').then(res => {
            setName(res.data.name);
            setAvatarIndex(res.data.avatar_index);
        }).catch(err => {
            console.error(err);
        });
    }, []);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("New passwords don't match");
        }
        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);
        try {
            await api.post('/auth/change-password', {
                old_password: oldPassword,
                new_password: newPassword
            });
            toast.success('Password updated successfully');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Name cannot be empty");
        
        setLoading(true);
        try {
            await api.put('/users/me', {
                name,
                avatar_index: avatarIndex
            });
            toast.success('Profile updated successfully');
            // Hard refresh to update Navbar state
            window.location.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <h2 className="text-xl font-bold flex items-center gap-2">My Profile</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
                </div>
                
                <div className="flex border-b border-slate-700">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                        <div className="flex items-center justify-center gap-2"><UserIcon size={16} /> Profile Details</div>
                    </button>
                    <button 
                        onClick={() => setActiveTab('password')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'password' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                        <div className="flex items-center justify-center gap-2"><Key size={16} /> Password</div>
                    </button>
                </div>

                {activeTab === 'profile' ? (
                    <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                required 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-indigo-500 outline-none text-white" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Avatar Color</label>
                            <div className="flex gap-2 flex-wrap">
                                {[1,2,3,4,5,6,7,8].map(i => (
                                    <button 
                                        key={i} 
                                        type="button" 
                                        onClick={() => setAvatarIndex(i)} 
                                        className={`relative w-8 h-8 rounded-full border-2 ${avatarIndex === i ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <MemberAvatar index={i} name={name || "U"} size="sm" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
                            <input 
                                type="password" 
                                value={oldPassword} 
                                onChange={e => setOldPassword(e.target.value)} 
                                required 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-indigo-500 outline-none text-white" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={e => setNewPassword(e.target.value)} 
                                required 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-indigo-500 outline-none text-white" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={e => setConfirmPassword(e.target.value)} 
                                required 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-indigo-500 outline-none text-white" 
                            />
                        </div>
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
