<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InviteCode extends Model
{
    protected $fillable = ['code','max_uses','used','expires_at'];
    protected $casts = ['expires_at' => 'datetime'];

    public function canUse(): bool {
        $notExpired = $this->expires_at ? now()->lt($this->expires_at) : true;
        return $notExpired && ($this->used < $this->max_uses);
    }
}
