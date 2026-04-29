import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ProgressBar from '@/Components/ProgressBar';

interface DashboardStats {
    total_employees: number;
    fully_complete: number;
    incomplete: number;
    average_completion: number;
}

export default function Dashboard({ stats }: { stats: DashboardStats }) {
    const statCards = [
        {
            label: 'Total Employees',
            value: stats.total_employees,
            valueColor: 'text-gray-950',
            iconBg: 'brand-soft-bg',
            iconColor: 'brand-text',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        },
        {
            label: 'Fully Complete',
            value: stats.fully_complete,
            valueColor: 'text-emerald-600',
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        },
        {
            label: 'Incomplete',
            value: stats.incomplete,
            valueColor: 'text-amber-600',
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        },
    ];

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Admin overview</p>
                    <h1 className="mt-2 text-2xl font-bold text-gray-950">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Quick summary of employee document submissions.</p>
                </div>
                <Link
                    href="/admin/progress"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 brand-primary text-white text-sm font-semibold rounded-xl transition-all self-start lg:self-auto"
                >
                    View Progress
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-sm font-medium text-gray-500">{card.label}</p>
                            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                                <span className={card.iconColor}>{card.icon}</span>
                            </div>
                        </div>
                        <p className={`text-4xl font-bold ${card.valueColor}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.85fr] gap-5">
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-gray-950">Completion Snapshot</h2>
                            <p className="mt-1 text-sm text-gray-500">Average completion across all employee document records.</p>
                        </div>
                        <p className="text-3xl font-bold brand-text">{stats.average_completion}%</p>
                    </div>
                    <div className="mt-5">
                        <ProgressBar percentage={stats.average_completion} />
                    </div>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link href="/admin/progress" className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors">
                            <p className="text-sm font-semibold text-gray-900">Review document progress</p>
                            <p className="mt-1 text-xs text-gray-500">Open the dedicated progress table.</p>
                        </Link>
                        <Link href="/admin/users" className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors">
                            <p className="text-sm font-semibold text-gray-900">Manage users</p>
                            <p className="mt-1 text-xs text-gray-500">Add, edit, or deactivate accounts.</p>
                        </Link>
                    </div>
                </section>

                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <h2 className="text-base font-semibold text-gray-950">Recommended Workflow</h2>
                    <div className="mt-5 space-y-4">
                        {[
                            ['1', 'Set required documents', 'Create and manage document slots first.'],
                            ['2', 'Add employees', 'New employees receive current document slots.'],
                            ['3', 'Track progress', 'Use Document Progress for the full list.'],
                        ].map(([step, title, body]) => (
                            <div key={step} className="flex gap-3">
                                <div className="w-7 h-7 rounded-lg brand-soft-bg brand-text flex items-center justify-center text-xs font-bold flex-shrink-0">{step}</div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                                    <p className="mt-0.5 text-xs text-gray-500">{body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
