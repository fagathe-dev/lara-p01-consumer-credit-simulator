<?php

declare(strict_types=1);

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

/**
 * SEO product pages, one per Core\Simulator\Enum\ProjectTypeEnum case.
 */
class ProductController extends Controller
{
    public function __construct(private readonly SeoService $seoService)
    {
    }

    public function autoMoto(): Response
    {
        return Inertia::render('Guest/Produits/AutoMoto', [
            'seo' => $this->seoService->for('produit_auto_moto'),
        ]);
    }

    public function rachatCredits(): Response
    {
        return Inertia::render('Guest/Produits/RachatCredits', [
            'seo' => $this->seoService->for('produit_regroupement_credits'),
        ]);
    }

    public function travaux(): Response
    {
        return Inertia::render('Guest/Produits/Travaux', [
            'seo' => $this->seoService->for('produit_travaux'),
        ]);
    }

    public function personnel(): Response
    {
        return Inertia::render('Guest/Produits/Personnel', [
            'seo' => $this->seoService->for('produit_personnel'),
        ]);
    }

    public function familleLoisirs(): Response
    {
        return Inertia::render('Guest/Produits/FamilleLoisirs', [
            'seo' => $this->seoService->for('produit_famille_loisirs'),
        ]);
    }
}
