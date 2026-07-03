<?php

namespace App\Auth\UserRequest;

enum UserRequestTypeEnum: string
{

    case AUTH_ACCOUNT_VERIFICATION = 'AUTH_ACCOUNT_VERIFICATION'; // Pour les demandes de vérification de compte (email de confirmation)
    case AUTH_PASSWORD_RESET = 'AUTH_PASSWORD_RESET'; // Pour les demandes de réinitialisation de mot de passe
    case AUTH_EMAIL_RESET = 'AUTH_EMAIL_RESET'; // Pour les demandes de changement d'email (réinitialisation d'email)
    case AUTH_PROFILE_CHANGE_EMAIL = 'AUTH_PROFILE_CHANGE_EMAIL'; // Pour les demandes de changement d'email dans le profil utilisateur

}