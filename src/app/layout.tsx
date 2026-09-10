// src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
    title: 'Arcadexa Admin',
    description: 'A monolithic authentication system',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="antialiased bg-gray-50 text-gray-900">
                {children}
            </body>
        </html>
    );
}