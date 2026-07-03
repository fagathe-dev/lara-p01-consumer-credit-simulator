<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Auth\Security\Guard\AbstractGuard;
use App\Auth\Security\Guard\GuardManager;
use App\Auth\Security\RoleEnum;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\Response;

/**
 * Applique l'expiration de session du mode « client restreint » (30 min).
 *
 * L'expiration vit dans le payload de session (`auth.context.started_at`) ;
 * ce middleware l'applique à chaque requête et invalide la session au-delà de
 * la durée fournie par le guard (sessionLifetime()). Les autres modes
 * (client / CRM) ne sont pas affectés : on s'appuie sur config/session.php.
 */
final class EnsureRestrictedSessionNotExpired
{
    public function __construct(private readonly GuardManager $guards)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $context = $request->session()->get(AbstractGuard::SESSION_KEY);

        if (!is_array($context) || ($context['role'] ?? null) !== RoleEnum::ROLE_CLIENT_RESTREINT->value) {
            return $next($request);
        }

        $guard = $this->guards->for(GuardManager::MODE_RESTREINT);
        $lifetime = $guard->sessionLifetime();
        $startedAt = $context['started_at'] ?? null;

        $expired = $lifetime !== null
            && (!is_int($startedAt)
                || Carbon::createFromTimestamp($startedAt)->addMinutes($lifetime)->isPast());

        if ($expired) {
            $guard->logout($request);
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('status', 'Votre session a expiré, veuillez vous reconnecter.');
        }

        return $next($request);
    }
}
