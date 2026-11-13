import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { JHS_SUBJECTS } from '../constants/schoolConstants.js';
import { computeBasic9FinanceSummary } from './calculations.js';

/**
 * Exports the ranked Mock Examination Master Broadsheet to a formatted .xlsx workbook.
 */
export async function exportMockBroadsheetExcel({
  rankedResults,
  schoolProfile,
  className,
  mockSeries,
  subjects = JHS_SUBJECTS
}) {
  if (!rankedResults || rankedResults.length === 0) {
    throw new Error('No student results available to export.');
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = schoolProfile?.schoolName || 'Kpando Anglican Basic School';
  workbook.created = new Date();

  const sheetName = `${className} ${mockSeries}`.replace(/[:\\/?*[\]]/g, '').slice(0, 31);
  const sheet = workbook.addWorksheet(sheetName, {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
  });

  const totalCols = 5 + subjects.length + 2; // Pos, Index, Name, Sex, [Subjects], Total, Agg, Division

  // Title Header
  sheet.mergeCells(1, 1, 1, totalCols);
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = (schoolProfile?.schoolName || 'KPANDO ANGLICAN BASIC SCHOOL').toUpperCase();
  titleCell.font = { name: 'Calibri', size: 15, bold: true, color: { argb: 'FF003B36' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.mergeCells(2, 1, 2, totalCols);
  const subTitleCell = sheet.getCell(2, 1);
  subTitleCell.value = `${className.toUpperCase()} — ${mockSeries.toUpperCase()} ANALYSIS & AGGREGATE BROADSHEET (${schoolProfile?.academicYear || '2025/2026'})`;
  subTitleCell.font = { name: 'Calibri', size: 11, bold: true };
  subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.addRow([]);

  // Table Headers
  const headers = [
    'Pos',
    'Index No.',
    'Candidate Name',
    'Sex',
    ...subjects.map(s => `${s.short} (100)`),
    `Total (${subjects.length * 100})`,
    'Agg (Best 6)',
    'Standing'
  ];

  const headerRow = sheet.addRow(headers);
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003B36' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' }
    };
  });

  // Data Rows (Best to Worst)
  rankedResults.forEach((student) => {
    const rowValues = [
      student.overallRank,
      student.indexNo || '-',
      student.name,
      student.gender || '-',
      ...subjects.map(sub => {
        const subRes = student.subjects[sub.key];
        return subRes ? `${subRes.score} (${subRes.grade})` : '0 (9)';
      }),
      student.overallTotal,
      student.aggregate,
      student.division
    ];

    const row = sheet.addRow(rowValues);
    row.height = 20;
    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Calibri', size: 10, bold: colNumber === 1 || colNumber === headers.length - 1 };
      cell.alignment = {
        horizontal: colNumber === 3 || colNumber === headers.length ? 'left' : 'center',
        vertical: 'middle'
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD4D4D8' } },
        left: { style: 'thin', color: { argb: 'FFD4D4D8' } },
        bottom: { style: 'thin', color: { argb: 'FFD4D4D8' } },
        right: { style: 'thin', color: { argb: 'FFD4D4D8' } }
      };
    });
  });

  // Column Widths
  sheet.getColumn(1).width = 7;
  sheet.getColumn(2).width = 14;
  sheet.getColumn(3).width = 28;
  sheet.getColumn(4).width = 6;
  for (let i = 5; i < 5 + subjects.length; i++) {
    sheet.getColumn(i).width = 11;
  }
  sheet.getColumn(5 + subjects.length).width = 13;
  sheet.getColumn(6 + subjects.length).width = 13;
  sheet.getColumn(7 + subjects.length).width = 20;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const fileName = `${className.replace(/\s+/g, '_')}_${mockSeries.replace(/\s+/g, '_')}_Broadsheet.xlsx`;
  saveAs(blob, fileName);
}

/**
 * Exports Basic 9 Learner Fee Collections, Expenditure & Returns to a formatted .xlsx workbook.
 */
