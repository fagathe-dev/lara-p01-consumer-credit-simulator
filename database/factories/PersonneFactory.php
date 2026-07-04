<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Dossier;
use App\Models\Personne;
use Core\Simulator\Enum\CivilityEnum;
use Core\Simulator\Enum\EmploymentContractEnum;
use Core\Simulator\Enum\PersonRoleEnum;
use Core\Simulator\Enum\ProfessionalJobEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Personne>
 */
class PersonneFactory extends Factory
{
    protected $model = Personne::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $job = fake()->randomElement(ProfessionalJobEnum::cases());

        return [
            'dossier_id' => Dossier::factory(),
            'role' => PersonRoleEnum::BORROWER,
            'civility' => fake()->randomElement([CivilityEnum::M, CivilityEnum::MME]),
            'last_name' => fake()->lastName(),
            'first_name' => fake()->firstName(),
            'birth_date' => fake()->dateTimeBetween('-65 years', '-20 years')->format('Y-m-d'),
            'professional_sector' => $job->sector(),
            'professional_job' => $job,
            'employment_contract' => fake()->randomElement(EmploymentContractEnum::cases()),
            'probation_period_ended' => true,
            'professional_situation_date' => fake()->dateTimeBetween('-10 years', 'now')->format('Y-m'),
            'phone' => fake()->numerify('06########'),
            'email' => fake()->unique()->safeEmail(),
            'consent_data_usage' => true,
            'consent_canvassing' => fake()->boolean(),
            'consent_advertising' => fake()->boolean(),
        ];
    }

    /** Rôle co-emprunteur. */
    public function coborrower(): static
    {
        return $this->state(fn() => ['role' => PersonRoleEnum::COBORROWER]);
    }

    /** Rattache la personne à un dossier existant. */
    public function forDossier(Dossier $dossier): static
    {
        return $this->state(fn() => ['dossier_id' => $dossier->id]);
    }

    /** Force l'email (utile pour préparer un cas de test restreint). */
    public function withEmail(string $email): static
    {
        return $this->state(fn() => ['email' => $email]);
    }
}
