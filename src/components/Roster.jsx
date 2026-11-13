import React, { useState } from 'react';
import { UserPlus, Trash2, Edit2, Check, X, Search, Download, Upload, Phone, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_INDEX_PREFIX = '0703070';

function getNextDefaultIndexNo(existingStudents = [], extraUsed = new Set()) {
  const used = new Set(extraUsed);
  let maxSeq = 0;

  existingStudents.forEach((s) => {
    const code = String(s?.indexNo || '').trim();
    if (!code) return;
    used.add(code);
    const match = code.match(/^0703070(\d{3,})$/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (Number.isFinite(n) && n > maxSeq) maxSeq = n;
    }
  });

  used.forEach((code) => {
    const match = String(code).match(/^0703070(\d{3,})$/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (Number.isFinite(n) && n > maxSeq) maxSeq = n;
    }
  });

  let seq = maxSeq + 1;
  let candidate = `${DEFAULT_INDEX_PREFIX}${String(seq).padStart(3, '0')}`;
  while (used.has(candidate)) {
    seq += 1;
    candidate = `${DEFAULT_INDEX_PREFIX}${String(seq).padStart(3, '0')}`;
  }
  return candidate;
}

export default function Roster({ activeClass, students, onSaveRoster }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newLearner, setNewLearner] = useState({
    indexNo: '',
    name: '',
    gender: 'M',
    parentName: '',
    parentPhone: ''
  });
  const [editingSn, setEditingSn] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  const sortAndReindex = (rawList) => {
    const sorted = [...rawList].sort((a, b) => a.name.localeCompare(b.name));
    const snMap = {};
    const reindexed = sorted.map((student, idx) => {
      const newSn = idx + 1;
      if (student.sn && student.sn < 1000000) {
        snMap[student.sn] = newSn;
      }
      return { ...student, sn: newSn };
    });
    return { reindexed, snMap };
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newLearner.name.trim()) {
      toast.error('Please enter the learner full name.');
      return;
    }

    const nextIndex = newLearner.indexNo.trim() || getNextDefaultIndexNo(students);
    const rawList = [
      ...students,
      {
        sn: 9999999,
        indexNo: nextIndex,
        name: newLearner.name.trim().toUpperCase(),
        gender: newLearner.gender,
        parentName: newLearner.parentName.trim() || 'Parent/Guardian',
        parentPhone: newLearner.parentPhone.trim(),
        attendance: 60,
        conduct: 'Always attentive in class',
        interest: 'Reading books',
        remarks: ''
      }
    ];

    const { reindexed, snMap } = sortAndReindex(rawList);
    onSaveRoster(reindexed, snMap);
    setNewLearner({ indexNo: '', name: '', gender: 'M', parentName: '', parentPhone: '' });
    toast.success(`Learner added to ${activeClass}!`);
  };

  const handleDelete = (sn, name) => {
    const rawList = students.filter((s) => s.sn !== sn);
    const { reindexed, snMap } = sortAndReindex(rawList);
    onSaveRoster(reindexed, snMap);
    toast.success(`Removed ${name}`);
  };

  const startEdit = (student) => {
    setEditingSn(student.sn);
    setEditDraft({ ...student });
  };

  const saveEdit = () => {
    if (!editDraft.name?.trim()) return;
    const rawList = students.map((s) =>
      s.sn === editingSn
        ? {
            ...s,
            indexNo: editDraft.indexNo?.trim() || s.indexNo,
            name: editDraft.name.trim().toUpperCase(),
            gender: editDraft.gender,
            parentName: editDraft.parentName?.trim() || '',
            parentPhone: editDraft.parentPhone?.trim() || ''
          }
        : s
    );
    const { reindexed, snMap } = sortAndReindex(rawList);
    onSaveRoster(reindexed, snMap);
    setEditingSn(null);
    toast.success('Student & parent record updated!');
  };

  const handleExportCsv = () => {
    const header = 'SN,IndexNo,Name,Gender,ParentName,ParentPhone\n';
    const rows = students
      .map((s) => `${s.sn},"${s.indexNo || ''}","${s.name}",${s.gender},"${s.parentName || ''}","${s.parentPhone || ''}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeClass.replace(/\s+/g, '_')}_Roster.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = String(evt.target?.result || '');
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length <= 1) {
        toast.error('CSV file appears empty.');
        return;
      }
      const imported = [];
      const extraUsed = new Set();
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        if (!cols[2] && !cols[0]) continue;
        // Support either (IndexNo, Name, Gender, ParentName, ParentPhone) or (SN, IndexNo, Name, Gender, ParentName, ParentPhone)
        const hasSnCol = cols.length >= 6 || /^\d+$/.test(cols[0]) && cols[0].length <= 3;
        const name = (hasSnCol ? cols[2] : cols[1]) || cols[0];
        if (!name) continue;
        const rawIndex = (hasSnCol ? cols[1] : cols[0]) || getNextDefaultIndexNo(students, extraUsed);
        extraUsed.add(rawIndex);
        imported.push({
          sn: 9999999 + i,
          indexNo: rawIndex,
          name: name.toUpperCase(),
          gender: ((hasSnCol ? cols[3] : cols[2]) || 'U').toUpperCase().slice(0, 1),
          parentName: (hasSnCol ? cols[4] : cols[3]) || 'Parent/Guardian',
          parentPhone: (hasSnCol ? cols[5] : cols[4]) || '',
          attendance: 60,
          conduct: 'Always attentive in class',
          interest: 'Reading books',
          remarks: ''
        });
      }
      if (imported.length === 0) {
        toast.error('No valid rows found in CSV.');
        return;
      }
      const { reindexed } = sortAndReindex([...students, ...imported]);
      onSaveRoster(reindexed, {});
      toast.success(`Imported ${imported.length} learners into ${activeClass}`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filtered = students.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.indexNo || '').toLowerCase().includes(q) ||
      (s.parentName || '').toLowerCase().includes(q) ||
      (s.parentPhone || '').includes(q)
    );
  });

  const nextDefaultIndex = getNextDefaultIndexNo(students);

  return (
    <div className="space-y-6">
      {/* Add Student & Parent Contact Form */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              Register Learner &amp; Parent SMS Contact ({activeClass})
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Parent phone numbers added here are automatically available in the PTA &amp; Mock Result SMS Center.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Import CSV
              <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
            </label>
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <input
            type="text"
            value={newLearner.indexNo}
            onChange={(e) => setNewLearner({ ...newLearner, indexNo: e.target.value })}
            placeholder={`Index No. (${nextDefaultIndex})`}
            title={`Leave blank to auto-assign ${nextDefaultIndex}`}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <input
            type="text"
            required
            value={newLearner.name}
            onChange={(e) => setNewLearner({ ...newLearner, name: e.target.value })}
            placeholder="Learner Full Name *"
            className="lg:col-span-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs uppercase outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <select
            value={newLearner.gender}
            onChange={(e) => setNewLearner({ ...newLearner, gender: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="M">Male (M)</option>
            <option value="F">Female (F)</option>
          </select>
          <input
            type="text"
            value={newLearner.parentName}
            onChange={(e) => setNewLearner({ ...newLearner, parentName: e.target.value })}
            placeholder="Parent / Guardian Name"
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <div className="flex gap-2">
            <input
              type="tel"
              value={newLearner.parentPhone}
              onChange={(e) => setNewLearner({ ...newLearner, parentPhone: e.target.value })}
              placeholder="Parent Phone (024...)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shrink-0 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Roster Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-extrabold">
            <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>{activeClass} Enrolled Learners ({students.length})</span>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, index, or parent phone..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-3 py-3 w-12 text-center">S/N</th>
                <th className="px-3 py-3 w-32">Index No.</th>
                <th className="px-3 py-3">Learner Name</th>
                <th className="px-3 py-3 w-16 text-center">Sex</th>
                <th className="px-3 py-3">Parent / Guardian</th>
                <th className="px-3 py-3 w-40">Parent Phone (SMS)</th>
                <th className="px-3 py-3 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filtered.map((student) => {
                const isEditing = editingSn === student.sn;
                return (
                  <tr key={student.sn} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                    <td className="px-3 py-2.5 text-center font-mono text-slate-400">{student.sn}</td>
                    <td className="px-3 py-2.5 font-mono">
                      {isEditing ? (
                        <input
                          value={editDraft.indexNo || ''}
                          onChange={(e) => setEditDraft({ ...editDraft, indexNo: e.target.value })}
                          className="w-full px-2 py-1 rounded border border-emerald-500 bg-white dark:bg-zinc-900 text-xs"
                        />
                      ) : (
                        student.indexNo || '-'
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-bold">
                      {isEditing ? (
                        <input
                          value={editDraft.name || ''}
                          onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                          className="w-full px-2 py-1 rounded border border-emerald-500 bg-white dark:bg-zinc-900 text-xs uppercase"
                        />
                      ) : (
                        student.name
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {isEditing ? (
                        <select
                          value={editDraft.gender || 'M'}
                          onChange={(e) => setEditDraft({ ...editDraft, gender: e.target.value })}
                          className="px-1.5 py-1 rounded border border-emerald-500 bg-white dark:bg-zinc-900 text-xs"
                        >
                          <option value="M">M</option>
                          <option value="F">F</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          student.gender === 'F'
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {student.gender}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {isEditing ? (
                        <input
                          value={editDraft.parentName || ''}
                          onChange={(e) => setEditDraft({ ...editDraft, parentName: e.target.value })}
                          className="w-full px-2 py-1 rounded border border-emerald-500 bg-white dark:bg-zinc-900 text-xs"
                        />
                      ) : (
                        student.parentName || '-'
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-mono">
                      {isEditing ? (
                        <input
                          value={editDraft.parentPhone || ''}
                          onChange={(e) => setEditDraft({ ...editDraft, parentPhone: e.target.value })}
                          className="w-full px-2 py-1 rounded border border-emerald-500 bg-white dark:bg-zinc-900 text-xs"
                        />
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                          <Phone className="w-3 h-3" /> {student.parentPhone || 'Missing'}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1">
                          <button onClick={saveEdit} className="p-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700" title="Save">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditingSn(null)} className="p-1.5 rounded bg-slate-200 dark:bg-zinc-700" title="Cancel">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => startEdit(student)}
                            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.sn, student.name)}
                            className="p-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    {students.length === 0
                      ? `No learners registered in ${activeClass} yet. Add learners above or import from CSV.`
                      : `No matching learners found in ${activeClass}.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
