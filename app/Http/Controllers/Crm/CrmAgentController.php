<?php

declare(strict_types=1);

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Squelette de la gestion des agents CRM (Admin uniquement).
 */
final class CrmAgentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Bo/Agents', [
            'agents' => User::query()
                ->whereNotNull('agent_id')
                ->get(['ref', 'agent_id', 'first_name', 'last_name', 'email', 'role'])
                ->map(fn(User $agent): array => [
                    'ref' => $agent->ref,
                    'agentId' => $agent->agent_id,
                    'fullName' => $agent->full_name,
                    'email' => $agent->email,
                    'role' => $agent->role?->label(),
                ]),
        ]);
    }
}
