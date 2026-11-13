import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Users, FileSpreadsheet, Award, FileText,
  MessageSquare, Settings, LogOut, Globe, Sun, Moon, ShieldCheck, Wallet
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import {
  JHS_CLASSES,
  MOCK_SERIES,
  JHS_SUBJECTS,
  INITIAL_SCHOOL_PROFILE,
  INITIAL_STUDENTS,
  INITIAL_MOCK_SCORES,
  INITIAL_SMS_LOGS,
  INITIAL_INQUIRIES,
  INITIAL_BASIC9_FINANCE
} from './constants/schoolConstants';
import { computeMockClassResults } from './utils/calculations';

import PublicWebsite from './components/PublicWebsite';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import Roster from './components/Roster';
import MockGradebook from './components/MockGradebook';
import MockAnalysisBroadsheet, { PrintableA4Broadsheet } from './components/MockAnalysisBroadsheet';
import ReportCardManager from './components/ReportCardManager';
import MockReportCard from './components/MockReportCard';
import Basic9Expenditure, { PrintableBasic9Expenditure } from './components/Basic9Expenditure';
import { PrintableAmountPaidReceipt, PrintableGeneralReceipts } from './components/Basic9Receipts';
import SmsCenter from './components/SmsCenter';
import SchoolSettings from './components/SchoolSettings';
import { isFirebaseConfigured, loadPortalFromFirestore, savePortalToFirestore } from './utils/firebase';

const STORAGE_KEY = 'kpando_anglican_basic_school_live_v1';
const LEGACY_DEMO_STORAGE_KEY = 'kpando_anglican_basic_school_v1';
const AUTHORIZED_EMAILS = ['head@anglican.com', 'b9teacher@anglican.com'];

function normalizeSchoolProfile(profile) {
  if (!profile) return profile;
  if (profile.schoolName === 'Madifor Model Basic & JHS') {
    return INITIAL_SCHOOL_PROFILE;
  }
  if (profile.phone === '024 812 4590 / 050 331 9802') {
    return { ...profile, phone: INITIAL_SCHOOL_PROFILE.phone };
  }
  return profile;
}

function loadInitialState() {
  try {
    localStorage.removeItem(LEGACY_DEMO_STORAGE_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.schoolProfile) {
        parsed.schoolProfile = normalizeSchoolProfile(parsed.schoolProfile);
      }
      if (parsed?.gatewayConfig?.senderId === 'MADIFOR') {
        parsed.gatewayConfig.senderId = 'KPANDO ANG';
      }
      if (
        parsed?.currentUser &&
        !AUTHORIZED_EMAILS.includes(String(parsed.currentUser.email || '').toLowerCase())
      ) {
        parsed.currentUser = null;
      }
      return parsed;
    }
  } catch (e) {
    // Fallback to defaults
  }
  return null;
}

const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'roster', label: 'Students & Parents', icon: Users },
  { id: 'gradebook', label: 'Mock Marks (100%)', icon: FileSpreadsheet },
  { id: 'broadsheet', label: 'Analysis & A4 Sheet', icon: Award },
  { id: 'reports', label: 'Report Cards', icon: FileText },
  { id: 'expenditure', label: 'Basic 9 Expenditure', icon: Wallet },
  { id: 'sms', label: 'Parent SMS Center', icon: MessageSquare },
  { id: 'settings', label: 'School Settings', icon: Settings }
];

