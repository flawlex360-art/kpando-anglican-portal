import { applyVerifiedBasic9Dobs } from '../constants/basic9DobData.js';
import { DEFAULT_MNOTIFY_SENDER_ID, normalizeSmsSenderId } from './mnotifyHelpers.js';

/**
 * Recursively removes undefined values so Firestore setDoc never rejects
 * objects or arrays containing optional undefined properties.
 */
export function sanitizeForFirestore(value) {
  if (value === undefined) return null;
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.map((item) => (item === undefined ? null : sanitizeForFirestore(item)));
  }

  const out = {};
  for (const [key, val] of Object.entries(value)) {
    if (val !== undefined) {
      out[key] = sanitizeForFirestore(val);
    }
  }
  return out;
}

/**
 * Counts populated records across vital school sections to distinguish an
 * active school dataset from an empty fresh-browser shell.
 */
export function countPortalRecords(state) {
  const studentsByClass = state?.studentsByClass || {};
  const studentCount = Object.values(studentsByClass).reduce(
    (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
    0
  );

  const mockScores = state?.mockScores || {};
  let scoreCount = 0;
  for (const seriesMap of Object.values(mockScores)) {
    if (!seriesMap || typeof seriesMap !== 'object') continue;
    for (const gradesBySn of Object.values(seriesMap)) {
      if (gradesBySn && typeof gradesBySn === 'object') {
        scoreCount += Object.keys(gradesBySn).length;
      }
    }
  }

  const financePaymentCount = Object.keys(state?.basic9Finance?.paymentsByLearner || {}).length;
  const expenseCount = Array.isArray(state?.basic9Finance?.expenses)
    ? state.basic9Finance.expenses.length
    : 0;
  const inquiryCount = Array.isArray(state?.inquiries) ? state.inquiries.length : 0;
  const smsLogCount = Array.isArray(state?.smsLogs) ? state.smsLogs.length : 0;
  const announcementCount = Array.isArray(state?.schoolProfile?.announcements)
    ? state.schoolProfile.announcements.length
    : 0;

  return {
    studentCount,
    scoreCount,
    financePaymentCount,
    expenseCount,
    inquiryCount,
    smsLogCount,
    announcementCount
  };
}

export function hasMeaningfulPortalData(state) {
  const c = countPortalRecords(state);
  return (
    c.studentCount > 0 ||
    c.scoreCount > 0 ||
    c.financePaymentCount > 0 ||
    c.expenseCount > 0 ||
    c.inquiryCount > 0 ||
    c.smsLogCount > 0 ||
    c.announcementCount > 0
  );
}

/**
 * Decides initial hydration without letting an empty new phone overwrite
 * existing cloud records, and without letting an empty new cloud doc wipe a populated laptop.
 */
export function decideInitialCloudResolution({ localState, cloudExists, cloudData }) {
  const cloudHasData = Boolean(cloudExists && hasMeaningfulPortalData(cloudData));
  const localHasData = hasMeaningfulPortalData(localState);

  if (cloudHasData) {
    return 'apply-cloud';
  }
  if (localHasData) {
    return 'push-local';
  }
  return 'none';
}

/**
 * Applies the one-time verified Basic 9 DOB backfill if not yet marked on cloud/local data.
 */
export function applyCloudDobBackfillIfNeeded(studentsByClass, migrations) {
  if (migrations?.basic9DobV1 || !studentsByClass?.['Basic 9']?.length) {
    return {
      studentsByClass,
      migrations: migrations || {},
      didUpdate: false
    };
  }
  const { studentsByClass: patched, updatedCount } = applyVerifiedBasic9Dobs(studentsByClass);
  return {
    studentsByClass: patched,
    migrations: { ...(migrations || {}), basic9DobV1: true },
    didUpdate: updatedCount > 0 || !migrations?.basic9DobV1
  };
}

/**
 * Builds the vital school payload synced to Firestore (excludes device-only UI state
 * and excludes browser/Vercel SMS API secrets & Dispatch PINs).
 */
export function extractSyncablePortalState(state) {
  const cleanApiKey = String(state?.gatewayConfig?.apiKey || '').trim();
  const cleanSenderId = normalizeSmsSenderId(state?.gatewayConfig?.senderId || DEFAULT_MNOTIFY_SENDER_ID);
  const cleanProvider = state?.gatewayConfig?.provider || 'mnotify';

  return {
    schoolProfile: state.schoolProfile,
    studentsByClass: state.studentsByClass,
    mockScores: state.mockScores,
    smsLogs: state.smsLogs,
    inquiries: state.inquiries,
    basic9Finance: state.basic9Finance,
    migrations: state.migrations || {},
    gatewaySettings: {
      provider: cleanProvider,
      senderId: cleanSenderId,
      ...(cleanApiKey ? { apiKey: cleanApiKey } : {})
    },
    ...(cleanApiKey
      ? {
          serverGatewayConfig: {
            mnotifyApiKey: cleanApiKey,
            senderId: cleanSenderId,
            provider: cleanProvider
          }
        }
      : {})
  };
}
