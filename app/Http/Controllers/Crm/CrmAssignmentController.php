<?php

declare(strict_types=1);

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Squelette de l'assignation d'un dossier à un agent (Manager + Admin).
 */
final class CrmAssignmentController extends Controller
{
    public function assign(Request $request, Dossier $dossier): RedirectResponse
    {
        $data = $request->validate([
            'agent_id' => ['required', 'string', 'exists:users,agent_id'],
        ]);

        $dossier->update(['agent_assignee_id' => $data['agent_id']]);

        return back()->with('status', 'Dossier assigné.');
    }
}
