<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings', [
            'admin' => [
                'name'  => auth()->user()->name,
                'email' => auth()->user()->email,
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . auth()->id(),
        ]);

        auth()->user()->update([
            'name'  => $request->name,
            'email' => $request->email,
        ]);

        return redirect()->route('admin.settings')->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, auth()->user()->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect.']);
        }

        auth()->user()->update([
            'password' => Hash::make($request->new_password),
        ]);

        return redirect()->route('admin.settings')->with('success', 'Password changed successfully.');
    }

    public function updateLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:png,jpg,jpeg,svg,webp|max:2048',
        ]);

        $file = $request->file('logo');
        $ext  = strtolower($file->getClientOriginalExtension());

        // Always save as logo.png in public/ so the app picks it up automatically
        $destination = public_path('logo.' . $ext);

        // If extension changed, remove old logo files
        foreach (['png', 'jpg', 'jpeg', 'svg', 'webp'] as $e) {
            $old = public_path('logo.' . $e);
            if (file_exists($old) && $e !== $ext) {
                unlink($old);
            }
        }

        $file->move(public_path(), 'logo.' . $ext);

        // If extension differs from png, update the logo src used in views
        // We keep it simple: rename to logo.png always for consistency
        if ($ext !== 'png') {
            rename(public_path('logo.' . $ext), public_path('logo.png'));
        }

        return redirect()->route('admin.settings')->with('success', 'Logo updated successfully. It is now live across the entire portal.');
    }
}
