import React, { useState, useMemo, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  CheckSquare,
  Square,
  History,
  Users,
  Eye,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Search,
  UserCheck,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SMS_TEMPLATES } from '../constants/schoolConstants';
import { computeBasic9FinanceSummary, formatCurrencyGhc, getLearnerFinanceKey } from '../utils/calculations';
import {
  DEFAULT_MNOTIFY_SENDER_ID,
  dispatchParentSmsBatch,
  filterOwingRecipients,
  formatSmsName,
  interpolateSmsTemplate,
  isLearnerOwing,
  normalizeSmsSenderId,
  sendSingleTestSms
} from '../utils/smsService';

export default function SmsCenter({
  activeClass,
  activeMock,
  rankedResults,
  basic9Finance,
  schoolProfile,
  gatewayConfig,
  onSaveGatewayConfig,
  smsLogs,
  onAddSmsLog
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(SMS_TEMPLATES[0].id);
  const [messageBody, setMessageBody] = useState(SMS_TEMPLATES[0].body);
  const [recipientMode, setRecipientMode] = useState('all'); // 'all' | 'selected'
  const [selectedSns, setSelectedSns] = useState(() => rankedResults.map((r) => r.sn));
  const [previewSn, setPreviewSn] = useState(rankedResults[0]?.sn || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTestBar, setShowTestBar] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [testPhone, setTestPhone] = useState(
    () => schoolProfile?.basic9TeacherPhone || schoolProfile?.phone || '0592664865'
  );
  const [sendingTest, setSendingTest] = useState(false);

  const activeSenderId = normalizeSmsSenderId(gatewayConfig?.senderId || DEFAULT_MNOTIFY_SENDER_ID);

  // Always connect Parent SMS Center to the approved mNotify Sender ID (KpandoAngli)
  const liveGatewayConfig = useMemo(
    () => ({
      ...gatewayConfig,
      provider: 'mnotify',
      senderId: activeSenderId
    }),
    [gatewayConfig, activeSenderId]
  );

  useEffect(() => {
    if (
      onSaveGatewayConfig &&
      (gatewayConfig?.provider !== 'mnotify' || gatewayConfig?.senderId !== activeSenderId)
    ) {
      onSaveGatewayConfig({
        ...gatewayConfig,
        provider: 'mnotify',
        senderId: activeSenderId
      });
    }
  }, [gatewayConfig, activeSenderId, onSaveGatewayConfig]);

  // Enrich recipients with Basic 9 fee payment & balance data and sort by Roster S/N
  const enrichedRecipients = useMemo(() => {
    const baseList = [...rankedResults].sort((a, b) => (Number(a.sn) || 0) - (Number(b.sn) || 0));
    if (activeClass !== 'Basic 9') return baseList;
    const summary = computeBasic9FinanceSummary(baseList, basic9Finance);
    const byKey = new Map(summary.learnerRows.map((row) => [row.financeKey, row]));
    return baseList.map((r) => {
      const fin = byKey.get(getLearnerFinanceKey(r));
      return fin
        ? {
            ...r,
            amountPaid: fin.amountPaid,
            amountLeft: fin.amountLeft,
            targetFee: fin.targetFee,
            financeStatus: fin.status
          }
        : r;
    });
  }, [activeClass, rankedResults, basic9Finance]);

  const isOwingReminderMode = useMemo(() => {
    const activeTpl = SMS_TEMPLATES.find((t) => t.id === selectedTemplateId);
    return Boolean(activeTpl?.owingOnly);
  }, [selectedTemplateId]);

  const owingOnlyRecipients = useMemo(
    () => (activeClass === 'Basic 9' ? filterOwingRecipients(enrichedRecipients) : enrichedRecipients),
    [activeClass, enrichedRecipients]
  );

  const eligibleRecipients = useMemo(
    () => (isOwingReminderMode && activeClass === 'Basic 9' ? owingOnlyRecipients : enrichedRecipients),
    [isOwingReminderMode, activeClass, owingOnlyRecipients, enrichedRecipients]
  );

  // Sync when switching classes or when in 'all' mode
  useEffect(() => {
    const allEligibleSns = eligibleRecipients.map((r) => r.sn);
    if (recipientMode === 'all') {
      setSelectedSns(allEligibleSns);
    } else {
      const eligibleSet = new Set(allEligibleSns);
      setSelectedSns((prev) => prev.filter((sn) => eligibleSet.has(sn)));
    }
    setPreviewSn((prev) =>
      allEligibleSns.includes(prev) ? prev : (eligibleRecipients[0]?.sn ?? null)
    );
  }, [activeClass, eligibleRecipients, recipientMode]);

  const filteredRecipients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return enrichedRecipients;
    return enrichedRecipients.filter(
      (r) =>
        String(r.parentName || '').toLowerCase().includes(q) ||
        String(r.name || '').toLowerCase().includes(q) ||
        String(r.indexNo || '').toLowerCase().includes(q) ||
        String(r.parentPhone || '').toLowerCase().includes(q)
    );
  }, [enrichedRecipients, searchQuery]);

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplateId(tpl.id);
    setMessageBody(tpl.body);
    if (tpl.owingOnly && activeClass === 'Basic 9') {
      const owingSns = owingOnlyRecipients.map((r) => r.sn);
      if (recipientMode === 'all') {
        setSelectedSns(owingSns);
      } else {
        const owingSet = new Set(owingSns);
        setSelectedSns((prev) => prev.filter((sn) => owingSet.has(sn)));
      }
      if (owingOnlyRecipients[0]) setPreviewSn(owingOnlyRecipients[0].sn);
    } else if (recipientMode === 'all') {
      setSelectedSns(enrichedRecipients.map((r) => r.sn));
    }
  };

  const handleSwitchMode = (mode) => {
    if (mode === 'all') {
      setRecipientMode('all');
      setSelectedSns(eligibleRecipients.map((r) => r.sn));
    } else {
      setRecipientMode('selected');
      // If all were selected from "All Parents" mode, clear checkboxes so staff can easily pick specific parents
      if (selectedSns.length === eligibleRecipients.length && eligibleRecipients.length > 1) {
        setSelectedSns([]);
      }
    }
  };

  const selectGroup = (group) => {
    if (group === 'all') {
      setRecipientMode('all');
      setSelectedSns(eligibleRecipients.map((r) => r.sn));
      return;
    }
    setRecipientMode('selected');
    if (group === 'none') {
      setSelectedSns([]);
      return;
    }
    if (group === 'owing') {
      const owingSns = owingOnlyRecipients.map((r) => r.sn);
      setSelectedSns(owingSns);
      if (owingOnlyRecipients[0]) setPreviewSn(owingOnlyRecipients[0].sn);
      return;
    }
    if (group === 'cleared') {
      const cleared = enrichedRecipients.filter((r) => !isLearnerOwing(r));
      setSelectedSns(cleared.map((r) => r.sn));
      if (cleared[0]) setPreviewSn(cleared[0].sn);
      return;
    }
    if (group === 'atRisk') {
      setSelectedSns(eligibleRecipients.filter((r) => r.aggregate > 30).map((r) => r.sn));
      return;
    }
    if (group === 'top') {
      setSelectedSns(eligibleRecipients.filter((r) => r.aggregate <= 15).map((r) => r.sn));
    }
  };

  const toggleRecipient = (sn) => {
    if (isOwingReminderMode && activeClass === 'Basic 9') {
      const target = enrichedRecipients.find((r) => r.sn === sn);
      if (target && !isLearnerOwing(target)) {
        toast('This parent has cleared all bills and is excluded from fee balance reminders.');
        return;
      }
    }
    setRecipientMode('selected');
    setPreviewSn(sn);
    setSelectedSns((prev) =>
      prev.includes(sn) ? prev.filter((item) => item !== sn) : [...prev, sn]
    );
  };

  const selectOnlyRecipient = (e, sn) => {
    e.stopPropagation();
    if (isOwingReminderMode && activeClass === 'Basic 9') {
      const target = enrichedRecipients.find((r) => r.sn === sn);
      if (target && !isLearnerOwing(target)) {
        toast('This parent has cleared all bills and is excluded from fee balance reminders.');
        return;
      }
    }
    setRecipientMode('selected');
    setSelectedSns([sn]);
    setPreviewSn(sn);
  };

  const previewStudent = useMemo(() => {
    if (isOwingReminderMode && activeClass === 'Basic 9') {
      return (
        enrichedRecipients.find((r) => r.sn === previewSn && isLearnerOwing(r)) ||
        owingOnlyRecipients[0] ||
        enrichedRecipients[0]
      );
    }
    return enrichedRecipients.find((r) => r.sn === previewSn) || enrichedRecipients[0];
  }, [enrichedRecipients, previewSn, isOwingReminderMode, activeClass, owingOnlyRecipients]);

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
      amountPaid: previewStudent.amountPaid,
      amountLeft: previewStudent.amountLeft,
      targetFee: previewStudent.targetFee,
      ptaDate: schoolProfile?.ptaMeeting?.date,
      ptaTime: schoolProfile?.ptaMeeting?.time,
      ptaVenue: schoolProfile?.ptaMeeting?.venue,
      schoolName: schoolProfile?.schoolName
    });
  }, [messageBody, previewStudent, activeClass, activeMock, schoolProfile]);

  const handleSendTestSms = async () => {
    if (!testPhone.trim()) {
      toast.error('Enter a Ghanaian phone number to send a test SMS.');
      return;
    }
    setSendingTest(true);
    try {
      const res = await sendSingleTestSms({
        phone: testPhone,
        schoolProfile,
        gatewayConfig: liveGatewayConfig
      });
      if (res.failedCount > 0) {
        const reason = res.failures?.[0]?.reason || 'Delivery failed';
        toast.error(`Test SMS failed: ${reason}`);
      } else {
        onAddSmsLog({
          id: `sms-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          category: 'Gateway Test SMS',
          gateway: `${res.mode} (${activeSenderId})`,
          recipientCount: 1,
          deliveredCount: 1,
          sampleMessage: res.dispatches?.[0]?.message || `Test SMS (${activeSenderId})`
        });
        toast.success(`Test SMS delivered to ${testPhone} via ${activeSenderId}!`);
      }
    } catch (err) {
      toast.error(`Test SMS error: ${err.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  const executeDispatch = async (targetRecipients) => {
    let recipients = targetRecipients;
    let skippedCleared = 0;

    if (isOwingReminderMode && activeClass === 'Basic 9') {
      const beforeCount = recipients.length;
      recipients = filterOwingRecipients(recipients);
      skippedCleared = beforeCount - recipients.length;
    }

    if (recipients.length === 0) {
      toast.error(
        isOwingReminderMode && activeClass === 'Basic 9'
          ? 'No owing parents selected — cleared parents are automatically excluded.'
          : 'Select at least one parent recipient to send SMS.'
      );
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
        gatewayConfig: liveGatewayConfig
      });

      const tplLabel =
        SMS_TEMPLATES.find((t) => t.id === selectedTemplateId)?.label || 'Custom Broadcast';
      onAddSmsLog({
        id: `sms-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        category: tplLabel,
        gateway: `${result.mode} (${activeSenderId})`,
        recipientCount: result.total,
        deliveredCount: result.deliveredCount,
        sampleMessage: result.dispatches[0]?.message || messageBody
      });

      if (result.failedCount > 0) {
        const firstReason = result.failures?.[0]?.reason;
        const msg = `Dispatched ${result.deliveredCount}/${result.total} SMS via ${activeSenderId} (${result.failedCount} failed${firstReason ? `: ${firstReason}` : ''}).`;
        if (result.deliveredCount === 0) toast.error(msg);
        else toast.success(msg);
      } else {
        toast.success(
          `Successfully sent ${result.deliveredCount} personalized SMS via ${activeSenderId}!${
            skippedCleared > 0 ? ` (${skippedCleared} cleared excluded)` : ''
          }`
        );
      }
    } catch (err) {
      toast.error(`SMS dispatch error: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendSelected = () => {
    const selected = eligibleRecipients.filter((r) => selectedSns.includes(r.sn));
    return executeDispatch(selected);
  };

  const handleSendToAll = () => {
    setRecipientMode('all');
    setSelectedSns(eligibleRecipients.map((r) => r.sn));
    return executeDispatch(eligibleRecipients);
  };

  const selectedCount = selectedSns.length;
  const allEligibleCount = eligibleRecipients.length;
  const isAllSelected = allEligibleCount > 0 && selectedCount === allEligibleCount;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            Parent SMS Center ({activeClass})
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Send personalized PTA reminders, Mock result alerts, fee reminders, or custom notices to selected parents or all parents.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            mNotify Live • Sender ID: <strong className="font-mono">{activeSenderId}</strong>
          </span>
          <button
            type="button"
            onClick={() => setShowTestBar((v) => !v)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> {showTestBar ? 'Hide Test SMS' : 'Send Test SMS'}
          </button>
        </div>
      </div>

      {/* Optional Quick 1-SMS Test Bar */}
      {showTestBar && (
        <div className="glass-card p-4 border-l-4 border-l-emerald-600 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-600 dark:text-zinc-300">
            Send a single test SMS using approved Sender ID{' '}
            <strong className="font-mono text-emerald-700 dark:text-emerald-400">{activeSenderId}</strong>:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="tel"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="e.g. 0246541331"
              className="w-44 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-mono outline-none"
            />
            <button
              type="button"
              disabled={sendingTest}
              onClick={handleSendTestSms}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {sendingTest ? 'Sending...' : 'Send 1 Test SMS'}
            </button>
          </div>
        </div>
      )}

      {/* Composer + Recipient Selection */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Message Composer & Live Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-5 space-y-4">
            {/* Step 1: Audience Mode Switcher */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                1. Who Should Receive This SMS?
              </label>
              <div className="grid sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('all')}
                  className={`px-3.5 py-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    recipientMode === 'all' && isAllSelected
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-emerald-500'
                  }`}
                >
                  <div>
                    <div className="text-xs font-black flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Send to All {isOwingReminderMode && activeClass === 'Basic 9' ? 'Owing ' : ''}Parents
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        recipientMode === 'all' && isAllSelected
                          ? 'text-emerald-100'
                          : 'text-slate-500 dark:text-zinc-400'
                      }`}
                    >
                      Every eligible parent in {activeClass} ({allEligibleCount})
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                      recipientMode === 'all' && isAllSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {allEligibleCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchMode('selected')}
                  className={`px-3.5 py-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    recipientMode === 'selected' || !isAllSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-amber-500'
                  }`}
                >
                  <div>
                    <div className="text-xs font-black flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" />
                      Select Specific Parents
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        recipientMode === 'selected' || !isAllSelected
                          ? 'text-amber-100'
                          : 'text-slate-500 dark:text-zinc-400'
                      }`}
                    >
                      Tick 1 or more parents from the list on the right
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                      recipientMode === 'selected' || !isAllSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {selectedCount}/{allEligibleCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Step 2: Template Picker */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                2. Choose SMS Template
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

            {/* Step 3: Message Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  3. Customize Message Content
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {previewText.length} chars ({previewText.length <= 160 ? '1 SMS page' : `${Math.ceil(previewText.length / 153)} SMS pages`})
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
                  '{parent_name}',
                  '{student_name}',
                  '{aggregate}',
                  '{total_score}',
                  '{position}',
                  '{amount_left}',
                  '{amount_paid}',
                  '{total_fee}',
                  '{pta_date}',
                  '{pta_time}',
                  '{pta_venue}',
                  '{school_name}'
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 shrink-0">
                  <Eye className="w-3.5 h-3.5" /> Live SMS Preview ({activeSenderId})
                </span>
                <select
                  value={previewStudent?.sn || ''}
                  onChange={(e) => setPreviewSn(Number(e.target.value))}
                  className="text-[11px] font-bold bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2 py-1 outline-none max-w-[290px]"
                >
                  {eligibleRecipients.map((r) => (
                    <option key={r.sn} value={r.sn}>
                      {r.sn}. {formatSmsName(r.parentName || 'Parent')} ({formatSmsName(r.name)})
                      {activeClass === 'Basic 9' && r.amountLeft !== undefined
                        ? ` — Left: ${formatCurrencyGhc(r.amountLeft)}`
                        : ''}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-800 dark:text-zinc-200 leading-relaxed font-medium">
                {previewText}
              </p>
            </div>

            {/* Action Buttons: Send to Selected OR Send to All */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleSendSelected}
                disabled={isSending || selectedCount === 0}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 transition-all"
              >
                <Send className="w-4 h-4" />
                {isSending
                  ? 'Dispatching SMS...'
                  : selectedCount === 0
                    ? 'Tick Parents on the Right to Send'
                    : isAllSelected
                      ? `Send SMS to All ${selectedCount} Parents (${activeSenderId})`
                      : `Send SMS to ${selectedCount} Selected Parent${selectedCount === 1 ? '' : 's'} (${activeSenderId})`}
              </button>

              {!isAllSelected && allEligibleCount > 0 && (
                <button
                  type="button"
                  onClick={handleSendToAll}
                  disabled={isSending}
                  className="py-3 px-4 rounded-xl border-2 border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 disabled:opacity-50 font-extrabold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-all"
                >
                  <Users className="w-4 h-4" />
                  Send to All ({allEligibleCount})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Parent Recipients Selector */}
        <div className="lg:col-span-5 glass-card overflow-hidden flex flex-col max-h-[640px]">
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Parent Recipients ({selectedCount}/{allEligibleCount} Selected)
              </h3>
              <div className="flex flex-wrap gap-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => selectGroup('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    isAllSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200'
                  }`}
                >
                  Select All ({allEligibleCount})
                </button>
                <button
                  type="button"
                  onClick={() => selectGroup('none')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-700 dark:text-zinc-300"
                >
                  Unselect All
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parent name, learner, or phone..."
                className="w-full pl-8 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Group Filters */}
            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
              {activeClass === 'Basic 9' && (
                <>
                  <button
                    type="button"
                    onClick={() => selectGroup('owing')}
                    className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 hover:bg-amber-200"
                  >
                    Owing Only ({owingOnlyRecipients.length})
                  </button>
                  {!isOwingReminderMode && (
                    <button
                      type="button"
                      onClick={() => selectGroup('cleared')}
                      className="px-2 py-1 rounded bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200"
                    >
                      Cleared ({enrichedRecipients.length - owingOnlyRecipients.length})
                    </button>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={() => selectGroup('top')}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-emerald-100"
              >
                Agg ≤ 15
              </button>
              <button
                type="button"
                onClick={() => selectGroup('atRisk')}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-rose-100"
              >
                At-Risk (Agg &gt; 30)
              </button>
            </div>

            {isOwingReminderMode && activeClass === 'Basic 9' && (
              <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg px-2.5 py-1.5 font-medium">
                Owing reminder template active: parents who have cleared their fees are excluded automatically.
              </p>
            )}
          </div>

          <div className="divide-y divide-slate-100 dark:divide-zinc-800 overflow-y-auto flex-1">
            {filteredRecipients.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No parent or learner matches &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              filteredRecipients.map((r) => {
                const owingBlocked = isOwingReminderMode && activeClass === 'Basic 9' && !isLearnerOwing(r);
                const checked = !owingBlocked && selectedSns.includes(r.sn);
                return (
                  <div
                    key={r.sn}
                    onClick={() => toggleRecipient(r.sn)}
                    className={`px-4 py-2.5 flex items-center justify-between gap-2 text-xs transition-colors ${
                      owingBlocked
                        ? 'opacity-50 cursor-not-allowed bg-slate-50/70 dark:bg-zinc-900/30'
                        : checked
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/25 cursor-pointer'
                          : 'hover:bg-slate-50 dark:hover:bg-zinc-900/40 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <div className="font-bold truncate text-slate-900 dark:text-white">
                          {r.sn}. {formatSmsName(r.parentName) || 'Parent/Guardian'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                          Ward: <strong className="text-slate-700 dark:text-zinc-300">{formatSmsName(r.name)}</strong> • Agg {r.aggregate} ({r.overallRank})
                          {activeClass === 'Basic 9' && r.amountLeft !== undefined && (
                            <span
                              className={
                                isLearnerOwing(r)
                                  ? ' text-amber-700 dark:text-amber-400 font-semibold'
                                  : ' text-emerald-700 dark:text-emerald-400 font-semibold'
                              }
                            >
                              {' '}• {isLearnerOwing(r) ? `Left: ${formatCurrencyGhc(r.amountLeft)}` : 'Cleared'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!owingBlocked && (
                        <button
                          type="button"
                          onClick={(e) => selectOnlyRecipient(e, r.sn)}
                          title="Select only this parent"
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold border transition-colors ${
                            selectedCount === 1 && checked
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 hover:border-amber-500 hover:text-amber-700'
                          }`}
                        >
                          Only
                        </button>
                      )}
                      <span className="font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        {r.parentPhone || 'No Phone'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
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
