<?php

declare(strict_types=1);

namespace App\Http\Controllers\Simulation;

use App\Http\Controllers\Controller;
use App\Services\SeoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResultatController extends Controller
{
    public function __construct(private readonly SeoService $seoService)
    {
    }

    /**
     * Confirmation screen — only reachable after a dossier has been submitted.
     * Otherwise redirect back to the tunnel (consistent with its `noindex`).
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $reference = $request->session()->get('dossier_reference');

        if ($reference === null) {
            return redirect()->route('simulation.tunnel');
        }

        return Inertia::render('Simulation/Resultat', [
            'seo' => $this->seoService->for('tunnel_resultat'),
            'reference' => $reference,
            // Offers are produced asynchronously by Laravel from the Python
            // scoring API; null while the dossier is still under study.
            'offers' => $request->session()->get('dossier_offers'),
        ]);
    }
}
