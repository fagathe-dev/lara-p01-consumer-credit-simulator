<?php

declare(strict_types=1);

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Édition du profil client complet (ROLE_CLIENT).
 *
 * Informations, mot de passe (optionnel) et photo de profil. L'accès est
 * réservé au client complet via la Gate `edit-profile` (appliquée en route).
 */
final class ClientProfileController extends Controller
{
    private const AVATAR_DIR = 'avatar';

    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Client/ProfileEdit', [
            'profile' => [
                'ref' => $user->ref,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'email' => $user->email,
                'avatarUrl' => $user->avatar_url,
                'fullName' => $user->full_name,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        $emailChanged = $data['email'] !== $user->email;

        $user->first_name = $data['first_name'];
        $user->last_name = $data['last_name'];
        $user->email = $data['email'];

        // Re-vérification de l'email si modifié.
        if ($emailChanged) {
            $user->email_verified_at = null;
        }

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return back()->with('status', 'Profil mis à jour.');
    }

    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:png,jpg,jpeg,webp', 'max:2048'],
        ]);

        /** @var User $user */
        $user = $request->user();

        // Supprime l'ancienne photo si présente.
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store(self::AVATAR_DIR, 'public');

        $user->avatar = $path;
        $user->save();

        return back()->with('status', 'Photo de profil mise à jour.');
    }
}
