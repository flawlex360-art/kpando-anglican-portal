export const JHS_CLASSES = ["Basic 9", "Basic 8", "Basic 7"];

export const MOCK_SERIES = [
  "Mock 1",
  "Mock 2",
  "Mock 3",
  "Final Pre-BECE Mock"
];

export const JHS_SUBJECTS = [
  { name: "English Language", key: "ENG", short: "ENG", isCore: true },
  { name: "Mathematics", key: "MATHS", short: "MATH", isCore: true },
  { name: "Science", key: "SCI", short: "SCI", isCore: true },
  { name: "Social Studies", key: "SOC", short: "SOC", isCore: true },
  { name: "Career Technology", key: "C.TECH", short: "C.TEC", isCore: false },
  { name: "Computing", key: "COMP", short: "COMP", isCore: false },
  { name: "Religious and Moral Education", key: "RME", short: "RME", isCore: false },
  { name: "Ghanaian Language", key: "GH.LANG", short: "GH.L", isCore: false },
  { name: "Creative Arts & Design", key: "C.ARTS", short: "C.ART", isCore: false }
];

export const DEFAULT_CONDUCT = [
  "Good social skills",
  "Always attentive in class",
  "Exhibits good teamwork",
  "Always in class on time",
  "Asks questions in class",
  "Displays self-discipline",
  "Completes assignments in the time allotted",
  "Reads extensively for enjoyment",
  "Welcomes leadership roles in groups",
  "Exhibits a positive outlook and attitude",
  "Responds appropriately when corrected",
  "Needs close supervision during prep"
];

export const DEFAULT_INTEREST = [
  "Reading books",
  "Operating computer",
  "Mathematics & Logic puzzles",
  "Science experiments",
  "Sports activities",
  "Debating & Public speaking",
  "Drawing & Design",
  "Music & Cultural drama",
  "Writing essays"
];

export const DEFAULT_REMARKS = [
  "Excellent mock performance; keep pushing for Aggregate 6.",
  "Very good result; sustain this momentum for BECE.",
  "Good effort; intensify revision in weaker core areas.",
  "Fair performance; more practice with past BECE questions needed.",
  "Needs urgent extra tuition and daily supervised study at home.",
  "Steady improvement across mock series; well done.",
  "Capable of much better results with stronger focus.",
  "Performance is encouraging; work on time management in exams."
];

export const INITIAL_SCHOOL_PROFILE = {
  schoolName: "Kpando Anglican Basic School",
  motto: "Pro Deo et Patria — Knowledge, Discipline & Excellence",
  district: "Kpando Municipal Education Directorate",
  region: "Volta Region, Ghana",
  address: "P.O. Box 142, Kpando — Volta Region",
  phone: "0246951331",
  email: "info@kpandoanglican.edu.gh",
  academicYear: "2025/2026",
  headmasterName: "Mr. Emmanuel K. Adjei",
  basic9TeacherName: "Mr. Godwin Mensah",
  reopeningDate: "2026-01-12",
  examDate: "2026-11-10",
  timesOpen: 65,
  ptaMeeting: {
    title: "Term 1 General PTA & Basic 9 BECE Mock Review Meeting",
    date: "2026-11-28",
    time: "9:00 AM Prompt",
    venue: "School Assembly Hall",
    agenda: "Review of Basic 9 Mock 1 & 2 performance, BECE registration modalities, and remedial study timetable."
  },
  announcements: [
    {
      id: "ann-1",
      title: "Upcoming General PTA & Basic 9 Mock Review",
      date: "Nov 28, 2026",
      category: "PTA Notice",
      summary: "All parents and guardians of Basic 7–9 learners are warmly invited to the Term 1 PTA meeting at 9:00 AM to review Basic 9 Mock outcomes and BECE readiness."
    },
    {
      id: "ann-2",
      title: "Basic 9 Mock 2 Results & Aggregate Sheets Ready",
      date: "Nov 12, 2026",
      category: "Academics",
      summary: "Mock 2 scripts have been marked and analyzed. Individual mock report cards and aggregate standings are ready for collection and parent SMS dispatch."
    },
    {
      id: "ann-3",
      title: "2026/2027 JHS Admissions Open",
      date: "Nov 05, 2026",
      category: "Admissions",
      summary: "Applications are now open for incoming Basic 7 learners and transfer students into Basic 8. Submit an online inquiry or visit the school administration block."
    }
  ]
};

