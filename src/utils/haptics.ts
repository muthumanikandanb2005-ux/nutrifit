import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Native Android Haptic & Vibration Feedback Helper
 * Uses Capacitor Haptics on Android native runtime, falls back to navigator.vibrate
 */
export const haptic = {
  // Light impact: tab change, button tap, checkbox click
  light: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  },

  // Medium impact: logging workout, saving recipe, swapping meal
  medium: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
    }
  },

  // Heavy impact: start/stop timer, live camera snap
  heavy: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }
  },

  // Success notification: goal reached, meal added to plan
  success: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([15, 60, 25]);
      }
    }
  },

  // Warning/Error notification
  warning: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 40, 40]);
      }
    }
  }
};
