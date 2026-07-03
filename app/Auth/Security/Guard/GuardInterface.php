<?php

declare(strict_types=1);

namespace App\Auth\Security\Guard;

use App\Auth\Security\RoleEnum;
use Illuminate\Http\Request;

interface GuardInterface
{
    /** Le mode/rôle géré par ce guard. */
    public function role(): RoleEnum;

    /** Vérifie les critères d'entrée (identité, rôle, session valide, non expirée). */
    public function check(Request $request): bool;

    /**
     * Ouvre la session/contexte d'authentification après validation des identifiants.
     *
     * @param array<string, mixed> $credentials
     */
    public function authenticate(array $credentials): AuthResult;

    /** Durée de vie de la session pour ce mode (null = pas de limite spécifique), en minutes. */
    public function sessionLifetime(): ?int;

    /** Termine la session (logout). */
    public function logout(Request $request): void;
}