export const SMS_TEMPLATES = [
  {
    id: "pta_reminder",
    label: "PTA Meeting Reminder",
    body: "Dear {parent_name}, kindly be reminded of our upcoming PTA meeting on {pta_date} at {pta_time} ({pta_venue}) to discuss {student_name}'s Basic 9 BECE Mock progress. Your presence is essential. - {school_name}"
  },
  {
    id: "mock_result",
    label: "Basic 9 Mock Result & Aggregate Alert",
    body: "Dear {parent_name}, {student_name} ({class}) scored {total_score}/900 with BECE Aggregate {aggregate} (Position: {position}) in {mock_series}. Kindly review their printed report card and encourage daily revision. - {school_name}"
  },
  {
    id: "remedial_notice",
    label: "Weekend Remedial & Extra Classes Notice",
    body: "Dear {parent_name}, {student_name} is scheduled for Basic 9 BECE Intensive Clinic this Saturday from 8:00 AM to 1:00 PM at the JHS Block. Please ensure prompt attendance. - {school_name}"
  },
  {
    id: "fees_reminder",
    label: "Mock Printing & Exam Levy Reminder",
    body: "Dear {parent_name}, kindly assist by settling {student_name}'s Basic 9 Mock Examination printing & stationery levy before Friday to ensure smooth preparation for Mock 3. Thank you. - {school_name}"
  }
];

