# Prompt Global — Pages Auth & Espace Client + Seeders de test

## Nature & périmètre

Refactor incrémental sur code **déjà généré**. Génère les **pages** (connexion, inscription, profil espace client, édition profil + photo) et les **seeders** de test. S'appuie sur l'existant : UI Kit (`resources/js/ui/`), layouts (`AuthLayout`, `DashboardLayout` ou dédié client), Guards maison (`App\Auth\Security\Guard\*`, `GuardManager`, `RoleEnum`), routes déjà câblées (prompt sécurité).

**Cohérence visuelle impérative** : toutes les nouvelles pages reprennent les standards graphiques déjà en place — tokens de `DESIGN_SYSTEM.md` / `@/ui/theme`, composants de l'UI Kit (`@/ui/components/*`), styled-components, thème clair unique, esthétique sobre/premium. Aucun style ad hoc, aucune couleur/typo en dur, pas de Tailwind.

---

## 0. Pré-requis à vérifier/corriger avant les pages (ménage & cohérence)

- **Supprimer `Tag`** : modèle `App\Models\Tag` + migration `create_tags_table` (inutilisé, catégorisation couverte par `status`/`risk_level`/`scoring`). Retirer toute référence.
- **`Partner` / `Offer` (nouveaux modèles, quasi vides) — à compléter a minima pour que les pages profil affichent les offres** :
  - Bug bloquant : dans `create_offers_table`, `application_id` fait `->constrained()` qui cible une table `applications` inexistante → **corriger en `->constrained('dossiers')`** (la table s'appelle `dossiers`). Sans ça, `migrate` casse.
  - `Offer` : ajouter `$fillable`, relations `partner(): BelongsTo` et `dossier(): BelongsTo` (sur `application_id`), garder les casts existants (`status`, `expires_at`) ; créer `OfferStatusEnum` s'il n'existe pas.
  - `Partner` : ajouter `$fillable` (`name`, `code`, `logo`, `is_active`, …) et relation `offers(): HasMany`.
  - Cohérence `ref` (rappel) : `offers` utilise `internal_reference` et des FK sur `id`, ce qui **diverge** de la règle "identifiant public = `ref`, FK métier sur `ref`". À signaler ; l'aligner seulement si demandé (ne pas forcer). Les pages profil exposeront l'`internal_reference` (ou `ref`) de l'offre, jamais l'`id`.

> Ces points sont des pré-requis, pas le cœur du prompt. Les traiter proprement puis passer aux pages.

---

## 1. Pages de connexion — 3 entrées distinctes

Décision actée : **3 pages de connexion séparées** (revient sur le login unique envisagé précédemment ; c'est le choix retenu ici). Adapter `routes/web.php` en conséquence (les 3 routes de connexion ci-dessous remplacent le `/login` unique).

| Route | Page (`Pages/`) | Mode | Champs |
|---|---|---|---|
| `/espace-client/connexion` | `Pages/Auth/ConnexionClient` | `ROLE_CLIENT` | email + mot de passe **ou** email + code unique |
| `/bo/connexion` | `Pages/Auth/ConnexionCrm` | `ROLE_CRM_*` | email + mot de passe, **puis** 2FA (code par email) |
| `/suivi-de-dossier/connexion` | `Pages/Auth/ConnexionSuivi` | `ROLE_CLIENT_RESTREINT` | `ref` dossier + email lié (emp/co-emp) → code unique |

- Toutes utilisent `AuthLayout` (composition centrée, carte unique, logo, aucune navigation distrayante — déjà défini).
- Chaque page : `Field`/`FieldLabel`/`FieldError`, `Input`, `Button` de l'UI Kit ; messages d'erreur via `FieldError` ; état de chargement sur le bouton (`isLoading`).
- `ConnexionCrm` : gérer le **2 étapes** (email/mdp → écran de saisie du code 2FA), soit deux vues, soit un état interne.
- `ConnexionSuivi` : 2 étapes également (saisie ref+email → saisie du code reçu).
- Lien "Créer un espace client" vers `/espace-client/creation` depuis `ConnexionClient` et depuis la page résultat du tunnel.
- Redirections post-connexion selon le rôle (client → `client.dashboard`, CRM → `bo.dashboard`, restreint → `client.dashboard` en vue restreinte).

## 2. Page d'inscription — `/espace-client/creation`

- Page `Pages/Auth/CreationClient`, `AuthLayout`.
- Crée un compte `ROLE_CLIENT` : `first_name`, `last_name`, `email`, `mot de passe` (+ confirmation), consentements si nécessaires.
- Validation client (schéma cohérent avec les Form Requests serveur) ; le serveur reste l'autorité.
- **Rattachement de dossier** : si l'utilisateur vient du mode restreint (il a un `dossier_ref` en session restreinte), proposer de rattacher ce dossier au nouveau compte à la création (le `dossiers.user_id` passe de NULL à l'`id` du nouveau client — conversion restreint → compte complet).
- `ref` du user générée à la création (préfixe `CLT-`, cf. trait `HasReference`).
- Après création : connexion automatique + redirection `client.dashboard`.

## 3. Page profil / home espace client — `/espace-client`

- Page `Pages/Client/Dashboard`, layout espace client (réutiliser `DashboardLayout` ou une variante client cohérente).
- **Liste des dossiers crédit conso** du client (`dossiers` où `user_id` = client courant) : pour chaque dossier, afficher `ref`, type de projet, montant, `status` (badge de statut consommant `theme.colors.status.*` — mapping `ApplicationStatusEnum`), et les **offres** associées (`Offer`) si présentes (Courte/Équilibrée/Souple ou selon les offres générées).
- **Gestion du mode restreint** : si l'utilisateur est en session `ROLE_CLIENT_RESTREINT` (pas de compte), la vue est **limitée au seul `dossier_ref`** de sa session, avec une bannière l'invitant à créer un compte (`/espace-client/creation`) pour retrouver et suivre tous ses dossiers. Le filtrage "un seul dossier" passe par la Policy/Gate, pas par le composant.
- Affichage par `ref` uniquement (jamais d'`id`) ; binding des liens de détail sur la `ref`.
- Composants UI Kit : `Card`, `Badge`, `Table`/`EmptyState`, `Avatar` (photo profil + fallback initiales), `Alert`/`Toast` pour la bannière.

## 4. Édition du profil + photo — `/espace-client/profil`

- Page `Pages/Client/ProfileEdit`, réservée au client complet (`ROLE_CLIENT`) — inaccessible au restreint (Gate `edit-profile`).
- **Informations modifiables** : `first_name`, `last_name`, email (avec re-vérification si changé), mot de passe (formulaire séparé), consentements.
- **Photo de profil (`avatar`)** :
  - Upload d'image, stockée dans `storage/uploads/avatar/` (extensions `.png/.jpg/.jpeg/.webp`), colonne `users.avatar` = chemin relatif (jamais le binaire), accessibilité publique via disque `public` + `storage:link` (ou route dédiée).
  - Validation type/taille à l'upload ; prévisualisation avant envoi ; fallback initiales via `Avatar` si pas de photo.
  - Peut réutiliser `FileUploader` de `core-ts` **uniquement** pour la logique d'upload HTTP (brique agnostique), sans manipulation DOM impérative dans le composant React — préférer un input contrôlé React + envoi via le client HTTP. Ne pas introduire de code DOM-couplé de `core-ts` dans React.
- Feedback succès/erreur via `Alert`/`Toast`.

---

## 4bis. Câblage complet — `routes/web.php` + middlewares (rien n'a encore été câblé)

Le câblage sécurité n'a **pas** été fait : ce prompt doit le produire intégralement. Les Guards maison existent (`GuardManager` avec `AbstractGuard::SESSION_KEY`, `GuardInterface::check()`, `RoleEnum`) et `EnsureRestrictedSessionNotExpired` existe (expiration 30 min). Il faut créer le middleware d'entrée, enregistrer les alias, réécrire `routes/web.php`, et adapter la redirection du middleware d'expiration aux 3 connexions.

> ⚠️ Vérifier l'API réelle de `GuardManager` (constantes `MODE_*`, méthode `for()`/`forRole()`, signature `check()`) **avant** d'écrire le middleware. Ne pas inventer de signatures ; adapter au code existant.

### a) Middleware d'entrée — `App\Http\Middleware\EnsureGuardAccess`

Même style que `EnsureRestrictedSessionNotExpired` (lecture du contexte via `AbstractGuard::SESSION_KEY`, injection `GuardManager`). Vérifie qu'un contexte valide existe et que son rôle est autorisé pour la zone ; **redirige vers le bon login selon la zone** (pas un login générique).

```php
final class EnsureGuardAccess
{
    public function __construct(private readonly GuardManager $guards) {}

    /** @param string ...$allowedRoles  valeurs de RoleEnum autorisées pour la zone */
    public function handle(Request $request, Closure $next, string ...$allowedRoles): Response
    {
        $context = $request->session()->get(AbstractGuard::SESSION_KEY);

        // Login de repli déduit de la zone (rôles attendus)
        $loginRoute = $this->loginRouteForRoles($allowedRoles);
        // ex. rôles CRM -> 'bo.connexion' ; rôles client/restreint -> 'client.connexion'

        if (! is_array($context) || ! isset($context['role'])) {
            return redirect()->route($loginRoute);
        }

        $guard = $this->guards->for(/* mode déduit du rôle du contexte */);
        if (! $guard->check($request)) {
            return redirect()->route($loginRoute);
        }

        if (! in_array($context['role'], $allowedRoles, true)) {
            abort(403);
        }

        return $next($request);
    }
}
```

### b) Modifier `EnsureRestrictedSessionNotExpired` (fichier existant)

Sa redirection est en dur vers `route('login')`. Avec 3 connexions, cette route **n'existe plus**. La faire pointer vers le login du mode restreint :

```php
// AVANT : return redirect()->route('login')->with(...);
// APRÈS :
return redirect()->route('suivi.connexion')
    ->with('status', 'Votre session a expiré, veuillez vous reconnecter.');
```

C'est la seule modification autorisée sur ce fichier existant (imposée par le passage à 3 connexions).

### c) Enregistrer les alias — `bootstrap/app.php`

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        'guard.access'      => \App\Http\Middleware\EnsureGuardAccess::class,
        'restricted.expiry' => \App\Http\Middleware\EnsureRestrictedSessionNotExpired::class,
    ]);
});
```

### d) `routes/web.php` — réécriture complète du bloc auth (conserver le bloc public/SEO + tunnel existant tel quel)

```php
/*
| Public site (SEO) + tunnel — CONSERVER l'existant tel quel
*/
// ... home, mentions-legales, simulation.*, produit.* ...

