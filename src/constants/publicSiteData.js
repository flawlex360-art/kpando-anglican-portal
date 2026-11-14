/**
 * Structured content & starter data for the Kpando Anglican Basic School Public Website.
 *
 * All live school identity values (schoolName, motto, headmasterName, phone, email, address,
 * academicYear, reopeningDate, examDate, ptaMeeting, announcements, and learner counts)
 * are dynamically overlaid from Firestore / Admin School Settings when configured.
 *
 * Starter placeholder items below (staff roster samples, term calendar milestones, clubs,
 * houses, prospectus checklists, downloadable circulars, and testimonials) can be replaced
 * directly with verified school records whenever ready.
 */

export const EXTERNAL_SBA_PORTAL_URL = 'https://sba-grading-portal-flawlex360.vercel.app';

export const WEBSITE_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'academics', label: 'Academics' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'campus-life', label: 'Campus Life' },
  { id: 'news', label: 'News & Calendar' },
  { id: 'contact', label: 'Contact' }
];

export const HERO_SLIDES = [
  {
    src: '/hero/slide-01.webp',
    alt: 'Student Prefects & School Leaders',
    category: 'Student Leadership',
    caption: 'Elected school prefects leading morning assembly and peer mentorship across Basic 7–9.'
  },
  {
    src: '/hero/slide-02.webp',
    alt: 'Practical Science & Innovation Session',
    category: 'STEM & Labs',
    caption: 'Learners conducting guided hands-on Integrated Science investigations with facilitators.'
  },
  {
    src: '/hero/slide-03.webp',
    alt: 'Upper Primary & JHS Learners',
    category: 'Learners & Campus',
    caption: 'Disciplined Anglican Basic School pupils engaged in collaborative academic work.'
  },
  {
    src: '/hero/slide-04.webp',
    alt: 'School Practical Agriculture Project',
    category: 'School Farm & Agric',
    caption: 'Career Technology & Agricultural Science practical field beds managed by learners.'
  },
  {
    src: '/hero/slide-05.webp',
    alt: 'School Farm & Cabbage Cultivation',
    category: 'School Farm & Agric',
    caption: 'Healthy vegetable beds nurtured on campus through weekly practical farming hours.'
  },
  {
    src: '/hero/slide-06.webp',
    alt: 'Campus Garden Harvest',
    category: 'School Farm & Agric',
    caption: 'Harvest day celebrating sustainable agribusiness skills and food security lessons.'
  },
  {
    src: '/hero/slide-07.webp',
    alt: 'Science & Lab Safety Goggles Session',
    category: 'STEM & Labs',
    caption: 'Proper laboratory safety protocol practice ahead of Basic 9 BECE Integrated Science.'
  },
  {
    src: '/hero/slide-08.webp',
    alt: 'Laboratory Testing & Inquiry',
    category: 'STEM & Labs',
    caption: 'Observation, measurement, and hypothesis testing inside the school science practical hub.'
  },
  {
    src: '/hero/slide-09.webp',
    alt: 'Hands-On Pipetting & Chemistry Practicals',
    category: 'STEM & Labs',
    caption: 'Precision measurement and titration drills preparing candidates for BECE practical questions.'
  },
  {
    src: '/hero/slide-10.webp',
    alt: 'Circuit & STEM Group Experiment',
    category: 'STEM & Labs',
    caption: 'Small-group basic electronics and circuitry experiments fostering analytical teamwork.'
  },
  {
    src: '/hero/slide-11.webp',
    alt: 'STEM Lighting & Teamwork',
    category: 'STEM & Labs',
    caption: 'Illuminating Young Minds through Applied Physics, Computing, and Problem Solving.'
  }
];

export const GALLERY_CATEGORIES = [
  'All Photos',
  'STEM & Labs',
  'School Farm & Agric',
  'Student Leadership',
  'Learners & Campus'
];

