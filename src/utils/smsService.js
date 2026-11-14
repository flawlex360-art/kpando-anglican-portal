/**
 * Ghanaian Parent SMS Service
 * Supports Simulation / Sandbox Mode as well as live dispatch via mNotify or Hubtel.
 */
import {
  DEFAULT_MNOTIFY_SENDER_ID,
  evaluateMnotifyResponse,
  normalizeSmsSenderId
} from './mnotifyHelpers.js';

export { DEFAULT_MNOTIFY_SENDER_ID, normalizeSmsSenderId };

export function formatGhanaPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('233') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return `233${digits.slice(1)}`;
  if (digits.length === 9) return `233${digits}`;
  return digits;
}

/**
 * Formats uppercase or inconsistent parent/learner names into Title Case
 * (capitalizing the first letter of each word) so names blend cleanly into SMS copy.
 */
export function formatSmsName(name) {
  const cleaned = String(name || '').trim().replace(/\s+/g, ' ');
  if (!cleaned) return '';
  return cleaned
    .toLowerCase()
    .replace(/(^|[\s\-/.(]|'(?!s(?:\s|$)))([a-z])/g, (_, sep, ch) => `${sep}${ch.toUpperCase()}`);
}

/**
 * Formats currency using ASCII "GHS" so Ghanaian SMS gateways stay in GSM-7
 * encoding (160 chars/page) instead of triggering Unicode 70-char limits.
 */
export function formatSmsCurrency(amount) {
  const num = Math.max(0, Math.round((Number(amount) || 0) * 100) / 100);
  return `GHS ${num.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function isLearnerOwing(row) {
  return Math.round((Number(row?.amountLeft) || 0) * 100) > 0;
}

export function filterOwingRecipients(rows = []) {
  return (Array.isArray(rows) ? rows : []).filter((row) => isLearnerOwing(row));
}

export function buildFeePaymentSms({
  parentName,
  studentName,
  amountPaidNow,
  totalPaidAfter,
  amountLeftAfter,
  schoolName
}) {
  const parentDisplay = formatSmsName(parentName) || 'Parent/Guardian';
  const studentDisplay = formatSmsName(studentName) || 'your ward';
  const schoolDisplay = String(schoolName || 'Kpando Anglican Basic School').trim();
  const paidNowText = formatSmsCurrency(amountPaidNow);
  const totalPaidText = formatSmsCurrency(totalPaidAfter);
  const cleanLeft = Math.max(0, Math.round((Number(amountLeftAfter) || 0) * 100) / 100);
  const leftText = formatSmsCurrency(cleanLeft);

  if (cleanLeft <= 0) {
    return `Dear ${parentDisplay}, payment of ${paidNowText} has been received for ${studentDisplay}'s Basic 9 fees (Total paid: ${totalPaidText}). Amount left to pay: GHS 0.00 (Cleared). Thank you. - ${schoolDisplay}`;
  }
  return `Dear ${parentDisplay}, payment of ${paidNowText} has been received for ${studentDisplay}'s Basic 9 fees (Total paid: ${totalPaidText}). Amount left to pay: ${leftText}. Thank you. - ${schoolDisplay}`;
}

export function interpolateSmsTemplate(template, context) {
  if (!template) return '';
  const parentDisplay = formatSmsName(context.parentName) || 'Parent/Guardian';
  const studentDisplay = formatSmsName(context.studentName) || 'your ward';
  const replacements = {
    '{parent_name}': parentDisplay,
    '{student_name}': studentDisplay,
    '{index_no}': context.indexNo || '',
    '{class}': context.className || 'Basic 9',
    '{aggregate}': context.aggregate !== undefined ? String(context.aggregate) : '-',
    '{total_score}': context.totalScore !== undefined ? String(context.totalScore) : '-',
    '{position}': context.position || '-',
    '{mock_series}': context.mockSeries || 'Mock 1',
    '{amount_paid}': context.amountPaid !== undefined ? formatSmsCurrency(context.amountPaid) : 'GHS 0.00',
    '{amount_left}': context.amountLeft !== undefined ? formatSmsCurrency(context.amountLeft) : 'GHS 0.00',
    '{total_fee}': context.targetFee !== undefined ? formatSmsCurrency(context.targetFee) : 'GHS 0.00',
    '{amount_paid_now}': context.amountPaidNow !== undefined ? formatSmsCurrency(context.amountPaidNow) : 'GHS 0.00',
    '{pta_date}': context.ptaDate || 'TBA',
    '{pta_time}': context.ptaTime || '9:00 AM',
    '{pta_venue}': context.ptaVenue || 'School Assembly Hall',
    '{school_name}': context.schoolName || 'Kpando Anglican Basic School'
  };

  let output = template;
  Object.entries(replacements).forEach(([token, value]) => {
    output = output.split(token).join(value);
  });
  return output;
}

/**
 * Checks whether Vercel environment variables (MNOTIFY_API_KEY & SMS_DISPATCH_SECRET)
 * are configured on /api/send-sms without exposing any secrets.
 */
export async function checkSmsServerStatus() {
  try {
    const res = await fetch('/api/send-sms', { method: 'GET' });
    if (!res.ok) return null;
    const contentType = res.headers?.get?.('content-type') || '';
    if (contentType && !contentType.includes('application/json')) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Sends a batch of personalized SMS messages.
 * In Simulation Mode (or if gateway API key is absent), returns simulated receipts immediately.
 */
export async function dispatchParentSmsBatch({
  recipients,
  messageTemplate,
  schoolProfile,
  mockSeries,
  className,
  gatewayConfig
}) {
  const provider = gatewayConfig?.provider || 'mnotify';
  const apiKey = (gatewayConfig?.apiKey || '').trim();
  const dispatchSecret = (gatewayConfig?.dispatchSecret || '').trim();
  const rawSenderId = normalizeSmsSenderId(gatewayConfig?.senderId);
  const fallbackSenderId = rawSenderId || DEFAULT_MNOTIFY_SENDER_ID;

  const dispatches = recipients.map((rec) => {
    const formattedPhone = formatGhanaPhone(rec.parentPhone);
    const personalizedBody = interpolateSmsTemplate(messageTemplate, {
      parentName: rec.parentName,
      studentName: rec.name,
      indexNo: rec.indexNo,
      className,
      aggregate: rec.aggregate,
      totalScore: rec.overallTotal,
      position: rec.overallRank,
      mockSeries,
      amountPaid: rec.amountPaid,
      amountLeft: rec.amountLeft,
      targetFee: rec.targetFee,
      amountPaidNow: rec.amountPaidNow,
      ptaDate: schoolProfile?.ptaMeeting?.date,
      ptaTime: schoolProfile?.ptaMeeting?.time,
      ptaVenue: schoolProfile?.ptaMeeting?.venue,
      schoolName: schoolProfile?.schoolName
    });

    return {
      studentSn: rec.sn,
      studentName: rec.name,
      parentName: rec.parentName,
      phone: formattedPhone,
      rawPhone: rec.parentPhone,
      message: personalizedBody
    };
  });

  // Live gateway path when provider != simulation
  if (provider !== 'simulation') {
    if (provider !== 'mnotify' && !apiKey && !dispatchSecret) {
      throw new Error(`Enter your ${provider.toUpperCase()} API key in Configure Gateway before sending live SMS.`);
    }

    const validDispatches = dispatches.filter((d) => d.phone && d.phone.length >= 10);
    const invalidDispatches = dispatches.filter((d) => !d.phone || d.phone.length < 10);
    const failures = invalidDispatches.map((d) => ({
      ...d,
      reason: 'Missing or invalid Ghanaian phone number'
    }));

    if (validDispatches.length === 0) {
      return {
        mode: provider,
        total: dispatches.length,
        deliveredCount: 0,
        failedCount: failures.length,
        failures,
        dispatches
      };
    }

    // Use Vercel /api/send-sms proxy first for mNotify to avoid browser CORS blocks
    if (provider === 'mnotify') {
      try {
        const proxyRes = await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider,
            senderId: rawSenderId,
            apiKey,
            dispatchSecret,
            messages: validDispatches.map((d) => ({
              phone: d.phone,
              message: d.message
            }))
          })
        });

        // If running on plain Vite dev server without serverless /api/send-sms, fall back to direct fetch
        if (proxyRes.status !== 404 && proxyRes.status !== 405) {
          let proxyData = {};
          try {
            proxyData = await proxyRes.json();
          } catch {
            proxyData = {};
          }
          if (!proxyRes.ok) {
            throw new Error(proxyData.error || `Gateway proxy error (HTTP ${proxyRes.status})`);
          }

          const proxyFailures = Array.isArray(proxyData.failures) ? proxyData.failures : [];
          return {
            mode: provider,
            total: dispatches.length,
            deliveredCount: proxyData.deliveredCount || 0,
            failedCount: failures.length + proxyFailures.length,
            failures: [...failures, ...proxyFailures],
            dispatches
          };
        }
      } catch (err) {
        // Re-throw real API/validation errors; only continue fallback on local 404 or missing proxy
        if (!String(err?.message || '').includes('Failed to fetch')) {
          throw err;
        }
      }
    }

    if (!apiKey) {
      throw new Error('Server /api/send-sms proxy is unreachable here. Send from the deployed Vercel site or enter a manual API key.');
    }

    let deliveredCount = 0;

    for (const item of validDispatches) {
      try {
        if (provider === 'mnotify') {
          const res = await fetch(`https://api.mnotify.com/api/sms/quick?key=${encodeURIComponent(apiKey)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              recipient: [item.phone],
              sender: fallbackSenderId,
              message: item.message,
              is_schedule: false,
              schedule_date: ''
            })
          });
          let data = {};
          try {
            data = await res.json();
          } catch {
            data = {};
          }
          const evalResult = evaluateMnotifyResponse(res.ok, data);
          if (!evalResult.ok) {
            throw new Error(evalResult.reason || `HTTP ${res.status}`);
          }
          deliveredCount++;
        } else if (provider === 'hubtel') {
          const res = await fetch(
            `https://smsc.hubtel.com/v1/messages/send?clientsecret=${encodeURIComponent(gatewayConfig.clientSecret || '')}&clientid=${encodeURIComponent(apiKey)}&from=${encodeURIComponent(fallbackSenderId)}&to=${encodeURIComponent(item.phone)}&content=${encodeURIComponent(item.message)}`
          );
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          deliveredCount++;
        }
      } catch (err) {
        failures.push({ ...item, reason: err.message });
      }
    }

    return {
      mode: provider,
      total: dispatches.length,
      deliveredCount,
      failedCount: failures.length,
      failures,
      dispatches
    };
  }

  // Simulation Mode fallback (zero-cost instant sandbox verification)
  await new Promise((resolve) => setTimeout(resolve, 450));
  const validDispatches = dispatches.filter(d => d.phone.length >= 10);
  const invalidDispatches = dispatches.filter(d => d.phone.length < 10);

  return {
    mode: 'Simulation Mode',
    total: dispatches.length,
    deliveredCount: validDispatches.length,
    failedCount: invalidDispatches.length,
    failures: invalidDispatches.map(d => ({ ...d, reason: 'Invalid or missing phone number' })),
    dispatches
  };
}

