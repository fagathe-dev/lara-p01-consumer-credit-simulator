<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Auth\Security\RoleEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => RoleEnum::ROLE_CLIENT,
            'avatar' => null,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /** Client complet (ROLE_CLIENT). */
    public function client(): static
    {
        return $this->state(fn() => ['role' => RoleEnum::ROLE_CLIENT]);
    }

    /** Agent CRM (ROLE_CRM_AGENT) — le matricule agent_id est généré à la création. */
    public function agent(): static
    {
        return $this->state(fn() => ['role' => RoleEnum::ROLE_CRM_AGENT]);
    }

    /** Manager CRM (ROLE_CRM_MANAGER). */
    public function manager(): static
    {
        return $this->state(fn() => ['role' => RoleEnum::ROLE_CRM_MANAGER]);
    }

    /** Administrateur CRM (ROLE_CRM_ADMIN). */
    public function admin(): static
    {
        return $this->state(fn() => ['role' => RoleEnum::ROLE_CRM_ADMIN]);
    }

    /** Attache une photo de profil fictive (chemin relatif). */
    public function withAvatar(): static
    {
        return $this->state(fn() => ['avatar' => 'avatar/demo-' . fake()->numberBetween(1, 8) . '.png']);
    }
}
