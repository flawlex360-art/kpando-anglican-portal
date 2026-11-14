import React, { useState, useMemo } from 'react';
import {
  Award, Printer, Download, TrendingUp, CheckCircle2, AlertTriangle, BarChart3, ArrowDownUp
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import toast from 'react-hot-toast';
import { JHS_SUBJECTS } from '../constants/schoolConstants';
import { exportMockBroadsheetExcel } from '../utils/excelExport';
import ghanaCoaImg from '../assets/ghana-coa.svg?inline';

export default function MockAnalysisBroadsheet({
  activeClass,
  activeMock,
  rankedResults,
  sortMode,
  onChangeSortMode,
  schoolProfile,
  onPrintBroadsheet
}) {
  const [filter, setFilter] = useState('all'); // all, distinction, pass, atRisk, boys, girls

  const filteredResults = useMemo(() => {
    if (filter === 'distinction') return rankedResults.filter((r) => r.aggregate <= 15);
    if (filter === 'pass') return rankedResults.filter((r) => r.aggregate <= 30);
    if (filter === 'atRisk') return rankedResults.filter((r) => r.aggregate > 30);
    if (filter === 'boys') return rankedResults.filter((r) => r.gender === 'M');
    if (filter === 'girls') return rankedResults.filter((r) => r.gender === 'F');
    return rankedResults;
  }, [rankedResults, filter]);

  const analytics = useMemo(() => {
    if (!rankedResults.length) return null;
    const count = rankedResults.length;
    const meanAgg = (rankedResults.reduce((s, r) => s + r.aggregate, 0) / count).toFixed(1);
    const bestAgg = Math.min(...rankedResults.map((r) => r.aggregate));
    const worstAgg = Math.max(...rankedResults.map((r) => r.aggregate));
    const passCount = rankedResults.filter((r) => r.aggregate <= 30).length;

    const subjectStats = JHS_SUBJECTS.map((sub) => {
      const avg =
        rankedResults.reduce((sum, r) => sum + (r.subjects?.[sub.key]?.score || 0), 0) / count;
      return {
        key: sub.key,
        name: sub.short,
        fullName: sub.name,
        isCore: sub.isCore,
        avg: parseFloat(avg.toFixed(1))
      };
    });

    const sortedSubs = [...subjectStats].sort((a, b) => b.avg - a.avg);
    const aggBands = [
      { band: 'Agg 6–10', count: rankedResults.filter((r) => r.aggregate <= 10).length, color: '#059669' },
      { band: 'Agg 11–15', count: rankedResults.filter((r) => r.aggregate >= 11 && r.aggregate <= 15).length, color: '#10b981' },
      { band: 'Agg 16–24', count: rankedResults.filter((r) => r.aggregate >= 16 && r.aggregate <= 24).length, color: '#3b82f6' },
      { band: 'Agg 25–30', count: rankedResults.filter((r) => r.aggregate >= 25 && r.aggregate <= 30).length, color: '#f59e0b' },
      { band: 'Agg 31+', count: rankedResults.filter((r) => r.aggregate >= 31).length, color: '#ef4444' }
    ];

    return {
      meanAgg,
      bestAgg,
      worstAgg,
      passRate: ((passCount / count) * 100).toFixed(1),
      topSubject: sortedSubs[0],
      lowestSubject: sortedSubs[sortedSubs.length - 1],
      subjectStats,
      aggBands
    };
  }, [rankedResults]);

  const handleExcelDownload = async () => {
    try {
      await exportMockBroadsheetExcel({
        rankedResults,
        schoolProfile,
        className: activeClass,
        mockSeries: activeMock
      });
      toast.success('Excel Broadsheet exported!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-base font-black flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            {activeClass} Mock Results Analysis &amp; A4 Broadsheet ({activeMock})
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Learners are automatically ranked from <strong>Best (1st) to Worst</strong> with 6-Subject BECE Aggregate (4 Core + Best 2 Electives).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs">
            <ArrowDownUp className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <span className="font-bold text-slate-500 hidden sm:inline">Rank by:</span>
            <button
              onClick={() => onChangeSortMode('aggregate')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                sortMode === 'aggregate'
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-600 dark:text-zinc-300'
              }`}
            >
              BECE Aggregate
            </button>
            <button
              onClick={() => onChangeSortMode('total')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                sortMode === 'total'
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-600 dark:text-zinc-300'
              }`}
            >
              Total Score (/900)
            </button>
          </div>

          <button
            onClick={handleExcelDownload}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Excel (.xlsx)
          </button>

          <button
            onClick={onPrintBroadsheet}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" /> Print A4 Whole-Class Sheet
          </button>
        </div>
      </div>

      {/* KPIs */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 no-print">
          <div className="glass-card p-4 border-l-4 border-l-emerald-600">
            <div className="text-[11px] font-bold uppercase text-slate-400">Mean / Best Aggregate</div>
            <div className="text-2xl font-black mt-1">
              {analytics.meanAgg} <span className="text-xs font-bold text-emerald-600">(Best: {analytics.bestAgg})</span>
            </div>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-blue-600">
            <div className="text-[11px] font-bold uppercase text-slate-400">Pass Rate (Agg ≤ 30)</div>
            <div className="text-2xl font-black mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-blue-600" /> {analytics.passRate}%
            </div>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-amber-500">
            <div className="text-[11px] font-bold uppercase text-slate-400">Strongest Subject</div>
            <div className="text-lg font-black mt-1 truncate">{analytics.topSubject?.fullName}</div>
            <div className="text-xs font-semibold text-emerald-600">{analytics.topSubject?.avg}% class avg</div>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-rose-500">
            <div className="text-[11px] font-bold uppercase text-slate-400">Needs Attention</div>
            <div className="text-lg font-black mt-1 truncate">{analytics.lowestSubject?.fullName}</div>
            <div className="text-xs font-semibold text-rose-500">{analytics.lowestSubject?.avg}% class avg</div>
          </div>
        </div>
      )}

      {/* Visual Charts */}
      {analytics && (
        <div className="grid lg:grid-cols-2 gap-5 no-print">
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <BarChart3 className="w-4 h-4 text-emerald-600" /> Subject Mean Scores (%)
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.subjectStats} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                    {analytics.subjectStats.map((entry) => (
                      <Cell key={entry.key} fill={entry.isCore ? '#065f46' : '#0ea5e9'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <TrendingUp className="w-4 h-4 text-amber-500" /> BECE Aggregate Distribution
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.aggBands} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="band" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {analytics.aggBands.map((entry) => (
                      <Cell key={entry.band} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap gap-1.5 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800">
          {[
            { id: 'all', label: `All (${rankedResults.length})` },
            { id: 'distinction', label: 'Distinction / Merit (Agg ≤ 15)' },
            { id: 'pass', label: 'Qualifying (Agg ≤ 30)' },
            { id: 'atRisk', label: 'At-Risk (Agg > 30)' },
            { id: 'boys', label: 'Boys' },
            { id: 'girls', label: 'Girls' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === f.id
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Best-to-Worst Master Broadsheet Preview Table */}
      <div className="glass-card overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse gradebook-table">
            <thead className="bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 font-bold text-center">
              <tr>
                <th className="px-2.5 py-3 w-12">Pos</th>
                <th className="px-2.5 py-3 w-28">Index No.</th>
                <th className="px-3 py-3 text-left min-w-[190px]">Learner Name</th>
                <th className="px-2 py-3 w-10">Sex</th>
                {JHS_SUBJECTS.map((sub) => (
                  <th key={sub.key} className="px-2 py-3 min-w-[68px]" title={sub.name}>
                    <div>{sub.short}</div>
                    <div className="text-[9px] font-normal text-slate-400">{sub.isCore ? 'Core' : 'Elec'}</div>
                  </th>
                ))}
                <th className="px-2.5 py-3 w-20 bg-slate-200/70 dark:bg-zinc-800">Total (/900)</th>
                <th className="px-2.5 py-3 w-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300">
                  Agg (6)
                </th>
                <th className="px-3 py-3 text-left min-w-[130px]">Standing</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((student) => (
                <tr key={student.sn} className="hover:bg-slate-50 dark:hover:bg-zinc-900/40 text-center">
                  <td className={`px-2 py-2 font-mono font-black ${
                    student.overallRankNum === 1 ? 'bg-amber-500/15 text-amber-600' :
                    student.overallRankNum <= 3 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : ''
                  }`}>
                    {student.overallRank}
                  </td>
                  <td className="px-2 py-2 font-mono text-slate-500">{student.indexNo}</td>
                  <td className="px-3 py-2 text-left font-bold truncate max-w-[200px]" title={student.name}>
                    {student.name}
                  </td>
                  <td className="px-2 py-2 font-bold">{student.gender}</td>
                  {JHS_SUBJECTS.map((sub) => {
                    const sr = student.subjects?.[sub.key] || { score: 0, grade: '9', numericGrade: 9 };
                    const isBestElective = !sub.isCore && student.bestElectiveKeys?.includes(sub.key);
                    return (
                      <td
                        key={sub.key}
                        className={`px-1.5 py-2 font-mono ${isBestElective ? 'bg-sky-50/70 dark:bg-sky-950/20' : ''}`}
                      >
                        <span className="font-bold">{sr.score}</span>
                        <span className={`ml-1 text-[10px] font-black ${
                          sr.numericGrade <= 2 ? 'text-emerald-600' :
                          sr.numericGrade <= 5 ? 'text-blue-600' :
                          sr.numericGrade <= 6 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          ({sr.grade})
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-2 py-2 font-mono font-black bg-slate-50 dark:bg-zinc-900/70">
                    {student.overallTotal}
                  </td>
                  <td className="px-2 py-2 font-black text-sm bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                    {student.aggregate}
                  </td>
                  <td className="px-3 py-2 text-left text-[11px] font-semibold">
                    {student.division}
                  </td>
                </tr>
              ))}
              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan={16} className="py-10 text-center text-slate-400">
                    No learners match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * Dedicated A4 Landscape Printable Broadsheet of the entire class scores & aggregates.
 */
export function PrintableA4Broadsheet({ activeClass, activeMock, rankedResults, schoolProfile }) {
  const count = rankedResults.length || 1;
  const subjectAverages = JHS_SUBJECTS.map((sub) => {
    const sum = rankedResults.reduce((acc, s) => acc + (s.subjects?.[sub.key]?.score || 0), 0);
    return (sum / count).toFixed(1);
  });
  const meanAgg = (rankedResults.reduce((acc, s) => acc + s.aggregate, 0) / count).toFixed(1);
  const meanTotal = (rankedResults.reduce((acc, s) => acc + s.overallTotal, 0) / count).toFixed(1);

  return (
    <div className="print-a4-broadsheet bg-white text-black p-4 font-sans">
      <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
        <img src={ghanaCoaImg} alt="Ghana Coat of Arms" className="w-12 h-12 object-contain" />
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-widest">Ghana Education Service • {schoolProfile.district}</div>
          <div className="text-lg font-black uppercase">{schoolProfile.schoolName}</div>
          <div className="text-xs font-bold uppercase tracking-wider mt-0.5">
            {activeClass} — {activeMock} Analysis &amp; Master Aggregate Sheet (Ranked Best to Worst)
          </div>
          <div className="text-[10px] font-semibold mt-0.5">
            Academic Year: {schoolProfile.academicYear} | No. On Roll: {rankedResults.length} | Aggregate = 4 Core + Best 2 Electives
          </div>
        </div>
        <img src="/anglican-crest.png" alt="Kpando Anglican Basic School Crest" className="w-12 h-12 object-contain" />
      </div>

      <table className="w-full border-collapse border border-black text-[10px]">
        <thead>
          <tr className="bg-zinc-200 font-bold text-center">
            <th className="border border-black px-1 py-1">Pos</th>
            <th className="border border-black px-1 py-1">Index No.</th>
            <th className="border border-black px-2 py-1 text-left">Candidate Name</th>
            <th className="border border-black px-1 py-1">Sex</th>
            {JHS_SUBJECTS.map((sub) => (
              <th key={sub.key} className="border border-black px-1 py-1">
                {sub.short}
                <div className="text-[8px] font-normal">{sub.isCore ? 'Core' : 'Elec'}</div>
              </th>
            ))}
            <th className="border border-black px-1 py-1">Total<br />(900)</th>
            <th className="border border-black px-1 py-1">Avg<br />(%)</th>
            <th className="border border-black px-1 py-1 bg-zinc-300">BECE<br />Agg</th>
            <th className="border border-black px-1 py-1 text-left">Standing</th>
          </tr>
        </thead>
        <tbody>
          {rankedResults.map((student) => (
            <tr key={student.sn} className="text-center">
              <td className="border border-black px-1 py-0.5 font-bold">{student.overallRank}</td>
              <td className="border border-black px-1 py-0.5 font-mono">{student.indexNo}</td>
              <td className="border border-black px-1.5 py-0.5 text-left font-semibold">{student.name}</td>
              <td className="border border-black px-1 py-0.5">{student.gender}</td>
              {JHS_SUBJECTS.map((sub) => {
                const sr = student.subjects?.[sub.key] || { score: 0, grade: '9' };
                return (
                  <td key={sub.key} className="border border-black px-1 py-0.5 font-mono">
                    {sr.score}({sr.grade})
                  </td>
                );
              })}
              <td className="border border-black px-1 py-0.5 font-bold font-mono">{student.overallTotal}</td>
              <td className="border border-black px-1 py-0.5 font-mono">{student.average}%</td>
              <td className="border border-black px-1 py-0.5 font-black bg-zinc-100">{student.aggregate}</td>
              <td className="border border-black px-1.5 py-0.5 text-left">{student.division}</td>
            </tr>
          ))}
          <tr className="bg-zinc-100 font-bold text-center">
            <td colSpan={4} className="border border-black px-2 py-1 text-right uppercase">Class Mean / Averages:</td>
            {subjectAverages.map((avg, idx) => (
              <td key={idx} className="border border-black px-1 py-1 font-mono">{avg}%</td>
            ))}
            <td className="border border-black px-1 py-1 font-mono">{meanTotal}</td>
            <td className="border border-black px-1 py-1 font-mono">-</td>
            <td className="border border-black px-1 py-1 font-black">{meanAgg}</td>
            <td className="border border-black px-1 py-1 text-left">Mean Agg</td>
          </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-12 mt-6 pt-2 text-[10px] font-bold uppercase text-center">
        <div>
          <div className="border-t border-black w-52 mx-auto pt-1">Form Master / Class Teacher</div>
          <div className="font-normal capitalize text-zinc-700">{schoolProfile.basic9TeacherName}</div>
        </div>
        <div>
          <div className="border-t border-black w-52 mx-auto pt-1">Headmaster&apos;s Signature &amp; Stamp</div>
          <div className="font-normal capitalize text-zinc-700">{schoolProfile.headmasterName}</div>
        </div>
      </div>
    </div>
  );
}
