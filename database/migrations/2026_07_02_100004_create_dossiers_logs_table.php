<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Historique des actions sur un dossier.
     * initiator_ref : NULL pour CLIENT_RESTREINT (pas de compte) et PROCESSOR (API Python).
     */
    public function up(): void
    {
        Schema::create('dossiers_logs', function (Blueprint $table): void {
            $table->id();
            $table->string('dossier_ref')->index();
            $table->string('initiator_type');
            $table->string('initiator_ref')->nullable();
            $table->string('action');
            $table->json('context')->nullable();
            $table->timestamp('timestamp')->useCurrent();

            $table->foreign('dossier_ref')
                ->references('ref')->on('dossiers')
                ->cascadeOnDelete();
            $table->foreign('initiator_ref')
                ->references('ref')->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dossiers_logs');
    }
};
