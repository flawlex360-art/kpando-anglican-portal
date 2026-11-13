/**
 * Ghanaian Parent SMS Service
 * Supports Simulation / Sandbox Mode (default when no API key is configured)
 * as well as live dispatch via mNotify, Arkesel, or Hubtel.
 */

export function formatGhanaPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('233') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return `233${digits.slice(1)}`;
  if (digits.length === 9) return `233${digits}`;
  return digits;
}

export function interpolateSmsTemplate(template, context) {
  if (!template) return '';
  const replacements = {
    '{parent_name}': context.parentName || 'Parent/Guardian',
    '{student_name}': context.studentName || 'your ward',
    '{index_no}': context.indexNo || '',
    '{class}': context.className || 'Basic 9',
    '{aggregate}': context.aggregate !== undefined ? String(context.aggregate) : '-',
    '{total_score}': context.totalScore !== undefined ? String(context.totalScore) : '-',
    '{position}': context.position || '-',
    '{mock_series}': context.mockSeries || 'Mock 1',
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
  const provider = gatewayConfig?.provider || 'simulation';
  const apiKey = (gatewayConfig?.apiKey || '').trim();
  const senderId = (gatewayConfig?.senderId || 'KPANDO ANG').slice(0, 11);

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

  // Live gateway path when provider != simulation and API key is supplied
  if (provider !== 'simulation' && apiKey) {
    let deliveredCount = 0;
    const failures = [];

    for (const item of dispatches) {
      if (!item.phone) {
        failures.push({ ...item, reason: 'Missing phone number' });
        continue;
      }

      try {
        if (provider === 'mnotify') {
          const res = await fetch(`https://api.mnotify.com/api/sms/quick?key=${encodeURIComponent(apiKey)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipient: [item.phone],
              sender: senderId,
              message: item.message,
              is_schedule: false,
              schedule_date: ''
            })
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          deliveredCount++;
        } else if (provider === 'arkesel') {
          const res = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': apiKey
            },
            body: JSON.stringify({
              sender: senderId,
              message: item.message,
              recipients: [item.phone]
            })
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          deliveredCount++;
        } else if (provider === 'hubtel') {
          const res = await fetch(
            `https://smsc.hubtel.com/v1/messages/send?clientsecret=${encodeURIComponent(gatewayConfig.clientSecret || '')}&clientid=${encodeURIComponent(apiKey)}&from=${encodeURIComponent(senderId)}&to=${encodeURIComponent(item.phone)}&content=${encodeURIComponent(item.message)}`
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
