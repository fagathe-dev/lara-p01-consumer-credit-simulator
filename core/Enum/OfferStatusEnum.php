<?php

namespace Core\Simulator\Enum;

enum OfferStatusEnum: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case EXPIRED = 'expired';
    case FINANCED = 'financed';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'En attente',
            self::APPROVED => 'Acceptée',
            self::REJECTED => 'Refusée',
            self::EXPIRED => 'Expirée',
            self::FINANCED => 'Financée',
        };
    }

    /**
     * Type de statut UI (mapping vers le Badge du design system).
     */
    public function badgeStatus(): string
    {
        return match ($this) {
            self::PENDING => 'warning',
            self::APPROVED => 'success',
            self::FINANCED => 'success',
            self::REJECTED => 'danger',
            self::EXPIRED => 'info',
        };
    }

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(fn($e) => $e->value, self::cases());
    }
}