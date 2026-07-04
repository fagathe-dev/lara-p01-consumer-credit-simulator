<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Guest\HomeController;
use App\Http\Controllers\Guest\MentionsLegalesController;
use App\Http\Controllers\Guest\ProductController;
use App\Http\Controllers\Simulation\TunnelController;
use App\Http\Controllers\Simulation\ResultatController;
use App\Http\Controllers\Auth\ClientAuthController;
use App\Http\Controllers\Auth\ClientRegisterController;
use App\Http\Controllers\Auth\SuiviAuthController;
use App\Http\Controllers\Auth\CrmAuthController;
use App\Http\Controllers\Client\ClientDashboardController;
use App\Http\Controllers\Client\ClientDossierController;
use App\Http\Controllers\Client\ClientProfileController;
use App\Http\Controllers\Crm\CrmDashboardController;
use App\Http\Controllers\Crm\CrmDossierController;
use App\Http\Controllers\Crm\CrmAssignmentController;
use App\Http\Controllers\Crm\CrmAgentController;
use App\Http\Controllers\Crm\CrmSettingsController;

/*
|--------------------------------------------------------------------------
| Public site (SEO) + tunnel — GET routes, no auth middleware
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/mentions-legales', [MentionsLegalesController::class, 'index'])
    ->name('mentions-legales');

// Tunnel de demande de crédit (le produit vendu)
Route::get('/simulation/credit-consommation/', [TunnelController::class, 'index'])
    ->name('simulation.tunnel');
Route::get('/simulation/credit-consommation/resultat', [ResultatController::class, 'index'])
    ->name('simulation.resultat');

// Pages produit (SEO), une par ProjectTypeEnum
Route::get('/pret-auto-moto', [ProductController::class, 'autoMoto'])
    ->name('produit.auto-moto');
Route::get('/rachat-de-credits', [ProductController::class, 'rachatCredits'])
    ->name('produit.rachat-credits');
Route::get('/pret-travaux', [ProductController::class, 'travaux'])
    ->name('produit.travaux');
Route::get('/pret-personnel', [ProductController::class, 'personnel'])
    ->name('produit.personnel');
Route::get('/pret-famille-loisirs', [ProductController::class, 'familleLoisirs'])
    ->name('produit.famille-loisirs');

/*
|--------------------------------------------------------------------------
| Connexion CLIENT — ROLE_CLIENT (+ zone restreinte)
|--------------------------------------------------------------------------
*/
Route::prefix('espace-client')->name('client.')->group(function (): void {
    // Connexion (hors middleware)
    Route::get('connexion', [ClientAuthController::class, 'show'])->name('connexion');
    Route::post('connexion', [ClientAuthController::class, 'authenticate']);
    // Inscription (hors middleware)
    Route::get('creation', [ClientRegisterController::class, 'show'])->name('creation');
    Route::post('creation', [ClientRegisterController::class, 'store']);
    Route::post('logout', [ClientAuthController::class, 'logout'])->name('logout');

    // Zone protégée client + restreint ; restricted.expiry applique 30 min au restreint (no-op sinon).
    Route::middleware(['guard.access:ROLE_CLIENT,ROLE_CLIENT_RESTREINT', 'restricted.expiry'])->group(function (): void {
        Route::get('/', [ClientDashboardController::class, 'index'])->name('dashboard');
        Route::get('dossiers/{dossier}', [ClientDossierController::class, 'show'])->name('dossiers.show'); // binding sur ref

        // Réservé au client complet (pas au restreint) → Gate edit-profile
        Route::middleware('can:edit-profile')->group(function (): void {
            Route::get('profil', [ClientProfileController::class, 'edit'])->name('profile.edit');
            Route::put('profil', [ClientProfileController::class, 'update'])->name('profile.update');
            Route::post('profil/avatar', [ClientProfileController::class, 'updateAvatar'])->name('profile.avatar');
        });
    });
});

/*
|--------------------------------------------------------------------------
| Connexion SUIVI (mode restreint) — ROLE_CLIENT_RESTREINT (sans compte)
|--------------------------------------------------------------------------
*/
Route::prefix('suivi-de-dossier')->name('suivi.')->group(function (): void {
    Route::get('connexion', [SuiviAuthController::class, 'show'])->name('connexion');           // saisie ref + email
    Route::post('connexion', [SuiviAuthController::class, 'sendCode'])->name('connexion.code'); // envoi code
    Route::post('verify', [SuiviAuthController::class, 'verify'])->name('verify');              // vérifie code → session restreinte
});

/*
|--------------------------------------------------------------------------
| Connexion CRM — ROLE_CRM_* (email/mdp + 2FA)
|--------------------------------------------------------------------------
*/
Route::prefix('bo')->name('bo.')->group(function (): void {
    Route::get('connexion', [CrmAuthController::class, 'show'])->name('connexion');
    Route::post('connexion', [CrmAuthController::class, 'authenticate']);
    Route::get('connexion/2fa', [CrmAuthController::class, 'show2fa'])->name('connexion.2fa');
    Route::post('connexion/2fa', [CrmAuthController::class, 'verify2fa']);
    Route::post('logout', [CrmAuthController::class, 'logout'])->name('logout');

    Route::middleware('guard.access:ROLE_CRM_AGENT,ROLE_CRM_MANAGER,ROLE_CRM_ADMIN')->group(function (): void {
        Route::get('/', [CrmDashboardController::class, 'index'])->name('dashboard');
        Route::get('dossiers', [CrmDossierController::class, 'index'])->name('dossiers');
        Route::get('dossiers/{dossier}', [CrmDossierController::class, 'show'])->name('dossiers.show');

        Route::middleware('can:assign-dossiers')->group(function (): void { // Manager + Admin
            Route::post('dossiers/{dossier}/assign', [CrmAssignmentController::class, 'assign'])->name('dossiers.assign');
        });

        Route::middleware('can:manage-agents')->group(function (): void { // Admin
            Route::resource('agents', CrmAgentController::class)->only(['index']);
            Route::get('parametres', [CrmSettingsController::class, 'index'])->name('settings');
        });
    });
});