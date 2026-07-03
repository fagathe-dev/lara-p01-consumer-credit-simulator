<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Compteur de tentatives de saisie du code (anti brute-force sur les OTP).
     */
    public function up(): void
    {
        Schema::table('user_requests', function (Blueprint $table): void {
            $table->integer('attempts')->nullable()->default(0)->after('is_used');
        });
    }

    public function down(): void
    {
        Schema::table('user_requests', function (Blueprint $table): void {
            $table->dropColumn('attempts');
        });
    }
};
