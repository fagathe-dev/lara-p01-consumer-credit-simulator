<?php

declare(strict_types=1);

namespace App\Models;

use Core\Simulator\Enum\ApplicationActionTypeEnum;
use Core\Simulator\Enum\InitiatorTypeEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Historique des actions sur un dossier.
 * initiator_ref est NULL pour CLIENT_RESTREINT (sans compte) et PROCESSOR (API Python).
 */
#[Fillable([
    'dossier_ref',
    'initiator_type',
    'initiator_ref',
    'action',
    'context',
    'timestamp',
])]
class DossierLog extends Model
{
    protected $table = 'dossiers_logs';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'initiator_type' => InitiatorTypeEnum::class,
            'action' => ApplicationActionTypeEnum::class,
            'context' => 'array',
            'timestamp' => 'datetime',
        ];
    }

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class, 'dossier_ref', 'ref');
    }

    /**
     * L'utilisateur initiateur (uniquement CLIENT / AGENT ; NULL sinon).
     */
    public function initiator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'initiator_ref', 'ref');
    }
}
