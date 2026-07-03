<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Complète la table `tags` (CRM, mode « Apple Finder ») : libellé + couleur hex.
     */
    public function up(): void
    {
        Schema::table('tags', function (Blueprint $table): void {
            $table->string('name')->after('id');
            $table->string('color')->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('tags', function (Blueprint $table): void {
            $table->dropColumn(['name', 'color']);
        });
    }
};
