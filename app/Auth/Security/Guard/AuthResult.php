<?php

declare(strict_types=1);

namespace App\Auth\Security\Guard;

use App\Auth\Security\RoleEnum;
use App\Models\User;

/**
 * Résultat d'une tentative d'authentification renvoyé par un guard.
 *
 * Trois états possibles :
 *  - succès complet         : success = true
 *  - échec                  : success = false, message renseigné
 *  - premier facteur validé : requiresCode = true (attente d'un code OTP / 2FA)
 */
final class AuthResult
{
    /**
     * @param array<string, mixed> $context
     */
    private function __construct(
        public readonly bool $success,
        public readonly RoleEnum $role,
        public readonly ?User $user = null,
        public readonly ?string $dossierRef = null,
        public readonly ?string $message = null,
        public readonly bool $requiresCode = false,
        public readonly array $context = [],
    ) {
    }

    /**
     * @param array<string, mixed> $context
     */
    public static function success(
        RoleEnum $role,
        ?User $user = null,
        ?string $dossierRef = null,
        array $context = [],
    ): self {
        return new self(
            success: true,
            role: $role,
            user: $user,
            dossierRef: $dossierRef,
            context: $context,
        );
    }

    public static function failure(RoleEnum $role, string $message): self
    {
        return new self(success: false, role: $role, message: $message);
    }

    /**
     * Premier facteur validé, un code de connexion vient d'être envoyé.
     */
    public static function requiresCode(RoleEnum $role, string $message = 'Un code de connexion a été envoyé.'): self
    {
        return new self(success: false, role: $role, message: $message, requiresCode: true);
    }
}
