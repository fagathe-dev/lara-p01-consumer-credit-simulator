<?php

use Core\Simulator\Enum\OfferStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id();

            // Références & Relations
            $table->string('internal_reference')->unique();
            $table->string('partner_reference');
            $table->string('offer_code')->nullable();
            $table->foreignId('partner_id')->constrained()->restrictOnDelete();

            // FK vers la table `dossiers` (le modèle métier s'appelle Dossier ;
            // la colonne conserve le nom `application_id` par convention interne).
            $table->foreignId('application_id')->constrained('dossiers')->cascadeOnDelete();

            // Montants & Durée
            $table->decimal('project_amount', 10, 2);
            $table->decimal('project_cost', 10, 2)->nullable();
            $table->integer('duration');
            $table->decimal('monthly_payment', 10, 2);

            // Taux & Coûts globaux
            $table->decimal('nominal_rate', 5, 2);
            $table->decimal('apr', 5, 2); // TAEG
            $table->decimal('total_credit_cost', 10, 2);
            $table->decimal('total_amount_owed', 10, 2);
            $table->decimal('processing_fees', 8, 2)->default(0);

            // Assurance facultative/obligatoire
            $table->decimal('insurance_monthly_premium', 8, 2)->nullable();
            $table->decimal('insurance_apr', 5, 2)->nullable(); // TAEA

            // Cycle de vie
            $table->string('status')->default(OfferStatusEnum::PENDING->value);
            // J'ai retiré le nullable() car avec un default(), il n'est techniquement jamais null à la création, 
            // mais tu peux enchaîner ->nullable()->default(...) si tu prévois de le vider volontairement un jour.

            $table->timestamp('expires_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};