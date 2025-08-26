<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'job_url' => $this->job_url,
            'session_id' => $this->session_id,
            'title' => $this->title.
            'company' => [
                'id' => $this->company->id,
                'name' => $this->company->name,
                'rating' => $this->company->rating,
                'review_count' => $this->company->review_count,
                'about' => $this->company->about,
            ],
            'experience' => $this->experience,
            'salary' => $this->salary,
            'location' => $this->location,
            'posted' => $this->posted,
            'openings' => $this->openings,
            'applicants' => $this->applicants,
            'description' => $this->description,
            'role' => $this->role,
            'industry_type' => $this->industry_type,
            'department' => $this->department,
            'employment_type' => $this->employment_type,
            'role_category' => $this->role_category,
            'ug_requirement' => $this->ug_requirement,
            'pg_requirement' => $this->pg_requirement,
            'job_highlights' => $this->highlights->pluck('highlights'),
            'key_skills' => $this->skills->pluck('name'),
            'scraped_at' => $this->scraped_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