export const AUDIENCE_SHORTCUTS = [
  {
    id: 'prospective',
    audience: 'Prospective Parents',
    title: 'Admissions & Prospectus',
    description: 'View step-by-step enrollment, required documents, starter uniform lists, and submit an inquiry.',
    targetTab: 'admissions',
    cta: 'Start Application'
  },
  {
    id: 'bece',
    audience: 'Basic 9 / BECE Candidates',
    title: 'BECE Hub & Aggregate Tool',
    description: 'Explore 4 Core + 5 Elective tracks, grading scale, CSSPS guidance, and interactive score simulator.',
    targetTab: 'academics',
    cta: 'Open BECE Hub'
  },
  {
    id: 'current-families',
    audience: 'Current Parents & PTA',
    title: 'Calendar, Circulars & PTA',
    description: 'Check live reopening dates, PTA meetings, 3-term GES schedule, and printable parent downloads.',
    targetTab: 'news',
    cta: 'View Notices & Dates'
  },
  {
    id: 'campus',
    audience: 'Students & Community',
    title: 'Campus Life & Photo Gallery',
    description: 'Browse our 11+ STEM lab, school farm, and prefect leadership photos alongside clubs and houses.',
    targetTab: 'campus-life',
    cta: 'Explore Campus Life'
  }
];

export const SCHOOL_VISION_MISSION = {
  vision:
    'To be a model Anglican Basic School in the Volta Region known for academic excellence, Christian moral character, practical STEM competence, and exemplary BECE distinction results.',
  mission:
    'To nurture disciplined, curious, and service-minded learners from Kindergarten through Junior High School by combining Ghana Education Service (GES) standards, continuous Mock WebSBA diagnostics, hands-on practicals, and transparent parent-teacher partnerships.'
};

export const SCHOOL_CORE_VALUES = [
  {
    key: 'faith',
    title: 'Pro Deo et Patria',
    subtitle: 'Faith, Integrity & Patriotism',
    description: 'Grounded in Anglican Christian worship, honesty, mutual respect, and civic responsibility to community and Ghana.'
  },
  {
    key: 'excellence',
    title: 'Academic Rigor',
    subtitle: 'Continuous Diagnostic Mastery',
    description: 'Structured class assessments, weekly weekend clinics, and 100% BECE Mock WebSBA analytics leaving no learner behind.'
  },
  {
    key: 'discipline',
    title: 'Punctuality & Conduct',
    subtitle: 'Strong Moral & Study Habits',
    description: 'Daily attendance monitoring, neat uniform standards, supervised prep, and prefect-led peer accountability.'
  },
  {
    key: 'innovation',
    title: 'Practical STEM & Agric',
    subtitle: 'Learning by Doing',
    description: 'Science apparatus work, Computing skills, Career Technology, and live school-garden crop cultivation.'
  },
  {
    key: 'partnership',
    title: 'Parent Partnership',
    subtitle: 'Open Home-School Communication',
    description: 'Direct MNotify Parent SMS updates for PTA meetings, terminal report cards, mock rankings, and learner welfare.'
  }
];

export const SCHOOL_HISTORY_MILESTONES = [
  {
    era: 'Foundation Era',
    title: 'Anglican Mission Roots in Kpando',
    detail:
      'Established under the Anglican Education Unit to provide accessible, character-forming basic education for families within Kpando Municipality and neighboring communities. [Update with exact founding year]'
  },
  {
    era: 'Growth & Expansion',
    title: 'Full KG, Primary & JHS Stream Integration',
    detail:
      'Expanded instructional blocks to serve Kindergarten through Basic 9 learners under the Ghana Education Service (GES) Municipal Directorate framework.'
  },
  {
    era: 'Practical Learning',
    title: 'Science Practicals & School Agriculture Hub',
    detail:
      'Introduced structured Science laboratory kit demonstrations, Basic 9 group STEM circuit labs, and productive campus vegetable gardens under Career Technology.'
  },
  {
    era: '2025/2026 Milestone',
    title: 'WebSBA Mock Analytics & Live Parent SMS',
    detail:
      'Deployed our dedicated Basic 9 Mock WebSBA platform generating A4 GES report cards, Best-6 BECE Aggregate analytics, and instant parent SMS engagement.'
  }
];

