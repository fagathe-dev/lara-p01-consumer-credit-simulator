<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('personnes', function (Blueprint $table): void {
            $table->id();

            // Relation
            $table->foreignId('dossier_id')->constrained('dossiers')->onDelete('cascade');
            $table->string('role');

            // Identité
            $table->string('civility');
            $table->string('last_name');
            $table->string('maiden_name')->nullable();
            $table->string('first_name');
            $table->date('birth_date');
            $table->string('birth_country')->nullable();
            $table->string('nationality')->nullable();

            // Situation Professionnelle
            $table->integer('professional_sector');
            $table->integer('professional_job');
            $table->string('employment_contract')->nullable();
            $table->boolean('probation_period_ended')->nullable();
            $table->string('professional_situation_date', 7);

            // Contact & Consentements
            $table->string('phone');
            $table->string('email');
            $table->boolean('consent_data_usage')->default(false);
            $table->boolean('consent_canvassing')->default(false);
            $table->boolean('consent_advertising')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personnes');
    }
};
