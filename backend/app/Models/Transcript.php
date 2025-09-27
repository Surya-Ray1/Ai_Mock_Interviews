<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transcript extends Model {
    use HasFactory;
    protected $fillable = ['interview_id','speaker','text','ts_ms'];
    public function interview(){ return $this->belongsTo(Interview::class); }
}