export const PLACEHOLDER_FACULTY_DIRECTORY = [
  {
    id: 'fac-sci',
    name: 'Mr. Emmanuel K. Adjei (Sample)',
    role: 'Academic Head & Integrated Science Facilitator',
    department: 'JHS Core',
    qualification: 'B.Ed. Science Education • GES Licensed',
    bio: 'Coordinates JHS instructional timetables, Science lab practicals, and BECE STEM clinics.'
  },
  {
    id: 'fac-math',
    name: 'Mr. Francis T. Mensah (Sample)',
    role: 'Mathematics & Remedial Coordinator',
    department: 'JHS Core',
    qualification: 'B.Ed. Mathematics • Basic 7–9',
    bio: 'Leads core Mathematics instruction, Saturday Mock clinics, and learner diagnostic remediation.'
  },
  {
    id: 'fac-eng',
    name: 'Mrs. Grace A. Agbenyo (Sample)',
    role: 'English Language & Literacy Lead',
    department: 'JHS Core',
    qualification: 'B.Ed. English • Reading & Debate Patron',
    bio: 'Guides comprehension, essay mastery, and the school Literary & Debate Society.'
  },
  {
    id: 'fac-soc',
    name: 'Mr. Patrick Y. Kpodo (Sample)',
    role: 'Social Studies & Civic Education Lead',
    department: 'JHS Core',
    qualification: 'B.Ed. Social Studies • Patron, Prefects Council',
    bio: 'Mentors student leaders and teaches Ghanaian heritage, governance, and sustainable development.'
  },
  {
    id: 'fac-comp',
    name: 'Mr. Samuel D. Owusu (Sample)',
    role: 'Computing & Career Technology Facilitator',
    department: 'Electives & Practicals',
    qualification: 'B.Sc. ICT / Technical Education',
    bio: 'Supervises digital literacy lessons, electronics kits, and practical Career Technology projects.'
  },
  {
    id: 'fac-pri',
    name: 'Mrs. Beatrice K. Dogbe (Sample)',
    role: 'Upper & Lower Primary Coordinator',
    department: 'Primary & KG',
    qualification: 'B.Ed. Basic Education (Early Grade & Primary)',
    bio: 'Oversees KG–Basic 6 phonics, foundational numeracy, and smooth transition into Basic 7.'
  },
  {
    id: 'fac-chap',
    name: 'Ven. / Rev. School Chaplaincy (Sample)',
    role: 'Anglican Chaplaincy & Guidance Desk',
    department: 'Administration',
    qualification: 'Moral Formation & Learner Counseling',
    bio: 'Leads weekly Anglican morning devotions, value education, and learner pastoral care.'
  }
];

export const ACADEMIC_DIVISIONS = [
  {
    id: 'kg-lower',
    badge: 'Foundation Stage',
    title: 'Kindergarten & Lower Primary (KG 1 – Basic 3)',
    ageRange: 'Ages 4 – 9 • Early Literacy & Numeracy',
    summary:
      'Builds confident readers, curious problem solvers, and joyful learners using the NaCCA / GES Standard-Based Curriculum with phonics, guided play, and moral songs.',
    highlights: [
      'Structured Phonics, Reading Circles & Handwriting Mastery',
      'Concrete Number Work & Everyday Problem Solving',
      'Our World and Our People (OWOP) & Environmental Discovery',
      'Religious & Moral Formation during Morning Devotions',
      'Creative Arts, Singing, Storytime & Gross Motor Play',
      'Continuous Termly Parent Progress Engagement'
    ],
    subjects: ['English Language & Phonics', 'Mathematics', 'Science', 'Our World Our People', 'R.M.E', 'Ghanaian Language (Ewe)', 'Creative Arts & Physical Education']
  },
  {
    id: 'upper-primary',
    badge: 'Intermediate Stage',
    title: 'Upper Primary (Basic 4 – Basic 6)',
    ageRange: 'Ages 9 – 12 • Pre-JHS Bridge',
    summary:
      'Consolidates independent reading, multi-step arithmetic, scientific inquiry, Computing basics, and National Standardized Test readiness ahead of Junior High entry.',
    highlights: [
      'Weekly Spelling Bees, Composition Writing & Comprehension',
      'Mental Mathematics Drills & Word-Problem Strategies',
      'Introduction to Science Apparatus & School Garden Plots',
      'Foundational Computing, Keyboarding & Safe Digital Habits',
      'Leadership via Class Monitors & School Choir / Sports',
      'Basic 6 Transition Orientation into JHS Academic Rigor'
    ],
    subjects: ['English Language', 'Mathematics', 'Science', 'History / OWOP', 'Computing', 'R.M.E', 'Ghanaian Language', 'Creative Arts & PE']
  },
  {
    id: 'jhs',
    badge: 'BECE Flagship Track',
    title: 'Junior High School (Basic 7 – Basic 9)',
    ageRange: 'Ages 12 – 15 • GES Common Core & BECE Track',
    summary:
      'Specialized subject facilitators prepare learners across 9 Common Core / BECE subjects with multi-series Mock Examinations, laboratory sessions, and WebSBA Best-6 Aggregate tracking.',
    highlights: [
      'Dedicated Facilitators per Subject (Core & Practical Electives)',
      'Multi-Series Basic 9 Mock Examinations (Mock 1–3 & Pre-BECE)',
      'Automated WebSBA Ranking, Best-6 Aggregate & A4 Report Cards',
      'Saturday Basic 9 Intensive Clinic & Past-Question Drilling',
      'Hands-On Integrated Science, Computing & School Agriculture Labs',
      'One-on-One CSSPS Senior High School Selection Counseling'
    ],
    subjects: [
      'English Language (Core)',
      'Mathematics (Core)',
      'Integrated Science (Core)',
      'Social Studies (Core)',
      'Career Technology',
      'Computing',
      'Religious & Moral Education',
      'Ghanaian Language',
      'Creative Arts & Design'
    ]
  }
];

