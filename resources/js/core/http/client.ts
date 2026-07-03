/**
 * Client HTTP unique vers LARAVEL.
 *
 * Wrapper mince au-dessus de `fetchAPI` de `core-ts` (axios + `ApiError` typée).
 * Point d'entrée UNIQUE : aucun appel `fetchAPI`/`fetch`/axios dispersé ailleurs
 * dans le moteur ou les composants — tout passe par ici.
 *
 * ⚠️ Architecture : ce client ne connaît QUE Laravel. Aucune URL, aucun schéma,
 * aucune configuration ne pointe vers le microservice Python de scoring (ce
 * serait une violation de l'architecture). C'est Laravel qui, en aval et de
 * façon asynchrone (Jobs/Queues), dialogue avec Python.
 */

import { fetchAPI, HTTP_STATUS } from "core-ts";
import type { DossierSubmissionPayload } from "../tunnel/format/payload";

export { HTTP_STATUS };

/** Endpoint Laravel de création de dossier (route POST à exposer côté back). */
export const DOSSIER_ENDPOINT = "/simulation/credit-consommation";

/**
 * Réponse de principe de Laravel : confirme la PRISE EN COMPTE du dossier
 * (réponse sous 24h). Le scoring/les offres Python arrivent de façon asynchrone
 * plus tard — jamais dans cette réponse synchrone.
 */
export interface DossierResponse {
    id?: number | string;
    reference?: string;
    status?: string;
    message?: string;
}

/** Lit le cookie CSRF de Laravel (`XSRF-TOKEN`), SSR-safe. */
function getCsrfToken(): string | null {
    if (typeof document === "undefined" || !document.cookie) {
        return null;
    }
    const match = document.cookie
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("XSRF-TOKEN="));
    if (!match) {
        return null;
    }
    return decodeURIComponent(match.slice("XSRF-TOKEN=".length));
}

/** En-têtes communs à toutes les requêtes vers Laravel. */
function laravelHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
        "X-Requested-With": "XMLHttpRequest",
    };
    const csrf = getCsrfToken();
    if (csrf) {
        headers["X-XSRF-TOKEN"] = csrf;
    }
    return headers;
}

/**
 * Poste un dossier complet vers Laravel.
 * Lève une `ApiError` (de `core-ts`) en cas d'échec — gérée par la couche
 * soumission (`useTunnelSubmission`) : 422 → erreurs de validation mappées par
 * champ, 5xx/réseau → message générique de réessai.
 */
export async function submitDossier(
    payload: DossierSubmissionPayload,
): Promise<DossierResponse> {
    const response = await fetchAPI<DossierResponse>(DOSSIER_ENDPOINT, {
        method: "POST",
        headers: laravelHeaders(),
        body: payload,
        // Pas de retry sur une création (éviter les doublons de dossier).
        retries: 0,
    });
    return response.data;
}
