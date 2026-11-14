import React, { useState, useEffect } from 'react';
import {
  ArrowRight, Award, BookOpen, Calendar, Camera, CheckCircle2,
  ChevronLeft, ChevronRight, Clock, Compass, FileText,
  GraduationCap, MapPin, Pause, Play, Quote, ShieldCheck,
  Sparkles, Users
} from 'lucide-react';
import { formatLongOrdinalDate } from '../../utils/calculations';
import {
  AUDIENCE_SHORTCUTS,
  COMMUNITY_TESTIMONIALS,
  EXTERNAL_SBA_PORTAL_URL,
  HERO_SLIDES,
  STARTER_NEWS_BULLETINS
} from '../../constants/publicSiteData';

const GALLERY_PREVIEW_INDICES = [0, 1, 3, 9];

export default function PublicHomeTab({
  schoolProfile,
  totalStudents,
  basic9Count,
  onNavigate
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    const nextIdx = (currentSlide + 1) % HERO_SLIDES.length;
    const img = new Image();
    img.src = HERO_SLIDES[nextIdx].src;
  }, [currentSlide]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const headteacherText = schoolProfile.headmasterName?.trim()
    ? `Headteacher ${schoolProfile.headmasterName.trim()}`
    : 'our Headteacher & dedicated GES staff';

  const liveAnnouncements = schoolProfile.announcements || [];
  const hasLiveNotices = liveAnnouncements.length > 0;
  const previewNotices = hasLiveNotices
    ? liveAnnouncements.slice(0, 3)
    : STARTER_NEWS_BULLETINS.slice(0, 3);

  return (
    <div>
      {/* 1. Full-Width Tall Cinema Hero Banner */}
      <section className="relative bg-emerald-950 text-white">
        <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[680px] xl:h-[740px] max-h-[82vh] overflow-hidden bg-emerald-950">
          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={`ambient-${slide.src}`}
              src={slide.src}
              alt=""
              aria-hidden="true"
              loading={idx <= 1 ? 'eager' : 'lazy'}
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-75 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-65' : 'opacity-0 pointer-events-none'
              }`}
            />
          ))}

          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              loading={idx <= 1 ? 'eager' : 'lazy'}
              decoding="async"
              className={`absolute inset-0 w-full h-full object-contain object-top sm:object-center transition-opacity duration-700 ease-in-out drop-shadow-2xl ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
          ))}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-60 sm:h-64 bg-gradient-to-t from-emerald-950 via-emerald-950/75 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-5 pt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="space-y-2.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-amber-400/50 text-amber-300 text-[11px] font-bold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  {schoolProfile.academicYear} Academic Year • KG, Primary &amp; JHS
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-lg">
                  Shaping Confident Scholars &amp; BECE Distinction Leaders
                </h1>
                <p className="text-xs sm:text-sm text-emerald-50/95 max-w-2xl leading-relaxed drop-shadow">
                  Welcome to <strong>{schoolProfile.schoolName}</strong>. Rooted in Anglican values, we pair
                  disciplined GES instruction and hands-on STEM &amp; Agriculture with Basic 9 BECE Mock WebSBA analytics and instant parent SMS engagement.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate('admissions')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs sm:text-sm shadow-lg transition-all"
                  >
                    Apply for Admission <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('academics')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-sm transition-all"
                  >
                    <BookOpen className="w-4 h-4" /> Explore Academics &amp; BECE
                  </button>
                  <a
                    href={EXTERNAL_SBA_PORTAL_URL}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-sm transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" /> WebSBA Grading Portal
                  </a>
                </div>
              </div>

              {/* Compact Bottom-Right Caption + Playback Controls */}
              <div className="flex flex-col sm:flex-row lg:flex-col lg:items-end gap-2 shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
                  <span className="text-amber-300 font-extrabold">
                    {String(currentSlide + 1).padStart(2, '0')}/{HERO_SLIDES.length}
                  </span>
                  <span className="truncate max-w-[220px]">{HERO_SLIDES[currentSlide].alt}</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 w-fit">
                  <button
                    type="button"
                    onClick={goToPrevSlide}
                    aria-label="Previous slide"
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaused((p) => !p)}
                    aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5 text-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>
                  <div className="hidden sm:flex items-center gap-1 px-1">
                    {HERO_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.src}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Show slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentSlide ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/45 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={goToNextSlide}
                    aria-label="Next slide"
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Stats & Next PTA Bar */}
        <div className="border-t border-white/15 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-3 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15">
              <Users className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <div className="text-xl font-black leading-none">{totalStudents}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100/85 mt-0.5">
                  Enrolled JHS Learners
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15">
              <GraduationCap className="w-5 h-5 text-emerald-300 shrink-0" />
              <div>
                <div className="text-xl font-black leading-none">{basic9Count}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100/85 mt-0.5">
                  Basic 9 Mock Candidates
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('news')}
              className="text-left sm:col-span-2 lg:col-span-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition-colors"
            >
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 shrink-0" /> Next Scheduled PTA &amp; Calendar
                </div>
                {schoolProfile.ptaMeeting?.title ? (
                  <>
                    <div className="font-bold text-sm text-white truncate">{schoolProfile.ptaMeeting.title}</div>
                    <div className="text-[11px] text-emerald-100/85 flex flex-wrap gap-3 mt-0.5">
                      {schoolProfile.ptaMeeting?.date && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-300" /> {formatLongOrdinalDate(schoolProfile.ptaMeeting.date)}
                          {schoolProfile.ptaMeeting?.time ? ` • ${schoolProfile.ptaMeeting.time}` : ''}
                        </span>
                      )}
                      {schoolProfile.ptaMeeting?.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-300" /> {schoolProfile.ptaMeeting.venue}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="font-semibold text-xs text-emerald-100/85 mt-0.5">
                    View Term 1–3 Calendar, Reopening Dates &amp; Official Parent Circulars →
                  </div>
                )}
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/30 border border-emerald-300/30 text-emerald-100 font-semibold shrink-0 w-fit">
                SMS Alerts Active
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. "I Am Looking For..." Audience Quick Navigation Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-1 pt-12 pb-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Quick Portal Navigation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Everything Parents, Learners &amp; Visitors Need
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Select a pathway to open its dedicated page
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AUDIENCE_SHORTCUTS.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => onNavigate(card.targetTab)}
              className="text-left glass-card p-5 hover:border-emerald-500 dark:hover:border-emerald-600 hover:-translate-y-0.5 flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {card.audience}
                </span>
                <h3 className="font-black text-base group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                {card.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. About & Academics Summary Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              About Our School
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              A Modern Learning Community Built on Accountability &amp; Results
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">
              Guided by <strong>{headteacherText}</strong>, {schoolProfile.schoolName} serves families across{' '}
              {schoolProfile.region} with disciplined Basic education from Kindergarten to Basic 9 under the Ghana Education Service (GES) curriculum.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              {[
                '100% BECE Mock Examination Diagnostics',
                'Instant Parent SMS Reminders & Result Alerts',
                'Weekly STEM Labs & Practical School Farm',
                'Transparent Printable A4 Report Cards'
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold">{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors"
              >
                Read School Story &amp; Meet Staff <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors"
              >
                Visit &amp; Campus Directions
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-card p-6 space-y-2 border-t-4 border-t-emerald-600">
              <BookOpen className="w-7 h-7 text-emerald-700 dark:text-emerald-400" />
              <h3 className="font-bold text-base">4 Core BECE Subjects</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                English Language, Mathematics, Integrated Science, and Social Studies — tracked across every mock examination series.
              </p>
            </div>
            <div className="glass-card p-6 space-y-2 border-t-4 border-t-amber-500">
              <Award className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              <h3 className="font-bold text-base">5 Elective &amp; Practical Tracks</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Career Technology, Computing, R.M.E, Ghanaian Language, and Creative Arts &amp; Design — computing the Best 2 Electives for BECE Aggregate.
              </p>
            </div>
            <div className="glass-card p-6 space-y-3 border-t-4 border-t-blue-600 sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-base">Interactive BECE Aggregate Simulator &amp; Curriculum Hub</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  Digital School System
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Explore KG, Upper Primary, and JHS tracks, test mock scores using the official 9-point BECE Aggregate calculator, and review our CSSPS transition plan.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('academics')}
                className="text-xs font-extrabold text-blue-700 dark:text-blue-400 inline-flex items-center gap-1 hover:underline"
              >
                Open Academics &amp; BECE Simulator <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Campus Life Photo Mosaic */}
      <section className="bg-slate-100 dark:bg-zinc-900/40 border-y border-slate-200 dark:border-zinc-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Campus Life in Action
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                STEM Labs, School Agriculture &amp; Student Leadership
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('campus-life')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors"
            >
              Open Full 11-Photo Gallery &amp; Clubs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GALLERY_PREVIEW_INDICES.map((slideIndex) => {
              const slide = HERO_SLIDES[slideIndex];
              return (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => onNavigate('campus-life')}
                  className="text-left glass-card overflow-hidden group hover:border-emerald-500 transition-all"
                >
                  <div className="aspect-[16/10] bg-emerald-950 overflow-hidden">
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3.5 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {slide.category}
                    </span>
                    <div className="font-bold text-xs leading-snug line-clamp-1">{slide.alt}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Latest Notices Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              {hasLiveNotices ? 'Live School Noticeboard' : 'School Noticeboard & Starter Bulletins'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Latest Announcements &amp; Upcoming Calendar
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('news')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-700 text-emerald-800 dark:text-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-xs font-bold transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> View Term Calendar &amp; Downloads <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {previewNotices.map((item) => (
            <article key={item.id} className="glass-card p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {item.category}
                  </span>
                  <span className="text-slate-400 font-medium">{item.date}</span>
                </div>
                <h3 className="font-bold text-base leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{item.summary}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('news')}
                className="pt-3 border-t border-slate-100 dark:border-zinc-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between hover:underline"
              >
                <span>{schoolProfile.schoolName} Noticeboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Community Voices & Enrollment CTA */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                Parent &amp; Community Voices
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Trusted by Families Across Kpando Municipality
              </h2>
            </div>
            <span className="text-[11px] text-emerald-200/80">
              Sample community quotes — replaceable in public site settings
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {COMMUNITY_TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <Quote className="w-5 h-5 text-amber-300 opacity-85" />
                  <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed">“{t.quote}”</p>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <div className="text-xs font-bold text-white">{t.author}</div>
                  <div className="text-[11px] text-emerald-200/80">{t.role}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white/10 border border-white/20 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-1 max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-black">
                Ready to Enroll Your Ward for {schoolProfile.academicYear}?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/85">
                Review our admission requirements, browse the Primary &amp; JHS starter prospectus, or send an inquiry straight to the Headteacher’s desk.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('admissions')}
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors"
              >
                Admissions &amp; Prospectus <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs sm:text-sm transition-colors"
              >
                Contact School Office
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
