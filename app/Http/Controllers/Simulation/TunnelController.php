<?php

declare(strict_types=1);

namespace App\Http\Controllers\Simulation;

use App\Http\Controllers\Controller;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class TunnelController extends Controller
{
    public function __construct(private readonly SeoService $seoService)
    {
    }

    public function index(): Response
    {
        return Inertia::render('Simulation/Tunnel', [
            'seo' => $this->seoService->for('tunnel_step1'),
            'defaultAmount' => 10000,
            'defaultDuration' => 48,
        ]);
    }
}
