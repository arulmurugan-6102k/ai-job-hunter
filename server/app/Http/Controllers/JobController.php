<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobRequest;
use App\Models\Company;
use App\Models\Job;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Validator;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
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
