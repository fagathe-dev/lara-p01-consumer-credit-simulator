<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\HasReference;
use Core\Simulator\Enum\ApplicationStatusEnum;
use Core\Simulator\Enum\CanalEnum;
use Core\Simulator\Enum\FamilySituationEnum;
use Core\Simulator\Enum\HousingStatusEnum;
use Core\Simulator\Enum\ProjectTypeEnum;
use Core\Simulator\Enum\RiskLevelEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'ref',
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
    'user_id',
    'agent_assignee_id',
    'agent_application_creator_id',
    'canal',
    'risk_level',
    'scoring',
])]
class Dossier extends Model
{
    /** @use HasFactory */
    use HasFactory, HasReference;

    /**
     * Préfixe de la référence publique (route model binding sur `ref`).
     */
    protected string $referencePrefix = 'DOSS';

    protected function casts(): array
    {
        return [
            'project_type' => ProjectTypeEnum::class,
            'status' => ApplicationStatusEnum::class,
            'family_situation' => FamilySituationEnum::class,
            'housing_status' => HousingStatusEnum::class,
            'canal' => CanalEnum::class,
            'risk_level' => RiskLevelEnum::class,
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
            'scoring' => 'integer',
        ];
    }

    /**
     * Relation : le client propriétaire du dossier (user_id).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation : l'agent en charge du dossier (agent_assignee_id → users.agent_id).
     */
    public function agentAssignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_assignee_id', 'agent_id');
    }

    /**
     * Relation : l'agent ayant créé le dossier via le tunnel light CRM.
     */
    public function agentCreateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_application_creator_id', 'agent_id');
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

    /**
     * Historique des accès (IP / device).
     */
    public function provenances(): HasMany
    {
        return $this->hasMany(DossierProvenance::class, 'dossier_ref', 'ref');
    }

    /**
     * Historique des actions loguées.
     */
    public function logs(): HasMany
    {
        return $this->hasMany(DossierLog::class, 'dossier_ref', 'ref');
    }

    /**
     * Tags CRM associés (pivot dossier_tag sur dossiers.ref).
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'dossier_tag', 'dossier_ref', 'tag_id', 'ref')
            ->withTimestamps();
    }
}
