import { ReactNode, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { useLogo } from '@/hooks/useLogo';

export default function EmployeeLayout({ children }: { children: ReactNode }) {
    const { auth, flash } = usePage().props as any;
    const logoSrc = useLogo();

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <img src={logoSrc} alt="No One Left Behind" style={{ width: 165, height: 'auto' }} className="object-contain block" />
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 hidden sm:block">{auth.user?.name}</span>
                        <button onClick={() => router.post('/logout')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
                {children}
            </main>
        </div>
    );
}
