<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Session extends Model
{
    /**
     * Indique que la clé primaire n'est pas un entier auto-incrémenté.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Le type de la clé primaire.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Désactive les timestamps (Laravel les gère différemment pour cette table).
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Les attributs qui ne sont pas assignables en masse.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    /**
     * Récupère l'utilisateur associé à cette session.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}