<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;
    protected $fillable = [
        'job_url', 'session_id', 'title', 'company_id', 'experience',
        'salary', 'location', 'posted', 'openings', 'applicants',
        'description', 'role', 'industry_type', 'department',
        'employment_type', 'role_category', 'ug_requirement',
        'pg_requirement', 'scraped_at'
    ];

    protected $casts = [
        'scraped_at' => 'datetime',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function highlights()
    {
        return $this->hasMany(Skill::class, 'job_skills');
    }
}
