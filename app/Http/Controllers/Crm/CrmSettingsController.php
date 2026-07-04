<?php

declare(strict_types=1);

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Squelette des paramètres CRM (Admin uniquement).
 */
final class CrmSettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Bo/Settings');
    }
}
