<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slot;
use App\Models\User;
use App\Models\UserSlot;
use App\Services\WasabiService;
use Illuminate\Http\Request;

class SlotController extends Controller
{
    public function index()
    {
        $slots = Slot::orderBy('name')->get();
        return response()->json($slots);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $slot = Slot::create(['name' => $request->name]);

        // Auto-assign this new slot to all existing employees
        $employees = User::where('role', 'employee')->get();
        foreach ($employees as $employee) {
            UserSlot::firstOrCreate([
                'user_id' => $employee->id,
                'slot_id' => $slot->id,
            ]);
        }

        return response()->json($slot, 201);
    }

    public function update(Request $request, Slot $slot)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $slot->update(['name' => $request->name]);

        return response()->json($slot);
    }

    public function destroy(Slot $slot)
    {
        // Delete all files from Wasabi before removing the slot
        $userSlots = UserSlot::where('slot_id', $slot->id)
            ->whereNotNull('file_path')
            ->get();

        if ($userSlots->isNotEmpty()) {
            $wasabi = app(WasabiService::class);
            foreach ($userSlots as $userSlot) {
                $wasabi->delete($userSlot->file_path);
            }
        }

        $slot->delete();

        return response()->json(['message' => 'Slot deleted.']);
    }
}
