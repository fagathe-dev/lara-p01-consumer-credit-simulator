<?php

declare(strict_types=1);

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(private readonly SeoService $seoService)
    {
    }

    public function index(): Response
    {
        return Inertia::render('Guest/Home', [
            'seo' => $this->seoService->for('homepage'),
        ]);
    }
}