export default function App() {
  const saved = useMemo(() => loadInitialState(), []);

  const [theme, setTheme] = useState(() => saved?.theme || 'light');
  const [viewMode, setViewMode] = useState('website'); // 'website' | 'login' | 'admin'
  const [currentUser, setCurrentUser] = useState(() => saved?.currentUser || null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeClass, setActiveClass] = useState('Basic 9');
  const [activeMock, setActiveMock] = useState('Mock 1');
  const [sortMode, setSortMode] = useState('aggregate'); // 'aggregate' | 'total'

  const [schoolProfile, setSchoolProfile] = useState(() => saved?.schoolProfile || INITIAL_SCHOOL_PROFILE);
  const [studentsByClass, setStudentsByClass] = useState(() => saved?.studentsByClass || INITIAL_STUDENTS);
  const [mockScores, setMockScores] = useState(() => saved?.mockScores || INITIAL_MOCK_SCORES);
  const [smsLogs, setSmsLogs] = useState(() => saved?.smsLogs || INITIAL_SMS_LOGS);
  const [inquiries, setInquiries] = useState(() => saved?.inquiries || INITIAL_INQUIRIES);
  const [basic9Finance, setBasic9Finance] = useState(
    () => saved?.basic9Finance || INITIAL_BASIC9_FINANCE
  );
  const [gatewayConfig, setGatewayConfig] = useState(
    () => saved?.gatewayConfig || { provider: 'simulation', senderId: 'KPANDO ANG', apiKey: '' }
  );

  // Print states: null | { type: 'broadsheet' } | { type: 'single-card', student } | { type: 'all-cards' }
  const [printJob, setPrintJob] = useState(null);

  // Sync theme to document root
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Optional Firebase Firestore cloud load on mount when configured
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    loadPortalFromFirestore()
      .then((cloudData) => {
        if (!cloudData) return;
        if (cloudData.schoolProfile) setSchoolProfile(normalizeSchoolProfile(cloudData.schoolProfile));
        if (cloudData.studentsByClass) setStudentsByClass(cloudData.studentsByClass);
        if (cloudData.mockScores) setMockScores(cloudData.mockScores);
        if (cloudData.smsLogs) setSmsLogs(cloudData.smsLogs);
        if (cloudData.inquiries) setInquiries(cloudData.inquiries);
        if (cloudData.basic9Finance) setBasic9Finance(cloudData.basic9Finance);
      })
      .catch(() => {
        // Offline or unauthenticated read: keep local cache
      });
  }, []);

  // Persist portal data to localStorage (and Firestore when configured & signed in)
  useEffect(() => {
    const payload = {
      theme,
      currentUser,
      schoolProfile,
      studentsByClass,
      mockScores,
      smsLogs,
      inquiries,
      basic9Finance,
      gatewayConfig
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // Ignore quota errors
    }
    if (isFirebaseConfigured() && currentUser) {
      savePortalToFirestore({
        schoolProfile,
        studentsByClass,
        mockScores,
        smsLogs,
        inquiries,
        basic9Finance
      }).catch(() => {});
    }
  }, [theme, currentUser, schoolProfile, studentsByClass, mockScores, smsLogs, inquiries, basic9Finance, gatewayConfig]);

  // Auto-open admin portal if session already authenticated on reload? Keep public website first with instant switch, or restore if desired.
  useEffect(() => {
    if (currentUser && viewMode === 'login') {
      setViewMode('admin');
    }
  }, [currentUser, viewMode]);

  // Print trigger lifecycle
  useEffect(() => {
    if (!printJob) return;
    const handleAfterPrint = () => setPrintJob(null);
    window.addEventListener('afterprint', handleAfterPrint);
    const timer = setTimeout(() => {
      window.print();
    }, 180);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [printJob]);

  const currentStudents = studentsByClass[activeClass] || [];
  const currentClassMockGrades = mockScores?.[activeClass]?.[activeMock] || {};

  const rankedResults = useMemo(
    () => computeMockClassResults(currentStudents, currentClassMockGrades, JHS_SUBJECTS, sortMode),
    [currentStudents, currentClassMockGrades, sortMode]
  );

  const totalStudentsCount = useMemo(
    () => Object.values(studentsByClass).reduce((sum, list) => sum + (list?.length || 0), 0),
    [studentsByClass]
  );

  // Handlers
  const handleOpenLogin = () => {
    if (currentUser) setViewMode('admin');
    else setViewMode('login');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setViewMode('admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewMode('website');
    toast.success('Signed out cleanly.');
  };

  const handleSaveRoster = (reindexedStudents, snMap) => {
    setStudentsByClass((prev) => ({
      ...prev,
      [activeClass]: reindexedStudents
    }));

    // Remap existing mock scores across all mock series in this class when S/N shifts
    if (snMap && Object.keys(snMap).length > 0) {
      setMockScores((prev) => {
        const classSeries = prev[activeClass] || {};
        const updatedClassSeries = {};
        Object.entries(classSeries).forEach(([seriesName, gradesBySn]) => {
          const remappedGrades = {};
          Object.entries(gradesBySn || {}).forEach(([oldSn, subjectScores]) => {
            const newSn = snMap[oldSn];
            if (newSn) remappedGrades[newSn] = subjectScores;
          });
          updatedClassSeries[seriesName] = remappedGrades;
        });
        return {
          ...prev,
          [activeClass]: updatedClassSeries
        };
      });
    }
  };

  const handleSaveMockGrades = (sanitizedGrades) => {
    setMockScores((prev) => ({
      ...prev,
      [activeClass]: {
        ...(prev[activeClass] || {}),
        [activeMock]: sanitizedGrades
      }
    }));
  };

  const handleUpdateStudentMeta = (sn, metaDraft) => {
    setStudentsByClass((prev) => ({
      ...prev,
      [activeClass]: (prev[activeClass] || []).map((s) =>
        s.sn === sn ? { ...s, ...metaDraft } : s
      )
    }));
  };

  const handleSubmitInquiry = (newInquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  const handleUpdateInquiryStatus = (id, status) => {
    setInquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const handleClearAllData = () => {
    setSchoolProfile(INITIAL_SCHOOL_PROFILE);
    setStudentsByClass(INITIAL_STUDENTS);
    setMockScores(INITIAL_MOCK_SCORES);
    setSmsLogs(INITIAL_SMS_LOGS);
    setInquiries(INITIAL_INQUIRIES);
    setBasic9Finance(INITIAL_BASIC9_FINANCE);
    toast.success('All portal records cleared for a fresh start!');
  };

  // Dedicated Print Renderers (hidden on screen via no-print toggle, shown strictly during print)
  if (printJob) {
    return (
      <div className="bg-white text-black min-h-screen">
        <div className="no-print fixed top-4 right-4 z-50 flex gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl shadow-xl text-xs font-bold">
          <span>Preparing A4 Print View...</span>
          <button onClick={() => window.print()} className="underline text-amber-300">Print Again</button>
          <button onClick={() => setPrintJob(null)} className="underline text-rose-300">Close</button>
        </div>

        {printJob.type === 'broadsheet' && (
          <PrintableA4Broadsheet
            activeClass={activeClass}
            activeMock={activeMock}
            rankedResults={rankedResults}
            schoolProfile={schoolProfile}
          />
        )}

        {printJob.type === 'single-card' && (
          <div className="print-all-container">
            <MockReportCard
              studentResult={printJob.student}
              activeClass={activeClass}
              activeMock={activeMock}
              rollCount={rankedResults.length}
              schoolProfile={schoolProfile}
            />
          </div>
        )}

        {printJob.type === 'all-cards' && (
          <div className="print-all-container">
            {rankedResults.map((student) => (
              <MockReportCard
                key={student.sn}
                studentResult={student}
                activeClass={activeClass}
                activeMock={activeMock}
                rollCount={rankedResults.length}
                schoolProfile={schoolProfile}
              />
            ))}
          </div>
        )}
        {printJob.type === 'expenditure' && (
          <PrintableBasic9Expenditure
            students={studentsByClass['Basic 9'] || []}
            financeData={basic9Finance}
            schoolProfile={schoolProfile}
          />
        )}

        {printJob.type === 'b9-receipt' && (
          <PrintableAmountPaidReceipt
            receipt={printJob.receipt}
            schoolProfile={schoolProfile}
          />
        )}

        {printJob.type === 'b9-general-receipts' && (
          <PrintableGeneralReceipts
            students={studentsByClass['Basic 9'] || []}
            financeData={basic9Finance}
            schoolProfile={schoolProfile}
            options={printJob.options}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      {viewMode === 'website' && (
        <PublicWebsite
          schoolProfile={schoolProfile}
          totalStudents={totalStudentsCount}
          basic9Count={(studentsByClass['Basic 9'] || []).length}
          onOpenLogin={handleOpenLogin}
          onSubmitInquiry={handleSubmitInquiry}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        />
      )}

      {viewMode === 'login' && (
        <LoginModal
          schoolName={schoolProfile.schoolName}
          onLoginSuccess={handleLoginSuccess}
          onBackToSite={() => setViewMode('website')}
        />
      )}

      {viewMode === 'admin' && (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#09090b]">
          {/* Admin Header */}
          <header className="sticky top-0 z-30 glass-panel border-b border-slate-200 dark:border-zinc-800 no-print">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/anglican-crest.png"
                  alt="Kpando Anglican Basic School Crest"
                  className="w-9 h-9 rounded-xl object-contain bg-white p-0.5 border border-slate-200 dark:border-zinc-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm sm:text-base tracking-tight">{schoolProfile.schoolName}</span>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      <ShieldCheck className="w-3 h-3" /> {currentUser?.role || 'Admin'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                    BECE Mock WebSBA &amp; Parent SMS Portal
                  </div>
                </div>
              </div>

              {/* Class & Mock Series Switchers */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={activeClass}
                  onChange={(e) => setActiveClass(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 text-xs font-extrabold outline-none"
                >
                  {JHS_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls} {cls === 'Basic 9' ? '(BECE Focus)' : ''}
                    </option>
                  ))}
                </select>

                <select
                  value={activeMock}
                  onChange={(e) => setActiveMock(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold outline-none"
                >
                  {MOCK_SERIES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <button
                  onClick={() => setViewMode('website')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" /> Public Site
                </button>

                <button
                  onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  title="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto no-scrollbar gap-1 border-t border-slate-200/70 dark:border-zinc-800/70">
              {ADMIN_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                      isActive
                        ? 'border-emerald-700 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </header>

          {/* Main Admin Workspace */}
          <main className="max-w-7xl w-full mx-auto px-4 py-6 flex-1">
            {activeTab === 'dashboard' && (
              <AdminDashboard
                activeClass={activeClass}
                activeMock={activeMock}
                rankedResults={rankedResults}
                allStudentsByClass={studentsByClass}
                smsLogs={smsLogs}
                inquiries={inquiries}
                schoolProfile={schoolProfile}
                onNavigateTab={setActiveTab}
                onUpdateInquiryStatus={handleUpdateInquiryStatus}
              />
            )}

            {activeTab === 'roster' && (
              <Roster
                activeClass={activeClass}
                students={currentStudents}
                onSaveRoster={handleSaveRoster}
              />
            )}

            {activeTab === 'gradebook' && (
              <MockGradebook
                activeClass={activeClass}
                activeMock={activeMock}
                students={currentStudents}
                classMockGrades={currentClassMockGrades}
                onSaveMockGrades={handleSaveMockGrades}
              />
            )}

            {activeTab === 'broadsheet' && (
              <MockAnalysisBroadsheet
                activeClass={activeClass}
                activeMock={activeMock}
                rankedResults={rankedResults}
                sortMode={sortMode}
                onChangeSortMode={setSortMode}
                schoolProfile={schoolProfile}
                onPrintBroadsheet={() => setPrintJob({ type: 'broadsheet' })}
              />
            )}

            {activeTab === 'reports' && (
              <ReportCardManager
                activeClass={activeClass}
                activeMock={activeMock}
                rankedResults={rankedResults}
                students={currentStudents}
                schoolProfile={schoolProfile}
                onUpdateStudentMeta={handleUpdateStudentMeta}
                onPrintSingle={(student) => setPrintJob({ type: 'single-card', student })}
                onPrintAll={() => setPrintJob({ type: 'all-cards' })}
              />
            )}

            {activeTab === 'sms' && (
              <SmsCenter
                activeClass={activeClass}
                activeMock={activeMock}
                rankedResults={rankedResults}
                schoolProfile={schoolProfile}
                gatewayConfig={gatewayConfig}
                onSaveGatewayConfig={setGatewayConfig}
                smsLogs={smsLogs}
                onAddSmsLog={(log) => setSmsLogs((prev) => [log, ...prev])}
              />
            )}

            {activeTab === 'expenditure' && (
              <Basic9Expenditure
                students={studentsByClass['Basic 9'] || []}
                financeData={basic9Finance}
                onSaveFinance={setBasic9Finance}
                schoolProfile={schoolProfile}
                currentUser={currentUser}
                onPrintExpenditure={() => setPrintJob({ type: 'expenditure' })}
                onPrintReceipt={(receipt) => setPrintJob({ type: 'b9-receipt', receipt })}
                onPrintGeneralReceipts={(options) => setPrintJob({ type: 'b9-general-receipts', options })}
              />
            )}
            {activeTab === 'settings' && (
              <SchoolSettings
                schoolProfile={schoolProfile}
                onSaveProfile={setSchoolProfile}
                onResetDemoData={handleClearAllData}
              />
            )}
          </main>
        </div>
      )}
    </>
  );
}
