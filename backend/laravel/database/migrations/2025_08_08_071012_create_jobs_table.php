<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('job_url')->unique();
            $table->string('session_id');
            $table->string('title');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('experience')->nullable();
            $table->string('salary')->nullable();
            $table->string('location');
            $table->string('posted')->nullable();
            $table->integer('openings')->nullable();
            $table->integer('applicants')->nullable();
            $table->longText('description')->nullable();
            $table->string('role')->nullable();
            $table->string('industry_type')->nullable();
            $table->string('department')->nullable();
            $table->string('employment_type')->nullable();
            $table->string('role_category')->nullable();
            $table->string('ug_requirement')->nullable();
            $table->string('pg_requirement')->nullable();
            $table->timestamp('scraped_at');
            $table->timestamps();

            $table->index(['company_id', 'location']);
            $table->index('scraped_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
