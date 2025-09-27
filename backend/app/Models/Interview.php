<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Interview extends Model {
    use HasFactory;
    protected $fillable = [
        'user_id','role','difficulty','started_at','ended_at','duration_sec',
        'score_overall','rubric_json','meta'
    ];
    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'rubric_json' => 'array',
        'meta' => 'array',
    ];
    public function user(){ return $this->belongsTo(User::class); }
    public function transcripts(){ return $this->hasMany(Transcript::class); }
    public function events(){ return $this->hasMany(EventLog::class); }
}