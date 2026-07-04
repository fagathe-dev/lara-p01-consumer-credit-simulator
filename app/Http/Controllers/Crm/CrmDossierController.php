<?php

declare(strict_types=1);

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Squelette de la gestion des dossiers côté CRM (liste + détail).
 */
final class CrmDossierController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Bo/Dossiers', [
            'dossiers' => Dossier::query()
                ->latest()
                ->limit(50)
                ->get(['ref', 'project_type', 'project_amount', 'status'])
                ->map(fn(Dossier $dossier): array => [
                    'ref' => $dossier->ref,
                    'projectType' => $dossier->project_type?->label(),
                    'amount' => (float) $dossier->project_amount,
                    'statusLabel' => $dossier->status?->label(),
                ]),
        ]);
    }

    public function show(Dossier $dossier): Response
    {
        return Inertia::render('Bo/DossierDetail', [
            'dossier' => [
                'ref' => $dossier->ref,
                'projectType' => $dossier->project_type?->label(),
                'amount' => (float) $dossier->project_amount,
                'statusLabel' => $dossier->status?->label(),
            ],
        ]);
    }
}
