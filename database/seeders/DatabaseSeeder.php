<?php

namespace Database\Seeders;

use App\Models\BrandingSetting;
use App\Models\Slot;
use App\Models\User;
use App\Models\UserSlot;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        BrandingSetting::query()->firstOrCreate([], BrandingSetting::defaults());

        // Easy-access test credentials
        User::updateOrCreate(['email' => 'admin@example.com'], [
            'name'      => 'Admin',
            'password'  => Hash::make('password'),
            'role'      => 'admin',
            'is_active' => true,
        ]);

        User::updateOrCreate(['email' => 'user@example.com'], [
            'name'      => 'Test Employee',
            'password'  => Hash::make('password'),
            'role'      => 'employee',
            'is_active' => true,
        ]);

        // Create admin
        User::updateOrCreate(['email' => 'admin@no1leftbehind.us'], [
            'name'      => 'Admin',
            'password'  => Hash::make('Admin@1234'),
            'role'      => 'admin',
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
            $employee = User::updateOrCreate(['email' => $employeeData['email']], [
                'name'      => $employeeData['name'],
                'password'  => Hash::make($employeeData['password']),
                'role'      => 'employee',
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
