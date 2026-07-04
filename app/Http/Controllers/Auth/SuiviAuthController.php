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
 * Connexion « suivi de dossier » (mode restreint, SANS compte).
 *
 * Étape 1 : ref dossier + email lié (emprunteur / co-emprunteur) → envoi d'un
 * code OTP. Étape 2 : vérification du code → ouverture de la session restreinte.
 */
final class SuiviAuthController extends Controller
{
    public function __construct(private readonly GuardManager $guards)
    {
    }

    public function show(): Response
    {
        return Inertia::render('Auth/ConnexionSuivi');
    }

    public function sendCode(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'ref' => ['required', 'string'],
            'email' => ['required', 'email'],
        ]);

        $result = $this->guards->for(GuardManager::MODE_RESTREINT)->authenticate($credentials);

        if ($result->requiresCode) {
            return back()
                ->with('status', $result->message)
                ->with('codeSent', true)
                ->withInput($request->only('ref', 'email'));
        }

        return back()
            ->withErrors(['ref' => $result->message ?? 'Référence ou email invalide.'])
            ->withInput($request->only('ref', 'email'));
    }

    public function verify(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'ref' => ['required', 'string'],
            'email' => ['required', 'email'],
            'code' => ['required', 'string'],
        ]);

        $result = $this->guards->for(GuardManager::MODE_RESTREINT)->authenticate($credentials);

        if ($result->success) {
            $request->session()->regenerate();

            return redirect()->route('client.dashboard');
        }

        return back()
            ->withErrors(['code' => $result->message ?? 'Code invalide ou expiré.'])
            ->with('codeSent', true)
            ->withInput($request->only('ref', 'email'));
    }
}