export const WEEKLY_ACADEMIC_SCHEDULE = [
  {
    day: 'Monday – Friday',
    window: '7:15 AM – 7:45 AM',
    activity: 'Morning Inspection, Anglican Devotion & Assembly Briefings',
    audience: 'All Learners & Staff'
  },
  {
    day: 'Monday – Friday',
    window: '7:45 AM – 2:30 PM',
    activity: 'Structured GES Curriculum Lessons & Practical Sessions',
    audience: 'KG 1 – Basic 9'
  },
  {
    day: 'Wednesdays',
    window: '1:30 PM – 3:00 PM',
    activity: 'Clubs, School Farm Agriculture, STEM Kits & Co-Curriculars',
    audience: 'Primary & JHS'
  },
  {
    day: 'Fridays',
    window: '1:00 PM – 2:30 PM',
    activity: 'Weekly Diagnostic Quizzes, Spelling & Debate Drills',
    audience: 'Basic 4 – Basic 9'
  },
  {
    day: 'Saturdays (Pre-BECE)',
    window: '8:00 AM – 1:00 PM',
    activity: 'Basic 9 BECE Intensive Clinic & Mock Script Review',
    audience: 'Basic 9 Candidates'
  }
];

export const CSSPS_TRANSITION_STEPS = [
  {
    step: '01',
    title: 'Continuous Mock Diagnostics',
    detail: 'Learners complete Mock 1, 2, 3, and Final Pre-BECE exams scored strictly out of 100% to establish realistic performance baselines.'
  },
  {
    step: '02',
    title: 'Parent Aggregate & SMS Briefings',
    detail: 'Parents receive terminal report cards and instant SMS updates explaining Best-6 Aggregates (4 Core + Best 2 Electives) and subject targets.'
  },
  {
    step: '03',
    title: 'CSSPS School Selection Clinic',
    detail: 'With parents present, JHS teachers guide candidates to select balanced Category A, B, and C Senior High / TVET choices aligned to strengths.'
  },
  {
    step: '04',
    title: 'Biometric Verification & Clearance',
    detail: 'Final candidate indexing, photograph verification, and GES portal sign-off ahead of WAEC BECE dates.'
  }
];

export const ADMISSION_STEPS = [
  {
    step: 'Step 1',
    title: 'Submit Inquiry or Visit Office',
    detail: 'Submit the online inquiry form below or visit our Campus Administration Desk in Kpando (Mon–Fri, 7:30 AM – 3:30 PM).'
  },
  {
    step: 'Step 2',
    title: 'Collect & Complete Form',
    detail: 'Pick up an admission form at the Headteacher’s office with the ward’s basic details and preferred entry level (KG – Basic 9).'
  },
  {
    step: 'Step 3',
    title: 'Diagnostic Entry Placement',
    detail: 'Prospective Primary and JHS entrants take a short Literacy & Numeracy readiness check for appropriate class placement.'
  },
  {
    step: 'Step 4',
    title: 'Submit Required Records',
    detail: 'Present birth certificate copy, two recent passport photos, previous term report card, and transfer note where applicable.'
  },
  {
    step: 'Step 5',
    title: 'Enrollment & Parent SMS Link',
    detail: 'Once confirmed, the learner receives a school index number and the parent contact is activated for SMS & Report Card updates.'
  }
];

