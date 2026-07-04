<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Auth\Security\RoleEnum;
use App\Concerns\HasReference;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

#[Fillable(['first_name', 'last_name', 'email', 'password', 'role', 'ref', 'agent_id', 'avatar'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasReference, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => RoleEnum::class,
        ];
    }

    /**
     * Dossiers dont l'utilisateur est le client propriétaire (user_id).
     */
    public function dossiers(): HasMany
    {
        return $this->hasMany(Dossier::class);
    }

    /**
     * Dossiers pris en charge par l'agent (dossiers.agent_assignee_id → users.agent_id).
     */
    public function dossiersAssignes(): HasMany
    {
        return $this->hasMany(Dossier::class, 'agent_assignee_id', 'agent_id');
    }

    /**
     * Dossiers créés par l'agent via le tunnel light CRM.
     */
    public function dossiersCrees(): HasMany
    {
        return $this->hasMany(Dossier::class, 'agent_application_creator_id', 'agent_id');
    }

    /**
     * Nom complet affichable.
     */
    protected function fullName(): Attribute
    {
        return Attribute::get(fn(): string => trim(($this->first_name ?? '') . ' ' . ($this->last_name ?? '')));
    }

    /**
     * URL publique de l'avatar (ou null si aucune photo).
     */
    protected function avatarUrl(): Attribute
    {
        return Attribute::get(
            fn(): ?string => $this->avatar ? Storage::disk('public')->url($this->avatar) : null,
        );
    }
}
