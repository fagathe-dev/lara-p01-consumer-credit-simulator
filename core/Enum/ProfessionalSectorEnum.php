<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

enum ProfessionalSectorEnum: int
{
    case PRIVE = 10;
    case PUBLIC = 20;
    case AGRICOLE = 30;
    case INDEPENDANT = 40;
    case RETRAITE = 50;
    case ETUDIANT = 60;
    case CHOMEUR = 70;
    case INACTIF = 80;

    public function label(): string
    {
        return match ($this) {
            self::PRIVE => 'Privé',
            self::PUBLIC => 'Public',
            self::AGRICOLE => 'Agricole',
            self::INDEPENDANT => 'Indépendant/Libéral',
            self::RETRAITE => 'Retraité',
            self::ETUDIANT => 'Étudiant',
            self::CHOMEUR => 'Chômeur',
            self::INACTIF => 'Inactif',
        };
    }

    /**
     * Retourne les professions disponibles pour ce secteur
     */
    public function professions(): array
    {
        return array_filter(
            ProfessionalJobEnum::cases(),
            fn(ProfessionalJobEnum $job) => $job->sector() === $this
        );
    }

    public static function choices(): array
    {
        return array_reduce(
            self::cases(),
            fn($carry, $enum) => [...$carry, $enum->label() => $enum->value],
            []
        );
    }

    public static function values(): array
    {
        return array_map(fn($e) => $e->value, self::cases());
    }
}
