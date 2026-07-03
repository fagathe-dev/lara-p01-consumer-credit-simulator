<?php

declare(strict_types=1);

namespace App\Auth\Security;

/**
 * Rôles applicatifs.
 *
 * Hiérarchie CRM (croissante) : ROLE_CRM_AGENT < ROLE_CRM_MANAGER < ROLE_CRM_ADMIN.
 * Les rôles client (restreint / avec compte) ne participent pas à la hiérarchie CRM.
 */
enum RoleEnum: string
{
    case ROLE_CLIENT_RESTREINT = 'ROLE_CLIENT_RESTREINT';
    case ROLE_CLIENT = 'ROLE_CLIENT';
    case ROLE_CRM_AGENT = 'ROLE_CRM_AGENT';
    case ROLE_CRM_MANAGER = 'ROLE_CRM_MANAGER';
    case ROLE_CRM_ADMIN = 'ROLE_CRM_ADMIN';

    public function label(): string
    {
        return match ($this) {
            self::ROLE_CLIENT_RESTREINT => 'Client (accès restreint)',
            self::ROLE_CLIENT => 'Client',
            self::ROLE_CRM_AGENT => 'Agent CRM',
            self::ROLE_CRM_MANAGER => 'Manager CRM',
            self::ROLE_CRM_ADMIN => 'Administrateur CRM',
        };
    }

    /**
     * Niveau hiérarchique. Sert à comparer les rôles CRM entre eux.
     * Les rôles client restent bas et distincts.
     */
    public function level(): int
    {
        return match ($this) {
            self::ROLE_CLIENT_RESTREINT => 0,
            self::ROLE_CLIENT => 1,
            self::ROLE_CRM_AGENT => 10,
            self::ROLE_CRM_MANAGER => 20,
            self::ROLE_CRM_ADMIN => 30,
        };
    }

    /**
     * Vrai si le rôle courant couvre (est au moins équivalent à) le rôle demandé.
     * Utile pour "au moins ce niveau" côté CRM.
     */
    public function includes(RoleEnum $role): bool
    {
        return $this->level() >= $role->level();
    }

    public function isCrm(): bool
    {
        return in_array($this, [
            self::ROLE_CRM_AGENT,
            self::ROLE_CRM_MANAGER,
            self::ROLE_CRM_ADMIN,
        ], true);
    }

    public function isClient(): bool
    {
        return in_array($this, [
            self::ROLE_CLIENT_RESTREINT,
            self::ROLE_CLIENT,
        ], true);
    }

    /**
     * @return array<string, string>
     */
    public static function choices(): array
    {
        return array_reduce(
            self::cases(),
            fn($carry, $enum) => [...$carry, $enum->label() => $enum->value],
            []
        );
    }

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(fn($e) => $e->value, self::cases());
    }
}
