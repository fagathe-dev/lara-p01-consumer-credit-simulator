<?php

declare(strict_types=1);

namespace App\Models;

use Core\Simulator\Enum\OfferStatusEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'internal_reference',
    'partner_reference',
    'offer_code',
    'partner_id',
    'application_id',
    'project_amount',
    'project_cost',
    'duration',
    'monthly_payment',
    'nominal_rate',
    'apr',
    'total_credit_cost',
    'total_amount_owed',
    'processing_fees',
    'insurance_monthly_premium',
    'insurance_apr',
    'status',
    'expires_at',
])]
class Offer extends Model
{
    /** @use HasFactory<\Database\Factories\OfferFactory> */
    use HasFactory;

    /**
     * Les attributs qui doivent être castés.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OfferStatusEnum::class,
            'expires_at' => 'datetime',
            'project_amount' => 'decimal:2',
            'project_cost' => 'decimal:2',
            'monthly_payment' => 'decimal:2',
            'nominal_rate' => 'decimal:2',
            'apr' => 'decimal:2',
            'total_credit_cost' => 'decimal:2',
            'total_amount_owed' => 'decimal:2',
            'processing_fees' => 'decimal:2',
            'insurance_monthly_premium' => 'decimal:2',
            'insurance_apr' => 'decimal:2',
            'duration' => 'integer',
        ];
    }

    /**
     * Partenaire émetteur de l'offre.
     */
    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }

    /**
     * Dossier auquel l'offre est rattachée (offers.application_id → dossiers.id).
     */
    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class, 'application_id');
    }
}
