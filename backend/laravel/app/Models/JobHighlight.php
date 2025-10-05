<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobHighlight extends Model
{
    use HasFactory;
    protected $fillable = ['job_id', 'highlight'];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }
}
