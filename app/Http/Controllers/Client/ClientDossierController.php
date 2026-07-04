<?php

declare(strict_types=1);

namespace App\Http\Controllers\Client;

use App\Auth\Security\Guard\AbstractGuard;
use App\Auth\Security\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Détail d'un dossier crédit conso côté client (binding sur `ref`).
 *
 * Le périmètre est verrouillé : un client complet ne voit que ses dossiers ;
 * un client restreint ne voit que le dossier de sa session.
 */
final class ClientDossierController extends Controller
{
    public function show(Request $request, Dossier $dossier): Response
    {
        $this->authorizeAccess($request, $dossier);

        $dossier->load(['offers.partner', 'emprunteur', 'coEmprunteur']);

        return Inertia::render('Client/DossierDetail', [
            'dossier' => [
                'ref' => $dossier->ref,
                'projectType' => $dossier->project_type?->label(),
                'amount' => (float) $dossier->project_amount,
                'duration' => $dossier->project_duration,
                'statusLabel' => $dossier->status?->label(),
                'createdAt' => $dossier->created_at?->format('d/m/Y'),
                'offers' => $dossier->offers->map(fn(Offer $offer): array => [
                    'ref' => $offer->internal_reference,
                    'partner' => $offer->partner?->name,
                    'amount' => (float) $offer->project_amount,
                    'duration' => $offer->duration,
                    'monthlyPayment' => (float) $offer->monthly_payment,
                    'apr' => (float) $offer->apr,
                    'totalCreditCost' => (float) $offer->total_credit_cost,
                    'statusLabel' => $offer->status?->label(),
                    'statusBadge' => $offer->status?->badgeStatus(),
                ])->values(),
            ],
        ]);
    }

    private function authorizeAccess(Request $request, Dossier $dossier): void
    {
        $context = $request->session()->get(AbstractGuard::SESSION_KEY);
        $role = is_array($context) ? RoleEnum::tryFrom((string) ($context['role'] ?? '')) : null;

        $allowed = match ($role) {
            RoleEnum::ROLE_CLIENT_RESTREINT => ($context['dossier_ref'] ?? null) === $dossier->ref,
            RoleEnum::ROLE_CLIENT => $dossier->user_id === $request->user()?->id,
            default => false,
        };

        if (!$allowed) {
            throw new AccessDeniedHttpException();
        }
    }
}
