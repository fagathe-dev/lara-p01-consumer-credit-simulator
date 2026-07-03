<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

enum HousingStatusEnum: string
{
    case FONCTION = 'fonction';
    case PROPRIETAIRE = 'proprietaire';
    case HEBERGE = 'heberge';
    case LOCATAIRE = 'locataire';

    public function label(): string
    {
        return match ($this) {
            self::FONCTION => 'Logement de fonction',
            self::PROPRIETAIRE => 'Propriétaire',
            self::HEBERGE => 'Hébergé',
            self::LOCATAIRE => 'Locataire',
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
