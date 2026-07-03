# Méga-Prompt — Mise à niveau Structure de Données + Système d'Authentification (Guards)

## Nature & périmètre

Refactor incrémental sur code **déjà généré** (migrations, modèles `User`, `Dossier`, `Personne`, `UserRequest`, `Session`, `Tag`). Deux blocs :
- **Bloc A** — Mise à niveau de la structure de données (corrections + colonnes + tables + enums + génération des `ref`).
- **Bloc B** — Système d'authentification à 3 modes via des **Guards** custom.

Analyser l'existant avant de modifier ; ne réécrire que le nécessaire, préserver ce qui fonctionne (tunnel, moteur front, isolation API Python).

---

## Principe transverse — la `ref` est l'identifiant public, l'`id` reste interne

Décision d'architecture appliquée partout :
- L'`id` auto-increment reste la **PK technique interne** ; il ne circule **jamais** vers les interfaces, URLs, payloads Inertia/API.
- La **`ref`** (string unique, lisible) est l'**identifiant métier public** : affichée dans les interfaces, utilisée dans les URLs, et cible des **FK métier**.
- **Route model binding sur `ref`** : chaque modèle exposé implémente `getRouteKeyName(): string { return 'ref'; }`. Les URLs ressemblent à `/crm/dossiers/DOSS-20260703-01H…`, jamais `/crm/dossiers/42`.
- **Exposition front** : les ressources/props Inertia n'incluent pas l'`id` (ou le masquent) ; le front n'affiche et ne manipule que la `ref`.
- Toute `ref` servant de clé de jointure ou de lookup est `unique` **et indexée**.
- Choix assumé (dette technique acceptée, appli non destinée à la production) : FK sur colonnes string (`ref`, `agent_id`) plutôt que sur `id` — surcoût d'index négligeable à cette échelle, gain de lisibilité métier prioritaire.

---

# BLOC A — Structure de données

## A.1 Corrections des bugs existants

