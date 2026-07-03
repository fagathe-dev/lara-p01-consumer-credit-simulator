<?php

declare(strict_types=1);

namespace App\Auth\Security\Guard;

use App\Models\DossierLog;
use App\Models\DossierProvenance;
use Core\Simulator\Enum\ApplicationActionTypeEnum;
use Core\Simulator\Enum\InitiatorTypeEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

/**
 * Base commune des guards : accès au contexte de session, écriture de logs
 * (dossiers_logs), traçabilité de provenance (dossiers_provenance) et gestion
 * d'expiration adossée au mécanisme natif de session Laravel.
 *
 * Le contexte d'authentification est stocké dans la session sous SESSION_KEY :
 *   ['role' => string, 'dossier_ref' => ?string, 'email' => ?string,
 *    'user_ref' => ?string, 'started_at' => int (timestamp)]
 */
abstract class AbstractGuard implements GuardInterface
{
    /** Clé du contexte d'authentification en session. */
    public const SESSION_KEY = 'auth.context';

    public function sessionLifetime(): ?int
    {
        return null;
    }

    public function check(Request $request): bool
    {
        $context = $this->context($request);

        if ($context === null) {
            return false;
        }

        if (($context['role'] ?? null) !== $this->role()->value) {
            return false;
        }

        return !$this->isExpired($context);
    }

    public function logout(Request $request): void
    {
        $request->session()->forget(self::SESSION_KEY);
    }

    /**
     * Récupère le contexte d'authentification stocké en session.
     *
     * @return array<string, mixed>|null
     */
    protected function context(Request $request): ?array
    {
        $context = $request->session()->get(self::SESSION_KEY);

        return is_array($context) ? $context : null;
    }

    /**
     * Ouvre le contexte d'authentification en session.
     *
     * @param array<string, mixed> $extra
     */
    protected function openContext(?string $dossierRef = null, ?string $email = null, ?string $userRef = null, array $extra = []): void
    {
        session()->put(self::SESSION_KEY, array_merge([
            'role' => $this->role()->value,
            'dossier_ref' => $dossierRef,
            'email' => $email,
            'user_ref' => $userRef,
            'started_at' => now()->timestamp,
        ], $extra));
    }

    /**
     * Applique la règle d'expiration adossée à sessionLifetime().
     *
     * @param array<string, mixed> $context
     */
    protected function isExpired(array $context): bool
    {
        $lifetime = $this->sessionLifetime();

        if ($lifetime === null) {
            return false;
        }

        $startedAt = $context['started_at'] ?? null;

        if (!is_int($startedAt)) {
            return true;
        }

        return Carbon::createFromTimestamp($startedAt)->addMinutes($lifetime)->isPast();
    }

    /**
     * Enregistre une ligne de provenance (IP / device) pour un dossier.
     */
    protected function recordProvenance(string $dossierRef, Request $request): void
    {
        DossierProvenance::create([
            'dossier_ref' => $dossierRef,
            'ip' => $request->ip(),
            'device' => $request->userAgent(),
            'timestamp' => now(),
        ]);
    }

    /**
     * Écrit une action dans l'historique du dossier.
     *
     * @param array<string, mixed>|null $context
     */
    protected function log(
        string $dossierRef,
        ApplicationActionTypeEnum $action,
        InitiatorTypeEnum $initiatorType,
        ?string $initiatorRef = null,
        ?array $context = null,
    ): void {
        DossierLog::create([
            'dossier_ref' => $dossierRef,
            'initiator_type' => $initiatorType,
            'initiator_ref' => $initiatorRef,
            'action' => $action,
            'context' => $context,
            'timestamp' => now(),
        ]);
    }
}
