import { Link, useForm, usePage } from '@inertiajs/react';
import Spinner from '@/Components/Spinner';
import { useLogo } from '@/hooks/useLogo';
import { useBrandTheme } from '@/hooks/useBrandTheme';

interface Branding {
    logo_width_desktop: number;
    logo_width_mobile: number;
    logo_alt_text: string;
    forgot_panel_headline: string;
    forgot_panel_subheading: string;
    forgot_title: string;
    forgot_subtitle: string;
    forgot_email_label: string;
    forgot_email_placeholder: string;
    forgot_submit_text: string;
    forgot_submitting_text: string;
    forgot_back_text: string;
}

export default function ForgotPassword() {
    const { branding, flash } = usePage().props as unknown as { branding: Branding; flash?: { success?: string } };
    const logoSrc = useLogo();
    useBrandTheme();

    const form = useForm({ email: '' });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        form.post('/forgot-password');
    }

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left panel — gradient, same as Login */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col relative overflow-hidden brand-gradient">
                <div className="relative flex flex-col justify-center h-full px-12 xl:px-16">
                    <div className="mb-10 inline-flex bg-white rounded-2xl px-6 py-4 shadow-xl shadow-black/10 max-w-md">
                        <img
                            src={logoSrc}
                            alt={branding.logo_alt_text}
                            style={{ width: branding.logo_width_desktop, maxWidth: '100%', height: 'auto' }}
                            className="object-contain block"
                        />
                    </div>
                    <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-5 whitespace-pre-line max-w-md">
                        {branding.forgot_panel_headline}
                    </h1>
                    <p className="text-white/82 text-base leading-relaxed max-w-md">
                        {branding.forgot_panel_subheading}
                    </p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 sm:px-10 py-12">
                <div className="lg:hidden mb-10 flex justify-center">
                    <img
                        src={logoSrc}
                        alt={branding.logo_alt_text}
                        style={{ width: branding.logo_width_mobile, maxWidth: '100%', height: 'auto' }}
                        className="object-contain block"
                    />
                </div>

                <div className="w-full max-w-sm">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-950">{branding.forgot_title}</h2>
                        <p className="text-sm text-gray-500 mt-1.5">{branding.forgot_subtitle}</p>
                    </div>

                    {flash?.success && (
                        <div className="mb-5 px-4 py-3 rounded-xl brand-soft-bg brand-soft-border border">
                            <p className="text-sm brand-text">{flash.success}</p>
                        </div>
                    )}

                    {form.errors.email && (
                        <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700">{form.errors.email}</p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{branding.forgot_email_label}</label>
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                value={form.data.email}
                                onChange={(event) => form.setData('email', event.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                                placeholder={branding.forgot_email_placeholder}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="w-full py-3 px-4 brand-primary disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {form.processing ? <><Spinner size="sm" /> {branding.forgot_submitting_text}</> : branding.forgot_submit_text}
                        </button>
                    </form>

                    <Link href="/" className="mt-6 block text-center text-sm font-semibold brand-text">
                        {branding.forgot_back_text}
                    </Link>
                </div>
            </div>
        </div>
    );
}
