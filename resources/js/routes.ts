/**
 * Central route path constants for the public site + tunnel.
 * Single source of truth for internal linking (SEO maillage) and CTAs.
 */

export const routes = {
  home: '/',
  mentionsLegales: '/mentions-legales',
  tunnel: '/simulation/credit-consommation/',
  resultat: '/simulation/credit-consommation/resultat',
  produits: {
    autoMoto: '/pret-auto-moto',
    rachatCredits: '/rachat-de-credits',
    travaux: '/pret-travaux',
    personnel: '/pret-personnel',
    familleLoisirs: '/pret-famille-loisirs',
  },
  espaceClient: {
    connexion: '/espace-client/connexion',
    creation: '/espace-client/creation',
    dashboard: '/espace-client',
    profil: '/espace-client/profil',
  },
  suivi: {
    connexion: '/suivi-de-dossier/connexion',
  },
  bo: {
    connexion: '/bo/connexion',
    dashboard: '/bo',
  },
} as const;
