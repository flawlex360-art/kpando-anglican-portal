import { JHS_SUBJECTS } from '../constants/schoolConstants.js';

/**
 * Generates ordinal suffixes for ranks (e.g. 1 -> 1st, 2 -> 2nd, 3 -> 3rd, 4 -> 4th).
 */
export function getOrdinalSuffix(rank) {
  if (!rank) return '';
  const r = parseInt(rank, 10);
  if (isNaN(r)) return rank;
  if (r % 100 >= 11 && r % 100 <= 13) {
    return `${r}th`;
  }
  const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[r % 10] || 'th';
  return `${r}${suffix}`;
}

/**
 * Standard 9-point Ghanaian BECE / Mock grading scale based on 100% Mock Score.
 * Returns numeric grade (1-9) and official descriptor remark.
 */
export function calculateGrade(score) {
  const t = parseFloat(score) || 0;
  if (t >= 90) return { grade: "1", numericGrade: 1, remark: "Highest" };
  if (t >= 80) return { grade: "2", numericGrade: 2, remark: "Higher" };
  if (t >= 70) return { grade: "3", numericGrade: 3, remark: "High" };
  if (t >= 60) return { grade: "4", numericGrade: 4, remark: "High Average" };
  if (t >= 55) return { grade: "5", numericGrade: 5, remark: "Average" };
  if (t >= 50) return { grade: "6", numericGrade: 6, remark: "Low Average" };
  if (t >= 40) return { grade: "7", numericGrade: 7, remark: "Low" };
  if (t >= 35) return { grade: "8", numericGrade: 8, remark: "Lower" };
  return { grade: "9", numericGrade: 9, remark: "Lowest" };
}

/**
 * Computes BECE Aggregate (Best 6 subjects: 4 Core + Best 2 Electives).
 * Lower aggregate is better (6 = Distinction, 54 = Worst).
 */
export function calculateStudentAggregate(studentSubjectsMap, subjects = JHS_SUBJECTS) {
  const coreSubjects = subjects.filter(s => s.isCore);
  const electiveSubjects = subjects.filter(s => !s.isCore);

  let coreSum = 0;
  coreSubjects.forEach(sub => {
    const entry = studentSubjectsMap[sub.key];
    coreSum += entry ? entry.numericGrade : 9;
  });

  // Rank electives by lowest numeric grade first, then highest raw score for tie-breaking
  const scoredElectives = electiveSubjects.map(sub => {
    const entry = studentSubjectsMap[sub.key];
    return {
      key: sub.key,
      name: sub.name,
      numericGrade: entry ? entry.numericGrade : 9,
      score: entry ? entry.score : 0
    };
  }).sort((a, b) => {
    if (a.numericGrade !== b.numericGrade) {
      return a.numericGrade - b.numericGrade;
    }
    return b.score - a.score;
  });

  const bestTwoElectives = scoredElectives.slice(0, 2);
  const bestElectivesSum = bestTwoElectives.reduce((sum, item) => sum + item.numericGrade, 0);
  const aggregate = coreSum + bestElectivesSum;

  let division = "Needs Intervention";
  if (aggregate <= 10) division = "Distinction (Cat. A)";
  else if (aggregate <= 15) division = "High Merit";
  else if (aggregate <= 24) division = "Credit Pass";
  else if (aggregate <= 30) division = "Pass";

  return {
    aggregate,
    coreSum,
    bestElectivesSum,
    bestElectiveKeys: bestTwoElectives.map(e => e.key),
    division
  };
}

/**
 * Computes 100% Mock Examination scores, 1-9 grades, subject ranks,
 * BECE 6-subject Aggregates, and class ranks sorted from Best (1st) to Worst (Nth).
 *
 * @param {Array} students - Roster of learners
 * @param {Object} classMockGrades - Map of { [studentSn]: { [subjectKey]: score } }
 * @param {Array} subjects - Subject descriptors
 * @param {'aggregate'|'total'} sortMode - Primary ranking criterion
 */
