import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Spinner from '@/Components/Spinner';
import { useLogo } from '@/hooks/useLogo';

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
}

interface BrandingForm extends Omit<BrandingData, 'logo_url'> {
    logo: File | null;
}

interface Props {
    branding: BrandingData;
}

function Field({
    label,
    value,
    onChange,
    error,
    maxLength,
    type = 'text',
}: {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    maxLength?: number;
    type?: string;
}) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
            <input
                type={type}
                required
                maxLength={maxLength}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

function SectionTitle({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-950">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
        </div>
    );
}

export default function Branding({ branding }: Props) {
    const logoRef = useRef<HTMLInputElement>(null);
    const logoSrc = useLogo();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

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
    });

    function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        form.setData('logo', file);
        setLogoPreview(URL.createObjectURL(file));
    }

    function submit(event: React.FormEvent) {
        event.preventDefault();

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
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Branding</h1>
                <p className="text-sm text-gray-500 mt-1">Manage logo, color, sizing, and login page content.</p>
            </div>

            <form
                onSubmit={submit}
                className="max-w-6xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                style={{ ['--brand-color' as any]: form.data.brand_color }}
            >
                <div className="px-5 sm:px-7 py-5 border-b border-gray-100 bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-950">Brand Settings</h2>
                            <p className="text-sm text-gray-500 mt-1">Changes apply across login, admin, and employee views.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white brand-primary disabled:opacity-60 rounded-xl transition-all"
                        >
                            {form.processing && <Spinner size="sm" />}
                            Save Branding
                        </button>
                    </div>
                </div>

                <div className="p-5 sm:p-7 space-y-8">
                    <section>
                        <SectionTitle title="Brand Identity" desc="Upload the logo, choose the main brand color, and tune logo sizes." />

                        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_360px] gap-6">
                            <div className="space-y-5">
                                <input
                                    ref={logoRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                                    className="hidden"
                                    onChange={handleLogoChange}
                                />

                                <button
                                    type="button"
                                    onClick={() => logoRef.current?.click()}
                                    className="w-full min-h-64 rounded-2xl border border-dashed brand-soft-border bg-gray-50 hover-brand-soft-bg transition-colors flex flex-col items-center justify-center px-6 py-8 text-center"
                                >
                                    <span className="h-12 w-12 rounded-full brand-soft-bg brand-text flex items-center justify-center mb-5">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    </span>
                                    <img
                                        src={logoSource}
                                        alt={form.data.logo_alt_text}
                                        style={{ width: Math.min(form.data.logo_width_desktop, 280), maxWidth: '100%', height: 'auto' }}
                                        className="object-contain block mb-5"
                                    />
                                    <span className="text-sm font-semibold text-gray-900">{logoPreview ? 'New logo selected' : 'Click to upload your logo'}</span>
                                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, SVG or WebP. Max 2 MB.</span>
                                </button>
                                {form.errors.logo && <p className="text-xs text-red-500">{form.errors.logo}</p>}
                                {form.data.logo && (
                                    <p className="text-xs text-gray-500">
                                        Selected: {form.data.logo.name} - {(form.data.logo.size / 1024).toFixed(0)} KB
                                    </p>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Field
                                        label="Desktop Login Width"
                                        type="number"
                                        value={form.data.logo_width_desktop}
                                        onChange={(value) => form.setData('logo_width_desktop', Number(value))}
                                        error={form.errors.logo_width_desktop}
                                    />
                                    <Field
                                        label="Mobile Login Width"
                                        type="number"
                                        value={form.data.logo_width_mobile}
                                        onChange={(value) => form.setData('logo_width_mobile', Number(value))}
                                        error={form.errors.logo_width_mobile}
                                    />
                                    <Field
                                        label="Logo Alt Text"
                                        value={form.data.logo_alt_text}
                                        onChange={(value) => form.setData('logo_alt_text', value)}
                                        error={form.errors.logo_alt_text}
                                        maxLength={120}
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Color Palette</h3>
                                    <div className="rounded-2xl border border-dashed border-gray-200 p-4 space-y-3">
                                        <label className="block">
                                            <span className="sr-only">Brand color</span>
                                            <div className="brand-primary rounded-xl px-4 py-4 flex items-center justify-between gap-3 cursor-pointer">
                                                <span className="text-sm font-semibold text-white">Click to select color</span>
                                                <input
                                                    type="color"
                                                    value={form.data.brand_color}
                                                    onChange={(event) => form.setData('brand_color', event.target.value)}
                                                    className="h-9 w-12 rounded-lg border border-white/30 bg-transparent cursor-pointer"
                                                />
                                            </div>
                                        </label>
                                        <Field
                                            label="Hex Value"
                                            value={form.data.brand_color}
                                            onChange={(value) => form.setData('brand_color', value)}
                                            error={form.errors.brand_color}
                                            maxLength={7}
                                        />
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
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Sidebar Logo</h3>
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                        <div className="bg-white rounded-xl border border-gray-100 h-28 flex items-center justify-center px-5 mb-4">
                                            <img
                                                src={logoSource}
                                                alt={form.data.logo_alt_text}
                                                style={{ width: form.data.logo_width_sidebar, maxWidth: '100%', height: 'auto' }}
                                                className="object-contain block"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between gap-3 mb-3">
                                            <span className="text-xs font-semibold text-gray-600">Width</span>
                                            <span className="text-xs font-bold brand-text">{form.data.logo_width_sidebar}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={80}
                                            max={240}
                                            step={1}
                                            value={form.data.logo_width_sidebar}
                                            onChange={(event) => form.setData('logo_width_sidebar', Number(event.target.value))}
                                            className="w-full accent-[var(--brand-color)]"
                                        />
                                        {form.errors.logo_width_sidebar && <p className="text-xs text-red-500 mt-1">{form.errors.logo_width_sidebar}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="border-t border-gray-100 pt-8">
                        <SectionTitle title="Login Content" desc="Edit the headline, supporting text, feature list, form labels, and helper text." />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <Field label="Main Headline" value={form.data.login_headline} onChange={(value) => form.setData('login_headline', value)} error={form.errors.login_headline} maxLength={120} />
                            <Field label="Form Title" value={form.data.login_form_title} onChange={(value) => form.setData('login_form_title', value)} error={form.errors.login_form_title} maxLength={80} />

                            <div className="lg:col-span-2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Main Subheading</label>
                                <textarea
                                    required
                                    maxLength={500}
                                    rows={3}
                                    value={form.data.login_subheading}
                                    onChange={(event) => form.setData('login_subheading', event.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all resize-none brand-field"
                                />
                                {form.errors.login_subheading && <p className="text-xs text-red-500 mt-1">{form.errors.login_subheading}</p>}
                            </div>

                            <Field label="Form Subtitle" value={form.data.login_form_subtitle} onChange={(value) => form.setData('login_form_subtitle', value)} error={form.errors.login_form_subtitle} maxLength={160} />
                            <Field label="Help Text" value={form.data.login_help_text} onChange={(value) => form.setData('login_help_text', value)} error={form.errors.login_help_text} maxLength={160} />

                            <Field label="Email Label" value={form.data.login_email_label} onChange={(value) => form.setData('login_email_label', value)} error={form.errors.login_email_label} maxLength={60} />
                            <Field label="Email Placeholder" value={form.data.login_email_placeholder} onChange={(value) => form.setData('login_email_placeholder', value)} error={form.errors.login_email_placeholder} maxLength={120} />
                            <Field label="Password Label" value={form.data.login_password_label} onChange={(value) => form.setData('login_password_label', value)} error={form.errors.login_password_label} maxLength={60} />
                            <Field label="Password Placeholder" value={form.data.login_password_placeholder} onChange={(value) => form.setData('login_password_placeholder', value)} error={form.errors.login_password_placeholder} maxLength={120} />
                            <Field label="Submit Button" value={form.data.login_submit_text} onChange={(value) => form.setData('login_submit_text', value)} error={form.errors.login_submit_text} maxLength={40} />
                            <Field label="Submitting Text" value={form.data.login_submitting_text} onChange={(value) => form.setData('login_submitting_text', value)} error={form.errors.login_submitting_text} maxLength={60} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                            <Field label="Feature 1" value={form.data.login_feature_one} onChange={(value) => form.setData('login_feature_one', value)} error={form.errors.login_feature_one} maxLength={80} />
                            <Field label="Feature 2" value={form.data.login_feature_two} onChange={(value) => form.setData('login_feature_two', value)} error={form.errors.login_feature_two} maxLength={80} />
                            <Field label="Feature 3" value={form.data.login_feature_three} onChange={(value) => form.setData('login_feature_three', value)} error={form.errors.login_feature_three} maxLength={80} />
                        </div>
                    </section>
                </div>
            </form>
        </AdminLayout>
    );
}