export const INITIAL_STUDENTS = {
  "Basic 9": [
    { sn: 1, indexNo: "0412026001", name: "ABRAHAM DELALI AGBEMADZO", gender: "M", parentName: "Mr. Kwame Agbemadzo", parentPhone: "0244112201", attendance: 64, conduct: "Always attentive in class", interest: "Mathematics & Logic puzzles", remarks: "Excellent mock performance; keep pushing for Aggregate 6." },
    { sn: 2, indexNo: "0412026002", name: "ADJOA MAWUFEMOR KLU", gender: "F", parentName: "Mrs. Grace Klu", parentPhone: "0542198830", attendance: 65, conduct: "Displays self-discipline", interest: "Science experiments", remarks: "Very good result; sustain this momentum for BECE." },
    { sn: 3, indexNo: "0412026003", name: "AKOSUA SENA TETTEH", gender: "F", parentName: "Mr. Samuel Tetteh", parentPhone: "0208765412", attendance: 63, conduct: "Reads extensively for enjoyment", interest: "Reading books", remarks: "Steady improvement across mock series; well done." },
    { sn: 4, indexNo: "0412026004", name: "BRIGHT KOJO MENSAH", gender: "M", parentName: "Madam Rose Mensah", parentPhone: "0247654321", attendance: 61, conduct: "Exhibits good teamwork", interest: "Operating computer", remarks: "Good effort; intensify revision in weaker core areas." },
    { sn: 5, indexNo: "0412026005", name: "CELESTINE DZIFA AMUZU", gender: "F", parentName: "Mr. Yao Amuzu", parentPhone: "0553102944", attendance: 65, conduct: "Completes assignments in the time allotted", interest: "Debating & Public speaking", remarks: "Excellent mock performance; keep pushing for Aggregate 6." },
    { sn: 6, indexNo: "0412026006", name: "DANIEL KWESI BOATENG", gender: "M", parentName: "Mrs. Vida Boateng", parentPhone: "0249821034", attendance: 58, conduct: "Needs close supervision during prep", interest: "Sports activities", remarks: "Fair performance; more practice with past BECE questions needed." },
    { sn: 7, indexNo: "0412026007", name: "ELORM YAO NYUIEKO", gender: "M", parentName: "Mr. Foster Nyuieko", parentPhone: "0592664865", attendance: 64, conduct: "Asks questions in class", interest: "Mathematics & Logic puzzles", remarks: "Very good result; sustain this momentum for BECE." },
    { sn: 8, indexNo: "0412026008", name: "EMMANUELLA AFIA OWUSU", gender: "F", parentName: "Mr. Evans Owusu", parentPhone: "0243091188", attendance: 62, conduct: "Always in class on time", interest: "Drawing & Design", remarks: "Good effort; intensify revision in weaker core areas." },
    { sn: 9, indexNo: "0412026009", name: "FELIX SETH DOGBE", gender: "M", parentName: "Madam Patience Dogbe", parentPhone: "0501293847", attendance: 55, conduct: "Needs close supervision during prep", interest: "Sports activities", remarks: "Needs urgent extra tuition and daily supervised study at home." },
    { sn: 10, indexNo: "0412026010", name: "GLADYS KAFUI ADZRAKU", gender: "F", parentName: "Mr. Vincent Adzraku", parentPhone: "0245189902", attendance: 64, conduct: "Welcomes leadership roles in groups", interest: "Writing essays", remarks: "Very good result; sustain this momentum for BECE." },
    { sn: 11, indexNo: "0412026011", name: "ISAAC KOMLA DZIDZOR", gender: "M", parentName: "Mrs. Comfort Dzidzor", parentPhone: "0548832109", attendance: 60, conduct: "Responds appropriately when corrected", interest: "Operating computer", remarks: "Performance is encouraging; work on time management in exams." },
    { sn: 12, indexNo: "0412026012", name: "JENNIFER EYRAM KPODO", gender: "F", parentName: "Mr. Francis Kpodo", parentPhone: "0276549011", attendance: 65, conduct: "Exhibits a positive outlook and attitude", interest: "Science experiments", remarks: "Very good result; sustain this momentum for BECE." },
    { sn: 13, indexNo: "0412026013", name: "KELVIN KWABENA ASARE", gender: "M", parentName: "Madam Beatrice Asare", parentPhone: "0241192030", attendance: 59, conduct: "Good social skills", interest: "Music & Cultural drama", remarks: "Fair performance; more practice with past BECE questions needed." },
    { sn: 14, indexNo: "0412026014", name: "LAUREN MAWULI GBOR", gender: "F", parentName: "Mr. Mawuli Gbor", parentPhone: "0559012345", attendance: 63, conduct: "Displays self-discipline", interest: "Reading books", remarks: "Steady improvement across mock series; well done." },
    { sn: 15, indexNo: "0412026015", name: "MICHAEL KOFI ANTWI", gender: "M", parentName: "Mrs. Dora Antwi", parentPhone: "0204456789", attendance: 54, conduct: "Needs close supervision during prep", interest: "Sports activities", remarks: "Needs urgent extra tuition and daily supervised study at home." },
    { sn: 16, indexNo: "0412026016", name: "PRISCILLA ENAM WORNU", gender: "F", parentName: "Mr. Richard Wornu", parentPhone: "0246678901", attendance: 65, conduct: "Always attentive in class", interest: "Debating & Public speaking", remarks: "Excellent mock performance; keep pushing for Aggregate 6." }
  ],
  "Basic 8": [
    { sn: 1, indexNo: "0412027001", name: "BENJAMIN YAW ASAMOAH", gender: "M", parentName: "Mr. Kofi Asamoah", parentPhone: "0243120091", attendance: 63, conduct: "Always attentive in class", interest: "Operating computer", remarks: "Very promising foundational performance." },
    { sn: 2, indexNo: "0412027002", name: "DORCAS SEFAKOR NORVI", gender: "F", parentName: "Mrs. Mercy Norvi", parentPhone: "0546781122", attendance: 65, conduct: "Displays self-discipline", interest: "Reading books", remarks: "Keep up the consistent reading habit." },
    { sn: 3, indexNo: "0412027003", name: "GIDEON KWAME DARKO", gender: "M", parentName: "Mr. Emmanuel Darko", parentPhone: "0209912340", attendance: 60, conduct: "Exhibits good teamwork", interest: "Sports activities", remarks: "Can achieve higher grades with extra Mathematics drills." },
    { sn: 4, indexNo: "0412027004", name: "HANNAH ABLA SEGBEFIA", gender: "F", parentName: "Madam Stella Segbefia", parentPhone: "0591029384", attendance: 64, conduct: "Completes assignments in the time allotted", interest: "Science experiments", remarks: "Strong analytical potential." }
  ],
  "Basic 7": [
    { sn: 1, indexNo: "0412028001", name: "AARON KUDJO AGBO", gender: "M", parentName: "Mr. Lawrence Agbo", parentPhone: "0248877665", attendance: 64, conduct: "Always in class on time", interest: "Drawing & Design", remarks: "Adapting very well to JHS standards." },
    { sn: 2, indexNo: "0412028002", name: "BEATRICE XORNAM FOLI", gender: "F", parentName: "Mrs. Agnes Foli", parentPhone: "0552345678", attendance: 65, conduct: "Good social skills", interest: "Writing essays", remarks: "Excellent expression in English Language." },
    { sn: 3, indexNo: "0412028003", name: "CALEB SELORM KUDZORDZI", gender: "M", parentName: "Mr. Prosper Kudzordzi", parentPhone: "0241100998", attendance: 62, conduct: "Asks questions in class", interest: "Mathematics & Logic puzzles", remarks: "Curious and hardworking learner." }
  ]
};

