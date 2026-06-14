'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Key } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
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
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Key size={20} /> Change Password</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
            </motion.div>
        </div>
    );
}