export function computeMockClassResults(students, classMockGrades = {}, subjects = JHS_SUBJECTS, sortMode = 'aggregate') {
  if (!students || students.length === 0) return [];

  // 1. Initialize per-student result shells
  const studentMap = {};
  students.forEach(s => {
    studentMap[s.sn] = {
      ...s,
      subjects: {},
      overallTotal: 0,
      average: 0,
      aggregate: 54,
      coreSum: 36,
      bestElectivesSum: 18,
      bestElectiveKeys: [],
      division: "Needs Intervention",
      overallRankNum: 1,
      overallRank: "1st"
    };
  });

  // 2. Compute subject scores, grades, and per-subject dense ranks
  subjects.forEach(sub => {
    const entries = students.map(s => {
      const rawVal = classMockGrades?.[s.sn]?.[sub.key];
      const score = rawVal !== undefined && rawVal !== '' && rawVal !== null
        ? Math.min(100, Math.max(0, parseFloat(rawVal) || 0))
        : 0;
      const { grade, numericGrade, remark } = calculateGrade(score);
      return {
        sn: s.sn,
        score,
        grade,
        numericGrade,
        remark
      };
    });

    const sortedSub = [...entries].sort((a, b) => b.score - a.score);
    const subRanks = {};
    sortedSub.forEach((item, idx) => {
      if (idx > 0 && Math.round(item.score * 100) === Math.round(sortedSub[idx - 1].score * 100)) {
        subRanks[item.sn] = subRanks[sortedSub[idx - 1].sn];
      } else {
        subRanks[item.sn] = idx + 1;
      }
    });

    entries.forEach(item => {
      studentMap[item.sn].subjects[sub.key] = {
        score: Math.round(item.score * 10) / 10,
        grade: item.grade,
        numericGrade: item.numericGrade,
        remark: item.remark,
        rankNum: subRanks[item.sn],
        rank: getOrdinalSuffix(subRanks[item.sn]),
        isCore: sub.isCore
      };
      studentMap[item.sn].overallTotal += item.score;
    });
  });

  // 3. Compute overall averages and BECE Aggregate for every student
  const subjectCount = subjects.length || 9;
  const results = Object.values(studentMap).map(student => {
    const aggInfo = calculateStudentAggregate(student.subjects, subjects);
    const roundedTotal = Math.round(student.overallTotal * 10) / 10;
    return {
      ...student,
      overallTotal: roundedTotal,
      average: Math.round((roundedTotal / subjectCount) * 10) / 10,
      aggregate: aggInfo.aggregate,
      coreSum: aggInfo.coreSum,
      bestElectivesSum: aggInfo.bestElectivesSum,
      bestElectiveKeys: aggInfo.bestElectiveKeys,
      division: aggInfo.division
    };
  });

  // 4. Sort Best to Worst based on sortMode ('aggregate' or 'total')
  results.sort((a, b) => {
    if (sortMode === 'total') {
      if (b.overallTotal !== a.overallTotal) return b.overallTotal - a.overallTotal;
      if (a.aggregate !== b.aggregate) return a.aggregate - b.aggregate;
      return a.name.localeCompare(b.name);
    }
    // Primary: Lowest Aggregate is best; Tie-breaker: Highest Overall Total Score
    if (a.aggregate !== b.aggregate) return a.aggregate - b.aggregate;
    if (b.overallTotal !== a.overallTotal) return b.overallTotal - a.overallTotal;
    return a.name.localeCompare(b.name);
  });

  // 5. Assign dense ranks (1st to Nth)
  results.forEach((student, idx) => {
    if (idx > 0) {
      const prev = results[idx - 1];
      const isTie = sortMode === 'total'
        ? (student.overallTotal === prev.overallTotal && student.aggregate === prev.aggregate)
        : (student.aggregate === prev.aggregate && student.overallTotal === prev.overallTotal);
      student.overallRankNum = isTie ? prev.overallRankNum : idx + 1;
    } else {
      student.overallRankNum = 1;
    }
    student.overallRank = getOrdinalSuffix(student.overallRankNum);
  });

  return results;
}

/**
 * Generates parent academic & BECE readiness advisory note for Mock Report Cards.
 */
export function generateMockAdvisory(studentName, aggregate, mathScore, scienceScore, englishScore) {
  const firstName = (studentName || 'Learner').trim().split(/\s+/)[0];
  const m = parseFloat(mathScore) || 0;
  const s = parseFloat(scienceScore) || 0;
  const e = parseFloat(englishScore) || 0;

  if (aggregate <= 10) {
    return `BECE Distinction Readiness: ${firstName} achieved an outstanding Aggregate ${aggregate} (Maths: ${m}%, Science: ${s}%, English: ${e}%). Continue solving timed BECE past questions to maintain Category A senior high school competitiveness.`;
  }
  if (aggregate <= 18) {
    return `Strong Progress (Aggregate ${aggregate}): ${firstName} is performing well across the core subjects. Focused practice on weaker elective topics and objective speed drills can push this aggregate into single digits.`;
  }
  if (m < 50 || s < 50 || e < 50) {
    const weak = [
      e < 50 ? `English (${e}%)` : null,
      m < 50 ? `Mathematics (${m}%)` : null,
      s < 50 ? `Science (${s}%)` : null
    ].filter(Boolean).join(', ');
    return `Core Subject Alert (Aggregate ${aggregate}): ${firstName} requires targeted support in ${weak}. Parents are kindly advised to supervise 45 minutes of daily revision using BECE past papers and attend the scheduled weekend remedial clinic.`;
  }
  return `${firstName} achieved Aggregate ${aggregate} in this mock series. Consistent evening study, essay practice, and completing all take-home assignments will significantly boost their final BECE grade.`;
}

