// src/lib/installReferrer.ts
// Thin JS wrapper over a native Android plugin that reads the Google Play
// Install Referrer (the free, official deferred-attribution channel). The
// native side lives in android/app/src/main/java/.../InstallReferrerPlugin.java.
// If the native plugin is missing (e.g. web, or pre-rebuild), this degrades to
// null instead of throwing — so the JS build/runtime never breaks.

import { registerPlugin, Capacitor } from '@capacitor/core';

export interface InstallReferrerPlugin {
  getReferrer(): Promise<{
    referrer: string | null;
    referrerClickTimestamp?: number;
    installBeginTimestamp?: number;
  }>;
}

const InstallReferrer = registerPlugin<InstallReferrerPlugin>('InstallReferrer');

/** Returns the raw Play install referrer string (utm_source=...&utm_campaign=...&content=...) or null. */
export async function readInstallReferrer(): Promise<string | null> {
  if (Capacitor.getPlatform() !== 'android') return null;
  try {
    const res = await InstallReferrer.getReferrer();
    return res?.referrer && res.referrer.length > 0 ? res.referrer : null;
  } catch {
    // Native plugin not available / Play services missing — deferred attribution
    // simply won't fire; direct deep links + first-launch URL still work.
    return null;
  }
}
