<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slot;
use App\Models\User;
use App\Models\UserSlot;
use App\Services\WasabiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    private function employeeData(User $user): array
    {
        $slots   = $user->userSlots;
        $total   = $slots->count();
        $uploaded = $slots->whereNotNull('file_path')->count();
        $missing  = $slots->whereNull('file_path')
            ->map(fn($us) => $us->slot?->name)
            ->filter()->values();
        $lastUpload = $slots->whereNotNull('uploaded_at')
            ->sortByDesc('uploaded_at')->first();

        return [
            'id'                    => $user->id,
            'name'                  => $user->name,
            'email'                 => $user->email,
            'role'                  => $user->role,
            'is_active'             => $user->is_active,
            'completion_percentage' => $total > 0 ? round(($uploaded / $total) * 100, 1) : 0,
            'total_slots'           => $total,
            'uploaded_slots'        => $uploaded,
            'missing_slots'         => $missing,
            'last_upload_at'        => $lastUpload?->uploaded_at,
        ];
    }

    public function dashboard()
    {
        $employees = User::where('role', 'employee')
            ->with('userSlots.slot')
            ->get()
            ->map(fn($u) => $this->employeeData($u));

        return Inertia::render('Admin/Dashboard', ['employees' => $employees]);
    }

    public function index()
    {
        $currentId = auth()->id();
        $employees = User::where('id', '!=', $currentId)
            ->with('userSlots.slot')
            ->get()
            ->map(fn($u) => $this->employeeData($u));

        return Inertia::render('Admin/Users', ['employees' => $employees]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'sometimes|in:employee,admin',
        ]);

        $role = $request->input('role', 'employee');

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => $role,
            'is_active' => true,
        ]);

        if ($role === 'employee') {
            foreach (Slot::all() as $slot) {
                UserSlot::create(['user_id' => $user->id, 'slot_id' => $slot->id]);
            }
        }

        $label = $role === 'admin' ? 'Admin account' : 'Employee account';
        return redirect()->route('admin.users')->with('success', "{$label} created.");
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'      => 'sometimes|string|max:255',
            'email'     => 'sometimes|email|unique:users,email,' . $user->id,
            'password'  => 'sometimes|string|min:6',
            'is_active' => 'sometimes|boolean',
        ]);

        $data = $request->only(['name', 'email', 'is_active']);
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->route('admin.users')->with('success', 'Employee updated.');
    }

    public function destroy(User $user)
    {
        $userSlots = UserSlot::where('user_id', $user->id)->whereNotNull('file_path')->get();

        if ($userSlots->isNotEmpty()) {
            $wasabi = app(WasabiService::class);
            foreach ($userSlots as $us) {
                $wasabi->delete($us->file_path);
            }
        }

        $user->delete();

        return redirect()->route('admin.users')->with('success', 'Employee deleted.');
    }

    public function show(User $user)
    {
        $userSlots = $user->userSlots()->with('slot')->get();
        $wasabi    = null;

        $slots = $userSlots->map(function (UserSlot $us) use (&$wasabi) {
            $presignedUrl = null;
            if ($us->file_path) {
                if (!$wasabi) $wasabi = app(WasabiService::class);
                try { $presignedUrl = $wasabi->presignedUrl($us->file_path); } catch (\Exception) {}
            }
            $ext = $us->file_name ? strtolower(pathinfo($us->file_name, PATHINFO_EXTENSION)) : null;

            return [
                'id'           => $us->id,
                'slot_id'      => $us->slot_id,
                'slot_name'    => $us->slot?->name,
                'status'       => $us->file_path ? 'uploaded' : 'missing',
                'file_name'    => $us->file_name,
                'file_type'    => $ext,
                'uploaded_at'  => $us->uploaded_at,
                'presigned_url' => $presignedUrl,
            ];
        });

        $total    = $userSlots->count();
        $uploaded = $userSlots->whereNotNull('file_path')->count();

        return Inertia::render('Admin/UserDetail', [
            'employee' => [
                'id'                    => $user->id,
                'name'                  => $user->name,
                'email'                 => $user->email,
                'is_active'             => $user->is_active,
                'completion_percentage' => $total > 0 ? round(($uploaded / $total) * 100, 1) : 0,
            ],
            'slots' => $slots,
        ]);
    }
}
