import React, { useState, useMemo } from 'react';
import {
  Wallet, Search, FileSpreadsheet, Printer, Plus, Trash2,
  CheckCircle2, RotateCcw, Edit3, Save, Coins, TrendingUp, AlertCircle,
  Receipt, LayoutGrid, MessageSquare, Send, X, CheckSquare, Square, Copy
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BASIC9_DEFAULT_FEE,
  getLearnerFinanceKey,
  formatCurrencyGhc,
  computeBasic9FinanceSummary
} from '../utils/calculations';
import {
  sendFeePaymentSms,
  dispatchOwingFeeReminders,
  filterOwingRecipients,
  interpolateSmsTemplate,
  formatSmsCurrency,
  formatSmsName,
  normalizeSmsSenderId
} from '../utils/smsService';
import { exportBasic9ExpenditureExcel } from '../utils/excelExport';
import Basic9ReceiptModal from './Basic9Receipts';

const STATUS_BADGE_STYLES = {
  Cleared: 'bg-slate-50 text-slate-800 dark:bg-zinc-900 dark:text-zinc-200 border-slate-300 dark:border-zinc-700',
  Partial: 'bg-white text-slate-600 dark:bg-zinc-900/60 dark:text-zinc-300 border-slate-200 dark:border-zinc-700',
  Unpaid: 'bg-white text-slate-400 dark:bg-zinc-950 dark:text-zinc-500 border-slate-200 dark:border-zinc-800'
};

const STATUS_DOT_STYLES = {
  Cleared: 'bg-emerald-600 dark:bg-emerald-400',
  Partial: 'bg-slate-400 dark:bg-zinc-400',
  Unpaid: 'bg-slate-200 dark:bg-zinc-700'
};

