<?php

declare(strict_types=1);

namespace App\Auth\Security\Guard;

use App\Auth\Security\RoleEnum;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\Request;
use InvalidArgumentException;

/**
 * Dispatch centralisé et extensible des guards.
 *
 * Ajouter un mode = ajouter un guard concret + l'enregistrer ici (ou via register()).
 * Aucun `switch` éparpillé : la résolution passe par le registre + le container.
 */
final class GuardManager
{
    public const MODE_RESTREINT = 'restreint';
    public const MODE_CLIENT = 'client';
    public const MODE_CRM = 'crm';

    /**
     * @var array<string, class-string<GuardInterface>>
     */
    private array $registry = [
        self::MODE_RESTREINT => EspaceClientRestreintGuard::class,
        self::MODE_CLIENT => EspaceClientGuard::class,
        self::MODE_CRM => CrmGuard::class,
    ];

    public function __construct(private readonly Container $container)
    {
    }

    /**
     * Enregistre (ou remplace) un mode.
     *
     * @param class-string<GuardInterface> $guardClass
     */
    public function register(string $mode, string $guardClass): void
    {
        $this->registry[$mode] = $guardClass;
    }

    /**
     * Résout le guard concret pour un mode donné.
     */
    public function for(string $mode): GuardInterface
    {
        if (!isset($this->registry[$mode])) {
            throw new InvalidArgumentException("Mode d'authentification inconnu : {$mode}.");
        }

        return $this->container->make($this->registry[$mode]);
    }

    /**
     * Résout le guard adéquat pour un rôle attendu.
     */
    public function forRole(RoleEnum $role): GuardInterface
    {
        return $this->for($this->modeForRole($role));
    }

    /**
     * Déduit le mode à partir de la requête (préfixe de route).
     * /crm|/bo → CRM ; /espace(-client) → CLIENT ; /suivi|restreint → RESTREINT.
     */
    public function forRequest(Request $request): GuardInterface
    {
        $path = $request->path();

        return match (true) {
            str_starts_with($path, 'crm') || str_starts_with($path, 'bo') => $this->for(self::MODE_CRM),
            str_contains($path, 'restreint') || str_starts_with($path, 'suivi') => $this->for(self::MODE_RESTREINT),
            default => $this->for(self::MODE_CLIENT),
        };
    }

    private function modeForRole(RoleEnum $role): string
    {
        return match (true) {
            $role === RoleEnum::ROLE_CLIENT_RESTREINT => self::MODE_RESTREINT,
            $role === RoleEnum::ROLE_CLIENT => self::MODE_CLIENT,
            $role->isCrm() => self::MODE_CRM,
        };
    }
}
