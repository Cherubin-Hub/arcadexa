import DashboardLayout from '../components/dashboard_layout';

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
            <p className="text-gray-600">You have successfully authenticated and accessed a protected route!</p>
        </DashboardLayout>
    );
}
