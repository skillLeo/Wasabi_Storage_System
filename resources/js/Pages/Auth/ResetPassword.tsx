import { FormEvent, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Spinner from '@/Components/Spinner';
import { useLogo } from '@/hooks/useLogo';
import { useBrandTheme } from '@/hooks/useBrandTheme';

interface Branding {
    logo_width_mobile: number;
    logo_alt_text: string;
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
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute inset-y-0 right-0 px-4 text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label={visible ? 'Hide password' : 'Show password'}
                >
                    <EyeIcon hidden={visible} />
                </button>
            </div>
        </div>
    );
}

export default function ResetPassword({ token, email }: Props) {
    const { branding } = usePage().props as { branding: Branding };
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
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-[0.9fr_1.1fr]">
                    <div className="brand-soft-bg px-8 py-10 md:px-10 md:py-12 flex flex-col justify-between gap-10 border-b md:border-b-0 md:border-r border-gray-100">
                        <div>
                            <img
                                src={logoSrc}
                                alt={branding.logo_alt_text}
                                style={{ width: Math.min(branding.logo_width_mobile, 230), maxWidth: '100%', height: 'auto' }}
                                className="object-contain block"
                            />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] brand-text">Secure account</p>
                            <h1 className="mt-3 text-2xl font-bold text-gray-950">Reset password</h1>
                            <p className="mt-2 text-sm leading-6 text-gray-500">Create a new password for this account. The email is locked from the reset link.</p>
                        </div>
                    </div>

                    <div className="px-6 py-8 sm:px-10 sm:py-12">
                        {(form.errors.email || form.errors.password || form.errors.token) && (
                            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                                <p className="text-sm text-red-700">{form.errors.email || form.errors.password || form.errors.token}</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Account email</label>
                                <div className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-700">
                                    {form.data.email}
                                </div>
                            </div>

                            <PasswordInput
                                label="New password"
                                value={form.data.password}
                                onChange={(value) => form.setData('password', value)}
                                placeholder="Min. 8 characters"
                                visible={showPassword}
                                onToggle={() => setShowPassword((value) => !value)}
                            />

                            <PasswordInput
                                label="Confirm password"
                                value={form.data.password_confirmation}
                                onChange={(value) => form.setData('password_confirmation', value)}
                                placeholder="Repeat new password"
                                visible={showConfirmation}
                                onToggle={() => setShowConfirmation((value) => !value)}
                            />

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="w-full py-3 px-4 brand-primary disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {form.processing ? <><Spinner size="sm" /> Resetting...</> : 'Reset Password'}
                            </button>
                        </form>

                        <Link href="/" className="mt-6 block text-center text-sm font-semibold brand-text">
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
