<?php

declare(strict_types=1);

namespace App\Models;

use Core\Simulator\Enum\ApplicationStatusEnum;
use Core\Simulator\Enum\FamilySituationEnum;
use Core\Simulator\Enum\HousingStatusEnum;
use Core\Simulator\Enum\ProjectTypeEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'project_type',
    'project_amount',
    'project_duration',
    'status',
    'family_situation',
    'family_situation_year',
    'has_coborrower',
    'housing_status',
    'housing_status_year',
    'income_net_monthly',
    'income_rental',
    'income_allowance',
    'income_other',
    'charge_housing',
    'charge_mortgage_remaining',
    'housing_property_value',
    'has_active_consumer_credit',
    'charge_consumer_credit_monthly',
    'charge_consumer_credit_remaining',
    'charge_other',
])]
class Dossier extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'project_type' => ProjectTypeEnum::class,
            'status' => ApplicationStatusEnum::class,
            'family_situation' => FamilySituationEnum::class,
            'housing_status' => HousingStatusEnum::class,
            'project_amount' => 'decimal:2',
            'income_net_monthly' => 'decimal:2',
            'income_rental' => 'decimal:2',
            'income_allowance' => 'decimal:2',
            'income_other' => 'decimal:2',
            'charge_housing' => 'decimal:2',
            'charge_mortgage_remaining' => 'decimal:2',
            'housing_property_value' => 'decimal:2',
            'charge_consumer_credit_monthly' => 'decimal:2',
            'charge_consumer_credit_remaining' => 'decimal:2',
            'charge_other' => 'decimal:2',
            'has_coborrower' => 'boolean',
            'has_active_consumer_credit' => 'boolean',
        ];
    }

    /**
     * Relation : tous les personnes liées à ce dossier
     */
    public function personnes(): HasMany
    {
        return $this->hasMany(Personne::class);
    }

    /**
     * Relation pratique : l'emprunteur principal
     */
    public function emprunteur(): HasOne
    {
        return $this->hasOne(Personne::class)->where('role', 'emprunteur');
    }

    /**
     * Relation pratique : le co-emprunteur (le cas échéant)
     */
    public function coEmprunteur(): HasOne
    {
        return $this->hasOne(Personne::class)->where('role', 'co_emprunteur');
    }
}
