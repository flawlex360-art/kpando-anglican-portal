import React, { useState, useEffect } from 'react';
import {
  GraduationCap, ShieldCheck, Calendar, MapPin, Phone, Mail,
  BookOpen, Award, Users, CheckCircle2, ArrowRight, Bell,
  Send, Sun, Moon, Menu, X, Sparkles, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const HERO_SLIDES = [
  { src: '/hero/slide-01.webp', alt: 'School Prefects & Student Leaders' },
  { src: '/hero/slide-02.webp', alt: 'Campus Learning & Activities' },
  { src: '/hero/slide-03.webp', alt: 'Student Community Life' },
  { src: '/hero/slide-04.webp', alt: 'Campus Grounds & Learners' },
  { src: '/hero/slide-05.webp', alt: 'School Assembly & Activities' },
  { src: '/hero/slide-06.webp', alt: 'Classroom & Study Session' },
  { src: '/hero/slide-07.webp', alt: 'Academic Excellence in Action' },
  { src: '/hero/slide-08.webp', alt: 'Co-curricular Engagement' },
  { src: '/hero/slide-09.webp', alt: 'Student Collaboration' },
  { src: '/hero/slide-10.webp', alt: 'Morning Campus Moments' },
  { src: '/hero/slide-11.webp', alt: 'Modern School Campus Vision' }
];

export default function PublicWebsite({
  schoolProfile,
  totalStudents,
  basic9Count,
  onOpenLogin,
  onSubmitInquiry,
  theme,
  onToggleTheme
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 2-second hero slideshow interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Progressively preload the upcoming slide so transitions stay smooth on weak networks
  useEffect(() => {
    const nextIdx = (currentSlide + 1) % HERO_SLIDES.length;
    const img = new Image();
    img.src = HERO_SLIDES[nextIdx].src;
  }, [currentSlide]);
  const [inquiryForm, setInquiryForm] = useState({
    parentName: '',
    phone: '',
    studentName: '',
    targetClass: 'Basic 7',
    message: ''
  });
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryForm.parentName.trim() || !inquiryForm.phone.trim() || !inquiryForm.studentName.trim()) {
      toast.error('Please enter parent name, phone number, and learner name.');
      return;
    }
    onSubmitInquiry({
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      parentName: inquiryForm.parentName.trim(),
      phone: inquiryForm.phone.trim(),
      studentName: inquiryForm.studentName.trim(),
      targetClass: inquiryForm.targetClass,
      message: inquiryForm.message.trim() || 'Requesting admission information.',
      status: 'New'
    });
    setInquiryForm({ parentName: '', phone: '', studentName: '', targetClass: 'Basic 7', message: '' });
    setSubmittedSuccess(true);
    toast.success('Admission inquiry submitted! Our administration will contact you via SMS/call.');
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Academics', href: '#academics' },
    { label: 'PTA & News', href: '#news' },
    { label: 'Admissions', href: '#admissions' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100">
      {/* Top PTA Alert Strip */}
      <div className="bg-emerald-950 text-emerald-50 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
            <span>
              <strong>Upcoming PTA:</strong> {schoolProfile.ptaMeeting?.title} —{' '}
              <span className="text-amber-300 font-semibold">
                {schoolProfile.ptaMeeting?.date} at {schoolProfile.ptaMeeting?.time}
              </span>{' '}
              ({schoolProfile.ptaMeeting?.venue})
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200">
            <span className="hidden sm:inline">{schoolProfile.phone}</span>
            <button
              onClick={onOpenLogin}
              className="underline hover:text-white font-semibold"
            >
              Staff & Admin Login →
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#home" className="flex items-center gap-3 min-w-0">
            <img
              src="/anglican-crest.png"
              alt="Kpando Anglican Basic School Crest"
              className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-200 dark:border-zinc-700 shadow-sm shrink-0"
            />
            <div className="truncate">
              <div className="font-extrabold text-base sm:text-lg tracking-tight text-emerald-950 dark:text-white truncate">
                {schoolProfile.schoolName}
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 truncate">
                {schoolProfile.motto}
              </div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-zinc-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleTheme}
              title="Toggle theme"
              className="p-2 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/15 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Login</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-zinc-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:text-emerald-700"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section with 2-Second Optimized Photo Slideshow */}
      <section id="home" className="relative overflow-hidden bg-emerald-950 text-white min-h-[540px] flex items-center">
        {/* Background Slideshow Layers */}
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              loading={idx <= 1 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={idx === 0 ? 'high' : 'auto'}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
              }`}
            />
          ))}
          {/* Balanced Contrast Scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/55" />
        </div>

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-14 lg:py-20 relative z-10 grid lg:grid-cols-12 gap-8 items-center">
          {/* Wrapped Left Hero Content Card for Guaranteed Visibility */}
          <div className="lg:col-span-7">
            <div className="bg-emerald-950/75 backdrop-blur-md border border-white/25 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-white/20 text-xs font-bold uppercase tracking-wider text-amber-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {schoolProfile.district} • {schoolProfile.academicYear}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow">
                Shaping Confident Scholars &amp; BECE Distinction Leaders
              </h1>
              <p className="text-emerald-50/95 text-base sm:text-lg max-w-2xl leading-relaxed drop-shadow-sm">
                Welcome to <strong>{schoolProfile.schoolName}</strong>. We combine disciplined classroom instruction,
                continuous Basic 9 BECE Mock Examination diagnostics, and instant parent SMS engagement to help every learner thrive.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="#admissions"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm shadow-lg transition-all"
                >
                  Apply for Admission <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={onOpenLogin}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm backdrop-blur-sm transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Administrator &amp; WebSBA Portal
                </button>
              </div>
            </div>
          </div>

          {/* Wrapped Right Stat & PTA Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-emerald-950/75 backdrop-blur-md border border-white/25 rounded-2xl p-5 space-y-1 shadow-2xl">
              <Users className="w-6 h-6 text-amber-300 mb-2" />
              <div className="text-3xl font-black drop-shadow">{totalStudents}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Enrolled JHS Learners</div>
            </div>
            <div className="bg-emerald-950/75 backdrop-blur-md border border-white/25 rounded-2xl p-5 space-y-1 shadow-2xl">
              <GraduationCap className="w-6 h-6 text-emerald-300 mb-2" />
              <div className="text-3xl font-black drop-shadow">{basic9Count}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Basic 9 Mock Candidates</div>
            </div>
            <div className="col-span-2 bg-emerald-950/75 backdrop-blur-md border border-white/25 rounded-2xl p-5 space-y-2 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Next Scheduled PTA
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-300/30 text-emerald-100 font-semibold">
                  SMS Alerts Active
                </span>
              </div>
              <div className="font-bold text-base text-white drop-shadow-sm">{schoolProfile.ptaMeeting?.title}</div>
              <div className="text-xs text-emerald-100 flex flex-wrap gap-4">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-300" /> {schoolProfile.ptaMeeting?.date} • {schoolProfile.ptaMeeting?.time}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-300" /> {schoolProfile.ptaMeeting?.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slideshow Progress Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Show slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              About Our School
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              A Modern Learning Community Built on Accountability &amp; Results
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">
              Led by Headmaster <strong>{schoolProfile.headmasterName}</strong>, {schoolProfile.schoolName} serves families across{' '}
              {schoolProfile.region} with rigorous Basic 7–9 Junior High School education aligned to the Ghana Education Service (GES) curriculum.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {[
                '100% BECE Mock Examination Diagnostics',
                'Instant Parent SMS Reminders & Result Alerts',
                'Weekly STEM & English Remedial Clinics',
                'Transparent Printable A4 Report Cards'
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academics Cards */}
          <div id="academics" className="grid sm:grid-cols-2 gap-4">
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
            <div className="glass-card p-6 space-y-2 border-t-4 border-t-blue-600 sm:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">Basic 9 Mock WebSBA &amp; Parent SMS</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  Digital School System
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Every Basic 9 mock script is graded out of 100%, ranked from 1st to last with automatic 6-subject BECE Aggregate computation,
                and summarized on crisp A4 terminal report cards while keeping parents informed via direct SMS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PTA & News Board */}
      <section id="news" className="bg-slate-100 dark:bg-zinc-900/40 border-y border-slate-200 dark:border-zinc-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Notices &amp; Upcoming Events
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                PTA Meetings &amp; School Announcements
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Updated live from School Administration
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {(schoolProfile.announcements || []).map((item) => (
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
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  {schoolProfile.schoolName} Noticeboard
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions Form & Contact */}
      <section id="admissions" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 glass-card p-6 sm:p-8 space-y-5">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Admissions Inquiry
              </span>
              <h2 className="text-2xl font-black mt-1">Enroll Your Ward for {schoolProfile.academicYear}</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Submit an inquiry below. Our school administrators review all submissions directly inside the Admin Portal.
              </p>
            </div>

            {submittedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Thank you! Your inquiry has been logged for our Headmaster &amp; Admissions Office.
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Parent / Guardian Name *</label>
                <input
                  type="text"
                  required
                  value={inquiryForm.parentName}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, parentName: e.target.value })}
                  placeholder="e.g. Mrs. Comfort Mensah"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Parent Phone (for SMS) *</label>
                <input
                  type="tel"
                  required
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  placeholder="e.g. 024 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Learner Full Name *</label>
                <input
                  type="text"
                  required
                  value={inquiryForm.studentName}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, studentName: e.target.value })}
                  placeholder="e.g. Daniel Mensah"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Target JHS Class</label>
                <select
                  value={inquiryForm.targetClass}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, targetClass: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  <option value="Basic 7">Basic 7 (JHS 1)</option>
                  <option value="Basic 8">Basic 8 (JHS 2)</option>
                  <option value="Basic 9">Basic 9 (JHS 3 / BECE)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1">Additional Notes</label>
                <textarea
                  rows={3}
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  placeholder="Previous school or specific questions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition-colors"
                >
                  <Send className="w-4 h-4" /> Submit Admission Inquiry
                </button>
              </div>
            </form>
          </div>

          <div id="contact" className="lg:col-span-5 space-y-4">
            <div className="glass-card p-6 sm:p-8 space-y-5 bg-gradient-to-br from-emerald-950 to-teal-950 text-white border-none">
              <h3 className="text-xl font-black">School Administration &amp; Contact</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Visit our campus office Monday through Friday (7:30 AM – 3:30 PM) or reach out via phone/email.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-1" />
                  <div>
                    <div className="font-bold">Campus Location</div>
                    <div className="text-xs text-emerald-100/80">{schoolProfile.address} • {schoolProfile.district}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-300 shrink-0 mt-1" />
                  <div>
                    <div className="font-bold">Telephone</div>
                    <div className="text-xs text-emerald-100/80">{schoolProfile.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-300 shrink-0 mt-1" />
                  <div>
                    <div className="font-bold">Official Email</div>
                    <div className="text-xs text-emerald-100/80">{schoolProfile.email}</div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/15">
                <button
                  onClick={onOpenLogin}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" /> Enter Administrator &amp; Mock SBA Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400">
          <div>
            © {new Date().getFullYear()} <strong>{schoolProfile.schoolName}</strong>. All rights reserved.
          </div>
          <div>
            Powered by <strong>WebSBA Mock Analytics &amp; Parent SMS Engine</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
