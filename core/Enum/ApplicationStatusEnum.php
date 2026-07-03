<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

enum ApplicationStatusEnum: string
{
    case NEW = 'new';
    case IN_PROGRESS = 'in_progress';
    case ACCEPTE = 'accepte';
    case REFUSED = 'refused';

    public function label(): string
    {
        return match ($this) {
            self::NEW => 'Nouveau',
            self::IN_PROGRESS => 'En cours',
            self::ACCEPTE => 'Accepté',
            self::REFUSED => 'Refusé',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::NEW => '#9CA3AF',        // Gris
            self::IN_PROGRESS => '#3B82F6', // Bleu
            self::ACCEPTE => '#10B981',     // Vert
            self::REFUSED => '#EF4444',     // Rouge
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
