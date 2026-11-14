import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, ChevronRight, FileText, Printer, Send, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import anglicanCrestImg from '../../assets/anglican-crest.png';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function printResourceDocument(resource, schoolProfile) {
  if (!resource) return;
  const win = window.open('', '_blank', 'width=850,height=950');
  if (!win) {
    toast.error('Pop-up blocked. Allow pop-ups for this site to print documents.');
    return;
  }

  const sectionsHtml = (resource.sections || [])
    .map(
      (sec) => `
      <section style="margin-top:18px;">
        <h3 style="margin:0 0 8px 0;font-size:14px;color:#064e3b;border-bottom:1px solid #cbd5e1;padding-bottom:4px;">
          ${escapeHtml(sec.heading)}
        </h3>
        <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.65;color:#1e293b;">
          ${(sec.bullets || []).map((b) => `<li style="margin-bottom:4px;">${escapeHtml(b)}</li>`).join('')}
        </ul>
      </section>
    `
    )
    .join('');

  win.document.write(`<!doctype html>
  <html>
    <head>
      <title>${escapeHtml(resource.title)} — ${escapeHtml(schoolProfile.schoolName)}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #0f172a; margin: 28px; }
        @media print { @page { size: A4 portrait; margin: 14mm; } }
      </style>
    </head>
    <body>
      <header style="display:flex;align-items:center;gap:14px;border-bottom:2px solid #064e3b;padding-bottom:12px;">
        <img src="${anglicanCrestImg}" alt="School Crest" style="width:58px;height:58px;object-fit:contain;" />
        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#047857;">
            Ghana Education Service • ${escapeHtml(schoolProfile.district)}
          </div>
          <h1 style="margin:2px 0;font-size:20px;color:#022c22;">${escapeHtml(schoolProfile.schoolName)}</h1>
          <div style="font-size:12px;color:#475569;">${escapeHtml(schoolProfile.motto)}</div>
        </div>
      </header>
      <main style="margin-top:20px;">
        <div style="display:inline-block;padding:3px 10px;border-radius:999px;background:#ecfdf5;color:#065f46;font-size:11px;font-weight:700;">
          ${escapeHtml(resource.category)} • ${escapeHtml(resource.updated)}
        </div>
        <h2 style="margin:10px 0 6px 0;font-size:18px;">${escapeHtml(resource.title)}</h2>
        <p style="margin:0 0 12px 0;font-size:13px;color:#334155;">${escapeHtml(resource.summary)}</p>
        ${sectionsHtml}
      </main>
      <footer style="margin-top:28px;padding-top:10px;border-top:1px solid #cbd5e1;font-size:11px;color:#64748b;display:flex;justify-content:space-between;">
        <span>${escapeHtml(schoolProfile.address)} • Tel: ${escapeHtml(schoolProfile.phone || '')}</span>
        <span>Academic Year: ${escapeHtml(schoolProfile.academicYear)}</span>
      </footer>
      <script>window.onload = function () { window.print(); };</script>
    </body>
  </html>`);
  win.document.close();
}

