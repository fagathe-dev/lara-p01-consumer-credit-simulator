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
 * Mode 2 — Client avec compte (ROLE_CLIENT).
 *
 * Connexion : email × mot de passe, OU email + code de connexion unique.
 * Auth Laravel classique (session), pas de limite d'expiration spécifique.
 */
final class EspaceClientGuard extends AbstractGuard
{
    public function __construct(
        private readonly LoginCodeService $loginCode,
        private readonly Request $request,
    ) {
    }

    public function role(): RoleEnum
    {
        return RoleEnum::ROLE_CLIENT;
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

        if ($user === null || $user->role !== RoleEnum::ROLE_CLIENT) {
            return AuthResult::failure($this->role(), 'Identifiants invalides.');
        }

        // Voie mot de passe.
        if (!empty($password)) {
            if (!Hash::check((string) $password, $user->password)) {
                return AuthResult::failure($this->role(), 'Identifiants invalides.');
            }

            return $this->completeLogin($user);
        }

        // Voie code : envoi puis vérification.
        if (empty($code)) {
            $this->loginCode->generate(UserRequestTypeEnum::LOGIN_CODE_CLIENT, $email, $user->id);

            return AuthResult::requiresCode($this->role());
        }

        if (!$this->loginCode->verify(UserRequestTypeEnum::LOGIN_CODE_CLIENT, $email, (string) $code)) {
            return AuthResult::failure($this->role(), 'Code de connexion invalide ou expiré.');
        }

        return $this->completeLogin($user);
    }

    public function logout(Request $request): void
    {
        Auth::logout();
        parent::logout($request);
    }

    private function completeLogin(User $user): AuthResult
    {
        Auth::login($user);
        $this->openContext(email: $user->email, userRef: $user->ref);

        return AuthResult::success($this->role(), user: $user);
    }
}
