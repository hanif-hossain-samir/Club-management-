import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  ShieldCheck, 
  Search, 
  ArrowUpRight, 
  Sparkles, 
  Compass, 
  Heart,
  ChevronRight,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';
import { Club, ClubEvent, ClubWing } from '../types.ts';
import { WingIcon } from '../components/WingIcon.tsx';

interface HomePageProps {
  clubs: Club[];
  events: ClubEvent[];
  setActiveTab: (tab: string) => void;
  onSelectEvent: (event: ClubEvent) => void;
  onSelectWing: (wing: ClubWing) => void;
}

const CAMPUS_SLIDES = [
  {
    url: '/assets/aistudio/1613373427632_b0f44fb6.jpg',
    title: 'City University Permanent Campus',
    subtitle: 'Khagan, Birulia, Savar · Lush academic quad & campus facilities',
    tag: 'Academic Campus'
  },
  {
    url: '/assets/aistudio/Cityuniversitynight_8d1ad3d9.png',
    title: 'Campus Life at Night',
    subtitle: 'Illuminated campus architecture & vibrant university environment',
    tag: 'Campus Night View'
  },
  {
    url: '/assets/aistudio/images__1__66268473.jpg',
    title: 'Top Ranking Private University',
    subtitle: 'Fostering excellence across technology, cultural & sports wings',
    tag: 'Academic Excellence'
  }
];

