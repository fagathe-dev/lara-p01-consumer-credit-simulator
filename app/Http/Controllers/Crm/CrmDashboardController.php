<?php

declare(strict_types=1);

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Squelette du tableau de bord CRM (back-office). Rendu minimal ; la logique
 * métier CRM sera étoffée dans un lot dédié.
 */
final class CrmDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Bo/Dashboard');
    }
}