Dans la migration `create_users_table` et les modèles :
- `users` : `$table->id()->nullable;` est buggé → `$table->id();` (PK non nullable, appel correct).
- Modèle `User` : `#[Fillable(['name', 'email', 'password'])]` est désaligné (la table a `first_name`/`last_name`, pas `name`) → `Fillable(['first_name', 'last_name', 'email', 'password'])` + colonnes ajoutées ci-dessous.
- Modèle `User` : ajouter le cast de `role` vers `RoleEnum` (cf. A.4) et les relations vers les dossiers (A.3).
- Modèle `Dossier` : ajouter la relation `user(): BelongsTo` (le `user_id` existe déjà en base mais n'est pas relié), et intégrer `ref` à la stratégie de génération (A.5). Ajouter `ref` au `Fillable` si nécessaire (ou le gérer en `creating`, cf. A.5).
- Modèle `Tag` (vide) : lui donner sa structure (A.3, tags CRM).

## A.2 Colonnes ajoutées (migrations additives — ne pas recréer les tables existantes)

### `dossiers` (migration `add_auth_columns_to_dossiers`)
- `ref` : string, **unique**, indexée — générée à la création (A.5). *(la migration actuelle a déjà `ref` unique ; si présent, ne pas dupliquer, sinon l'ajouter)*
- `agent_assignee_id` : string, **nullable**, FK → `users.agent_id` (agent en charge du dossier). NULL tant que non assigné.
- `agent_application_creator_id` : string, **nullable**, FK → `users.agent_id` (agent ayant créé le dossier via le tunnel light CRM). NULL si origine WEB.
- `canal` : string (enum `CanalEnum`) — `WEB` (tunnel public client) ou `CRM` (tunnel light agent). NOT NULL.
- `risk_level` : string (enum `RiskLevelEnum`), **nullable** (rempli après scoring Python).
- `scoring` : integer, **nullable** (note de scoring renvoyée par l'API Python).

> `user_id` (client propriétaire, déjà présent) et `agent_assignee_id` (agent en charge) sont **deux choses distinctes** — ne pas les confondre.

### `users` (migration `add_ref_and_agent_id_to_users`)
- `ref` : string, **unique**, indexée — générée à la création, préfixe contextuel `CLT-`/`AGT-` (A.5).
- `agent_id` : string, **unique**, **nullable** — matricule agent, renseigné **uniquement** pour les rôles `ROLE_CRM_*` (NULL pour les clients). Indexée (sert de cible de FK).
- `role` : pas de changement de colonne, mais casté vers `RoleEnum` (A.4). Revoir la valeur par défaut `'user'` → une valeur cohérente avec `RoleEnum` (ex. `ROLE_CLIENT`).
- Ajouter `first_name`/`last_name` s'ils manquent (la migration les a, le modèle doit suivre).

### `user_requests` (migration `add_attempts_to_user_requests`)
- `attempts` : integer, **nullable**, `default(0)` — compteur de tentatives de saisie du code (anti-brute-force).

## A.3 Nouvelles tables

### `dossiers_provenance` (1-to-N — une ligne par accès/connexion)
- `id` : PK auto-increment (interne).
- `dossier_ref` : string, FK → `dossiers.ref`, indexée.
- `ip` : string(45) (IPv4/IPv6), nullable.
- `device` : string, nullable (user-agent / device détecté).
- `timestamp` : timestamp.

> 1-to-N assumé : chaque accès/connexion au dossier (création initiale, puis chaque connexion en mode restreint ou client) ajoute une ligne. Permet de tracer l'historique IP/device.

### `dossiers_logs` (historique des actions)
- `id` : PK auto-increment (interne).
- `dossier_ref` : string, FK → `dossiers.ref`, indexée.
- `initiator_type` : string (enum `InitiatorTypeEnum`) — `CLIENT`, `AGENT`, `PROCESSOR`, `CLIENT_RESTREINT`.
- `initiator_ref` : string, **nullable**, FK → `users.ref`. Renseigné pour `CLIENT`/`AGENT` ; **NULL** pour `CLIENT_RESTREINT` (pas de compte → pas de `users.ref`) et pour `PROCESSOR` (action système/API Python).
- `action` : string (enum `ApplicationActionTypeEnum`).
- `context` : json, nullable.
- `timestamp` : timestamp.

### `tags` + pivot (CRM, mode "Apple Finder")
- `tags` : ajouter `name` (string) et `color` (string, hex) à la table actuellement vide.
- `dossier_tag` : pivot many-to-many (`dossier_ref` → `dossiers.ref`, `tag_id` → `tags.id`), + `timestamps`.

## A.4 Enums

Créer les enums PHP (Backed Enums), avec `label()` FR et helpers (`values()`, `choices()`) au même pattern que les enums existants (`Core\Simulator\Enum`).

- `App\Auth\Security\RoleEnum` (string) : `ROLE_CLIENT_RESTREINT`, `ROLE_CLIENT`, `ROLE_CRM_AGENT`, `ROLE_CRM_MANAGER`, `ROLE_CRM_ADMIN`.
  - Ajouter une notion de **hiérarchie CRM** : `ROLE_CRM_ADMIN > ROLE_CRM_MANAGER > ROLE_CRM_AGENT`. Prévoir une méthode `level(): int` ou `includes(RoleEnum): bool` pour tester "au moins ce niveau".
  - Méthode utilitaire `isCrm(): bool` / `isClient(): bool` pour simplifier les checks.
- `App\...\Enum\CanalEnum` (string) : `WEB`, `CRM`.
- `App\...\Enum\RiskLevelEnum` (string) : échelle de risque (ex. `A`,`B`,`C`,`D`,`E`, ou `LOW`/`MEDIUM`/`HIGH` — choisir et documenter ; cohérent avec la sortie prévue de l'API Python, cf. `features.md` : note A→E ou "risque élevé").
- `App\...\Enum\InitiatorTypeEnum` (string) : `CLIENT`, `AGENT`, `PROCESSOR`, `CLIENT_RESTREINT`.
- `App\...\Enum\ApplicationActionTypeEnum` (string) : actions loguées (ex. `DOSSIER_CREATED`, `DOSSIER_VIEWED`, `STATUS_CHANGED`, `ASSIGNED_TO_AGENT`, `SCORING_RECEIVED`, `OFFER_GENERATED`, `NOTE_ADDED`, `LOGIN_RESTREINT`, `LOGIN_CLIENT`, `LOGIN_AGENT` — liste à compléter, extensible).
- Caster ces enums dans les modèles correspondants (`Dossier`, `User`, `DossierLog`).
- Créer aussi si absent `App\Auth\UserRequest\UserRequestTypeEnum` (déjà référencé par le modèle `UserRequest`) : types de requêtes (ex. `LOGIN_CODE_RESTREINT`, `LOGIN_CODE_CLIENT`, `LOGIN_CODE_AGENT_2FA`, `EMAIL_VERIFICATION`, `PASSWORD_RESET`).

## A.5 Génération des `ref` (ULID + préfixe contextuel)

- Format : `{PREFIX}-{Ymd}-{ULID}` où le ULID est généré via `Str::ulid()`.
  - `dossiers.ref` → préfixe `DOSS` (ex. `DOSS-20260703-01H9X…`). *(Note : la spec initiale évoquait `APP` ; retenir un préfixe unique et documenté — proposer `DOSS`, confirmer si tu préfères `APP`.)*
  - `users.ref` → préfixe `CLT` si rôle client (`ROLE_CLIENT`/`ROLE_CLIENT_RESTREINT`), `AGT` si rôle CRM (`ROLE_CRM_*`).
- Génération centralisée dans un **trait réutilisable** `App\Concerns\HasReference` (ou service dédié) branché sur l'événement Eloquent `creating` : si `ref` vide, la générer selon le contexte du modèle. Éviter la génération éparpillée.
- `agent_id` (matricule) : généré à la création **uniquement** si le rôle est `ROLE_CRM_*` (sinon reste NULL). Format matricule à définir (ex. `AGT-{6 chiffres}` ou ULID court) — proposer et documenter.
- Tous les modèles exposés implémentent `getRouteKeyName(): string => 'ref'`.

---

# BLOC B — Système d'Authentification (3 modes via Guards)

Namespace racine : `App\Auth\Security\`. Sous-namespaces : `Guard\` (et enum `RoleEnum` déjà en `App\Auth\Security\`).

## B.0 Décision d'architecture : Guards custom + Gates/Policies natifs

- **Guards custom maison** (`App\Auth\Security\Guard\`) : responsables des **critères d'entrée** (identité, mode d'auth, rôle attendu, expiration de session). C'est le "gardien" qui vérifie qui peut entrer et sous quel régime.
- **Autorisation fine (RBAC CRM)** : utiliser les **Gates/Policies natifs de Laravel** pour les permissions par rôle (agent/manager/admin), plutôt qu'une couche `Gate` maison — on s'appuie sur l'existant du framework, cohérent avec "je ne réinvente pas la roue". Donc **pas** de `App\Auth\Security\Gate\` maison ; le mot "porte d'entrée" est couvert par les Gates Laravel.

## B.1 Les 3 modes d'authentification

### Mode 1 — Client restreint (`ROLE_CLIENT_RESTREINT`) — SANS COMPTE
- **Cible** : un visiteur ayant terminé un tunnel, qui veut suivre **uniquement le dossier qu'il vient de créer**, sans créer de compte.
- **Connexion** : saisir sa `dossiers.ref` + un email (celui de l'emprunteur **ou** du co-emprunteur lié au dossier) → réception d'un **code de connexion unique** (via `user_requests`, type `LOGIN_CODE_RESTREINT`, `user_id` = NULL puisque pas de compte) → saisie du code → session ouverte.
- **Pas de row `users`** : l'identité restreinte vit dans la **session** (payload : `dossier_ref`, email vérifié, rôle `ROLE_CLIENT_RESTREINT`, expiration). Aucune création d'utilisateur.
- **Périmètre** : accès en lecture au seul dossier ciblé (+ ses offres/scoring). Depuis l'interface, un lien "créer un vrai espace client" permet de convertir en compte `ROLE_CLIENT`.
- **Expiration : 30 minutes** (cf. B.3).
- **Traçabilité** : les accès sont logués avec `initiator_type = CLIENT_RESTREINT` et `initiator_ref = NULL` (cf. A.3). Chaque connexion ajoute une ligne `dossiers_provenance`.

### Mode 2 — Client (`ROLE_CLIENT`) — avec compte
- **Connexion** : `/auth/login`, soit email × mot de passe, soit email + code de connexion unique (`user_requests`, type `LOGIN_CODE_CLIENT`).
- **Auth Laravel classique** (session), row `users` avec `ROLE_CLIENT`.
- **Périmètre** : espace client — retrouve **tous ses dossiers**, modifie son profil.
- **Expiration** : pas de limite spécifique (comportement session standard, cf. B.3).

### Mode 3 — Agent CRM (`ROLE_CRM_AGENT|MANAGER|ADMIN`) — avec compte + 2FA
- **Connexion** : `/{crm,bo}/login`, email × mot de passe, **puis** code de connexion unique reçu par email (2FA — `user_requests`, type `LOGIN_CODE_AGENT_2FA`).
- **Auth Laravel classique** (session), row `users` avec un rôle `ROLE_CRM_*` et un `agent_id` (matricule).
- **RBAC** (Gates/Policies natifs, périmètre à affiner plus tard, hiérarchie `ADMIN > MANAGER > AGENT`) :
  - `ROLE_CRM_ADMIN` : tous les droits + gestion des comptes agents + paramètres application.
  - `ROLE_CRM_MANAGER` : tous les dossiers, assignation aux agents, étude des dossiers "risque élevé", assignation auto des autres dossiers si l'API Python ne l'a pas fait.
  - `ROLE_CRM_AGENT` : traitement des dossiers assignés + création de dossiers via le tunnel light CRM.
- **Expiration** : pas de limite spécifique (cf. B.3).

## B.2 Contrats de code — `App\Auth\Security\Guard\`

### `GuardInterface`
```php
namespace App\Auth\Security\Guard;

interface GuardInterface
{
    /** Le mode/rôle géré par ce guard. */
    public function role(): RoleEnum;

    /** Vérifie les critères d'entrée (identité, rôle, session valide, non expirée). */
    public function check(Request $request): bool;

    /** Ouvre la session/contexte d'authentification après validation des identifiants. */
    public function authenticate(array $credentials): AuthResult;

    /** Durée de vie de la session pour ce mode (null = pas de limite spécifique). */
    public function sessionLifetime(): ?int;   // en minutes ; 30 pour restreint, null sinon

    /** Termine la session (logout). */
    public function logout(Request $request): void;
}
```

### Dispatch / Factory
- Créer un **`GuardManager`** (ou `GuardFactory`) qui, selon le **mode d'auth sollicité** (restreint / client / agent — déduit de la route, d'un paramètre explicite, ou du rôle attendu), retourne le guard concret adéquat. Le dispatch ne doit pas être un `switch` éparpillé : centralisé, extensible (ajouter un mode = ajouter un guard + l'enregistrer).
- Une **classe abstraite `AbstractGuard`** implémente `GuardInterface` et factorise le commun (accès session, écriture de log via `dossiers_logs`, gestion d'expiration adossée à `sessions`), les guards concrets ne surchargent que leurs spécificités.

### Guards concrets
- `EspaceClientRestreintGuard` (mode 1) : vérifie `ref` + email lié (emprunteur/co-emprunteur) + code `user_requests`, ouvre une session **sans row users**, `sessionLifetime() = 30`. Restreint l'accès au seul `dossier_ref` en session.
- `EspaceClientGuard` (mode 2) : auth classique email/mdp ou email/code, `ROLE_CLIENT`, `sessionLifetime() = null`.
- `CrmGuard` (mode 3) : auth email/mdp **+ 2FA code**, rôle `ROLE_CRM_*`, `sessionLifetime() = null`. Expose l'accès RBAC via les Gates Laravel.

### Service OTP (codes de connexion)
- Un service unique (`LoginCodeService` ou similaire) qui **génère, envoie (email), et vérifie** les codes via `user_requests` — mutualisé entre les 3 modes (types distincts via `UserRequestTypeEnum`).
- Sécurité : code haché au repos (stocker le hash dans `token`), `expires_at` court (ex. 10 min), incrément de `attempts` à chaque essai, blocage au-delà d'un seuil, `is_used` passé à true après succès (usage unique).

## B.3 Gestion de l'expiration de session (Guard adossé à Laravel)

- S'appuyer sur le **mécanisme natif** : table `sessions` + `config/session.php`, sans réinventer. Ne pas recoder un stockage de session.
- **Client & CRM** (`ROLE_CLIENT`, `ROLE_CRM_*`) : pas de limite spécifique → comportement standard de `config/session.php`.
- **Client restreint** (`ROLE_CLIENT_RESTREINT`) : durée de vie **30 min**. Implémentation via le guard + un **middleware** qui vérifie, à chaque requête, l'horodatage d'ouverture stocké dans le payload de session (ex. `restricted_started_at`) et invalide la session au-delà de 30 min (logout + redirection). Le guard fournit `sessionLifetime()` ; le middleware applique la règle.
- Documenter clairement où vit l'expiration (payload session + middleware), sans toucher au fonctionnement global des autres guards.

## B.4 Traçabilité (câblage avec le Bloc A)
- Toute connexion réussie : 1 ligne `dossiers_provenance` (IP/device) quand elle concerne un dossier (mode restreint notamment) + 1 ligne `dossiers_logs` (`LOGIN_*`).
- Actions métier ultérieures (changement de statut, assignation, ajout de note, réception scoring) : loguées via `dossiers_logs` avec le bon `initiator_type`/`initiator_ref`.
- `PROCESSOR` = actions de l'API Python (scoring reçu, assignation auto) → `initiator_ref` NULL.

---

## Ordre d'exécution recommandé
1. Corrections bugs (A.1) + enums (A.4) + trait `HasReference` (A.5).
2. Migrations additives (A.2) + nouvelles tables (A.3).
3. Modèles : casts, relations, `getRouteKeyName`, génération `ref`/`agent_id`.
4. Service OTP + `GuardInterface`/`AbstractGuard`/`GuardManager` + guards concrets (B.2).
5. Middleware d'expiration restreinte (B.3) + câblage traçabilité (B.4).

## Contraintes de sortie
- `ref` = identifiant public partout ; `id` interne, jamais exposé (URLs, props Inertia, interfaces). Route binding sur `ref`.
- Migrations **additives** (ne pas dropper/recréer les tables existantes) ; PHP `declare(strict_types=1)`, conventions Laravel.
- Enums Backed avec `label()`/helpers, castés dans les modèles.
- Dispatch des guards centralisé et extensible ; expiration adossée au natif Laravel (sessions + config), pas de réimplémentation.
- Ne rien exposer du microservice Python au front ; les actions `PROCESSOR` restent côté serveur.
- Points à confirmer signalés dans le prompt (préfixe `DOSS` vs `APP` ; échelle `RiskLevelEnum` ; format matricule `agent_id`) : proposer une valeur par défaut et la documenter plutôt que bloquer.
- Livrables : rapport des corrections, liste des migrations créées, enums, trait `HasReference`, arbre du namespace `App\Auth\Security\Guard\`, et un schéma texte du flux d'authentification pour chacun des 3 modes.
