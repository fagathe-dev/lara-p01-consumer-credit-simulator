<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Dossier;
use App\Models\User;
use Core\Simulator\Enum\ApplicationStatusEnum;
use Core\Simulator\Enum\CanalEnum;
use Core\Simulator\Enum\FamilySituationEnum;
use Core\Simulator\Enum\HousingStatusEnum;
use Core\Simulator\Enum\ProjectTypeEnum;
use Core\Simulator\Enum\RiskLevelEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Dossier>
 */
class DossierFactory extends Factory
{
    protected $model = Dossier::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_type' => fake()->randomElement(ProjectTypeEnum::cases()),
            'project_amount' => fake()->numberBetween(3000, 50000),
            'project_duration' => fake()->randomElement([12, 24, 36, 48, 60, 72]),
            'status' => fake()->randomElement(ApplicationStatusEnum::cases()),
            'family_situation' => fake()->randomElement(FamilySituationEnum::cases()),
            'family_situation_year' => (string) fake()->numberBetween(2005, 2024),
            'has_coborrower' => false,
            'housing_status' => fake()->randomElement(HousingStatusEnum::cases()),
            'housing_status_year' => (string) fake()->numberBetween(2005, 2024),
            'income_net_monthly' => fake()->numberBetween(1500, 6000),
            'income_rental' => fake()->optional()->numberBetween(200, 1500),
            'income_allowance' => fake()->optional()->numberBetween(100, 500),
            'income_other' => null,
            'charge_housing' => fake()->numberBetween(400, 1500),
            'has_active_consumer_credit' => fake()->boolean(30),
            'charge_other' => fake()->optional()->numberBetween(50, 400),
            'user_id' => null,
            'canal' => CanalEnum::WEB,
            'risk_level' => null,
            'scoring' => null,
        ];
    }

    /** Dossier avec co-emprunteur. */
    public function withCoborrower(): static
    {
        return $this->state(fn() => ['has_coborrower' => true]);
    }

    /** Dossier scoré (risk_level + scoring renseignés). */
    public function scored(): static
    {
        return $this->state(fn() => [
            'risk_level' => fake()->randomElement(RiskLevelEnum::cases()),
            'scoring' => fake()->numberBetween(300, 900),
        ]);
    }

    /** Dossier rattaché à un client. */
    public function forUser(User $user): static
    {
        return $this->state(fn() => ['user_id' => $user->id]);
    }

    /** Dossier anonyme (mode restreint, sans compte). */
    public function anonymous(): static
    {
        return $this->state(fn() => ['user_id' => null]);
    }

    /** Dossier créé via le canal CRM. */
    public function crmCanal(): static
    {
        return $this->state(fn() => ['canal' => CanalEnum::CRM]);
    }

    /** Dossier assigné à un agent (par matricule agent_id). */
    public function assignedTo(string $agentId): static
    {
        return $this->state(fn() => ['agent_assignee_id' => $agentId]);
    }

    /** Force un statut donné. */
    public function status(ApplicationStatusEnum $status): static
    {
        return $this->state(fn() => ['status' => $status]);
    }
}
