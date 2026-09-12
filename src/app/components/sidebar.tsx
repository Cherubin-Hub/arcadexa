import Link from 'next/link';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-20">
            <div className="h-16 flex items-center justify-center border-b border-slate-800">
                <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    ARCADEXA
                </h2>
            </div>
            <nav className="flex-1 mt-6">
                <ul className="space-y-3 px-4">
                    <li>
                        <Link href="/dashboard" className="flex items-center px-4 py-3 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 rounded-lg transition-all group">
                            <span className="mr-3 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform">📊</span> 
                            <span className="font-bold tracking-wide">Leaderboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/snake" className="flex items-center px-4 py-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] group">
                            <span className="mr-3 group-hover:scale-110 transition-transform">🐍</span> 
                            <span className="font-black tracking-wide">Gab the Snake</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/tictactoe" className="flex items-center px-4 py-3 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 rounded-lg transition-all group">
                            <span className="mr-3 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform">❌</span> 
                            <span className="font-bold tracking-wide">Tic-Tac-Toe</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center font-bold tracking-widest uppercase">
                v1.0.0 Online
            </div>
        </aside>
    );
}
