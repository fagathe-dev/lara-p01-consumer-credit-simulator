/**
 * Soumission du tunnel vers Laravel.
 *
 * Flux : `buildDossierPayload(state)` → `submitDossier()` (client HTTP unique)
 * → gestion `idle` / `submitting` / `success` / `error`.
 *
 * En cas d'erreur, capture l'`ApiError` de `core-ts` :
 * - 422 → `getValidationErrors()` mappé `{ champ: message }` sur les champs
 *   (sans perdre la saisie) ;
 * - 5xx / réseau → message générique de réessai (la saisie est préservée par le
 *   store + `StorageService('session')`).
 *
 * Le front n'attend NI ne connaît le résultat du scoring Python : la réponse
 * Laravel confirme seulement la prise en compte du dossier.
 */

import { useCallback, useState } from "react";
import { router } from "@inertiajs/react";
import { ApiError } from "core-ts";
import { routes } from "@/routes";
import { submitDossier, type DossierResponse } from "@/core/http/client";
import { buildDossierPayload } from "../format/payload";
import { validateAll } from "../schema/dossierSchema";
import { useTunnelStore } from "../store/useTunnelStore";
import type { TunnelState } from "../store/types";

export type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export interface UseTunnelSubmissionResult {
    status: SubmissionStatus;
    isSubmitting: boolean;
    /** Message d'erreur générique (5xx / réseau), en français. */
    errorMessage: string | null;
    /** Erreurs de validation serveur (422) mappées par champ. */
    fieldErrors: Record<string, string>;
    /** Réponse de principe de Laravel en cas de succès. */
    response: DossierResponse | null;
    /** Lance la soumission ; retourne `true` si le dossier a été accepté. */
    submit: () => Promise<boolean>;
    /** Réinitialise l'état d'erreur (ex. avant un nouvel essai). */
    clearErrors: () => void;
}

/** Aplati les erreurs `{ champ: string | string[] }` en `{ champ: string }`. */
function flattenValidationErrors(
    errors: Record<string, string | string[]> | null,
): Record<string, string> {
    if (!errors) {
        return {};
    }
    return Object.entries(errors).reduce<Record<string, string>>(
        (acc, [field, message]) => {
            acc[field] = Array.isArray(message) ? message[0] : message;
            return acc;
        },
        {},
    );
}

export function useTunnelSubmission(): UseTunnelSubmissionResult {
    const [status, setStatus] = useState<SubmissionStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [response, setResponse] = useState<DossierResponse | null>(null);

    const clearErrors = useCallback(() => {
        setErrorMessage(null);
        setFieldErrors({});
    }, []);

    const submit = useCallback(async (): Promise<boolean> => {
        const store = useTunnelStore.getState();
        const state: TunnelState = {
            currentStep: store.currentStep,
            dossier: store.dossier,
            personnes: store.personnes,
            stepStatus: store.stepStatus,
        };

        // Barrière finale front avant l'envoi (l'autorité reste Laravel).
        const validation = validateAll(state);
        if (!validation.valid) {
            setStatus("error");
            setFieldErrors(validation.errors);
            setErrorMessage(
                "Certaines informations sont incomplètes ou invalides.",
            );
            return false;
        }

        setStatus("submitting");
        clearErrors();

        try {
            const result = await submitDossier(buildDossierPayload(state));
            setResponse(result);
            setStatus("success");
            // Succès : purge du store + storage, puis redirection résultat.
            store.reset();
            router.visit(routes.resultat);
            return true;
        } catch (error) {
            setStatus("error");

            if (error instanceof ApiError) {
                const validationErrors = flattenValidationErrors(
                    error.getValidationErrors(),
                );
                if (Object.keys(validationErrors).length > 0) {
                    // 422 : erreurs par champ, la saisie est conservée.
                    setFieldErrors(validationErrors);
                    setErrorMessage(null);
                    return false;
                }
                if (error.isServerError()) {
                    setErrorMessage(
                        "Une erreur est survenue de notre côté. Merci de réessayer dans un instant.",
                    );
                } else if (error.isNetworkError()) {
                    setErrorMessage(
                        "Connexion impossible. Vérifiez votre réseau puis réessayez.",
                    );
                } else {
                    setErrorMessage(error.getErrorMessage());
                }
                return false;
            }

            setErrorMessage(
                "Une erreur inattendue est survenue. Merci de réessayer.",
            );
            return false;
        }
    }, [clearErrors]);

    return {
        status,
        isSubmitting: status === "submitting",
        errorMessage,
        fieldErrors,
        response,
        submit,
        clearErrors,
    };
}
