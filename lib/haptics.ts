/**
 * Retours haptiques de l’application de gestion.
 * - Android et navigateurs compatibles : API Vibration.
 * - iPhone (Safari 18 et plus) : l’API Vibration n’existe pas ; basculer un
 *   interrupteur natif `<input type="checkbox" switch>` déclenche le retour
 *   haptique du système. L’élément est invisible et ignoré des lecteurs d’écran.
 * À appeler uniquement en réponse à un geste de l’utilisateur.
 */
type HapticKind = "selection" | "light" | "success" | "warning";

let iosSwitch: HTMLLabelElement | null = null;

function tapIosSwitch() {
  if (!iosSwitch) {
    iosSwitch = document.createElement("label");
    iosSwitch.setAttribute("aria-hidden", "true");
    iosSwitch.style.display = "none";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.tabIndex = -1;
    input.setAttribute("switch", "");
    iosSwitch.appendChild(input);
    document.body.appendChild(iosSwitch);
  }
  iosSwitch.click();
}

export function haptic(kind: HapticKind = "light") {
  if (typeof window === "undefined") return;
  try {
    if (typeof navigator.vibrate === "function") {
      navigator.vibrate(
        kind === "success"
          ? [10, 60, 14]
          : kind === "warning"
            ? [18, 70, 18]
            : kind === "selection"
              ? 6
              : 10,
      );
      return;
    }
    tapIosSwitch();
    if (kind === "success" || kind === "warning")
      window.setTimeout(tapIosSwitch, 110);
  } catch {
    /* Aucun retour haptique disponible : l’interface reste fonctionnelle. */
  }
}
