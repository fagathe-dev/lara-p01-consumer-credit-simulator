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
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('logo')->nullable();
            $table->boolean('is_active')->default(true);
            
            // Configurations API & Commerciales
            $table->string('api_endpoint')->nullable();
            $table->integer('monthly_quota')->nullable(); // Le quota mensuel ajouté
            $table->decimal('min_loan_amount', 10, 2)->default(0);
            $table->decimal('max_loan_amount', 10, 2)->nullable();
            $table->string('support_email')->nullable();
            $table->integer('processing_time_hours')->default(24);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};