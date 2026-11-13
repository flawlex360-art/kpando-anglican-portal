import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { JHS_SUBJECTS } from '../constants/schoolConstants.js';

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
