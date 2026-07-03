<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id()->nullable;
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->unique();
            $table->string('role')->default('user');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('user_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->index()->constrained()->onDelete('cascade');
            $table->string('type');
            $table->string('token');
            $table->json('content')->nullable();
            $table->boolean('is_used')->default(false);
            $table->timestamp('created_at');
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('expires_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index()->constrained()->onDelete('cascade');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('user_requests');
        Schema::dropIfExists('sessions');
    }
};
