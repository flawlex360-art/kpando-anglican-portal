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
  address: "Kpando, Volta Region, Ghana",
  phone: "0246951331",
  email: "",
  academicYear: "2025/2026",
  headmasterName: "",
  basic9TeacherName: "",
  basic9TeacherPhone: "0592664865",
  reopeningDate: "",
  examDate: "",
  timesOpen: 65,
  ptaMeeting: {
    title: "",
    date: "",
    time: "",
    venue: "",
    agenda: ""
  },
  announcements: []
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
  "Basic 9": [],
  "Basic 8": [],
  "Basic 7": []
};

export const INITIAL_MOCK_SCORES = {
  "Basic 9": {},
  "Basic 8": {},
  "Basic 7": {}
};

export const INITIAL_SMS_LOGS = [];

export const INITIAL_INQUIRIES = [];

export const INITIAL_BASIC9_FINANCE = {
  feePerLearner: 595,
  paymentsByLearner: {},
  expenses: []
};
