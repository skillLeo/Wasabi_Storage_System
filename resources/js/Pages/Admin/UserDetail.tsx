import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ProgressBar from '@/Components/ProgressBar';
import StatusBadge from '@/Components/StatusBadge';

interface SlotDetail {
    id: number; slot_id: number; slot_name: string;
    status: 'uploaded' | 'missing'; file_name: string | null;
    file_type: string | null; uploaded_at: string | null; presigned_url: string | null;
}

interface EmployeeDetail {
    id: number; name: string; email: string; is_active: boolean; completion_percentage: number;
}

function formatDate(d: string | null) {
    if (!d) return null;
    return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function UserDetail({ employee, slots }: { employee: EmployeeDetail; slots: SlotDetail[] }) {
    const uploadedCount = slots.filter((s) => s.status === 'uploaded').length;
    const initials = employee.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

    return (
        <AdminLayout>
            <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to Users
            </Link>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-600 flex items-center justify-center text-white text-lg sm:text-2xl font-bold flex-shrink-0 shadow-sm">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{employee.name}</h1>
                            {!employee.is_active && <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500 font-medium border border-gray-200">Inactive</span>}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{employee.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className={`text-2xl sm:text-3xl font-black ${employee.completion_percentage === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
                            {employee.completion_percentage}%
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">{uploadedCount}/{slots.length} docs</p>
                    </div>
                </div>
                <div className="mt-4"><ProgressBar percentage={employee.completion_percentage} /></div>
                {employee.completion_percentage === 100 && (
                    <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        All documents submitted
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Documents</h2>
                <span className="text-xs text-gray-400">{slots.length} total</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {slots.map((slot) => (
                    <div key={slot.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${slot.status === 'uploaded' ? 'border-gray-100' : 'border-dashed border-gray-200'}`}>
                        <div className="p-5">
                            <div className="flex items-start justify-between gap-2 mb-4">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${slot.status === 'uploaded' ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                                        <svg className={`w-5 h-5 ${slot.status === 'uploaded' ? 'text-emerald-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{slot.slot_name}</h3>
                                </div>
                                <StatusBadge status={slot.status} />
                            </div>

                            {slot.status === 'uploaded' ? (
                                <div className="space-y-3">
                                    {slot.file_type && ['jpg', 'jpeg', 'png'].includes(slot.file_type) && slot.presigned_url ? (
                                        <a href={slot.presigned_url} target="_blank" rel="noopener noreferrer" className="block group">
                                            <img src={slot.presigned_url} alt={slot.file_name ?? 'Document'} className="w-full h-36 object-cover rounded-xl border border-gray-100 group-hover:opacity-90 transition-opacity" />
                                        </a>
                                    ) : slot.presigned_url ? (
                                        <a href={slot.presigned_url} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-100 hover:border-blue-100 transition-all group">
                                            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold text-gray-700 truncate">{slot.file_name}</p>
                                                <p className="text-xs text-blue-500 group-hover:underline mt-0.5">View PDF →</p>
                                            </div>
                                        </a>
                                    ) : null}
                                    {slot.uploaded_at && (
                                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {formatDate(slot.uploaded_at)}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 italic">No file submitted yet</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
