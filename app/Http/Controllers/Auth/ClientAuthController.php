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
 * Connexion de l'espace client (ROLE_CLIENT) : email + mot de passe OU
 * email + code de connexion unique. S'appuie sur le guard maison, pas sur
 * l'auth Laravel native directement.
 */
final class ClientAuthController extends Controller
{
    public function __construct(private readonly GuardManager $guards)
    {
    }

    public function show(): Response
    {
        return Inertia::render('Auth/ConnexionClient');
    }

    public function authenticate(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['nullable', 'string'],
            'code' => ['nullable', 'string'],
        ]);

        $result = $this->guards->for(GuardManager::MODE_CLIENT)->authenticate($credentials);

        if ($result->success) {
            $request->session()->regenerate();

            return redirect()->intended(route('client.dashboard'));
        }

        if ($result->requiresCode) {
            return back()
                ->with('status', $result->message)
                ->with('requiresCode', true)
                ->withInput($request->only('email'));
        }

        return back()
            ->withErrors(['email' => $result->message ?? 'Identifiants invalides.'])
            ->withInput($request->only('email'));
    }

    public function logout(Request $request): RedirectResponse
    {
        $this->guards->for(GuardManager::MODE_CLIENT)->logout($request);
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('client.connexion');
    }
}
