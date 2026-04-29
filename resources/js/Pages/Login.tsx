import { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Spinner from '@/Components/Spinner';
import { useLogo } from '@/hooks/useLogo';
import { useBrandTheme } from '@/hooks/useBrandTheme';

interface Branding {
    logo_width_desktop: number;
    logo_width_mobile: number;
    logo_alt_text: string;
    login_headline: string;
    login_subheading: string;
    login_feature_one: string;
    login_feature_two: string;
    login_feature_three: string;
    login_form_title: string;
    login_form_subtitle: string;
    login_email_label: string;
    login_email_placeholder: string;
    login_password_label: string;
    login_password_placeholder: string;
    login_submit_text: string;
    login_submitting_text: string;
    login_help_text: string;
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '' });
    const logoSrc = useLogo();
    const { branding, flash } = usePage().props as { branding: Branding; flash?: { success?: string } };
    useBrandTheme();
    const features = [
        branding.login_feature_one,
        branding.login_feature_two,
        branding.login_feature_three,
    ].filter(Boolean);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div className="min-h-screen flex bg-white">
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
                        {branding.login_headline}
                    </h1>
                    <p className="text-white/82 text-base leading-relaxed max-w-md">
                        {branding.login_subheading}
                    </p>
                    <div className="mt-10 grid gap-3 max-w-md">
                        {features.map((feature) => (
                            <div key={feature} className="flex items-center gap-3 rounded-xl bg-white/10 px-3.5 py-3 ring-1 ring-white/15">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-white/88 text-sm font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

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
                        <h2 className="text-2xl font-bold text-gray-950">{branding.login_form_title}</h2>
                        <p className="text-sm text-gray-500 mt-1.5">{branding.login_form_subtitle}</p>
                    </div>

                    {errors.email && (
                        <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700">{errors.email}</p>
                        </div>
                    )}

                    {flash?.success && (
                        <div className="mb-5 px-4 py-3 rounded-xl brand-soft-bg brand-soft-border border">
                            <p className="text-sm brand-text">{flash.success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{branding.login_email_label}</label>
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                                placeholder={branding.login_email_placeholder}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between gap-3 mb-1.5">
                                <label className="block text-sm font-medium text-gray-700">{branding.login_password_label}</label>
                                <Link href="/forgot-password" className="text-xs font-semibold brand-text">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                                    placeholder={branding.login_password_placeholder}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    {showPassword
                                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full py-3 px-4 brand-primary disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 mt-2">
                            {processing ? <><Spinner size="sm" /> {branding.login_submitting_text}</> : branding.login_submit_text}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-8">{branding.login_help_text}</p>
                </div>
            </div>
        </div>
    );
}
