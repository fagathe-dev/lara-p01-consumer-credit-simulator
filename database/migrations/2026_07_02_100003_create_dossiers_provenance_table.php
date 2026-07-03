<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Provenance des accès au dossier (1-to-N).
     * Une ligne par accès/connexion : trace IP + device dans le temps.
     */
    public function up(): void
    {
        Schema::create('dossiers_provenance', function (Blueprint $table): void {
            $table->id();
            $table->string('dossier_ref')->index();
            $table->string('ip', 45)->nullable();
            $table->string('device')->nullable();
            $table->timestamp('timestamp')->useCurrent();

            $table->foreign('dossier_ref')
                ->references('ref')->on('dossiers')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dossiers_provenance');
    }
};
