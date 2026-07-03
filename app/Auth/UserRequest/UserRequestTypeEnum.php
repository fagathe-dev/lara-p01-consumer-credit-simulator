<?php

declare(strict_types=1);

namespace App\Auth\UserRequest;

enum UserRequestTypeEnum: string
{
    case AUTH_ACCOUNT_VERIFICATION = 'AUTH_ACCOUNT_VERIFICATION'; // Vérification de compte (email de confirmation)
    case AUTH_PASSWORD_RESET = 'AUTH_PASSWORD_RESET'; // Réinitialisation de mot de passe
    case AUTH_EMAIL_RESET = 'AUTH_EMAIL_RESET'; // Changement d'email (réinitialisation)
    case AUTH_PROFILE_CHANGE_EMAIL = 'AUTH_PROFILE_CHANGE_EMAIL'; // Changement d'email dans le profil

    // Codes de connexion à usage unique (OTP) mutualisés entre les 3 modes d'auth.
    case LOGIN_CODE_RESTREINT = 'LOGIN_CODE_RESTREINT';     // Mode 1 — client restreint (sans compte)
    case LOGIN_CODE_CLIENT = 'LOGIN_CODE_CLIENT';           // Mode 2 — client avec compte
    case LOGIN_CODE_AGENT_2FA = 'LOGIN_CODE_AGENT_2FA';     // Mode 3 — agent CRM (2FA)
    case EMAIL_VERIFICATION = 'EMAIL_VERIFICATION';
    case PASSWORD_RESET = 'PASSWORD_RESET';

    public function label(): string
    {
        return match ($this) {
            self::AUTH_ACCOUNT_VERIFICATION => 'Vérification de compte',
            self::AUTH_PASSWORD_RESET => 'Réinitialisation du mot de passe',
            self::AUTH_EMAIL_RESET => 'Réinitialisation de l\'email',
            self::AUTH_PROFILE_CHANGE_EMAIL => 'Changement d\'email (profil)',
            self::LOGIN_CODE_RESTREINT => 'Code de connexion (accès restreint)',
            self::LOGIN_CODE_CLIENT => 'Code de connexion client',
            self::LOGIN_CODE_AGENT_2FA => 'Code de connexion agent (2FA)',
            self::EMAIL_VERIFICATION => 'Vérification d\'email',
            self::PASSWORD_RESET => 'Réinitialisation du mot de passe',
        };
    }

    /**
     * Indique si ce type correspond à un code de connexion à usage unique (OTP).
     */
    public function isLoginCode(): bool
    {
        return in_array($this, [
            self::LOGIN_CODE_RESTREINT,
            self::LOGIN_CODE_CLIENT,
            self::LOGIN_CODE_AGENT_2FA,
        ], true);
    }

    /**
     * @return array<string, string>
     */
    public static function choices(): array
    {
        return array_reduce(
            self::cases(),
            fn($carry, $enum) => [...$carry, $enum->label() => $enum->value],
            []
        );
    }

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(fn($e) => $e->value, self::cases());
    }
}