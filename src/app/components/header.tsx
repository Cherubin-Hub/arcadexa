"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
    const router = useRouter();
    const [firstName, setFirstName] = useState<string>('User');
    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user && data.user.firstName) {
                    setFirstName(data.user.firstName);
                }
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
        <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between border-b">
            <h1 className="text-xl font-bold text-gray-800">Arcadexa</h1>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {firstName}!</span>
                <button onClick={handleLogout} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Logout</button>
            </div>
        </header>
    );
}
