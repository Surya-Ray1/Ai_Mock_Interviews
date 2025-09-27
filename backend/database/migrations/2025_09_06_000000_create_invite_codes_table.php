<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('invite_codes', function (Blueprint $t) {
      $t->id();
      $t->string('code')->unique();
      $t->integer('max_uses')->default(1);
      $t->integer('used')->default(0);
      $t->timestamp('expires_at')->nullable();
      $t->timestamps();
    });

    // Add 'plan' to users if it doesn't exist
    if (!Schema::hasColumn('users', 'plan')) {
      Schema::table('users', function (Blueprint $t) {
        $t->string('plan')->default('free');
      });
    }
  }

  public function down(): void {
    Schema::dropIfExists('invite_codes');
    // (Optional) don't drop users.plan to avoid data loss
  }
};
