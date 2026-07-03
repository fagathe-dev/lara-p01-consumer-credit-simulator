<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Colonnes d'authentification / suivi métier sur les dossiers.
     * `ref` existe déjà (create_dossiers_table) : non dupliqué ici.
     *
     * - agent_assignee_id            : agent en charge (FK users.agent_id), NULL tant que non assigné.
     * - agent_application_creator_id : agent créateur via tunnel light CRM (FK users.agent_id), NULL si WEB.
     * - canal                        : WEB (client) ou CRM (agent).
     * - risk_level                   : échelle de risque (rempli après scoring Python).
     * - scoring                      : note de scoring renvoyée par l'API Python.
     */
    public function up(): void
    {
        Schema::table('dossiers', function (Blueprint $table): void {
            $table->string('agent_assignee_id')->nullable()->after('user_id');
            $table->string('agent_application_creator_id')->nullable()->after('agent_assignee_id');
            $table->string('canal')->default('WEB')->after('agent_application_creator_id');
            $table->string('risk_level')->nullable()->after('canal');
            $table->integer('scoring')->nullable()->after('risk_level');

            $table->index('agent_assignee_id');
            $table->index('agent_application_creator_id');

            $table->foreign('agent_assignee_id')
                ->references('agent_id')->on('users')
                ->nullOnDelete();
            $table->foreign('agent_application_creator_id')
                ->references('agent_id')->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('dossiers', function (Blueprint $table): void {
            $table->dropForeign(['agent_assignee_id']);
            $table->dropForeign(['agent_application_creator_id']);
            $table->dropIndex(['agent_assignee_id']);
            $table->dropIndex(['agent_application_creator_id']);
            $table->dropColumn([
                'agent_assignee_id',
                'agent_application_creator_id',
                'canal',
                'risk_level',
                'scoring',
            ]);
        });
    }
};
