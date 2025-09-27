<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('payments', function (Blueprint $t) {
      $t->id();
      $t->foreignId('user_id')->constrained()->cascadeOnDelete();
      $t->string('gateway')->default('razorpay');
      $t->string('order_id')->unique();
      $t->string('payment_id')->nullable();
      $t->string('signature')->nullable();
      $t->integer('amount')->comment('paise');
      $t->string('currency')->default('INR');
      $t->enum('status',['created','paid','failed'])->default('created');
      $t->json('notes')->nullable();
      $t->timestamps();
    });
  }
  public function down(): void { Schema::dropIfExists('payments'); }
};
