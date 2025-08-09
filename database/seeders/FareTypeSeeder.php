<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FareType;
use Illuminate\Support\Facades\DB;

class FareTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FareType::truncate();
        DB::table('fare_types')->insert([
            [
                'name' => 'Full fare',
                'price' => 160,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Senior/PWD with valid ID',
                'price' => 104,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Student with valid ID',
                'price' => 116,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Children 3yrs-12yrs old',
                'price' => 72,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
