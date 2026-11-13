import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Plus, Trash2, Bell, Cloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFirebaseConfig, isFirebaseConfigured, saveLocalFirebaseConfig } from '../utils/firebase';

export default function SchoolSettings({ schoolProfile, onSaveProfile, onResetDemoData }) {
  const [draft, setDraft] = useState(schoolProfile);
  const [newAnn, setNewAnn] = useState({ title: '', category: 'PTA Notice', summary: '' });
  const [fbConfig, setFbConfig] = useState(() => getFirebaseConfig());

  const handleSave = (e) => {
    e.preventDefault();
    onSaveProfile(draft);
    toast.success('School settings, PTA details, and public website notices updated!');
  };

  const handleAddAnnouncement = () => {
    if (!newAnn.title.trim() || !newAnn.summary.trim()) {
      toast.error('Provide both an announcement title and summary.');
      return;
    }
    const updated = {
      ...draft,
      announcements: [
        {
          id: `ann-${Date.now()}`,
          title: newAnn.title.trim(),
          category: newAnn.category,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          summary: newAnn.summary.trim()
        },
        ...(draft.announcements || [])
      ]
    };
    setDraft(updated);
    onSaveProfile(updated);
    setNewAnn({ title: '', category: 'PTA Notice', summary: '' });
    toast.success('Announcement published to the public school website!');
  };

  const handleDeleteAnnouncement = (id) => {
    const updated = {
      ...draft,
      announcements: (draft.announcements || []).filter((a) => a.id !== id)
    };
    setDraft(updated);
    onSaveProfile(updated);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="glass-card p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-base font-black flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              School Identity, Report Card &amp; PTA Settings
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Changes made here automatically update the Public School Website, A4 Broadsheet headers, Report Cards, and SMS variables.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear all learners, mock marks, SMS logs, inquiries, and Basic 9 finance records? This cannot be undone.')) {
                  onResetDemoData();
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear All Records
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save All Settings
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold mb-1">School Name</label>
            <input
              type="text"
              value={draft.schoolName}
              onChange={(e) => setDraft({ ...draft, schoolName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Motto</label>
            <input
              type="text"
              value={draft.motto}
              onChange={(e) => setDraft({ ...draft, motto: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Education District</label>
            <input
              type="text"
              value={draft.district}
              onChange={(e) => setDraft({ ...draft, district: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Headmaster Name</label>
            <input
              type="text"
              value={draft.headmasterName}
              onChange={(e) => setDraft({ ...draft, headmasterName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Basic 9 Form Master</label>
            <input
              type="text"
              value={draft.basic9TeacherName}
              onChange={(e) => setDraft({ ...draft, basic9TeacherName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Basic 9 Teacher Tel (Receipts)</label>
            <input
              type="text"
              value={draft.basic9TeacherPhone ?? '0592664865'}
              onChange={(e) => setDraft({ ...draft, basic9TeacherPhone: e.target.value })}
              placeholder="0592664865"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 font-mono outline-none"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Academic Year</label>
            <input
              type="text"
              value={draft.academicYear}
              onChange={(e) => setDraft({ ...draft, academicYear: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Mock Exam Date</label>
            <input
              type="date"
              value={draft.examDate}
              onChange={(e) => setDraft({ ...draft, examDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Next Term Reopening Date</label>
            <input
              type="date"
              value={draft.reopeningDate}
              onChange={(e) => setDraft({ ...draft, reopeningDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Total Attendance Days</label>
            <input
              type="number"
              value={draft.timesOpen}
              onChange={(e) => setDraft({ ...draft, timesOpen: parseInt(e.target.value, 10) || 65 })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
            />
          </div>
        </div>

        {/* Upcoming PTA Configuration */}
        <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-3">
          <h3 className="text-sm font-black">Upcoming PTA Meeting Schedule (Public Banner &amp; SMS)</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold mb-1">Meeting Title</label>
              <input
                type="text"
                value={draft.ptaMeeting?.title || ''}
                onChange={(e) =>
                  setDraft({ ...draft, ptaMeeting: { ...draft.ptaMeeting, title: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Date</label>
              <input
                type="date"
                value={draft.ptaMeeting?.date || ''}
                onChange={(e) =>
                  setDraft({ ...draft, ptaMeeting: { ...draft.ptaMeeting, date: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Time</label>
              <input
                type="text"
                value={draft.ptaMeeting?.time || ''}
                onChange={(e) =>
                  setDraft({ ...draft, ptaMeeting: { ...draft.ptaMeeting, time: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Venue</label>
              <input
                type="text"
                value={draft.ptaMeeting?.venue || ''}
                onChange={(e) =>
                  setDraft({ ...draft, ptaMeeting: { ...draft.ptaMeeting, venue: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block font-bold mb-1">Agenda</label>
              <input
                type="text"
                value={draft.ptaMeeting?.agenda || ''}
                onChange={(e) =>
                  setDraft({ ...draft, ptaMeeting: { ...draft.ptaMeeting, agenda: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Public Website Announcements Manager */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-black flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" /> Public Website Noticeboard Announcements
        </h3>
        <div className="grid sm:grid-cols-4 gap-3 text-xs">
          <input
            type="text"
            value={newAnn.title}
            onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
            placeholder="Announcement Title..."
            className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
          />
          <select
            value={newAnn.category}
            onChange={(e) => setNewAnn({ ...newAnn, category: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none font-bold"
          >
            <option value="PTA Notice">PTA Notice</option>
            <option value="Academics">Academics</option>
            <option value="Admissions">Admissions</option>
          </select>
          <button
            type="button"
            onClick={handleAddAnnouncement}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Publish Notice
          </button>
          <input
            type="text"
            value={newAnn.summary}
            onChange={(e) => setNewAnn({ ...newAnn, summary: e.target.value })}
            placeholder="Short summary for parents and visitors..."
            className="sm:col-span-4 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
          />
        </div>

        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
          {(draft.announcements || []).length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">
              No announcements published yet. Use the form above to post a notice on the public website.
            </p>
          ) : (
            (draft.announcements || []).map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold">{a.title}</span>{' '}
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">({a.category} • {a.date})</span>
                  <p className="text-slate-500 dark:text-zinc-400 mt-0.5">{a.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAnnouncement(a.id)}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Firebase Cloud Sync Configuration */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black flex items-center gap-2">
              <Cloud className="w-4 h-4 text-blue-600" /> Firebase Firestore Cloud Sync
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Status:{' '}
              <strong className={isFirebaseConfigured(fbConfig) ? 'text-emerald-600' : 'text-amber-600'}>
                {isFirebaseConfigured(fbConfig) ? 'Configured (Ready for Cloud Sync)' : 'Local Browser Mode (Add Firebase Config or .env variables)'}
              </strong>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              saveLocalFirebaseConfig(fbConfig);
              toast.success('Firebase config saved! Reload the page to initialize cloud sync.');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
          >
            Save Firebase Config
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            { key: 'apiKey', label: 'API Key (VITE_FIREBASE_API_KEY)' },
            { key: 'authDomain', label: 'Auth Domain (VITE_FIREBASE_AUTH_DOMAIN)' },
            { key: 'projectId', label: 'Project ID (VITE_FIREBASE_PROJECT_ID)' },
            { key: 'storageBucket', label: 'Storage Bucket' },
            { key: 'messagingSenderId', label: 'Messaging Sender ID' },
            { key: 'appId', label: 'App ID' }
          ].map((field) => (
            <div key={field.key}>
              <label className="block font-bold mb-1">{field.label}</label>
              <input
                type="text"
                value={fbConfig[field.key] || ''}
                onChange={(e) => setFbConfig({ ...fbConfig, [field.key]: e.target.value.trim() })}
                placeholder={`Enter ${field.key}...`}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 font-mono outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
