<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

enum CivilityEnum: string
{
    case M = 'm';
    case MME = 'mme';
    case AUTRE = 'autre';

    public function label(): string
    {
        return match ($this) {
            self::M => 'M.',
            self::MME => 'Mme',
            self::AUTRE => 'Autre',
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
