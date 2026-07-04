<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Auth\Security\Guard\GuardManager;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Connexion back-office CRM (ROLE_CRM_*) : email + mot de passe PUIS 2FA
 * (code de vérification envoyé par email). Deux étapes explicites.
 */
final class CrmAuthController extends Controller
{
    private const SESSION_2FA_EMAIL = 'crm.2fa.email';

    public function __construct(private readonly GuardManager $guards)
    {
    }

    public function show(): Response
    {
        return Inertia::render('Auth/ConnexionCrm', ['step' => 'credentials']);
    }

    public function authenticate(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $result = $this->guards->for(GuardManager::MODE_CRM)->authenticate($credentials);

        if ($result->requiresCode) {
            $request->session()->put(self::SESSION_2FA_EMAIL, $credentials['email']);

            return redirect()->route('bo.connexion.2fa')->with('status', $result->message);
        }

        return back()
            ->withErrors(['email' => $result->message ?? 'Identifiants invalides.'])
            ->withInput($request->only('email'));
    }

    public function show2fa(Request $request): RedirectResponse|Response
    {
        $email = $request->session()->get(self::SESSION_2FA_EMAIL);

        if (!is_string($email) || $email === '') {
            return redirect()->route('bo.connexion');
        }

        return Inertia::render('Auth/ConnexionCrm', [
            'step' => '2fa',
            'email' => $email,
        ]);
    }

    public function verify2fa(Request $request): RedirectResponse
    {
        $email = $request->session()->get(self::SESSION_2FA_EMAIL);

        if (!is_string($email) || $email === '') {
            return redirect()->route('bo.connexion');
        }

        $data = $request->validate([
            'code' => ['required', 'string'],
        ]);

        $result = $this->guards->for(GuardManager::MODE_CRM)->authenticate([
            'email' => $email,
            'code' => $data['code'],
        ]);

        if ($result->success) {
            $request->session()->forget(self::SESSION_2FA_EMAIL);
            $request->session()->regenerate();

            return redirect()->intended(route('bo.dashboard'));
        }

        return back()->withErrors(['code' => $result->message ?? 'Code 2FA invalide ou expiré.']);
    }

    public function logout(Request $request): RedirectResponse
    {
        $this->guards->for(GuardManager::MODE_CRM)->logout($request);
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('bo.connexion');
    }
}
