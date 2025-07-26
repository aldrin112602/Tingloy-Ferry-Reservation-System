<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SetupPayment;

class SetupPaymentSeeder extends Seeder
{
    public function run(): void
    {
        SetupPayment::truncate();

        SetupPayment::create([
            'payment_method_name' => 'Gcash',
            'account_name' => 'Aldrin Caballero',
            'account_number' => '09512793354',
        ]);

        SetupPayment::create([
            'payment_method_name' => 'PayMaya',
            'account_name' => 'Maria Santos',
            'account_number' => '09171234567',
        ]);

        SetupPayment::create([
            'payment_method_name' => 'BDO Bank Transfer',
            'account_name' => 'Juan Dela Cruz',
            'account_number' => '001234567890',
        ]);

        SetupPayment::create([
            'payment_method_name' => 'BPI Bank Transfer',
            'account_name' => 'Elena Rodriguez',
            'account_number' => '009876543210',
        ]);
        SetupPayment::create([
            'payment_method_name' => 'UnionBank',
            'account_name' => 'Carlos Garcia',
            'account_number' => '012345678901',
        ]);
        SetupPayment::create([
            'payment_method_name' => 'Cebuana Lhuillier',
            'account_name' => 'Liza Reyes',
            'account_number' => '09876543210',
        ]);
        SetupPayment::create([
            'payment_method_name' => 'MLhuillier',
            'account_name' => 'Josefa Cruz',
            'account_number' => '12345678901',
        ]);
        SetupPayment::create([
            'payment_method_name' => 'Palawan Express',
            'account_name' => 'Andres Bonifacio',
            'account_number' => '23456789012',
        ]);
        SetupPayment::create([
            'payment_method_name' => 'Smart Padala',
            'account_name' => 'Rizalina Torres',
            'account_number' => '34567890123',
        ]);
        SetupPayment::create([
            'payment_method_name' => 'Coins.ph',
            'account_name' => 'Antonio Luna',
            'account_number' => '45678901234',
        ]);
        SetupPayment::create([
            'payment_method_name' => 'GrabPay',
            'account_name' => 'Emilio Jacinto',
            'account_number' => '56789012345',
        ]);
        $this->command->info('Setup Payments seeded!');
    }
}