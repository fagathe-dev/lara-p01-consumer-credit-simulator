<?php

declare(strict_types=1);

namespace App\Auth\Security\Guard;

use App\Auth\Security\LoginCodeService;
use App\Auth\Security\RoleEnum;
use App\Auth\UserRequest\UserRequestTypeEnum;
use App\Models\Dossier;
use Core\Simulator\Enum\ApplicationActionTypeEnum;
use Core\Simulator\Enum\InitiatorTypeEnum;
use Illuminate\Http\Request;

/**
 * Mode 1 — Client restreint (SANS COMPTE).
 *
 * Entrée : dossiers.ref + email (emprunteur OU co-emprunteur) → code OTP → session.
 * Aucune row users : l'identité vit dans la session. Expiration 30 min.
 *
 * @property-read Request $request
 */
final class EspaceClientRestreintGuard extends AbstractGuard
{
    public function __construct(
        private readonly LoginCodeService $loginCode,
        private readonly Request $request,
    ) {
    }

    public function role(): RoleEnum
    {
        return RoleEnum::ROLE_CLIENT_RESTREINT;
    }

    public function sessionLifetime(): ?int
    {
        return 30;
    }

    /**
     * @param array<string, mixed> $credentials  ['ref' => string, 'email' => string, 'code' => ?string]
     */
    public function authenticate(array $credentials): AuthResult
    {
        $ref = (string) ($credentials['ref'] ?? '');
        $email = (string) ($credentials['email'] ?? '');
        $code = $credentials['code'] ?? null;

        $dossier = Dossier::query()->where('ref', $ref)->first();

        if ($dossier === null || !$this->emailBelongsToDossier($dossier, $email)) {
            return AuthResult::failure($this->role(), 'Référence de dossier ou email invalide.');
        }

        // Étape 1 — envoi du code.
        if (empty($code)) {
            $this->loginCode->generate(
                UserRequestTypeEnum::LOGIN_CODE_RESTREINT,
                $email,
                null,
                ['dossier_ref' => $ref],
            );

            return AuthResult::requiresCode($this->role());
        }

        // Étape 2 — vérification du code.
        if (!$this->loginCode->verify(UserRequestTypeEnum::LOGIN_CODE_RESTREINT, $email, (string) $code)) {
            return AuthResult::failure($this->role(), 'Code de connexion invalide ou expiré.');
        }

        $this->openContext(dossierRef: $ref, email: $email);
        $this->recordProvenance($ref, $this->request);
        $this->log(
            $ref,
            ApplicationActionTypeEnum::LOGIN_RESTREINT,
            InitiatorTypeEnum::CLIENT_RESTREINT,
            null,
            ['email' => $email],
        );

        return AuthResult::success($this->role(), dossierRef: $ref);
    }

    /**
     * Le dossier restreint en session est-il celui demandé ? (verrouillage périmètre)
     */
    public function canAccessDossier(string $dossierRef): bool
    {
        $context = $this->context($this->request);

        return $context !== null && ($context['dossier_ref'] ?? null) === $dossierRef;
    }

    private function emailBelongsToDossier(Dossier $dossier, string $email): bool
    {
        if ($email === '') {
            return false;
        }

        return $dossier->personnes()
            ->where('email', $email)
            ->exists();
    }
}
