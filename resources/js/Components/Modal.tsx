import { ReactNode } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full z-10 overflow-hidden">
                <div className="h-1 w-full brand-bg" />
                <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">{title}</h3>
                    {children}
                </div>
            </div>
        </div>
    );
}
