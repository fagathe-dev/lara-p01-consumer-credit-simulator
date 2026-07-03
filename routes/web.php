<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Guest\HomeController;
use App\Http\Controllers\Guest\MentionsLegalesController;
use App\Http\Controllers\Guest\ProductController;
use App\Http\Controllers\Simulation\TunnelController;
use App\Http\Controllers\Simulation\ResultatController;

/*
|--------------------------------------------------------------------------
| Public site (SEO) — GET routes, no auth middleware
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
| Authentication (back-office)
|--------------------------------------------------------------------------
*/
Route::get('/login', [LoginController::class, 'show'])->name('login');
Route::post('/login', [LoginController::class, 'authenticate']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');