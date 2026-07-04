<?php

namespace App\Providers;

use App\Auth\Security\Guard\AbstractGuard;
use App\Auth\Security\RoleEnum;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Client complet uniquement (refuse le restreint et les invités).
        Gate::define('edit-profile', function (?User $user): bool {
            $context = session(AbstractGuard::SESSION_KEY);

            return is_array($context)
                && ($context['role'] ?? null) === RoleEnum::ROLE_CLIENT->value;
        });

        // Manager + Admin.
        Gate::define('assign-dossiers', static fn(?User $user): bool =>
            $user?->role?->includes(RoleEnum::ROLE_CRM_MANAGER) ?? false);

        // Admin uniquement.
        Gate::define('manage-agents', static fn(?User $user): bool =>
            $user?->role === RoleEnum::ROLE_CRM_ADMIN);
    }
}
