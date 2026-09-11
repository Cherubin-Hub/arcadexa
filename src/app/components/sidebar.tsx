"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
        <aside className={`bg-gray-900 text-white transition-all duration-300 flex flex-col min-h-screen ${isCollapsed ? 'w-16' : 'w-64'}`}>
            
            {/* Toggle Button */}
            <div className="p-4 flex justify-end border-b border-gray-700">
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)} 
                    className="text-gray-400 hover:text-white focus:outline-none"
                >
                    {isCollapsed ? '▶' : '◀'}
                </button>
            </div>
            {/* Navigation Links */}
            <nav className="flex-1 mt-4">
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard" className="block px-4 py-3 hover:bg-gray-800 transition">
                            {isCollapsed ? '🏠' : '🏠 Dashboard'}
                        </Link>
                    </li>
                    {/* <li>
                        <Link href="/dashboard/tictactoe" className="block px-4 py-3 hover:bg-gray-800 transition">
                            {isCollapsed ? '🎮' : '🎮 Tic-Tac-Toe'}
                        </Link>
                    </li> */}
                    <li>
                        <Link href="/dashboard/snake" className="block px-4 py-3 hover:bg-gray-800 transition">
                            {isCollapsed ? '🐍' : '🐍 Gab the Snake'}
                        </Link>
                    </li>
                    {/* <li>
                        <Link href="/dashboard/settings" className="block px-4 py-3 hover:bg-gray-800 transition">
                            {isCollapsed ? '⚙️' : '⚙️ Settings'}
                        </Link>
                    </li> */}
                </ul>
            </nav>
        </aside>
    );
}
