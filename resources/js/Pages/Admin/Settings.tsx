import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Spinner from '@/Components/Spinner';

interface Props {
    admin: { name: string; email: string };
}

function SectionTitle({ title, desc }: { title: string; desc: string }) {
    return (
        <div>
            <h2 className="text-base font-bold text-gray-950">{title}</h2>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{desc}</p>
        </div>
    );
}

function Field({
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    minLength,
}: {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder: string;
    minLength?: number;
}) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
            <input
                type={type}
                required
                minLength={minLength}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none transition-all brand-field"
                placeholder={placeholder}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

export default function Settings({ admin }: Props) {
    const profileForm = useForm({ name: admin.name, email: admin.email });
    const passwordForm = useForm({ current_password: '', new_password: '', new_password_confirmation: '' });
    const initial = admin.name?.charAt(0).toUpperCase() || 'A';

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

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account profile and security.</p>
            </div>

            <div className="max-w-5xl grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-6 items-start">
                <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl brand-bg text-white flex items-center justify-center text-xl font-bold shadow-sm">
                            {initial}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-950 truncate">{admin.name}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{admin.email}</p>
                        </div>
                    </div>
                    <div className="mt-6 rounded-xl brand-soft-bg brand-soft-border border p-4">
                        <p className="text-xs font-semibold brand-text">Admin Account</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">Profile and password changes only affect your own administrator login.</p>
                    </div>
                </aside>

                <div className="space-y-5">
                    <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
                            <SectionTitle
                                title="Your Profile"
                                desc="Update your display name and the email address you use to log in."
                            />
                        </div>

                        <div className="p-5 sm:p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    label="Full Name"
                                    value={profileForm.data.name}
                                    onChange={(value) => profileForm.setData('name', value)}
                                    error={profileForm.errors.name}
                                    placeholder="Your name"
                                />
                                <Field
                                    label="Email Address"
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={(value) => profileForm.setData('email', value)}
                                    error={profileForm.errors.email}
                                    placeholder="you@company.us"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white brand-primary disabled:opacity-60 rounded-xl transition-all"
                                >
                                    {profileForm.processing && <Spinner size="sm" />}
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    </form>

                    <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
                            <SectionTitle
                                title="Change Password"
                                desc="Choose a strong password with at least 8 characters."
                            />
                        </div>

                        <div className="p-5 sm:p-6 space-y-5">
                            <Field
                                label="Current Password"
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(value) => passwordForm.setData('current_password', value)}
                                error={passwordForm.errors.current_password}
                                placeholder="Enter your current password"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    label="New Password"
                                    type="password"
                                    minLength={8}
                                    value={passwordForm.data.new_password}
                                    onChange={(value) => passwordForm.setData('new_password', value)}
                                    error={passwordForm.errors.new_password}
                                    placeholder="Min. 8 characters"
                                />
                                <Field
                                    label="Confirm New Password"
                                    type="password"
                                    minLength={8}
                                    value={passwordForm.data.new_password_confirmation}
                                    onChange={(value) => passwordForm.setData('new_password_confirmation', value)}
                                    placeholder="Repeat new password"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white brand-primary disabled:opacity-60 rounded-xl transition-all"
                                >
                                    {passwordForm.processing && <Spinner size="sm" />}
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
