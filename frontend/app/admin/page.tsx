'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import MemberAvatar from '@/components/MemberAvatar';
import { Users, Calendar as CalendarIcon, UserPlus, X } from 'lucide-react';

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'members' | 'shifts'>('members');
    
    useEffect(() => {
        if (!loading && user?.role !== 'admin') {
            router.push('/live');
        }
    }, [user, loading, router]);

    if (loading || user?.role !== 'admin') return null;

    return (
        <div className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-space font-bold text-white mb-2">Admin Panel</h1>
                    <p className="text-slate-400">Manage team and assignments</p>
                </div>
            </motion.div>

            <div className="flex gap-4 border-b border-slate-700">
                <button 
                    onClick={() => setActiveTab('members')}
                    className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'members' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                    <Users size={18} /> Team Members
                </button>
                <button 
                    onClick={() => setActiveTab('shifts')}
                    className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'shifts' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                    <CalendarIcon size={18} /> Shift Management
                </button>
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {activeTab === 'members' ? <MembersTab /> : <ShiftsTab />}
            </motion.div>
        </div>
    );
}

function MembersTab() {
    const [members, setMembers] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', email: '', avatar_index: 1 });
    const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

    const loadMembers = () => {
        api.get('/users').then(res => setMembers(res.data)).catch(() => toast.error('Failed to load members'));
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/users', { ...newMember, role: 'member' });
            setGeneratedPassword(res.data.password);
            loadMembers();
            setNewMember({ name: '', email: '', avatar_index: 1 });
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to add member');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <UserPlus size={18} /> Add Member
                </button>
            </div>
            
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-x-auto shadow-xl">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-900/50 border-b border-slate-700">
                        <tr>
                            <th className="p-4 text-slate-300 font-medium w-20">Avatar</th>
                            <th className="p-4 text-slate-300 font-medium">Name</th>
                            <th className="p-4 text-slate-300 font-medium">Email</th>
                            <th className="p-4 text-slate-300 font-medium">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <tr key={member.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/80 transition-colors">
                                <td className="p-4"><MemberAvatar index={member.avatar_index} name={member.name} size="sm" /></td>
                                <td className="p-4 text-slate-200 font-medium">{member.name}</td>
                                <td className="p-4 text-slate-400">{member.email}</td>
                                <td className="p-4"><span className="px-2 py-1 bg-slate-700 rounded text-xs uppercase tracking-wider">{member.role}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                            <h2 className="text-xl font-bold">Add Team Member</h2>
                            <button onClick={() => { setShowModal(false); setGeneratedPassword(null); }} className="text-slate-400 hover:text-white"><X size={20} /></button>
                        </div>
                        {generatedPassword ? (
                            <div className="p-8 text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"><UserPlus size={32} /></div>
                                <h3 className="text-2xl font-bold text-white">Member Created!</h3>
                                <p className="text-slate-400">Copy this temporary password. It will only be shown once.</p>
                                <div className="bg-slate-900 p-4 rounded-lg font-mono text-xl border border-slate-700 text-emerald-400 font-bold select-all">
                                    {generatedPassword}
                                </div>
                                <button onClick={() => { setShowModal(false); setGeneratedPassword(null); }} className="w-full mt-6 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-medium transition-colors">Done</button>
                            </div>
                        ) : (
                            <form onSubmit={handleAdd} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                                    <input type="text" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                                    <input type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Avatar Color</label>
                                    <div className="flex gap-2">
                                        {[1,2,3,4,5,6,7,8].map(i => (
                                            <button key={i} type="button" onClick={() => setNewMember({...newMember, avatar_index: i})} className={`relative w-8 h-8 rounded-full border-2 ${newMember.avatar_index === i ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}>
                                                <MemberAvatar index={i} name="A" size="sm" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-medium transition-colors">Create Member</button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function ShiftsTab() {
    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [shifts, setShifts] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);

    useEffect(() => {
        api.get('/users').then(res => setMembers(res.data));
    }, []);

    useEffect(() => {
        api.get(`/shifts/week?start=${selectedDate}`).then(res => setShifts(res.data.filter((s: any) => s.date === selectedDate)));
    }, [selectedDate]);

    const handleAssign = async (shiftId: number, userId: number) => {
        try {
            await api.post(`/shifts/${shiftId}/assign?user_id=${userId}`);
            toast.success('Assigned successfully');
            api.get(`/shifts/week?start=${selectedDate}`).then(res => setShifts(res.data.filter((s: any) => s.date === selectedDate)));
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to assign');
        }
    };

    const handleRemove = async (shiftId: number, userId: number) => {
        try {
            await api.delete(`/shifts/${shiftId}/assign/${userId}`);
            toast.success('Removed successfully');
            api.get(`/shifts/week?start=${selectedDate}`).then(res => setShifts(res.data.filter((s: any) => s.date === selectedDate)));
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to remove');
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 space-y-4">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
                    <h3 className="font-space font-bold mb-4">Select Date</h3>
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 mb-4 focus:ring-1 focus:ring-indigo-500 outline-none text-white color-scheme-dark" 
                        style={{colorScheme: 'dark'}}
                    />
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={async () => {
                                try {
                                    await api.post(`/shifts/auto-assign?start_date=${selectedDate}`);
                                    toast.success('Week auto-assigned successfully!');
                                    api.get(`/shifts/week?start=${selectedDate}`).then(res => setShifts(res.data.filter((s: any) => s.date === selectedDate)));
                                } catch (error: any) {
                                    toast.error(error.response?.data?.detail || 'Failed to auto-assign');
                                }
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <CalendarIcon size={18} /> Auto-Assign Week
                        </button>
                        <button
                            onClick={async () => {
                                if (confirm("Are you sure you want to clear all assignments for this week?")) {
                                    try {
                                        await api.delete(`/shifts/clear-week?start_date=${selectedDate}`);
                                        toast.success('Week cleared successfully!');
                                        api.get(`/shifts/week?start=${selectedDate}`).then(res => setShifts(res.data.filter((s: any) => s.date === selectedDate)));
                                    } catch (error: any) {
                                        toast.error(error.response?.data?.detail || 'Failed to clear week');
                                    }
                                }
                            }}
                            className="w-full bg-rose-900/50 hover:bg-rose-800/80 text-rose-200 border border-rose-700 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <X size={18} /> Clear Week
                        </button>
                    </div>
                </div>
                
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl max-h-[500px] overflow-y-auto">
                    <h3 className="font-space font-bold mb-4">Available Members</h3>
                    <div className="space-y-2">
                        {members.map(m => (
                            <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 border border-slate-700">
                                <MemberAvatar index={m.avatar_index} name={m.name} size="sm" />
                                <span className="text-sm font-medium">{m.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full md:w-2/3 space-y-4">
                {['morning', 'evening', 'night'].map(type => {
                    const shift = shifts.find(s => s.shift_type === type);
                    const count = shift?.assignments?.length || 0;
                    const isValid = count >= 2 && count <= 3;

                    return (
                        <div key={type} className={`bg-slate-800/50 p-6 rounded-2xl border ${!isValid && shift ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-slate-700'} shadow-xl`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-space font-bold uppercase flex items-center gap-2">
                                    {type === 'morning' ? '🌅' : type === 'evening' ? '🌇' : '🌙'} {type}
                                </h3>
                                <div className={`text-xs font-bold px-2 py-1 rounded ${isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-500'}`}>
                                    {count} / 3 members (Min 2)
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-6 min-h-[60px] p-4 bg-slate-900/50 rounded-xl border border-slate-700 border-dashed items-center">
                                {shift?.assignments?.map((a: any) => (
                                    <div key={a.id} className="relative group flex flex-col items-center gap-1">
                                        <MemberAvatar index={a.user.avatar_index} name={a.user.name} size="md" />
                                        <span className="text-xs text-slate-400">{a.user.name}</span>
                                        <button 
                                            onClick={() => handleRemove(shift.id, a.user.id)}
                                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {count === 0 && <span className="text-slate-500 text-sm">No one assigned</span>}
                            </div>

                            {shift && count < 3 && (
                                <div className="flex gap-2">
                                    <select 
                                        className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                        id={`select-${shift.id}`}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select member to assign...</option>
                                        {members.filter(m => !shift.assignments.find((a:any) => a.user.id === m.id)).map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={() => {
                                            const val = (document.getElementById(`select-${shift.id}`) as HTMLSelectElement).value;
                                            if (val) {
                                                handleAssign(shift.id, parseInt(val));
                                                (document.getElementById(`select-${shift.id}`) as HTMLSelectElement).value = "";
                                            }
                                        }}
                                        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Assign
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