/**
 * Automatically generates and dispatches an SMS payment confirmation to a parent
 * whenever a fee amount is recorded, informing them of the amount paid and balance left.
 */
export async function sendFeePaymentSms({
  student,
  amountPaidNow,
  totalPaidAfter,
  amountLeftAfter,
  schoolProfile,
  gatewayConfig
}) {
  const parentDisplay = formatSmsName(student?.parentName) || 'Parent/Guardian';
  const studentDisplay = formatSmsName(student?.name) || 'your ward';
  const generatedMessage = buildFeePaymentSms({
    parentName: student?.parentName,
    studentName: student?.name,
    amountPaidNow,
    totalPaidAfter,
    amountLeftAfter,
    schoolName: schoolProfile?.schoolName
  });
  const formattedPhone = formatGhanaPhone(student?.parentPhone);

  try {
    const result = await dispatchParentSmsBatch({
      recipients: [student],
      messageTemplate: generatedMessage,
      schoolProfile,
      className: 'Basic 9',
      gatewayConfig
    });

    const firstFailure = result.failures?.[0]?.reason;
    return {
      sent: result.deliveredCount > 0,
      mode: result.mode,
      deliveredCount: result.deliveredCount,
      failedCount: result.failedCount,
      phone: formattedPhone,
      rawPhone: student?.parentPhone || '',
      parentDisplay,
      studentDisplay,
      message: generatedMessage,
      error: firstFailure || ''
    };
  } catch (err) {
    return {
      sent: false,
      mode: gatewayConfig?.provider || 'simulation',
      deliveredCount: 0,
      failedCount: 1,
      phone: formattedPhone,
      rawPhone: student?.parentPhone || '',
      parentDisplay,
      studentDisplay,
      message: generatedMessage,
      error: err?.message || 'Unable to reach SMS gateway'
    };
  }
}

