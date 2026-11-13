import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const FIREBASE_CFG_KEY = 'kpando_firebase_config';
const PORTAL_DOC_COLLECTION = 'portal_state';
const PORTAL_DOC_ID = 'kpando_anglican_basic_school';

export function getFirebaseConfig() {
  try {
    const raw = localStorage.getItem(FIREBASE_CFG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.apiKey && parsed?.projectId) return parsed;
    }
  } catch (e) {
    // Ignore localStorage parse errors
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };
}

export function isFirebaseConfigured(cfg = getFirebaseConfig()) {
  return Boolean(cfg && cfg.apiKey && cfg.projectId);
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

export async function loadPortalFromFirestore() {
  const instance = ensureFirebaseInit();
  if (!instance?.db) return null;
  const ref = doc(instance.db, PORTAL_DOC_COLLECTION, PORTAL_DOC_ID);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function savePortalToFirestore(payload) {
  const instance = ensureFirebaseInit();
  if (!instance?.db) return false;
  const ref = doc(instance.db, PORTAL_DOC_COLLECTION, PORTAL_DOC_ID);
  await setDoc(
    ref,
    {
      ...payload,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );
  return true;
}

export function saveLocalFirebaseConfig(cfg) {
  localStorage.setItem(FIREBASE_CFG_KEY, JSON.stringify(cfg));
}

export { app, auth, db };
