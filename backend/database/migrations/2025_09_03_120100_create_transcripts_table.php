<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // If someone already created the table, just treat this migration as "ran"
        if (Schema::hasTable('transcripts')) {
            return;
        }

        Schema::create('transcripts', function (Blueprint $t) {
            $t->id();
            // interviews.id is BIGINT unsigned, so match exactly:
            $t->foreignId('interview_id')->constrained('interviews')->cascadeOnDelete();
            $t->enum('speaker', ['ai', 'user']);
            $t->longText('text');
            $t->unsignedBigInteger('ts_ms')->nullable(); // epoch ms
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transcripts');
    }
};
