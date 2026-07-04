<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Ajoute la photo de profil (chemin relatif sur le disque `public`).
     * On ne stocke jamais le binaire en base : uniquement le chemin
     * (ex. `avatar/xxxx.png`), exposé publiquement via `storage:link`.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('avatar')->nullable()->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('avatar');
        });
    }
};
