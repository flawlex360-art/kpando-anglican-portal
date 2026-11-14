import React, { useState, useMemo } from 'react';
import {
  Award, BookOpen, Calculator, Calendar, CheckCircle2,
  Clock, GraduationCap, Layers, ShieldCheck, Sparkles
} from 'lucide-react';
import { JHS_SUBJECTS } from '../../constants/schoolConstants';
import {
  calculateGrade,
  calculateStudentAggregate,
  formatLongOrdinalDate
} from '../../utils/calculations';
import {
  ACADEMIC_DIVISIONS,
  CSSPS_TRANSITION_STEPS,
  EXTERNAL_SBA_PORTAL_URL,
  WEEKLY_ACADEMIC_SCHEDULE
} from '../../constants/publicSiteData';
import { PublicPageHero } from './PublicSharedUI';

const GRADING_THRESHOLDS = [
  { band: '90 – 100', sample: 95 },
  { band: '80 – 89', sample: 85 },
  { band: '70 – 79', sample: 75 },
  { band: '60 – 69', sample: 65 },
  { band: '55 – 59', sample: 57 },
  { band: '50 – 54', sample: 52 },
  { band: '40 – 49', sample: 45 },
  { band: '35 – 39', sample: 37 },
  { band: '0 – 34', sample: 25 }
];

const SIMULATOR_PRESETS = {
  distinction: {
    label: 'Distinction Sample',
    scores: {
      ENG: 86,
      MATHS: 92,
      SCI: 90,
      SOC: 88,
      'C.TECH': 91,
      COMP: 93,
      RME: 84,
      'GH.LANG': 78,
      'C.ARTS': 80
    }
  },
  merit: {
    label: 'High Merit Sample',
    scores: {
      ENG: 74,
      MATHS: 78,
      SCI: 76,
      SOC: 81,
      'C.TECH': 80,
      COMP: 85,
      RME: 75,
      'GH.LANG': 68,
      'C.ARTS': 72
    }
  },
  intervention: {
    label: 'Revision Priority Sample',
    scores: {
      ENG: 54,
      MATHS: 48,
      SCI: 52,
      SOC: 60,
      'C.TECH': 64,
      COMP: 67,
      RME: 58,
      'GH.LANG': 51,
      'C.ARTS': 55
    }
  }
};

