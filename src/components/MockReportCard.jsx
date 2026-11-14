import React from 'react';
import { JHS_SUBJECTS } from '../constants/schoolConstants';
import { generateMockAdvisory } from '../utils/calculations';
import ghanaCoaImg from '../assets/ghana-coa.svg?inline';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function MockReportCard({
  studentResult,
  activeClass,
  activeMock,
  rollCount,
  schoolProfile
}) {
  if (!studentResult) return null;

  const maxTotal = JHS_SUBJECTS.length * 100;
  const engScore = studentResult.subjects?.ENG?.score ?? 0;
  const mathScore = studentResult.subjects?.MATHS?.score ?? 0;
  const sciScore = studentResult.subjects?.SCI?.score ?? 0;
  const advisory = generateMockAdvisory(
    studentResult.name,
    studentResult.aggregate,
    mathScore,
    sciScore,
    engScore
  );

  return (
    <div className="print-page bg-white text-black p-6 border border-zinc-300 shadow-lg max-w-[800px] mx-auto space-y-4 font-sans">
      {/* 1. Official GES & School Header */}
      <div className="text-center border-b-2 border-black pb-3 relative px-20 min-h-[82px] flex flex-col justify-center">
        <img
          src={ghanaCoaImg}
          alt="Ghana Coat of Arms"
          className="absolute left-0 top-1 w-16 h-16 object-contain"
        />
        <img
          src="/anglican-crest.png"
          alt="Kpando Anglican Basic School Crest"
          className="absolute right-0 top-1 w-16 h-16 object-contain"
        />
        <div className="text-xs font-bold uppercase tracking-widest">Ghana Education Service</div>
        <div className="text-xs font-semibold uppercase tracking-wider">{schoolProfile.district}</div>
        <h1 className="text-lg font-black uppercase tracking-wide mt-0.5">{schoolProfile.schoolName}</h1>
        <div className="text-sm font-extrabold uppercase tracking-widest mt-1 border-t border-zinc-300 pt-1">
          {activeClass} Mock Examination Report Card — {activeMock}
        </div>
      </div>

      {/* 2. Learner Biodata Grid */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-semibold pb-3 border-b border-zinc-300">
        <div className="flex gap-2 items-end">
          <span className="uppercase w-28 shrink-0">Learner Name:</span>
          <span className="font-bold border-b border-zinc-500 flex-1 pb-0.5">{studentResult.name}</span>
        </div>
        <div className="flex gap-2 items-end">
          <span className="uppercase w-32 shrink-0">Class Position:</span>
          <span className="font-black border-b border-zinc-500 flex-1 pb-0.5">{studentResult.overallRank}</span>
        </div>

        <div className="flex gap-2 items-end">
          <span className="uppercase w-28 shrink-0">Index Number:</span>
          <span className="font-mono font-bold border-b border-zinc-500 flex-1 pb-0.5">{studentResult.indexNo || '-'}</span>
        </div>
        <div className="flex gap-2 items-end">
          <span className="uppercase w-32 shrink-0">No. On Roll:</span>
          <span className="font-bold border-b border-zinc-500 flex-1 pb-0.5">{rollCount}</span>
        </div>

        <div className="flex gap-2 items-end">
          <span className="uppercase w-28 shrink-0">Class / Level:</span>
          <span className="font-bold border-b border-zinc-500 flex-1 pb-0.5">{activeClass}</span>
        </div>
        <div className="flex gap-2 items-end">
          <span className="uppercase w-32 shrink-0">Academic Year:</span>
          <span className="font-bold border-b border-zinc-500 flex-1 pb-0.5">{schoolProfile.academicYear}</span>
        </div>

        <div className="flex gap-2 items-end">
          <span className="uppercase w-28 shrink-0">Mock Date:</span>
          <span className="font-bold border-b border-zinc-500 flex-1 pb-0.5">{formatDate(schoolProfile.examDate)}</span>
        </div>
        <div className="flex gap-2 items-end">
          <span className="uppercase w-32 shrink-0">Next Term Begins:</span>
          <span className="font-bold border-b border-zinc-500 flex-1 pb-0.5">{formatDate(schoolProfile.reopeningDate)}</span>
        </div>
      </div>

      {/* 3. Prominent BECE Aggregate & Total Score Box */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="border-2 border-black rounded-lg p-2.5 bg-zinc-100">
          <div className="text-[10px] font-bold uppercase tracking-wider">BECE Aggregate (Best 6)</div>
          <div className="text-2xl font-black mt-0.5">{studentResult.aggregate}</div>
          <div className="text-[10px] font-semibold text-zinc-700">
            4 Core ({studentResult.coreSum}) + Best 2 Elec ({studentResult.bestElectivesSum})
          </div>
        </div>
        <div className="border border-black rounded-lg p-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wider">Overall Mock Score</div>
          <div className="text-2xl font-black mt-0.5 font-mono">
            {studentResult.overallTotal} <span className="text-xs font-normal">/ {maxTotal}</span>
          </div>
          <div className="text-[10px] font-semibold text-zinc-700">Mean Average: {studentResult.average}%</div>
        </div>
        <div className="border border-black rounded-lg p-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wider">BECE Standing</div>
          <div className="text-sm font-black mt-2">{studentResult.division}</div>
          <div className="text-[10px] font-semibold text-zinc-700">100% Mock Assessment</div>
        </div>
      </div>

      {/* 4. 9-Subject Mock Results Table */}
      <table className="w-full border-collapse border border-black text-xs">
        <thead>
          <tr className="bg-zinc-200 font-bold uppercase text-[11px] text-center">
            <th className="border border-black px-2.5 py-1.5 text-left">Subject</th>
            <th className="border border-black px-2 py-1.5 w-24">Group</th>
            <th className="border border-black px-2 py-1.5 w-24">Mock Score (100%)</th>
            <th className="border border-black px-2 py-1.5 w-16">Grade</th>
            <th className="border border-black px-2 py-1.5 w-16">Rank</th>
            <th className="border border-black px-2.5 py-1.5 text-left">Remark</th>
          </tr>
        </thead>
        <tbody>
          {JHS_SUBJECTS.map((sub) => {
            const sr = studentResult.subjects?.[sub.key] || {
              score: 0, grade: '9', rank: '-', remark: 'Lowest'
            };
            const countedInAgg = sub.isCore || studentResult.bestElectiveKeys?.includes(sub.key);

            return (
              <tr key={sub.key} className="border-b border-zinc-400">
                <td className="border border-black px-2.5 py-1.5 font-semibold">
                  {sub.name}{' '}
                  {countedInAgg && <span className="text-[10px] font-black">*</span>}
                </td>
                <td className="border border-black px-2 py-1.5 text-center text-[10px] uppercase font-semibold">
                  {sub.isCore ? 'Core' : countedInAgg ? 'Elective (Best 2)' : 'Elective'}
                </td>
                <td className="border border-black px-2 py-1.5 text-center font-mono font-bold">
                  {sr.score}
                </td>
                <td className="border border-black px-2 py-1.5 text-center font-black">
                  {sr.grade}
                </td>
                <td className="border border-black px-2 py-1.5 text-center font-mono">
                  {sr.rank}
                </td>
                <td className="border border-black px-2.5 py-1.5 font-medium">
                  {sr.remark}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-[10px] italic text-zinc-700">
        * Subjects marked with an asterisk (4 Core + Best 2 Electives) form the learner&apos;s BECE Aggregate ({studentResult.aggregate}). Scale: 1 (90–100) to 9 (0–34).
      </div>

      {/* 5. Qualitative Remarks & Advisory */}
      <div className="grid grid-cols-1 gap-y-2 text-xs pt-2 border-t border-zinc-300">
        <div className="flex gap-4">
          <div className="flex-1 flex gap-2 items-center">
            <span className="font-bold uppercase w-24">Attendance:</span>
            <span className="font-semibold border-b border-zinc-400 flex-1">
              {studentResult.attendance || 0} out of {schoolProfile.timesOpen || 65}
            </span>
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <span className="font-bold uppercase w-20">Conduct:</span>
            <span className="font-semibold border-b border-zinc-400 flex-1">{studentResult.conduct || 'Satisfactory'}</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-bold uppercase w-24">Interest:</span>
          <span className="font-semibold border-b border-zinc-400 flex-1">{studentResult.interest || 'General Studies'}</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-bold uppercase w-40">Teacher&apos;s Remarks:</span>
          <span className="font-semibold border-b border-zinc-400 flex-1">{studentResult.remarks || 'Good effort; continue preparing for BECE.'}</span>
        </div>
      </div>

      <div className="border border-zinc-400 rounded-lg p-2.5 bg-zinc-50 text-[11px] leading-snug">
        <span className="font-bold uppercase block mb-0.5">BECE Readiness Advisory for Parent/Guardian:</span>
        {advisory}
      </div>

      {/* 6. Signatures */}
      <div className="grid grid-cols-2 gap-8 text-center text-[10px] font-bold uppercase pt-6">
        <div>
          <div className="border-t border-black pt-1 mx-auto max-w-[200px]">Class Teacher&apos;s Signature</div>
          <div className="font-normal capitalize text-zinc-700">{schoolProfile.basic9TeacherName}</div>
        </div>
        <div>
          <div className="border-t border-black pt-1 mx-auto max-w-[200px]">Headmaster&apos;s Signature &amp; Stamp</div>
          <div className="font-normal capitalize text-zinc-700">{schoolProfile.headmasterName}</div>
        </div>
      </div>
    </div>
  );
}
