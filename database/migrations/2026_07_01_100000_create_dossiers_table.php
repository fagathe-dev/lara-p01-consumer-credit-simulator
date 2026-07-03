<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dossiers', function (Blueprint $table): void {
            $table->id();

            // Projet
            $table->string('project_type');
            $table->decimal('project_amount', 10, 2);
            $table->integer('project_duration');
            $table->string('status')->default('new');

            // Situation & Résidence
            $table->string('family_situation');
            $table->string('family_situation_year', 4)->nullable();
            $table->boolean('has_coborrower')->default(false);
            $table->string('housing_status');
            $table->string('housing_status_year', 4)->nullable();

            // Finances — Revenus
            $table->decimal('income_net_monthly', 10, 2);
            $table->decimal('income_rental', 10, 2)->nullable();
            $table->decimal('income_allowance', 10, 2)->nullable();
            $table->decimal('income_other', 10, 2)->nullable();

            // Finances — Charges
            $table->decimal('charge_housing', 10, 2)->nullable();
            $table->decimal('charge_mortgage_remaining', 10, 2)->nullable();
            $table->decimal('housing_property_value', 10, 2)->nullable();
            $table->boolean('has_active_consumer_credit')->default(false);
            $table->decimal('charge_consumer_credit_monthly', 10, 2)->nullable();
            $table->decimal('charge_consumer_credit_remaining', 10, 2)->nullable();
            $table->decimal('charge_other', 10, 2)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dossiers');
    }
};
