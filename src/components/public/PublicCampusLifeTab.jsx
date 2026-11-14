import React, { useState, useEffect, useMemo } from 'react';
import {
  Award, Building, Camera, ChevronLeft, ChevronRight,
  Clock, Shield, Sparkles, Users, X
} from 'lucide-react';
import {
  CAMPUS_FACILITIES,
  CO_CURRICULAR_CLUBS,
  GALLERY_CATEGORIES,
  HERO_SLIDES,
  SCHOOL_HOUSES
} from '../../constants/publicSiteData';
import { PublicPageHero } from './PublicSharedUI';

export default function PublicCampusLifeTab({ schoolProfile, onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('All Photos');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'All Photos') return HERO_SLIDES;
    return HERO_SLIDES.filter((slide) => slide.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, filteredPhotos.length]);

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <div>
      <PublicPageHero
        breadcrumb="Campus Life & Gallery"
        badge="11 Campus Photos • Clubs & Houses"
        title="Vibrant Student Life Beyond Textbooks"
        description={`Explore practical science investigations, school agriculture harvests, student prefect leadership, clubs, and inter-house life across ${schoolProfile.schoolName}.`}
        onNavigate={onNavigate}
        rightContent={
          <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-300" /> Click any photo to enlarge
          </div>
        }
      />

      {/* 1. Interactive Category-Filtered Campus Photo Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> Official Photo Archive
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Campus &amp; Practical Learning Gallery ({filteredPhotos.length})
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo, idx) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className="text-left glass-card overflow-hidden group hover:border-emerald-500 transition-all flex flex-col"
            >
              <div className="aspect-[16/10] bg-emerald-950 overflow-hidden relative">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] font-bold">
                  {photo.category}
                </span>
              </div>
              <div className="p-4 space-y-1 flex-1">
                <h3 className="font-bold text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {photo.alt}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{photo.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Co-Curricular Clubs & Societies */}
      <section className="bg-slate-100 dark:bg-zinc-900/40 border-y border-slate-200 dark:border-zinc-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Clubs &amp; Societies
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Co-Curricular Programs &amp; Learner Leadership
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CO_CURRICULAR_CLUBS.map((club) => (
              <div key={club.name} className="glass-card p-5 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      <Clock className="w-3 h-3" /> {club.schedule}
                    </span>
                  </div>
                  <h3 className="font-black text-base">{club.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{club.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px] font-semibold text-slate-400">
                  Open to Primary &amp; JHS learners
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Campus Facilities & School Houses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12">
        <div className="space-y-5">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" /> Campus Learning Spaces
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-1">Facilities Supporting Everyday Learning</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAMPUS_FACILITIES.map((fac) => (
              <div key={fac.title} className="glass-card p-5 space-y-2 border-l-4 border-l-emerald-700">
                <h3 className="font-bold text-sm">{fac.title}</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{fac.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Inter-House Identity
              </span>
              <h2 className="text-2xl font-black tracking-tight mt-1">School Houses &amp; Friendly Competition</h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              House names shown as customizable placeholders for real school houses
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCHOOL_HOUSES.map((house) => (
              <div key={house.name} className="glass-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                  <Award className="w-4 h-4 shrink-0" />
                  <h3 className="font-black text-sm">{house.name}</h3>
                </div>
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">Motto: “{house.motto}”</div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{house.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.alt}
        >
          <div
            className="w-full max-w-5xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-700 font-bold">{activePhoto.category}</span>
                <span className="font-mono text-white/75">
                  {String(lightboxIndex + 1).padStart(2, '0')} / {String(filteredPhotos.length).padStart(2, '0')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close photo lightbox"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black border border-white/15">
              <img
                src={activePhoto.src}
                alt={activePhoto.alt}
                className="w-full max-h-[72vh] object-contain mx-auto"
              />
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)}
                aria-label="Previous gallery photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length)}
                aria-label="Next gallery photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="text-white space-y-1">
              <h3 className="font-bold text-sm sm:text-base">{activePhoto.alt}</h3>
              <p className="text-xs text-white/75">{activePhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
