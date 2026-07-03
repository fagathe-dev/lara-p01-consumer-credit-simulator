<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

enum PersonRoleEnum: string
{
    case BORROWER = 'emprunteur';
    case COBORROWER = 'co_emprunteur';

    public function label(): string
    {
        return match ($this) {
            self::BORROWER => 'Emprunteur',
            self::COBORROWER => 'Co-emprunteur',
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
