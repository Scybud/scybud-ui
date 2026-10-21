// Vibration patterns in milliseconds
const PATTERNS = {
  light: 8,
  success: [10, 40, 10],
  warning: 20,
  error: [30, 40, 30],
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export function haptic(type = "light") {
  // Android Chrome only, everything else skips silently
  if (!navigator.vibrate || reduceMotion.matches) return;
  try {
    navigator.vibrate(PATTERNS[type] ?? PATTERNS.light);
  } catch {}
}
