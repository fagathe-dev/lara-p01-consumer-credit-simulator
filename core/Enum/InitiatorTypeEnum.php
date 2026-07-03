<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

/**
 * Type d'initiateur d'une action loguée sur un dossier (dossiers_logs).
 *
 * - CLIENT / AGENT           : possèdent une row users → initiator_ref renseigné.
 * - CLIENT_RESTREINT         : pas de compte (session seule) → initiator_ref NULL.
 * - PROCESSOR                : action système / API Python  → initiator_ref NULL.
 */
enum InitiatorTypeEnum: string
{
    case CLIENT = 'CLIENT';
    case AGENT = 'AGENT';
    case PROCESSOR = 'PROCESSOR';
    case CLIENT_RESTREINT = 'CLIENT_RESTREINT';

    public function label(): string
    {
        return match ($this) {
            self::CLIENT => 'Client',
            self::AGENT => 'Agent CRM',
            self::PROCESSOR => 'Traitement automatique',
            self::CLIENT_RESTREINT => 'Client (accès restreint)',
        };
    }

    /**
     * Indique si ce type d'initiateur possède une référence utilisateur (users.ref).
     */
    public function hasUserRef(): bool
    {
        return in_array($this, [self::CLIENT, self::AGENT], true);
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