export const ADMISSION_REQUIREMENTS = [
  'Copy of Child’s Birth Certificate (or Weighing Card for KG entrants)',
  'Two (2) recent color passport-sized photographs of the learner',
  'Most recent Terminal Report Card / Cumulative Record from previous school (Basic 1–9 transfers)',
  'Transfer / Testimonial letter for JHS (Basic 7–9) entrants',
  'Valid NHIS Card copy & emergency parent/guardian WhatsApp/SMS phone number',
  'Commitment to school uniform standards, punctuality, and PTA code of conduct'
];

export const PROSPECTUS_DATA = {
  primary: {
    label: 'KG & Primary Prospectus (Template)',
    subtitle: 'Starter items for KG 1 – Basic 6 (Customize exact quantities with Admissions Office)',
    items: [
      { category: 'Prescribed Uniforms', detail: 'Approved Anglican Basic School day uniform, black shoes/sandals, white socks, and house/PE attire.' },
      { category: 'Books & Stationery', detail: 'Numbered 1A/1B or ruled exercise books per class checklist, pencils, sharpener, eraser, and crayons (KG).' },
      { category: 'Health & Hygiene', detail: 'Personal reusable water bottle, clean handkerchief, basic sanitizer, and labelled lunch box.' },
      { category: 'Sanitation Support', detail: 'Termly school hygiene contribution per official PTA / Administration directive (confirm current rate at office).' }
    ]
  },
  jhs: {
    label: 'JHS Prospectus — Basic 7–9 (Template)',
    subtitle: 'Starter academic & practical kit for JHS learners (Customize before term reopening)',
    items: [
      { category: 'Uniform & Grooming', detail: '2 sets of clean approved JHS uniform, school crest badge, black low shoes, and Anglican house jersey for Wednesdays/Sports.' },
      { category: 'Core Exercise Books', detail: 'Hardcover A4 / Note 3 notebooks for 9 subjects plus graph book for Mathematics and drawing book for Creative Arts & Career Tech.' },
      { category: 'Math & Science Instruments', detail: 'Complete Mathematical Set (compass, protractor, divider), long 30cm ruler, blue/black pens, and WAEC-approved calculator guide (as permitted).' },
      { category: 'Practicals & School Farm', detail: 'Basic lab protective apron / safety coat note and simple garden/sanitation tools allocated per house/class.' }
    ]
  }
};

export const ADMISSION_FAQS = [
  {
    question: 'Which classes are open for admission in the current academic year?',
    answer:
      'Applications are considered across Kindergarten (KG 1–2), Primary (Basic 1–6), and Junior High School (Basic 7–8, plus qualified Basic 9 transfers with prior BECE subject alignment), subject to class space.'
  },
  {
    question: 'Does the school accept mid-year transfers from other municipalities?',
    answer:
      'Yes. Transferring pupils are warmly welcomed upon submitting their previous school’s cumulative report card, a transfer note, and completing a short Literacy and Mathematics placement assessment.'
  },
  {
    question: 'How do parents receive mock exam results and PTA alerts?',
    answer:
      'Upon admission, your active phone number is added to our verified WebSBA & MNotify Parent SMS system so you receive automated PTA reminders, mock aggregate notices, and fee receipts directly by SMS alongside printed A4 Report Cards.'
  },
  {
    question: 'Are Saturday BECE clinics compulsory for Basic 9 students?',
    answer:
      'Yes. Basic 9 candidates attend supervised Saturday Intensive Clinics (8:00 AM – 1:00 PM) focused on Core Mathematics, English, Science, Social Studies, and practical BECE past questions unless excused by a parent.'
  },
  {
    question: 'Where do I pay approved levies or verify Basic 9 examination fees?',
    answer:
      'All school and Basic 9 candidate payments are logged through the Administration & Accounts office with official numbered printable receipts. We never authorize unverified mobile money transfers outside official contacts.'
  }
];

