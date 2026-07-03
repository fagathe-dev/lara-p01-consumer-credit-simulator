import React from "react";
import {
    ProductPageTemplate,
    type ProductPageContent,
} from "@/components/ProductPage";
import type { PageProps } from "@/types/seo";

const content: ProductPageContent = {
    type: "auto_moto",
    h1: "Prêt Auto & Moto : simulez votre crédit en ligne",
    intro: "Financez l'achat de votre voiture, moto ou scooter, neuf ou d'occasion, avec un crédit affecté ou un prêt personnel adapté à votre budget.",
    specifics: [
        {
            title: "Montants typiques",
            description:
                "De 3 000 € à 75 000 € selon votre projet, du deux-roues au véhicule familial.",
        },
        {
            title: "Durées possibles",
            description:
                "De 12 à 84 mois pour ajuster votre mensualité à votre capacité de remboursement.",
        },
        {
            title: "Ce que couvre ce prêt",
            description:
                "Véhicule neuf ou d'occasion, frais de carte grise, accessoires et équipements.",
        },
    ],
    heroCtaLabel: "Simuler mon prêt auto",
    inlineCtaLabel: "Financer mon véhicule maintenant",
    stickyCtaLabel: "Simuler mon prêt auto",
};

const AutoMoto: React.FC<PageProps> = ({ seo }) => (
    <ProductPageTemplate seo={seo} content={content} />
);

export default AutoMoto;