export const BASIC9_DEFAULT_FEE = 595;

export function getLearnerFinanceKey(student) {
  return String(student?.indexNo || student?.name || `sn-${student?.sn || ''}`).trim();
}

export function formatCurrencyGhc(value) {
  const num = Number(value) || 0;
  return `GH₵ ${num.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Computes Basic 9 learner collections against target fee (GHC 595.00),
 * amount left to pay per learner, total collected, total expenditure, and expenditure returns.
 */
export function computeBasic9FinanceSummary(students = [], financeData = {}) {
  const rawFee = Number(financeData?.feePerLearner);
  const targetFee = Number.isFinite(rawFee) && rawFee >= 0 ? Math.round(rawFee * 100) / 100 : BASIC9_DEFAULT_FEE;
  const paymentsByLearner = financeData?.paymentsByLearner || {};
  const expenses = Array.isArray(financeData?.expenses) ? financeData.expenses : [];

  const learnerRows = students.map((student) => {
    const key = getLearnerFinanceKey(student);
    const paidRaw = paymentsByLearner[key] ?? paymentsByLearner[student.name] ?? 0;
    const amountPaid = Math.max(0, Math.round((parseFloat(paidRaw) || 0) * 100) / 100);
    const amountLeft = Math.max(0, Math.round((targetFee - amountPaid) * 100) / 100);
    const overpaid = amountPaid > targetFee ? Math.round((amountPaid - targetFee) * 100) / 100 : 0;

    let status = 'Unpaid';
    if (amountPaid >= targetFee) status = 'Cleared';
    else if (amountPaid > 0) status = 'Partial';

    return {
      ...student,
      financeKey: key,
      targetFee,
      amountPaid,
      amountLeft,
      overpaid,
      status
    };
  });

  const totalExpected = Math.round(learnerRows.length * targetFee * 100) / 100;
  const totalCollected = Math.round(learnerRows.reduce((sum, r) => sum + r.amountPaid, 0) * 100) / 100;
  const totalLeftToPay = Math.round(learnerRows.reduce((sum, r) => sum + r.amountLeft, 0) * 100) / 100;
  const totalExpenditure = Math.round(
    expenses.reduce((sum, e) => sum + Math.max(0, parseFloat(e?.amount) || 0), 0) * 100
  ) / 100;
  const expenditureReturns = Math.round((totalCollected - totalExpenditure) * 100) / 100;

  return {
    targetFee,
    learnerRows,
    expenses,
    totalExpected,
    totalCollected,
    totalLeftToPay,
    totalExpenditure,
    expenditureReturns,
    clearedCount: learnerRows.filter((r) => r.status === 'Cleared').length,
    partialCount: learnerRows.filter((r) => r.status === 'Partial').length,
    unpaidCount: learnerRows.filter((r) => r.status === 'Unpaid').length
  };
}

/**
 * Normalizes YYYY-MM-DD, DD/MM/YYYY, or DD-MM-YYYY date strings to valid ISO YYYY-MM-DD.
 */
export function normalizeDobIso(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  let year;
  let month;
  let day;

  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const dmyMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);

  if (isoMatch) {
    year = parseInt(isoMatch[1], 10);
    month = parseInt(isoMatch[2], 10);
    day = parseInt(isoMatch[3], 10);
  } else if (dmyMatch) {
    day = parseInt(dmyMatch[1], 10);
    month = parseInt(dmyMatch[2], 10);
    year = parseInt(dmyMatch[3], 10);
  } else {
    return '';
  }

  if (year < 1980 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
    return '';
  }

  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() + 1 !== month ||
    probe.getUTCDate() !== day
  ) {
    return '';
  }

  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Calculates age in completed years from an ISO/DMY Date of Birth string.
 */
export function calculateAgeFromDob(dobStr, referenceDate = new Date()) {
  const iso = normalizeDobIso(dobStr);
  if (!iso) return null;

  const [y, m, d] = iso.split('-').map(Number);
  const refY = referenceDate.getFullYear();
  const refM = referenceDate.getMonth() + 1;
  const refD = referenceDate.getDate();

  let age = refY - y;
  if (refM < m || (refM === m && refD < d)) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

/**
 * Formats an ISO Date of Birth cleanly (e.g. '14 May 2011') without local timezone drift.
 */
export function formatDobDisplay(dobStr) {
  const iso = normalizeDobIso(dobStr);
  if (!iso) return '-';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

/**
 * Returns learner age from DOB when valid, falling back to a manually entered numeric age.
 */
export function resolveLearnerAge(student, referenceDate = new Date()) {
  const fromDob = calculateAgeFromDob(student?.dob, referenceDate);
  if (fromDob !== null) return fromDob;

  const manual = parseInt(String(student?.age ?? '').trim(), 10);
  return Number.isFinite(manual) && manual > 0 && manual <= 99 ? manual : null;
}