export const CO_CURRICULAR_CLUBS = [
  {
    name: 'STEM & Young Innovators Club',
    schedule: 'Wednesdays • 1:30 PM',
    description: 'Guided circuits, practical chemistry/physics demonstrations, and basic digital problem solving (featured in our Science Lab photos).'
  },
  {
    name: 'Practical Agriculture & 4H Gardeners',
    schedule: 'Wednesdays & Morning Plots',
    description: 'Maintaining school cabbage and vegetable beds, soil composting lessons, and sustainable agribusiness skills.'
  },
  {
    name: 'Prefects’ Council & Peer Mentorship',
    schedule: 'Weekly Leadership Briefings',
    description: 'Elected student prefects upholding order, assembly coordination, campus cleanliness, and peer encouragement.'
  },
  {
    name: 'Literary, Debate & Reading Club',
    schedule: 'Fridays • 1:00 PM',
    description: 'Spelling bees, public speaking, essay writing workshops, and inter-school quiz preparation.'
  },
  {
    name: 'Anglican Youth Choir & Moral Union',
    schedule: 'Tuesdays & Morning Devotions',
    description: 'Hymns, scripture recitals, choral singing, and community charity outreach.'
  },
  {
    name: 'Athletics, Football & Inter-House Sports',
    schedule: 'Thursdays • 2:00 PM',
    description: 'Track events, football, netball, and annual Kpando Municipal Inter-School Athletics preparation.'
  }
];

export const SCHOOL_HOUSES = [
  {
    name: 'Bishop’s House (Green) — Sample',
    motto: 'Service & Steadfastness',
    focus: 'Leadership, environmental stewardship, and track athletics.'
  },
  {
    name: 'St. Luke House (Gold) — Sample',
    motto: 'Wisdom & Diligence',
    focus: 'Academic quiz bowls, debate, and science fairs.'
  },
  {
    name: 'St. John House (Blue) — Sample',
    motto: 'Faith & Fortitude',
    focus: 'Choral ministry, football, and civic volunteering.'
  },
  {
    name: 'Volta Unity House (Crimson) — Sample',
    motto: 'Strength in Unity',
    focus: 'Field events, relay teams, and school farm innovation.'
  }
];

export const CAMPUS_FACILITIES = [
  {
    title: 'Classrooms & JHS Study Blocks',
    detail: 'Structured Primary & Basic 7–9 learning blocks designed for focused morning instruction and Mock exams.'
  },
  {
    title: 'Science & STEM Practicals Setup',
    detail: 'Apparatus kits, glassware, lab safety goggles, and group circuitry tools for active experimentation.'
  },
  {
    title: 'School Practical Agriculture Plots',
    detail: 'Cultivated campus beds giving pupils real hands-on experience in crop nursing, care, and harvesting.'
  },
  {
    title: 'WebSBA & Administration Hub',
    detail: 'Digital grading, A4 report card production, fee receipting, and live MNotify parent SMS dispatch center.'
  }
];

export const ACADEMIC_TERM_CALENDAR = [
  {
    id: 'cal-1',
    term: 'Term 1',
    dateLabel: 'September (Week 1)',
    title: 'School Reopening & Orientation of New Intakes (Template)',
    category: 'Academic',
    note: 'General cleaning, textbook allocation, and diagnostic baseline tests across Basic 7–9.'
  },
  {
    id: 'cal-2',
    term: 'Term 1',
    dateLabel: 'October (Mid-Term)',
    title: 'First Term PTA General Assembly & Basic 9 Targets Briefing',
    category: 'PTA',
    note: 'Check live school banner above for exact confirmed upcoming PTA date, time, and venue.'
  },
  {
    id: 'cal-3',
    term: 'Term 1',
    dateLabel: 'November',
    title: 'Basic 9 Mock Series 1 & Continuous Assessment Audit',
    category: 'BECE Mock',
    note: '100% Mock scripts graded and published with Best-6 Aggregates and A4 report cards.'
  },
  {
    id: 'cal-4',
    term: 'Term 2',
    dateLabel: 'January (Week 2)',
    title: 'Second Term Reopening & Intensive Saturday Clinics Resume',
    category: 'Academic',
    note: 'Verify exact official reopening date in the live banner from Administration.'
  },
  {
    id: 'cal-5',
    term: 'Term 2',
    dateLabel: 'February – March',
    title: 'Independence Parade Rehearsals & Inter-House Sports Festival',
    category: 'Campus Life',
    note: 'Municipal march-past, track & field heats, and Science/Agric open showcase.'
  },
  {
    id: 'cal-6',
    term: 'Term 2',
    dateLabel: 'March',
    title: 'Basic 9 Mock Series 2 & WAEC Biometric Verification',
    category: 'BECE Mock',
    note: 'Candidate subject audits and SMS performance alerts sent to all parents.'
  },
  {
    id: 'cal-7',
    term: 'Term 3',
    dateLabel: 'May',
    title: 'Mock Series 3, Final Pre-BECE Exam & CSSPS School Selection',
    category: 'BECE Mock',
    note: 'Parent-learner counseling to finalize Senior High & TVET school choices.'
  },
  {
    id: 'cal-8',
    term: 'Term 3',
    dateLabel: 'July / August',
    title: 'Valedictory Service, Speech & Prize-Giving Day',
    category: 'Milestone',
    note: 'Celebrating graduating Basic 9 scholars, subject prize winners, and outgoing prefects.'
  }
];

