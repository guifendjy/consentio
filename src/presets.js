// presets.js

/**
 * High-Fidelity Mobile Navigation Stack Animation Preset Token Map
 * Organizes entry and exit sequences symmetrically to preserve spatial orientation.
 */
export const ANIMATION_PRESETS = {
  // Explicit absolute pass-through state (Instantaneous mount/demount)
  none: {
    enter: "animate-none",
    leave: "animate-none",
  },

  // Cross-dissolve alpha blending (Ideal for standard tab state adjustments)
  fade: {
    enter: "animate-fadeIn",
    leave: "animate-fadeOut",
  },

  // Standard Push Stack Behavior: Arrives from the right edge, returns back out to the right edge
  slideLeft: {
    enter: "animate-slideInRight",
    leave: "animate-slideOutRight",
  },

  // Reverse Push Stack Behavior: Arrives from the left edge, returns back out to the left edge
  slideRight: {
    enter: "animate-slideInLeft",
    leave: "animate-slideOutLeft",
  },

  // Modal Sheet Style Presentation: Slides up from the floor, drops back down to the floor
  slideUp: {
    enter: "animate-slideInUp",
    leave: "animate-slideOutDown",
  },

  // Top Banner Style Presentation: Drops down from the ceiling, pulls back up into the ceiling
  slideDown: {
    enter: "animate-slideInDown",
    leave: "animate-slideOutUp",
  },

  // Material Scale Focal Pop: Subtle geometric expand-in, contract-out
  scale: {
    enter: "animate-scaleUp",
    leave: "animate-scaleDown",
  },
};