export const INITIAL_MOCK_SCORES = {
  "Basic 9": {
    "Mock 1": {
      1:  { ENG: 84, MATHS: 92, SCI: 89, SOC: 85, "C.TECH": 82, COMP: 91, RME: 88, "GH.LANG": 78, "C.ARTS": 80 },
      2:  { ENG: 88, MATHS: 81, SCI: 86, SOC: 82, "C.TECH": 79, COMP: 83, RME: 90, "GH.LANG": 84, "C.ARTS": 85 },
      3:  { ENG: 76, MATHS: 68, SCI: 72, SOC: 79, "C.TECH": 74, COMP: 75, RME: 82, "GH.LANG": 77, "C.ARTS": 81 },
      4:  { ENG: 64, MATHS: 71, SCI: 66, SOC: 68, "C.TECH": 75, COMP: 84, RME: 73, "GH.LANG": 62, "C.ARTS": 70 },
      5:  { ENG: 91, MATHS: 87, SCI: 90, SOC: 89, "C.TECH": 85, COMP: 88, RME: 93, "GH.LANG": 82, "C.ARTS": 86 },
      6:  { ENG: 52, MATHS: 46, SCI: 49, SOC: 58, "C.TECH": 61, COMP: 59, RME: 64, "GH.LANG": 55, "C.ARTS": 60 },
      7:  { ENG: 79, MATHS: 86, SCI: 83, SOC: 77, "C.TECH": 81, COMP: 89, RME: 80, "GH.LANG": 73, "C.ARTS": 76 },
      8:  { ENG: 69, MATHS: 63, SCI: 67, SOC: 72, "C.TECH": 78, COMP: 71, RME: 76, "GH.LANG": 70, "C.ARTS": 84 },
      9:  { ENG: 38, MATHS: 34, SCI: 41, SOC: 45, "C.TECH": 52, COMP: 48, RME: 56, "GH.LANG": 44, "C.ARTS": 50 },
      10: { ENG: 83, MATHS: 74, SCI: 78, SOC: 84, "C.TECH": 76, COMP: 79, RME: 88, "GH.LANG": 81, "C.ARTS": 77 },
      11: { ENG: 61, MATHS: 67, SCI: 62, SOC: 64, "C.TECH": 68, COMP: 78, RME: 69, "GH.LANG": 59, "C.ARTS": 65 },
      12: { ENG: 80, MATHS: 77, SCI: 85, SOC: 81, "C.TECH": 74, COMP: 80, RME: 86, "GH.LANG": 79, "C.ARTS": 83 },
      13: { ENG: 57, MATHS: 53, SCI: 51, SOC: 60, "C.TECH": 63, COMP: 58, RME: 67, "GH.LANG": 62, "C.ARTS": 72 },
      14: { ENG: 74, MATHS: 70, SCI: 75, SOC: 78, "C.TECH": 72, COMP: 76, RME: 81, "GH.LANG": 75, "C.ARTS": 79 },
      15: { ENG: 41, MATHS: 32, SCI: 36, SOC: 43, "C.TECH": 49, COMP: 44, RME: 51, "GH.LANG": 47, "C.ARTS": 46 },
      16: { ENG: 89, MATHS: 90, SCI: 88, SOC: 92, "C.TECH": 86, COMP: 87, RME: 94, "GH.LANG": 85, "C.ARTS": 88 }
    },
    "Mock 2": {
      1:  { ENG: 87, MATHS: 94, SCI: 91, SOC: 88, "C.TECH": 84, COMP: 93, RME: 90, "GH.LANG": 80, "C.ARTS": 82 },
      2:  { ENG: 90, MATHS: 83, SCI: 88, SOC: 85, "C.TECH": 81, COMP: 85, RME: 92, "GH.LANG": 86, "C.ARTS": 87 },
      3:  { ENG: 78, MATHS: 71, SCI: 75, SOC: 81, "C.TECH": 76, COMP: 78, RME: 84, "GH.LANG": 79, "C.ARTS": 83 },
      4:  { ENG: 67, MATHS: 74, SCI: 70, SOC: 71, "C.TECH": 77, COMP: 86, RME: 75, "GH.LANG": 65, "C.ARTS": 72 },
      5:  { ENG: 93, MATHS: 90, SCI: 92, SOC: 91, "C.TECH": 88, COMP: 90, RME: 95, "GH.LANG": 84, "C.ARTS": 89 },
      6:  { ENG: 55, MATHS: 50, SCI: 52, SOC: 61, "C.TECH": 63, COMP: 62, RME: 66, "GH.LANG": 58, "C.ARTS": 61 },
      7:  { ENG: 82, MATHS: 89, SCI: 85, SOC: 80, "C.TECH": 83, COMP: 91, RME: 83, "GH.LANG": 75, "C.ARTS": 78 },
      8:  { ENG: 72, MATHS: 66, SCI: 70, SOC: 75, "C.TECH": 80, COMP: 74, RME: 79, "GH.LANG": 72, "C.ARTS": 86 },
      9:  { ENG: 43, MATHS: 39, SCI: 44, SOC: 48, "C.TECH": 55, COMP: 52, RME: 59, "GH.LANG": 48, "C.ARTS": 54 },
      10: { ENG: 85, MATHS: 78, SCI: 81, SOC: 86, "C.TECH": 79, COMP: 82, RME: 90, "GH.LANG": 83, "C.ARTS": 80 },
      11: { ENG: 64, MATHS: 70, SCI: 65, SOC: 67, "C.TECH": 71, COMP: 81, RME: 72, "GH.LANG": 62, "C.ARTS": 68 },
      12: { ENG: 83, MATHS: 80, SCI: 87, SOC: 84, "C.TECH": 77, COMP: 83, RME: 89, "GH.LANG": 81, "C.ARTS": 85 },
      13: { ENG: 60, MATHS: 56, SCI: 54, SOC: 62, "C.TECH": 66, COMP: 61, RME: 70, "GH.LANG": 65, "C.ARTS": 74 },
      14: { ENG: 77, MATHS: 73, SCI: 78, SOC: 80, "C.TECH": 75, COMP: 79, RME: 83, "GH.LANG": 77, "C.ARTS": 81 },
      15: { ENG: 45, MATHS: 36, SCI: 40, SOC: 47, "C.TECH": 51, COMP: 48, RME: 54, "GH.LANG": 50, "C.ARTS": 49 },
      16: { ENG: 91, MATHS: 92, SCI: 90, SOC: 94, "C.TECH": 88, COMP: 89, RME: 96, "GH.LANG": 87, "C.ARTS": 90 }
    }
  },
  "Basic 8": {
    "Mock 1": {
      1: { ENG: 78, MATHS: 84, SCI: 80, SOC: 76, "C.TECH": 75, COMP: 88, RME: 82, "GH.LANG": 71, "C.ARTS": 77 },
      2: { ENG: 86, MATHS: 77, SCI: 82, SOC: 84, "C.TECH": 79, COMP: 81, RME: 88, "GH.LANG": 83, "C.ARTS": 80 },
      3: { ENG: 62, MATHS: 58, SCI: 61, SOC: 65, "C.TECH": 68, COMP: 66, RME: 71, "GH.LANG": 64, "C.ARTS": 70 },
      4: { ENG: 79, MATHS: 81, SCI: 85, SOC: 78, "C.TECH": 76, COMP: 80, RME: 83, "GH.LANG": 74, "C.ARTS": 78 }
    }
  },
  "Basic 7": {
    "Mock 1": {
      1: { ENG: 72, MATHS: 76, SCI: 74, SOC: 75, "C.TECH": 79, COMP: 77, RME: 80, "GH.LANG": 70, "C.ARTS": 86 },
      2: { ENG: 88, MATHS: 74, SCI: 79, SOC: 82, "C.TECH": 75, COMP: 78, RME: 85, "GH.LANG": 80, "C.ARTS": 81 },
      3: { ENG: 75, MATHS: 85, SCI: 81, SOC: 76, "C.TECH": 74, COMP: 83, RME: 78, "GH.LANG": 72, "C.ARTS": 74 }
    }
  }
};

