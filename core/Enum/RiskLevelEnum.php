<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

/**
 * Échelle de risque renvoyée par l'API Python (scoring).
 *
 * Choix retenu (documenté) : notation A→E (cf. docs/features.md « note de A à E »),
 * de A (meilleur profil) à E (risque le plus élevé).
 */
enum RiskLevelEnum: string
{
    case A = 'A';
    case B = 'B';
    case C = 'C';
    case D = 'D';
    case E = 'E';

    public function label(): string
    {
        return match ($this) {
            self::A => 'A — Risque très faible',
            self::B => 'B — Risque faible',
            self::C => 'C — Risque modéré',
            self::D => 'D — Risque élevé',
            self::E => 'E — Risque très élevé',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::A => '#10B981', // Vert
            self::B => '#34D399', // Vert clair
            self::C => '#F59E0B', // Orange
            self::D => '#F97316', // Orange foncé
            self::E => '#EF4444', // Rouge
        };
    }

    /**
     * Considéré comme « risque élevé » (étude manuelle manager).
     */
    public function isHigh(): bool
    {
        return in_array($this, [self::D, self::E], true);
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
