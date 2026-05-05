import { ReactNode, useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import ConfirmModal from '@/Components/ConfirmModal';
import Spinner from '@/Components/Spinner';

interface Employee {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    role: string;
}

function Avatar({ name }: { name: string }) {
    const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
    return (
        <div className="w-8 h-8 rounded-full brand-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
        </div>
    );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
    return hidden ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 4.2A10.7 10.7 0 0112 4c5 0 8.5 3.6 10 8a11.8 11.8 0 01-2.1 3.6M6.1 6.1A11.8 11.8 0 002 12c1.5 4.4 5 8 10 8 1.3 0 2.5-.2 3.6-.7" />
        </svg>
    ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
    );
}

export default function Users({ employees }: { employees: Employee[] }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editTarget, setEditTarget] = useState<Employee | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [showCreatePw, setShowCreatePw] = useState(false);
    const [showEditPw, setShowEditPw] = useState(false);

    const createForm = useForm({ name: '', email: '', password: '', role: 'employee' });
    const editForm = useForm({ name: '', email: '', password: '', role: 'employee' });

    function openCreateModal() {
        createForm.reset();
        createForm.clearErrors();
        setShowCreatePw(false);
        setShowCreateModal(true);
    }

    function closeCreateModal() {
        setShowCreateModal(false);
        createForm.reset();
        createForm.clearErrors();
    }

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/admin/users', {
            onSuccess: closeCreateModal,
        });
    }

    function openEdit(emp: Employee) {
        editForm.clearErrors();
        editForm.setData({ name: emp.name, email: emp.email, password: '', role: emp.role });
        setShowEditPw(false);
        setEditTarget(emp);
    }

    function handleEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.post(`/admin/users/${editTarget.id}/update`, {
            onSuccess: () => { setEditTarget(null); editForm.reset(); },
        });
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
        <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Team access</p>
                    <h1 className="mt-1 text-2xl font-bold text-gray-950">User Management</h1>
                    <p className="mt-1 text-sm text-gray-500">{employees.length} user{employees.length !== 1 ? 's' : ''} managed by admin.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 brand-primary text-white text-sm font-semibold rounded-xl transition-all self-start sm:self-auto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v6m3-3h-6M13 7a4 4 0 11-8 0 4 4 0 018 0zM3 21a6 6 0 0112 0" /></svg>
                    Add Employee
                </button>
            </div>

            {/* Users table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                    <h2 className="text-sm font-semibold text-gray-700">All Users</h2>
                </div>

                {employees.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <p className="text-sm font-medium text-gray-500">No users yet</p>
                        <p className="text-xs text-gray-400 mt-1">Use the form above to add your first user.</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile cards */}
                        <div className="sm:hidden divide-y divide-gray-50">
                            {employees.map((emp) => (
                                <div key={emp.id} className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar name={emp.name} />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Link href={`/admin/users/${emp.id}`} className="text-sm font-semibold text-gray-900 hover-brand-text truncate">{emp.name}</Link>
                                                    <span className={`px-1.5 py-0.5 text-xs rounded-md font-semibold border ${emp.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                        {emp.role === 'admin' ? 'Admin' : 'Employee'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 truncate">{emp.email}</p>
                                            </div>
                                        </div>
                                        <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${emp.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${emp.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                            {emp.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        <Link href={`/admin/users/${emp.id}`} className="inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-colors brand-secondary">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            View Docs
                                        </Link>
                                        <button onClick={() => openEdit(emp)} className="inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            Edit
                                        </button>
                                        <button onClick={() => handleToggleActive(emp)} disabled={togglingId === emp.id} className="inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl disabled:opacity-50 transition-colors">
                                            {togglingId === emp.id ? <Spinner size="sm" /> : null}
                                            {togglingId === emp.id ? '' : emp.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button onClick={() => setDeleteTarget(emp)} className="inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table — icon-only actions to keep columns narrow */}
                        <div className="hidden sm:block">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">User</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Email</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Role</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Status</th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {employees.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <Avatar name={emp.name} />
                                                    <Link href={`/admin/users/${emp.id}`} className="font-semibold text-gray-900 hover-brand-text transition-colors text-sm">{emp.name}</Link>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-gray-500 text-sm">{emp.email}</td>
                                            <td className="px-5 py-3">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${emp.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-gray-100 text-gray-600'}`}>
                                                    {emp.role === 'admin' ? 'Admin' : 'Employee'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${emp.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${emp.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                                    {emp.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1.5 justify-end">
                                                    <Link href={`/admin/users/${emp.id}`} title="View documents"
                                                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg brand-secondary transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    </Link>
                                                    <button onClick={() => openEdit(emp)} title="Edit user"
                                                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button onClick={() => handleToggleActive(emp)} disabled={togglingId === emp.id}
                                                        title={emp.is_active ? 'Deactivate' : 'Activate'}
                                                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors">
                                                        {togglingId === emp.id
                                                            ? <Spinner size="sm" />
                                                            : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={emp.is_active ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} /></svg>}
                                                    </button>
                                                    <button onClick={() => setDeleteTarget(emp)} title="Delete user"
                                                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
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

            {/* Create modal */}
            <Modal open={showCreateModal} onClose={closeCreateModal} title="Add New User">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                        <select value={createForm.data.role} onChange={(e) => createForm.setData('role', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field">
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                        {createForm.data.role === 'employee' && (
                            <p className="text-xs text-gray-400 mt-1">Employee will be assigned all current documents automatically.</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input type="text" required value={createForm.data.name}
                            onChange={(e) => createForm.setData('name', e.target.value)}
                            placeholder="Enter full name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field" />
                        {createForm.errors.name && <p className="text-xs text-red-600 mt-1">{createForm.errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input type="email" required value={createForm.data.email}
                            onChange={(e) => createForm.setData('email', e.target.value)}
                            placeholder="Enter email address"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field" />
                        {createForm.errors.email && <p className="text-xs text-red-600 mt-1">{createForm.errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Temporary Password</label>
                        <div className="relative">
                            <input type={showCreatePw ? 'text' : 'password'} required minLength={6}
                                value={createForm.data.password}
                                onChange={(e) => createForm.setData('password', e.target.value)}
                                placeholder="Enter password" autoComplete="new-password"
                                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field" />
                            <button type="button" onClick={() => setShowCreatePw(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <EyeIcon hidden={showCreatePw} />
                            </button>
                        </div>
                        {createForm.errors.password && <p className="text-xs text-red-600 mt-1">{createForm.errors.password}</p>}
                    </div>
                    <div className="flex gap-3 justify-end pt-1">
                        <button type="button" onClick={closeCreateModal}
                            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" disabled={createForm.processing}
                            className="px-5 py-2.5 text-sm font-semibold text-white brand-primary disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2">
                            {createForm.processing && <Spinner size="sm" />}
                            Create {createForm.data.role === 'admin' ? 'Admin' : 'Employee'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit modal — includes Role */}
            <Modal open={!!editTarget} onClose={() => { setEditTarget(null); editForm.reset(); }} title="Edit User">
                <form onSubmit={handleEdit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                        <select
                            value={editForm.data.role}
                            onChange={(e) => editForm.setData('role', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                        >
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input type="text" required value={editForm.data.name}
                            onChange={(e) => editForm.setData('name', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field" />
                        {editForm.errors.name && <p className="text-xs text-red-600 mt-1">{editForm.errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input type="email" required value={editForm.data.email}
                            onChange={(e) => editForm.setData('email', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field" />
                        {editForm.errors.email && <p className="text-xs text-red-600 mt-1">{editForm.errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                        <div className="relative">
                            <input type={showEditPw ? 'text' : 'password'} value={editForm.data.password}
                                onChange={(e) => editForm.setData('password', e.target.value)}
                                placeholder="Leave blank to keep current"
                                autoComplete="new-password"
                                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field" />
                            <button type="button" onClick={() => setShowEditPw(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <EyeIcon hidden={showEditPw} />
                            </button>
                        </div>
                        {editForm.errors.password && <p className="text-xs text-red-600 mt-1">{editForm.errors.password}</p>}
                    </div>
                    <div className="flex gap-3 justify-end pt-1">
                        <button type="button" onClick={() => { setEditTarget(null); editForm.reset(); }}
                            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" disabled={editForm.processing}
                            className="px-5 py-2.5 text-sm font-semibold text-white brand-primary disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2">
                            {editForm.processing && <Spinner size="sm" />} Save Changes
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                open={!!deleteTarget}
                title="Delete User"
                message={`Delete ${deleteTarget?.name}? Their account and all uploaded documents will be permanently removed.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                loading={deleting}
            />
        </>
    );
}

Users.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;