export const INITIAL_SMS_LOGS = [
  {
    id: "sms-seed-1",
    timestamp: "2026-11-11 10:15",
    category: "PTA Reminder",
    gateway: "Simulation Mode",
    recipientCount: 16,
    deliveredCount: 16,
    sampleMessage: "Dear Mr. Kwame Agbemadzo, kindly be reminded of our upcoming PTA meeting on Nov 28, 2026 at 9:00 AM Prompt (School Assembly Hall)..."
  },
  {
    id: "sms-seed-2",
    timestamp: "2026-11-12 14:40",
    category: "Mock 1 Result Alert",
    gateway: "Simulation Mode",
    recipientCount: 16,
    deliveredCount: 16,
    sampleMessage: "Dear Mrs. Grace Klu, ADJOA MAWUFEMOR KLU (Basic 9) scored 758/900 with BECE Aggregate 9 (Position: 4th) in Mock 1..."
  }
];

export const INITIAL_INQUIRIES = [
  {
    id: "inq-1",
    createdAt: "2026-11-10",
    parentName: "Mr. Wisdom Kofi Nyarko",
    phone: "0245901122",
    studentName: "Blessing Nyarko",
    targetClass: "Basic 7",
    message: "Looking to enroll my daughter for the 2026/2027 Basic 7 intake. Please share admission form fees.",
    status: "New"
  },
  {
    id: "inq-2",
    createdAt: "2026-11-12",
    parentName: "Madam Abigail Mensah",
    phone: "0548712309",
    studentName: "Kelvin Mensah",
    targetClass: "Basic 8",
    message: "Transferring from Ho Municipal. Can we book an assessment test next week?",
    status: "Reviewed"
  }
];
