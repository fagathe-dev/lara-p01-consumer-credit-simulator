<?php

namespace App\Http\Middleware;

use App\Auth\Security\Guard\AbstractGuard;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => fn(): ?array => $this->authContext($request),
            'flash' => [
                'status' => fn() => $request->session()->get('status'),
                'requiresCode' => fn(): bool => (bool) $request->session()->get('requiresCode'),
                'codeSent' => fn(): bool => (bool) $request->session()->get('codeSent'),
            ],
        ];
    }

    /**
     * Contexte d'authentification maison exposé aux pages (jamais l'id interne).
     *
     * @return array<string, mixed>|null
     */
    private function authContext(Request $request): ?array
    {
        $context = $request->session()->get(AbstractGuard::SESSION_KEY);

        if (!is_array($context) || !isset($context['role'])) {
            return null;
        }

        $userPayload = null;
        $userRef = $context['user_ref'] ?? null;

        if ($userRef) {
            $user = User::query()->where('ref', $userRef)->first();

            if ($user instanceof User) {
                $userPayload = [
                    'ref' => $user->ref,
                    'firstName' => $user->first_name,
                    'lastName' => $user->last_name,
                    'fullName' => $user->full_name,
                    'email' => $user->email,
                    'avatarUrl' => $user->avatar_url,
                    'role' => $user->role?->value,
                ];
            }
        }

        return [
            'role' => $context['role'],
            'dossierRef' => $context['dossier_ref'] ?? null,
            'email' => $context['email'] ?? null,
            'user' => $userPayload,
        ];
    }
}
