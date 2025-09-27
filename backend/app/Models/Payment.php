<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id','gateway','order_id','payment_id','signature',
        'amount','currency','status','notes'
    ];

    protected $casts = ['notes' => 'array'];

    public function user() { return $this->belongsTo(\App\Models\User::class); }
}
