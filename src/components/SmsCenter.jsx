import React, { useState, useMemo } from 'react';
import {
  MessageSquare, Send, CheckSquare, Square, Settings2, History, Users, Eye, Sparkles, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SMS_TEMPLATES } from '../constants/schoolConstants';
import { dispatchParentSmsBatch, interpolateSmsTemplate } from '../utils/smsService';

export default function SmsCenter({
  activeClass,
  activeMock,
  rankedResults,
  schoolProfile,
  gatewayConfig,
  onSaveGatewayConfig,
  smsLogs,
  onAddSmsLog
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(SMS_TEMPLATES[0].id);
  const [messageBody, setMessageBody] = useState(SMS_TEMPLATES[0].body);
  const [selectedSns, setSelectedSns] = useState(() => rankedResults.map((r) => r.sn));
  const [previewSn, setPreviewSn] = useState(rankedResults[0]?.sn || null);
  const [showGatewayPanel, setShowGatewayPanel] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Keep selections synced if class changes
  React.useEffect(() => {
    setSelectedSns(rankedResults.map((r) => r.sn));
    setPreviewSn(rankedResults[0]?.sn || null);
  }, [activeClass, rankedResults.length]);

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplateId(tpl.id);
    setMessageBody(tpl.body);
  };

  const selectGroup = (group) => {
    if (group === 'all') setSelectedSns(rankedResults.map((r) => r.sn));
    else if (group === 'none') setSelectedSns([]);
    else if (group === 'atRisk') setSelectedSns(rankedResults.filter((r) => r.aggregate > 30).map((r) => r.sn));
    else if (group === 'top') setSelectedSns(rankedResults.filter((r) => r.aggregate <= 15).map((r) => r.sn));
  };

  const toggleRecipient = (sn) => {
    setSelectedSns((prev) =>
      prev.includes(sn) ? prev.filter((item) => item !== sn) : [...prev, sn]
    );
  };

  const previewStudent = useMemo(
    () => rankedResults.find((r) => r.sn === previewSn) || rankedResults[0],
    [rankedResults, previewSn]
  );

  const previewText = useMemo(() => {
    if (!previewStudent) return messageBody;
    return interpolateSmsTemplate(messageBody, {
      parentName: previewStudent.parentName,
      studentName: previewStudent.name,
      indexNo: previewStudent.indexNo,
      className: activeClass,
      aggregate: previewStudent.aggregate,
      totalScore: previewStudent.overallTotal,
      position: previewStudent.overallRank,
      mockSeries: activeMock,
      ptaDate: schoolProfile?.ptaMeeting?.date,
      ptaTime: schoolProfile?.ptaMeeting?.time,
      ptaVenue: schoolProfile?.ptaMeeting?.venue,
      schoolName: schoolProfile?.schoolName
    });
  }, [messageBody, previewStudent, activeClass, activeMock, schoolProfile]);

  const handleSendSms = async () => {
    const recipients = rankedResults.filter((r) => selectedSns.includes(r.sn));
    if (recipients.length === 0) {
      toast.error('Select at least one parent recipient.');
      return;
    }
    if (!messageBody.trim()) {
      toast.error('SMS message cannot be empty.');
      return;
    }

    setIsSending(true);
    try {
      const result = await dispatchParentSmsBatch({
        recipients,
        messageTemplate: messageBody,
        schoolProfile,
        mockSeries: activeMock,
        className: activeClass,
        gatewayConfig
      });

      const tplLabel = SMS_TEMPLATES.find((t) => t.id === selectedTemplateId)?.label || 'Custom Broadcast';
      onAddSmsLog({
        id: `sms-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        category: tplLabel,
        gateway: result.mode,
        recipientCount: result.total,
        deliveredCount: result.deliveredCount,
        sampleMessage: result.dispatches[0]?.message || messageBody
      });

      if (result.failedCount > 0) {
        toast.success(
          `Dispatched ${result.deliveredCount}/${result.total} SMS via ${result.mode} (${result.failedCount} skipped/failed).`
        );
      } else {
        toast.success(
          `Successfully sent ${result.deliveredCount} personalized SMS via ${result.mode}!`
        );
      }
    } catch (err) {
      toast.error(`SMS dispatch error: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            Parent SMS Reminder &amp; Mock Alert Center ({activeClass})
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Send personalized PTA reminders, Basic 9 Mock aggregates, or custom alerts directly to parents&apos; phones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold">
            Gateway: {gatewayConfig.provider === 'simulation' ? 'Simulation Mode (Sandbox)' : gatewayConfig.provider.toUpperCase()}
          </span>
          <button
            onClick={() => setShowGatewayPanel(!showGatewayPanel)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold flex items-center gap-1.5"
          >
            <Settings2 className="w-3.5 h-3.5" /> Configure Gateway
          </button>
        </div>
      </div>

      {/* Collapsible SMS Gateway Configuration */}
      {showGatewayPanel && (
        <div className="glass-card p-5 space-y-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black">Ghanaian SMS Gateway Configuration</h3>
            <span className="text-[11px] text-slate-400">
              Use Simulation Mode for testing, or add live mNotify / Arkesel / Hubtel credentials.
            </span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Provider</label>
              <select
                value={gatewayConfig.provider}
                onChange={(e) => onSaveGatewayConfig({ ...gatewayConfig, provider: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-bold outline-none"
              >
                <option value="simulation">Simulation / Sandbox Mode (Free)</option>
                <option value="mnotify">mNotify Ghana SMS API</option>
                <option value="arkesel">Arkesel Ghana SMS API</option>
                <option value="hubtel">Hubtel SMS API</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Sender ID (Max 11 chars)</label>
              <input
                type="text"
                maxLength={11}
                value={gatewayConfig.senderId}
                onChange={(e) => onSaveGatewayConfig({ ...gatewayConfig, senderId: e.target.value })}
                placeholder="KPANDO ANG"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">
                {gatewayConfig.provider === 'hubtel' ? 'Client ID' : 'API Key'}
              </label>
              <input
                type="password"
                value={gatewayConfig.apiKey}
                onChange={(e) => onSaveGatewayConfig({ ...gatewayConfig, apiKey: e.target.value })}
                placeholder={gatewayConfig.provider === 'simulation' ? 'Not needed in Simulation' : 'Paste live API key...'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-mono outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Composer + Recipient Selection */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Message Composer & Live Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                1. Choose SMS Template
              </label>
              <div className="grid sm:grid-cols-2 gap-2">
                {SMS_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                      selectedTemplateId === tpl.id
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-emerald-500'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  2. Customize Message Template
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {previewText.length} chars (~{Math.max(1, Math.ceil(previewText.length / 160))} SMS page)
                </span>
              </div>
              <textarea
                rows={4}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  '{parent_name}', '{student_name}', '{aggregate}', '{total_score}',
                  '{position}', '{pta_date}', '{pta_time}', '{pta_venue}'
                ].map((token) => (
                  <button
                    key={token}
                    type="button"
                    onClick={() => setMessageBody((prev) => `${prev} ${token}`)}
                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-[10px] font-mono font-semibold text-slate-600 dark:text-zinc-300"
                  >
                    +{token}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Interpolated Preview */}
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Live SMS Preview
                </span>
                <select
                  value={previewSn || ''}
                  onChange={(e) => setPreviewSn(Number(e.target.value))}
                  className="text-[11px] font-bold bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2 py-1 outline-none"
                >
                  {rankedResults.map((r) => (
                    <option key={r.sn} value={r.sn}>
                      {r.parentName} ({r.name})
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-800 dark:text-zinc-200 leading-relaxed font-medium">
                {previewText}
              </p>
            </div>

            <button
              onClick={handleSendSms}
              disabled={isSending || selectedSns.length === 0}
              className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 transition-all"
            >
              <Send className="w-4 h-4" />
              {isSending
                ? 'Dispatching SMS...'
                : `Send Personalized SMS to ${selectedSns.length} Parent${selectedSns.length === 1 ? '' : 's'}`}
            </button>
          </div>
        </div>

        {/* Right: Parent Recipients Selector */}
        <div className="lg:col-span-5 glass-card overflow-hidden flex flex-col max-h-[560px]">
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Recipients ({selectedSns.length}/{rankedResults.length})
              </h3>
              <div className="flex gap-1 text-[11px] font-bold">
                <button onClick={() => selectGroup('all')} className="px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-emerald-100">All</button>
                <button onClick={() => selectGroup('top')} className="px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-emerald-100">Agg ≤ 15</button>
                <button onClick={() => selectGroup('atRisk')} className="px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-rose-100">At-Risk</button>
                <button onClick={() => selectGroup('none')} className="px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800">Clear</button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-zinc-800 overflow-y-auto flex-1">
            {rankedResults.map((r) => {
              const checked = selectedSns.includes(r.sn);
              return (
                <div
                  key={r.sn}
                  onClick={() => toggleRecipient(r.sn)}
                  className={`px-4 py-2.5 flex items-center justify-between gap-2 cursor-pointer text-xs transition-colors ${
                    checked ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'hover:bg-slate-50 dark:hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <div className="truncate">
                      <div className="font-bold truncate">{r.parentName || 'Parent'}</div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        Ward: {r.name} • Agg {r.aggregate} ({r.overallRank})
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                    {r.parentPhone || 'No Phone'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dispatch History Log */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-black flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" /> SMS Dispatch History ({smsLogs.length})
          </h3>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Every broadcast is logged
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Gateway</th>
                <th className="px-4 py-3 text-center">Delivered</th>
                <th className="px-4 py-3">Sample Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {smsLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/40">
                  <td className="px-4 py-2.5 font-mono text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-2.5 font-bold whitespace-nowrap">{log.category}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {log.gateway}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {log.deliveredCount}/{log.recipientCount}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-zinc-300 max-w-md truncate" title={log.sampleMessage}>
                    {log.sampleMessage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
