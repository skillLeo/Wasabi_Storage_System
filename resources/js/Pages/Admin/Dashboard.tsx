import { useState } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ProgressBar from '@/Components/ProgressBar';

interface Employee {
    id: number; name: string; email: string; is_active: boolean;
    completion_percentage: number; total_slots: number; uploaded_slots: number;
    missing_slots: string[]; last_upload_at: string | null;
}

type SortField = 'name' | 'completion_percentage';
type SortDir = 'asc' | 'desc';

function formatDate(d: string | null) {
    if (!d) return null;
    return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
    const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
    const colors = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
    const color = colors[name.charCodeAt(0) % colors.length];
    const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-xs';
    return <div className={`${sz} rounded-full ${color} flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm`}>{initials}</div>;
}

export default function Dashboard({ employees }: { employees: Employee[] }) {
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDir, setSortDir] = useState<SortDir>('asc');

    function toggleSort(field: SortField) {
        if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        else { setSortField(field); setSortDir('asc'); }
    }

    const sorted = [...employees].sort((a, b) => {
        const mul = sortDir === 'asc' ? 1 : -1;
        if (sortField === 'name') return mul * a.name.localeCompare(b.name);
        return mul * (a.completion_percentage - b.completion_percentage);
    });

    const total = employees.length;
    const complete = employees.filter((e) => e.completion_percentage === 100).length;

    const statCards = [
        { label: 'Total Employees', value: total, valueColor: 'text-gray-900', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
        { label: 'Fully Complete', value: complete, valueColor: 'text-emerald-600', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { label: 'Incomplete', value: total - complete, valueColor: 'text-amber-600', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    ];

    function SortBtn({ field, label }: { field: SortField; label: string }) {
        const active = sortField === field;
        return (
            <button onClick={() => toggleSort(field)}
                className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-800 transition-colors">
                {label}
                <span className={`text-xs ${active ? 'text-blue-600' : 'text-gray-300'}`}>{active && sortDir === 'desc' ? '↓' : '↑'}</span>
            </button>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Overview of all employee document submissions</p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-6">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-6">
                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 leading-tight">{card.label}</p>
                            <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                                <span className={`${card.iconColor} scale-75 sm:scale-100`}>{card.icon}</span>
                            </div>
                        </div>
                        <p className={`text-2xl sm:text-4xl font-bold ${card.valueColor}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-900">All Employees</h2>
                    {employees.length > 0 && <p className="text-xs text-gray-400 mt-0.5">{employees.length} total</p>}
                </div>

                {employees.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <p className="text-sm font-medium text-gray-700">No employees yet</p>
                        <p className="text-xs text-gray-400 mt-1">Add employees from User Management to see them here.</p>
                    </div>
                ) : (
                    <>
                        <div className="md:hidden divide-y divide-gray-50">
                            {sorted.map((emp) => (
                                <div key={emp.id} className="p-4">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <Avatar name={emp.name} size="sm" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{emp.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{emp.email}</p>
                                            </div>
                                        </div>
                                        <Link href={`/admin/users/${emp.id}`} className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                            View <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </Link>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">{emp.uploaded_slots}/{emp.total_slots} docs</span>
                                            <span className={`text-xs font-bold ${emp.completion_percentage === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>{emp.completion_percentage}%</span>
                                        </div>
                                        <ProgressBar percentage={emp.completion_percentage} />
                                    </div>
                                    {emp.missing_slots.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {emp.missing_slots.slice(0, 2).map((s) => <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-red-50 text-red-600 font-medium border border-red-100">{s}</span>)}
                                            {emp.missing_slots.length > 2 && <span className="px-2 py-0.5 text-xs rounded-md bg-gray-100 text-gray-500 font-medium">+{emp.missing_slots.length - 2} more</span>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/70">
                                        <th className="px-6 py-3.5 text-left"><SortBtn field="name" label="Employee" /></th>
                                        <th className="px-6 py-3.5 text-left"><SortBtn field="completion_percentage" label="Progress" /></th>
                                        <th className="px-6 py-3.5 text-left hidden lg:table-cell"><span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Missing Docs</span></th>
                                        <th className="px-6 py-3.5 text-left hidden xl:table-cell"><span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Last Upload</span></th>
                                        <th className="px-6 py-3.5 text-right"><span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Action</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {sorted.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={emp.name} />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{emp.name}</p>
                                                        <p className="text-xs text-gray-400">{emp.email}</p>
                                                    </div>
                                                    {!emp.is_active && <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-400 font-medium">Inactive</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 w-52">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-400">{emp.uploaded_slots}/{emp.total_slots} docs</span>
                                                        <span className={`text-xs font-bold ${emp.completion_percentage === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>{emp.completion_percentage}%</span>
                                                    </div>
                                                    <ProgressBar percentage={emp.completion_percentage} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                {emp.missing_slots.length === 0
                                                    ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>All submitted</span>
                                                    : <div className="flex flex-wrap gap-1">
                                                        {emp.missing_slots.slice(0, 3).map((s) => <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-red-50 text-red-600 font-medium border border-red-100">{s}</span>)}
                                                        {emp.missing_slots.length > 3 && <span className="px-2 py-0.5 text-xs rounded-md bg-gray-100 text-gray-500 font-medium">+{emp.missing_slots.length - 3} more</span>}
                                                    </div>
                                                }
                                            </td>
                                            <td className="px-6 py-4 hidden xl:table-cell">
                                                <span className="text-xs text-gray-500">{formatDate(emp.last_upload_at) ?? <span className="italic text-gray-300">No uploads yet</span>}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/admin/users/${emp.id}`} className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                                    View <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
