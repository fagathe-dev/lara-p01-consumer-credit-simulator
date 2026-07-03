# Modification dans les tables 

1. dossiers : 
- `ref`: une référence de dossier unique pour chaque dossier qui est généré à la création `'DOSS' . '-' . (new DatetimeImmutable('now'))->format('Ymd) . '-' . unique_id()`
- `agent_assignee_id` : qui sera `users.agent_id` dont le rôle sera `ROLE_CRM_*`, c'est l'agent à qui le dossier est assigné
- `agent_application_creator_id` : qui sera `users.agent_id` dont le rôle sera `ROLE_CRM_*`, c'est l'agent qui créer le dossier si le dossier est crée dans le tunnel light du CRM
- `canal` : provenance du dossier `'CRM' | 'WEB'` où WEB est le tunnel public pour les clients et CRM est le tunnel light du CRM
- `risk_level` : nullable - enum `RiskLevelEnum` 
- `scoring` : nullable - integer

2. users
- `agent_id` : une référence unique pour les agents (un matricule) qui possède un rôle `ROLE_CRM_*`
- `ref`: une référence de dossier unique pour chaque dossier qui est généré à la création `'{CLT,AGT}' . '-' . (new DatetimeImmutable('now'))->format('Ymd) . '-' . unique_id()`
- `role` : pas de modification mais ajouter un enum `App\Auth\Security\RoleEnum` et lié cet enum au modèle `User` dans la partie `casts`

3. dossiers_provenance
- `id` : integer auto incrément classsique
- `dossier_ref` : référence unique du dossier `dossiers.ref`
- `ip` : l'adresse IP utilisé par le client
- `device` : le device utilisé par le client 
- `timestamp` : timestamp

4. dossiers_logs
- `id` : integer auto incrément classsique
- `dossier_ref` : référence unique du dossier `dossiers.ref`
- `initiator_type` : `'CLIENT' | 'AGENT' | 'PROCESSOR'` 
- `initiator_ref` : ce sera un `users.ref` si le `initiator_type` est soit `'CLIENT' | 'AGENT'`
- `action` : enum `ApplicationActionTypeEnum`
- `context` : un champs de type json
- `timestamp` : timestamp

5. user_requests
- `attemps` : integer - nullable - default(0)

# Pour la partie sessions

pas de limite `expiration` pour les rôles `ROLE_CLIENT` et `ROLE_CRM_*`
mais une limite de 30 minutes pour les `ROLE_CLIENT_RESTREINT`
Dans les 2 cas, l'expiration sera géré via de gate-guard custom en s'appuyant sur le fonctionnement interne de laravel avec la table sessions et `config/sessions.php`, je vais pas réinventer la roue simplement l'intégrer à mon bolide