export default function PublicAcademicsTab({ schoolProfile, onNavigate }) {
  const [activeDivisionId, setActiveDivisionId] = useState('jhs');
  const [simScores, setSimScores] = useState(SIMULATOR_PRESETS.distinction.scores);

  const activeDivision = useMemo(
    () => ACADEMIC_DIVISIONS.find((d) => d.id === activeDivisionId) || ACADEMIC_DIVISIONS[2],
    [activeDivisionId]
  );

  const simulatorResult = useMemo(() => {
    const subjectsMap = {};
    let overallTotal = 0;
    JHS_SUBJECTS.forEach((sub) => {
      const score = Math.min(100, Math.max(0, Number(simScores[sub.key]) || 0));
      const { grade, numericGrade, remark } = calculateGrade(score);
      subjectsMap[sub.key] = { score, grade, numericGrade, remark };
      overallTotal += score;
    });
    const agg = calculateStudentAggregate(subjectsMap, JHS_SUBJECTS);
    return {
      subjectsMap,
      overallTotal,
      ...agg
    };
  }, [simScores]);

  const coreSubjects = useMemo(() => JHS_SUBJECTS.filter((s) => s.isCore), []);
  const electiveSubjects = useMemo(() => JHS_SUBJECTS.filter((s) => !s.isCore), []);

  const handleScoreChange = (key, rawValue) => {
    const clamped = Math.min(100, Math.max(0, parseInt(rawValue || '0', 10) || 0));
    setSimScores((prev) => ({ ...prev, [key]: clamped }));
  };

  return (
    <div>
      <PublicPageHero
        breadcrumb="Academics & BECE Hub"
        badge="GES & NaCCA Curriculum"
        title="Academic Excellence from Kindergarten to BECE Distinction"
        description="Explore our structured progression across Early Grade, Primary, and Basic 7–9 Junior High School — supported by 100% Mock WebSBA analytics and guided CSSPS Senior High preparation."
        onNavigate={onNavigate}
        rightContent={
          <a
            href={EXTERNAL_SBA_PORTAL_URL}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4" /> Teacher WebSBA Portal
          </a>
        }
      />

      {/* 1. Interactive Divisions Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> School Stages &amp; Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Academic Divisions (KG 1 – Basic 9)
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {ACADEMIC_DIVISIONS.map((div) => (
              <button
                key={div.id}
                type="button"
                onClick={() => setActiveDivisionId(div.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeDivisionId === div.id
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50'
                }`}
              >
                {div.id === 'kg-lower'
                  ? 'KG & Lower Primary'
                  : div.id === 'upper-primary'
                  ? 'Upper Primary (B4–B6)'
                  : 'Junior High (B7–B9 BECE)'}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[11px] font-bold">
                {activeDivision.badge}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                {activeDivision.ageRange}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">{activeDivision.title}</h3>
            <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">{activeDivision.summary}</p>
            <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
              {activeDivision.highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-xs font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
            <div className="font-extrabold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Key Learning Areas
            </div>
            <div className="flex flex-wrap gap-2">
              {activeDivision.subjects.map((subj) => (
                <span
                  key={subj}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-semibold"
                >
                  {subj}
                </span>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigate('admissions')}
                className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                Check Admission Requirements for this Level →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BECE 9-Subject Breakdown & Interactive Aggregate Simulator */}
      <section className="bg-slate-100 dark:bg-zinc-900/40 border-y border-slate-200 dark:border-zinc-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" /> Live Mock WebSBA Formula
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Interactive BECE Best-6 Aggregate Simulator
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-2xl">
                Adjust scores below (0–100%) to see how Kpando Anglican’s Mock WebSBA engine calculates Grades 1–9 and automatically picks your Best 2 Electives alongside the 4 compulsory Core subjects.
              </p>
            </div>

            {schoolProfile.examDate && (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs font-bold text-amber-950 dark:text-amber-200">
                <Calendar className="w-4 h-4 text-amber-600" />
                Next Mock Date: {formatLongOrdinalDate(schoolProfile.examDate)}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Simulator Inputs */}
            <div className="lg:col-span-7 glass-card p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3">
                <span className="text-xs font-black uppercase tracking-wider">Load Preset Candidate Profile:</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(SIMULATOR_PRESETS).map(([presetKey, preset]) => (
                    <button
                      key={presetKey}
                      type="button"
                      onClick={() => setSimScores(preset.scores)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-[11px] font-bold"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
                    4 Compulsory Core Subjects (All 4 Counted)
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {coreSubjects.map((sub) => {
                      const res = simulatorResult.subjectsMap[sub.key];
                      return (
                        <div
                          key={sub.key}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold">{sub.name}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-black">
                              Grade {res.grade}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={0}
                              max={100}
                              aria-label={`${sub.name} score slider`}
                              value={res.score}
                              onChange={(e) => handleScoreChange(sub.key, e.target.value)}
                              className="w-full accent-emerald-700"
                            />
                            <input
                              type="number"
                              min={0}
                              max={100}
                              aria-label={`${sub.name} score`}
                              value={res.score}
                              onChange={(e) => handleScoreChange(sub.key, e.target.value)}
                              className="w-14 px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs font-mono font-bold text-center"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
                    5 Electives (Best 2 Highlighted Automatically)
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {electiveSubjects.map((sub) => {
                      const res = simulatorResult.subjectsMap[sub.key];
                      const isBestTwo = simulatorResult.bestElectiveKeys.includes(sub.key);
                      return (
                        <div
                          key={sub.key}
                          className={`p-3 rounded-xl border space-y-1.5 transition-colors ${
                            isBestTwo
                              ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-400 dark:border-amber-700'
                              : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs gap-1">
                            <span className="font-bold truncate">
                              {sub.name}{' '}
                              {isBestTwo && (
                                <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300">
                                  ★ Best 2
                                </span>
                              )}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-zinc-800 font-black shrink-0">
                              Grade {res.grade}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={0}
                              max={100}
                              aria-label={`${sub.name} score slider`}
                              value={res.score}
                              onChange={(e) => handleScoreChange(sub.key, e.target.value)}
                              className="w-full accent-amber-600"
                            />
                            <input
                              type="number"
                              min={0}
                              max={100}
                              aria-label={`${sub.name} score`}
                              value={res.score}
                              onChange={(e) => handleScoreChange(sub.key, e.target.value)}
                              className="w-14 px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs font-mono font-bold text-center"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Simulator Results & Official Scale Table */}
            <div className="lg:col-span-5 space-y-5">
              <div className="glass-card p-6 bg-gradient-to-br from-emerald-950 to-teal-950 text-white border-none space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Computed Result Preview
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold">
                    Best 6 Aggregate
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                    <div className="text-2xl sm:text-3xl font-black text-amber-300">
                      {String(simulatorResult.aggregate).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-emerald-100/80 mt-0.5">
                      BECE Aggregate
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                    <div className="text-xl sm:text-2xl font-black">{simulatorResult.overallTotal}</div>
                    <div className="text-[10px] uppercase tracking-wider text-emerald-100/80 mt-0.5">
                      Out of 900
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex flex-col justify-center">
                    <div className="text-xs font-black text-white">{simulatorResult.division}</div>
                    <div className="text-[10px] text-emerald-100/80 mt-0.5">BECE Standing</div>
                  </div>
                </div>
                <div className="text-xs text-emerald-100/85 pt-2 border-t border-white/15 flex justify-between">
                  <span>4 Core Sum: <strong>{simulatorResult.coreSum}</strong></span>
                  <span>Best 2 Electives Sum: <strong>{simulatorResult.bestElectivesSum}</strong></span>
                </div>
              </div>

              <div className="glass-card p-5 space-y-3">
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  Official 9-Point Mock &amp; BECE Grading Scale
                </h3>
                <div className="grid grid-cols-3 text-xs border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                  <div className="px-3 py-2 font-black bg-slate-100 dark:bg-zinc-900">Score (%)</div>
                  <div className="px-3 py-2 font-black bg-slate-100 dark:bg-zinc-900 text-center">Grade</div>
                  <div className="px-3 py-2 font-black bg-slate-100 dark:bg-zinc-900">Remark</div>
                  {GRADING_THRESHOLDS.map((row) => {
                    const g = calculateGrade(row.sample);
                    return (
                      <React.Fragment key={row.band}>
                        <div className="px-3 py-1.5 border-t border-slate-100 dark:border-zinc-800 font-mono">
                          {row.band}
                        </div>
                        <div className="px-3 py-1.5 border-t border-slate-100 dark:border-zinc-800 text-center font-black text-emerald-700 dark:text-emerald-400">
                          {g.grade}
                        </div>
                        <div className="px-3 py-1.5 border-t border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-zinc-400">
                          {g.remark}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CSSPS Transition & Weekly Remedial Timetable */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" /> Basic 9 Transition
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-1">
              BECE Readiness &amp; CSSPS Senior High Placement
            </h2>
          </div>
          <div className="space-y-3">
            {CSSPS_TRANSITION_STEPS.map((item) => (
              <div key={item.step} className="glass-card p-4 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Instructional Rhythm
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-1">
              Weekly Learning &amp; Saturday Clinic Schedule
            </h2>
          </div>
          <div className="glass-card divide-y divide-slate-100 dark:divide-zinc-800 overflow-hidden">
            {WEEKLY_ACADEMIC_SCHEDULE.map((slot) => (
              <div key={slot.activity} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-black text-emerald-800 dark:text-emerald-400">
                    {slot.day} • <span className="font-mono">{slot.window}</span>
                  </div>
                  <div className="text-sm font-bold mt-0.5">{slot.activity}</div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 font-semibold w-fit shrink-0">
                  {slot.audience}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
