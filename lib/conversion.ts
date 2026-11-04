export type ConversionName =
  | "phone_click"
  | "quote_click"
  | "contact_open"
  | "contact_success"
  | "project_click";
export const consentKey = "mk-measurement-consent";
/** Aucun identifiant, coordonnées, contenu de formulaire ou requête réseau. */
export function trackConversion(
  name: ConversionName,
  detail: Record<string, string> = {},
) {
  if (typeof window === "undefined") return;
  try {
    if (
      localStorage.getItem(consentKey) !== "yes" ||
      navigator.doNotTrack === "1" ||
      (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl
    )
      return;
    window.dispatchEvent(
      new CustomEvent("mk:conversion", { detail: { event: name, ...detail } }),
    );
  } catch {}
}
