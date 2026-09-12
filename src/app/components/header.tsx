"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
    const router = useRouter();
    const [firstName, setFirstName] = useState<string>('Player');

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user && data.user.firstName) setFirstName(data.user.firstName);
            })
            .catch(err => console.error('Failed to fetch user:', err));
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center px-8 justify-between z-20 sticky top-0">
            <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Server Online</span>
                {/* <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Server Offline</span> */}
            </div>
            <div className="flex items-center space-x-6">
                <div className="text-sm font-medium text-slate-300">
                    Welcome, <span className="text-emerald-400 font-black">{firstName}</span>
                </div>
                <button 
                    onClick={handleLogout}
                    className="text-xs font-bold uppercase tracking-widest bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all"
                >
                    Disconnect
                </button>
            </div>
        </header>
    );
}
