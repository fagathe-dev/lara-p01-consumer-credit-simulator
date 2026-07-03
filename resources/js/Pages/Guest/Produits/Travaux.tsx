import React from "react";
import {
    ProductPageTemplate,
    type ProductPageContent,
} from "@/components/ProductPage";
import type { PageProps } from "@/types/seo";

const content: ProductPageContent = {
    type: "travaux",
    h1: "Prêt Travaux : financez vos projets de rénovation",
    intro: "Rénovation énergétique, extension, aménagement ou décoration : donnez vie à vos travaux avec un crédit adapté à l'ampleur de votre chantier.",
    specifics: [
        {
            title: "Montants typiques",
            description:
                "De 3 000 € à 75 000 € selon l'envergure de vos travaux.",
        },
        {
            title: "Durées possibles",
            description:
                "De 12 à 84 mois pour étaler le coût de votre chantier sereinement.",
        },
        {
            title: "Ce que couvre ce prêt",
            description:
                "Matériaux, main-d'œuvre, rénovation énergétique et aménagement intérieur ou extérieur.",
        },
    ],
    heroCtaLabel: "Simuler mon prêt travaux",
    inlineCtaLabel: "Lancer mon projet de rénovation",
    stickyCtaLabel: "Simuler mon prêt travaux",
};

const Travaux: React.FC<PageProps> = ({ seo }) => (
    <ProductPageTemplate seo={seo} content={content} />
);

export default Travaux;
