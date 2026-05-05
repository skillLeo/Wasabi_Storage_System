import { ReactNode, useRef, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import Spinner from '@/Components/Spinner';

interface Slot { id: number; name: string; }

export default function Slots({ slots }: { slots: Slot[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Slot | null>(null);
    const [deleting, setDeleting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const createForm = useForm({ name: '' });
    const editForm = useForm({ name: '' });

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!createForm.data.name.trim()) return;
        createForm.post('/admin/documents', {
            onSuccess: () => createForm.reset(),
        });
    }

    function startEdit(slot: Slot) {
        setEditingId(slot.id);
        editForm.setData('name', slot.name);
    }

    function handleSaveEdit(slot: Slot) {
        editForm.post(`/admin/documents/${slot.id}/update`, {
            onSuccess: () => setEditingId(null),
        });
    }

    function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.post(`/admin/documents/${deleteTarget.id}/delete`, {}, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
        });
    }

    return (
        <>
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Document Management</h1>
                <p className="text-sm text-gray-500 mt-1">{slots.length} document{slots.length !== 1 ? 's' : ''} defined</p>
            </div>

            {/* Inline create form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Add New Document</p>
                <form onSubmit={handleCreate} className="flex gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        required
                        value={createForm.data.name}
                        onChange={(e) => createForm.setData('name', e.target.value)}
                        placeholder="e.g. Passport Copy, Social Security Card"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                    />
                    <button
                        type="submit"
                        disabled={createForm.processing || !createForm.data.name.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white brand-primary disabled:opacity-50 rounded-xl transition-colors whitespace-nowrap"
                    >
                        {createForm.processing
                            ? <><Spinner size="sm" /> Saving…</>
                            : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add Document</>}
                    </button>
                </form>
                {createForm.errors.name && <p className="text-xs text-red-600 mt-2">{createForm.errors.name}</p>}
                <p className="text-xs text-gray-400 mt-2">New documents are automatically assigned to all existing employees.</p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                    <h2 className="text-sm font-semibold text-gray-700">All Documents</h2>
                </div>

                {slots.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <p className="text-sm font-medium text-gray-500">No documents yet</p>
                        <p className="text-xs text-gray-400 mt-1">Use the form above to add your first document.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-14">#</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Document Name</th>
                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400 w-48">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {slots.map((slot, index) => (
                                <tr key={slot.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <span className="w-7 h-7 rounded-lg brand-secondary text-xs font-bold inline-flex items-center justify-center flex-shrink-0">
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {editingId === slot.id ? (
                                            <input
                                                type="text"
                                                value={editForm.data.name}
                                                onChange={(e) => editForm.setData('name', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none brand-field brand-soft-bg brand-soft-border"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveEdit(slot);
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                            />
                                        ) : (
                                            <span className="font-medium text-gray-800">{slot.name}</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2 justify-end">
                                            {editingId === slot.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSaveEdit(slot)}
                                                        disabled={editForm.processing}
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white brand-primary rounded-xl disabled:opacity-50 transition-colors"
                                                    >
                                                        {editForm.processing ? <Spinner size="sm" /> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="inline-flex items-center px-3.5 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(slot)}
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        Rename
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(slot)}
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <ConfirmModal
                open={!!deleteTarget}
                title="Delete Document"
                message={`Delete "${deleteTarget?.name}"? All uploaded files for this document will be permanently removed.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                loading={deleting}
            />
        </>
    );
}

Slots.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;