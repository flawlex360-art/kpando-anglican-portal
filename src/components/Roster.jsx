import React, { useState } from 'react';
import { UserPlus, Trash2, Edit2, Check, X, Search, Download, Upload, Phone, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  calculateAgeFromDob,
  formatDobDisplay,
  normalizeDobIso,
  resolveLearnerAge
} from '../utils/calculations';

const DEFAULT_INDEX_PREFIX = '0703070';

function getTodayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

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

function normalizeStudentDobAndAge(dobInput, ageInput) {
  const dob = normalizeDobIso(dobInput);
  const computedAge = calculateAgeFromDob(dob);
  if (computedAge !== null) {
    return { dob, age: computedAge };
  }
  const manualAge = parseInt(String(ageInput ?? '').trim(), 10);
  const age = Number.isFinite(manualAge) && manualAge > 0 && manualAge <= 99 ? manualAge : '';
  return { dob, age };
}

function applyDobToDraft(prevDraft, nextDob) {
  if (!nextDob) {
    return { ...prevDraft, dob: '', age: '' };
  }
  const calc = calculateAgeFromDob(nextDob);
  return {
    ...prevDraft,
    dob: nextDob,
    age: calc !== null ? String(calc) : ''
  };
}

function buildCsvHeaderMap(headerCols) {
  const findCol = (aliases) => headerCols.findIndex((h) => aliases.includes(h));
  return {
    index: findCol(['indexno', 'index no', 'index', 'index_no']),
    name: findCol(['name', 'learner name', 'student name', 'full name']),
    gender: findCol(['gender', 'sex']),
    dob: findCol(['dob', 'date of birth', 'birthdate', 'birth date']),
    age: findCol(['age']),
    parentName: findCol(['parentname', 'parent name', 'parent', 'guardian', 'parent / guardian']),
    parentPhone: findCol(['parentphone', 'parent phone', 'parent phone (sms)', 'phone', 'tel', 'telephone'])
  };
}