/*
| Connexion CLIENT — ROLE_CLIENT
*/
Route::prefix('espace-client')->name('client.')->group(function () {
    // Connexion (hors middleware)
    Route::get('connexion',  [ClientAuthController::class, 'show'])->name('connexion');
    Route::post('connexion', [ClientAuthController::class, 'authenticate']);
    // Inscription (hors middleware)
    Route::get('creation',   [ClientRegisterController::class, 'show'])->name('creation');
    Route::post('creation',  [ClientRegisterController::class, 'store']);
    Route::post('logout',    [ClientAuthController::class, 'logout'])->name('logout');

    // Zone protégée client + restreint ; restricted.expiry applique 30 min au restreint (no-op sinon)
    Route::middleware(['guard.access:ROLE_CLIENT,ROLE_CLIENT_RESTREINT', 'restricted.expiry'])->group(function () {
        Route::get('/',        [ClientDashboardController::class, 'index'])->name('dashboard');
        Route::get('dossiers/{dossier}', [ClientDossierController::class, 'show'])->name('dossiers.show'); // binding sur ref

        // Réservé au client complet (pas au restreint) → Gate edit-profile
        Route::middleware('can:edit-profile')->group(function () {
            Route::get('profil', [ClientProfileController::class, 'edit'])->name('profile.edit');
            Route::put('profil', [ClientProfileController::class, 'update'])->name('profile.update');
            Route::post('profil/avatar', [ClientProfileController::class, 'updateAvatar'])->name('profile.avatar');
        });
    });
});

