Je veux revoir les steps et le stepper. Afin d'améliorer l'UX, je veux créer un stepper qui sera un peu différent. Je veux modifier la gestion des steps au niveau du stepper, je veux ajouter des sections dans le tunnel, une section a plusieurs steps. 

Voici la répartion par section : 
1. Section 1 : Votre projet
    - step 1 : type projet
    - step 2 : montant, durée
2. Section 2 : Votre situation
    - step 3 : situation familiale
    - step 4 : situation logement
3. Section 3 : Situation professionnelle
    - step 5 : situation pro emprunteur
    - step 6 : situation pro co-emprunteur (si coemp true step 3)
4. Section 4 : Situation financière 
    - step 7 : Revenus
    - step 8 : charges
5. Section 5 : Votre profil
    - step 9 : informations personnelles (civilité, nom, prenom)  enmprunteur
    
    - step 10 : informations personnelles (nom, prenom, date de naissance, nationalité)  co-enmprunteur
    - step 11 : informations de contact + consentements emprunteur
    - step 12 : informations de contact + consentements co-emprunteur

évidemment les steps pour les informations du co-emprunteurs ne doivent pas être affichés si coemp `false` step 3
ça améliore l'UX parce que même si dans le tunnel pas d'avancée sur le stepper, la barre de progrès avance pas d'impression de tunnel interminiable et stagnation dans la complétion du tunnel 