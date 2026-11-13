import React from 'react';
import {
  Users, Award, MessageSquare, FileSpreadsheet, Printer, TrendingUp,
  Bell, CheckCircle2, AlertTriangle, Calendar, ArrowUpRight, Inbox, Wallet
} from 'lucide-react';

export default function AdminDashboard({
  activeClass,
  activeMock,
  rankedResults,
  allStudentsByClass,
  smsLogs,
  inquiries,
  schoolProfile,
  onNavigateTab,
  onUpdateInquiryStatus
}) {
  const totalEnrolled = Object.values(allStudentsByClass || {}).reduce((sum, list) => sum + (list?.length || 0), 0);
  const classCount = rankedResults.length;

  const avgAggregate = classCount > 0
    ? (rankedResults.reduce((s, r) => s + r.aggregate, 0) / classCount).toFixed(1)
    : '-';

  const avgPercentage = classCount > 0
    ? (rankedResults.reduce((s, r) => s + r.average, 0) / classCount).toFixed(1)
    : '-';

  const distinctionCount = rankedResults.filter((r) => r.aggregate <= 15).length;
  const passCount = rankedResults.filter((r) => r.aggregate <= 30).length;
  const passRate = classCount > 0 ? ((passCount / classCount) * 100).toFixed(0) : 0;

  const topFive = rankedResults.slice(0, 5);
  const bottomFive = [...rankedResults].slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Actions Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white border-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-300">
              {schoolProfile.schoolName} • {activeClass} ({activeMock})
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Administrator &amp; Basic 9 Mock Command Center
            </h2>
            <p className="text-xs text-emerald-100/80 max-w-2xl">
              Manage learners &amp; parent phone numbers, populate 100% Mock Exam scores, print ranked A4 class broadsheets &amp; report cards, and dispatch PTA SMS reminders.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('gradebook')}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" /> Enter Mock Marks
            </button>
            <button
              onClick={() => onNavigateTab('broadsheet')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" /> A4 Analysis &amp; Print
            </button>
            <button
              onClick={() => onNavigateTab('expenditure')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Wallet className="w-4 h-4" /> B9 Expenditure
            </button>
            <button
              onClick={() => onNavigateTab('sms')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Send PTA SMS
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-2 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">{activeClass} Candidates</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black">{classCount}</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400">
            {totalEnrolled} total learners across Basic 7–9
          </div>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Mean BECE Aggregate</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black">{avgAggregate}</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400">
            {distinctionCount} learners with Agg ≤ 15 • Avg {avgPercentage}%
          </div>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">BECE Pass Rate (Agg ≤ 30)</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black">{passRate}%</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400">
            {passCount} of {classCount} qualifying in {activeMock}
          </div>
        </div>

        <div className="glass-card p-5 space-y-2 border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Parent SMS Dispatches</span>
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black">{smsLogs.length}</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400">
            Next PTA: {schoolProfile.ptaMeeting?.date}
          </div>
        </div>
      </div>

      {/* Top 5 & Needs Support Lists */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider">Top 5 Ranked Learners ({activeMock})</h3>
            </div>
            <button
              onClick={() => onNavigateTab('broadsheet')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              Full Sheet <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {topFive.map((s) => (
              <div key={s.sn} className="px-5 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-black flex items-center justify-center shrink-0">
                    {s.overallRank}
                  </span>
                  <div className="truncate">
                    <div className="font-bold truncate">{s.name}</div>
                    <div className="text-[11px] text-slate-400">{s.indexNo} • {s.division}</div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="font-black text-sm text-emerald-700 dark:text-emerald-400">Agg {s.aggregate}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{s.overallTotal}/900</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider">Priority Intervention Candidates</h3>
            </div>
            <button
              onClick={() => onNavigateTab('sms')}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
            >
              Notify Parents →
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {bottomFive.map((s) => (
              <div key={s.sn} className="px-5 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-black flex items-center justify-center shrink-0">
                    {s.overallRank}
                  </span>
                  <div className="truncate">
                    <div className="font-bold truncate">{s.name}</div>
                    <div className="text-[11px] text-slate-400">Parent: {s.parentName} ({s.parentPhone})</div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="font-black text-sm text-rose-600 dark:text-rose-400">Agg {s.aggregate}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{s.overallTotal}/900</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PTA Schedule & Website Admission Inquiries */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" /> Upcoming PTA Reminder
            </h3>
            <button
              onClick={() => onNavigateTab('settings')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Edit Details
            </button>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <div className="font-bold text-sm text-amber-950 dark:text-amber-200">{schoolProfile.ptaMeeting?.title}</div>
            <div className="text-xs text-amber-800 dark:text-amber-300">
              <strong>Date &amp; Time:</strong> {schoolProfile.ptaMeeting?.date} at {schoolProfile.ptaMeeting?.time}
            </div>
            <div className="text-xs text-amber-800 dark:text-amber-300">
              <strong>Venue:</strong> {schoolProfile.ptaMeeting?.venue}
            </div>
            <div className="text-xs text-amber-800/90 dark:text-amber-300/80">
              <strong>Agenda:</strong> {schoolProfile.ptaMeeting?.agenda}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('sms')}
            className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Bell className="w-4 h-4" /> Broadcast PTA SMS to All {activeClass} Parents
          </button>
        </div>

        <div className="lg:col-span-7 glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
              <Inbox className="w-4 h-4 text-blue-600" /> Website Admission Inquiries ({inquiries.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">From Public Website Form</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800 max-h-64 overflow-y-auto">
            {inquiries.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No admission inquiries yet.</div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold">
                      {inq.studentName} <span className="text-emerald-700 dark:text-emerald-400">({inq.targetClass})</span>
                    </div>
                    <div className="text-slate-500 dark:text-zinc-400">
                      Parent: {inq.parentName} • Tel: <span className="font-mono">{inq.phone}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{inq.message}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={inq.status}
                      onChange={(e) => onUpdateInquiryStatus(inq.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border outline-none ${
                        inq.status === 'New'
                          ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Admitted">Admitted</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
