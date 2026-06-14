'use client';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export default function OfficeScene({ members, shiftType }: { members: any[], shiftType: string }) {
    const [time, setTime] = useState(new Date());
    const [chatStep, setChatStep] = useState(0);
    const serverDelays = useMemo(() => Array.from({length: 6}, () => [Math.random() * 2, Math.random() * 2]), []);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const chatTimer = setInterval(() => {
            setChatStep(prev => prev + 1);
        }, 5000); // Next message every 5 seconds
        return () => clearInterval(chatTimer);
    }, []);

    const IT_SCRIPT = [
        "Hey, did anyone check the logs for the DB spike? 📉",
        "Yeah, looks like a huge influx of auth requests. 🧐",
        "I'll scale up the instances just in case. 🚀",
        "Thanks. I'll monitor the latency. ⏱️",
        "Wait, the spike is coming from a single IP? 🚩",
        "Blocking it at the firewall level right now. 🛑",
        "Good catch! Crisis averted. 😌",
        "We should probably add rate limiting to that endpoint. 🛠️",
        "I'll open a Jira ticket for it. 📝",
        "Awesome. I'm going to grab another coffee. ☕",
        "The deployment to staging just failed... again. 🤦‍♂️",
        "Did you update the environment variables? 🤔",
        "Ah, good call. Let me check the secrets vault. 🔐",
        "Yep, missing the new API key. Adding it now. 🔑",
        "Redeploying... cross your fingers! 🤞",
        "Pipeline is green! We are good to go. ✅",
        "Who approved that massive PR without tests? 🤨",
        "Guilty... I'll add the tests right now. 😅",
        "Make sure you mock the external services this time! 🤖",
        "Will do. 🫡",
        "Anyone else getting a weird CORS error on localhost? 🌐",
        "Clear your browser cache, usually fixes it. 🧹",
        "Wow, you're a lifesaver. It worked! 🎉",
        "I'm seeing high memory usage on the frontend container. 📈",
        "Probably a memory leak in the new React hooks. 🪝",
        "I'll run a profiler on it after lunch. 🍔"
    ];

    const activeMemberIndices = [0, 1, 2].filter(i => members[i]);
    const currentSpeakerIdx = activeMemberIndices.length > 0 
        ? activeMemberIndices[chatStep % activeMemberIndices.length] 
        : -1;
    const currentMessage = IT_SCRIPT[chatStep % IT_SCRIPT.length];

    const isMorning = shiftType === 'morning';
    const isEvening = shiftType === 'evening';
    
    const ambientColor = isMorning ? 'bg-sky-200/20' : isEvening ? 'bg-indigo-900/40' : 'bg-slate-950/80';
    const windowColor = isMorning ? 'from-sky-300 to-amber-200' : isEvening ? 'from-indigo-500 to-purple-400' : 'from-slate-800 to-slate-900';
    const lightGlow = isMorning ? 'shadow-[0_0_60px_rgba(252,211,77,0.4)]' : isEvening ? 'shadow-[0_0_60px_rgba(129,140,248,0.3)]' : 'shadow-[0_0_60px_rgba(0,0,0,0.8)]';

    const colors = [
        'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
        'bg-fuchsia-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-orange-500'
    ];

    return (
        <div className={`relative w-full rounded-3xl border border-slate-700/50 ${ambientColor} transition-colors duration-1000 shadow-2xl overflow-hidden flex flex-col md:h-[450px]`}>
            <div className="w-full h-full relative flex flex-col md:block">
            {/* Huge Window */}
            <div className={`absolute top-4 left-4 right-4 h-32 md:h-48 bg-gradient-to-b ${windowColor} rounded-t-2xl rounded-b-sm ${lightGlow} transition-colors duration-1000 opacity-80 overflow-hidden border-4 md:border-8 border-slate-800`}>
                {/* Sun / Moon based on time */}
                <motion.div 
                    className={`absolute rounded-full blur-[2px] ${isMorning ? 'bg-amber-300 w-12 h-12 md:w-16 md:h-16' : isEvening ? 'bg-orange-400 w-10 h-10 md:w-12 md:h-12' : 'bg-slate-200 w-8 h-8 md:w-10 md:h-10'}`}
                    style={{ 
                        top: isMorning ? '20%' : isEvening ? '60%' : '20%', 
                        left: isMorning ? '20%' : isEvening ? '70%' : '80%' 
                    }}
                />
                {/* Window frames */}
                <div className="absolute top-0 bottom-0 left-1/3 w-1 md:w-2 bg-slate-800" />
                <div className="absolute top-0 bottom-0 left-2/3 w-1 md:w-2 bg-slate-800" />
                <div className="absolute top-1/2 left-0 right-0 h-1 md:h-2 bg-slate-800" />
            </div>

            {/* Wall Clock */}
            <div className="absolute top-6 right-6 md:top-8 md:right-12 w-12 h-12 md:w-16 md:h-16 rounded-full border-2 md:border-4 border-slate-700 bg-slate-800 flex items-center justify-center shadow-2xl z-10">
                <div 
                    className="absolute w-0.5 md:w-1 h-4 md:h-6 bg-rose-500 rounded-full origin-bottom"
                    style={{ transform: `translateY(-50%) rotate(${time.getHours() * 30 + time.getMinutes() / 2}deg)` }}
                />
                <div 
                    className="absolute w-px md:w-0.5 h-5 md:h-8 bg-slate-300 rounded-full origin-bottom"
                    style={{ transform: `translateY(-50%) rotate(${time.getMinutes() * 6}deg)` }}
                />
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white z-10" />
            </div>

            {/* IT Desks Floor Area */}
            <div className="relative md:absolute bottom-0 w-full md:h-1/2 bg-gradient-to-b from-transparent via-slate-800/80 to-slate-900 border-t-4 border-slate-700 flex flex-col md:flex-row justify-evenly items-center md:items-end px-4 pt-16 md:pt-0 pb-16 gap-16 md:gap-4 mt-auto">
                
                {/* Render Members or Empty Desks */}
                {[0, 1, 2].map((i) => {
                    const member = members[i];
                    return (
                        <div key={i} className="relative w-48 h-[340px] md:h-48 shrink-0 flex flex-col items-center justify-end">
                            {member ? (
                                <>
                                    {/* Name Tag */}
                                    <div className="absolute -bottom-10 bg-slate-900/90 border border-indigo-500/30 px-3 py-1 rounded-md text-xs font-bold text-indigo-200 shadow-lg z-30 flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${i === currentSpeakerIdx ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                                        {member.user.name}
                                    </div>
                                    
                                    {/* Chat Bubble */}
                                    <div className="absolute bottom-[240px] md:bottom-auto md:-top-36 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:-right-8 z-40 pointer-events-none w-[280px] md:w-[240px] flex justify-center md:justify-end">
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ 
                                                opacity: i === currentSpeakerIdx ? 1 : 0, 
                                                y: i === currentSpeakerIdx ? 0 : 10, 
                                                scale: i === currentSpeakerIdx ? 1 : 0.8 
                                            }} 
                                            transition={{ duration: 0.4, type: 'spring' }}
                                            className="bg-white text-slate-900 px-4 py-2 rounded-2xl rounded-b-sm md:rounded-bl-sm text-sm font-bold shadow-2xl w-max max-w-[280px] text-center md:text-left md:max-w-[240px] pointer-events-auto"
                                        >
                                            {currentMessage}
                                        </motion.div>
                                    </div>

                                    {/* Character Behind Desk */}
                                    <div className="absolute bottom-20 flex flex-col items-center z-10">
                                        {/* Head & Headphones wrapper (for turning left/right to look at speaker) */}
                                        <motion.div 
                                            animate={{ x: i === currentSpeakerIdx ? 0 : (currentSpeakerIdx < i && currentSpeakerIdx !== -1 ? -6 : currentSpeakerIdx > i ? 6 : 0) }} 
                                            transition={{ duration: 0.6, type: 'spring' }}
                                            className="relative z-20"
                                        >
                                            {/* Head bobbing up and down */}
                                            <motion.div
                                                animate={{ 
                                                    y: i === currentSpeakerIdx ? [-4, 0, -4] : [0, -2, 0], 
                                                    rotate: i === currentSpeakerIdx ? [-2, 2, -2] : [-1, 1, -1] 
                                                }}
                                                transition={{ duration: i === currentSpeakerIdx ? 0.5 : 3, repeat: Infinity }}
                                            >
                                                <div className="w-6 h-8 bg-slate-800 absolute -left-1 -top-1 rounded-l-lg" />
                                                <div className="w-6 h-8 bg-slate-800 absolute -right-1 -top-1 rounded-r-lg" />
                                                <div className="w-16 h-3 bg-slate-800 absolute -top-3 rounded-t-lg" />
                                                
                                                <div className="w-14 h-16 bg-amber-100 rounded-2xl border-2 border-slate-800 flex flex-col items-center pt-4 relative overflow-hidden">
                                                    {/* Eyes moving */}
                                                    <motion.div 
                                                        animate={{ x: i === currentSpeakerIdx ? 0 : (currentSpeakerIdx < i && currentSpeakerIdx !== -1 ? -4 : currentSpeakerIdx > i ? 4 : 0) }}
                                                        transition={{ duration: 0.5, type: 'spring' }}
                                                        className="flex gap-2 w-full justify-center relative"
                                                    >
                                                        <motion.div animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 0.1, delay: 2+i, repeat: Infinity, repeatDelay: 5 }} className="w-2 h-2 bg-slate-900 rounded-full" />
                                                        <motion.div animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 0.1, delay: 2+i, repeat: Infinity, repeatDelay: 5 }} className="w-2 h-2 bg-slate-900 rounded-full" />
                                                    </motion.div>
                                                    {/* Glasses */}
                                                    <div className="absolute top-3 w-12 h-4 border-2 border-slate-900 rounded-sm opacity-50" />
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                        
                                        {/* Body */}
                                        <div className={`w-20 h-24 ${colors[(member.user.avatar_index - 1) % colors.length] || colors[0]} rounded-t-3xl border-2 border-slate-800 z-10 shadow-inner mt-1`} />
                                    </div>
                                </>
                            ) : (
                                <div className="absolute -bottom-10 text-slate-500 text-xs font-medium z-30">Empty Station</div>
                            )}

                            {/* The Desk Setup (always visible, even if empty) */}
                            <div className="relative z-20 w-full flex flex-col items-center">
                                {/* Monitor */}
                                <div className="w-32 h-20 bg-slate-900 border-4 border-slate-800 rounded-lg shadow-2xl relative overflow-hidden flex flex-col justify-end">
                                    {/* Glowing screen if someone is there */}
                                    {member ? (
                                        <>
                                            <div className="absolute inset-0 bg-indigo-500/10" />
                                            <motion.div 
                                                animate={{ y: [0, -100] }} 
                                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                                className="w-full flex flex-col gap-1 p-2 opacity-50"
                                            >
                                                {[...Array(10)].map((_, j) => (
                                                    <div key={j} className={`h-1 rounded-full ${j % 2 === 0 ? 'bg-cyan-400 w-3/4' : 'bg-emerald-400 w-1/2'}`} />
                                                ))}
                                            </motion.div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-slate-950" />
                                    )}
                                    {/* Monitor Stand */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-6 bg-slate-700" />
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-slate-600 rounded-t-md" />
                                </div>
                                
                                {/* Table Top */}
                                <div className="w-48 h-4 bg-slate-700 rounded-sm mt-4 shadow-[0_-5px_15px_rgba(0,0,0,0.5)] border-b-2 border-slate-900 relative">
                                    {/* Keyboard */}
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-900 rounded" />
                                    {/* Coffee Cup */}
                                    {member && (
                                        <div className="absolute -top-3 left-4 w-4 h-4 bg-white rounded-sm border border-slate-300">
                                            <motion.div 
                                                animate={{ y: [-2, -10], opacity: [0, 0.5, 0], x: [0, 2, -2, 0] }} 
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-1 h-1 bg-white/50 rounded-full absolute -top-1 left-1 blur-[1px]" 
                                            />
                                        </div>
                                    )}
                                </div>
                                {/* Table Legs */}
                                <div className="flex justify-between w-40 mt-0">
                                    <div className="w-2 h-16 bg-gradient-to-b from-slate-600 to-slate-900" />
                                    <div className="w-2 h-16 bg-gradient-to-b from-slate-600 to-slate-900" />
                                </div>
                            </div>
                            
                            {/* Server Rack (Now visible on all desks!) */}
                            <div className="absolute -right-8 bottom-0 w-12 h-32 bg-slate-900 border-2 border-slate-700 rounded-t-md flex flex-col gap-1 p-1 z-0 shadow-lg">
                                {[...Array(6)].map((_, j) => (
                                    <div key={j} className="w-full h-4 bg-slate-800 rounded border border-slate-700 flex items-center px-1 gap-1">
                                        <motion.div 
                                            animate={{ opacity: [1, 0.2, 1] }} 
                                            transition={{ duration: 0.5, delay: serverDelays[j][0], repeat: Infinity }}
                                            className="w-1 h-1 bg-emerald-500 rounded-full" 
                                        />
                                        <motion.div 
                                            animate={{ opacity: [1, 0.2, 1] }} 
                                            transition={{ duration: 1, delay: serverDelays[j][1], repeat: Infinity }}
                                            className="w-1 h-1 bg-blue-500 rounded-full" 
                                        />
                                    </div>
                                ))}
                            </div>

                        </div>
                    );
                })}
            </div>
            
            </div>
        </div>
    );
}
