import React, { useState, useMemo, useEffect } from 'react';
import {
  Printer, Receipt, X, FileCheck2, Users, LayoutGrid, CheckCircle2
} from 'lucide-react';
import { formatCurrencyGhc, computeBasic9FinanceSummary } from '../utils/calculations';

function formatDisplayDate(dateStr) {
  if (!dateStr) {
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function OfficialSingleReceiptCard({ receipt, schoolProfile = {}, copyLabel }) {
  const schoolName = schoolProfile.schoolName || 'Kpando Anglican Basic School';
  const phone = schoolProfile.basic9TeacherPhone || '0592664865';

  return (
    <div className="border-2 border-emerald-950 rounded-xl p-5 bg-white text-slate-900 space-y-3.5">
      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-emerald-900 pb-3 gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/anglican-crest.png"
            alt="School Crest"
            className="w-11 h-11 object-contain shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-emerald-950">
              {schoolName}
            </h2>
            <p className="text-[10px] font-semibold text-slate-600">
              {schoolProfile.district || 'Kpando Municipal Education Directorate'} • Class Teacher Tel: {phone}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mt-0.5">
              Official Basic 9 Fee Payment Receipt
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          {copyLabel && (
            <span className="inline-block px-2 py-0.5 mb-1 rounded bg-emerald-900 text-white text-[9px] font-black uppercase tracking-wider">
              {copyLabel}
            </span>
          )}
          <div className="text-[11px] font-mono font-black text-slate-900">
            No: {receipt.receiptNo || 'KABS-B9-001'}
          </div>
          <div className="text-[10px] font-semibold text-slate-600">
            Date: {formatDisplayDate(receipt.date)}
          </div>
        </div>
      </div>

      {/* Learner & Payer Info */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Learner Name</span>
          <span className="font-black text-slate-950 uppercase">{receipt.studentName}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Index No. &amp; Class</span>
          <span className="font-mono font-bold text-slate-900">
            {receipt.indexNo || '-'} • Basic 9
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Received From</span>
          <span className="font-semibold text-slate-900">{receipt.receivedFrom || receipt.studentName}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Being Payment For</span>
          <span className="font-semibold text-slate-900">{receipt.description || 'Basic 9 Levy'}</span>
        </div>
      </div>

      {/* Financial Amounts Strip */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <div className="rounded-lg border-2 border-emerald-800 bg-emerald-50/80 p-2.5 text-center">
          <span className="block text-[9px] font-bold uppercase text-emerald-900">
            Amount Paid (This Receipt)
          </span>
          <span className="text-base font-black text-emerald-950">
            {formatCurrencyGhc(receipt.amountPaidNow)}
          </span>
        </div>
        <div className="rounded-lg border border-slate-400 bg-slate-50 p-2.5 text-center">
          <span className="block text-[9px] font-bold uppercase text-slate-600">
            Total Paid to Date
          </span>
          <span className="text-sm font-black text-slate-900">
            {formatCurrencyGhc(receipt.totalPaid)}
          </span>
        </div>
        <div className="rounded-lg border border-amber-500 bg-amber-50/70 p-2.5 text-center">
          <span className="block text-[9px] font-bold uppercase text-amber-900">
            Amount Left to Pay
          </span>
          <span className="text-sm font-black text-amber-950">
            {formatCurrencyGhc(receipt.amountLeft)}
          </span>
        </div>
      </div>

      {/* Footer & Signatory */}
      <div className="flex items-end justify-between pt-3 border-t border-slate-300 text-[10px] text-slate-700 gap-4">
        <div>
          <span className="font-bold uppercase">Status: </span>
          <span className="font-black text-emerald-900">{receipt.status || (receipt.amountLeft <= 0 ? 'Cleared' : 'Partial')}</span>
          <span className="mx-2 text-slate-400">•</span>
          <span>{schoolProfile.academicYear || '2025/2026 Academic Year'}</span>
        </div>
        <div className="text-right min-w-[170px]">
          <div className="border-b border-slate-500 h-5 mb-0.5" />
          <span className="font-bold uppercase text-[9px]">
            Received By: {receipt.recordedBy || schoolProfile.basic9TeacherName || 'Basic 9 Teacher'}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Printable A4 View for an Individual Amount Paid Receipt (Original + Optional School File Copy)
 */
export function PrintableAmountPaidReceipt({ receipt, schoolProfile = {} }) {
  if (!receipt) return null;

  return (
    <div className="print-page bg-white text-slate-900 p-6 max-w-[210mm] mx-auto space-y-6">
      <OfficialSingleReceiptCard
        receipt={receipt}
        schoolProfile={schoolProfile}
        copyLabel={receipt.includeDuplicate ? "Learner / Parent Copy" : "Official Receipt"}
      />

      {receipt.includeDuplicate && (
        <>
          <div className="border-t-2 border-dashed border-slate-400 relative my-3">
            <span className="bg-white px-2 text-[9px] font-bold uppercase tracking-widest text-slate-500 absolute left-1/2 -translate-x-1/2 -top-2">
              Cut Along Dotted Line
            </span>
          </div>
          <OfficialSingleReceiptCard
            receipt={receipt}
            schoolProfile={schoolProfile}
            copyLabel="School Office Copy"
          />
        </>
      )}
    </div>
  );
}

/**
 * Printable General Receipts for All Learners (6 or 8 receipts per single A4 portrait sheet)
 */
export function PrintableGeneralReceipts({
  students = [],
  financeData = {},
  schoolProfile = {},
  options = {}
}) {
  const summary = useMemo(
    () => computeBasic9FinanceSummary(students, financeData),
    [students, financeData]
  );

  const perPage = options?.perPage === 8 ? 8 : 6;
  const filterMode = options?.filterMode || 'all';
  const titleNote = options?.titleNote?.trim() || 'Basic 9 Fee Status Receipt';
  const dateLabel = formatDisplayDate(options?.date);
  const schoolName = schoolProfile.schoolName || 'Kpando Anglican Basic School';
  const phone = schoolProfile.basic9TeacherPhone || '0592664865';

  const rows = useMemo(() => {
    if (filterMode === 'paidOnly') {
      return summary.learnerRows.filter((r) => r.amountPaid > 0);
    }
    return summary.learnerRows;
  }, [summary.learnerRows, filterMode]);

  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < rows.length; i += perPage) {
      chunks.push(rows.slice(i, i + perPage));
    }
    return chunks;
  }, [rows, perPage]);

  if (pages.length === 0) {
    return (
      <div className="print-page bg-white text-slate-900 p-10 max-w-[210mm] mx-auto text-center text-sm">
        No learners matched the selected filter to generate receipts.
      </div>
    );
  }

  return (
    <div className="print-all-container space-y-6">
      {pages.map((chunk, pageIdx) => (
        <div
          key={`receipt-page-${pageIdx}`}
          className="print-page bg-white text-slate-900 p-4 max-w-[210mm] mx-auto border border-slate-300 shadow-lg"
        >
          {/* Compact Page Cut Guide */}
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500 pb-1.5 mb-1.5 border-b border-slate-300">
            <span>{schoolName} — General Learner Receipts ({titleNote})</span>
            <span>Page {pageIdx + 1} of {pages.length} • Cut Along Dashed Lines</span>
          </div>

          {/* Fixed Height Grid so 6 (2x3) or 8 (2x4) Receipts Fit Strictly on 1 A4 Sheet */}
          <div
            className={`grid grid-cols-2 gap-2.5 ${
              perPage === 8 ? 'grid-rows-4 h-[256mm]' : 'grid-rows-3 h-[256mm]'
            }`}
          >
            {chunk.map((row, idx) => {
              const globalNum = pageIdx * perPage + idx + 1;
              const receiptCode = `GEN-B9-${String(globalNum).padStart(3, '0')}`;
              const isEightUp = perPage === 8;

              return (
                <div
                  key={row.financeKey}
                  className={`border border-dashed border-slate-600 rounded-lg flex flex-col justify-between bg-white overflow-hidden ${
                    isEightUp ? 'p-2' : 'p-3'
                  }`}
                >
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-300 pb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <img
                        src="/anglican-crest.png"
                        alt="Crest"
                        className={`${isEightUp ? 'w-6 h-6' : 'w-8 h-8'} object-contain shrink-0`}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <div className={`${isEightUp ? 'text-[9.5px]' : 'text-[10.5px]'} font-black uppercase text-emerald-950 truncate`}>
                          {schoolName}
                        </div>
                        <div className="text-[8.5px] font-bold uppercase text-emerald-800 truncate">
                          {titleNote}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[8.5px] font-mono font-bold text-slate-800">{receiptCode}</div>
                      <div className="text-[8px] text-slate-500">{dateLabel}</div>
                    </div>
                  </div>

                  {/* Learner Details */}
                  <div className={isEightUp ? 'py-1' : 'py-1.5'}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[8.5px] font-bold uppercase text-slate-500 shrink-0">Learner:</span>
                      <span className={`${isEightUp ? 'text-[10.5px]' : 'text-xs'} font-black uppercase text-slate-950 text-right truncate`}>
                        {row.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-700 mt-0.5">
                      <span>Index: <strong className="font-mono">{row.indexNo || '-'}</strong></span>
                      <span>Class: <strong>Basic 9</strong> • S/N <strong>{row.sn || globalNum}</strong></span>
                    </div>
                  </div>

                  {/* Amount Paid & Amount Left Boxes */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className={`rounded border border-emerald-700 bg-emerald-50/70 ${isEightUp ? 'px-2 py-1' : 'px-2.5 py-1.5'}`}>
                      <span className="block text-[8px] font-bold uppercase text-emerald-900">
                        Amount Paid
                      </span>
                      <span className={`${isEightUp ? 'text-[11px]' : 'text-xs'} font-black text-emerald-950`}>
                        {formatCurrencyGhc(row.amountPaid)}
                      </span>
                    </div>
                    <div className={`rounded border border-amber-500 bg-amber-50/60 ${isEightUp ? 'px-2 py-1' : 'px-2.5 py-1.5'}`}>
                      <span className="block text-[8px] font-bold uppercase text-amber-900">
                        Amount Left
                      </span>
                      <span className={`${isEightUp ? 'text-[11px]' : 'text-xs'} font-black text-amber-950`}>
                        {formatCurrencyGhc(row.amountLeft)}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-end justify-between pt-1.5 mt-1 border-t border-slate-200 text-[8.5px] text-slate-600">
                    <div>
                      <span>Status: </span>
                      <strong className={row.amountLeft <= 0 ? 'text-emerald-800' : 'text-amber-800'}>
                        {row.status}
                      </strong>
                      <span className="ml-1.5 text-slate-600 font-semibold">• Teacher Tel: {phone}</span>
                    </div>
                    <div className="text-right min-w-[85px]">
                      <div className="border-b border-slate-400 h-3.5 mb-0.5" />
                      <span className="font-bold uppercase text-[7.5px]">Teacher Sign</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Interactive Modal for Configuring & Printing Option 1 (Amount Paid Receipt)
 * or Option 2 (General Receipt — 6+ Learners per A4 Sheet)
 */
export default function Basic9ReceiptModal({
  isOpen,
  initialMode = 'amount',
  initialFinanceKey = null,
  summary,
  paymentHistory = [],
  schoolProfile = {},
  currentUser,
  onClose,
  onPrintSingleReceipt,
  onPrintGeneralReceipts
}) {
  const [mode, setMode] = useState(initialMode);
  const [selectedKey, setSelectedKey] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [receiptNo, setReceiptNo] = useState('');
  const [receiptDate, setReceiptDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [receivedFrom, setReceivedFrom] = useState('');
  const [description, setDescription] = useState('Basic 9 BECE & Academic Fee Payment');
  const [includeDuplicate, setIncludeDuplicate] = useState(true);

  // General receipt options
  const [perPage, setPerPage] = useState(6);
  const [filterMode, setFilterMode] = useState('all');
  const [titleNote, setTitleNote] = useState('Basic 9 Fee Status Receipt');
  const [generalDate, setGeneralDate] = useState(() => new Date().toISOString().slice(0, 10));

  const learnerRows = summary?.learnerRows || [];

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode || 'amount');

    const fallbackKey =
      initialFinanceKey ||
      paymentHistory?.[0]?.financeKey ||
      learnerRows[0]?.financeKey ||
      '';

    const row = learnerRows.find((r) => r.financeKey === fallbackKey) || learnerRows[0];
    setSelectedKey(row?.financeKey || '');

    if (row) {
      const latestForRow = (paymentHistory || []).find((p) => p.financeKey === row.financeKey);
      setAmountInput(
        latestForRow
          ? String(latestForRow.amountPaidNow)
          : row.amountPaid > 0
            ? String(row.amountPaid)
            : ''
      );
      setReceiptNo(
        latestForRow?.receiptNo ||
        `KABS-B9-${String((paymentHistory?.length || 0) + 1).padStart(4, '0')}`
      );
      setReceiptDate(latestForRow?.date || new Date().toISOString().slice(0, 10));
      setReceivedFrom(row.parentName ? `${row.parentName} (for ${row.name})` : row.name);
    }
  }, [isOpen, initialMode, initialFinanceKey]);

  const selectedLearner = useMemo(
    () => learnerRows.find((r) => r.financeKey === selectedKey) || null,
    [learnerRows, selectedKey]
  );

  const learnerHistory = useMemo(
    () => (paymentHistory || []).filter((p) => p.financeKey === selectedKey),
    [paymentHistory, selectedKey]
  );

  const handleSelectLearner = (newKey) => {
    setSelectedKey(newKey);
    const row = learnerRows.find((r) => r.financeKey === newKey);
    if (!row) return;
    const latestForRow = (paymentHistory || []).find((p) => p.financeKey === newKey);
    setAmountInput(
      latestForRow
        ? String(latestForRow.amountPaidNow)
        : row.amountPaid > 0
          ? String(row.amountPaid)
          : ''
    );
    setReceiptNo(
      latestForRow?.receiptNo ||
      `KABS-B9-${String((paymentHistory?.length || 0) + 1).padStart(4, '0')}`
    );
    setReceivedFrom(row.parentName ? `${row.parentName} (for ${row.name})` : row.name);
  };

  if (!isOpen) return null;

  const parsedReceiptAmt = Math.max(0, Math.round((parseFloat(amountInput) || 0) * 100) / 100);
  const singleReceiptPreview = selectedLearner
    ? {
        receiptNo: receiptNo.trim() || 'KABS-B9-0001',
        date: receiptDate,
        studentName: selectedLearner.name,
        indexNo: selectedLearner.indexNo,
        receivedFrom: receivedFrom.trim() || selectedLearner.name,
        description: description.trim() || 'Basic 9 Fee Payment',
        amountPaidNow: parsedReceiptAmt,
        totalPaid: selectedLearner.amountPaid,
        amountLeft: selectedLearner.amountLeft,
        status: selectedLearner.status,
        recordedBy: currentUser?.name || schoolProfile?.basic9TeacherName || 'Basic 9 Teacher',
        includeDuplicate
      }
    : null;

  const generalCount =
    filterMode === 'paidOnly'
      ? learnerRows.filter((r) => r.amountPaid > 0).length
      : learnerRows.length;
  const generalPageCount = Math.max(1, Math.ceil(generalCount / perPage));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Basic 9 Receipt Generator
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Print an individual receipt for an amount paid or a 6-per-page general A4 batch for all learners.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500"
            aria-label="Close receipt modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 pt-4 flex gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
          <button
            type="button"
            onClick={() => setMode('amount')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors ${
              mode === 'amount'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4" /> 1. Receipt for Amount Paid
          </button>
          <button
            type="button"
            onClick={() => setMode('general')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors ${
              mode === 'general'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> 2. General Receipts (All Learners • 6/A4 Page)
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {mode === 'amount' ? (
            learnerRows.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">
                No Basic 9 learners enrolled yet. Add learners in Students &amp; Parents first.
              </p>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                  <div className="lg:col-span-2">
                    <label className="block font-bold mb-1">Select Learner</label>
                    <select
                      value={selectedKey}
                      onChange={(e) => handleSelectLearner(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 font-semibold outline-none"
                    >
                      {learnerRows.map((r) => (
                        <option key={r.financeKey} value={r.financeKey}>
                          {r.sn}. {r.name} ({r.indexNo || 'No Index'}) — Paid: {formatCurrencyGhc(r.amountPaid)} | Left: {formatCurrencyGhc(r.amountLeft)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Amount Paid on This Receipt (GH&#8373;)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder="e.g. 100.00"
                      className="w-full px-3 py-2 rounded-xl border border-emerald-400 bg-white dark:bg-zinc-900 font-black text-emerald-700 dark:text-emerald-300 outline-none"
                    />
                  </div>

                  {learnerHistory.length > 0 && (
                    <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500 mr-1">Recorded Payments:</span>
                      {learnerHistory.slice(0, 6).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setAmountInput(String(item.amountPaidNow));
                            setReceiptNo(item.receiptNo);
                            setReceiptDate(item.date || new Date().toISOString().slice(0, 10));
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300"
                        >
                          {formatCurrencyGhc(item.amountPaidNow)} ({formatDisplayDate(item.date)})
                        </button>
                      ))}
                      {selectedLearner && selectedLearner.amountPaid > 0 && (
                        <button
                          type="button"
                          onClick={() => setAmountInput(String(selectedLearner.amountPaid))}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-[11px] font-bold text-slate-700 dark:text-zinc-200"
                        >
                          Use Full Total ({formatCurrencyGhc(selectedLearner.amountPaid)})
                        </button>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block font-bold mb-1">Receipt No.</label>
                    <input
                      type="text"
                      value={receiptNo}
                      onChange={(e) => setReceiptNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Payment Date</label>
                    <input
                      type="date"
                      value={receiptDate}
                      onChange={(e) => setReceiptDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Received From</label>
                    <input
                      type="text"
                      value={receivedFrom}
                      onChange={(e) => setReceivedFrom(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
                    />
                  </div>

                  <div className="flex items-center pt-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-zinc-200">
                      <input
                        type="checkbox"
                        checked={includeDuplicate}
                        onChange={(e) => setIncludeDuplicate(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                      />
                      Include School Copy (2-up on 1 A4)
                    </label>
                  </div>
                </div>

                {/* Live Preview */}
                {singleReceiptPreview && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Receipt Preview
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                      <OfficialSingleReceiptCard
                        receipt={singleReceiptPreview}
                        schoolProfile={schoolProfile}
                        copyLabel={includeDuplicate ? 'Learner / Parent Copy' : 'Official Receipt'}
                      />
                    </div>
                  </div>
                )}
              </>
            )
          ) : (
            <div className="space-y-5 text-xs">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div>
                  <label className="block font-bold mb-1">Receipts Per A4 Sheet</label>
                  <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 font-bold outline-none"
                  >
                    <option value={6}>6 Learners / A4 Page (2×3)</option>
                    <option value={8}>8 Learners / A4 Page (2×4 Compact)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Learners to Include</label>
                  <select
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 font-semibold outline-none"
                  >
                    <option value="all">All Learners ({learnerRows.length})</option>
                    <option value="paidOnly">
                      Paid &amp; Partial Only ({learnerRows.filter((r) => r.amountPaid > 0).length})
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Receipt Title</label>
                  <input
                    type="text"
                    value={titleNote}
                    onChange={(e) => setTitleNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={generalDate}
                    onChange={(e) => setGeneralDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200">
                  <Users className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="font-black text-sm">
                      Ready to print {generalCount} learner receipt{generalCount === 1 ? '' : 's'} across {generalPageCount} A4 sheet{generalPageCount === 1 ? '' : 's'}
                    </div>
                    <div className="text-[11px] opacity-85">
                      Each receipt clearly states the learner&apos;s name, index number, Amount Paid, Amount Left to Pay, and dashed cut lines ({perPage} receipts per A4 page).
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-700 text-white text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {perPage} Per A4 Page
                </span>
              </div>

              {/* Mini Layout Sample of first 2 cards */}
              {learnerRows.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Sample Card Layout (2 columns × {perPage / 2} rows on A4 Portrait)
                  </span>
                  <div className="grid sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                    {(filterMode === 'paidOnly'
                      ? learnerRows.filter((r) => r.amountPaid > 0)
                      : learnerRows
                    )
                      .slice(0, 2)
                      .map((row, idx) => (
                        <div
                          key={row.financeKey}
                          className="border border-dashed border-slate-500 rounded-lg p-3 bg-white text-slate-900 space-y-2"
                        >
                          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                            <div>
                              <div className="text-[10px] font-black uppercase text-emerald-950">
                                {schoolProfile.schoolName || 'Kpando Anglican Basic School'}
                              </div>
                              <div className="text-[8.5px] font-bold uppercase text-emerald-700">
                                {titleNote}
                              </div>
                            </div>
                            <span className="text-[9px] font-mono font-bold">
                              GEN-B9-{String(idx + 1).padStart(3, '0')}
                            </span>
                          </div>
                          <div>
                            <div className="text-xs font-black uppercase">{row.name}</div>
                            <div className="text-[10px] text-slate-500">Index: {row.indexNo || '-'} • Basic 9</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded border border-emerald-600 bg-emerald-50 px-2 py-1">
                              <span className="block text-[8px] font-bold uppercase text-emerald-800">Amount Paid</span>
                              <span className="text-xs font-black text-emerald-950">{formatCurrencyGhc(row.amountPaid)}</span>
                            </div>
                            <div className="rounded border border-amber-500 bg-amber-50 px-2 py-1">
                              <span className="block text-[8px] font-bold uppercase text-amber-800">Amount Left</span>
                              <span className="text-xs font-black text-amber-950">{formatCurrencyGhc(row.amountLeft)}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[9px] text-slate-600">
                            <span>
                              Status: <strong>{row.status}</strong> • Teacher Tel: {schoolProfile.basic9TeacherPhone || '0592664865'}
                            </span>
                            <span className="uppercase font-bold text-[8px]">Teacher Sign</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-2.5 bg-slate-50 dark:bg-zinc-900/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>

          {mode === 'amount' ? (
            <button
              type="button"
              disabled={!singleReceiptPreview || parsedReceiptAmt <= 0}
              onClick={() => {
                onClose();
                onPrintSingleReceipt(singleReceiptPreview);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print Amount Receipt
            </button>
          ) : (
            <button
              type="button"
              disabled={generalCount === 0}
              onClick={() => {
                onClose();
                onPrintGeneralReceipts({
                  perPage,
                  filterMode,
                  titleNote,
                  date: generalDate
                });
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print General Receipts ({generalPageCount} A4 Page{generalPageCount === 1 ? '' : 's'})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