/*
| Connexion SUIVI (mode restreint) — ROLE_CLIENT_RESTREINT (sans compte)
*/
Route::prefix('suivi-de-dossier')->name('suivi.')->group(function () {
    Route::get('connexion',  [SuiviAuthController::class, 'show'])->name('connexion');       // saisie ref + email
    Route::post('connexion', [SuiviAuthController::class, 'sendCode'])->name('connexion.code'); // envoi code
    Route::post('verify',    [SuiviAuthController::class, 'verify'])->name('verify');          // vérifie code -> session restreinte
});

/*
| Connexion CRM — ROLE_CRM_* (email/mdp + 2FA)
*/
Route::prefix('bo')->name('bo.')->group(function () {
    Route::get('connexion',   [CrmAuthController::class, 'show'])->name('connexion');
    Route::post('connexion',  [CrmAuthController::class, 'authenticate']);
    Route::get('connexion/2fa',  [CrmAuthController::class, 'show2fa'])->name('connexion.2fa');
    Route::post('connexion/2fa', [CrmAuthController::class, 'verify2fa']);
    Route::post('logout',     [CrmAuthController::class, 'logout'])->name('logout');

    Route::middleware('guard.access:ROLE_CRM_AGENT,ROLE_CRM_MANAGER,ROLE_CRM_ADMIN')->group(function () {
        Route::get('/',         [CrmDashboardController::class, 'index'])->name('dashboard');
        Route::get('dossiers',  [CrmDossierController::class, 'index'])->name('dossiers');
        Route::get('dossiers/{dossier}', [CrmDossierController::class, 'show'])->name('dossiers.show');

        Route::middleware('can:assign-dossiers')->group(function () { // Manager + Admin
            Route::post('dossiers/{dossier}/assign', [CrmAssignmentController::class, 'assign'])->name('dossiers.assign');
        });
        Route::middleware('can:manage-agents')->group(function () { // Admin
            Route::resource('agents', CrmAgentController::class);
            Route::get('parametres', [CrmSettingsController::class, 'index'])->name('settings');
        });
    });
});
```

### e) Contrôleurs & Gates

- Créer/adapter les contrôleurs d'auth par mode : `ClientAuthController`, `ClientRegisterController`, `SuiviAuthController`, `CrmAuthController` (+ dashboard/dossier/profile déjà cités). Chacun ouvre/ferme la session de son mode **via le guard correspondant** (`GuardManager::for(...)`), pas d'auth Laravel native.
- Les contrôleurs non encore existants sont créés en squelette fonctionnel (rendent une vue Inertia des pages définies en §1–4), sans logique métier superflue.
- Gates natifs à définir : `edit-profile` (client complet uniquement, refuse le restreint), `assign-dossiers` (Manager+Admin), `manage-agents` (Admin). Les enregistrer selon la version Laravel (provider/bootstrap).
- Route model binding sur `ref` pour `{dossier}`.

---


- Utiliser **Faker** (installer si absent : `composer require fakerphp/faker --dev`) et des **factories** (`UserFactory` existe déjà ; créer/compléter `DossierFactory`, `PersonneFactory`, `OfferFactory`, `PartnerFactory`).
- **20 utilisateurs** répartis sur tous les rôles pour couvrir les cas de test :
  - ~12 `ROLE_CLIENT` (avec `ref` `CLT-…`, certains avec avatar, certains sans)
  - ~5 `ROLE_CRM_AGENT`
  - ~2 `ROLE_CRM_MANAGER`
  - ~1 `ROLE_CRM_ADMIN`
  - (les agents CRM ont un `agent_id` matricule `AGT-…` ; les clients non)
- **Dossiers de test** cohérents :
  - Des dossiers rattachés à des clients (`user_id` renseigné) et des dossiers **anonymes** (`user_id` NULL) pour tester le mode restreint (connexion par `ref` + email de la personne liée).
  - Chaque dossier a 1 `Personne` emprunteur, certains avec co-emprunteur (`has_coborrower = true` + 2e `Personne`).
  - Varier `status` (`new`/`in_progress`/`accepte`/`refused`), `canal` (`WEB`/`CRM`), `risk_level`/`scoring` (certains scorés, d'autres NULL en attente), et l'assignation `agent_assignee_id` (certains assignés à un agent, d'autres non).
  - Quelques `Partner` (2-3) + des `Offer` rattachées à des dossiers `accepte`/`in_progress` pour tester l'affichage des offres dans l'espace client.
- **Comptes déterministes** pour se connecter facilement en test : au moins un compte fixe par rôle avec email/mot de passe connus (ex. `admin@demo.test`, `manager@demo.test`, `agent@demo.test`, `client@demo.test`, mot de passe commun documenté), en plus des comptes Faker aléatoires.
- Générer une `ref` dossier de test connue (documentée) rattachée à un dossier anonyme, pour tester le **mode restreint** (ref + email de l'emprunteur).
- Brancher le tout dans `DatabaseSeeder` ; documenter dans le récap les identifiants de connexion de test.

---

## Contraintes de sortie

- Cohérence visuelle : UI Kit + tokens `@/ui/theme` (valeurs de `DESIGN_SYSTEM.md`), styled-components, thème clair, sobre/premium — les nouvelles pages doivent être indistinguables en style de l'existant.
- Pages sous `resources/js/Pages/<Domaine>/`, composants via leur `index.ts`, TypeScript strict sans `any`.
- `ref` = identifiant public partout (URLs, affichage, liens) ; `id` jamais exposé.
- Ne pas introduire de brique DOM-couplée de `core-ts` dans React ; n'utiliser que les briques pures (HTTP/storage/utils).
- Routes & middleware : câblage **complet** fourni par ce prompt (§4bis) — création de `EnsureGuardAccess`, enregistrement des alias, réécriture du bloc auth de `routes/web.php` avec les 3 connexions + inscription + zones protégées, et **modification de `EnsureRestrictedSessionNotExpired`** (redirection `route('login')` → `route('suivi.connexion')`, imposée par le passage à 3 connexions). Vérifier l'API réelle de `GuardManager` avant d'écrire le middleware.
- Seeders : Faker + factories, 20 users tous rôles + dossiers/personnes/offres cohérents, comptes déterministes documentés.
- Pré-requis : suppression `Tag`, correction FK `offers.application_id → dossiers`, complétion `Partner`/`Offer` (fillable + relations), `OfferStatusEnum` si absent.
- Livrables : liste des pages créées (chemins), **middleware `EnsureGuardAccess` + diff `bootstrap/app.php` + `routes/web.php` complet réécrit + modif `EnsureRestrictedSessionNotExpired` + contrôleurs d'auth + Gates définis**, factories/seeders créés, identifiants de connexion de test (par rôle + ref restreinte), et confirmation de la cohérence visuelle avec l'UI Kit.
