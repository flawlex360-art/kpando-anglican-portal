import React, { useState, useMemo } from 'react';
import {
  Bell, Calendar, Clock, Download, FileText, MapPin, Search, Sparkles
} from 'lucide-react';
import { formatLongOrdinalDate } from '../../utils/calculations';
import {
  ACADEMIC_TERM_CALENDAR,
  DOWNLOADABLE_RESOURCES,
  STARTER_NEWS_BULLETINS
} from '../../constants/publicSiteData';
import { PublicPageHero } from './PublicSharedUI';

const NOTICE_CATEGORIES = ['All', 'PTA Notice', 'Academics', 'Admissions'];
const TERM_FILTERS = ['All Terms', 'Term 1', 'Term 2', 'Term 3'];

export default function PublicNewsCalendarTab({ schoolProfile, onNavigate, onOpenResource }) {
  const [noticeCategory, setNoticeCategory] = useState('All');
  const [noticeSearch, setNoticeSearch] = useState('');
  const [termFilter, setTermFilter] = useState('All Terms');

  const liveAnnouncements = useMemo(
    () => (schoolProfile.announcements || []).map((item) => ({ ...item, isLive: true })),
    [schoolProfile.announcements]
  );

  const displayedNotices = useMemo(() => {
    const source = liveAnnouncements.length > 0 ? liveAnnouncements : STARTER_NEWS_BULLETINS;
    const query = noticeSearch.trim().toLowerCase();
    return source.filter((item) => {
      const catMatch = noticeCategory === 'All' || item.category === noticeCategory;
      const textMatch =
        !query ||
        `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(query);
      return catMatch && textMatch;
    });
  }, [liveAnnouncements, noticeCategory, noticeSearch]);

  const filteredCalendar = useMemo(() => {
    if (termFilter === 'All Terms') return ACADEMIC_TERM_CALENDAR;
    return ACADEMIC_TERM_CALENDAR.filter((item) => item.term === termFilter);
  }, [termFilter]);

  return (
    <div>
      <PublicPageHero
        breadcrumb="News, PTA & Calendar"
        badge={`${schoolProfile.academicYear} Academic Calendar`}
        title="PTA Meetings, School Notices & Parent Circulars"
        description="Stay up to date with live notices published from Kpando Anglican Basic School Administration, upcoming PTA schedules, GES term milestones, and printable parent guides."
        onNavigate={onNavigate}
      />

      {/* 1. Live PTA & Term Key Dates Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="glass-card p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white border-none grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-[11px] font-bold uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5" /> Upcoming PTA Spotlight
            </span>
            {schoolProfile.ptaMeeting?.title ? (
              <>
                <h2 className="text-xl sm:text-2xl font-black">{schoolProfile.ptaMeeting.title}</h2>
                <div className="flex flex-wrap gap-4 text-xs text-emerald-100/90">
                  {schoolProfile.ptaMeeting?.date && (
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Calendar className="w-4 h-4 text-amber-300" />
                      {formatLongOrdinalDate(schoolProfile.ptaMeeting.date)}
                      {schoolProfile.ptaMeeting?.time ? ` at ${schoolProfile.ptaMeeting.time}` : ''}
                    </span>
                  )}
                  {schoolProfile.ptaMeeting?.venue && (
                    <span className="flex items-center gap-1.5 font-semibold">
                      <MapPin className="w-4 h-4 text-amber-300" /> {schoolProfile.ptaMeeting.venue}
                    </span>
                  )}
                </div>
                {schoolProfile.ptaMeeting?.agenda && (
                  <p className="text-xs text-emerald-100/85 leading-relaxed bg-white/10 p-3 rounded-xl border border-white/10">
                    <strong className="text-amber-300">Agenda:</strong> {schoolProfile.ptaMeeting.agenda}
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-black">PTA Schedule &amp; Live SMS Notification Hub</h2>
                <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                  No new PTA general meeting date is currently posted. Whenever Administration sets the next PTA schedule in School Settings, it updates here automatically and sends SMS reminders via <strong>KpandoAngli</strong>.
                </p>
              </>
            )}
          </div>

          <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="p-4 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-amber-300 font-bold uppercase">Next Term Reopening</div>
                <div className="text-sm font-black mt-0.5">
                  {schoolProfile.reopeningDate
                    ? formatLongOrdinalDate(schoolProfile.reopeningDate)
                    : 'Confirm via School Office'}
                </div>
              </div>
              <Calendar className="w-5 h-5 text-emerald-300 shrink-0" />
            </div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-amber-300 font-bold uppercase">Mock Exam Date &amp; Term Days</div>
                <div className="text-sm font-black mt-0.5">
                  {schoolProfile.examDate
                    ? `${formatLongOrdinalDate(schoolProfile.examDate)} • ${schoolProfile.timesOpen || 65} Days`
                    : `${schoolProfile.timesOpen || 65} Attendance Days`}
                </div>
              </div>
              <Clock className="w-5 h-5 text-amber-300 shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Searchable School Notices & Announcements */}
      <section className="bg-slate-100 dark:bg-zinc-900/40 border-y border-slate-200 dark:border-zinc-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                {liveAnnouncements.length > 0 ? 'Live Administration Noticeboard' : 'Sample School Notices'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                School Announcements &amp; Bulletins
              </h2>
              {liveAnnouncements.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Showing starter sample bulletins. Notices posted in Admin &gt; School Settings replace these automatically.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={noticeSearch}
                  onChange={(e) => setNoticeSearch(e.target.value)}
                  placeholder="Search notices..."
                  aria-label="Search school notices"
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {NOTICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNoticeCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      noticeCategory === cat
                        ? 'bg-emerald-800 text-white'
                        : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {displayedNotices.length === 0 ? (
            <div className="glass-card p-8 text-center text-xs text-slate-500 dark:text-zinc-400">
              No announcements match your current filter or search term.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {displayedNotices.map((item) => (
                <article key={item.id} className="glass-card p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {item.category}
                      </span>
                      <span className="text-slate-400 font-medium">{item.date}</span>
                    </div>
                    <h3 className="font-bold text-base leading-snug">{item.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{item.summary}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                    <span>{schoolProfile.schoolName} Noticeboard</span>
                    {item.isLive && (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <Sparkles className="w-3 h-3" /> Live
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Academic Calendar & Printable Parent Downloads */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-12 gap-8 items-start">
        {/* 3-Term Calendar */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                GES 3-Term Framework
              </span>
              <h2 className="text-2xl font-black tracking-tight mt-1">Academic Term Calendar</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TERM_FILTERS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setTermFilter(term)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    termFilter === term
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card divide-y divide-slate-100 dark:divide-zinc-800 overflow-hidden">
            {filteredCalendar.map((ev) => (
              <div key={ev.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold">
                      {ev.term}
                    </span>
                    <span className="font-bold text-slate-500 dark:text-zinc-400">{ev.dateLabel}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-semibold">
                      {ev.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm">{ev.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{ev.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Printable Parent Resources */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Parent Downloads &amp; Circulars
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-1">Printable Guides</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Click any resource to view the full guide and print or save as A4 PDF.
            </p>
          </div>

          <div className="space-y-3">
            {DOWNLOADABLE_RESOURCES.map((res) => (
              <button
                key={res.id}
                type="button"
                onClick={() => onOpenResource(res)}
                className="w-full text-left glass-card p-4 hover:border-emerald-500 flex items-start justify-between gap-3 group transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400 uppercase">
                      {res.category}
                    </span>
                    <span className="text-slate-400">• {res.updated}</span>
                  </div>
                  <div className="font-bold text-sm group-hover:text-emerald-800 dark:group-hover:text-emerald-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>{res.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{res.summary}</p>
                </div>
                <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                  <Download className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
