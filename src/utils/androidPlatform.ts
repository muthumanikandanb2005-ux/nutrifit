import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

/**
 * Initializes native Android system appearance (Status Bar, Navigation Bar)
 */
export async function initializeAndroidSystem() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Configure status bar color and dark icons/text
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#9a3412' }); // Deep orange-amber matching header
  } catch (err) {
    console.warn('StatusBar initialization skipped on non-native platform', err);
  }
}

/**
 * Hook to register native Android Hardware / Gesture Back Button handling
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
