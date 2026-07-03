<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

enum NationalityEnum: string
{
    case FRANCE = 'france';
    case UE = 'ue';
    case HORS_UE = 'hors_ue';

    public function label(): string
    {
        return match ($this) {
            self::FRANCE => 'France',
            self::UE => 'Union Européenne',
            self::HORS_UE => 'Hors UE',
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
