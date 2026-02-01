/**
 * Kid-friendly animation configs (ages 8–15)
 * Bouncy, clear feedback, not too fast (comfortable for children)
 */

export const kidSpring = {
  /** Bouncy press feedback (cards, buttons) */
  press: { damping: 14, stiffness: 380 },
  /** Gentle entrance */
  entrance: { damping: 18, stiffness: 120 },
  /** Soft float/wiggle */
  float: { damping: 20, stiffness: 80 },
};

export const kidTiming = {
  /** Short feedback */
  fast: 150,
  /** Section/card entrance */
  normal: 400,
  /** Decorative float cycle */
  slow: 2500,
};
