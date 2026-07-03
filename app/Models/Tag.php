<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'color'])]
class Tag extends Model
{
    /**
     * Dossiers étiquetés par ce tag (pivot dossier_tag sur dossiers.ref).
     */
    public function dossiers(): BelongsToMany
    {
        return $this->belongsToMany(Dossier::class, 'dossier_tag', 'tag_id', 'dossier_ref', 'id', 'ref')
            ->withTimestamps();
    }
}
