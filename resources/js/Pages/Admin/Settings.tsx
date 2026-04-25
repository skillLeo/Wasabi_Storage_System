import { useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Spinner from '@/Components/Spinner';
import { useLogo } from '@/hooks/useLogo';

interface Props {
    admin: { name: string; email: string };
}

function SectionLabel({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
            <h2 className="text-sm font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
        </div>
    );
}

export default function Settings({ admin }: Props) {
    const profileForm  = useForm({ name: admin.name, email: admin.email });
    const passwordForm = useForm({ current_password: '', new_password: '', new_password_confirmation: '' });

    const [logoPreview,   setLogoPreview]   = useState<string | null>(null);
    const [logoFile,      setLogoFile]      = useState<File | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const logoRef = useRef<HTMLInputElement>(null);
    const currentLogoSrc = useLogo();

    function handleProfileSubmit(e: React.FormEvent) {
        e.preventDefault();
        profileForm.post('/admin/settings/profile');
    }

    function handlePasswordSubmit(e: React.FormEvent) {
        e.preventDefault();
        passwordForm.post('/admin/settings/password', {
            onSuccess: () => passwordForm.reset(),
        });
    }

    function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    }

    function handleLogoUpload() {
        if (!logoFile) return;
        const fd = new FormData();
        fd.append('logo', logoFile);
        setUploadingLogo(true);
        router.post('/admin/settings/logo', fd, {
            onSuccess: () => {
                window.dispatchEvent(new CustomEvent('logo-updated'));
            },
            onFinish: () => {
                setUploadingLogo(false);
                setLogoFile(null);
                setLogoPreview(null);
                if (logoRef.current) logoRef.current.value = '';
            },
        });
    }

    const field = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your portal branding, profile, and security.</p>
            </div>

            <div className="max-w-4xl space-y-0 divide-y divide-gray-100 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* ── Row 1: Portal Logo ── */}
                <div className="flex flex-col lg:flex-row gap-6 p-6 sm:p-8">
                    <SectionLabel
                        title="Portal Logo"
                        desc="Upload your company logo. It updates instantly on the login page, admin panel, and employee portal."
                    />

                    <div className="flex-1 flex flex-col gap-4">
                        {/* Preview */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                {logoPreview ? 'New Preview' : 'Current Logo'}
                            </p>
                            <div className="h-28 w-full max-w-xs rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden p-4">
                                <img
                                    src={logoPreview ?? currentLogoSrc}
                                    alt="Logo"
                                    style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain' }}
                                />
                            </div>
                        </div>

                        <input ref={logoRef} type="file"
                            accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                            className="hidden" onChange={handleLogoChange} />

                        <div className="flex flex-wrap items-center gap-3">
                            <button type="button" onClick={() => logoRef.current?.click()}
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Choose Logo
                            </button>

                            {logoPreview && (
                                <button type="button" onClick={handleLogoUpload} disabled={uploadingLogo}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl shadow-sm transition-all">
                                    {uploadingLogo ? <><Spinner size="sm" />Saving…</> : 'Save & Apply'}
                                </button>
                            )}

                            {logoFile && (
                                <span className="text-xs text-gray-400 truncate max-w-[180px]">
                                    {logoFile.name} · {(logoFile.size / 1024).toFixed(0)} KB
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400">PNG, JPG, SVG or WebP · Max 2 MB · Transparent background recommended</p>
                    </div>
                </div>

                {/* ── Row 2: Your Profile ── */}
                <div className="flex flex-col lg:flex-row gap-6 p-6 sm:p-8">
                    <SectionLabel
                        title="Your Profile"
                        desc="Update your display name and the email address you use to log in."
                    />

                    <form onSubmit={handleProfileSubmit} className="flex-1 flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                                <input type="text" required value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    className={field} placeholder="Your name" />
                                {profileForm.errors.name && <p className="text-xs text-red-500 mt-1">{profileForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                                <input type="email" required value={profileForm.data.email}
                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                    className={field} placeholder="you@company.us" />
                                {profileForm.errors.email && <p className="text-xs text-red-500 mt-1">{profileForm.errors.email}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={profileForm.processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl shadow-sm transition-all">
                                {profileForm.processing && <Spinner size="sm" />}
                                Save Profile
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Row 3: Change Password ── */}
                <div className="flex flex-col lg:flex-row gap-6 p-6 sm:p-8">
                    <SectionLabel
                        title="Change Password"
                        desc="Choose a strong password with at least 8 characters. You will stay logged in after changing it."
                    />

                    <form onSubmit={handlePasswordSubmit} className="flex-1 flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Current Password</label>
                            <input type="password" required value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                className={field} placeholder="Enter your current password" />
                            {passwordForm.errors.current_password && <p className="text-xs text-red-500 mt-1">{passwordForm.errors.current_password}</p>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
                                <input type="password" required minLength={8} value={passwordForm.data.new_password}
                                    onChange={(e) => passwordForm.setData('new_password', e.target.value)}
                                    className={field} placeholder="Min. 8 characters" />
                                {passwordForm.errors.new_password && <p className="text-xs text-red-500 mt-1">{passwordForm.errors.new_password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm New Password</label>
                                <input type="password" required minLength={8} value={passwordForm.data.new_password_confirmation}
                                    onChange={(e) => passwordForm.setData('new_password_confirmation', e.target.value)}
                                    className={field} placeholder="Repeat new password" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={passwordForm.processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl shadow-sm transition-all">
                                {passwordForm.processing && <Spinner size="sm" />}
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}
