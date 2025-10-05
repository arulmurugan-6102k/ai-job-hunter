<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobRequest;
use App\Http\Resources\JobCollection;
use App\Models\Company;
use App\Models\Job;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Validator;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Job::with(relations: ['company', 'highlights', 'skills']);

        if($request->filled('q')) {
            $searchTerm = $request->q;
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%")
                  ->orWhere('role', 'like', "%{$searchTerm}%")
                  ->orWhereHas('company', fn($q) => $q->where('name', 'like', "%{$searchTerm}%"));
            });
        }

        if ($request->filled('company')) {
            $query->whereHas('company', fn($q) => $q->where('name', 'like', "%{$request->company}%"));
        }

        if ($request->filled('location')) {
            $query->where('location', 'like' , "%{$request->location}%");
        }

        if($request->filled('skills')) {
            $skills = array_map('trim', explode(',', $request->skills));
            $query->whereHas('skills', fn($q) => $q->where('name', $skills));
        }

        if($request->filled('experience')) {
            $query->where('experience', 'like', "%{$request->experience}%");
        }

        if($request->filled('min_salary')) {
            $query->whereRaw("CAST(SUBSTRING_INDEX(salary, '-', 1) AS UNSIGNED) >= ?", [$request->min_salary]);
        }

        if ($request->filled('max_salary')) {
            $query->whereRaw("CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(salary, '-', -1), ' ', 1) AS UNSIGNED) <= ?", [$request->max_salary]);
        }

        if($request->filled('industry_type')) {
            $query->where('industry_type', 'like', "%{$request->industry_type}%");
        }

        if($request->filled('department')) {
            $query->where('department', 'like', "%{$request->department}%");
        }

        if ($request->filled('employment_type')) {
            $query->where('employment_type', 'like', "%{$request->employment_type}%");
        }
        
        if($request->filled('min_rating')) {
            $query->whereHas('company', fn($q) => $q->where('rating', '>=', $request->min_rating));
        }

        if ($request->filled('scraped_from')) {
            $query->where('scraped_at', '>=', $request->scraped_from);
        }

        if ($request->filled('scraped_to')) {
            $query->where('scraped_at', '<=', $request->scraped_to);
        }

        if($request->filled('posted_within')) {
            $daysAgo = now()->subDays($request->posted_within);
            $query->where('scraped_at', '>=', $daysAgo);
        }

        if ($request->filled('min_openings')) {
            $query->where('openings', '>=', $request->min_openings);
        }

        $sortBy = $request->get('sort_by', 'scraped_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSorts = ['scrapped_at', 'title', 'location', 'salary', 'openings', 'applicants'];

        if(in_array($sortBy, $allowedSorts)) {
            if($sortBy === 'company') {
                $query->join('companies', 'jobs.company_id', '=', 'companies.id')
                      ->orderBy('companies.name', $sortOrder)
                      ->select('jobs.*');
            } else {
                $query->orderBy($sortBy, $sortOrder);
            }
        }

        $perPage = min($request->get('per_page', 25), 100);
        $jobs = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Jobs retrieved successfully',
            'data' => new JobCollection($jobs),
            'filters_applied' => $request->only([
                'q', 'company', 'location', 'skills', 'experience', 
                'min_salary', 'max_salary', 'industry_type', 'department',
                'employment_type', 'role_category', 'min_rating',
                'scraped_from', 'scraped_to', 'posted_within', 'min_openings'
            ])
            ]);

    }

    /**
     * Store a newly created resourc// Text Search (title, description, company namee in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'jobs' => 'required|array',
            'jobs.*' => 'required|array'
        ]);

        $createdJobs = [];
        $errors = [];

        DB::transaction(function () use ($request, &$createdJobs, &$errors) {
            // Create or find company
            foreach ($request->jobs as $index => $jobData) {
                try {

                    $validator = validator($jobData, (new StoreJobRequest())->rules());

                    if ($validator->fails()) {
                        $errors[$index] = $validator->errors();
                        Log::info($validator->errors());
                        continue;
                    }

                    $company = Company::firstOrCreate(
                        ['name' => $jobData['company']],
                        [
                            'rating' => $jobData['company_rating'] ?? null,
                            'review_count' => isset($jobData['company_reviews'])
                                ? (int) str_replace(' Reviews', '', $jobData['company_reviews'])
                                : null,
                            'about' => $jobData['about_company'] ?? null
                        ]
                    );
                    // Create job
                    $job = Job::create([
                        'job_url' => $jobData['job_url'],
                        'session_id' => $jobData['session_id'],
                        'title' => $jobData['title'],
                        'company_id' => $company->id,
                        'experience' => $jobData['experience'] ?? null,
                        'salary' => $jobData['salary'] ?? null,
                        'location' => $jobData['location'],
                        'posted' => $jobData['posted'] ?? null,
                        'openings' => $jobData['openings'] ?? null,
                        'applicants' => $jobData['applicants'] ?? null,
                        'description' => $jobData['description'] ?? null,
                        'role' => $jobData['role'] ?? null,
                        'industry_type' => $jobData['industry_type'] ?? null,
                        'department' => $jobData['department'] ?? null,
                        'employment_type' => $jobData['employment_type'] ?? null,
                        'role_category' => $jobData['role_category'] ?? null,
                        'ug_requirement' => $jobData['ug_requirement'] ?? null,
                        'pg_requirement' => $jobData['pg_requirement'] ?? null,
                        'scraped_at' => $jobData['scraped_at'],
                    ]);

                    // Create a job highlights
                    if (isset($jobData['job_highlights']) && is_array($jobData['job_highlights'])) {
                        foreach ($jobData['job_highlights'] as $highlight) {
                            $job->highlights()->create(['highlight' => $highlight]);
                        }
                    }

                    // Create or find skills and associated with job
                    if (isset($jobData['key_skills']) && is_array($jobData['key_skills'])) {
                        foreach ($jobData['key_skills'] as $skillName) {
                            $skill = Skill::firstOrCreate(['name' => $skillName]);
                            $job->skills()->attach($skill->id);
                        }
                    }

                    $createdJobs[] = $job->load(['company', 'highlights', 'skills']);
                } catch (\Exception $e) {
                    $errors[$index] = $e->getMessage();
                }

            }
        });

        return response()->json([
            'message' => "Jobs created successfully",
            'create_count' => count($createdJobs),
            'error_count' => count($errors),
            'errors' => $errors
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
