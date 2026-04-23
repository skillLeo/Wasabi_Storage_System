<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slot;
use App\Models\User;
use App\Models\UserSlot;
use App\Services\WasabiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SlotController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Slots', [
            'slots' => Slot::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $slot = Slot::create(['name' => $request->name]);

        foreach (User::where('role', 'employee')->get() as $employee) {
            UserSlot::firstOrCreate(['user_id' => $employee->id, 'slot_id' => $slot->id]);
        }

        return redirect()->route('admin.slots')->with('success', 'Slot created and assigned to all employees.');
    }

    public function update(Request $request, Slot $slot)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $slot->update(['name' => $request->name]);

        return redirect()->route('admin.slots')->with('success', 'Slot renamed.');
    }

    public function destroy(Slot $slot)
    {
        $userSlots = UserSlot::where('slot_id', $slot->id)->whereNotNull('file_path')->get();

        if ($userSlots->isNotEmpty()) {
            $wasabi = app(WasabiService::class);
            foreach ($userSlots as $us) {
                $wasabi->delete($us->file_path);
            }
        }

        $slot->delete();

        return redirect()->route('admin.slots')->with('success', 'Slot deleted.');
    }
}
