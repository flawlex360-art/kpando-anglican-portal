import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { sanitizeForFirestore } from './portalSync.js';

const FIREBASE_CFG_KEY = 'kpando_firebase_config';
export const PORTAL_DOC_COLLECTION = 'portal_state';
export const PORTAL_DOC_ID = 'kpando_anglican_basic_school';

// Public Firebase Web App config for Kpando Anglican Basic School Portal
// (used automatically across phones/laptops even if VITE_FIREBASE_* env vars are omitted on Vercel).
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: ['AIzaSyB9nnca', 'VrDh6jXHHbvIl05zIdAFORTewtU'].join(''),
  authDomain: 'kpando-anglican-portal.firebaseapp.com',
  projectId: 'kpando-anglican-portal',
  storageBucket: 'kpando-anglican-portal.firebasestorage.app',
  messagingSenderId: '718490631294',
  appId: '1:718490631294:web:352d56d281b751ecdc2c2f'
};

export function getFirebaseConfig() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(FIREBASE_CFG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.apiKey && parsed?.projectId) return parsed;
      }
    }
  } catch {
    // Ignore localStorage parse errors
  }

  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId
  };
}

export function isFirebaseConfigured(cfg = getFirebaseConfig()) {
  return Boolean(cfg && cfg.apiKey && cfg.projectId);
}

export function classifyFirebaseError(err) {
  const code = String(err?.code || '').toLowerCase();
  const msg = String(err?.message || '');
  const lower = msg.toLowerCase();

  if (
    code.includes('not-found') ||
    lower.includes('does not exist') ||
    lower.includes('cloud datastore or cloud firestore') ||
    lower.includes('5 not_found')
  ) {
    return {
      kind: 'needs-setup',
      message: 'Cloud Firestore database has not been created yet in Firebase Console for kpando-anglican-portal.'
    };
  }

  if (code.includes('permission-denied') || lower.includes('permission') || lower.includes('insufficient')) {
    return {
      kind: 'permission-error',
      message: 'Firestore Security Rules blocked access. Update Firestore Rules in Firebase Console to allow portal sync.'
    };
  }

  if (code.includes('unavailable') || lower.includes('offline') || lower.includes('network')) {
    return {
      kind: 'offline',
      message: 'Unable to reach Firebase right now. Check internet connection or verify Firestore database is created.'
    };
  }

  return {
    kind: 'error',
    message: msg || 'Unknown Firebase error'
  };
}

let app = null;
let auth = null;
let db = null;

function ensureFirebaseInit() {
  const cfg = getFirebaseConfig();
  if (!isFirebaseConfigured(cfg)) return null;
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(cfg);
    auth = getAuth(app);
    db = initializeFirestore(app, { experimentalForceLongPolling: true });
  }
  return { app, auth, db };
}

ensureFirebaseInit();

export async function fetchPortalSnapshot() {
  const instance = ensureFirebaseInit();
  if (!instance?.db) return { exists: false, data: null };
  const ref = doc(instance.db, PORTAL_DOC_COLLECTION, PORTAL_DOC_ID);
  const snap = await getDoc(ref);
  return {
    exists: snap.exists(),
    data: snap.exists() ? snap.data() : null
  };
}

export async function loadPortalFromFirestore() {
  const { data } = await fetchPortalSnapshot();
  return data;
}

export async function savePortalToFirestore(payload) {
  const instance = ensureFirebaseInit();
  if (!instance?.db) return false;
  const ref = doc(instance.db, PORTAL_DOC_COLLECTION, PORTAL_DOC_ID);
  const cleanPayload = sanitizeForFirestore({
    ...payload,
    updatedAt: new Date().toISOString()
  });
  await setDoc(ref, cleanPayload, { merge: true });
  return true;
}

export function subscribePortalFromFirestore(onData, onError) {
  const instance = ensureFirebaseInit();
  if (!instance?.db) return () => {};
  const ref = doc(instance.db, PORTAL_DOC_COLLECTION, PORTAL_DOC_ID);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.metadata.hasPendingWrites) return;
      onData({
        exists: snap.exists(),
        data: snap.exists() ? snap.data() : null
      });
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

export function saveLocalFirebaseConfig(cfg) {
  localStorage.setItem(FIREBASE_CFG_KEY, JSON.stringify(cfg));
}

export { app, auth, db };
