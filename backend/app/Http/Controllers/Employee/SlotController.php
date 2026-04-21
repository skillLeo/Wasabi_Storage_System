<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\UserSlot;
use App\Services\WasabiService;
use Illuminate\Http\Request;

class SlotController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userSlots = $user->userSlots()->with('slot')->get();

        $wasabi = null;
        $data = $userSlots->map(function (UserSlot $us) use (&$wasabi) {
            $presignedUrl = null;

            if ($us->file_path) {
                if (!$wasabi) {
                    $wasabi = app(WasabiService::class);
                }
                try {
                    $presignedUrl = $wasabi->presignedUrl($us->file_path);
                } catch (\Exception) {
                    $presignedUrl = null;
                }
            }

            $ext = $us->file_name ? strtolower(pathinfo($us->file_name, PATHINFO_EXTENSION)) : null;

            return [
                'id' => $us->id,
                'slot_id' => $us->slot_id,
                'slot_name' => $us->slot?->name,
                'status' => $us->file_path ? 'uploaded' : 'missing',
                'file_name' => $us->file_name,
                'file_type' => $ext,
                'uploaded_at' => $us->uploaded_at,
                'presigned_url' => $presignedUrl,
            ];
        });

        $total = $userSlots->count();
        $uploaded = $userSlots->whereNotNull('file_path')->count();

        return response()->json([
            'completion_percentage' => $total > 0 ? round(($uploaded / $total) * 100, 1) : 0,
            'total_slots' => $total,
            'uploaded_slots' => $uploaded,
            'slots' => $data,
        ]);
    }

    public function upload(Request $request, int $slotId)
    {
        $request->validate([
            'file' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:10240', // 10MB
            ],
        ]);

        $user = $request->user();

        $userSlot = UserSlot::where('user_id', $user->id)
            ->where('slot_id', $slotId)
            ->first();

        if (!$userSlot) {
            return response()->json(['message' => 'Slot not assigned to you.'], 403);
        }

        $wasabi = app(WasabiService::class);

        // Delete the existing file before uploading the new one
        if ($userSlot->file_path) {
            $wasabi->delete($userSlot->file_path);
        }

        $file = $request->file('file');
        $path = $wasabi->upload($file, 'documents/' . $user->id);

        $userSlot->update([
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'uploaded_at' => now(),
        ]);

        // Return the updated slot with a fresh presigned URL
        $presignedUrl = null;
        try {
            $presignedUrl = $wasabi->presignedUrl($path);
        } catch (\Exception) {
        }

        $ext = strtolower(pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION));

        return response()->json([
            'id' => $userSlot->id,
            'slot_id' => $userSlot->slot_id,
            'slot_name' => $userSlot->slot?->name,
            'status' => 'uploaded',
            'file_name' => $userSlot->file_name,
            'file_type' => $ext,
            'uploaded_at' => $userSlot->uploaded_at,
            'presigned_url' => $presignedUrl,
        ]);
    }
}
