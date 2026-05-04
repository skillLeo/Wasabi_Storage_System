import { FormEvent, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Spinner from '@/Components/Spinner';
import { useLogo } from '@/hooks/useLogo';
import { useBrandTheme } from '@/hooks/useBrandTheme';

interface Branding {
    logo_width_desktop: number;
    logo_width_mobile: number;
    logo_alt_text: string;
    reset_badge_text: string;
    reset_title: string;
    reset_description: string;
    reset_email_label: string;
    reset_new_password_label: string;
    reset_new_password_placeholder: string;
    reset_confirm_label: string;
    reset_confirm_placeholder: string;
    reset_submit_text: string;
    reset_submitting_text: string;
    reset_back_text: string;
}

interface Props {
    token: string;
    email: string;
}

function EyeIcon({ hidden }: { hidden: boolean }) {
    return hidden ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 4.2A10.7 10.7 0 0112 4c5 0 8.5 3.6 10 8a11.8 11.8 0 01-2.1 3.6M6.1 6.1A11.8 11.8 0 002 12c1.5 4.4 5 8 10 8 1.3 0 2.5-.2 3.6-.7" />
        </svg>
    ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
    );
}

function PasswordInput({
    label,
    value,
    onChange,
    placeholder,
    visible,
    onToggle,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    visible: boolean;
    onToggle: () => void;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
                <input
                    type={visible ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={visible ? 'Hide password' : 'Show password'}
                >
                    <EyeIcon hidden={visible} />
                </button>
            </div>
        </div>
    );
}

export default function ResetPassword({ token, email }: Props) {
    const { branding } = usePage().props as unknown as { branding: Branding };
    const logoSrc = useLogo();
    useBrandTheme();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const form = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();
        form.post('/reset-password');
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
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70 mb-3">
                        {branding.reset_badge_text}
                    </p>
                    <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-5 whitespace-pre-line max-w-md">
                        {branding.reset_title}
                    </h1>
                    <p className="text-white/82 text-base leading-relaxed max-w-md">
                        {branding.reset_description}
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
                        <h2 className="text-2xl font-bold text-gray-950">{branding.reset_title}</h2>
                        <p className="text-sm text-gray-500 mt-1.5">{branding.reset_description}</p>
                    </div>

                    {(form.errors.email || form.errors.password || form.errors.token) && (
                        <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700">{form.errors.email || form.errors.password || form.errors.token}</p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{branding.reset_email_label}</label>
                            <div className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500">
                                {form.data.email}
                            </div>
                        </div>

                        <PasswordInput
                            label={branding.reset_new_password_label}
                            value={form.data.password}
                            onChange={(value) => form.setData('password', value)}
                            placeholder={branding.reset_new_password_placeholder}
                            visible={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                        />

                        <PasswordInput
                            label={branding.reset_confirm_label}
                            value={form.data.password_confirmation}
                            onChange={(value) => form.setData('password_confirmation', value)}
                            placeholder={branding.reset_confirm_placeholder}
                            visible={showConfirmation}
                            onToggle={() => setShowConfirmation((v) => !v)}
                        />

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="w-full py-3 px-4 brand-primary disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {form.processing ? <><Spinner size="sm" /> {branding.reset_submitting_text}</> : branding.reset_submit_text}
                        </button>
                    </form>

                    <Link href="/" className="mt-6 block text-center text-sm font-semibold brand-text">
                        {branding.reset_back_text}
                    </Link>
                </div>
            </div>
        </div>
    );
}
