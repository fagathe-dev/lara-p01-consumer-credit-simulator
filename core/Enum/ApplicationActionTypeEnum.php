<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

/**
 * Actions loguées dans dossiers_logs. Liste extensible.
 */
enum ApplicationActionTypeEnum: string
{
    case DOSSIER_CREATED = 'DOSSIER_CREATED';
    case DOSSIER_VIEWED = 'DOSSIER_VIEWED';
    case STATUS_CHANGED = 'STATUS_CHANGED';
    case ASSIGNED_TO_AGENT = 'ASSIGNED_TO_AGENT';
    case SCORING_RECEIVED = 'SCORING_RECEIVED';
    case OFFER_GENERATED = 'OFFER_GENERATED';
    case NOTE_ADDED = 'NOTE_ADDED';
    case LOGIN_RESTREINT = 'LOGIN_RESTREINT';
    case LOGIN_CLIENT = 'LOGIN_CLIENT';
    case LOGIN_AGENT = 'LOGIN_AGENT';

    public function label(): string
    {
        return match ($this) {
            self::DOSSIER_CREATED => 'Dossier créé',
            self::DOSSIER_VIEWED => 'Dossier consulté',
            self::STATUS_CHANGED => 'Statut modifié',
            self::ASSIGNED_TO_AGENT => 'Assigné à un agent',
            self::SCORING_RECEIVED => 'Scoring reçu',
            self::OFFER_GENERATED => 'Offre générée',
            self::NOTE_ADDED => 'Note ajoutée',
            self::LOGIN_RESTREINT => 'Connexion (accès restreint)',
            self::LOGIN_CLIENT => 'Connexion client',
            self::LOGIN_AGENT => 'Connexion agent',
        };
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
