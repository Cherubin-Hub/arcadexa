"use client";
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between border-b">
            <h1 className="text-xl font-bold text-gray-800">Arcadexa Admin</h1>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, User</span>
                <button 
                    onClick={handleLogout}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