export const HomePage: React.FC<HomePageProps> = ({
  clubs,
  events,
  setActiveTab,
  onSelectEvent,
  onSelectWing
}) => {
  const [selectedClubTab, setSelectedClubTab] = useState<'all' | 'computer_club' | 'events_and_clubs'>('all');
  const [interestedEventIds, setInterestedEventIds] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  // Auto moving modern slider under 3 seconds (2400ms interval)
  useEffect(() => {
    if (isSliderHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % CAMPUS_SLIDES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isSliderHovered]);

  const getWingIcon = (slug: string) => {
    switch (slug) {
      case 'programming': return Code2;
      case 'cyber_security': return ShieldCheck;
      case 'research': return Search;
      case 'sports': return ArrowUpRight;
      case 'cultural': return Sparkles;
      case 'tour': return Compass;
      default: return Code2;
    }
  };

  // CUCC Wings strictly (programming, cyber_security, research)
  const cuccClub = clubs.find(c => c.id === 'computer_club');
  const filteredWings = (cuccClub?.wings || []).filter(w => 
    w.slug === 'programming' || w.slug === 'cyber_security' || w.slug === 'research'
  );

  // Upcoming featured events driven directly from CUCC events
  const featuredEvents = events
    .filter(e => e.clubId === 'computer_club')
    .slice(0, 3)
    .map(evt => {
      const parts = evt.date.split('-');
      const day = parts[2] || '08';
      const month = parts[1] === '11' ? 'NOV' : parts[1] === '12' ? 'DEC' : 'NOV';
      return {
        id: evt.id,
        day,
        month,
        kicker: evt.kicker || `${evt.category.toUpperCase()} · ${evt.wingSlug.replace('_', ' ').toUpperCase()}`,
        title: evt.title,
        description: `${evt.description} · ${evt.time} · ${evt.venue}`,
        wingSlug: evt.wingSlug,
        eventRef: evt
      };
    });

  const handleInterestClick = (eventItem: typeof featuredEvents[0]) => {
    if (!interestedEventIds.includes(eventItem.id)) {
      setInterestedEventIds(prev => [...prev, eventItem.id]);
    }
    if (eventItem.eventRef) {
      onSelectEvent(eventItem.eventRef);
    } else {
      setActiveTab('events');
    }
  };

  const scrollToClubs = () => {
    const el = document.getElementById('clubs-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('clubs');
    }
  };

  const scrollToEvents = () => {
    const el = document.getElementById('events-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('events');
    }
  };

  const handleExploreClub = (wingSlug: string) => {
    const targetWing = clubs.flatMap(c => c.wings).find(w => w.slug === wingSlug);
    if (targetWing) {
      onSelectWing(targetWing);
    } else {
      setActiveTab('clubs');
    }
  };

  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      
      {/* =========================================================================
          HERO SECTION (FAITHFUL RECREATION OF SCREENSHOT 1 & 2)
          ========================================================================= */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Typography, CTAs, and Community Avatars */}
            <div className="lg:col-span-6 space-y-8 z-10">
              
              {/* Kicker tag: Official University Seal linking to varsity website */}
              <a 
                href="https://cityuniversity.ac.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-red-50/90 dark:bg-[#2A141D] border border-red-200/80 dark:border-red-900/60 hover:bg-red-100 dark:hover:bg-[#3d1827] transition-all cursor-pointer group/kicker shadow-xs"
                title="Click logo to visit City University official website: https://cityuniversity.ac.bd/"
              >
                <div className="w-5 h-5 rounded-full bg-white p-0.5 shadow-xs overflow-hidden flex items-center justify-center shrink-0 group-hover/kicker:scale-110 transition-transform">
                  <img 
                    src="/city-university-logo.jpg" 
                    alt="City University Crest" 
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#D40000] dark:text-[#E5486B]">
                  YOUR CAMPUS, YOUR COMMUNITY
                </span>
                <ExternalLink className="w-3 h-3 text-[#D40000] dark:text-[#E5486B] opacity-70 group-hover/kicker:opacity-100 transition-opacity" />
              </a>

              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
                  City University
                </h1>
                <h2 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-[#D40000] dark:text-[#D40000] leading-[1.1]">
                  Events & Clubs
                </h2>
              </div>

              {/* Subtitle Description */}
              <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed max-w-lg font-normal">
                Discover clubs, join the conversation, and make campus life unforgettable. There’s a place for every passion at City University.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={scrollToClubs}
                  className="bg-[#D40000] hover:bg-[#700000] active:scale-95 text-white font-semibold px-6 py-3.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer text-sm sm:text-base"
                >
                  <span>Explore clubs</span>
                  <span className="text-base">↗</span>
                </button>

                <button
                  onClick={scrollToEvents}
                  className="bg-transparent dark:bg-[#1E1B22] border border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-800 dark:text-neutral-200 font-semibold px-6 py-3.5 rounded-xl shadow-xs transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/60 cursor-pointer text-sm sm:text-base"
                >
                  <span>Upcoming events</span>
                </button>
              </div>

              {/* Community Tagline */}
              <div className="pt-2">
                <p className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                  One campus. Many communities.
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                  Learn, lead, create, and connect.
                </p>
              </div>

            </div>

            {/* Right Column: Architectural Campus Illustration & Floating Badge Composition */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
              
              {/* Background delicate orbital curved line and 4-point sparkle stars */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full border border-neutral-200/60 dark:border-neutral-800/60 -rotate-12"></div>
              </div>

              {/* Subtle decorative sparkles (✦) */}
              <div className="absolute -top-4 left-4 text-[#D40000] dark:text-[#E5486B] text-xl opacity-60">
                ✦
              </div>
              <div className="absolute -bottom-2 right-4 text-[#D40000] dark:text-[#E5486B] text-xl opacity-60">
                ✦
              </div>

              {/* Modern Auto-Moving Campus Image Slider (duration under 3s) */}
              <div 
                className="relative w-full max-w-[500px] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 dark:border-[#380E1C] shadow-2xl group/slider transition-all duration-300"
                onMouseEnter={() => setIsSliderHovered(true)}
                onMouseLeave={() => setIsSliderHovered(false)}
              >
                {/* Image Slides Display Area */}
                <div className="relative w-full h-[340px] sm:h-[380px] overflow-hidden bg-neutral-950">
                  {CAMPUS_SLIDES.map((slide, idx) => {
                    const isActive = idx === currentSlide;
                    return (
                      <div
                        key={slide.url}
                        className={`absolute inset-0 transition-all duration-700 ease-out ${
                          isActive 
                            ? 'opacity-100 z-10 scale-100' 
                            : 'opacity-0 z-0 scale-105 pointer-events-none'
                        }`}
                      >
                        <img
                          src={slide.url}
                          alt={slide.title}
                          className="w-full h-full object-cover select-none"
                        />
                        {/* Film grain and dark gradient for high readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 pointer-events-none" />
                        <div className="absolute inset-0 bg-[#D40000]/10 mix-blend-overlay pointer-events-none" />
                      </div>
                    );
                  })}

                  {/* Top Bar: Campus Badge, Auto indicator & Live Slide Counter */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between gap-2 pointer-events-none">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold tracking-wide shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#E5486B] animate-pulse" />
                      <span>{CAMPUS_SLIDES[currentSlide].tag}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono font-medium shadow-sm">
                      <span className="text-[#E5486B] font-bold">0{currentSlide + 1}</span>
                      <span className="opacity-40">/</span>
                      <span className="opacity-70">0{CAMPUS_SLIDES.length}</span>
                    </div>
                  </div>

                  {/* Previous & Next Manual Controls (visible on hover) */}
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + CAMPUS_SLIDES.length) % CAMPUS_SLIDES.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-[#D40000] text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-200 backdrop-blur-md border border-white/20 cursor-pointer shadow-lg active:scale-95"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % CAMPUS_SLIDES.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-[#D40000] text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-200 backdrop-blur-md border border-white/20 cursor-pointer shadow-lg active:scale-95"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Bottom Captions & Modern Dynamic Progress Segment Bars */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-6 flex flex-col gap-3">
                    <div className="space-y-1">
                      <h3 className="text-white text-lg sm:text-xl font-bold font-heading leading-tight drop-shadow-md">
                        {CAMPUS_SLIDES[currentSlide].title}
                      </h3>
                      <p className="text-white/85 text-xs sm:text-[13px] leading-snug line-clamp-2 drop-shadow-sm">
                        {CAMPUS_SLIDES[currentSlide].subtitle}
                      </p>
                    </div>

                    {/* Progress Indicator Bars (<3s auto slide indicator) */}
                    <div className="flex items-center gap-2 pt-1.5">
                      {CAMPUS_SLIDES.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className="flex-1 h-1.5 rounded-full bg-white/25 hover:bg-white/40 overflow-hidden cursor-pointer focus:outline-none transition-all"
                          aria-label={`Jump to slide ${idx + 1}`}
                        >
                          <div
                            className={`h-full rounded-full transition-all ${
                              idx === currentSlide
                                ? 'w-full duration-2400 ease-linear bg-gradient-to-r from-[#E5486B] to-white'
                                : idx < currentSlide
                                ? 'w-full bg-white/70'
                                : 'w-0'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Slider Footer Bar with Official Varsity Portal Link & Quick Jump */}
                <div className="bg-[#14040A] dark:bg-[#120308] border-t border-[#380E1C] px-4 py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-neutral-300">
                      City University Campus · Dhaka
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://cityuniversity.ac.bd/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 hover:bg-[#D40000] border border-red-800/60 text-[11px] font-semibold text-red-100 hover:text-white transition-all cursor-pointer"
                      title="Visit official varsity website: https://cityuniversity.ac.bd/"
                    >
                      <span>cityuniversity.ac.bd</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={scrollToClubs}
                      aria-label="Scroll to clubs"
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#D40000] text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Explore Clubs & Wings"
                    >
                      <span className="text-xs font-bold leading-none">↗</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          CUCC CLUB & 3 SPECIALIZED WINGS
          ========================================================================= */}
      <section id="clubs-section" className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Row for CUCC Wings */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-100 dark:border-[#380E1C]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-[#D40000] dark:text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
                City University Computer Club (CUCC)
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                3 Specialized Technological Wings
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
              Lead by Controller Tanvir Ahmed across competitive programming, cybersecurity defense, and scientific research.
            </p>
          </div>

          {/* 3-Column Grid of CUCC Club Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredWings.map((wing) => {
              const Icon = getWingIcon(wing.slug);
              return (
                <div
                  key={wing.id}
                  className="bg-white dark:bg-[#1A060E] border border-neutral-100 dark:border-[#380E1C] rounded-2xl p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-5">
                    
                    {/* Pale Pink / Deep Crimson Icon Box */}
                    <div className="w-12 h-12 rounded-2xl bg-[#FDF0F3] dark:bg-[#2C0A17] flex items-center justify-center text-[#D40000] dark:text-[#E5486B] transition-transform group-hover:scale-105">
                      <WingIcon slug={wing.slug} className="w-6 h-6" />
                    </div>

                    {/* Kicker & Title */}
                    <div>
                      <p className="text-[11px] font-bold text-[#D40000] dark:text-[#E5486B] uppercase tracking-[0.14em]">
                        {wing.kicker}
                      </p>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1.5 tracking-tight">
                        {wing.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                      {wing.shortDesc}
                    </p>

                  </div>

                  {/* Explore this club link at bottom */}
                  <div className="pt-6">
                    <button
                      onClick={() => handleExploreClub(wing.slug)}
                      className="text-sm font-semibold text-[#D40000] dark:text-[#E5486B] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore this club</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          WHAT'S HAPPENING NEXT? EVENTS SECTION (FAITHFUL RECREATION OF SCREENSHOT 4)
          ========================================================================= */}
      <section id="events-section" className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Row: SAVE THE DATE / What's happening next? + Supporting Text */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-bold text-[#D40000] dark:text-[#E5486B] uppercase tracking-[0.16em] mb-2">
                SAVE THE DATE
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                What’s happening <span className="text-[#D40000] dark:text-[#E5486B]">next?</span>
              </h2>
            </div>

            <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base max-w-md font-normal leading-relaxed">
              Get involved in workshops, competitions, celebrations, and experiences happening around campus.
            </p>
          </div>

          {/* Stacked Event Cards */}
          <div className="space-y-4">
            {featuredEvents.map((item) => {
              const isInterested = interestedEventIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#1A060E] border border-neutral-100 dark:border-[#380E1C] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    
                    {/* Date Badge: Pink rounded square with Day & Month */}
                    <div className="w-16 h-16 rounded-2xl bg-[#FDF0F3] dark:bg-[#2C0A17] flex flex-col items-center justify-center shrink-0">
                      <span className="text-xl sm:text-2xl font-bold text-[#D40000] dark:text-[#E5486B] leading-none">
                        {item.day}
                      </span>
                      <span className="text-[10px] font-bold text-[#D40000] dark:text-[#E5486B] uppercase tracking-wider mt-0.5">
                        {item.month}
                      </span>
                    </div>

                    {/* Event Details */}
                    <div>
                      <p className="text-[11px] font-bold text-[#D40000] dark:text-[#E5486B] uppercase tracking-wider">
                        {item.kicker}
                      </p>
                      <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        {item.description}
                      </p>
                    </div>

                  </div>

                  {/* Right Action Button: I'm interested ↗ */}
                  <div className="sm:self-center shrink-0">
                    <button
                      onClick={() => handleInterestClick(item)}
                      className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isInterested
                          ? 'bg-[#D40000] text-white shadow-xs'
                          : 'border border-neutral-200 dark:border-neutral-700/80 hover:border-[#D40000] text-neutral-800 dark:text-neutral-200 hover:text-[#D40000] dark:hover:text-[#E5486B]'
                      }`}
                    >
                      <span>{isInterested ? 'Registered' : "I'm interested"}</span>
                      <span>↗</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom link to view full calendar */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setActiveTab('events')}
              className="text-sm font-semibold text-[#D40000] dark:text-[#E5486B] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View full semester calendar & all events</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Official City University DSW Charter Banner with Logo */}
      <section className="pb-16 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-50 via-white to-red-50 dark:from-[#230713] dark:via-[#19050E] dark:to-[#230713] border border-red-100 dark:border-[#4D1225] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-md ring-2 ring-red-100 dark:ring-red-900/60 overflow-hidden flex items-center justify-center shrink-0">
                <img 
                  src="/city-university-logo.jpg" 
                  alt="City University Official Logo" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
                    City University
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D40000] text-white">
                    Official Central Portal
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 max-w-xl">
                  "...creating a culture of excellence" · City University Computer Club (CUCC) empowering 3 specialized wings in software, cybersecurity defense, and scientific research.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={scrollToClubs}
                className="px-5 py-2.5 rounded-xl bg-[#D40000] hover:bg-[#700000] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Explore CUCC Wings
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-[#D40000] text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Campus Charter
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
