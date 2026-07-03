<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

enum FamilySituationEnum: string
{
    case CELIBATAIRE = 'celibataire';
    case MARIE = 'marie';
    case PACS = 'pacs';
    case DIVORCE_VEUF = 'divorce_veuf';

    public function label(): string
    {
        return match ($this) {
            self::CELIBATAIRE => 'Célibataire',
            self::MARIE => 'Marié(e)',
            self::PACS => 'PACS',
            self::DIVORCE_VEUF => 'Divorcé(e) / Veuf(ve)',
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