export function PrintableBasic9Expenditure({ students = [], financeData = {}, schoolProfile = {} }) {
  const summary = useMemo(
    () => computeBasic9FinanceSummary(students, financeData),
    [students, financeData]
  );

  const todayLabel = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="print-page bg-white text-black p-6 max-w-[210mm] mx-auto text-[11px] leading-snug">
      {/* Official Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4 gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/anglican-crest.png"
            alt="School Crest"
            className="w-12 h-12 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <h1 className="text-base font-black uppercase tracking-wide text-black">
              {schoolProfile.schoolName || schoolProfile.name || 'KPANDO ANGLICAN BASIC SCHOOL'}
            </h1>
            <p className="text-[10px] font-semibold text-zinc-700">
              {schoolProfile.motto || 'Discipline, Excellence & Service'} • {schoolProfile.district || schoolProfile.address || 'Kpando, Volta Region'}
            </p>
            <p className="text-[10px] text-zinc-600">
              Tel: {schoolProfile.phone || '0246951331'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase text-black">
            Basic 9 Teacher Financial &amp; Expenditure Ledger
          </p>
          <p className="text-[10px] text-zinc-700 font-semibold">
            {schoolProfile.academicYear || '2025/2026 Academic Year'} • {schoolProfile.currentTerm || 'Term 2'}
          </p>
          <p className="text-[10px] text-zinc-600">
            Fee / Learner: {formatCurrencyGhc(summary.targetFee)} • Printed: {todayLabel}
          </p>
        </div>
      </div>

      {/* Master Financial Summary Columns */}
      <table className="w-full border-collapse border border-black mb-4 text-center">
        <thead>
          <tr className="bg-zinc-200 text-black text-[10px] uppercase">
            <th className="border border-black px-2 py-1.5">Fee / Learner</th>
            <th className="border border-black px-2 py-1.5">Total Expected (GH&#8373;)</th>
            <th className="border border-black px-2 py-1.5">All Total Paid (GH&#8373;)</th>
            <th className="border border-black px-2 py-1.5">Total Left to Pay (GH&#8373;)</th>
            <th className="border border-black px-2 py-1.5">Total Expenditure (GH&#8373;)</th>
            <th className="border border-black px-2 py-1.5">Expenditure Returns (GH&#8373;)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white font-black text-xs">
            <td className="border border-black px-2 py-2">{formatCurrencyGhc(summary.targetFee)}</td>
            <td className="border border-black px-2 py-2">{formatCurrencyGhc(summary.totalExpected)}</td>
            <td className="border border-black px-2 py-2">{formatCurrencyGhc(summary.totalCollected)}</td>
            <td className="border border-black px-2 py-2">{formatCurrencyGhc(summary.totalLeftToPay)}</td>
            <td className="border border-black px-2 py-2">{formatCurrencyGhc(summary.totalExpenditure)}</td>
            <td className="border border-black px-2 py-2">{formatCurrencyGhc(summary.expenditureReturns)}</td>
          </tr>
        </tbody>
      </table>

      {/* Learner Payments Table */}
      <h2 className="text-[11px] font-black uppercase text-black mb-1.5">
        1. Basic 9 Learner Fee Collections ({summary.learnerRows.length} Learners)
      </h2>
      <table className="w-full border-collapse border border-black mb-5">
        <thead>
          <tr className="bg-zinc-100 text-[10px] uppercase text-black">
            <th className="border border-black px-1.5 py-1 text-center w-9">S/N</th>
            <th className="border border-black px-2 py-1 text-left w-28">Index No.</th>
            <th className="border border-black px-2 py-1 text-left">Learner Name</th>
            <th className="border border-black px-2 py-1 text-right w-28">Amount Paid (GH&#8373;)</th>
            <th className="border border-black px-2 py-1 text-right w-28">Left to Pay (GH&#8373;)</th>
            <th className="border border-black px-2 py-1 text-center w-24">Status</th>
          </tr>
        </thead>
        <tbody>
          {summary.learnerRows.map((row, idx) => (
            <tr key={row.financeKey} className={idx % 2 === 1 ? 'bg-zinc-50' : ''}>
              <td className="border border-zinc-400 px-1.5 py-1 text-center font-semibold">{row.sn || idx + 1}</td>
              <td className="border border-zinc-400 px-2 py-1 font-mono text-[10px]">{row.indexNo || '-'}</td>
              <td className="border border-zinc-400 px-2 py-1 font-semibold">{row.name}</td>
              <td className="border border-zinc-400 px-2 py-1 text-right font-bold">
                {formatCurrencyGhc(row.amountPaid)}
              </td>
              <td className="border border-zinc-400 px-2 py-1 text-right font-semibold">
                {formatCurrencyGhc(row.amountLeft)}
              </td>
              <td className="border border-zinc-400 px-2 py-1 text-center font-bold text-[10px]">{row.status}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-zinc-100 font-black text-[11px]">
            <td colSpan={3} className="border border-black px-2 py-1.5 text-right uppercase">
              All Basic 9 Totals (Expected: {formatCurrencyGhc(summary.totalExpected)})
            </td>
            <td className="border border-black px-2 py-1.5 text-right">
              {formatCurrencyGhc(summary.totalCollected)}
            </td>
            <td className="border border-black px-2 py-1.5 text-right">
              {formatCurrencyGhc(summary.totalLeftToPay)}
            </td>
            <td className="border border-black px-2 py-1.5 text-center text-[10px]">
              {summary.clearedCount}/{summary.learnerRows.length} Cleared
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Expenditure Items & Net Returns */}
      <h2 className="text-[11px] font-black uppercase text-black mb-1.5">
        2. Expenditure Log &amp; Net Expenditure Returns
      </h2>
      <table className="w-full border-collapse border border-black mb-5">
        <thead>
          <tr className="bg-zinc-100 text-[10px] uppercase text-black">
            <th className="border border-black px-1.5 py-1 text-center w-9">S/N</th>
            <th className="border border-black px-2 py-1 text-center w-24">Date</th>
            <th className="border border-black px-2 py-1 text-left">Expense Description</th>
            <th className="border border-black px-2 py-1 text-left w-28">Receipt / Ref</th>
            <th className="border border-black px-2 py-1 text-right w-28">Amount Spent (GH&#8373;)</th>
          </tr>
        </thead>
        <tbody>
          {summary.expenses.length === 0 ? (
            <tr>
              <td colSpan={5} className="border border-zinc-400 px-3 py-3 text-center text-zinc-500 italic">
                No expenditure entries recorded yet.
              </td>
            </tr>
          ) : (
            summary.expenses.map((exp, idx) => (
              <tr key={exp.id || idx} className={idx % 2 === 1 ? 'bg-zinc-50' : ''}>
                <td className="border border-zinc-400 px-1.5 py-1 text-center">{idx + 1}</td>
                <td className="border border-zinc-400 px-2 py-1 text-center">{exp.date || '-'}</td>
                <td className="border border-zinc-400 px-2 py-1 font-semibold">{exp.description}</td>
                <td className="border border-zinc-400 px-2 py-1 font-mono text-[10px]">{exp.reference || '-'}</td>
                <td className="border border-zinc-400 px-2 py-1 text-right font-bold">
                  {formatCurrencyGhc(exp.amount)}
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr className="bg-zinc-100 font-bold">
            <td colSpan={4} className="border border-black px-2 py-1.5 text-right uppercase">
              Total Expenditure
            </td>
            <td className="border border-black px-2 py-1.5 text-right">
              {formatCurrencyGhc(summary.totalExpenditure)}
            </td>
          </tr>
          <tr className="bg-zinc-200 font-black">
            <td colSpan={4} className="border border-black px-2 py-1.5 text-right uppercase">
              Expenditure Returns (All Total Paid {formatCurrencyGhc(summary.totalCollected)} &minus; Total Expenditure {formatCurrencyGhc(summary.totalExpenditure)})
            </td>
            <td className="border border-black px-2 py-1.5 text-right">
              {formatCurrencyGhc(summary.expenditureReturns)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Signatories */}
      <div className="grid grid-cols-2 gap-12 pt-6 mt-4 text-[10px] text-zinc-700">
        <div>
          <div className="border-b border-black h-7 mb-1" />
          <p className="font-bold uppercase text-black">Basic 9 Form Master / Class Teacher</p>
          <p className="text-zinc-500">Signature &amp; Date</p>
        </div>
        <div>
          <div className="border-b border-black h-7 mb-1" />
          <p className="font-bold uppercase text-black">Headmaster ({schoolProfile.headmasterName || 'School Head'})</p>
          <p className="text-zinc-500">Verification &amp; Official Stamp</p>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_FEE_REMINDER_TEMPLATE =
  "Dear {parent_name}, kindly settle {student_name}'s Basic 9 fee balance. Amount left to pay: {amount_left} (Paid: {amount_paid} of {total_fee}). Thank you. - {school_name}";

export default function Basic9Expenditure({
  students = [],
  financeData = {},
  onSaveFinance,
  schoolProfile = {},
  currentUser,
  gatewayConfig,
  onAddSmsLog,
  onPrintExpenditure,
  onPrintReceipt,
  onPrintGeneralReceipts
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentAddDrafts, setPaymentAddDrafts] = useState({});
  const [editingTotalKey, setEditingTotalKey] = useState(null);
  const [editingTotalValue, setEditingTotalValue] = useState('');
  const [editingFee, setEditingFee] = useState(false);
  const [receiptModal, setReceiptModal] = useState({ open: false, mode: 'amount', financeKey: null });
  const [lastPaymentSms, setLastPaymentSms] = useState(null);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [reminderTemplate, setReminderTemplate] = useState(DEFAULT_FEE_REMINDER_TEMPLATE);
  const [selectedOwingKeys, setSelectedOwingKeys] = useState([]);
  const [reminderPreviewKey, setReminderPreviewKey] = useState(null);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [feeInput, setFeeInput] = useState(() =>
    String(
      financeData?.feePerLearner !== undefined
        ? financeData.feePerLearner
        : BASIC9_DEFAULT_FEE
    )
  );
  const [expenseForm, setExpenseForm] = useState(() => ({
    date: new Date().toISOString().slice(0, 10),
    description: '',
    reference: '',
    amount: ''
  }));
  const [exporting, setExporting] = useState(false);

  const summary = useMemo(
    () => computeBasic9FinanceSummary(students, financeData),
    [students, financeData]
  );

  const owingRows = useMemo(
    () => filterOwingRecipients(summary.learnerRows),
    [summary.learnerRows]
  );

  const autoSmsEnabled = financeData?.autoSmsOnPayment !== false;

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return summary.learnerRows.filter((row) => {
      const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
      const matchesSearch =
        !q ||
        (row.name || '').toLowerCase().includes(q) ||
        (row.indexNo || '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [summary.learnerRows, searchTerm, statusFilter]);

  const updateFinance = (updater) => {
    onSaveFinance((prev) => {
      const base = {
        feePerLearner: BASIC9_DEFAULT_FEE,
        paymentsByLearner: {},
        expenses: [],
        paymentHistory: [],
        ...prev
      };
      return updater(base);
    });
  };

  const triggerAutoPaymentSms = async ({ row, amountPaidNow, totalPaidAfter, amountLeftAfter }) => {
    if (!autoSmsEnabled || amountPaidNow <= 0) return;

    const result = await sendFeePaymentSms({
      student: row,
      amountPaidNow,
      totalPaidAfter,
      amountLeftAfter,
      schoolProfile,
      gatewayConfig
    });

    setLastPaymentSms({
      ...result,
      timestamp: new Date().toLocaleTimeString()
    });

    if (result.sent && onAddSmsLog) {
      onAddSmsLog({
        id: `sms-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        category: 'Fee Payment Auto-SMS',
        gateway: result.mode,
        recipientCount: 1,
        deliveredCount: 1,
        sampleMessage: result.message
      });
    }

    if (result.sent) {
      toast.success(
        `Auto-SMS sent to ${result.parentDisplay} (Left: ${formatSmsCurrency(amountLeftAfter)}) via ${result.mode}`
      );
    } else {
      toast(`Payment saved — SMS text ready below (${result.error || 'SMS not delivered'}).`);
    }
  };

  const handleToggleAutoSms = () => {
    updateFinance((base) => ({
      ...base,
      autoSmsOnPayment: base.autoSmsOnPayment === false
    }));
  };

  const handleOpenReminderModal = () => {
    if (owingRows.length === 0) {
      toast.success('All Basic 9 parents have cleared their fees — nobody is owing.');
      return;
    }
    setSelectedOwingKeys(owingRows.map((r) => r.financeKey));
    setReminderPreviewKey(owingRows[0]?.financeKey || null);
    setReminderModalOpen(true);
  };

  const handleToggleOwingKey = (key) => {
    setSelectedOwingKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleSendOwingReminders = async () => {
    const selectedRows = filterOwingRecipients(
      owingRows.filter((r) => selectedOwingKeys.includes(r.financeKey))
    );
    if (selectedRows.length === 0) {
      toast.error('Select at least one owing parent to send reminders.');
      return;
    }
    if (!reminderTemplate.trim()) {
      toast.error('Reminder message cannot be empty.');
      return;
    }

    setSendingReminders(true);
    try {
      const result = await dispatchOwingFeeReminders({
        rows: selectedRows,
        messageTemplate: reminderTemplate,
        schoolProfile,
        gatewayConfig
      });

      if (onAddSmsLog && result.total > 0) {
        onAddSmsLog({
          id: `sms-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          category: 'Owing Fees Reminder',
          gateway: result.mode,
          recipientCount: result.total,
          deliveredCount: result.deliveredCount,
          sampleMessage: result.dispatches[0]?.message || reminderTemplate
        });
      }

      if (result.failedCount > 0) {
        const firstReason = result.failures?.[0]?.reason;
        const msg = `Sent ${result.deliveredCount}/${result.total} fee reminders via ${result.mode} (${result.failedCount} failed${firstReason ? `: ${firstReason}` : ''}).`;
        if (result.deliveredCount === 0) toast.error(msg);
        else toast.success(msg);
      } else {
        toast.success(
          `Sent personalized balance reminders to ${result.deliveredCount} owing parent${result.deliveredCount === 1 ? '' : 's'} via ${result.mode}! (${summary.clearedCount} cleared skipped)`
        );
      }
      setReminderModalOpen(false);
    } catch (err) {
      toast.error(`Fee reminder error: ${err.message}`);
    } finally {
      setSendingReminders(false);
    }
  };

  const handleAddLearnerPayment = (row) => {
    const raw = paymentAddDrafts[row.financeKey];
    const parsed = parseFloat(String(raw ?? '').replace(/,/g, ''));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast.error(`Enter a payment amount above GH₵ 0.00 for ${row.name}.`);
      return;
    }

    const added = Math.round(parsed * 100) / 100;
    const newTotal = Math.round((row.amountPaid + added) * 100) / 100;
    const newLeft = Math.max(0, Math.round((row.targetFee - newTotal) * 100) / 100);
    const today = new Date().toISOString().slice(0, 10);

    updateFinance((base) => {
      const existingHistory = Array.isArray(base.paymentHistory) ? base.paymentHistory : [];
      const nextNum = existingHistory.length + 1;
      const receiptEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        receiptNo: `KABS-B9-${String(nextNum).padStart(4, '0')}`,
        financeKey: row.financeKey,
        studentName: row.name,
        indexNo: row.indexNo,
        date: today,
        amountPaidNow: added,
        totalPaidAfter: newTotal,
        amountLeftAfter: newLeft,
        recordedBy: currentUser?.name || currentUser?.email || 'Basic 9 Teacher'
      };

      return {
        ...base,
        paymentsByLearner: {
          ...base.paymentsByLearner,
          [row.financeKey]: newTotal
        },
        paymentHistory: [receiptEntry, ...existingHistory].slice(0, 300)
      };
    });

    setPaymentAddDrafts((prev) => {
      const next = { ...prev };
      delete next[row.financeKey];
      return next;
    });

    toast.success(`Added ${formatCurrencyGhc(added)} for ${row.name} — Total Paid: ${formatCurrencyGhc(newTotal)}`);
    triggerAutoPaymentSms({
      row,
      amountPaidNow: added,
      totalPaidAfter: newTotal,
      amountLeftAfter: newLeft
    });
  };

  const handleSaveEditedTotal = (row) => {
    const parsed = parseFloat(String(editingTotalValue).replace(/,/g, ''));
    if (!Number.isFinite(parsed) || parsed < 0) {
      toast.error('Enter a valid total paid amount (0 or above).');
      return;
    }
    const cleanTotal = Math.round(parsed * 100) / 100;
    updateFinance((base) => ({
      ...base,
      paymentsByLearner: {
        ...base.paymentsByLearner,
        [row.financeKey]: cleanTotal
      }
    }));
    setEditingTotalKey(null);
    setEditingTotalValue('');
    toast.success(`Updated ${row.name} Total Paid to ${formatCurrencyGhc(cleanTotal)}`);
  };

  const handleQuickPayment = (row, amount) => {
    const rounded = Math.round(amount * 100) / 100;
    const delta = Math.round((rounded - row.amountPaid) * 100) / 100;
    const newLeft = Math.max(0, Math.round((row.targetFee - rounded) * 100) / 100);
    const today = new Date().toISOString().slice(0, 10);

    updateFinance((base) => {
      const existingHistory = Array.isArray(base.paymentHistory) ? base.paymentHistory : [];
      const nextHistory =
        delta > 0
          ? [
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                receiptNo: `KABS-B9-${String(existingHistory.length + 1).padStart(4, '0')}`,
                financeKey: row.financeKey,
                studentName: row.name,
                indexNo: row.indexNo,
                date: today,
                amountPaidNow: delta,
                totalPaidAfter: rounded,
                amountLeftAfter: newLeft,
                recordedBy: currentUser?.name || currentUser?.email || 'Basic 9 Teacher'
              },
              ...existingHistory
            ].slice(0, 300)
          : existingHistory;

      return {
        ...base,
        paymentsByLearner: {
          ...base.paymentsByLearner,
          [row.financeKey]: rounded
        },
        paymentHistory: nextHistory
      };
    });
    setPaymentAddDrafts((prev) => {
      const next = { ...prev };
      delete next[row.financeKey];
      return next;
    });
    if (editingTotalKey === row.financeKey) {
      setEditingTotalKey(null);
      setEditingTotalValue('');
    }
    toast.success(
      rounded > 0
        ? `${row.name}: ${formatCurrencyGhc(rounded)} recorded`
        : `${row.name}: payment cleared`
    );
    if (delta > 0) {
      triggerAutoPaymentSms({
        row,
        amountPaidNow: delta,
        totalPaidAfter: rounded,
        amountLeftAfter: newLeft
      });
    }
  };

  const handleSaveTargetFee = (e) => {
    e.preventDefault();
    const parsed = parseFloat(feeInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast.error('Enter a valid fee per learner greater than 0.');
      return;
    }
    const cleanFee = Math.round(parsed * 100) / 100;
    updateFinance((base) => ({
      ...base,
      feePerLearner: cleanFee
    }));
    setFeeInput(String(cleanFee));
    setEditingFee(false);
    toast.success(`Basic 9 expected fee updated to ${formatCurrencyGhc(cleanFee)} per learner.`);
  };

  const handleResetDefaultFee = () => {
    updateFinance((base) => ({
      ...base,
      feePerLearner: BASIC9_DEFAULT_FEE
    }));
    setFeeInput(String(BASIC9_DEFAULT_FEE));
    setEditingFee(false);
    toast.success(`Restored standard fee to ${formatCurrencyGhc(BASIC9_DEFAULT_FEE)} per learner.`);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const desc = expenseForm.description.trim();
    const parsedAmount = parseFloat(expenseForm.amount);
    if (!desc) {
      toast.error('Please enter an expenditure description.');
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid expenditure amount above GH₵ 0.00.');
      return;
    }

    const cleanAmount = Math.round(parsedAmount * 100) / 100;
    const newItem = {
      id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      date: expenseForm.date || new Date().toISOString().slice(0, 10),
      description: desc,
      reference: expenseForm.reference.trim(),
      amount: cleanAmount,
      recordedBy: currentUser?.name || 'Basic 9 Teacher'
    };

    updateFinance((base) => ({
      ...base,
      expenses: [newItem, ...(base.expenses || [])]
    }));

    setExpenseForm((prev) => ({
      ...prev,
      description: '',
      reference: '',
      amount: ''
    }));
    toast.success(`Recorded expense: ${desc} (${formatCurrencyGhc(cleanAmount)})`);
  };

  const handleDeleteExpense = (expenseId) => {
    updateFinance((base) => ({
      ...base,
      expenses: (base.expenses || []).filter((item) => item.id !== expenseId)
    }));
    toast.success('Expenditure item removed.');
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      await exportBasic9ExpenditureExcel({
        students,
        financeData,
        schoolProfile
      });
      toast.success('Downloaded Basic_9_Expenditure_And_Returns.xlsx');
    } catch (err) {
      toast.error('Unable to export Excel workbook right now.');
    } finally {
      setExporting(false);
    }
  };

  const collectionRate = summary.totalExpected > 0
    ? Math.min(100, Math.round((summary.totalCollected / summary.totalExpected) * 1000) / 10)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Basic 9 Teacher Expenditure &amp; Fee Collections
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-slate-200 dark:border-zinc-800 bg-slate-50 text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                {summary.learnerRows.length} Learners
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Track learner payments against {formatCurrencyGhc(summary.targetFee)}, balances, class expenditure, and net returns.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!editingFee ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60">
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tabular-nums">
                Fee / Learner: <strong className="text-slate-900 dark:text-white">{formatCurrencyGhc(summary.targetFee)}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setFeeInput(String(summary.targetFee));
                  setEditingFee(true);
                }}
                className="p-1 rounded-lg hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400"
                title="Change expected fee per learner"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveTargetFee} className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.01"
                min="1"
                value={feeInput}
                onChange={(e) => setFeeInput(e.target.value)}
                className="w-28 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-slate-400"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-bold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
              {summary.targetFee !== BASIC9_DEFAULT_FEE && (
                <button
                  type="button"
                  onClick={handleResetDefaultFee}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1"
                  title="Reset to GH₵ 595.00"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> 595
                </button>
              )}
              <button
                type="button"
                onClick={() => setEditingFee(false)}
                className="px-2 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={handleToggleAutoSms}
            title="Automatically generate and send SMS receipt whenever a parent pays an amount"
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              autoSmsEnabled
                ? 'border-emerald-200 dark:border-emerald-800/70 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Auto-SMS: {autoSmsEnabled ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={handleOpenReminderModal}
            className="px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/30 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Send balance reminders ONLY to owing parents (cleared parents are excluded)"
          >
            <Send className="w-3.5 h-3.5" />
            Fee Reminders ({owingRows.length} Owing)
          </button>

          <button
            type="button"
            onClick={() => setReceiptModal({ open: true, mode: 'amount', financeKey: null })}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Receipt className="w-3.5 h-3.5" /> Amount Receipt
          </button>

          <button
            type="button"
            onClick={() => setReceiptModal({ open: true, mode: 'general', financeKey: null })}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5" /> General Receipts (4/Page)
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exporting}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-60 text-slate-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            {exporting ? 'Exporting...' : 'Export Excel'}
          </button>

          <button
            type="button"
            onClick={() => onPrintExpenditure && onPrintExpenditure()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-opacity"
          >
            <Printer className="w-3.5 h-3.5" /> Print A4 Ledger
          </button>
        </div>
      </div>

      {/* Latest Auto-Generated Payment SMS Receipt Banner */}
      {lastPaymentSms && (
        <div className="glass-card rounded-2xl p-4 border-l-4 border-l-emerald-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Payment SMS Generated ({lastPaymentSms.timestamp})
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  lastPaymentSms.sent
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                }`}
              >
                {lastPaymentSms.sent ? `Dispatched (${lastPaymentSms.mode})` : lastPaymentSms.error || 'Copy Ready'}
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                To: {lastPaymentSms.parentDisplay} ({lastPaymentSms.rawPhone || 'No phone'})
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-zinc-200 leading-relaxed">
              {lastPaymentSms.message}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(lastPaymentSms.message);
                toast.success('Payment SMS copied to clipboard.');
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
            <button
              type="button"
              onClick={() => setLastPaymentSms(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Consolidated Summary Columns Row (Minimalist Swiss Strip) */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-2.5 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/50 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
            Financial Summary Overview
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 tabular-nums">
            {collectionRate}% Collected &bull; {summary.clearedCount} Cleared &bull; {summary.partialCount} Partial &bull; {summary.unpaidCount} Unpaid
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                <th className="px-4 py-2.5 font-semibold">Fee / Learner</th>
                <th className="px-4 py-2.5 font-semibold">All Total Expected</th>
                <th className="px-4 py-2.5 font-semibold">All Total Amount Paid</th>
                <th className="px-4 py-2.5 font-semibold">Amount Left to Pay</th>
                <th className="px-4 py-2.5 font-semibold">Total Expenditure</th>
                <th className="px-4 py-2.5 font-semibold">Expenditure Returns (Net)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-base sm:text-lg font-black tabular-nums divide-x divide-slate-100 dark:divide-zinc-800/80">
                <td className="px-4 py-3.5 text-slate-800 dark:text-zinc-100">
                  {formatCurrencyGhc(summary.targetFee)}
                </td>
                <td className="px-4 py-3.5 text-slate-800 dark:text-zinc-100">
                  {formatCurrencyGhc(summary.totalExpected)}
                </td>
                <td className="px-4 py-3.5 text-slate-900 dark:text-white">
                  {formatCurrencyGhc(summary.totalCollected)}
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-zinc-300">
                  {formatCurrencyGhc(summary.totalLeftToPay)}
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-zinc-300">
                  {formatCurrencyGhc(summary.totalExpenditure)}
                </td>
                <td className={`px-4 py-3.5 ${
                  summary.expenditureReturns < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-900 dark:text-white'
                }`}>
                  {formatCurrencyGhc(summary.expenditureReturns)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Column Split: Learner Payments Ledger (Left) + Dedicated Expenditure & Returns Column (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: All Basic 9 Learner Names, Total Amount Paid & Amount Left to Pay */}
        <div className="xl:col-span-8 glass-card rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                Basic 9 Learners Payment Register
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Type an installment in <strong>Paying Now</strong> and click <strong>Okay</strong> to add it to Total Paid (against {formatCurrencyGhc(summary.targetFee)}).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search learner name..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-slate-800 dark:text-zinc-100 w-48 outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-slate-700 dark:text-zinc-200 outline-none"
              >
                <option value="All">All ({summary.learnerRows.length})</option>
                <option value="Cleared">Cleared ({summary.clearedCount})</option>
                <option value="Partial">Partial ({summary.partialCount})</option>
                <option value="Unpaid">Unpaid ({summary.unpaidCount})</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="gradebook-table w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-900/70 text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  <th className="text-center w-10 px-2 py-2.5 font-semibold">S/N</th>
                  <th className="w-24 px-2 py-2.5 font-semibold">Index No.</th>
                  <th className="px-2.5 py-2.5 font-semibold">Learner Name</th>
                  <th className="text-right w-28 px-2 py-2.5 font-semibold">Total Paid</th>
                  <th className="text-center w-40 px-2 py-2.5 font-semibold">Paying Now (+ Add)</th>
                  <th className="text-right w-28 px-2 py-2.5 font-semibold">Left to Pay</th>
                  <th className="text-center w-20 px-2 py-2.5 font-semibold">Status</th>
                  <th className="text-center w-28 px-2 py-2.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-500 dark:text-zinc-400">
                      {summary.learnerRows.length === 0
                        ? 'No Basic 9 learners enrolled yet. Add learners in the Students & Parents tab first.'
                        : 'No Basic 9 learners match your filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, idx) => {
                    const addDraft = paymentAddDrafts[row.financeKey] ?? '';
                    const isEditingTotal = editingTotalKey === row.financeKey;

                    return (
                      <tr
                        key={row.financeKey}
                        className="hover:bg-slate-50/90 dark:hover:bg-zinc-900/40 transition-colors"
                      >
                        <td className="text-center font-medium text-slate-400 dark:text-zinc-500 px-2 py-2 tabular-nums">
                          {row.sn || idx + 1}
                        </td>
                        <td className="font-mono text-[11px] text-slate-500 dark:text-zinc-400 px-2 py-2">
                          {row.indexNo || '-'}
                        </td>
                        <td className="font-semibold text-slate-900 dark:text-zinc-100 px-2.5 py-2">
                          {row.name}
                        </td>
                        <td className="text-right px-2 py-2 tabular-nums">
                          {isEditingTotal ? (
                            <div className="inline-flex items-center gap-1">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editingTotalValue}
                                onChange={(e) => setEditingTotalValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSaveEditedTotal(row);
                                  } else if (e.key === 'Escape') {
                                    setEditingTotalKey(null);
                                  }
                                }}
                                className="w-16 px-1.5 py-1 text-right rounded border border-slate-400 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-xs font-bold outline-none"
                                aria-label={`Edit total paid for ${row.name}`}
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEditedTotal(row)}
                                className="px-1.5 py-1 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold"
                                title="Save corrected total"
                              >
                                <Save className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-end gap-1">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {formatCurrencyGhc(row.amountPaid)}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTotalKey(row.financeKey);
                                  setEditingTotalValue(String(row.amountPaid));
                                }}
                                className="p-0.5 rounded text-slate-300 hover:text-slate-700 dark:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                title="Edit total paid manually"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="text-center px-2 py-2">
                          <div className="inline-flex items-center gap-1">
                            <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-1.5 py-1 focus-within:ring-1 focus-within:ring-slate-400">
                              <span className="text-[10px] font-semibold text-slate-400 mr-1">+</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={addDraft}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPaymentAddDrafts((prev) => ({
                                    ...prev,
                                    [row.financeKey]: val
                                  }));
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddLearnerPayment(row);
                                  }
                                }}
                                className="w-16 text-right bg-transparent text-xs font-semibold text-slate-900 dark:text-white outline-none tabular-nums"
                                aria-label={`New payment for ${row.name}`}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddLearnerPayment(row)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-slate-900 text-[11px] font-bold transition-colors shrink-0"
                            >
                              Okay
                            </button>
                          </div>
                        </td>
                        <td className="text-right font-semibold px-2 py-2 tabular-nums">
                          <span
                            className={
                              row.amountLeft > 0
                                ? 'text-slate-600 dark:text-zinc-300'
                                : 'text-slate-400 dark:text-zinc-500'
                            }
                          >
                            {formatCurrencyGhc(row.amountLeft)}
                          </span>
                          {row.overpaid > 0 && (
                            <span className="block text-[10px] font-medium text-slate-500 dark:text-zinc-400">
                              +{formatCurrencyGhc(row.overpaid)} extra
                            </span>
                          )}
                        </td>
                        <td className="text-center px-2 py-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              STATUS_BADGE_STYLES[row.status]
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT_STYLES[row.status]}`} />
                            {row.status}
                          </span>
                        </td>
                        <td className="text-center px-2 py-2">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setReceiptModal({ open: true, mode: 'amount', financeKey: row.financeKey })}
                              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                              title={`Create receipt for ${row.name}`}
                            >
                              <Receipt className="w-3 h-3" /> Receipt
                            </button>
                            {row.amountPaid < row.targetFee && (
                              <button
                                type="button"
                                onClick={() => handleQuickPayment(row, row.targetFee)}
                                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-[10px] font-semibold flex items-center gap-0.5 transition-colors"
                                title={`Mark full ${formatCurrencyGhc(row.targetFee)} paid`}
                              >
                                <CheckCircle2 className="w-3 h-3" /> Full
                              </button>
                            )}
                            {row.amountPaid > 0 && (
                              <button
                                type="button"
                                onClick={() => handleQuickPayment(row, 0)}
                                className="px-1.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 text-[10px] font-semibold transition-colors"
                                title="Clear learner payment to 0.00"
                              >
                                0
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 dark:bg-zinc-900/70 border-t border-slate-200 dark:border-zinc-800 font-black text-xs tabular-nums">
                  <td colSpan={3} className="px-3 py-3 text-right text-slate-800 dark:text-white uppercase">
                    All Basic 9 Learners Total ({summary.learnerRows.length})
                  </td>
                  <td className="px-2 py-3 text-right text-slate-900 dark:text-white">
                    {formatCurrencyGhc(summary.totalCollected)}
                  </td>
                  <td className="px-2 py-3 text-center text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                    Expected: {formatCurrencyGhc(summary.totalExpected)}
                  </td>
                  <td className="px-2 py-3 text-right text-slate-700 dark:text-zinc-300">
                    {formatCurrencyGhc(summary.totalLeftToPay)}
                  </td>
                  <td colSpan={2} className="px-2 py-3 text-center text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                    {collectionRate}% Collected
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right: Dedicated Expenditure & Expenditure Returns Column */}
        <div className="xl:col-span-4 space-y-5">
          {/* Expenditure Returns Formula Box */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
              <span>Expenditure &amp; Returns</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400">
                Live Balance
              </span>
            </h3>

            <div className="space-y-2 text-xs tabular-nums">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">All Total Amount Collected</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrencyGhc(summary.totalCollected)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">All Total Left to Pay</span>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                  {formatCurrencyGhc(summary.totalLeftToPay)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Total Expenditure ({summary.expenses.length} items)</span>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                  &minus; {formatCurrencyGhc(summary.totalExpenditure)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="block font-black text-slate-900 dark:text-white text-sm">
                    Expenditure Returns
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">Total Collected &minus; Total Expenditure</span>
                </div>
                <span
                  className={`text-lg font-black ${
                    summary.expenditureReturns < 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {formatCurrencyGhc(summary.expenditureReturns)}
                </span>
              </div>
            </div>

            {summary.expenditureReturns < 0 && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 flex items-start gap-2 text-[11px] text-slate-700 dark:text-zinc-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>Total expenditure currently exceeds cash collected by {formatCurrencyGhc(Math.abs(summary.expenditureReturns))}.</span>
              </div>
            )}
          </div>

          {/* Add Expenditure Form & Itemized Register */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Record Basic 9 Expenditure</h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Log BECE registration, mock printing, stationery, or class expenses.
              </p>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm((p) => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-slate-800 dark:text-zinc-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-300 mb-1">
                    Amount (GH&#8373;)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="e.g. 250.00"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm((p) => ({ ...p, amount: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-300 mb-1">
                  Expense Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mock Examination Printing & Stationery"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-slate-800 dark:text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-300 mb-1">
                  Receipt / Ref No. (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. RCP-0014"
                  value={expenseForm.reference}
                  onChange={(e) => setExpenseForm((p) => ({ ...p, reference: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-slate-800 dark:text-zinc-100 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Expenditure Entry
              </button>
            </form>

            {/* Recorded Expenses List */}
            <div className="pt-3 border-t border-slate-200/70 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                  Expenditure Register ({summary.expenses.length})
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">
                  {formatCurrencyGhc(summary.totalExpenditure)}
                </span>
              </div>

              {summary.expenses.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-zinc-400 text-center py-5 bg-slate-50 dark:bg-zinc-900/40 rounded-xl border border-slate-100 dark:border-zinc-800">
                  No expenditure recorded yet. Add your first expense above.
                </p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {summary.expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3 rounded-xl bg-slate-50/70 dark:bg-zinc-900/50 border border-slate-200/70 dark:border-zinc-800 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {exp.description}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">
                          {exp.date || '-'}
                          {exp.reference ? ` • Ref: ${exp.reference}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                          {formatCurrencyGhc(exp.amount)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Basic9ReceiptModal
        isOpen={receiptModal.open}
        initialMode={receiptModal.mode}
        initialFinanceKey={receiptModal.financeKey}
        summary={summary}
        paymentHistory={financeData?.paymentHistory || []}
        schoolProfile={schoolProfile}
        currentUser={currentUser}
        onClose={() => setReceiptModal((prev) => ({ ...prev, open: false }))}
        onPrintSingleReceipt={(receipt) => {
          setReceiptModal((prev) => ({ ...prev, open: false }));
          onPrintReceipt && onPrintReceipt(receipt);
        }}
        onPrintGeneralReceipts={(options) => {
          setReceiptModal((prev) => ({ ...prev, open: false }));
          onPrintGeneralReceipts && onPrintGeneralReceipts(options);
        }}
      />

      {reminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-amber-600" />
                  Send Fee Balance Reminders (Owing Parents Only)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Showing {owingRows.length} owing learner{owingRows.length === 1 ? '' : 's'}.{' '}
                  <strong className="text-emerald-700 dark:text-emerald-400">
                    {summary.clearedCount} cleared parent{summary.clearedCount === 1 ? '' : 's'}
                  </strong>{' '}
                  are automatically excluded and will not receive any message.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReminderModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Personalized Reminder Template
                  </label>
                  <button
                    type="button"
                    onClick={() => setReminderTemplate(DEFAULT_FEE_REMINDER_TEMPLATE)}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    Reset Default
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={reminderTemplate}
                  onChange={(e) => setReminderTemplate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {['{parent_name}', '{student_name}', '{amount_left}', '{amount_paid}', '{total_fee}', '{school_name}'].map((tok) => (
                    <button
                      key={tok}
                      type="button"
                      onClick={() => setReminderTemplate((p) => `${p} ${tok}`)}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-emerald-100 text-[10px] font-mono font-semibold text-slate-600 dark:text-zinc-300"
                    >
                      +{tok}
                    </button>
                  ))}
                </div>
              </div>

              {owingRows.length > 0 && (() => {
                const previewRow = owingRows.find((r) => r.financeKey === reminderPreviewKey) || owingRows[0];
                const sampleText = interpolateSmsTemplate(reminderTemplate, {
                  parentName: previewRow.parentName,
                  studentName: previewRow.name,
                  className: 'Basic 9',
                  amountPaid: previewRow.amountPaid,
                  amountLeft: previewRow.amountLeft,
                  targetFee: previewRow.targetFee,
                  schoolName: schoolProfile?.schoolName
                });
                return (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                        Live Parent Preview ({sampleText.length} chars)
                      </span>
                      <select
                        value={previewRow.financeKey}
                        onChange={(e) => setReminderPreviewKey(e.target.value)}
                        className="text-[11px] font-bold bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800 rounded-lg px-2 py-1 outline-none"
                      >
                        {owingRows.map((r) => (
                          <option key={r.financeKey} value={r.financeKey}>
                            {formatSmsName(r.parentName || 'Parent')} — {formatSmsName(r.name)} (Left: {formatSmsCurrency(r.amountLeft)})
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-zinc-200 font-medium leading-relaxed">
                      {sampleText}
                    </p>
                  </div>
                );
              })()}

              <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-3.5 py-2 bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs font-bold">
                  <span>
                    Owing Recipients Selected ({selectedOwingKeys.length}/{owingRows.length})
                  </span>
                  <div className="flex gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSelectedOwingKeys(owingRows.map((r) => r.financeKey))}
                      className="text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      Select All Owing
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOwingKeys([])}
                      className="text-slate-500 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-zinc-800 max-h-56 overflow-y-auto">
                  {owingRows.map((row) => {
                    const checked = selectedOwingKeys.includes(row.financeKey);
                    return (
                      <div
                        key={row.financeKey}
                        onClick={() => handleToggleOwingKey(row.financeKey)}
                        className={`px-3.5 py-2 flex items-center justify-between gap-3 cursor-pointer text-xs ${
                          checked ? 'bg-amber-50/40 dark:bg-amber-950/20' : 'hover:bg-slate-50 dark:hover:bg-zinc-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {checked ? (
                            <CheckSquare className="w-4 h-4 text-amber-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <div className="truncate">
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {formatSmsName(row.parentName || 'Parent/Guardian')}{' '}
                              <span className="font-normal text-slate-500 dark:text-zinc-400">
                                • {formatSmsName(row.name)}
                              </span>
                            </p>
                            <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                              {row.parentPhone || 'No phone on file'}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 shrink-0 tabular-nums">
                          Left: {formatCurrencyGhc(row.amountLeft)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 bg-slate-50/60 dark:bg-zinc-900/40">
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                Gateway:{' '}
                <strong>
                  {gatewayConfig?.provider === 'simulation'
                    ? 'Simulation Mode'
                    : `${String(gatewayConfig?.provider || 'mnotify').toUpperCase()} • ${normalizeSmsSenderId(gatewayConfig?.senderId)}`}
                </strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReminderModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={sendingReminders || selectedOwingKeys.length === 0}
                  onClick={handleSendOwingReminders}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sendingReminders
                    ? 'Sending...'
                    : `Send Reminders to ${selectedOwingKeys.length} Owing Parent${selectedOwingKeys.length === 1 ? '' : 's'}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