export const DOWNLOADABLE_RESOURCES = [
  {
    id: 'res-prospectus',
    title: 'Admissions Checklist & Starter Prospectus (KG – JHS)',
    category: 'Admissions',
    updated: '2025/2026 Template',
    summary: 'Complete list of admission documents, uniform guidelines, exercise books, and mathematical/science items.',
    sections: [
      {
        heading: 'Required Admission Documents',
        bullets: [
          'Photocopy of learner Birth Certificate / Weighing Card (KG)',
          'Two (2) recent passport-sized photographs',
          'Most recent previous school Terminal Report Card (for transfers)',
          'Valid NHIS Card copy and active parent/guardian SMS phone number'
        ]
      },
      {
        heading: 'JHS Essential Academic Supplies',
        bullets: [
          'Hardcover notebooks for 4 Core + 5 Elective BECE subjects',
          'Mathematical Set, 30cm ruler, and graph book',
          'Approved Anglican Basic School day uniform and PE/house wear',
          'Closed black school shoes and white socks'
        ]
      }
    ]
  },
  {
    id: 'res-bece-guide',
    title: 'Basic 9 BECE Mock & Best-6 Aggregate Guide',
    category: 'Academics',
    updated: 'GES / WebSBA Standard',
    summary: 'Explains how our 9-point Mock grading works and how the Best 6 Aggregate (4 Core + Best 2 Electives) determines distinction.',
    sections: [
      {
        heading: 'How Aggregate Is Computed (Best 6 Subjects)',
        bullets: [
          'All 4 Core Subjects are compulsory: English Language, Mathematics, Integrated Science, Social Studies.',
          'The system automatically picks the learner’s best 2 numerical grades from the 5 Electives (Career Tech, Computing, R.M.E, Ghanaian Language, Creative Arts & Design).',
          'Lower Aggregate = Stronger Performance (Aggregate 06 is the highest possible distinction; Aggregate 54 is the lowest).'
        ]
      },
      {
        heading: 'Weekend & Home Revision Checklist',
        bullets: [
          'Ensure Basic 9 candidates attend Saturday BECE Intensive Clinics (8:00 AM – 1:00 PM).',
          'Review every printed Mock A4 Report Card to spot weaker Core subjects early.',
          'Encourage at least 90 minutes of quiet evening past-question practice daily.'
        ]
      }
    ]
  },
  {
    id: 'res-calendar',
    title: 'Annual Academic & Examination Calendar Overview',
    category: 'Calendar',
    updated: 'GES 3-Term Structure',
    summary: 'Summary of Terms 1–3 milestones, PTA general assemblies, Mock exam windows, and Basic 9 transition activities.',
    sections: [
      {
        heading: 'Termly Rhythms',
        bullets: [
          'Term 1 (Sept – Dec): Intake orientation, PTA Assembly, Mock Series 1.',
          'Term 2 (Jan – Apr): Inter-House Sports, March-Past, Mock Series 2 & WAEC Verification.',
          'Term 3 (May – Aug): Pre-BECE Mock, CSSPS School Selection, BECE & Speech/Prize-Giving.'
        ]
      },
      {
        heading: 'Confirming Official Dates',
        bullets: [
          'Always verify confirmed Reopening, Mock Exam, and PTA dates in the live School Noticeboard banner.',
          'Parents registered on the Parent SMS Center receive automatic date reminders ahead of meetings.'
        ]
      }
    ]
  },
  {
    id: 'res-sms-charter',
    title: 'Parent SMS Engagement & Communication Charter',
    category: 'Parents',
    updated: 'Active Protocol',
    summary: 'Guidelines on how Kpando Anglican Basic School keeps parents informed via verified KPANDOANGLI SMS alerts.',
    sections: [
      {
        heading: 'When Parents Receive Verified SMS',
        bullets: [
          'Scheduled PTA Meeting announcements (including exact date, time, and venue)',
          'Basic 9 Mock result & BECE Aggregate alerts after exams are compiled',
          'Weekend remedial class schedules and urgent school reopening circulars',
          'Fee payment confirmations and balance reminders'
        ]
      },
      {
        heading: 'Updating Your Phone Number',
        bullets: [
          'Promptly inform the Basic 9 Form Master or School Office whenever a guardian phone number changes.',
          'All official SMS messages from our portal display sender ID KpandoAngli.'
        ]
      }
    ]
  }
];

