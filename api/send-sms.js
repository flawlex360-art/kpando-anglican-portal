import crypto from 'node:crypto';

/**
 * Vercel Serverless Function: Ghanaian SMS Gateway Proxy (Arkesel & mNotify)
 * Keeps ARKESEL_API_KEY strictly on Vercel (never committed to GitHub or client JS)
 * and avoids browser CORS restrictions when dispatching SMS from any device.
 */

function normalizeRecipients(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .map((m) => ({
      phone: String(m?.phone || '').replace(/\D/g, ''),
      message: String(m?.message || '').trim()
    }))
    .filter((m) => m.phone.length >= 10 && m.message.length > 0);
}

function constantTimeMatch(a, b) {
  const bufA = Buffer.from(String(a || ''), 'utf8');
  const bufB = Buffer.from(String(b || ''), 'utf8');
  if (bufA.length === 0 || bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      serverKeyConfigured: Boolean(String(process.env.ARKESEL_API_KEY || '').trim()),
      pinConfigured: Boolean(String(process.env.SMS_DISPATCH_SECRET || '').trim()),
      defaultSenderId: String(process.env.ARKESEL_SENDER_ID || '').trim().slice(0, 11)
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use GET or POST.' });
  }

  const {
    provider = 'arkesel',
    senderId = '',
    messages = [],
    apiKey = '',
    dispatchSecret = ''
  } = req.body || {};

  const cleanSender = String(senderId || process.env.ARKESEL_SENDER_ID || '').trim();
  if (cleanSender.length < 3 || cleanSender.length > 11) {
    return res.status(400).json({
      error: 'Sender ID must be between 3 and 11 characters.'
    });
  }

  const validMessages = normalizeRecipients(messages);
  if (validMessages.length === 0) {
    return res.status(400).json({
      error: 'No valid recipient phone numbers or message content provided.'
    });
  }

  // Prefer server-side ARKESEL_API_KEY (with Dispatch PIN verification) or browser-supplied override key
  let effectiveKey = String(apiKey || '').trim();
  if (!effectiveKey && provider === 'arkesel' && process.env.ARKESEL_API_KEY) {
    const expectedSecret = String(process.env.SMS_DISPATCH_SECRET || '').trim();
    if (!expectedSecret) {
      return res.status(400).json({
        error:
          'ARKESEL_API_KEY is present on Vercel, but SMS_DISPATCH_SECRET is not set. Add SMS_DISPATCH_SECRET in Vercel Environment Variables to unlock multi-device SMS securely.'
      });
    }
    if (!constantTimeMatch(dispatchSecret.trim(), expectedSecret)) {
      return res.status(401).json({
        error: 'Invalid or missing Server Dispatch PIN. Check your PIN in Configure Gateway.'
      });
    }
    effectiveKey = String(process.env.ARKESEL_API_KEY).trim();
  }

  if (!effectiveKey) {
    return res.status(400).json({
      error: 'Missing SMS gateway credentials. Configure ARKESEL_API_KEY + SMS_DISPATCH_SECRET on Vercel or enter a manual API key.'
    });
  }

  if (provider === 'arkesel') {
    const groupedByText = new Map();
    for (const item of validMessages) {
      if (!groupedByText.has(item.message)) groupedByText.set(item.message, []);
      groupedByText.get(item.message).push(item.phone);
    }

    let deliveredCount = 0;
    const failures = [];

    for (const [text, phones] of groupedByText.entries()) {
      try {
        const upstream = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': effectiveKey
          },
          body: JSON.stringify({
            sender: cleanSender,
            message: text,
            recipients: phones
          })
        });

        let data = {};
        try {
          data = await upstream.json();
        } catch {
          data = {};
        }

        const ok = upstream.ok && (!data.status || data.status === 'success');
        if (ok) {
          deliveredCount += phones.length;
        } else {
          const reason = data.message || data.error || `Arkesel HTTP ${upstream.status}`;
          for (const phone of phones) {
            failures.push({ phone, reason });
          }
        }
      } catch (err) {
        for (const phone of phones) {
          failures.push({ phone, reason: err?.message || 'Network error reaching Arkesel' });
        }
      }
    }

    return res.status(200).json({
      provider: 'arkesel',
      deliveredCount,
      failedCount: failures.length,
      failures
    });
  }

  if (provider === 'mnotify') {
    let deliveredCount = 0;
    const failures = [];

    for (const item of validMessages) {
      try {
        const upstream = await fetch(
          `https://api.mnotify.com/api/sms/quick?key=${encodeURIComponent(effectiveKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipient: [item.phone],
              sender: cleanSender,
              message: item.message,
              is_schedule: false,
              schedule_date: ''
            })
          }
        );
        let data = {};
        try {
          data = await upstream.json();
        } catch {
          data = {};
        }
        if (upstream.ok) {
          deliveredCount++;
        } else {
          failures.push({ phone: item.phone, reason: data.message || `mNotify HTTP ${upstream.status}` });
        }
      } catch (err) {
        failures.push({ phone: item.phone, reason: err?.message || 'Network error reaching mNotify' });
      }
    }

    return res.status(200).json({
      provider: 'mnotify',
      deliveredCount,
      failedCount: failures.length,
      failures
    });
  }

  return res.status(400).json({ error: `Unsupported server proxy provider: ${provider}` });
}
