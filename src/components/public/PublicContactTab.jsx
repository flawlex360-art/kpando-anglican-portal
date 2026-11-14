import React from 'react';
import {
  Building2, Clock, ExternalLink, Mail, MapPin, Phone, ShieldCheck
} from 'lucide-react';
import { DEPARTMENT_CONTACTS, EXTERNAL_SBA_PORTAL_URL } from '../../constants/publicSiteData';
import { PublicPageHero, WebsiteInquiryForm } from './PublicSharedUI';

export default function PublicContactTab({
  schoolProfile,
  onNavigate,
  onSubmitInquiry
}) {
  const cleanPhone = (schoolProfile.phone || '').replace(/\s+/g, '');
  const cleanB9Phone = (schoolProfile.basic9TeacherPhone || '').replace(/\s+/g, '');
  const mapQuery = encodeURIComponent(`${schoolProfile.schoolName}, Kpando, Volta Region, Ghana`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div>
      <PublicPageHero
        breadcrumb="Contact & Directions"
        badge="Mon – Fri • 7:30 AM – 3:30 PM"
        title="Connect With School Administration"
        description={`Reach out to ${schoolProfile.schoolName} for admissions, Basic 9 BECE updates, fee receipts, guardian SMS number changes, or campus visits.`}
        onNavigate={onNavigate}
        rightContent={
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs transition-colors"
          >
            <MapPin className="w-4 h-4" /> Open Campus Directions <ExternalLink className="w-3.5 h-3.5" />
          </a>
        }
      />

      {/* 1. Primary Contact Card + Department Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-card p-6 sm:p-8 space-y-5 bg-gradient-to-br from-emerald-950 to-teal-950 text-white border-none">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                Official Contact Details
              </span>
              <h2 className="text-xl font-black mt-1">{schoolProfile.schoolName}</h2>
              <p className="text-xs text-emerald-100/80 mt-1">
                Visit our campus office Monday through Friday (7:30 AM – 3:30 PM) or call during working hours.
              </p>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider text-emerald-200">Campus Location</div>
                  <div className="text-xs text-white mt-0.5">
                    {schoolProfile.address} • {schoolProfile.district}
                  </div>
                  <div className="text-[11px] text-emerald-100/75 mt-0.5">
                    {schoolProfile.region} • GhanaPost GPS: Add digital address in Settings
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-300 shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider text-emerald-200">Telephone Lines</div>
                  <div className="flex flex-col gap-1 mt-0.5 text-xs">
                    {schoolProfile.phone && (
                      <a
                        href={`tel:${cleanPhone}`}
                        className="text-white hover:text-amber-300 underline underline-offset-2 font-mono font-bold"
                      >
                        Main Office: {schoolProfile.phone}
                      </a>
                    )}
                    {schoolProfile.basic9TeacherPhone && (
                      <a
                        href={`tel:${cleanB9Phone}`}
                        className="text-emerald-100/90 hover:text-amber-300 underline underline-offset-2 font-mono"
                      >
                        Basic 9 Coordinator: {schoolProfile.basic9TeacherPhone}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-300 shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider text-emerald-200">Official Email</div>
                  {schoolProfile.email ? (
                    <a
                      href={`mailto:${schoolProfile.email}`}
                      className="text-xs text-white hover:text-amber-300 underline underline-offset-2 mt-0.5 block"
                    >
                      {schoolProfile.email}
                    </a>
                  ) : (
                    <div className="text-xs text-emerald-100/75 mt-0.5">
                      Add official school email anytime inside School Settings.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-300 shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider text-emerald-200">Visiting &amp; Remedial Hours</div>
                  <div className="text-xs text-emerald-100/90 mt-0.5">
                    Mon – Fri: 7:30 AM – 3:30 PM
                  </div>
                  <div className="text-xs text-emerald-100/80">
                    Saturday (Basic 9 Clinic): 8:00 AM – 1:00 PM
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 space-y-2.5">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-amber-300" /> View Kpando Location on Google Maps
              </a>
              <a
                href={EXTERNAL_SBA_PORTAL_URL}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" /> Open SBA Grading Portal
              </a>
            </div>
          </div>

          <div className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-black flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              Department Desks Directory
            </h3>
            <div className="space-y-3">
              {DEPARTMENT_CONTACTS.map((dept) => (
                <div
                  key={dept.department}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-1"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-bold text-xs">{dept.department}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">{dept.hours}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">{dept.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <WebsiteInquiryForm
            mode="contact"
            schoolProfile={schoolProfile}
            onSubmitInquiry={onSubmitInquiry}
          />
        </div>
      </section>
    </div>
  );
}
