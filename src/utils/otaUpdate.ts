/**
 * NutriFit Over-The-Air (OTA) Live Update Engine
 * Enables live asset refresh, version sync, and remote manifest verification
 */

export interface OTAVersionInfo {
  version: string;
  buildNumber: number;
  releaseDate: string;
  commit: string;
  name: string;
  mandatory?: boolean;
  changelog: string[];
  bundleHash?: string;
  githubRelease?: string;
}

export const CURRENT_APP_VERSION = '2.2.0';
export const CURRENT_BUILD_NUMBER = 22;
export const CURRENT_COMMIT = '2c6a1f9';

export interface CheckUpdateResult {
  hasUpdate: boolean;
  currentVersion: string;
  remoteInfo?: OTAVersionInfo;
  error?: string;
}

/**
 * Check cloud manifest for newer OTA release
 */
export async function checkOTAUpdate(): Promise<CheckUpdateResult> {
  try {
    // 1. Try local public/version.json with timestamp cache-buster
    const cacheBuster = Date.now();
    let response: Response | null = null;
    
    try {
      response = await fetch(`/version.json?t=${cacheBuster}`, {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
    } catch {
      // Fallback to GitHub raw version manifest if local fetch fails
      response = await fetch(`https://raw.githubusercontent.com/muthumanikandanb2005-ux/nutrifit/main/public/version.json?t=${cacheBuster}`);
    }

    if (!response || !response.ok) {
      return {
        hasUpdate: false,
        currentVersion: CURRENT_APP_VERSION,
        error: `Failed to fetch version manifest (${response?.status || 'network error'})`
      };
    }

    const data: OTAVersionInfo = await response.json();
    
    // Compare semantic version or build numbers
    const isNewer = isVersionNewer(data.version, CURRENT_APP_VERSION) || 
      (data.buildNumber > CURRENT_BUILD_NUMBER);

    return {
      hasUpdate: isNewer,
      currentVersion: CURRENT_APP_VERSION,
      remoteInfo: data
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      hasUpdate: false,
      currentVersion: CURRENT_APP_VERSION,
      error: message
    };
  }
}

/**
 * Compare two semver strings: returns true if v1 > v2
 */
function isVersionNewer(v1: string, v2: string): boolean {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return true;
    if (p1 < p2) return false;
  }
  return false;
}

/**
 * Apply OTA update: Purges service worker & browser caches and reloads webview
 */
export async function applyOTAUpdate(): Promise<void> {
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch (e) {
    console.warn('Cache purge failed:', e);
  }

  // Record that OTA update was applied
  try {
    localStorage.setItem('nutrifit_last_ota_applied', Date.now().toString());
    localStorage.setItem('nutrifit_installed_version', CURRENT_APP_VERSION);
  } catch {
    // ignore
  }

  // Force cache-busting reload
  window.location.reload();
}
