import { Link, useForm, usePage } from '@inertiajs/react';
import Spinner from '@/Components/Spinner';
import { useLogo } from '@/hooks/useLogo';
import { useBrandTheme } from '@/hooks/useBrandTheme';

interface Branding {
    logo_width_mobile: number;
    logo_alt_text: string;
}

export default function ForgotPassword() {
    const { branding, flash } = usePage().props as { branding: Branding; flash?: { success?: string } };
    const logoSrc = useLogo();
    useBrandTheme();

    const form = useForm({ email: '' });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        form.post('/forgot-password');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
            <div className="w-full max-w-sm">
                <div className="mb-10 flex justify-center">
                    <img
                        src={logoSrc}
                        alt={branding.logo_alt_text}
                        style={{ width: branding.logo_width_mobile, maxWidth: '100%', height: 'auto' }}
                        className="object-contain block"
                    />
                </div>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-950">Forgot password?</h1>
                    <p className="text-sm text-gray-500 mt-1.5">Enter your email and we will send you a reset link.</p>
                </div>

                {flash?.success && (
                    <div className="mb-5 px-4 py-3 rounded-xl brand-soft-bg brand-soft-border border">
                        <p className="text-sm brand-text">{flash.success}</p>
                    </div>
                )}

                {form.errors.email && (
                    <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                        <p className="text-sm text-red-700">{form.errors.email}</p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                        <input
                            type="email"
                            required
                            autoComplete="email"
                            value={form.data.email}
                            onChange={(event) => form.setData('email', event.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                            placeholder="you@company.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="w-full py-3 px-4 brand-primary disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {form.processing ? <><Spinner size="sm" /> Sending link...</> : 'Send Reset Link'}
                    </button>
                </form>

                <Link href="/" className="mt-6 block text-center text-sm font-semibold brand-text">
                    Back to sign in
                </Link>
            </div>
        </div>
    );
}
