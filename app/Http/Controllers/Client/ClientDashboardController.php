<?php

declare(strict_types=1);

namespace App\Http\Controllers\Client;

use App\Auth\Security\Guard\AbstractGuard;
use App\Auth\Security\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\Offer;
use Core\Simulator\Enum\ApplicationStatusEnum;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Home de l'espace client : liste des dossiers crédit conso du client.
 *
 * - ROLE_CLIENT           : tous ses dossiers (user_id courant).
 * - ROLE_CLIENT_RESTREINT : uniquement le dossier de la session (dossier_ref),
 *   avec une bannière invitant à créer un compte.
 */
final class ClientDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $context = $request->session()->get(AbstractGuard::SESSION_KEY);
        $role = is_array($context) ? RoleEnum::tryFrom((string) ($context['role'] ?? '')) : null;
        $isRestricted = $role === RoleEnum::ROLE_CLIENT_RESTREINT;

        $query = Dossier::query()
            ->with(['offers.partner', 'emprunteur'])
            ->latest();

        if ($isRestricted) {
            // Périmètre verrouillé au seul dossier de la session restreinte.
            $query->where('ref', $context['dossier_ref'] ?? '');
        } else {
            $query->where('user_id', $request->user()?->id);
        }

        $dossiers = $query->get()->map(fn(Dossier $dossier): array => $this->mapDossier($dossier));

        return Inertia::render('Client/Dashboard', [
            'dossiers' => $dossiers,
            'isRestricted' => $isRestricted,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function mapDossier(Dossier $dossier): array
    {
        return [
            'ref' => $dossier->ref,
            'projectType' => $dossier->project_type?->label(),
            'amount' => (float) $dossier->project_amount,
            'duration' => $dossier->project_duration,
            'statusValue' => $dossier->status?->value,
            'statusLabel' => $dossier->status?->label(),
            'statusBadge' => $this->statusBadge($dossier->status),
            'createdAt' => $dossier->created_at?->format('d/m/Y'),
            'offers' => $dossier->offers->map(fn(Offer $offer): array => [
                'ref' => $offer->internal_reference,
                'partner' => $offer->partner?->name,
                'amount' => (float) $offer->project_amount,
                'duration' => $offer->duration,
                'monthlyPayment' => (float) $offer->monthly_payment,
                'apr' => (float) $offer->apr,
                'statusLabel' => $offer->status?->label(),
                'statusBadge' => $offer->status?->badgeStatus(),
            ])->values(),
        ];
    }

    private function statusBadge(?ApplicationStatusEnum $status): string
    {
        return match ($status) {
            ApplicationStatusEnum::ACCEPTE => 'success',
            ApplicationStatusEnum::IN_PROGRESS => 'warning',
            ApplicationStatusEnum::REFUSED => 'danger',
            default => 'info',
        };
    }
}
