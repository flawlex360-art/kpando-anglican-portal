import React, { useState, useEffect } from 'react';
import { Save, Grid, ListFilter, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { JHS_SUBJECTS } from '../constants/schoolConstants';
import { calculateGrade, calculateStudentAggregate, getOrdinalSuffix } from '../utils/calculations';

export default function MockGradebook({
  activeClass,
  activeMock,
  students,
  classMockGrades,
  onSaveMockGrades
}) {
  const [entryMode, setEntryMode] = useState('matrix'); // 'matrix' (all subjects) or 'single' (1 subject focus)
  const [activeSubject, setActiveSubject] = useState(JHS_SUBJECTS[0]);
  const [localScores, setLocalScores] = useState({});
  const [hasUnsaved, setHasUnsaved] = useState(false);

  useEffect(() => {
    const initialized = {};
    students.forEach((s) => {
      initialized[s.sn] = { ...(classMockGrades?.[s.sn] || {}) };
    });
    setLocalScores(initialized);
    setHasUnsaved(false);
  }, [students, classMockGrades, activeClass, activeMock]);

  const handleScoreChange = (sn, subjectKey, rawVal) => {
    if (rawVal === '') {
      setLocalScores((prev) => ({
        ...prev,
        [sn]: { ...(prev[sn] || {}), [subjectKey]: '' }
      }));
      setHasUnsaved(true);
      return;
    }

    const num = parseFloat(rawVal);
    if (isNaN(num) || num < 0 || num > 100) return;

    setLocalScores((prev) => ({
      ...prev,
      [sn]: { ...(prev[sn] || {}), [subjectKey]: num }
    }));
    setHasUnsaved(true);
  };

  const handleSave = () => {
    const sanitized = {};
    students.forEach((s) => {
      const row = localScores[s.sn] || {};
      sanitized[s.sn] = {};
      JHS_SUBJECTS.forEach((sub) => {
        const val = row[sub.key];
        sanitized[s.sn][sub.key] = val === '' || val === undefined ? 0 : Math.min(100, Math.max(0, parseFloat(val) || 0));
      });
    });
    onSaveMockGrades(sanitized);
    setHasUnsaved(false);
    toast.success(`Saved 100% Mock Scores for ${activeClass} (${activeMock})!`);
  };

  // Live subject ranks for Single Subject Mode
  const singleSubjectRanks = React.useMemo(() => {
    const list = students.map((s) => ({
      sn: s.sn,
      score: parseFloat(localScores?.[s.sn]?.[activeSubject.key]) || 0
    }));
    const sorted = [...list].sort((a, b) => b.score - a.score);
    const rankMap = {};
    sorted.forEach((item, idx) => {
      if (idx > 0 && item.score === sorted[idx - 1].score) {
        rankMap[item.sn] = rankMap[sorted[idx - 1].sn];
      } else {
        rankMap[item.sn] = idx + 1;
      }
    });
    return rankMap;
  }, [students, localScores, activeSubject]);

  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = document.getElementById(`score-cell-${rowIndex + 1}-${colIndex}`);
      next?.focus();
      next?.select?.();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = document.getElementById(`score-cell-${rowIndex - 1}-${colIndex}`);
      prev?.focus();
      prev?.select?.();
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black">
              100% Mock Score Entry — {activeClass} ({activeMock})
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              100% Exam Only (No SBA Split)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Enter raw examination marks (0–100) for each subject. BECE Grades (1–9) &amp; 6-subject Aggregates calculate live.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800">
            <button
              onClick={() => setEntryMode('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                entryMode === 'matrix'
                  ? 'bg-white dark:bg-zinc-800 text-emerald-800 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> All Subjects Grid
            </button>
            <button
              onClick={() => setEntryMode('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                entryMode === 'single'
                  ? 'bg-white dark:bg-zinc-800 text-emerald-800 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" /> Single Subject
            </button>
          </div>

          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all ${
              hasUnsaved
                ? 'bg-amber-400 hover:bg-amber-300 text-emerald-950 animate-pulse'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
          >
            {hasUnsaved ? <Save className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {hasUnsaved ? 'Save Mock Marks *' : 'Marks Saved'}
          </button>
        </div>
      </div>

      {/* Subject Tabs when in Single Subject Mode */}
      {entryMode === 'single' && (
        <div className="flex flex-wrap gap-1.5">
          {JHS_SUBJECTS.map((sub) => (
            <button
              key={sub.key}
              onClick={() => setActiveSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                activeSubject.key === sub.key
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:border-emerald-500'
              }`}
            >
              {sub.name} {sub.isCore ? '(Core)' : ''}
            </button>
          ))}
        </div>
      )}

      {/* Entry Grid */}
      <div className="glass-card overflow-hidden">
        {entryMode === 'matrix' ? (
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-xs border-collapse gradebook-table">
              <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 font-bold">
                <tr>
                  <th className="px-2 py-2.5 w-10 text-center">S/N</th>
                  <th className="px-3 py-2.5 text-left min-w-[200px]">Learner Name</th>
                  {JHS_SUBJECTS.map((sub) => (
                    <th key={sub.key} className="px-1.5 py-2.5 text-center min-w-[74px]" title={sub.name}>
                      <div>{sub.short}</div>
                      <div className={`text-[9px] font-semibold ${sub.isCore ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {sub.isCore ? 'CORE' : 'ELEC'}
                      </div>
                    </th>
                  ))}
                  <th className="px-2.5 py-2.5 text-center bg-slate-200/70 dark:bg-zinc-800 w-20">Total /900</th>
                  <th className="px-2.5 py-2.5 text-center bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 w-20">
                    BECE Agg
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={JHS_SUBJECTS.length + 4} className="py-10 text-center text-slate-400">
                      No learners enrolled in {activeClass} yet. Add learners in the Students &amp; Parents tab first.
                    </td>
                  </tr>
                ) : (
                  students.map((student, rIdx) => {
                  const row = localScores[student.sn] || {};
                  const subjectMapForAgg = {};
                  let rowTotal = 0;

                  JHS_SUBJECTS.forEach((sub) => {
                    const scoreVal = parseFloat(row[sub.key]) || 0;
                    rowTotal += scoreVal;
                    const g = calculateGrade(scoreVal);
                    subjectMapForAgg[sub.key] = { score: scoreVal, numericGrade: g.numericGrade };
                  });

                  const { aggregate } = calculateStudentAggregate(subjectMapForAgg, JHS_SUBJECTS);

                  return (
                    <tr key={student.sn} className="hover:bg-slate-50 dark:hover:bg-zinc-900/40">
                      <td className="px-2 py-1.5 text-center font-mono text-slate-400">{student.sn}</td>
                      <td className="px-3 py-1.5 font-bold truncate max-w-[220px]" title={student.name}>
                        {student.name}
                      </td>
                      {JHS_SUBJECTS.map((sub, cIdx) => {
                        const rawVal = row[sub.key] ?? '';
                        const g = calculateGrade(rawVal || 0);
                        return (
                          <td key={sub.key} className="p-1 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <input
                                id={`score-cell-${rIdx}-${cIdx}`}
                                type="number"
                                min={0}
                                max={100}
                                step="1"
                                value={rawVal}
                                onChange={(e) => handleScoreChange(student.sn, sub.key, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, rIdx, cIdx)}
                                className="w-12 px-1 py-1 text-center font-mono font-bold rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                              />
                              <span className={`text-[10px] font-black w-3 ${
                                g.numericGrade <= 2 ? 'text-emerald-600' :
                                g.numericGrade <= 5 ? 'text-blue-600' :
                                g.numericGrade <= 6 ? 'text-amber-600' : 'text-rose-600'
                              }`}>
                                {g.grade}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-2 py-1.5 text-center font-mono font-extrabold bg-slate-50 dark:bg-zinc-900/70">
                        {Math.round(rowTotal)}
                      </td>
                      <td className="px-2 py-1.5 text-center font-black bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                        {aggregate}
                      </td>
                    </tr>
                  );
                })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-xs border-collapse gradebook-table">
              <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 font-bold">
                <tr>
                  <th className="px-3 py-3 w-14 text-center">S/N</th>
                  <th className="px-3 py-3 w-32">Index No.</th>
                  <th className="px-3 py-3 text-left">Learner Name</th>
                  <th className="px-3 py-3 w-40 text-center">{activeSubject.name} Score (100%)</th>
                  <th className="px-3 py-3 w-24 text-center">Grade (1–9)</th>
                  <th className="px-3 py-3 w-24 text-center">Subject Pos</th>
                  <th className="px-3 py-3 text-left">Remark</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      No learners enrolled in {activeClass} yet. Add learners in the Students &amp; Parents tab first.
                    </td>
                  </tr>
                ) : (
                  students.map((student, rIdx) => {
                  const rawVal = localScores?.[student.sn]?.[activeSubject.key] ?? '';
                  const numScore = parseFloat(rawVal) || 0;
                  const { grade, numericGrade, remark } = calculateGrade(numScore);
                  const pos = getOrdinalSuffix(singleSubjectRanks[student.sn]);

                  return (
                    <tr key={student.sn} className="hover:bg-slate-50 dark:hover:bg-zinc-900/40">
                      <td className="px-3 py-2 text-center font-mono text-slate-400">{student.sn}</td>
                      <td className="px-3 py-2 font-mono">{student.indexNo}</td>
                      <td className="px-3 py-2 font-bold">{student.name}</td>
                      <td className="px-3 py-1.5 text-center">
                        <input
                          id={`score-cell-${rIdx}-0`}
                          type="number"
                          min={0}
                          max={100}
                          value={rawVal}
                          onChange={(e) => handleScoreChange(student.sn, activeSubject.key, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, rIdx, 0)}
                          className="w-24 px-2 py-1.5 text-center font-mono font-bold rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full font-black ${
                          numericGrade <= 2 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                          numericGrade <= 5 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                          numericGrade <= 6 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                          'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                        }`}>
                          {grade}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center font-mono font-bold">{pos}</td>
                      <td className="px-3 py-2 font-medium">{remark}</td>
                    </tr>
                  );
                })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 px-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Tip: Use <strong>Enter</strong> or <strong>Arrow Up/Down</strong> to move rapidly down student rows.</span>
      </div>
    </div>
  );
}
