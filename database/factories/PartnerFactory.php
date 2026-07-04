<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Partner;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Partner>
 */
class PartnerFactory extends Factory
{
    protected $model = Partner::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->company();

        return [
            'name' => $name,
            'code' => strtoupper(Str::slug($name, '_')) . '_' . fake()->unique()->numberBetween(100, 999),
            'logo' => null,
            'is_active' => true,
            'api_endpoint' => fake()->optional()->url(),
            'monthly_quota' => fake()->numberBetween(100, 1000),
            'min_loan_amount' => 1000,
            'max_loan_amount' => 75000,
            'support_email' => fake()->companyEmail(),
            'processing_time_hours' => fake()->randomElement([24, 48, 72]),
        ];
    }
}