export const STARTER_NEWS_BULLETINS = [
  {
    id: 'sample-news-1',
    category: 'Academics',
    date: 'Sample Notice',
    title: 'Basic 9 Intensive Saturday BECE Clinics & Mock Diagnostics Underway',
    summary:
      'Basic 9 candidates are reminded to report every Saturday at 8:00 AM with their Mathematical Sets and Mock past question packs. Printed A4 Mock Report Cards will be distributed to parents immediately after grading.'
  },
  {
    id: 'sample-news-2',
    category: 'PTA Notice',
    date: 'Sample Notice',
    title: 'Parent SMS Number Verification Exercise for All Basic 7–9 Families',
    summary:
      'Parents and guardians who recently changed their phone numbers are encouraged to submit updated contacts through the School Office so they do not miss live PTA alerts and Mock Aggregate updates.'
  },
  {
    id: 'sample-news-3',
    category: 'Admissions',
    date: 'Sample Notice',
    title: 'New Academic Intake Inquiries Now Open Across KG, Primary & JHS',
    summary:
      'Prospective families within Kpando Municipality may now submit an online admission inquiry directly on this portal or visit the Administration Office Monday–Friday from 7:30 AM to 3:30 PM.'
  }
];

export const COMMUNITY_TESTIMONIALS = [
  {
    id: 'test-1',
    quote:
      'Receiving clear printed mock report cards and SMS reminders before every PTA meeting helped our family track my daughter’s Science and Maths improvement right up to BECE.',
    author: 'Mrs. Akosua B. (Sample Parent)',
    role: 'Parent of Basic 9 Graduate'
  },
  {
    id: 'test-2',
    quote:
      'The teachers blend strong Anglican discipline with practical laboratory experiments and Saturday clinics. Every learner is known by name and pushed to aim higher.',
    author: 'Mr. Wisdom K. (Sample PTA Exec.)',
    role: 'PTA Executive Representative'
  },
  {
    id: 'test-3',
    quote:
      'From serving as a school prefect to tending our campus vegetable plots and science circuits, Kpando Anglican built the confidence I carried into Senior High School.',
    author: 'Master Daniel A. (Sample Alumnus)',
    role: 'Former Senior Prefect'
  }
];

export const DEPARTMENT_CONTACTS = [
  {
    department: 'Headteacher’s Office & Administration',
    hours: 'Mon – Fri • 7:30 AM – 3:30 PM',
    description: 'General governance, official school letters, transfers, and community partnerships.'
  },
  {
    department: 'Admissions & Placement Desk',
    hours: 'Mon – Fri • 8:00 AM – 2:30 PM',
    description: 'New pupil applications (KG 1 – Basic 9), prospectus inquiries, and placement assessments.'
  },
  {
    department: 'Basic 9 BECE & WebSBA Examinations Office',
    hours: 'Mon – Fri & Sat 8:00 AM – 1:00 PM',
    description: 'Mock exam scripts, printed A4 report cards, WAEC registration, and CSSPS counseling.'
  },
  {
    department: 'PTA, Fee Receipts & Parent SMS Desk',
    hours: 'Mon – Fri • 8:00 AM – 3:00 PM',
    description: 'Official payment receipt verification, PTA dues records, and guardian phone updates.'
  }
];
