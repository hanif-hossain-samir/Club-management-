import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="w-full text-neutral-300 font-sans select-text">
      
      {/* Top Red Banner Header */}
      <div className="bg-[#D40000] w-full px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Crest & Title */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center shrink-0">
              <img
                src="/city-university-logo.jpg"
                alt="City University Crest"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-white font-bold text-lg sm:text-xl tracking-tight leading-tight">
                <span>City University Events & Club (CUEC)</span>
                <a
                  href="https://cityuniversity.ac.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  title="Visit City University Official Website"
                >
                  <ExternalLink className="w-4 h-4 text-white inline-block mb-0.5" />
                </a>
              </div>
              <p className="text-white/85 text-xs italic tracking-normal mt-0.5">
                ...creating a culture of excellence
              </p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab?.('clubs')}
              className="bg-white hover:bg-neutral-100 text-[#D40000] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Explore Clubs
            </button>
            <button
              onClick={() => setActiveTab?.('events')}
              className="bg-[#7A0000] hover:bg-[#600000] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              View Calendar
            </button>
          </div>

        </div>
      </div>

      {/* Main 4-Column Footer Content */}
      <div className="bg-[#111113] w-full px-4 sm:px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-[12px] leading-relaxed">
          
          {/* Column 1: ABOUT CUEC */}
          <div className="space-y-4">
            <h4 className="font-bold text-white tracking-wider text-[13px] uppercase">
              ABOUT CUEC
            </h4>
            <p className="text-neutral-300 leading-normal">
              The central authority coordinating extracurricular, academic, and athletic life at City University.
            </p>
            <div className="space-y-2.5 pt-1 text-neutral-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D40000] shrink-0 mt-0.5" />
                <span>Permanent Campus, Khagan, Birulia, Savar, Dhaka</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D40000] shrink-0" />
                <span>+880 2-9876543 (Ext. 201/305)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D40000] shrink-0" />
                <span>dsw.cuec@cityuniversity.edu</span>
              </div>
            </div>
          </div>

          {/* Column 2: 1. COMPUTER CLUB */}
          <div className="space-y-4">
            <h4 className="font-bold text-white tracking-wider text-[13px] uppercase">
              1. COMPUTER CLUB
            </h4>
            <ul className="space-y-3 text-neutral-300">
              <li>
                <button
                  onClick={() => setActiveTab?.('clubs')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  <span className="text-neutral-400 mr-1.5">•</span>
                  <strong className="font-medium text-neutral-200">Programming Club:</strong> ICPC, Hackathons & Software Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab?.('clubs')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  <span className="text-neutral-400 mr-1.5">•</span>
                  <strong className="font-medium text-neutral-200">Cyber Security Club:</strong> CTFs, Ethical Hacking & Blue Teaming
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab?.('clubs')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  <span className="text-neutral-400 mr-1.5">•</span>
                  <strong className="font-medium text-neutral-200">Research Club:</strong> AI, Machine Learning & IEEE Publications
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: 2. EVENTS & CLUBS */}
          <div className="space-y-4">
            <h4 className="font-bold text-white tracking-wider text-[13px] uppercase">
              2. EVENTS & CLUBS
            </h4>
            <ul className="space-y-3 text-neutral-300">
              <li>
                <button
                  onClick={() => setActiveTab?.('clubs')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  <span className="text-neutral-400 mr-1.5">•</span>
                  <strong className="font-medium text-neutral-200">Sports Club:</strong> CPCL Cricket, Football & Indoor Badminton
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab?.('clubs')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  <span className="text-neutral-400 mr-1.5">•</span>
                  <strong className="font-medium text-neutral-200">Cultural Club:</strong> Rhythm of City, Drama & Classical Music
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab?.('clubs')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  <span className="text-neutral-400 mr-1.5">•</span>
                  <strong className="font-medium text-neutral-200">Tour & Adventure Club:</strong> Sajek Treks & Coastal Expeditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: CENTRAL PORTALS */}
          <div className="space-y-4">
            <h4 className="font-bold text-white tracking-wider text-[13px] uppercase">
              CENTRAL PORTALS
            </h4>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <button
                  onClick={() => setActiveTab?.('clubs')}
                  className="hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-neutral-400">•</span>
                  <span>Specialized Club Wings Directory</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab?.('gallery')}
                  className="hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-neutral-400">•</span>
                  <span>Campus Media & Photo Albums</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab?.('events')}
                  className="hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-neutral-400">•</span>
                  <span>Intra Hackathon & CTF Registrations</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab?.('announcements')}
                  className="hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-neutral-400">•</span>
                  <span>Circulars & Official Notice Board</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab?.('dashboard')}
                  className="text-[#D40000] hover:text-red-400 font-semibold transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span>•</span>
                  <span>Administrator Dashboard (Central CMS)</span>
                </button>
              </li>
              <li>
                <a
                  href="https://cityuniversity.ac.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer text-neutral-200"
                  title="Visit City University Official Website"
                >
                  <span className="text-neutral-400">•</span>
                  <span>City University Official Website</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
            </ul>

            <div className="pt-3 text-[11px] text-neutral-400 space-y-0.5 leading-snug">
              <p>Office Hours: Fri-Tue(09.00 AM-04.00 PM)</p>
              <p>Closed on Wed-Thu and University Holidays</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Credit Bar */}
      <div className="bg-[#0B0B0C] border-t border-[#1C1C20] w-full px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-2 pb-16 md:pb-0">
          <p>© 2026 City University Events & Club (CUEC). No Rights is Reserved.</p>
          <p className="text-neutral-400">Credits goes to Md Arifuzzaman Abir</p>
        </div>
      </div>

    </footer>
  );
};
