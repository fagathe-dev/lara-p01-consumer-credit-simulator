<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Ajoute la référence publique et le matricule agent aux utilisateurs.
     * - ref      : identifiant public unique (CLT-/AGT-…), généré à la création.
     * - agent_id : matricule agent (AGT-XXXXXX), renseigné uniquement pour les ROLE_CRM_*.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('ref')->unique()->after('id');
            $table->string('agent_id')->nullable()->unique()->after('ref');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['ref']);
            $table->dropUnique(['agent_id']);
            $table->dropColumn(['ref', 'agent_id']);
        });
    }
};
