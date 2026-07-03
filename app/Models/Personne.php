<?php

declare(strict_types=1);

namespace App\Models;

use Core\Simulator\Enum\BirthCountryEnum;
use Core\Simulator\Enum\CivilityEnum;
use Core\Simulator\Enum\EmploymentContractEnum;
use Core\Simulator\Enum\NationalityEnum;
use Core\Simulator\Enum\PersonRoleEnum;
use Core\Simulator\Enum\ProfessionalJobEnum;
use Core\Simulator\Enum\ProfessionalSectorEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'dossier_id',
    'role',
    'civility',
    'last_name',
    'maiden_name',
    'first_name',
    'birth_date',
    'birth_country',
    'nationality',
    'professional_sector',
    'professional_job',
    'employment_contract',
    'probation_period_ended',
    'professional_situation_date',
    'phone',
    'email',
    'consent_data_usage',
    'consent_canvassing',
    'consent_advertising',
])]
class Personne extends Model
{
    /** @use HasFactory */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'role' => PersonRoleEnum::class,
            'civility' => CivilityEnum::class,
            'birth_date' => 'date',
            'birth_country' => BirthCountryEnum::class,
            'nationality' => NationalityEnum::class,
            'professional_sector' => ProfessionalSectorEnum::class,
            'professional_job' => ProfessionalJobEnum::class,
            'employment_contract' => EmploymentContractEnum::class,
            'probation_period_ended' => 'boolean',
            'consent_data_usage' => 'boolean',
            'consent_canvassing' => 'boolean',
            'consent_advertising' => 'boolean',
        ];
    }

    /**
     * Relation : le dossier auquel appartient cette personne
     */
    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }
}
