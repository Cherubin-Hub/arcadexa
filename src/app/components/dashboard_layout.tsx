import Sidebar from './sidebar';
import Header from './header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden relative">
                <Header />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <main className="flex-1 overflow-y-auto p-6 relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
}