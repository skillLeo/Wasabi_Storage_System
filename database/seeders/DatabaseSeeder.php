<?php

namespace Database\Seeders;

use App\Models\Slot;
use App\Models\User;
use App\Models\UserSlot;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@no1leftbehind.us',
            'password' => Hash::make('Admin@1234'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create sample slots
        $slotNames = [
            'Passport Copy',
            'Social Security Card',
            'Driver License',
            'Proof of Address',
        ];

        $slots = collect($slotNames)->map(fn($name) => Slot::create(['name' => $name]));

        // Create employee accounts
        $employees = [
            ['name' => 'John Smith', 'email' => 'john@no1leftbehind.us', 'password' => 'Employee1234'],
            ['name' => 'Sara Johnson', 'email' => 'sara@no1leftbehind.us', 'password' => 'Employee1234'],
        ];

        foreach ($employees as $employeeData) {
            $employee = User::create([
                'name' => $employeeData['name'],
                'email' => $employeeData['email'],
                'password' => Hash::make($employeeData['password']),
                'role' => 'employee',
                'is_active' => true,
            ]);

            foreach ($slots as $slot) {
                UserSlot::create([
                    'user_id' => $employee->id,
                    'slot_id' => $slot->id,
                ]);
            }
        }
    }
}
