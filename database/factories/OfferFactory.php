<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Dossier;
use App\Models\Offer;
use App\Models\Partner;
use Core\Simulator\Enum\OfferStatusEnum;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Offer>
 */
class OfferFactory extends Factory
{
    protected $model = Offer::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = fake()->numberBetween(3000, 50000);
        $duration = fake()->randomElement([12, 24, 36, 48, 60, 72]);
        $apr = fake()->randomFloat(2, 1.9, 8.9);
        $monthly = round(($amount * (1 + $apr / 100)) / $duration, 2);
        $totalOwed = round($monthly * $duration, 2);

        return [
            'internal_reference' => 'OFR-' . Str::upper(Str::random(10)),
            'partner_reference' => 'P-' . fake()->numerify('######'),
            'offer_code' => fake()->optional()->bothify('OFF-####'),
            'partner_id' => Partner::factory(),
            'application_id' => Dossier::factory(),
            'project_amount' => $amount,
            'project_cost' => $amount,
            'duration' => $duration,
            'monthly_payment' => $monthly,
            'nominal_rate' => round($apr - fake()->randomFloat(2, 0.1, 0.6), 2),
            'apr' => $apr,
            'total_credit_cost' => round($totalOwed - $amount, 2),
            'total_amount_owed' => $totalOwed,
            'processing_fees' => fake()->randomElement([0, 30, 50]),
            'insurance_monthly_premium' => fake()->optional()->randomFloat(2, 5, 40),
            'insurance_apr' => null,
            'status' => fake()->randomElement(OfferStatusEnum::cases()),
            'expires_at' => now()->addDays(fake()->numberBetween(7, 30)),
        ];
    }

    /** Rattache l'offre à un dossier + partenaire donnés. */
    public function forDossier(Dossier $dossier, Partner $partner): static
    {
        return $this->state(fn() => [
            'application_id' => $dossier->id,
            'partner_id' => $partner->id,
        ]);
    }

    /** Force un statut donné. */
    public function status(OfferStatusEnum $status): static
    {
        return $this->state(fn() => ['status' => $status]);
    }
}
