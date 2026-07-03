<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

enum EmploymentContractEnum: string
{
    case CDI = 'cdi';
    case STAGE = 'stage';
    case INTERIM = 'interim';
    case CDD = 'cdd';
    case AUTRE = 'autre';

    public function label(): string
    {
        return match ($this) {
            self::CDI => 'CDI',
            self::STAGE => 'Stage',
            self::INTERIM => 'Intérim',
            self::CDD => 'CDD',
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
