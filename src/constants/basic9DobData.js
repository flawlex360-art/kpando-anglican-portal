import { calculateAgeFromDob, normalizeDobIso } from '../utils/calculations.js';

/**
 * Verified Basic 9 Dates of Birth cross-matched by normalized learner full name
 * from the enrolled WAEC CASS records.
 */
export const BASIC9_VERIFIED_DOB_BY_NAME = {
  'ABOAGYE BEATRICE': '2012-04-21',
  'AGBLEY ROLAND': '2012-10-13',
  'AGLAGO EMEFA': '2011-05-28',
  'AHLIDZI STEPHANIE BELINDA': '2013-04-10',
  'AKORLI FAMOUS': '2011-05-11',
  'AKOTO STEPHEN': '2009-02-16',
  'AKWENSI GIFTY': '2012-01-29',
  'ANCHUI SEDEM': '2010-09-30',
  'ANYALAH RUTH': '2011-05-28',
  'ATCHOR STELLA': '2011-09-14',
  'AVORNYO COLLINS': '2012-05-23',
  'BAKUTSE JOSEPHINE': '2012-04-18',
  'BOATSI BRIGHT JUNIOR': '2012-09-26',
  'BUNJO DEBORAH': '2012-01-14',
  'DAYI EMMANUEL': '2010-08-25',
  'DEWU CLIFFORD': '2012-10-16',
  'DZORKA MATILDA THEODOSIA': '2010-07-28',
  'DZUBEY YVONNE': '2011-07-08',
  'GAGODO CHRISTABEL': '2012-08-22',
  'GBEDEBU WELLMER': '2010-05-26',
  'GBEKLE NICE': '2011-12-01',
  'GODZOKUMAH ONORY': '2009-02-10',
  'HOGUINA DERICK': '2011-10-12',
  'HOMENYA PATIENCE': '2011-11-28',
  'KOMLAGAH SARITA': '2010-12-23',
  'KUDZO LAMINE': '2011-01-01',
  'LANYO ELIKEM': '2010-03-05',
  'MIKORDA ESTHER': '2008-02-05',
  'NKWA ELIZABETH': '2010-09-07',
  'NTIDO EMMANUELLA': '2009-12-28',
  'PARKU LOUISA': '2010-04-29',
  'PARKU STEPHANIE': '2012-12-04',
  'SEIDU KOJO': '2008-04-08',
  'TETTEH SOPHIA': '2011-07-20',
  'WORMADEY OSMOND': '2011-01-03'
};

export function normalizeLearnerNameKey(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').toUpperCase();
}

/**
 * Populates missing DOB and computed Age values on existing Basic 9 learners
 * matched strictly by normalized full name, preserving all other fields.
 */
export function applyVerifiedBasic9Dobs(studentsByClass) {
  const basic9List = studentsByClass?.['Basic 9'];
  if (!Array.isArray(basic9List) || basic9List.length === 0) {
    return { studentsByClass, updatedCount: 0 };
  }

  let updatedCount = 0;
  const updatedBasic9 = basic9List.map((student) => {
    const key = normalizeLearnerNameKey(student?.name);
    const verifiedDob = BASIC9_VERIFIED_DOB_BY_NAME[key];
    if (!verifiedDob) return student;

    const existingDob = normalizeDobIso(student?.dob);
    const finalDob = existingDob || verifiedDob;
    const computedAge = calculateAgeFromDob(finalDob);
    const finalAge = computedAge !== null ? computedAge : (student?.age ?? '');

    if (student?.dob !== finalDob || student?.age !== finalAge) {
      updatedCount += 1;
      return {
        ...student,
        dob: finalDob,
        age: finalAge
      };
    }
    return student;
  });

  if (updatedCount === 0) {
    return { studentsByClass, updatedCount: 0 };
  }

  return {
    studentsByClass: {
      ...studentsByClass,
      'Basic 9': updatedBasic9
    },
    updatedCount
  };
}
