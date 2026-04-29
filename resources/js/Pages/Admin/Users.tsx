import { FormEvent, ReactNode, useState } from 'react';
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
        <div className="w-10 h-10 rounded-full brand-bg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {initials}
        </div>
    );
}

function IconButton({ children }: { children: ReactNode }) {
    return <span className="w-4 h-4 inline-flex items-center justify-center">{children}</span>;
}

function EyeIcon({ hidden }: { hidden: boolean }) {
    return hidden ? (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 4.2A10.7 10.7 0 0112 4c5 0 8.5 3.6 10 8a11.8 11.8 0 01-2.1 3.6M6.1 6.1A11.8 11.8 0 002 12c1.5 4.4 5 8 10 8 1.3 0 2.5-.2 3.6-.7" />
        </svg>
    ) : (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
    );
}

function PasswordField({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    minLength = 6,
    visible,
    onToggle,
    error,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    required?: boolean;
    minLength?: number;
    visible: boolean;
    onToggle: () => void;
    error?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
                <input
                    type={visible ? 'text' : 'password'}
                    required={required}
                    minLength={minLength}
                    autoComplete="new-password"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute inset-y-0 right-0 px-4 text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label={visible ? 'Hide password' : 'Show password'}
                >
                    <IconButton><EyeIcon hidden={visible} /></IconButton>
                </button>
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}

export default function Users({ employees }: { employees: Employee[] }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editTarget, setEditTarget] = useState<Employee | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [showCreatePassword, setShowCreatePassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);

    const createForm = useForm({ name: '', email: '', password: '', role: 'employee' });
    const editForm = useForm({ name: '', email: '', password: '' });

    function openCreateModal() {
        createForm.clearErrors();
        createForm.setData({ name: '', email: '', password: '', role: 'employee' });
        setShowCreatePassword(false);
        setShowCreateModal(true);
    }

    function closeCreateModal() {
        setShowCreateModal(false);
        createForm.reset();
        createForm.clearErrors();
    }

    function openEditModal(emp: Employee) {
        editForm.clearErrors();
        editForm.setData({ name: emp.name, email: emp.email, password: '' });
        setShowEditPassword(false);
        setEditTarget(emp);
    }

    function closeEditModal() {
        setEditTarget(null);
        editForm.reset();
        editForm.clearErrors();
    }

    function handleCreate(e: FormEvent) {
        e.preventDefault();
        createForm.post('/admin/users', {
            onSuccess: closeCreateModal,
        });
    }

    function handleEdit(e: FormEvent) {
        e.preventDefault();
        if (!editTarget) return;

        editForm.post(`/admin/users/${editTarget.id}/update`, {
            onSuccess: closeEditModal,
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
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Team access</p>
                    <h1 className="mt-2 text-2xl font-bold text-gray-950">User Management</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {employees.length} user{employees.length !== 1 ? 's' : ''} managed by admin.
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 brand-primary text-white text-sm font-semibold rounded-xl transition-all self-start lg:self-auto"
                >
                    <IconButton>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v6m3-3h-6M13 7a4 4 0 11-8 0 4 4 0 018 0zM3 21a6 6 0 0112 0" /></svg>
                    </IconButton>
                    Add Employee
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Users</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Edit account details, review documents, or update access.</p>
                    </div>
                </div>

                {employees.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <p className="text-sm font-medium text-gray-500">No users yet</p>
                        <button onClick={openCreateModal} className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 brand-primary text-white text-sm font-semibold rounded-xl transition-colors">Add first user</button>
                    </div>
                ) : (
                    <>
                        <div className="sm:hidden divide-y divide-gray-50">
                            {employees.map((emp) => (
                                <div key={emp.id} className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar name={emp.name} />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Link href={`/admin/users/${emp.id}`} className="text-sm font-semibold text-gray-900 hover-brand-text truncate">{emp.name}</Link>
                                                    {emp.role === 'admin' && <span className="px-1.5 py-0.5 text-xs rounded-md bg-purple-50 text-purple-700 font-semibold border border-purple-100">Admin</span>}
                                                </div>
                                                <p className="text-xs text-gray-400 truncate">{emp.email}</p>
                                            </div>
                                        </div>
                                        <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${emp.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${emp.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />{emp.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <Link href={`/admin/users/${emp.id}`} className="text-center py-2 text-xs font-semibold rounded-lg transition-colors brand-secondary">View Docs</Link>
                                        <button onClick={() => openEditModal(emp)} className="py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Edit</button>
                                        <button onClick={() => handleToggleActive(emp)} disabled={togglingId === emp.id} className="py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors">
                                            {togglingId === emp.id ? '...' : emp.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button onClick={() => setDeleteTarget(emp)} className="py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/70">
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Role</th>
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
                                                    <Link href={`/admin/users/${emp.id}`} className="font-semibold text-gray-900 hover-brand-text transition-colors">{emp.name}</Link>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{emp.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${emp.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-gray-100 text-gray-600'}`}>
                                                    {emp.role === 'admin' ? 'Admin' : 'Employee'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${emp.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${emp.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />{emp.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Link href={`/admin/users/${emp.id}`} className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors brand-secondary">Docs</Link>
                                                    <button onClick={() => openEditModal(emp)} className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Edit</button>
                                                    <button onClick={() => handleToggleActive(emp)} disabled={togglingId === emp.id} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors">
                                                        {togglingId === emp.id ? '...' : emp.is_active ? 'Deactivate' : 'Activate'}
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

            <Modal open={showCreateModal} onClose={closeCreateModal} title="Add New User">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                        <select
                            value={createForm.data.role}
                            onChange={(e) => createForm.setData('role', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                        >
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    {createForm.data.role === 'employee' && (
                        <p className="text-xs text-gray-400 -mt-2">Employee will be assigned all current documents automatically.</p>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                required
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="Enter name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                            />
                            {createForm.errors.name && <p className="text-xs text-red-600 mt-1">{createForm.errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.target.value)}
                                placeholder="Enter email"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                            />
                            {createForm.errors.email && <p className="text-xs text-red-600 mt-1">{createForm.errors.email}</p>}
                        </div>

                        <PasswordField
                            label="Temporary Password"
                            value={createForm.data.password}
                            onChange={(value) => createForm.setData('password', value)}
                            placeholder="Enter password"
                            required
                            visible={showCreatePassword}
                            onToggle={() => setShowCreatePassword((value) => !value)}
                            error={createForm.errors.password}
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={closeCreateModal} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" disabled={createForm.processing} className="px-5 py-2.5 text-sm font-semibold text-white brand-primary disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2">
                            {createForm.processing && <Spinner size="sm" />} Create {createForm.data.role === 'admin' ? 'Admin' : 'Employee'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal open={!!editTarget} onClose={closeEditModal} title="Edit User">
                <form onSubmit={handleEdit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            required
                            value={editForm.data.name}
                            onChange={(e) => editForm.setData('name', e.target.value)}
                            placeholder="Enter name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                        />
                        {editForm.errors.name && <p className="text-xs text-red-600 mt-1">{editForm.errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            required
                            value={editForm.data.email}
                            onChange={(e) => editForm.setData('email', e.target.value)}
                            placeholder="Enter email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                        />
                        {editForm.errors.email && <p className="text-xs text-red-600 mt-1">{editForm.errors.email}</p>}
                    </div>

                    <PasswordField
                        label="New Password"
                        value={editForm.data.password}
                        onChange={(value) => editForm.setData('password', value)}
                        placeholder="Leave blank to keep current password"
                        visible={showEditPassword}
                        onToggle={() => setShowEditPassword((value) => !value)}
                        error={editForm.errors.password}
                    />

                    <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={closeEditModal} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" disabled={editForm.processing} className="px-5 py-2.5 text-sm font-semibold text-white brand-primary disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2">
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
