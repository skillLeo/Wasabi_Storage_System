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
type StatusFilter = 'all' | 'complete' | 'incomplete' | 'inactive';

function formatDate(d: string | null) {
    if (!d) return null;
    return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
    const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
    const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-xs';
    return <div className={`${sz} rounded-full brand-bg flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm`}>{initials}</div>;
}

export default function Progress({ employees }: { employees: Employee[] }) {
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    function toggleSort(field: SortField) {
        if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        else { setSortField(field); setSortDir('asc'); }
    }

    const filtered = employees.filter((employee) => {
        const query = search.trim().toLowerCase();
        const matchesSearch = query === ''
            || employee.name.toLowerCase().includes(query)
            || employee.email.toLowerCase().includes(query);

        const matchesStatus =
            statusFilter === 'all'
            || (statusFilter === 'complete' && employee.completion_percentage === 100)
            || (statusFilter === 'incomplete' && employee.completion_percentage < 100)
            || (statusFilter === 'inactive' && !employee.is_active);

        return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
        const mul = sortDir === 'asc' ? 1 : -1;
        if (sortField === 'name') return mul * a.name.localeCompare(b.name);
        return mul * (a.completion_percentage - b.completion_percentage);
    });

    function SortBtn({ field, label }: { field: SortField; label: string }) {
        const active = sortField === field;
        return (
            <button onClick={() => toggleSort(field)}
                className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-800 transition-colors">
                {label}
                <span className={`text-xs ${active ? 'brand-text' : 'text-gray-300'}`}>{active && sortDir === 'desc' ? 'v' : '^'}</span>
            </button>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Document tracking</p>
                    <h1 className="mt-2 text-2xl font-bold text-gray-950">Document Progress</h1>
                    <p className="mt-1 text-sm text-gray-500">Track employee completion, missing documents, and last upload activity.</p>
                </div>
                <Link href="/admin/users" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 brand-primary text-white text-sm font-semibold rounded-xl transition-all self-start lg:self-auto">
                    Manage Users
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Employee Progress List</h2>
                        {employees.length > 0 && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                Showing {sorted.length} of {employees.length}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative">
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" />
                            </svg>
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search name or email"
                                className="w-full sm:w-64 pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                            className="w-full sm:w-44 px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                        >
                            <option value="all">All statuses</option>
                            <option value="incomplete">Incomplete</option>
                            <option value="complete">Complete</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {employees.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <p className="text-sm font-medium text-gray-700">No employees yet</p>
                        <p className="text-xs text-gray-400 mt-1">Add employees from User Management to see progress here.</p>
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <p className="text-sm font-medium text-gray-700">No matching employees</p>
                        <p className="text-xs text-gray-400 mt-1">Adjust the search or filter to show more records.</p>
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
                                        <Link href={`/admin/users/${emp.id}`} className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors brand-secondary">
                                            View <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </Link>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">{emp.uploaded_slots}/{emp.total_slots} docs</span>
                                            <span className={`text-xs font-bold ${emp.completion_percentage === 100 ? 'text-emerald-600' : 'brand-text'}`}>{emp.completion_percentage}%</span>
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
                                        <tr key={emp.id} className="brand-row-hover transition-colors">
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
                                                        <span className={`text-xs font-bold ${emp.completion_percentage === 100 ? 'text-emerald-600' : 'brand-text'}`}>{emp.completion_percentage}%</span>
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
                                                <Link href={`/admin/users/${emp.id}`} className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors brand-secondary">
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
