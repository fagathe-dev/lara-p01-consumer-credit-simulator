/**
 * Product catalogue metadata, one entry per `ProjectTypeEnum` case.
 * Drives the home grid, the product pages and their cross-linking.
 */

import { routes } from "@/routes";

/** Mirrors `Core\Simulator\Enum\ProjectTypeEnum` values. */
export type ProjectType =
    | "auto_moto"
    | "regroupement_credits"
    | "travaux"
    | "autre"
    | "famille_loisir";

export interface Product {
    /** `ProjectTypeEnum` value. */
    type: ProjectType;
    /** Route path of the dedicated product page. */
    href: string;
    /** Short label used in cards and cross-links. */
    label: string;
    /** One-line teaser for the home grid card. */
    teaser: string;
}

export const products: readonly Product[] = [
    {
        type: "auto_moto",
        href: routes.produits.autoMoto,
        label: "Prêt auto & moto",
        teaser: "Financez votre voiture, moto ou scooter, neuf ou d'occasion.",
    },
    {
        type: "regroupement_credits",
        href: routes.produits.rachatCredits,
        label: "Rachat de crédits",
        teaser: "Regroupez vos crédits en une seule mensualité allégée.",
    },
    {
        type: "travaux",
        href: routes.produits.travaux,
        label: "Prêt travaux",
        teaser: "Rénovation, extension, énergie : financez vos travaux.",
    },
    {
        type: "autre",
        href: routes.produits.personnel,
        label: "Prêt personnel",
        teaser: "Un crédit libre pour tous vos projets, sans justificatif.",
    },
    {
        type: "famille_loisir",
        href: routes.produits.familleLoisirs,
        label: "Prêt famille & loisirs",
        teaser: "Voyages, mariage, études : concrétisez vos envies.",
    },
] as const;

/** Returns the other products, for cross-linking on a product page. */
export function otherProducts(current: ProjectType): readonly Product[] {
    return products.filter((product) => product.type !== current);
}
