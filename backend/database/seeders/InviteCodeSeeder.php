<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InviteCode;

class InviteCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        InviteCode::firstOrCreate(
            ['code' => 'DEMO-PRO-999'],
            [
                'max_uses'  => 50,
                'used'      => 0,
                'expires_at'=> now()->addMonths(3),
            ]
        );

        InviteCode::firstOrCreate(
            ['code' => 'EARLY-BIRD-2025'],
            [
                'max_uses'  => 100,
                'used'      => 0,
                'expires_at'=> now()->addMonths(6),
            ]
        );
    }
}
