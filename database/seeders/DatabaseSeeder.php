<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Dossier;
use App\Models\Offer;
use App\Models\Partner;
use App\Models\Personne;
use App\Models\User;
use Core\Simulator\Enum\ApplicationStatusEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class DatabaseSeeder extends Seeder
{
    /**
     * Référence du dossier anonyme déterministe (test du mode restreint).
     */
    private const RESTRICTED_DOSSIER_REF = 'DOSS-DEMO-RESTREINT';

    /**
     * Email de l'emprunteur du dossier restreint déterministe.
     */
    private const RESTRICTED_BORROWER_EMAIL = 'restreint@demo.test';

    /**
     * Seed the application's database.
     *
     * NB : on NE désactive PAS les événements de modèle (pas de WithoutModelEvents)
     * car la génération de `ref`/`agent_id` repose sur l'événement `creating`.
     */
    public function run(): void
    {
        $partners = Partner::factory()->count(3)->create();

        // --- Comptes déterministes (mot de passe commun : "password") ---
        $admin = User::factory()->admin()->create([
            'first_name' => 'Alice',
            'last_name' => 'Admin',
            'email' => 'admin@demo.test',
        ]);
        $managerFixe = User::factory()->manager()->create([
            'first_name' => 'Marc',
            'last_name' => 'Manager',
            'email' => 'manager@demo.test',
        ]);
        $agentFixe = User::factory()->agent()->create([
            'first_name' => 'Agnès',
            'last_name' => 'Agent',
            'email' => 'agent@demo.test',
        ]);
        $clientFixe = User::factory()->client()->withAvatar()->create([
            'first_name' => 'Claire',
            'last_name' => 'Client',
            'email' => 'client@demo.test',
        ]);

        // --- Comptes Faker pour atteindre 20 utilisateurs tous rôles ---
        $managers = User::factory()->manager()->count(1)->create();          // total managers : 2
        $agents = User::factory()->agent()->count(4)->create();              // total agents   : 5
        $clientsAvecAvatar = User::factory()->client()->withAvatar()->count(5)->create();
        $clientsSansAvatar = User::factory()->client()->count(6)->create();  // total clients  : 12

        $allAgents = collect([$agentFixe])->merge($agents);
        $agentIds = $allAgents->pluck('agent_id')->filter()->values()->all();
        $allClients = collect([$clientFixe])->merge($clientsAvecAvatar)->merge($clientsSansAvatar);

        // --- Dossiers déterministes du client de test (avec offres visibles) ---
        $this->makeDossier($clientFixe, $partners, $agentIds, ApplicationStatusEnum::ACCEPTE, true);
        $this->makeDossier($clientFixe, $partners, $agentIds, ApplicationStatusEnum::IN_PROGRESS);

        // --- Dossiers rattachés aux clients Faker ---
        foreach ($allClients as $client) {
            $nbDossiers = random_int(0, 2);
            for ($i = 0; $i < $nbDossiers; $i++) {
                $this->makeDossier($client, $partners, $agentIds);
            }
        }

        // --- Dossiers anonymes (mode restreint : connexion par ref + email) ---
        for ($i = 0; $i < 4; $i++) {
            $this->makeDossier(null, $partners, $agentIds);
        }

        // --- Cas de test restreint déterministe (ref + email connus) ---
        $this->makeDossier(
            user: null,
            partners: $partners,
            agentIds: $agentIds,
            status: ApplicationStatusEnum::IN_PROGRESS,
            ref: self::RESTRICTED_DOSSIER_REF,
            borrowerEmail: self::RESTRICTED_BORROWER_EMAIL,
        );

        $this->printCredentials($admin, $managerFixe, $agentFixe, $clientFixe);
    }

    /**
     * Crée un dossier cohérent (emprunteur, co-emprunteur éventuel, offres).
     *
     * @param Collection<int, Partner> $partners
     * @param array<int, string> $agentIds
     */
    private function makeDossier(
        ?User $user,
        Collection $partners,
        array $agentIds,
        ?ApplicationStatusEnum $status = null,
        bool $coborrower = false,
        ?string $ref = null,
        ?string $borrowerEmail = null,
    ): Dossier {
        $factory = Dossier::factory();

        if ($user !== null) {
            $factory = $factory->forUser($user);
        }
        if ($status !== null) {
            $factory = $factory->status($status);
        }
        if ($coborrower) {
            $factory = $factory->withCoborrower();
        }
        // Certains dossiers sont scorés, d'autres restent en attente (NULL).
        if (fake()->boolean(50)) {
            $factory = $factory->scored();
        }

        $attributes = [];
        if ($ref !== null) {
            $attributes['ref'] = $ref;
        }
        // Certains dossiers sont assignés à un agent, d'autres non.
        if ($agentIds !== [] && fake()->boolean(60)) {
            $attributes['agent_assignee_id'] = fake()->randomElement($agentIds);
        }

        $dossier = $factory->create($attributes);

        // Emprunteur principal.
        $borrower = Personne::factory()->forDossier($dossier);
        if ($borrowerEmail !== null) {
            $borrower = $borrower->withEmail($borrowerEmail);
        }
        $borrower->create();

        // Co-emprunteur éventuel.
        if ($coborrower) {
            Personne::factory()->coborrower()->forDossier($dossier)->create();
        }

        // Offres pour les dossiers acceptés / en cours (affichage espace client).
        if (in_array($dossier->status, [ApplicationStatusEnum::ACCEPTE, ApplicationStatusEnum::IN_PROGRESS], true)) {
            $nbOffers = random_int(1, 3);
            for ($i = 0; $i < $nbOffers; $i++) {
                Offer::factory()->forDossier($dossier, $partners->random())->create();
            }
        }

        return $dossier;
    }

    private function printCredentials(User $admin, User $manager, User $agent, User $client): void
    {
        $this->command?->info('--- Comptes de test (mot de passe : password) ---');
        $this->command?->line("Admin   : {$admin->email} (agent_id {$admin->agent_id})");
        $this->command?->line("Manager : {$manager->email} (agent_id {$manager->agent_id})");
        $this->command?->line("Agent   : {$agent->email} (agent_id {$agent->agent_id})");
        $this->command?->line("Client  : {$client->email} (ref {$client->ref})");
        $this->command?->info('--- Mode restreint (suivi de dossier) ---');
        $this->command?->line('Ref dossier : ' . self::RESTRICTED_DOSSIER_REF);
        $this->command?->line('Email       : ' . self::RESTRICTED_BORROWER_EMAIL);
    }
}
