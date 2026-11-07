import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  CheckCircle, 
  AlertCircle,
  FileCheck, 
  CalendarDays,
  LayoutGrid
} from 'lucide-react';
import { ClubEvent, EventRegistration } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';

interface EventsPageProps {
  events: ClubEvent[];
  onEventRegistered: (updatedEvent: ClubEvent, registration: EventRegistration) => void;
  selectedEventForModal: ClubEvent | null;
  setSelectedEventForModal: (evt: ClubEvent | null) => void;
  openTicketModal: (evt: ClubEvent, reg: EventRegistration) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  onEventRegistered,
  selectedEventForModal,
  setSelectedEventForModal,
  openTicketModal
}) => {
  const { user } = useAuth();
  const [selectedClub, setSelectedClub] = useState<string>('all');
  const [selectedWing, setSelectedWing] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  // Registration modal state
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [regEvent, setRegEvent] = useState<ClubEvent | null>(null);
  const [regName, setRegName] = useState(user?.name || '');
  const [regStudentId, setRegStudentId] = useState(user?.studentId || '');
  const [regEmail, setRegEmail] = useState(user?.email || '');
  const [regDepartment, setRegDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [approvedEventIds, setApprovedEventIds] = useState<string[]>([]);
  const [approvalNotice, setApprovalNotice] = useState<string | null>(null);

  // Sync if selectedEventForModal is passed
  useEffect(() => {
    if (selectedEventForModal) {
      setRegEvent(selectedEventForModal);
      setApprovalNotice(null);
      setRegModalOpen(true);
      setSelectedEventForModal(null);
    }
  }, [selectedEventForModal, setSelectedEventForModal]);

  // Sync if user changes
  useEffect(() => {
    if (user) {
      setRegName(user.name);
      setRegStudentId(user.studentId);
      setRegEmail(user.email);
      setRegDepartment(user.department);
    }
  }, [user]);

  // Filtering strictly to CUCC events
  const filteredEvents = events.filter((evt) => {
    if (evt.clubId !== 'computer_club') return false;
    if (selectedWing !== 'all' && evt.wingSlug !== selectedWing) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.venue.toLowerCase().includes(q) ||
        evt.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleOpenRegister = (evt: ClubEvent) => {
    setRegEvent(evt);
    setApprovalNotice(null);
    setRegModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-[#D40000] dark:text-red-300 text-xs font-bold uppercase tracking-wider">
            CUCC Events & Competitions
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 dark:text-white">
            Upcoming Hackathons, CTF Drills & Tech Sessions
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Official technology events, coding marathons, cyber security battlegrounds, and scientific colloquiums under Computer Club (CUCC).
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-[#161722] p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Card Grid</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Calendar View</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#141520] border border-neutral-200 dark:border-[#2D1B22] p-4 rounded-2xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search CUCC event, topic, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
            />
          </div>

          {/* Club (Locked to CUCC) */}
          <div className="flex items-center px-3 py-2 text-xs rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 text-[#D40000] dark:text-red-300 font-bold truncate">
            <span>Computer Club (CUCC)</span>
          </div>

          {/* Wing Subsector Filter (Only 3 CUCC wings) */}
          <div>
            <select
              value={selectedWing}
              onChange={(e) => setSelectedWing(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
            >
              <option value="all">All CUCC Wings (3 Wings)</option>
              <option value="programming">Programming Club</option>
              <option value="cyber_security">Cyber Security Club</option>
              <option value="research">Research Club</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => {
                setSelectedWing('all');
                setSearchQuery('');
              }}
              className="text-xs text-neutral-500 hover:text-[#D40000] dark:hover:text-red-400 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const isApproved = approvedEventIds.includes(evt.id);

            return (
              <div
                key={evt.id}
                className="bg-white dark:bg-[#18050E] rounded-2xl border border-neutral-200 dark:border-[#380E1C] overflow-hidden shadow-xs hover:shadow-xl hover:border-red-400 dark:hover:border-red-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#D40000] text-white font-bold text-[10px] uppercase shadow-xs">
                        {evt.kicker || evt.category}
                      </span>
                      {evt.isFeatured && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-400 text-red-950 font-bold text-[9px] uppercase shadow-xs">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center gap-3 text-xs text-neutral-200 mb-1">
                        <span className="flex items-center gap-1 font-semibold text-amber-300">
                          <Calendar className="w-3.5 h-3.5" /> {evt.date}
                        </span>
                        <span className="text-neutral-300 font-mono text-[11px]">{evt.time}</span>
                      </div>
                      <h3 className="font-bold text-base font-heading text-white line-clamp-2">
                        {evt.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#D40000] dark:text-red-400 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>Deadline: {evt.registrationDeadline}</span>
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {evt.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Open Access: Seat Limitations Removed */}
                    <div className="pt-2 flex items-center justify-between text-[11px] border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                        Stacked Applications: <strong className="text-neutral-900 dark:text-white font-mono">{evt.registeredCount}</strong>
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full text-[10px]">
                        Unlimited Seats · No Limit
                      </span>
                    </div>

                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleOpenRegister(evt)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                      isApproved 
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white' 
                        : 'bg-[#D40000] hover:bg-red-800 text-white'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve applications ({evt.registeredCount} stacked up)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-[#141520] border border-neutral-200 dark:border-[#2D1B22] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <h3 className="font-bold text-lg font-heading text-neutral-900 dark:text-white">
              CUCC Academic Trimester Schedule
            </h3>
            <span className="text-xs text-neutral-500 font-mono">Computer Club (CUCC) · All 3 Wings</span>
          </div>

          <div className="space-y-4">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-[#1A1B28] border border-neutral-200 dark:border-neutral-800 hover:border-red-400 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#D40000] text-white flex flex-col items-center justify-center shrink-0 text-center font-heading shadow-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-bold leading-none mt-0.5">
                      {new Date(evt.date).getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-[#D40000] dark:text-red-300">
                        {evt.wingSlug.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs text-neutral-500">{evt.time}</span>
                    </div>

                    <h4 className="font-bold text-base text-neutral-900 dark:text-white mt-1">
                      {evt.title}
                    </h4>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>{evt.venue}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenRegister(evt)}
                    className="px-4 py-2 rounded-lg bg-[#D40000] hover:bg-red-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Approve applications ({evt.registeredCount} stacked up)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Details & Applications Approval Modal */}
      {regModalOpen && regEvent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151620] border border-neutral-200 dark:border-[#382026] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-gradient-to-r from-[#D40000] to-[#5C0000] p-6 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-red-950 text-[10px] font-bold uppercase">
                  {regEvent.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/40 text-neutral-200 text-[10px] font-bold uppercase">
                  {regEvent.wingSlug.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold font-heading mt-1">{regEvent.title}</h3>
              <p className="text-xs text-red-200 mt-2 flex flex-wrap items-center gap-3">
                <span><Calendar className="w-3.5 h-3.5 inline mr-1" />{regEvent.date}</span>
                <span><Clock className="w-3.5 h-3.5 inline mr-1" />{regEvent.time}</span>
                <span><MapPin className="w-3.5 h-3.5 inline mr-1" />{regEvent.venue}</span>
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {approvalNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{approvalNotice}</span>
                </div>
              )}

              <div>
                <span className="font-bold text-neutral-400 uppercase text-[10px] tracking-wider block mb-1">
                  Event Brief & Description
                </span>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-[#11121A] p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  {regEvent.fullDetails || regEvent.description}
                </p>
              </div>

              {regEvent.chiefGuests && regEvent.chiefGuests.length > 0 && (
                <div>
                  <span className="font-bold text-neutral-400 uppercase text-[10px] tracking-wider block mb-1">
                    Special Guests & Mentors
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {regEvent.chiefGuests.map((guest, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#D40000] dark:text-red-300 font-semibold border border-red-200 dark:border-red-900/60">
                        {guest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Open Access: Unlimited Seats */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#11121A] border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block">Seat Limitation</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Unlimited Seats (No Limitation)</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#11121A] border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block">Stacked Applications</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{regEvent.registeredCount} Applicants</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    if (!approvedEventIds.includes(regEvent.id)) {
                      setApprovedEventIds(prev => [...prev, regEvent.id]);
                      setApprovalNotice(`Successfully approved all ${regEvent.registeredCount} applications! Delegated passes issued.`);
                    }
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                    approvedEventIds.includes(regEvent.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#D40000] hover:bg-red-800 text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {approvedEventIds.includes(regEvent.id)
                      ? 'Applications Approved'
                      : `Approve All ${regEvent.registeredCount} Applications`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRegModalOpen(false);
                    setApprovalNotice(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
