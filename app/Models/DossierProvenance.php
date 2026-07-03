<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Provenance d'un accès au dossier (1-to-N) : trace IP / device dans le temps.
 */
#[Fillable(['dossier_ref', 'ip', 'device', 'timestamp'])]
class DossierProvenance extends Model
{
    protected $table = 'dossiers_provenance';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'timestamp' => 'datetime',
        ];
    }

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class, 'dossier_ref', 'ref');
    }
}
