import React, { useState, useEffect } from 'react';
import { Printer, FileText, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import MockReportCard from './MockReportCard';
import { DEFAULT_CONDUCT, DEFAULT_INTEREST, DEFAULT_REMARKS } from '../constants/schoolConstants';

export default function ReportCardManager({
  activeClass,
  activeMock,
  rankedResults,
  students,
  schoolProfile,
  onUpdateStudentMeta,
  onPrintSingle,
  onPrintAll
}) {
  const [selectedSn, setSelectedSn] = useState(rankedResults[0]?.sn || null);
  const [metaDraft, setMetaDraft] = useState({
    attendance: 60,
    conduct: '',
    interest: '',
    remarks: ''
  });

  useEffect(() => {
    if (rankedResults.length > 0 && !rankedResults.some((r) => r.sn === selectedSn)) {
      setSelectedSn(rankedResults[0].sn);
    }
  }, [rankedResults, selectedSn]);

  const currentResult = rankedResults.find((r) => r.sn === selectedSn) || rankedResults[0];
  const currentIndex = rankedResults.findIndex((r) => r.sn === currentResult?.sn);

  useEffect(() => {
    if (currentResult) {
      setMetaDraft({
        attendance: currentResult.attendance ?? 60,
        conduct: currentResult.conduct || '',
        interest: currentResult.interest || '',
        remarks: currentResult.remarks || ''
      });
    }
  }, [currentResult?.sn]);

  const handleSaveMeta = (e) => {
    e.preventDefault();
    if (!currentResult) return;
    onUpdateStudentMeta(currentResult.sn, metaDraft);
    toast.success(`Updated report remarks for ${currentResult.name}`);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setSelectedSn(rankedResults[currentIndex - 1].sn);
  };

  const handleNext = () => {
    if (currentIndex < rankedResults.length - 1) setSelectedSn(rankedResults[currentIndex + 1].sn);
  };

  if (!rankedResults.length) {
    return (
      <div className="glass-card p-10 text-center text-sm text-slate-400">
        No students found in {activeClass}. Add learners in the Roster tab first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <div>
            <h2 className="text-base font-black">
              {activeClass} Mock Report Cards ({activeMock})
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Edit conduct/remarks and print individual or full-class A4 BECE Mock Report Cards.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className="p-2 rounded-lg border border-slate-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <select
              value={currentResult?.sn || ''}
              onChange={(e) => setSelectedSn(Number(e.target.value))}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold outline-none max-w-[240px]"
            >
              {rankedResults.map((r) => (
                <option key={r.sn} value={r.sn}>
                  {r.overallRank} — {r.name} (Agg {r.aggregate})
                </option>
              ))}
            </select>
            <button
              onClick={handleNext}
              disabled={currentIndex >= rankedResults.length - 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onPrintSingle(currentResult)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print Current Card
          </button>

          <button
            onClick={onPrintAll}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print All ({rankedResults.length}) A4
          </button>
        </div>
      </div>

      {/* Editor + Live Preview Split */}
      <div className="grid xl:grid-cols-12 gap-6 items-start">
        {/* Qualitative Assessment Editor */}
        <form onSubmit={handleSaveMeta} className="xl:col-span-4 glass-card p-5 space-y-4 no-print">
          <div className="border-b border-slate-200 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-black">Report Remarks Editor</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Editing for <strong>{currentResult?.name}</strong> (Pos: {currentResult?.overallRank}, Agg: {currentResult?.aggregate})
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              Attendance (out of {schoolProfile.timesOpen || 65})
            </label>
            <input
              type="number"
              min={0}
              max={schoolProfile.timesOpen || 100}
              value={metaDraft.attendance}
              onChange={(e) => setMetaDraft({ ...metaDraft, attendance: parseInt(e.target.value, 10) || 0 })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Conduct</label>
            <select
              value={metaDraft.conduct}
              onChange={(e) => setMetaDraft({ ...metaDraft, conduct: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs outline-none mb-1.5"
            >
              <option value="">-- Select preset conduct --</option>
              {DEFAULT_CONDUCT.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              value={metaDraft.conduct}
              onChange={(e) => setMetaDraft({ ...metaDraft, conduct: e.target.value })}
              placeholder="Or type custom conduct..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Interest / Co-curricular</label>
            <select
              value={metaDraft.interest}
              onChange={(e) => setMetaDraft({ ...metaDraft, interest: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs outline-none mb-1.5"
            >
              <option value="">-- Select preset interest --</option>
              {DEFAULT_INTEREST.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            <input
              type="text"
              value={metaDraft.interest}
              onChange={(e) => setMetaDraft({ ...metaDraft, interest: e.target.value })}
              placeholder="Or type custom interest..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Class Teacher&apos;s Remarks</label>
            <select
              value={metaDraft.remarks}
              onChange={(e) => setMetaDraft({ ...metaDraft, remarks: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs outline-none mb-1.5"
            >
              <option value="">-- Select preset remark --</option>
              {DEFAULT_REMARKS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <textarea
              rows={2}
              value={metaDraft.remarks}
              onChange={(e) => setMetaDraft({ ...metaDraft, remarks: e.target.value })}
              placeholder="Or type custom teacher remark..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Remarks
          </button>
        </form>

        {/* Live Report Card Preview */}
        <div className="xl:col-span-8">
          <MockReportCard
            studentResult={currentResult}
            activeClass={activeClass}
            activeMock={activeMock}
            rollCount={rankedResults.length}
            schoolProfile={schoolProfile}
          />
        </div>
      </div>
    </div>
  );
}
