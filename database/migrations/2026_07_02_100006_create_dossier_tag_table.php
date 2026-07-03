<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Pivot many-to-many dossiers <-> tags (jointure sur dossiers.ref).
     */
    public function up(): void
    {
        Schema::create('dossier_tag', function (Blueprint $table): void {
            $table->id();
            $table->string('dossier_ref')->index();
            $table->foreignId('tag_id')->constrained('tags')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['dossier_ref', 'tag_id']);
            $table->foreign('dossier_ref')
                ->references('ref')->on('dossiers')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dossier_tag');
    }
};
