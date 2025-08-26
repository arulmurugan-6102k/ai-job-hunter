<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'job_url' => 'required|string|url|unique:jobs,job_url',
            'session_id' => 'required|string',
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'company_rating' => 'nullable|numeric|between:0,5',
            'company_reviews' => 'nullable|string',
            'experience' => 'nullable|string',
            'salary' => 'nullable|string',
            'location' => 'required|string|max:255',
            'posted' => 'nullable|string',
            'openings' => 'nullable|integer|min:0',
            'applicants' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'role' => 'nullable|string',
            'industry_type' => 'nullable|string',
            'department' => 'nullable|string',
            'employment_type' => 'nullable|string',
            'role_category' => 'nullable|string',
            'ug_requirement' => 'nullable|string',
            'pg_requirement' => 'nullable|string',
            'scraped_at' => 'required|date',
            'job_highlights' => 'nullable|array',
            'job_highlights.*' => 'string',
            'key_skills' => 'nullable|array',
            'key_skills.*' => 'string',
            'about_company' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'job_url.required' => 'Job URL is required',
            'job_url.unique' => 'This job URL already exists',
            'title.required' => 'Job title is required',
            'company.required' => 'Company name is required',
            'location.required' => 'Location is required',
            'scraped_at.required' => 'Scraped date is required',
        ];
    }
}
