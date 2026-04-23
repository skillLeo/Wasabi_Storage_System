import Spinner from '@/Components/Spinner';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, loading = false }: ConfirmModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full z-10 overflow-hidden">
                <div className="h-1 w-full bg-red-500" />
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100 justify-end">
                    <button onClick={onCancel} disabled={loading}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50 shadow-sm">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
                        {loading && <Spinner size="sm" />}
                        {loading ? 'Deleting…' : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
