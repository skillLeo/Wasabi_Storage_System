import { useState } from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import ConfirmModal from '@/Components/ConfirmModal';
import Spinner from '@/Components/Spinner';

interface Employee { id: number; name: string; email: string; is_active: boolean; }

function Avatar({ name }: { name: string }) {
    const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
    const colors = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
    const color = colors[name.charCodeAt(0) % colors.length];
    return <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>{initials}</div>;
}

export default function Users({ employees }: { employees: Employee[] }) {
    const [showModal, setShowModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const form = useForm({ name: '', email: '', password: '' });

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        form.post('/admin/users', { onSuccess: () => { form.reset(); setShowModal(false); } });
    }

    function handleToggleActive(emp: Employee) {
        setTogglingId(emp.id);
        router.post(`/admin/users/${emp.id}/update`, { is_active: !emp.is_active }, {
            onFinish: () => setTogglingId(null),
        });
    }

    function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.post(`/admin/users/${deleteTarget.id}/delete`, {}, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
        });
    }

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500 mt-1">{employees.length} employee{employees.length !== 1 ? 's' : ''} registered</p>
                </div>
                <button onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all self-start sm:self-auto">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    Add Employee
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {employees.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <p className="text-sm font-medium text-gray-500">No employees yet</p>
                        <button onClick={() => setShowModal(true)} className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">Add first employee</button>
                    </div>
                ) : (
                    <>
                        {/* Mobile */}
                        <div className="sm:hidden divide-y divide-gray-50">
                            {employees.map((emp) => (
                                <div key={emp.id} className="p-4">
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <Avatar name={emp.name} />
                                            <div className="min-w-0">
                                                <Link href={`/admin/users/${emp.id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 truncate block">{emp.name}</Link>
                                                <p className="text-xs text-gray-400 truncate">{emp.email}</p>
                                            </div>
                                        </div>
                                        <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${emp.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${emp.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />{emp.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/users/${emp.id}`} className="flex-1 text-center py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">View Docs</Link>
                                        <button onClick={() => handleToggleActive(emp)} disabled={togglingId === emp.id} className="flex-1 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors">
                                            {togglingId === emp.id ? '…' : emp.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button onClick={() => setDeleteTarget(emp)} className="flex-1 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/60">
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Employee</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 hidden md:table-cell">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {employees.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={emp.name} />
                                                    <div>
                                                        <Link href={`/admin/users/${emp.id}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">{emp.name}</Link>
                                                        <p className="text-xs text-gray-400 md:hidden">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{emp.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${emp.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${emp.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />{emp.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Link href={`/admin/users/${emp.id}`} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">View Docs</Link>
                                                    <button onClick={() => handleToggleActive(emp)} disabled={togglingId === emp.id} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors">
                                                        {togglingId === emp.id ? '…' : emp.is_active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button onClick={() => setDeleteTarget(emp)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            <Modal open={showModal} onClose={() => { setShowModal(false); form.reset(); }} title="Add New Employee">
                <form onSubmit={handleCreate} className="space-y-4">
                    <p className="text-sm text-gray-500">The employee will be assigned all current document slots automatically.</p>
                    {['name', 'email', 'password'].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 capitalize">{field === 'name' ? 'Full Name' : field === 'email' ? 'Email Address' : 'Temporary Password'}</label>
                            <input type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} required
                                minLength={field === 'password' ? 6 : undefined}
                                value={(form.data as any)[field]} onChange={(e) => form.setData(field as any, e.target.value)}
                                placeholder={field === 'name' ? 'John Smith' : field === 'email' ? 'john@company.com' : 'Min. 6 characters'}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                            {(form.errors as any)[field] && <p className="text-xs text-red-600 mt-1">{(form.errors as any)[field]}</p>}
                        </div>
                    ))}
                    <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={() => { setShowModal(false); form.reset(); }} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" disabled={form.processing} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                            {form.processing && <Spinner size="sm" />} Create Employee
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal open={!!deleteTarget} title="Delete Employee"
                message={`Delete ${deleteTarget?.name}? Their account and all uploaded documents will be permanently removed.`}
                onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
        </AdminLayout>
    );
}
