import React from "react";
import {
    ProductPageTemplate,
    type ProductPageContent,
} from "@/components/ProductPage";
import type { PageProps } from "@/types/seo";

const content: ProductPageContent = {
    type: "famille_loisir",
    h1: "Prêt Famille & Loisirs : financez vos envies",
    intro: "Voyage, mariage, études des enfants ou événement familial : réalisez les moments qui comptent avec un crédit pensé pour vos projets de vie.",
    specifics: [
        {
            title: "Montants typiques",
            description: "De 1 000 € à 50 000 € selon votre projet familial.",
        },
        {
            title: "Durées possibles",
            description:
                "De 12 à 72 mois pour financer vos envies en toute sérénité.",
        },
        {
            title: "Ce que couvre ce prêt",
            description:
                "Voyages, mariage, études, équipement du foyer et événements familiaux.",
        },
    ],
    heroCtaLabel: "Simuler mon prêt famille & loisirs",
    inlineCtaLabel: "Réaliser mon projet familial",
    stickyCtaLabel: "Simuler mon prêt famille & loisirs",
};

const FamilleLoisirs: React.FC<PageProps> = ({ seo }) => (
    <ProductPageTemplate seo={seo} content={content} />
);

export default FamilleLoisirs;
