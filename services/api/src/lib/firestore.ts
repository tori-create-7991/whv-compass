import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { env } from "./env.js";

let db: Firestore | null | undefined;

/**
 * Lazily initialize Firestore. Returns null when no project/emulator is
 * configured, so handlers can degrade gracefully (persistence is best-effort in
 * the scaffold; required in production).
 */
export function getDb(): Firestore | null {
  if (db !== undefined) return db;
  try {
    const hasEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
    if (!env.gcloudProject && !hasEmulator) {
      db = null;
      return db;
    }
    if (getApps().length === 0) {
      const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      initializeApp({
        projectId: env.gcloudProject || "whv-compass-local",
        // On Cloud Run, omit credential to use the runtime service account.
        ...(credsPath ? { credential: cert(credsPath) } : {}),
      });
    }
    db = getFirestore();
    return db;
  } catch (err) {
    console.warn("[firestore] init failed, running without persistence:", err);
    db = null;
    return db;
  }
}
