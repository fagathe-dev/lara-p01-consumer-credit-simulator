<?php

namespace App\Models;

use App\Auth\UserRequest\UserRequestTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserRequest extends Model
{
    use HasFactory;

    /**
     * Les attributs qui peuvent être assignés en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'token',
        'content',
        'is_used',
        'expires_at',
    ];

    /**
     * Les attributs qui doivent être castés (convertis).
     *
     * @return array<string, string>
     */
    protected $casts = [
        'content' => 'array', // Transforme automatiquement le JSON de la DB en tableau PHP
        'is_used' => 'boolean',
        'expires_at' => 'datetime',
        'type' => UserRequestTypeEnum::class, // Cast le type en enum UserRequestTypeEnum
    ];

    /**
     * Récupère l'utilisateur associé à cette requête.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}