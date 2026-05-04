<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BrandingSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandingController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/Branding', [
            'branding' => BrandingSetting::shared(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'logo' => 'nullable|image|mimes:png,jpg,jpeg,svg,webp|max:2048',
            'brand_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'logo_width_desktop' => 'required|integer|min:120|max:420',
            'logo_width_mobile' => 'required|integer|min:120|max:340',
            'logo_width_sidebar' => 'required|integer|min:80|max:240',
            'logo_alt_text' => 'required|string|max:120',
            'login_headline' => 'required|string|max:120',
            'login_subheading' => 'required|string|max:500',
            'login_feature_one' => 'required|string|max:80',
            'login_feature_two' => 'required|string|max:80',
            'login_feature_three' => 'required|string|max:80',
            'login_form_title' => 'required|string|max:80',
            'login_form_subtitle' => 'required|string|max:160',
            'login_email_label' => 'required|string|max:60',
            'login_email_placeholder' => 'required|string|max:120',
            'login_password_label' => 'required|string|max:60',
            'login_password_placeholder' => 'required|string|max:120',
            'login_submit_text' => 'required|string|max:40',
            'login_submitting_text' => 'required|string|max:60',
            'login_help_text' => 'required|string|max:160',
            'login_forgot_password_text' => 'required|string|max:60',
            'forgot_title' => 'required|string|max:80',
            'forgot_panel_headline' => 'required|string|max:120',
            'forgot_panel_subheading' => 'required|string|max:300',
            'forgot_subtitle' => 'required|string|max:300',
            'forgot_email_label' => 'required|string|max:60',
            'forgot_email_placeholder' => 'required|string|max:120',
            'forgot_submit_text' => 'required|string|max:40',
            'forgot_submitting_text' => 'required|string|max:60',
            'forgot_back_text' => 'required|string|max:60',
            'reset_badge_text' => 'required|string|max:60',
            'reset_title' => 'required|string|max:80',
            'reset_description' => 'required|string|max:300',
            'reset_email_label' => 'required|string|max:60',
            'reset_new_password_label' => 'required|string|max:60',
            'reset_new_password_placeholder' => 'required|string|max:120',
            'reset_confirm_label' => 'required|string|max:60',
            'reset_confirm_placeholder' => 'required|string|max:120',
            'reset_submit_text' => 'required|string|max:40',
            'reset_submitting_text' => 'required|string|max:60',
            'reset_back_text' => 'required|string|max:60',
        ]);

        unset($validated['logo']);

        if ($request->hasFile('logo')) {
            $uploadedExtension = strtolower($request->file('logo')->getClientOriginalExtension());
            $directory = public_path('branding');

            if (!is_dir($directory)) {
                mkdir($directory, 0755, true);
            }

            $filename = 'logo-' . now()->format('YmdHis') . '-' . bin2hex(random_bytes(4)) . '.' . $uploadedExtension;

            $request->file('logo')->move($directory, $filename);
            $validated['logo_path'] = 'branding/' . $filename;
        }

        $branding = BrandingSetting::current();
        $branding->update($validated);

        return redirect()
            ->route('admin.branding')
            ->with('success', 'Branding updated successfully.');
    }
}
