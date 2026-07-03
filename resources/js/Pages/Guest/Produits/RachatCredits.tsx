import React from "react";
import {
    ProductPageTemplate,
    type ProductPageContent,
} from "@/components/ProductPage";
import type { PageProps } from "@/types/seo";

const content: ProductPageContent = {
    type: "regroupement_credits",
    h1: "Rachat de crédits : regroupez vos prêts en une mensualité",
    intro: "Simplifiez la gestion de votre budget en regroupant vos crédits en cours en un seul financement, avec une mensualité unique et allégée.",
    specifics: [
        {
            title: "Montants typiques",
            description:
                "De 10 000 € à 200 000 € selon l'encours de vos crédits à regrouper.",
        },
        {
            title: "Durées possibles",
            description:
                "De 24 à 84 mois pour réduire le montant de votre mensualité globale.",
        },
        {
            title: "Ce que couvre ce prêt",
            description:
                "Crédits à la consommation, prêts personnels, découverts et dettes diverses.",
        },
    ],
    heroCtaLabel: "Simuler mon rachat de crédits",
    inlineCtaLabel: "Alléger mes mensualités",
    stickyCtaLabel: "Simuler mon rachat de crédits",
};

const RachatCredits: React.FC<PageProps> = ({ seo }) => (
    <ProductPageTemplate seo={seo} content={content} />
);

export default RachatCredits;
