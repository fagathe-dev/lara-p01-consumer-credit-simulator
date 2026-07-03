<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

/**
 * Canal d'origine d'un dossier.
 * WEB : tunnel public client. CRM : tunnel light créé par un agent.
 */
enum CanalEnum: string
{
    case WEB = 'WEB';
    case CRM = 'CRM';

    public function label(): string
    {
        return match ($this) {
            self::WEB => 'Site web (client)',
            self::CRM => 'CRM (agent)',
        };
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
