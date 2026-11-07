import React from 'react';
import { Shield, QrCode, CheckCircle2, Printer, Award, X } from 'lucide-react';
import { User, ClubCategory, ClubSubsector } from '../types.ts';

interface DigitalMembershipCardProps {
  user: User;
  onClose?: () => void;
}

export const DigitalMembershipCard: React.FC<DigitalMembershipCardProps> = ({ user, onClose }) => {
  const cardSerial = `CUEC-${user.studentId.replace(/[^A-Za-z0-9]/g, '')}-${user.joinedAt.split('-')[0] || '2026'}`;

  const getWingTitle = (wing?: ClubSubsector) => {
    switch (wing) {
      case 'programming': return 'Programming Wing';
      case 'cyber_security': return 'Cyber Security Wing';
      case 'research': return 'Research & AI Wing';
      case 'sports': return 'Sports & Athletics Wing';
      case 'cultural': return 'Cultural & Arts Wing';
      case 'tour': return 'Tour & Adventure Wing';
      default: return 'Central Member';
    }
  };

  const getClubName = (club?: ClubCategory) => {
    if (club === 'computer_club') return 'City University Computer Club';
    if (club === 'events_and_clubs') return 'City University Events & Clubs';
    return 'City University Events & Club (CUEC)';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#151620] border border-neutral-200 dark:border-[#382026] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Action */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* The Card Itself */}
        <div id="cuec-membership-card" className="p-6">
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#D40000] dark:border-red-600 shadow-xl bg-gradient-to-b from-[#D40000] via-[#700000] to-[#450000] text-white p-6">
            
            {/* Watermark Crest */}
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
              <Shield className="w-56 h-56 text-white" />
            </div>

            {/* Top Bar of the Card */}
            <div className="flex items-center justify-between border-b border-red-300/30 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center shadow-md ring-2 ring-white/60 shrink-0">
                  <img 
                    src="/city-university-logo.jpg" 
                    alt="City University Official Logo" 
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-wide text-white font-heading">
                    CITY UNIVERSITY
                  </h4>
                  <p className="text-[10px] text-amber-200 font-semibold tracking-wider uppercase">
                    Official Club Membership Card
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVE
                </span>
                <p className="text-[9px] text-red-200 mt-0.5 font-mono">EXP: DEC 2027</p>
              </div>
            </div>

            {/* Student Details Grid */}
            <div className="flex items-center gap-4 my-4">
              <div className="relative shrink-0">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=D40000`}
                  alt={user.name}
                  className="w-18 h-18 rounded-xl object-cover border-2 border-amber-300 shadow-md bg-neutral-800"
                />
                <div className="absolute -bottom-1.5 -right-1.5 bg-amber-400 text-red-950 p-1 rounded-full shadow-xs">
                  <Award className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-white truncate">
                  {user.name}
                </h3>
                <p className="text-amber-200 font-mono text-xs font-semibold">
                  ID: {user.studentId}
                </p>
                <p className="text-red-100 text-[11px] truncate mt-0.5">
                  Dept: {user.department}
                </p>
                <div className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 text-amber-200 border border-amber-300/30">
                  {getWingTitle(user.assignedWing)}
                </div>
              </div>
            </div>

            {/* Club Affiliation Banner */}
            <div className="bg-black/25 rounded-lg px-3 py-2 border border-white/10 text-[11px] mb-3">
              <div className="text-red-200 text-[9px] uppercase font-bold tracking-wider">Affiliated Organization</div>
              <div className="font-semibold text-white truncate">{getClubName(user.clubAffiliation)}</div>
            </div>

            {/* Footer QR / Barcode Strip */}
            <div className="flex items-center justify-between border-t border-red-300/20 pt-3 text-[10px] text-red-200 font-mono">
              <div>
                <span className="block text-[8px] text-red-300 uppercase">Serial Token</span>
                <span className="text-amber-200 font-bold">{cardSerial}</span>
              </div>
              
              {/* Visual simulated QR */}
              <div className="bg-white p-1 rounded-md text-neutral-900 shadow-xs flex items-center gap-1">
                <QrCode className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="bg-neutral-50 dark:bg-[#12131C] px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Authorized by City University DSW
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#D40000] text-white hover:bg-red-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
