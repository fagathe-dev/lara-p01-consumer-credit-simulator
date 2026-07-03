import React from "react";
import {
    ProductPageTemplate,
    type ProductPageContent,
} from "@/components/ProductPage";
import type { PageProps } from "@/types/seo";

const content: ProductPageContent = {
    type: "autre",
    h1: "Prêt Personnel : un crédit libre pour tous vos projets",
    intro: "Un crédit à la consommation sans justificatif d'utilisation : disposez librement de la somme empruntée pour concrétiser le projet de votre choix.",
    specifics: [
        {
            title: "Montants typiques",
            description: "De 1 000 € à 75 000 € utilisables librement.",
        },
        {
            title: "Durées possibles",
            description:
                "De 12 à 84 mois pour adapter votre mensualité à votre budget.",
        },
        {
            title: "Ce que couvre ce prêt",
            description:
                "Tout projet personnel, sans justificatif d'achat à fournir.",
        },
    ],
    heroCtaLabel: "Simuler mon prêt personnel",
    inlineCtaLabel: "Concrétiser mon projet",
    stickyCtaLabel: "Simuler mon prêt personnel",
};

const Personnel: React.FC<PageProps> = ({ seo }) => (
    <ProductPageTemplate seo={seo} content={content} />
);

export default Personnel;