export default function Roster({ activeClass, students, onSaveRoster }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newLearner, setNewLearner] = useState({
    indexNo: '',
    name: '',
    gender: 'M',
    dob: '',
    age: '',
    parentName: '',
    parentPhone: ''
  });
  const [editingSn, setEditingSn] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  const todayIso = getTodayIso();

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
    const { dob, age } = normalizeStudentDobAndAge(newLearner.dob, newLearner.age);
    const rawList = [
      ...students,
      {
        sn: 9999999,
        indexNo: nextIndex,
        name: newLearner.name.trim().toUpperCase(),
        gender: newLearner.gender,
        dob,
        age,
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
    setNewLearner({
      indexNo: '',
      name: '',
      gender: 'M',
      dob: '',
      age: '',
      parentName: '',
      parentPhone: ''
    });
    toast.success(`Learner added to ${activeClass}!`);
  };

  const handleDelete = (sn, name) => {
    const rawList = students.filter((s) => s.sn !== sn);
    const { reindexed, snMap } = sortAndReindex(rawList);
    onSaveRoster(reindexed, snMap);
    toast.success(`Removed ${name}`);
  };

  const startEdit = (student) => {
    const normDob = normalizeDobIso(student.dob);
    const resolvedAge = resolveLearnerAge(student);
    setEditingSn(student.sn);
    setEditDraft({
      ...student,
      dob: normDob,
      age: resolvedAge !== null ? String(resolvedAge) : ''
    });
  };

  const saveEdit = () => {
    if (!editDraft.name?.trim()) return;
    const { dob, age } = normalizeStudentDobAndAge(editDraft.dob, editDraft.age);
    const rawList = students.map((s) =>
      s.sn === editingSn
        ? {
            ...s,
            indexNo: editDraft.indexNo?.trim() || s.indexNo,
            name: editDraft.name.trim().toUpperCase(),
            gender: editDraft.gender,
            dob,
            age,
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
    const header = 'SN,IndexNo,Name,Gender,DOB,Age,ParentName,ParentPhone\n';
    const rows = students
      .map((s) => {
        const dobVal = normalizeDobIso(s.dob);
        const ageVal = resolveLearnerAge(s);
        return `${s.sn},"${s.indexNo || ''}","${s.name}",${s.gender},"${dobVal}","${ageVal ?? ''}","${s.parentName || ''}","${s.parentPhone || ''}"`;
      })
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

      const headerCols = lines[0].split(',').map((c) => c.replace(/^"|"$/g, '').trim().toLowerCase());
      const headerMap = buildCsvHeaderMap(headerCols);
      const useHeaderMap = headerMap.name !== -1;

      const imported = [];
      const extraUsed = new Set();
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        if (!cols.some(Boolean)) continue;

        let rawIndex;
        let name;
        let genderRaw;
        let dobRaw;
        let ageRaw;
        let parentName;
        let parentPhone;

        if (useHeaderMap) {
          name = cols[headerMap.name] || '';
          rawIndex = headerMap.index !== -1 ? cols[headerMap.index] : '';
          genderRaw = headerMap.gender !== -1 ? cols[headerMap.gender] : 'M';
          dobRaw = headerMap.dob !== -1 ? cols[headerMap.dob] : '';
          ageRaw = headerMap.age !== -1 ? cols[headerMap.age] : '';
          parentName = headerMap.parentName !== -1 ? cols[headerMap.parentName] : '';
          parentPhone = headerMap.parentPhone !== -1 ? cols[headerMap.parentPhone] : '';
        } else {
          // Positional fallback: 7-8 cols include DOB & Age; 5-6 cols match legacy layout
          const hasSnCol = cols.length === 6 || cols.length >= 8 || (/^\d+$/.test(cols[0]) && cols[0].length <= 3);
          const offset = hasSnCol ? 1 : 0;
          rawIndex = cols[offset] || '';
          name = cols[offset + 1] || cols[0];
          genderRaw = cols[offset + 2] || 'M';
          if (cols.length - offset >= 7) {
            dobRaw = cols[offset + 3] || '';
            ageRaw = cols[offset + 4] || '';
            parentName = cols[offset + 5] || '';
            parentPhone = cols[offset + 6] || '';
          } else {
            dobRaw = '';
            ageRaw = '';
            parentName = cols[offset + 3] || '';
            parentPhone = cols[offset + 4] || '';
          }
        }

        if (!name) continue;
        const resolvedIndex = rawIndex || getNextDefaultIndexNo(students, extraUsed);
        extraUsed.add(resolvedIndex);
        const { dob, age } = normalizeStudentDobAndAge(dobRaw, ageRaw);

        imported.push({
          sn: 9999999 + i,
          indexNo: resolvedIndex,
          name: name.toUpperCase(),
          gender: (genderRaw || 'U').toUpperCase().slice(0, 1),
          dob,
          age,
          parentName: parentName || 'Parent/Guardian',
          parentPhone: parentPhone || '',
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
    const resolvedAge = resolveLearnerAge(s);
    return (
      s.name.toLowerCase().includes(q) ||
      (s.indexNo || '').toLowerCase().includes(q) ||
      (s.dob || '').toLowerCase().includes(q) ||
      (resolvedAge !== null && String(resolvedAge).includes(q)) ||
      (s.parentName || '').toLowerCase().includes(q) ||
      (s.parentPhone || '').includes(q)
    );
  });

  const nextDefaultIndex = getNextDefaultIndexNo(students);
  const newDobComputedAge = calculateAgeFromDob(newLearner.dob);

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

        <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
              Index No.
            </label>
            <input
              type="text"
              value={newLearner.indexNo}
              onChange={(e) => setNewLearner({ ...newLearner, indexNo: e.target.value })}
              placeholder={nextDefaultIndex}
              title={`Leave blank to auto-assign ${nextDefaultIndex}`}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="lg:col-span-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
              Learner Full Name *
            </label>
            <input
              type="text"
              required
              value={newLearner.name}
              onChange={(e) => setNewLearner({ ...newLearner, name: e.target.value })}
              placeholder="Surname First (e.g. Aboagye Beatrice)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs uppercase outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
              Sex
            </label>
            <select
              value={newLearner.gender}
              onChange={(e) => setNewLearner({ ...newLearner, gender: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="M">Male (M)</option>
              <option value="F">Female (F)</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              max={todayIso}
              value={newLearner.dob}
              onChange={(e) => setNewLearner((prev) => applyDobToDraft(prev, e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
              Age (Yrs)
            </label>
            <input
              type="number"
              min="1"
              max="99"
              value={newLearner.age}
              readOnly={newDobComputedAge !== null}
              onChange={(e) => setNewLearner({ ...newLearner, age: e.target.value })}
              placeholder={newDobComputedAge !== null ? 'Auto' : 'e.g. 15'}
              title={
                newDobComputedAge !== null
                  ? 'Automatically calculated from Date of Birth (clear DOB to enter manually)'
                  : 'Enter learner age if Date of Birth is unavailable'
              }
              className={`w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-600 ${
                newDobComputedAge !== null
                  ? 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300'
                  : 'bg-slate-50 dark:bg-zinc-900'
              }`}
            />
          </div>

          <div className="lg:col-span-5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
              Parent / Guardian Name
            </label>
            <input
              type="text"
              value={newLearner.parentName}
              onChange={(e) => setNewLearner({ ...newLearner, parentName: e.target.value })}
              placeholder="Parent / Guardian Name"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="lg:col-span-5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
              Parent Phone (SMS)
            </label>
            <input
              type="tel"
              value={newLearner.parentPhone}
              onChange={(e) => setNewLearner({ ...newLearner, parentPhone: e.target.value })}
              placeholder="024..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors"
            >
              Add Learner
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
              placeholder="Search name, index, DOB, age, or phone..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-3 py-3 w-11 text-center">S/N</th>
                <th className="px-3 py-3 w-28">Index No.</th>
                <th className="px-3 py-3">Learner Name</th>
                <th className="px-3 py-3 w-14 text-center">Sex</th>
                <th className="px-3 py-3 w-36">DOB</th>
                <th className="px-3 py-3 w-16 text-center">Age</th>
                <th className="px-3 py-3">Parent / Guardian</th>
                <th className="px-3 py-3 w-36">Parent Phone (SMS)</th>
                <th className="px-3 py-3 w-20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filtered.map((student) => {
                const isEditing = editingSn === student.sn;
                const displayAge = resolveLearnerAge(student);
                const editDobAge = isEditing ? calculateAgeFromDob(editDraft.dob) : null;
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
                    <td className="px-3 py-2.5 font-mono whitespace-nowrap text-slate-600 dark:text-zinc-300">
                      {isEditing ? (
                        <input
                          type="date"
                          max={todayIso}
                          value={editDraft.dob || ''}
                          onChange={(e) => setEditDraft((prev) => applyDobToDraft(prev, e.target.value))}
                          className="w-[144px] px-2 py-1 rounded border border-emerald-500 bg-white dark:bg-zinc-900 text-xs font-mono"
                        />
                      ) : (
                        formatDobDisplay(student.dob)
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center font-mono whitespace-nowrap text-slate-600 dark:text-zinc-300">
                      {isEditing ? (
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={editDraft.age ?? ''}
                          readOnly={editDobAge !== null}
                          onChange={(e) => setEditDraft({ ...editDraft, age: e.target.value })}
                          placeholder="Age"
                          title={editDobAge !== null ? 'Auto-calculated from DOB' : 'Enter manual age'}
                          className={`w-16 px-2 py-1 rounded border border-emerald-500 text-xs text-center font-mono ${
                            editDobAge !== null
                              ? 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300'
                              : 'bg-white dark:bg-zinc-900'
                          }`}
                        />
                      ) : (
                        displayAge !== null ? `${displayAge} yrs` : '-'
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
                    <td className="px-3 py-2.5 font-mono whitespace-nowrap">
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
                  <td colSpan={9} className="py-10 text-center text-slate-400">
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
