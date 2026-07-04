<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'code',
    'logo',
    'is_active',
    'api_endpoint',
    'monthly_quota',
    'min_loan_amount',
    'max_loan_amount',
    'support_email',
    'processing_time_hours',
])]
class Partner extends Model
{
    /** @use HasFactory<\Database\Factories\PartnerFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'monthly_quota' => 'integer',
            'processing_time_hours' => 'integer',
            'min_loan_amount' => 'decimal:2',
            'max_loan_amount' => 'decimal:2',
        ];
    }

    /**
     * Offres émises par ce partenaire.
     */
    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class);
    }
}
