<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Auth\Security\Guard\AbstractGuard;
use App\Auth\Security\Guard\GuardManager;
use App\Auth\Security\RoleEnum;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Point d'entrée des zones protégées.
 *
 * Lit le contexte d'authentification maison (AbstractGuard::SESSION_KEY),
 * délègue la validation de session au guard adéquat (GuardManager) et vérifie
 * que le rôle courant fait partie des rôles autorisés pour la zone.
 *
 * En cas d'échec, redirige vers le login correspondant à la zone (déduit des
 * rôles attendus), jamais vers un login générique.
 *
 * Usage : `->middleware('guard.access:ROLE_CLIENT,ROLE_CLIENT_RESTREINT')`.
 */
final class EnsureGuardAccess
{
    public function __construct(private readonly GuardManager $guards)
    {
    }

    /**
     * @param string ...$allowedRoles Valeurs de RoleEnum autorisées pour la zone.
     */
    public function handle(Request $request, Closure $next, string ...$allowedRoles): Response
    {
        $context = $request->session()->get(AbstractGuard::SESSION_KEY);
        $loginRoute = $this->loginRouteForRoles($allowedRoles);

        if (!is_array($context) || !isset($context['role'])) {
            return redirect()->route($loginRoute);
        }

        $role = RoleEnum::tryFrom((string) $context['role']);

        if (!$role instanceof RoleEnum) {
            return redirect()->route($loginRoute);
        }

        if (!$this->guards->forRole($role)->check($request)) {
            return redirect()->route($loginRoute);
        }

        if (!in_array($role->value, $allowedRoles, true)) {
            abort(403);
        }

        return $next($request);
    }

    /**
     * Déduit la route de login à partir des rôles attendus par la zone.
     *
     * @param array<int, string> $allowedRoles
     */
    private function loginRouteForRoles(array $allowedRoles): string
    {
        foreach ($allowedRoles as $value) {
            $role = RoleEnum::tryFrom($value);

            if ($role instanceof RoleEnum && $role->isCrm()) {
                return 'bo.connexion';
            }
        }

        // Zone restreinte pure (uniquement le rôle sans compte) → login suivi.
        if ($allowedRoles === [RoleEnum::ROLE_CLIENT_RESTREINT->value]) {
            return 'suivi.connexion';
        }

        return 'client.connexion';
    }
}
