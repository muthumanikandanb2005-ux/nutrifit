import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

/**
 * Initializes native Android system appearance (Status Bar, Navigation Bar)
 * Styled according to Google Stitch Botanical Culinary palette.
 */
export async function initializeAndroidSystem(theme: 'light' | 'dark' = 'light') {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Set status bar theme & background matching Botanical Culinary canvas
    if (theme === 'dark') {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#15100E' });
    } else {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#FFFBF5' });
    }
    // Prevent web content from being awkwardly cut off by system bars
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (err) {
    console.warn('Android StatusBar configuration skipped', err);
  }
}

/**
 * Hook to register native Android Hardware / Gesture Back Button handling.
 * Returns a cleanup function.
 */
export function setupAndroidBackButton(handler: () => boolean) {
  if (!Capacitor.isNativePlatform()) return () => {};

  const listenerPromise = CapApp.addListener('backButton', () => {
    const handled = handler();
    if (!handled) {
      CapApp.exitApp();
    }
  });

  return () => {
    listenerPromise.then(handle => handle.remove()).catch(() => {});
  };
}
