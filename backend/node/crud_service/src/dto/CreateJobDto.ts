import { IsString, IsOptional, IsNumber, IsArray, IsDateString, IsUrl } from "class-validator";

export class CreateJobDto {
    @IsUrl()
    job_url: string;

    @IsString()
    session_id: string;

    @IsString()
    title: string;

    @IsString()
    company: string;

    @IsOptional()
    @IsNumber()
    company_rating?: number;

    @IsOptional()
    @IsString()
    company_reviews?: string;

    @IsOptional()
    @IsString()
    about_company?: string;

    @IsOptional()
    @IsString()
    experience?: string;

    @IsOptional()
    @IsString()
    salary: string;

    @IsString()
    location: string;

    @IsOptional()
    @IsString()
    posted?: string;

    @IsOptional()
    @IsNumber()
    openings?: string;

    @IsOptional()
    @IsNumber()
    applicants?: number;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsString()
    industry_type?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsString()
    employment_type?: string;

    @IsOptional()
    @IsString()
    role_category?: string;

    @IsOptional()
    @IsString()
    pg_requirement?: string;

    @IsOptional()
    @IsString()
    ug_requirement?: string;

    @IsDateString()
    scraped_at: string;

    @IsOptional()
    @IsArray()
    job_highlights?: string[];

    @IsOptional()
    @IsArray()
    job_skills?: string[];




}