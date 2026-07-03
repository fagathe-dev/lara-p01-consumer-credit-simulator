/**
 * Formatage monétaire — miroir front du parsing Laravel décrit dans
 * `features.md`.
 *
 * `parseMoney` renvoie TOUJOURS un nombre strict (jamais une chaîne), pour
 * éviter toute ambiguïté avant l'envoi vers Laravel.
 */

/**
 * Parse une saisie masquée en nombre.
 * `parseMoney("15 000 €") -> 15000`
 * Gère les séparateurs de milliers (espace, espace insécable/fine), le symbole
 * €, et la virgule décimale française. Retourne `0` pour une saisie vide/invalide.
 */
export function parseMoney(input: string | number | null | undefined): number {
    if (typeof input === "number") {
        return Number.isFinite(input) ? roundTo2(input) : 0;
    }
    if (input == null) {
        return 0;
    }

    const cleaned = input
        // Retire tout sauf chiffres, séparateurs décimaux et signe négatif.
        .replace(/[^\d,.-]/g, "")
        // Virgule décimale FR -> point.
        .replace(/,/g, ".");

    if (cleaned === "" || cleaned === "-" || cleaned === ".") {
        return 0;
    }

    const value = Number.parseFloat(cleaned);
    return Number.isFinite(value) ? roundTo2(value) : 0;
}

/**
 * Formate un nombre pour l'affichage du masque de saisie (`MoneyInput`).
 * `formatMoney(15000) -> "15 000 €"`
 */
export function formatMoney(
    value: number | null | undefined,
    { decimals = 0, symbol = "€" }: { decimals?: number; symbol?: string } = {},
): string {
    if (value == null || !Number.isFinite(value)) {
        return `0 ${symbol}`;
    }
    const fixed = value.toFixed(decimals);
    const [integerPart, decimalPart] = fixed.split(".");
    const withSeparators = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        "\u00A0",
    );
    const body = decimalPart
        ? `${withSeparators},${decimalPart}`
        : withSeparators;
    return `${body}\u00A0${symbol}`;
}

function roundTo2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}
