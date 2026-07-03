<?php

declare(strict_types=1);

namespace App\Auth\Security\Guard;

use App\Auth\Security\LoginCodeService;
use App\Auth\Security\RoleEnum;
use App\Auth\UserRequest\UserRequestTypeEnum;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * Mode 3 — Agent CRM (ROLE_CRM_AGENT|MANAGER|ADMIN) + 2FA.
 *
 * Connexion : email × mot de passe, PUIS code de connexion unique reçu par email (2FA).
 * Auth Laravel classique (session). RBAC assuré via les Gates/Policies natifs.
 * Pas de limite d'expiration spécifique.
 */
final class CrmGuard extends AbstractGuard
{
    public function __construct(
        private readonly LoginCodeService $loginCode,
        private readonly Request $request,
    ) {
    }

    public function role(): RoleEnum
    {
        // Rôle « plancher » du mode CRM ; la hiérarchie fine est gérée par les Gates.
        return RoleEnum::ROLE_CRM_AGENT;
    }

    public function check(Request $request): bool
    {
        $context = $this->context($request);

        if ($context === null) {
            return false;
        }

        $role = RoleEnum::tryFrom((string) ($context['role'] ?? ''));

        return $role instanceof RoleEnum && $role->isCrm() && !$this->isExpired($context);
    }

    /**
     * @param array<string, mixed> $credentials  ['email' => string, 'password' => ?string, 'code' => ?string]
     */
    public function authenticate(array $credentials): AuthResult
    {
        $email = (string) ($credentials['email'] ?? '');
        $password = $credentials['password'] ?? null;
        $code = $credentials['code'] ?? null;

        $user = User::query()->where('email', $email)->first();

        if ($user === null || !$user->role->isCrm()) {
            return AuthResult::failure($this->role(), 'Identifiants invalides.');
        }

        // Étape 2FA — vérification du code (déjà passé par le mot de passe).
        if (!empty($code)) {
            if (!$this->loginCode->verify(UserRequestTypeEnum::LOGIN_CODE_AGENT_2FA, $email, (string) $code)) {
                return AuthResult::failure($this->role(), 'Code 2FA invalide ou expiré.');
            }

            Auth::login($user);
            $this->openContext(email: $user->email, userRef: $user->ref, extra: ['role' => $user->role->value]);

            return AuthResult::success($user->role, user: $user);
        }

        // Étape 1 — mot de passe puis envoi du code 2FA.
        if (empty($password) || !Hash::check((string) $password, $user->password)) {
            return AuthResult::failure($this->role(), 'Identifiants invalides.');
        }

        $this->loginCode->generate(UserRequestTypeEnum::LOGIN_CODE_AGENT_2FA, $email, $user->id);

        return AuthResult::requiresCode($user->role, 'Un code de vérification (2FA) a été envoyé.');
    }

    public function logout(Request $request): void
    {
        Auth::logout();
        parent::logout($request);
    }
}
