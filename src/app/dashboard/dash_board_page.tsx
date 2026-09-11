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
            <div className="max-w-4xl mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Arcadexa Dashboard</h1>
                
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <div className="bg-gray-800 p-4">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            🏆 Gab the Snake Leaderboard
                        </h2>
                    </div>
                    
                    <div className="p-6">
                        {leaderboard.length === 0 ? (
                            <p className="text-gray-500 italic">No scores yet. Be the first to play!</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200 text-left">
                                <thead>
                                    <tr>
                                        <th className="pb-3 text-sm font-bold text-gray-500 uppercase">Rank</th>
                                        <th className="pb-3 text-sm font-bold text-gray-500 uppercase">Player</th>
                                        <th className="pb-3 text-sm font-bold text-gray-500 uppercase">Highest Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {leaderboard.map((entry, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition">
                                            <td className="py-4 font-bold text-lg">
                                                {index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : `${index + 1}`}
                                            </td>
                                            <td className="py-4 text-gray-900 font-semibold text-lg">
                                                {entry.FirstName}
                                            </td>
                                            <td className="py-4 text-green-600 font-black text-xl">
                                                {entry.HighestScore}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
