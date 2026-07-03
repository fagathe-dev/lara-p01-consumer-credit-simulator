# Projet - dossier

**Type projet :** Auto/Moto, Regroupement de crédits, Travaux, Autre, Famille/Loisir
**Montant souhaitée :** type numeric, supérieur à 0
**Durée souhaitée :** 6,12,24,36,48,60,72,84,96,108,120

# Situation - dossier

**Situation familiale :** Célibataire, Marié(e), PACS, Divorcé(e) / veuf(ve)
**Année situation :** format AAAA Si marié, pacs ou divorcé(e) / veuf(ve)
**Comprunteur :** Oui ou Non, par défaut obligatoire si situation familiale = marié

# Résidence - dossier

**Situation logement :** logement de fonction, propriétaire, hébergé (famille/amis), locataire
**Année logement :** format AAAA si propriétaire ou locataire 

# Situation professionnelle - personne

## Secteur d'Activité
**Code secteur (2 chiffres):**
- 10 : Privé
- 20 : Public
- 30 : Agricole
- 40 : Indépendant/Libéral
- 50 : Retraité
- 60 : Étudiant
- 70 : Chômeur
- 80 : Inactif

## Profession par Secteur
**Code profession (2 chiffres) selon le secteur :**

### Privé (10)
01 - Cadre supérieur
02 - Ingénieur
03 - Cadre moyen
04 - Technicien
05 - Contremaître / Agent de maîtrise
06 - Agent de sécurité
07 - Employé de commerce
08 - Assistante maternelle
09 - Employé de bureau
10 - Caissier vendeur en magasin
11 - Ouvrier
12 - Représentant salarié
13 - Chauffeur et livreur
14 - Infirmière et profession paramédicale
15 - Employé et agent administratif
16 - Agent de service

### Public (20)
01 - Cadre supérieur et professeur
02 - Cadre moyen Instituteur
03 - Ouvrier d'Etat
04 - Militaire Gendarme Policier Pompier
05 - Aide soignant hospitalier

### Agricole (30)
01 - Propriétaire Agricole
02 - Salarié Agricole

### Indépendant/Libéral (40)
01 - Chef d'entreprise
02 - Artisan
03 - Commerçant
04 - VRP sans fixe
05 - Profession libérale
06 - Profession libérale médicale

### Retraité (50)
01 - Retraité secteur privé
02 - Retraité secteur public

### Étudiant (60)
01 - Étudiant

### Chômeur (70)
01 - Demandeur d'emploi

### Inactif (80)
01 - Sans profession
02 - Invalide et pensionné

## Codes Composites
Combinaison: `$codeSecteur.$codeProfession` (ex: 10.01 pour Privé - Cadre supérieur)

**Type de contrat:** CDI, Stage, Interim, CDD, Autres (optionnel selon le secteur)
**Période d'essai terminée:** Oui (sélectionner par défaut) ou non, obligatoire Si type de contrat = CDI
**Année situation professionnelle:** Mois format MM et Année AAAA

# Situation financières - Revenus - dossier
**Revenus net mensuel, avant impôt sur le revenu :** type numeric, supérieur à 0
**Revenus locatifs (optionnel) :** type numeric
**Allocation (optionnel) :** type numeric
**Autres revenus (optionnel) :** type numeric

# Situation financières - charges - dossier
**Logement (loyer ou mensualité crédit consommation) :** type numeric, supérieur à 0 (obligatoire si locataire, peut être à 0 si maison crédit fini de payer)
**Montant crédit immobilier restant à payer (optionnel) :** type numeric (obligatoire si propriétaire, peut être à 0 si maison crédit fini de payer)
**Valeur du bien (optionnel):** type numeric, supérieur à 0 (obligatoire si propriétaire)
**Crédit consommation en cours :** Oui ou non (non par défaut)
**Total mensualité (optionnel) :** type numeric, supérieur à 0 obligatoire Si Crédit consommation en cours à oui 
**Montant restant à rembourser :** type numeric, supérieur à 0 obligatoire Si Crédit consommation en cours à oui 
**Autres charges (versement de pensions alimentaires, frais de garde, dettes, ...) (optionnel) :** type numeric, supérieur à 0

# Identité Emprunteur et Co-Emprunteur - état civil - personne
**Civilité :** M, Mme ou Autre
**Nom :** type string
**Nom de naissance (optionnel):** type string, obligatoire Si marié et civilité = Mme
**Prénom :** type string
**Date de naissance :** JJ/MM/AAA (majeur obligatoire)
**Pays de naissance :** France, UE, Hors UE
**Nationalité :** France, UE, Hors UE optionnel si né en france 

# Informations de contact - personne
**Numéro de téléphone :** format FR
**Adresse e-mail :** format email
**Consentement utilisation de données :** Oui et non, Consentement utilisation des données pour transmettre les données aux partenaire crédit consommation et être contacter par un conseiller en plateforme pour l'étude du dossier
**Consentement démarchage :** Oui et non, Consentement utilisation des données pour le démarchage téléphonique par nos partenaires ou par nos conseillers en plateforme
**Consontement publicitaires :** Oui et non, Consentement utilisation des données pour encoyer les nouvelles offres des partenaires ou par nous