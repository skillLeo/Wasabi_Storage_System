import { useEffect, useState, useRef, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import Spinner from "@/components/ui/Spinner";

interface SlotItem {
  id: number;
  slot_id: number;
  slot_name: string;
  status: "uploaded" | "missing";
  file_name: string | null;
  file_type: string | null;
  uploaded_at: string | null;
  presigned_url: string | null;
}

interface SlotsResponse {
  completion_percentage: number;
  total_slots: number;
  uploaded_slots: number;
  slots: SlotItem[];
}

const ACCEPTED = ".jpg,.jpeg,.png,.pdf";
const MAX_SIZE_MB = 10;

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export default function DocumentsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<SlotsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/employee/slots");
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, slotId: number) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, and PDF files are accepted.");
      e.target.value = "";
      return;
    }

    setUploadingId(slotId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post(`/employee/slots/${slotId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData((prev) => {
        if (!prev) return prev;
        const updatedSlots = prev.slots.map((s) => s.slot_id === slotId ? { ...s, ...res.data } : s);
        const uploaded = updatedSlots.filter((s) => s.status === "uploaded").length;
        const total = updatedSlots.length;
        return { ...prev, slots: updatedSlots, uploaded_slots: uploaded, completion_percentage: total > 0 ? Math.round((uploaded / total) * 1000) / 10 : 0 };
      });

      toast.success("Document uploaded successfully.");
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      toast.error(axiosError.response?.data?.errors?.file?.[0] || axiosError.response?.data?.message || "Upload failed.");
    } finally {
      setUploadingId(null);
      if (fileInputRefs.current[slotId]) fileInputRefs.current[slotId]!.value = "";
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-gray-400">Loading your documents…</p>
      </div>
    );
  }

  if (!data) return null;

  const { slots, completion_percentage, uploaded_slots, total_slots } = data;
  const allDone = completion_percentage === 100;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Hello, {firstName} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">
          {allDone
            ? "All your documents are submitted — you're all set!"
            : "Please upload your required documents below."}
        </p>
      </div>

      <div className={`rounded-2xl border p-4 sm:p-6 mb-6 sm:mb-8 transition-all ${
        allDone
          ? "bg-emerald-50 border-emerald-200 shadow-sm"
          : "bg-white border-gray-100 shadow-sm"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-sm sm:text-base font-bold ${allDone ? "text-emerald-800" : "text-gray-900"}`}>
              Document Progress
            </p>
            <p className={`text-sm mt-0.5 ${allDone ? "text-emerald-600" : "text-gray-500"}`}>
              {uploaded_slots} of {total_slots} documents submitted
            </p>
            {allDone && (
              <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Profile complete!
              </p>
            )}
          </div>
          <div className={`text-3xl sm:text-4xl font-black ${allDone ? "text-emerald-600" : "text-blue-600"}`}>
            {completion_percentage}%
          </div>
        </div>
        <ProgressBar percentage={completion_percentage} />
      </div>

      {slots.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">No documents required yet</p>
          <p className="text-xs text-gray-400 mt-1">Your administrator will assign documents when ready.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${
                slot.status === "uploaded"
                  ? "border-gray-100"
                  : "border-dashed border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      slot.status === "uploaded" ? "bg-emerald-50" : "bg-blue-50"
                    }`}>
                      <svg className={`w-5 h-5 ${slot.status === "uploaded" ? "text-emerald-500" : "text-blue-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug truncate">{slot.slot_name}</h3>
                  </div>
                  <StatusBadge status={slot.status} />
                </div>

                {slot.status === "uploaded" && slot.presigned_url && (
                  <div className="mb-4 space-y-2">
                    {slot.file_type && ["jpg", "jpeg", "png"].includes(slot.file_type) ? (
                      <a href={slot.presigned_url} target="_blank" rel="noopener noreferrer" className="block group">
                        <img
                          src={slot.presigned_url}
                          alt={slot.file_name ?? "Document"}
                          className="w-full h-36 object-cover rounded-xl border border-gray-100 group-hover:opacity-90 transition-opacity"
                        />
                      </a>
                    ) : (
                      <a
                        href={slot.presigned_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-100 hover:border-blue-100 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-700 truncate">{slot.file_name}</p>
                          <p className="text-xs text-blue-500 group-hover:underline mt-0.5">View PDF →</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    {slot.uploaded_at && (
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(slot.uploaded_at)}
                      </p>
                    )}
                  </div>
                )}

                {slot.status === "missing" && (
                  <p className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    JPG, PNG or PDF · Max {MAX_SIZE_MB}MB
                  </p>
                )}

                <div className="mt-auto">
                  <input
                    ref={(el) => { fileInputRefs.current[slot.slot_id] = el; }}
                    type="file"
                    accept={ACCEPTED}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, slot.slot_id)}
                    disabled={uploadingId !== null}
                  />
                  <button
                    onClick={() => fileInputRefs.current[slot.slot_id]?.click()}
                    disabled={uploadingId !== null}
                    className={`w-full py-2.5 px-4 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                      slot.status === "uploaded"
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                    }`}
                  >
                    {uploadingId === slot.slot_id ? (
                      <><Spinner size="sm" /> Uploading…</>
                    ) : slot.status === "uploaded" ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Replace File
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload Document
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
