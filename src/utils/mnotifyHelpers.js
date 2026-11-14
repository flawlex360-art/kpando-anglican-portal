export const DEFAULT_MNOTIFY_SENDER_ID = 'KpandoAngli';

const LEGACY_SENDER_IDS = new Set(['MADIFOR', 'KPANDO ANG']);

/**
 * Normalizes legacy placeholder or empty sender IDs to the approved KpandoAngli ID.
 */
export function normalizeSmsSenderId(senderId) {
  const clean = String(senderId || '').trim().slice(0, 11);
  if (!clean || LEGACY_SENDER_IDS.has(clean.toUpperCase())) {
    return DEFAULT_MNOTIFY_SENDER_ID;
  }
  return clean;
}

/**
 * Validates mNotify Quick SMS HTTP & JSON payload responses (code '2000' / status 'success').
 */
export function evaluateMnotifyResponse(upstreamOk, data = {}) {
  const statusStr = String(data?.status || '').trim().toLowerCase();
  const codeStr = data?.code !== undefined && data?.code !== null ? String(data.code).trim() : '';
  const accepted = data?.summary?.accepted;
  const rejected = data?.summary?.rejected;

  const hasFailureStatus = Boolean(statusStr && statusStr !== 'success' && statusStr !== 'ok');
  const hasFailureCode = Boolean(codeStr && codeStr !== '2000');
  const allRejected =
    accepted !== undefined &&
    Number(accepted) === 0 &&
    rejected !== undefined &&
    Number(rejected) > 0;

  const ok = Boolean(upstreamOk) && !hasFailureStatus && !hasFailureCode && !allRejected;
  return {
    ok,
    acceptedCount: accepted !== undefined ? Number(accepted) : null,
    reason: ok
      ? ''
      : data?.message ||
        data?.error ||
        (codeStr ? `mNotify error code ${codeStr}` : 'mNotify rejected SMS dispatch')
  };
}

/**
 * Normalizes gatewayConfig and runs a one-time upgrade from pending Simulation Mode
 * to live mNotify with the approved Sender ID 'KpandoAngli'.
 */
export function migrateApprovedGatewayConfig(gatewayConfig, migrations = {}) {
  const raw = gatewayConfig && typeof gatewayConfig === 'object' ? gatewayConfig : {};
  let provider = raw.provider === 'arkesel' ? 'mnotify' : raw.provider || 'mnotify';
  const senderId = normalizeSmsSenderId(raw.senderId);
  let didMigrate = false;

  if (!migrations?.mnotifyApprovedV1) {
    if (provider === 'simulation' || !raw.provider) {
      provider = 'mnotify';
    }
    didMigrate = true;
  }

  return {
    gatewayConfig: {
      provider,
      senderId,
      apiKey: raw.apiKey || '',
      dispatchSecret: raw.dispatchSecret || '',
      ...(raw.clientSecret ? { clientSecret: raw.clientSecret } : {})
    },
    migrations: didMigrate
      ? { ...(migrations || {}), mnotifyApprovedV1: true }
      : migrations || {},
    didMigrate
  };
}
