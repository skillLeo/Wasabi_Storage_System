import { ReactNode, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Spinner from '@/Components/Spinner';
import { useLogo } from '@/hooks/useLogo';

type Tab = 'identity' | 'login' | 'forgot' | 'reset' | 'email';

interface BrandingData {
    logo_url: string;
    brand_color: string;
    logo_width_desktop: number;
    logo_width_mobile: number;
    logo_width_sidebar: number;
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
    login_forgot_password_text: string;
    forgot_title: string;
    forgot_panel_headline: string;
    forgot_panel_subheading: string;
    forgot_subtitle: string;
    forgot_email_label: string;
    forgot_email_placeholder: string;
    forgot_submit_text: string;
    forgot_submitting_text: string;
    forgot_back_text: string;
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
    email_reset_subject: string;
    email_reset_greeting: string;
    email_reset_intro: string;
    email_reset_button: string;
    email_reset_expire: string;
    email_reset_no_action: string;
}

interface BrandingForm extends Omit<BrandingData, 'logo_url'> {
    logo: File | null;
}

interface Props { branding: BrandingData; }

function Field({ label, value, onChange, error, maxLength, type = 'text' }: {
    label: string; value: string | number; onChange: (v: string) => void;
    error?: string; maxLength?: number; type?: string;
}) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                maxLength={maxLength}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

function Textarea({ label, value, onChange, error, maxLength, rows = 2 }: {
    label: string; value: string; onChange: (v: string) => void;
    error?: string; maxLength?: number; rows?: number;
}) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
            <textarea
                maxLength={maxLength}
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all resize-none brand-field"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

const TABS: { id: Tab; label: string }[] = [
    { id: 'identity',  label: 'Brand Identity' },
    { id: 'login',     label: 'Login Page' },
    { id: 'forgot',    label: 'Forgot Password' },
    { id: 'reset',     label: 'Reset Password' },
    { id: 'email',     label: 'Reset Email' },
];

export default function Branding({ branding }: Props) {
    const logoRef = useRef<HTMLInputElement>(null);
    const logoSrc = useLogo();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('identity');

    const form = useForm<BrandingForm>({
        logo: null,
        brand_color: branding.brand_color,
        logo_width_desktop: branding.logo_width_desktop,
        logo_width_mobile: branding.logo_width_mobile,
        logo_width_sidebar: branding.logo_width_sidebar,
        logo_alt_text: branding.logo_alt_text,
        login_headline: branding.login_headline,
        login_subheading: branding.login_subheading,
        login_feature_one: branding.login_feature_one,
        login_feature_two: branding.login_feature_two,
        login_feature_three: branding.login_feature_three,
        login_form_title: branding.login_form_title,
        login_form_subtitle: branding.login_form_subtitle,
        login_email_label: branding.login_email_label,
        login_email_placeholder: branding.login_email_placeholder,
        login_password_label: branding.login_password_label,
        login_password_placeholder: branding.login_password_placeholder,
        login_submit_text: branding.login_submit_text,
        login_submitting_text: branding.login_submitting_text,
        login_help_text: branding.login_help_text,
        login_forgot_password_text: branding.login_forgot_password_text,
        forgot_title: branding.forgot_title,
        forgot_panel_headline: branding.forgot_panel_headline,
        forgot_panel_subheading: branding.forgot_panel_subheading,
        forgot_subtitle: branding.forgot_subtitle,
        forgot_email_label: branding.forgot_email_label,
        forgot_email_placeholder: branding.forgot_email_placeholder,
        forgot_submit_text: branding.forgot_submit_text,
        forgot_submitting_text: branding.forgot_submitting_text,
        forgot_back_text: branding.forgot_back_text,
        reset_badge_text: branding.reset_badge_text,
        reset_title: branding.reset_title,
        reset_description: branding.reset_description,
        reset_email_label: branding.reset_email_label,
        reset_new_password_label: branding.reset_new_password_label,
        reset_new_password_placeholder: branding.reset_new_password_placeholder,
        reset_confirm_label: branding.reset_confirm_label,
        reset_confirm_placeholder: branding.reset_confirm_placeholder,
        reset_submit_text: branding.reset_submit_text,
        reset_submitting_text: branding.reset_submitting_text,
        reset_back_text: branding.reset_back_text,
        email_reset_subject: branding.email_reset_subject,
        email_reset_greeting: branding.email_reset_greeting,
        email_reset_intro: branding.email_reset_intro,
        email_reset_button: branding.email_reset_button,
        email_reset_expire: branding.email_reset_expire,
        email_reset_no_action: branding.email_reset_no_action,
    });

    function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        form.setData('logo', file);
        setLogoPreview(URL.createObjectURL(file));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/admin/branding', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.setData('logo', null);
                setLogoPreview(null);
                window.dispatchEvent(new CustomEvent('logo-updated'));
                if (logoRef.current) logoRef.current.value = '';
            },
        });
    }

    const logoSource = logoPreview ?? logoSrc;

    return (
        <>
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Branding</h1>
                <p className="text-sm text-gray-500 mt-1">Manage logo, colors, and all page content.</p>
            </div>

            <form
                onSubmit={submit}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                style={{ ['--brand-color' as any]: form.data.brand_color }}
            >
                {/* Sticky header with tabs + save button */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                    <div className="px-5 sm:px-7 py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`whitespace-nowrap px-4 py-2 text-xs font-semibold rounded-xl transition-all flex-shrink-0 ${
                                        activeTab === tab.id
                                            ? 'brand-primary text-white'
                                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white brand-primary disabled:opacity-60 rounded-xl transition-all flex-shrink-0"
                        >
                            {form.processing ? <><Spinner size="sm" /> Saving…</> : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className="p-5 sm:p-7">

                    {/* ── TAB: Brand Identity ── */}
                    {activeTab === 'identity' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_340px] gap-6">
                                {/* Logo upload */}
                                <div className="space-y-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Logo</p>
                                    <input ref={logoRef} type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp" className="hidden" onChange={handleLogoChange} />
                                    <button type="button" onClick={() => logoRef.current?.click()}
                                        className="w-full min-h-52 rounded-2xl border border-dashed brand-soft-border bg-gray-50 hover-brand-soft-bg transition-colors flex flex-col items-center justify-center px-6 py-6 text-center">
                                        <span className="h-10 w-10 rounded-full brand-soft-bg brand-text flex items-center justify-center mb-4">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        </span>
                                        <img src={logoSource} alt={form.data.logo_alt_text}
                                            style={{ width: Math.min(form.data.logo_width_desktop, 260), maxWidth: '100%', height: 'auto' }}
                                            className="object-contain block mb-4" />
                                        <span className="text-sm font-semibold text-gray-900">{logoPreview ? 'New logo selected' : 'Click to upload logo'}</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, SVG or WebP · Max 2 MB</span>
                                    </button>
                                    {form.errors.logo && <p className="text-xs text-red-500">{form.errors.logo}</p>}

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <Field label="Desktop Login Width (px)" type="number" value={form.data.logo_width_desktop}
                                            onChange={(v) => form.setData('logo_width_desktop', Number(v))} error={form.errors.logo_width_desktop} />
                                        <Field label="Mobile Login Width (px)" type="number" value={form.data.logo_width_mobile}
                                            onChange={(v) => form.setData('logo_width_mobile', Number(v))} error={form.errors.logo_width_mobile} />
                                        <Field label="Logo Alt Text" value={form.data.logo_alt_text}
                                            onChange={(v) => form.setData('logo_alt_text', v)} error={form.errors.logo_alt_text} maxLength={120} />
                                    </div>
                                </div>

                                {/* Color + sidebar */}
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Brand Color</p>
                                        <div className="rounded-2xl border border-dashed border-gray-200 p-4 space-y-3">
                                            <label className="block">
                                                <div className="brand-primary rounded-xl px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer">
                                                    <span className="text-sm font-semibold text-white">Click to pick color</span>
                                                    <input type="color" value={form.data.brand_color}
                                                        onChange={(e) => form.setData('brand_color', e.target.value)}
                                                        className="h-8 w-10 rounded-lg border border-white/30 bg-transparent cursor-pointer" />
                                                </div>
                                            </label>
                                            <Field label="Hex Value" value={form.data.brand_color}
                                                onChange={(v) => form.setData('brand_color', v)} error={form.errors.brand_color} maxLength={7} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="rounded-xl border brand-soft-border brand-soft-bg p-3">
                                                    <p className="text-xs font-semibold brand-text">Soft Accent</p>
                                                </div>
                                                <div className="rounded-xl brand-gradient p-3">
                                                    <p className="text-xs font-semibold text-white">Login Panel</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Sidebar Logo Width</p>
                                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                            <div className="bg-white rounded-xl border border-gray-100 h-24 flex items-center justify-center px-5 mb-3">
                                                <img src={logoSource} alt={form.data.logo_alt_text}
                                                    style={{ width: form.data.logo_width_sidebar, maxWidth: '100%', height: 'auto' }}
                                                    className="object-contain block" />
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-semibold text-gray-600">Width</span>
                                                <span className="text-xs font-bold brand-text">{form.data.logo_width_sidebar}px</span>
                                            </div>
                                            <input type="range" min={80} max={240} step={1} value={form.data.logo_width_sidebar}
                                                onChange={(e) => form.setData('logo_width_sidebar', Number(e.target.value))}
                                                className="w-full accent-[var(--brand-color)]" />
                                            {form.errors.logo_width_sidebar && <p className="text-xs text-red-500 mt-1">{form.errors.logo_width_sidebar}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TAB: Login Page ── */}
                    {activeTab === 'login' && (
                        <div className="space-y-4">
                            <p className="text-xs text-gray-400 mb-2">Edit every word on the login page — left panel and right form.</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Field label="Left Panel Headline" value={form.data.login_headline} onChange={(v) => form.setData('login_headline', v)} error={form.errors.login_headline} maxLength={120} />
                                <Field label="Form Title" value={form.data.login_form_title} onChange={(v) => form.setData('login_form_title', v)} error={form.errors.login_form_title} maxLength={80} />
                                <div className="lg:col-span-2">
                                    <Textarea label="Left Panel Subheading" value={form.data.login_subheading} onChange={(v) => form.setData('login_subheading', v)} error={form.errors.login_subheading} maxLength={500} rows={2} />
                                </div>
                                <Field label="Form Subtitle" value={form.data.login_form_subtitle} onChange={(v) => form.setData('login_form_subtitle', v)} error={form.errors.login_form_subtitle} maxLength={160} />
                                <Field label="Help Text (below button)" value={form.data.login_help_text} onChange={(v) => form.setData('login_help_text', v)} error={form.errors.login_help_text} maxLength={160} />
                                <Field label="Email Label" value={form.data.login_email_label} onChange={(v) => form.setData('login_email_label', v)} error={form.errors.login_email_label} maxLength={60} />
                                <Field label="Email Placeholder" value={form.data.login_email_placeholder} onChange={(v) => form.setData('login_email_placeholder', v)} error={form.errors.login_email_placeholder} maxLength={120} />
                                <Field label="Password Label" value={form.data.login_password_label} onChange={(v) => form.setData('login_password_label', v)} error={form.errors.login_password_label} maxLength={60} />
                                <Field label="Password Placeholder" value={form.data.login_password_placeholder} onChange={(v) => form.setData('login_password_placeholder', v)} error={form.errors.login_password_placeholder} maxLength={120} />
                                <Field label="Forgot Password Link Text" value={form.data.login_forgot_password_text} onChange={(v) => form.setData('login_forgot_password_text', v)} error={form.errors.login_forgot_password_text} maxLength={60} />
                                <Field label="Submit Button" value={form.data.login_submit_text} onChange={(v) => form.setData('login_submit_text', v)} error={form.errors.login_submit_text} maxLength={40} />
                                <Field label="Submitting Text" value={form.data.login_submitting_text} onChange={(v) => form.setData('login_submitting_text', v)} error={form.errors.login_submitting_text} maxLength={60} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                                <Field label="Feature 1" value={form.data.login_feature_one} onChange={(v) => form.setData('login_feature_one', v)} error={form.errors.login_feature_one} maxLength={80} />
                                <Field label="Feature 2" value={form.data.login_feature_two} onChange={(v) => form.setData('login_feature_two', v)} error={form.errors.login_feature_two} maxLength={80} />
                                <Field label="Feature 3" value={form.data.login_feature_three} onChange={(v) => form.setData('login_feature_three', v)} error={form.errors.login_feature_three} maxLength={80} />
                            </div>
                        </div>
                    )}

                    {/* ── TAB: Forgot Password Page ── */}
                    {activeTab === 'forgot' && (
                        <div className="space-y-4">
                            <p className="text-xs text-gray-400 mb-2">Edit every word on the forgot password page — left panel and right form.</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Field label="Left Panel Headline" value={form.data.forgot_panel_headline} onChange={(v) => form.setData('forgot_panel_headline', v)} error={form.errors.forgot_panel_headline} maxLength={120} />
                                <Field label="Form Title" value={form.data.forgot_title} onChange={(v) => form.setData('forgot_title', v)} error={form.errors.forgot_title} maxLength={80} />
                                <div className="lg:col-span-2">
                                    <Textarea label="Left Panel Subheading" value={form.data.forgot_panel_subheading} onChange={(v) => form.setData('forgot_panel_subheading', v)} error={form.errors.forgot_panel_subheading} maxLength={300} rows={2} />
                                </div>
                                <div className="lg:col-span-2">
                                    <Textarea label="Form Subtitle" value={form.data.forgot_subtitle} onChange={(v) => form.setData('forgot_subtitle', v)} error={form.errors.forgot_subtitle} maxLength={300} rows={2} />
                                </div>
                                <Field label="Email Label" value={form.data.forgot_email_label} onChange={(v) => form.setData('forgot_email_label', v)} error={form.errors.forgot_email_label} maxLength={60} />
                                <Field label="Email Placeholder" value={form.data.forgot_email_placeholder} onChange={(v) => form.setData('forgot_email_placeholder', v)} error={form.errors.forgot_email_placeholder} maxLength={120} />
                                <Field label="Submit Button" value={form.data.forgot_submit_text} onChange={(v) => form.setData('forgot_submit_text', v)} error={form.errors.forgot_submit_text} maxLength={40} />
                                <Field label="Submitting Text" value={form.data.forgot_submitting_text} onChange={(v) => form.setData('forgot_submitting_text', v)} error={form.errors.forgot_submitting_text} maxLength={60} />
                                <Field label="Back to Login Link" value={form.data.forgot_back_text} onChange={(v) => form.setData('forgot_back_text', v)} error={form.errors.forgot_back_text} maxLength={60} />
                            </div>
                        </div>
                    )}

                    {/* ── TAB: Reset Password Page ── */}
                    {activeTab === 'reset' && (
                        <div className="space-y-4">
                            <p className="text-xs text-gray-400 mb-2">Edit every word on the reset password page — left panel and right form.</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Field label="Left Panel Badge Text" value={form.data.reset_badge_text} onChange={(v) => form.setData('reset_badge_text', v)} error={form.errors.reset_badge_text} maxLength={60} />
                                <Field label="Left Panel Title" value={form.data.reset_title} onChange={(v) => form.setData('reset_title', v)} error={form.errors.reset_title} maxLength={80} />
                                <div className="lg:col-span-2">
                                    <Textarea label="Left Panel Description" value={form.data.reset_description} onChange={(v) => form.setData('reset_description', v)} error={form.errors.reset_description} maxLength={300} rows={2} />
                                </div>
                                <Field label="Email Field Label" value={form.data.reset_email_label} onChange={(v) => form.setData('reset_email_label', v)} error={form.errors.reset_email_label} maxLength={60} />
                                <Field label="New Password Label" value={form.data.reset_new_password_label} onChange={(v) => form.setData('reset_new_password_label', v)} error={form.errors.reset_new_password_label} maxLength={60} />
                                <Field label="New Password Placeholder" value={form.data.reset_new_password_placeholder} onChange={(v) => form.setData('reset_new_password_placeholder', v)} error={form.errors.reset_new_password_placeholder} maxLength={120} />
                                <Field label="Confirm Password Label" value={form.data.reset_confirm_label} onChange={(v) => form.setData('reset_confirm_label', v)} error={form.errors.reset_confirm_label} maxLength={60} />
                                <Field label="Confirm Password Placeholder" value={form.data.reset_confirm_placeholder} onChange={(v) => form.setData('reset_confirm_placeholder', v)} error={form.errors.reset_confirm_placeholder} maxLength={120} />
                                <Field label="Submit Button" value={form.data.reset_submit_text} onChange={(v) => form.setData('reset_submit_text', v)} error={form.errors.reset_submit_text} maxLength={40} />
                                <Field label="Submitting Text" value={form.data.reset_submitting_text} onChange={(v) => form.setData('reset_submitting_text', v)} error={form.errors.reset_submitting_text} maxLength={60} />
                                <Field label="Back to Login Link" value={form.data.reset_back_text} onChange={(v) => form.setData('reset_back_text', v)} error={form.errors.reset_back_text} maxLength={60} />
                            </div>
                        </div>
                    )}

                    {/* ── TAB: Reset Email ── */}
                    {activeTab === 'email' && (
                        <div className="space-y-4">
                            <p className="text-xs text-gray-400 mb-2">Customize the email employees receive when they request a password reset.</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Field label="Email Subject Line" value={form.data.email_reset_subject} onChange={(v) => form.setData('email_reset_subject', v)} error={form.errors.email_reset_subject} maxLength={120} />
                                <Field label="Greeting" value={form.data.email_reset_greeting} onChange={(v) => form.setData('email_reset_greeting', v)} error={form.errors.email_reset_greeting} maxLength={80} />
                                <div className="lg:col-span-2">
                                    <Textarea label="Introduction Paragraph" value={form.data.email_reset_intro} onChange={(v) => form.setData('email_reset_intro', v)} error={form.errors.email_reset_intro} maxLength={500} rows={3} />
                                </div>
                                <Field label="Reset Button Text" value={form.data.email_reset_button} onChange={(v) => form.setData('email_reset_button', v)} error={form.errors.email_reset_button} maxLength={60} />
                                <div className="lg:col-span-2">
                                    <Textarea label="Link Expiry Notice" value={form.data.email_reset_expire} onChange={(v) => form.setData('email_reset_expire', v)} error={form.errors.email_reset_expire} maxLength={300} rows={2} />
                                </div>
                                <div className="lg:col-span-2">
                                    <Textarea label="Footer / No-Action Note" value={form.data.email_reset_no_action} onChange={(v) => form.setData('email_reset_no_action', v)} error={form.errors.email_reset_no_action} maxLength={300} rows={2} />
                                </div>
                            </div>
                            <div className="flex items-start gap-3 px-4 py-3 rounded-xl brand-soft-bg border brand-soft-border text-xs brand-text">
                                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <span>The reset link button inside the email is generated automatically — only the button label can be changed here.</span>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </>
    );
}

Branding.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;