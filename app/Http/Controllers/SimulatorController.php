<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class SimulatorController extends Controller
{
    public function index()
    {
        return Inertia::render('Simulator/Index', [
            'defaultAmount' => 10000,
            'defaultDuration' => 48
        ]);
    }
}
