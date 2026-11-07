import React, { useState } from 'react';
import { 
  Code2, 
  ShieldAlert, 
  Microscope, 
  Trophy, 
  Sparkles, 
  Compass, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Award,
  ChevronRight,
  Shield,
  BookOpen
} from 'lucide-react';
import { Club, ClubWing, ClubCategory, ClubSubsector } from '../types.ts';
import { WingIcon } from '../components/WingIcon.tsx';

interface ClubsPageProps {
  clubs: Club[];
  selectedWing: ClubWing | null;
  setSelectedWing: (wing: ClubWing | null) => void;
  setActiveTab: (tab: string) => void;
}

export const ClubsPage: React.FC<ClubsPageProps> = ({
  clubs,
  selectedWing,
  setSelectedWing,
  setActiveTab
}) => {
  // Strictly CUCC
  const currentClub = clubs.find(c => c.id === 'computer_club') || clubs[0];
  const cuccWings = currentClub.wings.filter(w => 
    w.slug === 'programming' || w.slug === 'cyber_security' || w.slug === 'research'
  );
  const [activeWingSlug, setActiveWingSlug] = useState<ClubSubsector>('programming');

  React.useEffect(() => {
    if (selectedWing && (selectedWing.slug === 'programming' || selectedWing.slug === 'cyber_security' || selectedWing.slug === 'research')) {
      setActiveWingSlug(selectedWing.slug);
      setSelectedWing(null);
    }
  }, [selectedWing, setSelectedWing]);

  const activeWing = cuccWings.find(w => w.slug === activeWingSlug) || cuccWings[0];

  const getWingIcon = (slug: ClubSubsector, isSelected: boolean = false) => {
    return <WingIcon slug={slug} isSelected={isSelected} className="w-5 h-5" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-[#D40000] dark:text-red-300 text-xs font-bold uppercase tracking-wider">
          Official University Club Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 dark:text-white">
          City University Computer Club (CUCC)
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Premier technological society with 3 specialized wings dedicated to software engineering, offensive & defensive security, and academic scientific innovation.
        </p>
      </div>

      {/* Club Meta Card */}
      <div className="bg-gradient-to-r from-red-950 via-[#700000] to-[#D40000] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-2.5 py-0.5 rounded bg-amber-400 text-red-950 font-bold uppercase">
              {currentClub.shortCode}
            </span>
            <span className="text-red-200">Established {currentClub.establishedYear}</span>
            <span className="text-red-200">•</span>
            <span className="text-red-200">{currentClub.totalMembers} Registered Student Members</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            {currentClub.name}
          </h2>

          <p className="text-sm text-red-100 italic leading-relaxed">
            "{currentClub.motto}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-red-300/30 text-xs">
            <div>
              <span className="text-red-200 block text-[10px] uppercase font-semibold">Faculty Advisor</span>
              <span className="font-bold text-white">{currentClub.advisorName}</span>
              <span className="block text-red-200 text-[11px]">{currentClub.advisorDesignation}</span>
            </div>
            <div>
              <span className="text-red-200 block text-[10px] uppercase font-semibold">Student President</span>
              <span className="font-bold text-white">{currentClub.presidentName}</span>
              <span className="block text-red-200 text-[11px]">Central Student Council</span>
            </div>
            <div>
              <span className="text-red-200 block text-[10px] uppercase font-semibold">Contact & Hotline</span>
              <span className="font-bold text-white">{currentClub.email}</span>
              <span className="block text-red-200 text-[11px]">{currentClub.hotline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subsector Wings Interactive Navigation */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg font-heading text-neutral-900 dark:text-white">
            Specialized Wings for {currentClub.shortCode}
          </h3>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Select a wing below to inspect leadership, schedule, activities and achievements
          </span>
        </div>

        {/* 3 Wings Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cuccWings.map((wing) => {
            const isSelected = activeWingSlug === wing.slug;
            return (
              <button
                key={wing.id}
                onClick={() => setActiveWingSlug(wing.slug)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-red-50 dark:bg-[#230913] border-[#D40000] dark:border-red-600 ring-2 ring-red-400/30 shadow-md'
                    : 'bg-white dark:bg-[#18050E] border-neutral-200 dark:border-[#380E1C] hover:border-red-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-[#D40000] text-white' : 'bg-neutral-100 dark:bg-[#2A0916] text-neutral-700 dark:text-neutral-300'}`}>
                    {getWingIcon(wing.slug, isSelected)}
                  </div>
                  <div>
                    <span className="text-[10px] text-[#D40000] dark:text-red-400 font-bold uppercase tracking-wider block">
                      {wing.kicker}
                    </span>
                    <h4 className={`font-bold text-sm ${isSelected ? 'text-[#D40000] dark:text-red-300' : 'text-neutral-900 dark:text-white'}`}>
                      {wing.name}
                    </h4>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-medium">
                      {wing.badge}
                    </span>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#D40000] dark:text-red-400' : 'text-neutral-400'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Wing Deep Dive Detail */}
      {activeWing && (
        <div className="bg-white dark:bg-[#17050E] border border-neutral-200 dark:border-[#3D101E] rounded-2xl overflow-hidden shadow-lg transition-all animate-in fade-in duration-200">
          
          {/* Banner & Title */}
          <div className="relative h-64 sm:h-72 overflow-hidden">
            <img
              src={activeWing.bannerUrl}
              alt={activeWing.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded bg-[#D40000] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  {activeWing.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-neutral-200 text-xs font-bold uppercase tracking-wider border border-white/20">
                  {activeWing.kicker}
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-heading">
                {activeWing.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-200 max-w-2xl line-clamp-2">
                {activeWing.fullDesc}
              </p>
            </div>
          </div>

          {/* Quick Schedule & Meeting Details Banner */}
          <div className="bg-neutral-50 dark:bg-[#1E0712] border-b border-neutral-200 dark:border-[#3D101E] p-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#D40000] dark:text-red-400 shrink-0" />
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-bold">Weekly Schedule</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{activeWing.weeklySchedule}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#D40000] dark:text-red-400 shrink-0" />
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-bold">Physical Base / Lab</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{activeWing.roomLocation}</span>
              </div>
            </div>
          </div>

          {/* 3-Column Detailed Information */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Col 1: Vision & Key Activities (Col 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <h4 className="font-bold text-base font-heading text-neutral-900 dark:text-white flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-[#D40000] dark:text-red-400" />
                  Mission & Strategic Vision
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-[#1A1B27] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  {activeWing.vision}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-base font-heading text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#D40000] dark:text-red-400" />
                  Regular Activities & Flagship Programs
                </h4>
                <div className="space-y-2">
                  {activeWing.keyActivities.map((act, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-[#1A1B27] border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/80 text-[#D40000] dark:text-red-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Laurels & Achievements */}
              <div>
                <h4 className="font-bold text-base font-heading text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-[#D40000] dark:text-red-400" />
                  Recent Achievements & University Honors
                </h4>
                <div className="space-y-3">
                  {activeWing.pastAchievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-amber-200 dark:border-[#3E2818] bg-amber-50/50 dark:bg-[#1B140E] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                          {ach.title}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold font-mono text-[10px]">
                          {ach.year}
                        </span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                        {ach.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Col 2: Leadership & Membership Process (Col 5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Conveners & Leadership Card */}
              <div className="bg-neutral-50 dark:bg-[#181926] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Wing Leadership & Conveners
                </h4>

                <div className="space-y-3">
                  {activeWing.conveners.map((conv) => (
                    <div key={conv.id} className="flex items-center gap-3 bg-white dark:bg-[#12131C] p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-300 dark:border-neutral-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-neutral-900 dark:text-neutral-100 truncate">
                          {conv.name}
                        </p>
                        <p className="text-[#D40000] dark:text-red-400 font-semibold text-[11px]">
                          {conv.designation}
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-400 text-[10px] truncate">
                          Dept. of {conv.department}
                        </p>
                        <p className="text-neutral-400 text-[10px] truncate mt-0.5">
                          {conv.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
