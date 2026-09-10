// src/app/components/dashboard_layout.tsx
import Header from './header';
import Footer from './footer';
import Sidebar from './sidebar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Left side: Sidebar */}
            <Sidebar />

            {/* Right side: Everything else */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
                
                <Footer />
            </div>
        </div>
    );
}