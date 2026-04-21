import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";

interface Slot {
  id: number;
  name: string;
}

export default function SlotsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSlotName, setNewSlotName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Slot | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/slots");
      setSlots(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newSlotName.trim()) return;
    setAdding(true);
    try {
      const res = await api.post("/admin/slots", { name: newSlotName.trim() });
      setSlots((prev) => [...prev, res.data]);
      setNewSlotName("");
      setShowAddModal(false);
      toast.success("Slot created and assigned to all employees.");
    } catch {
      toast.error("Failed to create slot.");
    } finally {
      setAdding(false);
    }
  }

  async function handleSaveEdit(slot: Slot) {
    if (!editingName.trim()) return;
    setSavingId(slot.id);
    try {
      const res = await api.put(`/admin/slots/${slot.id}`, { name: editingName.trim() });
      setSlots((prev) => prev.map((s) => (s.id === slot.id ? res.data : s)));
      setEditingId(null);
      toast.success("Slot renamed successfully.");
    } catch {
      toast.error("Failed to update slot.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/slots/${deleteTarget.id}`);
      setSlots((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast.success("Slot deleted.");
    } catch {
      toast.error("Failed to delete slot.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Slot Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {slots.length} slot{slots.length !== 1 ? "s" : ""} defined — auto-assigned to all employees
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Slot
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-gray-400">Loading slots…</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">No document slots yet</p>
            <p className="text-xs text-gray-400 mt-1">Create your first slot to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create first slot
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {slots.map((slot, index) => (
              <li key={slot.id} className="group flex items-center gap-3 px-4 sm:px-6 py-4 hover:bg-gray-50/60 transition-colors">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>

                {editingId === slot.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/30"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(slot);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <button
                      onClick={() => handleSaveEdit(slot)}
                      disabled={savingId === slot.id}
                      className="px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      {savingId === slot.id ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium text-gray-800">{slot.name}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingId(slot.id); setEditingName(slot.name); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Rename
                      </button>
                      <button
                        onClick={() => setDeleteTarget(slot)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {slots.length > 0 && (
        <div className="mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>New slots are automatically assigned to all existing employees. Hover a slot to rename or delete it.</span>
        </div>
      )}

      <Modal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setNewSlotName(""); }}
        title="Create New Slot"
      >
        <form onSubmit={handleAdd}>
          <p className="text-sm text-gray-500 mb-5">
            This slot will be automatically assigned to all existing employees as <span className="font-medium text-red-600">missing</span>.
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Slot name</label>
          <input
            type="text"
            required
            autoFocus
            value={newSlotName}
            onChange={(e) => setNewSlotName(e.target.value)}
            placeholder="e.g. Passport Copy, Social Security Card"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={() => { setShowAddModal(false); setNewSlotName(""); }}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adding || !newSlotName.trim()}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
            >
              {adding && <Spinner size="sm" />}
              Create Slot
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Slot"
        message={`Delete "${deleteTarget?.name}"? All uploaded files for this slot will be permanently removed from storage and unassigned from all employees.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
