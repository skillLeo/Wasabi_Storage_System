<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\UserSlot;
use App\Services\WasabiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SlotController extends Controller
{
    public function index()
    {
        $user      = Auth::user();
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
                'id'            => $us->id,
                'slot_id'       => $us->slot_id,
                'slot_name'     => $us->slot?->name,
                'status'        => $us->file_path ? 'uploaded' : 'missing',
                'file_name'     => $us->file_name,
                'file_type'     => $ext,
                'uploaded_at'   => $us->uploaded_at,
                'presigned_url' => $presignedUrl,
            ];
        });

        $total    = $userSlots->count();
        $uploaded = $userSlots->whereNotNull('file_path')->count();

        return Inertia::render('Employee/Documents', [
            'slots'                 => $slots,
            'completion_percentage' => $total > 0 ? round(($uploaded / $total) * 100, 1) : 0,
            'uploaded_slots'        => $uploaded,
            'total_slots'           => $total,
        ]);
    }

    public function upload(Request $request, int $slotId)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        $user     = Auth::user();
        $userSlot = UserSlot::where('user_id', $user->id)
            ->where('slot_id', $slotId)
            ->firstOrFail();

        $wasabi = app(WasabiService::class);

        if ($userSlot->file_path) {
            $wasabi->delete($userSlot->file_path);
        }

        $path = $wasabi->upload($request->file('file'));

        $userSlot->update([
            'file_path'   => $path,
            'file_name'   => $request->file('file')->getClientOriginalName(),
            'uploaded_at' => now(),
        ]);

        return redirect()->route('employee.documents')->with('success', 'Document uploaded successfully.');
    }
}
