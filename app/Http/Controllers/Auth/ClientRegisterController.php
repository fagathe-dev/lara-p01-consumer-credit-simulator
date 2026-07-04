<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Auth\Security\Guard\AbstractGuard;
use App\Auth\Security\Guard\GuardManager;
use App\Auth\Security\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Inscription espace client (ROLE_CLIENT).
 *
 * Crée le compte, connecte automatiquement l'utilisateur puis, si l'internaute
 * arrivait d'une session restreinte (dossier_ref en session), rattache ce
 * dossier anonyme au nouveau compte (conversion restreint → compte complet).
 */
final class ClientRegisterController extends Controller
{
    public function __construct(private readonly GuardManager $guards)
    {
    }

    public function show(Request $request): Response
    {
        $context = $request->session()->get(AbstractGuard::SESSION_KEY);
        $restrictedDossierRef = is_array($context)
            && ($context['role'] ?? null) === RoleEnum::ROLE_CLIENT_RESTREINT->value
            ? ($context['dossier_ref'] ?? null)
            : null;

        return Inertia::render('Auth/CreationClient', [
            'restrictedDossierRef' => $restrictedDossierRef,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'attach_dossier' => ['nullable', 'boolean'],
        ]);

        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => RoleEnum::ROLE_CLIENT,
        ]);

        // Rattachement éventuel du dossier issu de la session restreinte.
        $context = $request->session()->get(AbstractGuard::SESSION_KEY);
        $restrictedRef = is_array($context)
            && ($context['role'] ?? null) === RoleEnum::ROLE_CLIENT_RESTREINT->value
            ? ($context['dossier_ref'] ?? null)
            : null;

        if (!empty($data['attach_dossier']) && $restrictedRef) {
            Dossier::query()
                ->where('ref', $restrictedRef)
                ->whereNull('user_id')
                ->update(['user_id' => $user->id]);
        }

        // Connexion automatique via le guard client.
        Auth::login($user);
        $request->session()->put(AbstractGuard::SESSION_KEY, [
            'role' => RoleEnum::ROLE_CLIENT->value,
            'dossier_ref' => null,
            'email' => $user->email,
            'user_ref' => $user->ref,
            'started_at' => now()->timestamp,
        ]);
        $request->session()->regenerate();

        return redirect()->route('client.dashboard');
    }
}
