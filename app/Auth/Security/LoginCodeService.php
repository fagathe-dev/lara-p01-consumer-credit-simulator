<?php

declare(strict_types=1);

namespace App\Auth\Security;

use App\Auth\UserRequest\UserRequestTypeEnum;
use App\Models\UserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

/**
 * Génère, envoie et vérifie les codes de connexion à usage unique (OTP),
 * mutualisés entre les 3 modes d'authentification (types distincts via UserRequestTypeEnum).
 *
 * Sécurité :
 *  - code haché au repos (stocké dans `token`) ;
 *  - `expires_at` court (10 min) ;
 *  - incrément de `attempts` à chaque essai, blocage au-delà du seuil ;
 *  - `is_used` = true après succès (usage unique).
 */
final class LoginCodeService
{
    private const CODE_LENGTH = 6;
    private const EXPIRATION_MINUTES = 10;
    private const MAX_ATTEMPTS = 5;

    /**
     * Génère un code, persiste la requête (hash) et envoie l'email.
     * Retourne le code en clair (utile pour les tests / envoi immédiat).
     *
     * @param array<string, mixed> $context Données additionnelles (dossier_ref, etc.)
     */
    public function generate(
        UserRequestTypeEnum $type,
        string $email,
        ?int $userId = null,
        array $context = [],
    ): string {
        $code = $this->makeCode();

        UserRequest::create([
            'user_id' => $userId,
            'type' => $type,
            'token' => Hash::make($code),
            'content' => array_merge(['email' => $email], $context),
            'is_used' => false,
            'attempts' => 0,
            'expires_at' => now()->addMinutes(self::EXPIRATION_MINUTES),
        ]);

        $this->send($email, $code, $type);

        return $code;
    }

    /**
     * Vérifie un code pour un type + email donnés.
     * Renvoie true si valide (et consomme le code), false sinon.
     */
    public function verify(UserRequestTypeEnum $type, string $email, string $code): bool
    {
        $request = UserRequest::query()
            ->where('type', $type->value)
            ->where('is_used', false)
            ->where('content->email', $email)
            ->where(function ($query): void {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->latest('id')
            ->first();

        if ($request === null) {
            return false;
        }

        // Blocage anti brute-force.
        if ((int) ($request->attempts ?? 0) >= self::MAX_ATTEMPTS) {
            return false;
        }

        $request->increment('attempts');

        if (!Hash::check($code, $request->token)) {
            return false;
        }

        $request->forceFill(['is_used' => true])->save();

        return true;
    }

    private function makeCode(): string
    {
        $max = (10 ** self::CODE_LENGTH) - 1;

        return str_pad((string) random_int(0, $max), self::CODE_LENGTH, '0', STR_PAD_LEFT);
    }

    private function send(string $email, string $code, UserRequestTypeEnum $type): void
    {
        Mail::raw(
            "Votre code de connexion ({$type->label()}) : {$code}\n"
            . 'Ce code est valable ' . self::EXPIRATION_MINUTES . ' minutes.',
            static function ($message) use ($email): void {
                $message->to($email)->subject('Votre code de connexion');
            }
        );
    }
}