export async function exportBasic9ExpenditureExcel({ students, financeData, schoolProfile }) {
  const summary = computeBasic9FinanceSummary(students, financeData);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = schoolProfile?.schoolName || 'Kpando Anglican Basic School';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Basic 9 Expenditure', {
    pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
  });

  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FFD4D4D8' } },
    left: { style: 'thin', color: { argb: 'FFD4D4D8' } },
    bottom: { style: 'thin', color: { argb: 'FFD4D4D8' } },
    right: { style: 'thin', color: { argb: 'FFD4D4D8' } }
  };

  const styleHeaderRow = (row, bgHex = 'FF003B36') => {
    row.height = 22;
    row.eachCell((cell) => {
      cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgHex } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = thinBorder;
    });
  };

  sheet.mergeCells(1, 1, 1, 7);
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = (schoolProfile?.schoolName || 'KPANDO ANGLICAN BASIC SCHOOL').toUpperCase();
  titleCell.font = { name: 'Calibri', size: 15, bold: true, color: { argb: 'FF003B36' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.mergeCells(2, 1, 2, 7);
  const subCell = sheet.getCell(2, 1);
  subCell.value = `BASIC 9 LEARNER COLLECTIONS, EXPENDITURE & RETURNS LEDGER (${schoolProfile?.academicYear || '2025/2026'})`;
  subCell.font = { name: 'Calibri', size: 11, bold: true };
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.addRow([]);

  // Summary Ledger Columns Row
  const summaryHeaders = sheet.addRow([
    'Fee / Learner (GHC)',
    'Expected Total (GHC)',
    'Total Amount Collected (GHC)',
    'Amount Left to Pay (GHC)',
    'Total Expenditure (GHC)',
    'Expenditure Returns (GHC)',
    'Learners Count'
  ]);
  styleHeaderRow(summaryHeaders, 'FF065F46');

  const summaryValues = sheet.addRow([
    summary.targetFee,
    summary.totalExpected,
    summary.totalCollected,
    summary.totalLeftToPay,
    summary.totalExpenditure,
    summary.expenditureReturns,
    summary.learnerRows.length
  ]);
  summaryValues.height = 22;
  summaryValues.eachCell((cell, colIdx) => {
    cell.font = { name: 'Calibri', size: 10, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = thinBorder;
    if (colIdx <= 6) cell.numFmt = '#,##0.00';
  });

  sheet.addRow([]);

  // Learner Payments Section
  const learnerHeaders = sheet.addRow([
    'S/N',
    'Index No.',
    'Learner Name',
    'Total Amount Paid (GHC)',
    'Amount Left to Pay (GHC)',
    'Status'
  ]);
  styleHeaderRow(learnerHeaders);

  summary.learnerRows.forEach((rowItem, idx) => {
    const r = sheet.addRow([
      idx + 1,
      rowItem.indexNo || '-',
      rowItem.name,
      rowItem.amountPaid,
      rowItem.amountLeft,
      rowItem.status
    ]);
    r.height = 19;
    r.eachCell((cell, colIdx) => {
      cell.font = { name: 'Calibri', size: 10, bold: colIdx === 5 && rowItem.amountLeft > 0 };
      cell.alignment = { horizontal: colIdx === 3 ? 'left' : 'center', vertical: 'middle' };
      cell.border = thinBorder;
      if (colIdx >= 4 && colIdx <= 5) cell.numFmt = '#,##0.00';
    });
  });

  const learnerTotalRow = sheet.addRow([
    '',
    '',
    'TOTAL LEARNER COLLECTIONS',
    summary.totalCollected,
    summary.totalLeftToPay,
    `${summary.clearedCount}/${summary.learnerRows.length} Cleared`
  ]);
  learnerTotalRow.height = 21;
  learnerTotalRow.eachCell((cell, colIdx) => {
    cell.font = { name: 'Calibri', size: 10, bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
    cell.alignment = { horizontal: colIdx === 3 ? 'left' : 'center', vertical: 'middle' };
    cell.border = thinBorder;
    if (colIdx >= 4 && colIdx <= 5) cell.numFmt = '#,##0.00';
  });

  sheet.addRow([]);

  // Expenditure Breakdown Section
  const expHeaders = sheet.addRow([
    '#',
    'Date',
    'Expenditure Description',
    'Receipt / Ref',
    'Expenditure Amount (GHC)',
    'Running Total Collected (GHC)',
    'Expenditure Returns (GHC)'
  ]);
  styleHeaderRow(expHeaders, 'FF1E293B');

  if (summary.expenses.length === 0) {
    const emptyRow = sheet.addRow([1, '-', 'No expenditure items recorded yet', '-', 0, summary.totalCollected, summary.expenditureReturns]);
    emptyRow.eachCell((cell, colIdx) => {
      cell.border = thinBorder;
      cell.alignment = { horizontal: colIdx === 3 ? 'left' : 'center', vertical: 'middle' };
      if (colIdx >= 5) cell.numFmt = '#,##0.00';
    });
  } else {
    let runningSpent = 0;
    summary.expenses.forEach((exp, idx) => {
      const amt = Math.max(0, parseFloat(exp.amount) || 0);
      runningSpent = Math.round((runningSpent + amt) * 100) / 100;
      const retAfter = Math.round((summary.totalCollected - runningSpent) * 100) / 100;
      const r = sheet.addRow([
        idx + 1,
        exp.date || '-',
        exp.description || 'Expense Item',
        exp.reference || '-',
        amt,
        summary.totalCollected,
        retAfter
      ]);
      r.eachCell((cell, colIdx) => {
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { horizontal: colIdx === 3 ? 'left' : 'center', vertical: 'middle' };
        cell.border = thinBorder;
        if (colIdx >= 5) cell.numFmt = '#,##0.00';
      });
    });
  }

  const expTotalRow = sheet.addRow([
    '',
    '',
    'TOTAL EXPENDITURE & NET RETURNS',
    '',
    summary.totalExpenditure,
    summary.totalCollected,
    summary.expenditureReturns
  ]);
  expTotalRow.height = 22;
  expTotalRow.eachCell((cell, colIdx) => {
    cell.font = { name: 'Calibri', size: 10, bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
    cell.alignment = { horizontal: colIdx === 3 ? 'left' : 'center', vertical: 'middle' };
    cell.border = thinBorder;
    if (colIdx >= 5) cell.numFmt = '#,##0.00';
  });

  sheet.getColumn(1).width = 16;
  sheet.getColumn(2).width = 18;
  sheet.getColumn(3).width = 32;
  sheet.getColumn(4).width = 20;
  sheet.getColumn(5).width = 22;
  sheet.getColumn(6).width = 24;
  sheet.getColumn(7).width = 24;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob, `Basic_9_Expenditure_And_Returns.xlsx`);
}
