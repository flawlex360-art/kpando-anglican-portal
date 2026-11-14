import React, { useState } from 'react';
import {
  CheckCircle2, ChevronDown, ClipboardList, FileText,
  GraduationCap, HelpCircle, Phone, Sparkles
} from 'lucide-react';
import {
  ADMISSION_FAQS,
  ADMISSION_REQUIREMENTS,
  ADMISSION_STEPS,
  DOWNLOADABLE_RESOURCES,
  PROSPECTUS_DATA
} from '../../constants/publicSiteData';
import { PublicPageHero, WebsiteInquiryForm } from './PublicSharedUI';

export default function PublicAdmissionsTab({
  schoolProfile,
  onNavigate,
  onSubmitInquiry,
  onOpenResource
}) {
  const [prospectusLevel, setProspectusLevel] = useState('jhs');
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const activeProspectus = PROSPECTUS_DATA[prospectusLevel] || PROSPECTUS_DATA.jhs;
  const admissionsResources = DOWNLOADABLE_RESOURCES.filter(
    (r) => r.category === 'Admissions' || r.category === 'Academics'
  );

  return (
    <div>
      <PublicPageHero
        breadcrumb="Admissions"
        badge={`Open for ${schoolProfile.academicYear}`}
        title={`Join ${schoolProfile.schoolName}`}
        description="Discover our transparent 5-step admission pathway across Kindergarten, Primary, and Junior High School (Basic 7–9), review the starter prospectus, and submit your ward’s online inquiry."
        onNavigate={onNavigate}
        rightContent={
          <a
            href={`tel:${(schoolProfile.phone || '').replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs transition-colors"
          >
            <Phone className="w-4 h-4" /> Admissions Desk: {schoolProfile.phone || 'School Office'}
          </a>
        }
      />

      {/* 1. 5-Step Admission Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Step-by-Step Enrollment
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            5-Step Admission Process
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ADMISSION_STEPS.map((item) => (
            <div key={item.step} className="glass-card p-5 space-y-2.5 border-t-4 border-t-emerald-700">
              <span className="inline-block text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {item.step}
              </span>
              <h3 className="font-bold text-sm leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Requirements & Interactive Prospectus Switcher */}
      <section className="bg-slate-100 dark:bg-zinc-900/40 border-y border-slate-200 dark:border-zinc-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 items-start">
          {/* Required Documents */}
          <div className="lg:col-span-5 glass-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <h2 className="text-lg font-black">Required Admission Documents</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Bring copies of the following items to the Headteacher &amp; Admissions Office once your placement check is scheduled:
            </p>
            <ul className="space-y-2.5">
              {ADMISSION_REQUIREMENTS.map((req) => (
                <li
                  key={req}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-xs font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Tabbed Prospectus */}
          <div className="lg:col-span-7 glass-card p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-black flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  Starter School Prospectus
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{activeProspectus.subtitle}</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setProspectusLevel('primary')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    prospectusLevel === 'primary'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300'
                  }`}
                >
                  KG &amp; Primary
                </button>
                <button
                  type="button"
                  onClick={() => setProspectusLevel('jhs')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    prospectusLevel === 'jhs'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300'
                  }`}
                >
                  JHS (Basic 7–9)
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              {activeProspectus.items.map((item) => (
                <div
                  key={item.category}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1.5"
                >
                  <div className="text-xs font-black text-emerald-800 dark:text-emerald-400">{item.category}</div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>

            {/* Printable Documents Strip */}
            <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                Need a printable sheet?
              </span>
              <div className="flex flex-wrap gap-2">
                {admissionsResources.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => onOpenResource(res)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> {res.title.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Online Inquiry Form + FAQ Accordion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <WebsiteInquiryForm
            mode="admissions"
            schoolProfile={schoolProfile}
            onSubmitInquiry={onSubmitInquiry}
          />
        </div>

        <div className="lg:col-span-5 glass-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h2 className="text-lg font-black">Frequently Asked Admissions Questions</h2>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-zinc-800">
            {ADMISSION_FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={faq.question} className="py-3 first:pt-1 last:pb-1">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                    className="w-full text-left flex items-start justify-between gap-3 font-bold text-xs sm:text-sm py-1"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 mt-0.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-700 dark:text-emerald-400' : 'text-slate-400'
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed pt-2 pr-4">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
