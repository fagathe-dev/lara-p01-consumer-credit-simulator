<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

enum ProjectTypeEnum: string
{
    case AUTO_MOTO = 'auto_moto';
    case REGROUPEMENT_CREDITS = 'regroupement_credits';
    case TRAVAUX = 'travaux';
    case AUTRE = 'autre';
    case FAMILLE_LOISIR = 'famille_loisir';

    public function label(): string
    {
        return match ($this) {
            self::AUTO_MOTO => 'Auto/Moto',
            self::REGROUPEMENT_CREDITS => 'Regroupement de crédits',
            self::TRAVAUX => 'Travaux',
            self::AUTRE => 'Autre',
            self::FAMILLE_LOISIR => 'Famille/Loisir',
        };
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
