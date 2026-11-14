import React, { useState, useMemo } from 'react';
import {
  Award, BookOpen, Building2, CheckCircle2, Compass, HeartHandshake,
  ShieldCheck, Sparkles, Target, Users
} from 'lucide-react';
import anglicanCrestImg from '../../assets/anglican-crest.png';
import {
  PLACEHOLDER_FACULTY_DIRECTORY,
  SCHOOL_CORE_VALUES,
  SCHOOL_HISTORY_MILESTONES,
  SCHOOL_VISION_MISSION
} from '../../constants/publicSiteData';
import { PublicPageHero } from './PublicSharedUI';

const VALUE_ICON_MAP = {
  faith: ShieldCheck,
  excellence: Award,
  discipline: CheckCircle2,
  innovation: Sparkles,
  partnership: HeartHandshake
};

const STAFF_FILTERS = ['All', 'Administration', 'JHS Core', 'Electives & Practicals', 'Primary & KG'];

export default function PublicAboutTab({ schoolProfile, totalStudents, basic9Count, onNavigate }) {
  const [staffFilter, setStaffFilter] = useState('All');

  const headmasterDisplay = schoolProfile.headmasterName?.trim() || 'Headteacher (Update in School Settings)';
  const basic9LeadDisplay = schoolProfile.basic9TeacherName?.trim() || 'Basic 9 Form Master (Update in School Settings)';

  const fullStaffDirectory = useMemo(() => {
    const liveLeadership = [
      {
        id: 'live-head',
        name: headmasterDisplay,
        role: 'Headteacher / Chief Administrator',
        department: 'Administration',
        qualification: `${schoolProfile.district} • Anglican Education Unit`,
        bio: `Provides overall academic supervision, staff mentorship, PTA liaison, and BECE examination accountability at ${schoolProfile.schoolName}.`,
        isLive: Boolean(schoolProfile.headmasterName?.trim())
      },
      {
        id: 'live-b9',
        name: basic9LeadDisplay,
        role: 'Basic 9 Form Master & BECE Mock Coordinator',
        department: 'Administration',
        qualification: schoolProfile.basic9TeacherPhone
          ? `Direct Line: ${schoolProfile.basic9TeacherPhone}`
          : 'Basic 9 Academic & SMS Coordination',
        bio: 'Coordinates final-year BECE Mock examinations, terminal report card compilation, fee receipts, and parent SMS notifications.',
        isLive: Boolean(schoolProfile.basic9TeacherName?.trim())
      }
    ];
    return [...liveLeadership, ...PLACEHOLDER_FACULTY_DIRECTORY];
  }, [headmasterDisplay, basic9LeadDisplay, schoolProfile.district, schoolProfile.schoolName, schoolProfile.basic9TeacherPhone]);

  const filteredStaff = useMemo(() => {
    if (staffFilter === 'All') return fullStaffDirectory;
    return fullStaffDirectory.filter((member) => member.department === staffFilter);
  }, [fullStaffDirectory, staffFilter]);

  return (
    <div>
      <PublicPageHero
        breadcrumb="About Us"
        badge="Anglican Mission & GES Basic School"
        title={`About ${schoolProfile.schoolName}`}
        description={`${schoolProfile.motto} — Serving learners across Kpando Municipality with Christian character formation, GES instructional rigor, and accountable Basic 9 BECE preparation.`}
        onNavigate={onNavigate}
        rightContent={
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15">
              <div className="text-xl font-black">{totalStudents}</div>
              <div className="text-[11px] text-emerald-100/85">JHS Enrolled</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15">
              <div className="text-xl font-black">{basic9Count}</div>
              <div className="text-[11px] text-emerald-100/85">Basic 9 Candidates</div>
            </div>
          </div>
        }
      />

      {/* 1. Headteacher's Welcome Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="glass-card p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900">
            <img
              src={anglicanCrestImg}
              alt="Kpando Anglican Basic School Crest"
              className="w-24 h-24 rounded-2xl object-contain bg-white p-1.5 border border-slate-200 dark:border-zinc-700 shadow-sm"
            />
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Office of the Headteacher
              </span>
              <h2 className="text-lg font-black mt-0.5">{headmasterDisplay}</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                {schoolProfile.district} • {schoolProfile.region}
              </p>
            </div>
            <div className="text-[11px] italic text-slate-600 dark:text-zinc-300 border-t border-emerald-200/70 dark:border-emerald-900 pt-3 w-full">
              “{schoolProfile.motto}”
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Welcome Message
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Partnering With Parents to Raise Disciplined, Future-Ready Scholars
            </h3>
            <div className="space-y-3 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              <p>
                On behalf of the Anglican Education Unit, dedicated teaching staff, PTA Executives, and learners of{' '}
                <strong>{schoolProfile.schoolName}</strong>, I warmly welcome families to our digital campus portal.
              </p>
              <p>
                Every child who walks through our gates deserves structured teaching, moral grounding, practical curiosity in
                science and agriculture, and honest feedback on their progress. That is why we pair dedicated classroom
                instruction with our WebSBA Mock Examination analytics and direct Parent SMS communication.
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 italic">
                Note: This welcome statement can be customized with the Headteacher’s personal message and school founding year when real school copy is finalized.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('admissions')}
                className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
              >
                Explore Admissions
              </button>
              <button
                type="button"
                onClick={() => onNavigate('academics')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold"
              >
                View Curriculum &amp; BECE Tracks
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Vision, Mission & Anglican Core Values */}
      <section className="bg-slate-100 dark:bg-zinc-900/40 border-y border-slate-200 dark:border-zinc-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 sm:p-8 border-t-4 border-t-emerald-700 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-black text-sm uppercase tracking-wider">
                <Compass className="w-5 h-5" /> Our Vision Statement
              </div>
              <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                {SCHOOL_VISION_MISSION.vision}
              </p>
            </div>

            <div className="glass-card p-6 sm:p-8 border-t-4 border-t-amber-500 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-black text-sm uppercase tracking-wider">
                <Target className="w-5 h-5" /> Our Mission Statement
              </div>
              <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                {SCHOOL_VISION_MISSION.mission}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black">Core Anglican &amp; Academic Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {SCHOOL_CORE_VALUES.map((val) => {
                const IconComp = VALUE_ICON_MAP[val.key] || CheckCircle2;
                return (
                  <div key={val.key} className="glass-card p-5 space-y-2">
                    <IconComp className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                    <h3 className="font-black text-sm">{val.title}</h3>
                    <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">{val.subtitle}</div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{val.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Heritage Milestones Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            School Heritage &amp; Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            Milestones in Character &amp; Academic Growth
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCHOOL_HISTORY_MILESTONES.map((milestone, idx) => (
            <div key={milestone.title} className="glass-card p-5 space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {milestone.era}
                </span>
                <span className="text-xs font-black text-slate-300 dark:text-zinc-700">0{idx + 1}</span>
              </div>
              <h3 className="font-bold text-sm leading-snug">{milestone.title}</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{milestone.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Filterable Leadership & Teaching Staff Directory */}
      <section className="bg-slate-100 dark:bg-zinc-900/40 border-y border-slate-200 dark:border-zinc-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Leadership &amp; Faculty Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Administration &amp; Subject Facilitators
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Headteacher and Basic 9 Coordinator sync directly from School Settings; department cards below can be updated with real teacher names anytime.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {STAFF_FILTERS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setStaffFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    staffFilter === cat
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((member) => (
              <div key={member.id} className="glass-card p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {member.department}
                    </span>
                    {member.isLive && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Live Profile
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base">{member.name}</h3>
                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{member.role}</div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{member.bio}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                  {member.qualification}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Governance & Affiliations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 space-y-2">
            <Building2 className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="font-bold text-sm">Ghana Education Service</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Operates strictly under the {schoolProfile.district} and national NaCCA Basic Curriculum standards.
            </p>
          </div>
          <div className="glass-card p-5 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="font-bold text-sm">Anglican Education Unit</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Guided by Anglican Christian ethos of integrity, humility, worship, and community service.
            </p>
          </div>
          <div className="glass-card p-5 space-y-2">
            <BookOpen className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="font-bold text-sm">Active PTA Partnership</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Collaborative Parent-Teacher Association supporting learner welfare, Basic 9 remedial prep, and infrastructure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
