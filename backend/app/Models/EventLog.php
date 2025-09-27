<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EventLog extends Model {
    use HasFactory;
    protected $fillable = ['interview_id','type','payload'];
    protected $casts = ['payload'=>'array'];
    public function interview(){ return $this->belongsTo(Interview::class); }
}