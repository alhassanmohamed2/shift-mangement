'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);
            
            const res = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            Cookies.set('token', res.data.access_token);
            toast.success('Logged in successfully!');
            window.location.href = '/live';
        } catch (error) {
            toast.error('Invalid credentials');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center flex-grow p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-space font-bold text-indigo-400 mb-2">Shifts</h1>
                    <p className="text-slate-400">Shift Management System</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Username/Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-lg shadow-indigo-500/20 transition-colors"
                    >
                        Sign In
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
