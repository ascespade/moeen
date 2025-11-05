/**
 * Animation & Transition System - Extracted from Homepage Design
 * نظام الحركات والانتقالات - مستخرج من تصميم الصفحة الرئيسية
 * 
 * Source: src/styles/centralized.css
 * Reference: src/components/home/OriginalHero.tsx
 */

// Transition Durations (from CSS variables)
export const transitions = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

// Transition Timing Functions
export const timingFunctions = {
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',
} as const;

// CSS Variable Names
export const transitionVariables = {
  transitionFast: '--transition-fast',
  transitionNormal: '--transition-normal',
} as const;

// Keyframe Animations (from CSS)
export const keyframes = {
  fadeIn: {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  fadeOut: {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  slideIn: {
    from: { transform: 'translateY(-10px)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  },
  slideUp: {
    from: { transform: 'translateY(4px)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  },
} as const;

// Animation Classes (Tailwind)
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
} as const;

// Component Transitions
export const componentTransitions = {
  button: `${transitions.fast} ${timingFunctions.easeOut}`,
  card: `${transitions.fast} ${timingFunctions.easeOut}`,
  modal: `${transitions.normal} ${timingFunctions.easeOut}`,
  dropdown: `${transitions.fast} ${timingFunctions.easeOut}`,
} as const;

// Hover Effects (from homepage)
export const hoverEffects = {
  card: {
    transform: 'translateY(-4px)',
    shadow: 'var(--shadow-lg)',
  },
  button: {
    transform: 'scale(1.05)',
    shadow: 'var(--shadow-md)',
  },
} as const;

// Type exports
export type Transition = keyof typeof transitions;
export type TimingFunction = keyof typeof timingFunctions;
export type Keyframe = keyof typeof keyframes;
export type AnimationClass = keyof typeof animationClasses;

// Helper functions
export function getTransition(
  duration: Transition,
  timing: TimingFunction = 'easeOut'
): string {
  return `${transitions[duration]} ${timingFunctions[timing]}`;
}

export function getTransitionCSSVar(
  size: keyof typeof transitionVariables
): string {
  return `var(${transitionVariables[size]})`;
}

export function getAnimationClass(name: AnimationClass): string {
  return animationClasses[name];
}