/**
 * Dispatches balance reminders ONLY to parents who are still owing (amountLeft > 0),
 * strictly skipping any parent who has already cleared their fees.
 */
export async function dispatchOwingFeeReminders({
  rows = [],
  messageTemplate,
  schoolProfile,
  gatewayConfig
}) {
  const owingRows = filterOwingRecipients(rows);
  const skippedClearedCount = Math.max(0, (Array.isArray(rows) ? rows.length : 0) - owingRows.length);

  if (owingRows.length === 0) {
    return {
      mode: gatewayConfig?.provider === 'simulation' ? 'Simulation Mode' : (gatewayConfig?.provider || 'Simulation Mode'),
      total: 0,
      deliveredCount: 0,
      failedCount: 0,
      failures: [],
      dispatches: [],
      skippedClearedCount
    };
  }

  const defaultBody =
    'Dear {parent_name}, kindly settle {student_name}\'s Basic 9 fee balance. Amount left to pay: {amount_left} (Paid: {amount_paid} of {total_fee}). Thank you. - {school_name}';

  const result = await dispatchParentSmsBatch({
    recipients: owingRows,
    messageTemplate: (messageTemplate || '').trim() || defaultBody,
    schoolProfile,
    className: 'Basic 9',
    gatewayConfig
  });

  return {
    ...result,
    skippedClearedCount
  };
}

/**
 * Dispatches a single quick test SMS via the active gateway (e.g., to verify
 * live delivery with approved Sender ID KpandoAngli before sending a batch).
 */
export async function sendSingleTestSms({
  phone,
  schoolProfile,
  gatewayConfig
}) {
  const schoolName = String(schoolProfile?.schoolName || 'Kpando Anglican Basic School').trim();
  const senderLabel = normalizeSmsSenderId(gatewayConfig?.senderId);
  const testBody = `Test SMS from ${schoolName} (${senderLabel}). mNotify SMS gateway is working properly.`;

  return dispatchParentSmsBatch({
    recipients: [
      {
        sn: 0,
        name: 'Test Verification',
        parentName: 'Staff Test',
        parentPhone: phone
      }
    ],
    messageTemplate: testBody,
    schoolProfile,
    className: 'Basic 9',
    gatewayConfig
  });
}
