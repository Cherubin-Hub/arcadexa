"use client";
import { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard_layout';

type LeaderboardEntry = { FirstName: string; HighestScore: number };

export default function DashboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        fetch('/api/scores/snake/leaderboard')
            .then(res => res.json())
            .then(data => {
                if (data.leaderboard) setLeaderboard(data.leaderboard);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <DashboardLayout>
            <div className="w-full max-w-7xl mx-auto py-4 md:py-8">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-100 tracking-tight drop-shadow-sm">Arcadexa Leaderboard</h1>
                </div>
                
                {/* 
                    GRID LAYOUT: 
                    Uses CSS Grid to automatically flow cards.
                    - 1 column on mobile (grid-cols-1)
                    - 2 columns on tablets (md:grid-cols-2)
                    - 3 columns on large desktops (xl:grid-cols-3)
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    
                    {/* SNAKE LEADERBOARD WIDGET */}
                    <div className="bg-[#1e293b] rounded-xl shadow-xl border border-slate-700/50 overflow-hidden flex flex-col h-[400px]">
                        <div className="bg-[#0f172a] p-4 border-b border-slate-700/50 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-200 flex items-center">
                                🏆 Gab the Snake
                            </h2>
                            <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md">Top 10</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {leaderboard.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">No scores yet.</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#1e293b] sticky top-0 z-10 border-b border-slate-700">
                                        <tr>
                                            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-16 text-center">Rank</th>
                                            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Player</th>
                                            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {leaderboard.map((entry, index) => (
                                            <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                                                <td className="px-4 py-3 text-center">
                                                    {index === 0 ? <span className="text-yellow-400 text-lg drop-shadow-md">🥇</span> : 
                                                     index === 1 ? <span className="text-slate-300 text-lg">🥈</span> : 
                                                     index === 2 ? <span className="text-amber-600 text-lg">🥉</span> : 
                                                     <span className="text-slate-500 font-bold text-sm">{index + 1}</span>}
                                                </td>
                                                <td className="px-4 py-3 text-slate-200 font-medium text-sm truncate max-w-[120px]">
                                                    {entry.FirstName}
                                                </td>
                                                <td className="px-4 py-3 text-emerald-400 font-bold text-sm text-right">
                                                    {entry.HighestScore.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* FUTURE GAME WIDGET PLACEHOLDER */}
                    <div className="bg-[#1e293b] rounded-xl shadow-xl border border-slate-700/50 overflow-hidden flex flex-col h-[400px] opacity-70">
                        <div className="bg-[#0f172a] p-4 border-b border-slate-700/50 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-400 flex items-center">
                                ❌ Tic-Tac-Toe
                            </h2>
                            <span className="text-xs font-bold bg-slate-800 text-slate-500 px-2 py-1 rounded-md">Coming Soon</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500 text-sm">
                            Leaderboard will appear here once the game is live.
                        </div>
                    </div>
                    
                </div>
            </div>
        </DashboardLayout>
    );
}
