# Roadmap & Liste des Fonctionnalités (Features)

Ce document liste exhaustivement les fonctionnalités à développer pour le clone du simulateur B2C et de son CRM d'administration. Il est divisé par espaces et acteurs.

---

## 👤 1. Espace Client (Front-Office / Acquisition B2C)

**Cible :** Les prospects cherchant à simuler et demander un crédit.

### A. Le Site Vitrine

#### Landing Page optimisée conversion
- Accroche commerciale, réassurance (sécurité, rapidité) et simulateur d'appel en haut de page

#### Pages Produits (SEO)
- Pages dédiées par type de prêt (Prêt Auto, Prêt Travaux, Prêt Personnel) expliquant les spécificités

#### Mentions Légales & RGPD
- Pages obligatoires pour le secteur financier (TAEG fixe, "Un crédit vous engage...", politique de confidentialité)

### B. Le Simulateur Interactif (Accroche)

#### Calcul en temps réel
- Mise à jour immédiate de la mensualité, du TAEG et du coût total du crédit à chaque modification

#### UX Financière
- Utilisation stricte d'inputs numériques avec masques de saisie monétaires (séparateurs de milliers, ex: 15 000 €) au lieu de sliders, pour une précision maximale et une réduction de la charge cognitive

### C. Le Tunnel de Demande (Onboarding)

#### Formulaire Multi-étapes (Progressive Disclosure)
- Étape 1 : Le Projet (Type, Montant, Durée)
- Étape 2 : Situation & Résidence
- Étape 3 : Situation Professionnelle
- Étape 4 : Finances (Revenus & Charges)
- Étape 5 : Identité & Contact (Emprunteur et Co-emprunteur)

#### Affichage Conditionnel
- Disparition/Apparition dynamique des champs selon les réponses (ex: le bloc "Co-emprunteur" n'apparaît que si l'utilisateur est marié ; "Période d'essai" si "CDI")

#### Validation côté Client
- Validation instantanée via React (Zod / React Hook Form) avant soumission

#### Écran de Succès
- Confirmation de la prise en compte du dossier et explication des prochaines étapes (réponse de principe sous 24h)

---

## 💼 2. Espace Conseiller (Back-Office / CRM Interne)

**Cible :** L'équipe commerciale et les analystes crédit.

### A. Sécurité & Authentification

#### Login Custom
- Connexion sécurisée "from scratch" (sans package) réservée aux administrateurs

#### Gestion de Session
- Déconnexion propre, invalidation des sessions

### B. Tableau de Bord (Le Pipeline)

#### Vue Kanban / Liste
- Affichage des dossiers entrants triés par ApplicationStatusEnum (Nouveau, En cours, Accepté, Refusé)

#### Système de Tags (Mode "Apple Finder")
- Création d'une interface dans les paramètres pour configurer des étiquettes (Tags) avec des codes couleurs personnalisés (ex: [VIP] en violet, [Risque Élevé] en rouge)
- Possibilité d'assigner ces pastilles de couleur aux dossiers pour ajouter un critère de différenciation visuelle immédiat

#### Recherche & Filtres
- Filtrer les dossiers par tag, type de projet, statut ou nom du client

### C. Fiche Détail du Dossier

#### Vue 360° du Client
- Affichage structuré de toutes les données saisies dans le tunnel (Revenus, Charges, Co-emprunteur)

#### Résultats du Scoring
- Affichage du Taux d'Endettement, Reste à vivre et Score de Risque calculés par l'API Python

#### Gestion des Offres
- Visualisation des 3 offres générées (Courte, Équilibrée, Souple)

#### Actions Manuelles
- Possibilité pour le conseiller de forcer le passage d'un dossier en "Accepté" ou "Refusé", et d'ajouter des notes internes

---

## ⚙️ 3. Backend Laravel (L'Orchestrateur)

**Cible :** Le système logiciel.

### Nettoyage des Données
- Service de parsing pour convertir les inputs monétaires formatés du front (ex: "15 000 €") en décimaux stricts (15000.00) avant insertion en base

### Validation Stricte (Form Requests)
- Double vérification côté serveur avec les règles conditionnelles (ex: `required_if:family_situation,marie`)

### Asynchronisme (Queues & Jobs)
- Dès la soumission d'un dossier, création d'un Job en arrière-plan pour contacter l'API Python sans bloquer l'UX du client

### Notifications
- Envoi d'emails transactionnels (Confirmation de réception pour le client, Alerte de nouveau dossier pour le conseiller)

---

## 🐍 4. Microservice de Scoring (API Python)

**Cible :** Moteur décisionnel financier (FastAPI ou Flask).

### A. Algorithme d'Analyse (Endpoint /score)

#### Calculs Financiers
- Calcul du Taux d'Endettement (Charges / Revenus * 100)
- Calcul du Reste à Vivre Foyer (Revenus - Charges)

#### Scoring de Risque
- Attribution d'une note (ex: de A à E) ou d'un statut "Automatiquement Refusé" (ex: si taux d'endettement > 35%)

### B. Génération des Propositions Commerciales

#### Matrice d'Offres
- Si le dossier est éligible, l'API calcule et retourne 3 scénarios d'emprunt :
  - **Option Rapide (Courte)** : Mensualité forte, Durée courte, TAEG avantageux
  - **Option Équilibrée** : Mensualité moyenne, Durée standard
  - **Option Souple (Longue)** : Mensualité basse, Durée longue, Coût total du crédit plus élevé
