Je veux m'occuper de la partie authentification. Je veux créer une authentification assez complexe. 

Lorsqu'un utilisateur fait un tunnel, à la fin il accède à la page de résultats avec la restitution de ses dossiers mais il n'a aucun moyen de le suivre donc mon idée c'est de créer une authentification en "mode restreint" qui lui permet d'accéder à un espace client en mode "restreint" avec un accès uniquement au dossier qu'il vient de créer. Dans l'interface, il aura un lien pour accéder à la page pour créer un vrai espace client. 

En tout et pour tout, il me faut 3 modes d'authentification : 
- en mode "restreint", c'est un accès uniquement au dossier qu'il a crée
- accès client pour les clients, qui peuvent se rendre sur leur espace client pour retrouver leurs dossiers et modifier les informations de leur profil
- accès pour les agents, c'est l'accès au CRM pour avoir le suivi des dossiers clients et l'étude des dossiers 

# Accès mode restreint

1. Modalités de connexion
avoir son numéro de dossiers client `dossiers.ref` unique et saisir son e-mail (e-mail emp ou co-emp lié au dossier) pour avoir un code de connexion unique

2. Sécurité
Rôle : `ROLE_CLIENT_RESTREINT`
Ce sera une connexion de 30 minutes et gérer via les cookies côté `laravel`

# Accès à l'espace client

1. Modalité de connexion 
avoir un compte : `/auth/login`
authentification e-mail x mot de passe ou e-mail et code de connexion unique (reçu par e-mail)

2. Sécurité 
Rôle : `ROLE_CLIENT`
Connexion utilisant l'authentification laravel classique 
Connexion gérer soit avec les sessions ou cookies php, je ne sais pas trop 

# Accès à l'espace admin - CRM

1. Modalités de connexion
avoir un compte : `/{crm,bo}/login`
saisir l'e-mail x mot de passe, ensuite saisir un code de connexion unique (reçu par e-mail)

2. Sécurité
Rôle : `ROLE_CRM_{AGENT,MANAGER,ADMIN}`
Connexion utilisant l'authentification laravel classique 
Connexion gérer soit avec les sessions ou cookies php, je ne sais pas trop 

C'est l'accès à l'espace dédié aux agents uniquement qui auront un accès lié au RBAC (Role Based Access Control). il y aura trois rôles pour les agents : `ROLE_CRM_AGENT`,  `ROLE_CRM_MANAGER` et  `ROLE_CRM_ADMIN`. 
Le périmètre des actions de chaque rôle sera à définir plus tard mais j'ai une petite idée : 
- `ROLE_CRM_ADMIN` : aura tous les droits y compris la gestion des agents - gestion de leurs comptes - gérer les paramètres de l'application
- `ROLE_CRM_MANAGER` : accès à tous les dossiers, assigner des dossiers aux agents, l'étude des dossiers avec un "risque élévé", sinon les autres dossiers peuvent assignés aléatoire aux agents en fonctions des dossiers qu'ils ont en cours de traitement, si l'api python ne l'a pas fait automatiquement
- `ROLE_CRM_AGENT` : c'est le rôle le plus bas, traitement des dossiers qui lui sont assignés et créer des dossiers via le tunnel light dans le CRM 
**Hiérarchie des rôles :** `ROLE_CRM_ADMIN` > `ROLE_CRM_MANAGER` > `ROLE_CRM_AGENT`
