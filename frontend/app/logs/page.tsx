'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const PAGE_LIMIT = 50;

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        api.get(`/logs?page=${page}&limit=${PAGE_LIMIT}`)
            .then(res => {
                setLogs(res.data.logs);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Failed to load logs');
                setLoading(false);
            });
    }, [page]);

    if (loading) return <div className="flex-grow flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-space font-bold text-white mb-2">Audit Logs</h1>
                    <p className="text-slate-400">History of shift changes</p>
                </div>
            </motion.div>

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50 border-b border-slate-700">
                        <tr>
                            <th className="p-4 text-slate-300 font-medium">Time</th>
                            <th className="p-4 text-slate-300 font-medium">Action</th>
                            <th className="p-4 text-slate-300 font-medium">Affected User</th>
                            <th className="p-4 text-slate-300 font-medium">Shift</th>
                            <th className="p-4 text-slate-300 font-medium">Performed By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => (
                            <motion.tr 
                                key={log.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/80 transition-colors"
                            >
                                <td className="p-4 text-sm text-slate-400">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                                        ${log.action === 'assigned' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                                        ${log.action === 'removed' ? 'bg-rose-500/20 text-rose-400' : ''}
                                        ${log.action === 'swapped' ? 'bg-amber-500/20 text-amber-400' : ''}
                                    `}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-200 font-medium">{log.user?.name}</td>
                                <td className="p-4 text-slate-400 text-sm">
                                    {log.shift?.date} <span className="uppercase text-xs font-bold text-indigo-400 ml-1">{log.shift?.shift_type}</span>
                                </td>
                                <td className="p-4 text-slate-500 text-sm">{log.performer?.name}</td>
                            </motion.tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">No logs found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 font-medium text-sm hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ← Previous
                </button>
                <span className="text-slate-400 text-sm">Page {page}</span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={logs.length < PAGE_LIMIT}
                    className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 font-medium text-sm hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
