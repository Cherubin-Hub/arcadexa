"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                const data = await response.json();
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Could not connect to the server. Is the backend running?');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans selection:bg-emerald-500/30">
            {/* Gaming Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Login Card with Glassmorphism */}
            <div className="bg-slate-900/70 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-slate-800 z-10 relative">
                
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                        ARCADEXA
                    </h1>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        <span className="mr-2">⚠️</span>
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-slate-100 placeholder-slate-600 transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-slate-100 placeholder-slate-600 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-4 px-4 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm font-black uppercase tracking-widest text-slate-900 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-all mt-8 transform hover:-translate-y-0.5"
                    >
                        Initialize Connection
                    </button>
                    
                    <div className="text-center mt-6">
                        <span className="text-slate-400 text-sm">Don't have an account? </span>
                        <a href="/register" className="text-emerald-400 hover:text-emerald-300 text-sm font-bold transition-colors">
                            Create Account
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
