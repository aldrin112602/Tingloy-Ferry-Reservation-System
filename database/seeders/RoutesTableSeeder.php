<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;


class RoutesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('routes')->insert([
            [
                'route_code' => 'CODE-' . Str::uuid(),
                'start_location' => 'Mabini',
                'end_location' => 'Tingloy',
                'date_and_time' => now()->addDays(1),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'route_code' => 'CODE-' . Str::uuid(),
                'start_location' => 'Tingloy',
                'end_location' => 'Mabini',
                'date_and_time' => now()->addDays(2)->setTime(15, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'route_code' => 'CODE-' . Str::uuid(),
                'start_location' => 'Mabini',
                'end_location' => 'Tingloy',
                'date_and_time' => now()->addDays(3)->setTime(15, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'route_code' => 'CODE-' . Str::uuid(),
                'start_location' => 'Tingloy',
                'end_location' => 'Mabini',
                'date_and_time' => now()->addDays(4)->setTime(15, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'route_code' => 'CODE-' . Str::uuid(),
                'start_location' => 'Mabini',
                'end_location' => 'Tingloy',
                'date_and_time' => now()->addDays(5)->setTime(15, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'route_code' => 'CODE-' . Str::uuid(),
                'start_location' => 'Tingloy',
                'end_location' => 'Mabini',
                'date_and_time' => now()->addDays(6)->setTime(15, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
