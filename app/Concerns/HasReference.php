<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Auth\Security\RoleEnum;
use Illuminate\Support\Str;

/**
 * Génération centralisée des identifiants publics `ref` (et `agent_id` pour les
 * comptes CRM) branchée sur l'événement Eloquent `creating`.
 *
 * Format `ref` : {PREFIX}-{Ymd}-{ULID}
 *   - Dossier          → préfixe DOSS
 *   - User (client)    → préfixe CLT
 *   - User (agent CRM) → préfixe AGT
 *
 * `agent_id` (matricule) : AGT-{6 chiffres}, uniquement pour les rôles ROLE_CRM_*.
 *
 * Un modèle utilisant ce trait peut définir `protected string $referencePrefix`
 * pour forcer un préfixe. À défaut :
 *   - le modèle User calcule le préfixe selon son rôle (CLT/AGT),
 *   - les autres modèles utilisent DOSS par défaut (surchargeable).
 *
 * @mixin \Illuminate\Database\Eloquent\Model
 *
 * @method static void creating(\Closure|string|array $callback)
 */
trait HasReference
{
    public static function bootHasReference(): void
    {
        static::creating(function ($model): void {
            if (empty($model->ref)) {
                $model->ref = $model->generateReference();
            }

            // Matricule agent : uniquement pour les comptes CRM disposant d'une colonne agent_id.
            if (
                $model->hasAgentIdColumn()
                && empty($model->agent_id)
                && $model->shouldHaveAgentId()
            ) {
                $model->agent_id = $model->generateAgentId();
            }
        });
    }

    public function generateReference(): string
    {
        return sprintf(
            '%s-%s-%s',
            $this->referencePrefix(),
            now()->format('Ymd'),
            (string) Str::ulid()
        );
    }

    /**
     * Préfixe de référence selon le contexte du modèle.
     */
    protected function referencePrefix(): string
    {
        if (property_exists($this, 'referencePrefix') && !empty($this->referencePrefix)) {
            return $this->referencePrefix;
        }

        // Cas particulier du modèle User : préfixe selon le rôle.
        $rawRole = $this->getAttribute('role');
        if ($rawRole !== null) {
            $role = $rawRole instanceof RoleEnum ? $rawRole : RoleEnum::tryFrom((string) $rawRole);

            if ($role instanceof RoleEnum) {
                return $role->isCrm() ? 'AGT' : 'CLT';
            }
        }

        return 'DOSS';
    }

    protected function shouldHaveAgentId(): bool
    {
        $rawRole = $this->getAttribute('role');

        if ($rawRole === null) {
            return false;
        }

        $role = $rawRole instanceof RoleEnum ? $rawRole : RoleEnum::tryFrom((string) $rawRole);

        return $role instanceof RoleEnum && $role->isCrm();
    }

    protected function generateAgentId(): string
    {
        return 'AGT-' . str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    protected function hasAgentIdColumn(): bool
    {
        return in_array('agent_id', $this->getFillable(), true)
            || array_key_exists('agent_id', $this->getAttributes());
    }

    /**
     * La `ref` est l'identifiant public utilisé dans les URLs (route model binding).
     */
    public function getRouteKeyName(): string
    {
        return 'ref';
    }
}