export function PublicPageHero({ badge, breadcrumb, title, description, onNavigate, rightContent }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-200/90 font-semibold">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="hover:text-white underline-offset-2 hover:underline"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="text-amber-300 font-bold">{breadcrumb}</span>
              {badge && (
                <span className="ml-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold text-white">
                  {badge}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">{title}</h1>
            <p className="text-xs sm:text-base text-emerald-50/90 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
          {rightContent && <div className="shrink-0">{rightContent}</div>}
        </div>
      </div>
    </section>
  );
}

export function ResourceReaderModal({ resource, schoolProfile, onClose }) {
  useEffect(() => {
    if (!resource) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [resource, onClose]);

  if (!resource) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={resource.title}
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] overflow-y-auto glass-card p-6 sm:p-8 space-y-5 bg-white dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[11px] font-bold">
              <FileText className="w-3 h-3" /> {resource.category} • {resource.updated}
            </div>
            <h3 className="text-lg sm:text-xl font-black leading-snug">{resource.title}</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">{resource.summary}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close document preview"
            className="p-2 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {(resource.sections || []).map((sec) => (
            <div
              key={sec.heading}
              className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2"
            >
              <h4 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-300">{sec.heading}</h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-zinc-300">
                {(sec.bullets || []).map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-zinc-800">
          <span className="text-[11px] text-slate-500 dark:text-zinc-400">
            Official school template — editable before term issuance.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => printResourceDocument(resource, schoolProfile)}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save A4 PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WebsiteInquiryForm({ mode = 'admissions', schoolProfile, onSubmitInquiry }) {
  const isContactMode = mode === 'contact';
  const [form, setForm] = useState({
    parentName: '',
    phone: '',
    studentName: '',
    targetClass: isContactMode ? 'General Inquiry' : 'Basic 7',
    message: ''
  });
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedParent = form.parentName.trim();
    const trimmedPhone = form.phone.trim();
    const trimmedStudent = form.studentName.trim();

    if (!trimmedParent || !trimmedPhone || (!isContactMode && !trimmedStudent)) {
      toast.error(
        isContactMode
          ? 'Please enter your name and phone number.'
          : 'Please enter parent name, phone number, and learner name.'
      );
      return;
    }

    if (isContactMode && !form.message.trim()) {
      toast.error('Please enter your question or callback message.');
      return;
    }

    onSubmitInquiry({
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      parentName: trimmedParent,
      phone: trimmedPhone,
      studentName: trimmedStudent || 'Parent / Community Inquiry',
      targetClass: form.targetClass,
      message: form.message.trim() || 'Requesting admission information.',
      status: 'New'
    });

    setForm({
      parentName: '',
      phone: '',
      studentName: '',
      targetClass: isContactMode ? 'General Inquiry' : 'Basic 7',
      message: ''
    });
    setSubmittedSuccess(true);
    toast.success(
      isContactMode
        ? 'Message sent! Our school office will follow up via call or SMS.'
        : 'Admission inquiry submitted! Our administration will contact you via SMS/call.'
    );
  };

  return (
    <div className="glass-card p-6 sm:p-8 space-y-5">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
          {isContactMode ? 'Parent Message & Callback Desk' : 'Online Admissions Inquiry'}
        </span>
        <h2 className="text-2xl font-black mt-1">
          {isContactMode
            ? 'Send a Direct Message to School Administration'
            : `Enroll Your Ward for ${schoolProfile.academicYear}`}
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          {isContactMode
            ? 'Questions about term dates, PTA meetings, transfers, or BECE support? Log your message here for the Admin Dashboard inbox.'
            : 'Submit an inquiry below. Submissions appear immediately inside the Headmaster & Admin Dashboard for prompt follow-up.'}
        </p>
      </div>

      {submittedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Thank you! Your submission has been logged for our Headteacher &amp; Administration Office.
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1">Parent / Guardian Name *</label>
          <input
            type="text"
            required
            value={form.parentName}
            onChange={(e) => setForm({ ...form, parentName: e.target.value })}
            placeholder="e.g. Mrs. Comfort Mensah"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">Phone Number (WhatsApp / SMS) *</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="e.g. 024 XXX XXXX"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">
            {isContactMode ? 'Learner Name (if applicable)' : 'Learner Full Name *'}
          </label>
          <input
            type="text"
            required={!isContactMode}
            value={form.studentName}
            onChange={(e) => setForm({ ...form, studentName: e.target.value })}
            placeholder="e.g. Daniel Mensah"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">
            {isContactMode ? 'Inquiry Department / Topic' : 'Target Entry Class'}
          </label>
          <select
            value={form.targetClass}
            onChange={(e) => setForm({ ...form, targetClass: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
          >
            {isContactMode ? (
              <>
                <option value="General Inquiry">General School Administration</option>
                <option value="Basic 9 / BECE Inquiry">Basic 9 BECE &amp; Report Card Desk</option>
                <option value="PTA & SMS Updates">PTA &amp; Parent SMS Number Update</option>
                <option value="Fees & Accounts Inquiry">Fees, Receipts &amp; Prospectus</option>
              </>
            ) : (
              <>
                <option value="Kindergarten (KG 1-2)">Kindergarten (KG 1 – KG 2)</option>
                <option value="Lower Primary (Basic 1-3)">Lower Primary (Basic 1 – Basic 3)</option>
                <option value="Upper Primary (Basic 4-6)">Upper Primary (Basic 4 – Basic 6)</option>
                <option value="Basic 7">Basic 7 (JHS 1)</option>
                <option value="Basic 8">Basic 8 (JHS 2)</option>
                <option value="Basic 9">Basic 9 (JHS 3 / BECE)</option>
              </>
            )}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold mb-1">
            {isContactMode ? 'Your Message *' : 'Previous School / Questions'}
          </label>
          <textarea
            rows={3}
            required={isContactMode}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={
              isContactMode
                ? 'Type your question, callback request, or guardian phone update here...'
                : 'Previous school attended, learner age, or specific admission questions...'
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            {isContactMode ? 'Send Message to Office' : 'Submit Admission Inquiry'}
          </button>
        </div>
      </form>
    </div>
  );
}
