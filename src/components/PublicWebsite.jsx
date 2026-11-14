import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell, Clock, Mail, MapPin, Menu, Moon, Phone, ShieldCheck, Sun, X
} from 'lucide-react';
import { formatLongOrdinalDate } from '../utils/calculations';
import anglicanCrestImg from '../assets/anglican-crest.png';
import { WEBSITE_TABS } from '../constants/publicSiteData';
import { ResourceReaderModal } from './public/PublicSharedUI';
import PublicHomeTab from './public/PublicHomeTab';
import PublicAboutTab from './public/PublicAboutTab';
import PublicAcademicsTab from './public/PublicAcademicsTab';
import PublicAdmissionsTab from './public/PublicAdmissionsTab';
import PublicCampusLifeTab from './public/PublicCampusLifeTab';
import PublicNewsCalendarTab from './public/PublicNewsCalendarTab';
import PublicContactTab from './public/PublicContactTab';

const VALID_TAB_IDS = new Set(WEBSITE_TABS.map((t) => t.id));
const HASH_ALIASES = {
  gallery: 'campus-life',
  clubs: 'campus-life',
  pta: 'news',
  calendar: 'news',
  bece: 'academics',
  staff: 'about'
};

function resolveTabFromHash() {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace(/^#/, '').trim().toLowerCase();
  if (VALID_TAB_IDS.has(raw)) return raw;
  if (HASH_ALIASES[raw]) return HASH_ALIASES[raw];
  return 'home';
}

export default function PublicWebsite({
  schoolProfile,
  totalStudents,
  basic9Count,
  onOpenLogin,
  onSubmitInquiry,
  theme,
  onToggleTheme
}) {
  const [activeTab, setActiveTab] = useState(resolveTabFromHash);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeResource, setActiveResource] = useState(null);

  useEffect(() => {
    const onHashChange = () => {
      setActiveTab(resolveTabFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateToTab = useCallback((tabId) => {
    const resolved = VALID_TAB_IDS.has(tabId) ? tabId : 'home';
    setActiveTab(resolved);
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      const targetHash = `#${resolved}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const hasPtaBanner = Boolean(schoolProfile.ptaMeeting?.title?.trim());
  const cleanPhone = (schoolProfile.phone || '').replace(/\s+/g, '');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100">
      {/* Top PTA / Live Status Alert Strip */}
      <div className="bg-emerald-950 text-emerald-50 text-xs py-2 px-4 border-b border-emerald-900/70">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigateToTab(hasPtaBanner ? 'news' : 'admissions')}
            className="flex items-center gap-2 font-medium text-left hover:text-white transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
            {hasPtaBanner ? (
              <span>
                <strong>Upcoming PTA:</strong> {schoolProfile.ptaMeeting.title} —{' '}
                <span className="text-amber-300 font-semibold">
                  {formatLongOrdinalDate(schoolProfile.ptaMeeting?.date)}
                  {schoolProfile.ptaMeeting?.time ? ` at ${schoolProfile.ptaMeeting.time}` : ''}
                </span>
                {schoolProfile.ptaMeeting?.venue ? ` (${schoolProfile.ptaMeeting.venue})` : ''}
              </span>
            ) : (
              <span>
                <strong>{schoolProfile.academicYear} Intake Open:</strong>{' '}
                <span className="text-amber-300 font-semibold">KG, Primary &amp; Basic 7–9 Admissions</span>
                {schoolProfile.reopeningDate
                  ? ` • Reopening: ${formatLongOrdinalDate(schoolProfile.reopeningDate)}`
                  : ' • BECE Mock WebSBA & Parent SMS Active'}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 text-emerald-200">
            <button
              type="button"
              onClick={() => navigateToTab('admissions')}
              className="hidden md:inline hover:text-white transition-colors"
            >
              Admissions
            </button>
            <span className="hidden md:inline text-emerald-700">|</span>
            <button
              type="button"
              onClick={() => navigateToTab('academics')}
              className="hidden md:inline hover:text-white transition-colors"
            >
              BECE Hub
            </button>
            {schoolProfile.phone && (
              <>
                <span className="hidden sm:inline text-emerald-700">|</span>
                <a
                  href={`tel:${cleanPhone}`}
                  className="hidden sm:inline hover:text-white transition-colors font-mono"
                >
                  {schoolProfile.phone}
                </a>
              </>
            )}
            <span className="hidden sm:inline text-emerald-700">|</span>
            <button
              type="button"
              onClick={onOpenLogin}
              className="underline hover:text-white font-semibold"
            >
              Staff &amp; Admin Login →
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigateToTab('home')}
            className="flex items-center gap-3 min-w-0 text-left"
          >
            <img
              src={anglicanCrestImg}
              alt="Kpando Anglican Basic School Crest"
              className="w-12 h-12 rounded-xl object-contain bg-white p-0.5 border border-slate-200 dark:border-zinc-700 shadow-sm shrink-0"
            />
            <div className="truncate">
              <div className="font-extrabold text-sm sm:text-base tracking-tight text-emerald-950 dark:text-white truncate">
                {schoolProfile.schoolName}
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 truncate">
                {schoolProfile.motto}
              </div>
            </div>
          </button>

          {/* Desktop 7-Tab Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary School Navigation">
            {WEBSITE_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigateToTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-emerald-800 dark:hover:text-emerald-400'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleTheme}
              title="Toggle theme"
              aria-label="Toggle dark or light theme"
              className="p-2 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md shadow-emerald-900/15 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Login</span>
              <span className="sm:hidden">Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-zinc-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 space-y-1.5">
            {WEBSITE_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigateToTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-white'
                      : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Active Tab Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <PublicHomeTab
            schoolProfile={schoolProfile}
            totalStudents={totalStudents}
            basic9Count={basic9Count}
            onOpenLogin={onOpenLogin}
            onNavigate={navigateToTab}
          />
        )}
        {activeTab === 'about' && (
          <PublicAboutTab
            schoolProfile={schoolProfile}
            totalStudents={totalStudents}
            basic9Count={basic9Count}
            onNavigate={navigateToTab}
          />
        )}
        {activeTab === 'academics' && (
          <PublicAcademicsTab
            schoolProfile={schoolProfile}
            onNavigate={navigateToTab}
            onOpenLogin={onOpenLogin}
          />
        )}
        {activeTab === 'admissions' && (
          <PublicAdmissionsTab
            schoolProfile={schoolProfile}
            onNavigate={navigateToTab}
            onSubmitInquiry={onSubmitInquiry}
            onOpenResource={setActiveResource}
          />
        )}
        {activeTab === 'campus-life' && (
          <PublicCampusLifeTab
            schoolProfile={schoolProfile}
            onNavigate={navigateToTab}
          />
        )}
        {activeTab === 'news' && (
          <PublicNewsCalendarTab
            schoolProfile={schoolProfile}
            onNavigate={navigateToTab}
            onOpenResource={setActiveResource}
          />
        )}
        {activeTab === 'contact' && (
          <PublicContactTab
            schoolProfile={schoolProfile}
            onNavigate={navigateToTab}
            onSubmitInquiry={onSubmitInquiry}
            onOpenLogin={onOpenLogin}
          />
        )}
      </main>

      {/* Printable Document Reader Modal */}
      <ResourceReaderModal
        resource={activeResource}
        schoolProfile={schoolProfile}
        onClose={() => setActiveResource(null)}
      />

      {/* Rich 4-Column Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pt-12 pb-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={anglicanCrestImg}
                  alt="Kpando Anglican Basic School Crest"
                  className="w-11 h-11 rounded-xl object-contain bg-white p-0.5 border border-slate-200 dark:border-zinc-700 shrink-0"
                />
                <div>
                  <div className="font-black text-sm text-emerald-950 dark:text-white">
                    {schoolProfile.schoolName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                    {schoolProfile.district}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                {schoolProfile.motto}. Preparing Kindergarten, Primary, and Junior High learners across {schoolProfile.region} for BECE excellence and principled citizenship.
              </p>
            </div>

            <div className="lg:col-span-3 space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-400">
                Explore Website
              </h3>
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 text-xs">
                {WEBSITE_TABS.map((tab) => (
                  <li key={`footer-${tab.id}`}>
                    <button
                      type="button"
                      onClick={() => navigateToTab(tab.id)}
                      className="text-slate-600 dark:text-zinc-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors"
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-400">
                Parent Shortcuts
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToTab('academics')}
                    className="hover:text-emerald-800 dark:hover:text-emerald-300"
                  >
                    BECE Aggregate Tool
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToTab('admissions')}
                    className="hover:text-emerald-800 dark:hover:text-emerald-300"
                  >
                    Starter Prospectus
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToTab('news')}
                    className="hover:text-emerald-800 dark:hover:text-emerald-300"
                  >
                    Term 1–3 Calendar
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
                  >
                    Staff &amp; Admin Portal →
                  </button>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3 space-y-2.5 text-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-400">
                Office &amp; Visiting Hours
              </h3>
              <div className="space-y-2 text-slate-600 dark:text-zinc-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{schoolProfile.address} • {schoolProfile.region}</span>
                </div>
                {schoolProfile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <a href={`tel:${cleanPhone}`} className="font-mono hover:text-emerald-700">
                      {schoolProfile.phone}
                    </a>
                  </div>
                )}
                {schoolProfile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <a href={`mailto:${schoolProfile.email}`} className="hover:text-emerald-700 truncate">
                      {schoolProfile.email}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Mon – Fri: 7:30 AM – 3:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400">
            <span>
              © {new Date().getFullYear()} <strong>{schoolProfile.schoolName}</strong>. All rights reserved.
            </span>
            <span>
              Powered by <strong>WebSBA Mock Analytics &amp; Parent SMS Engine</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
