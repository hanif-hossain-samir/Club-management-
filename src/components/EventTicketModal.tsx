import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Printer, X } from 'lucide-react';
import { ClubEvent, EventRegistration } from '../types.ts';

interface EventTicketModalProps {
  event: ClubEvent;
  registration: EventRegistration;
  onClose: () => void;
}

export const EventTicketModal: React.FC<EventTicketModalProps> = ({ event, registration, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#151620] border border-neutral-200 dark:border-[#3A1E26] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-[#D40000] to-[#5C0000] p-6 text-white text-center relative overflow-hidden">
          <div className="flex justify-center mb-2.5">
            <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-md ring-2 ring-white/60 flex items-center justify-center">
              <img 
                src="/city-university-logo.jpg" 
                alt="City University Official Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold mb-2">
            <CheckCircle className="w-3.5 h-3.5" /> Registration Confirmed
          </div>
          <h3 className="text-xl font-bold font-heading">{event.title}</h3>
          <p className="text-xs text-red-200 mt-1">Official City University Event Delegate Pass</p>
        </div>

        {/* Ticket Body with perforated style */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 dark:bg-[#1E0D12] border border-red-200 dark:border-[#421720] rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-wider">
                Digital Pass Code
              </span>
              <p className="text-lg font-mono font-extrabold text-[#D40000] dark:text-red-400 tracking-wide">
                {registration.ticketCode}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-wider">
                Seat Status
              </span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Reserved & Confirmed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-neutral-50 dark:bg-[#12131A] p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-semibold">Attendee Name</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">{registration.userName}</span>
            </div>
            <div className="bg-neutral-50 dark:bg-[#12131A] p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-semibold">Student ID</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">{registration.studentId}</span>
            </div>
            <div className="bg-neutral-50 dark:bg-[#12131A] p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-semibold">Event Date</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-[#D40000] dark:text-red-400" />
                {event.date}
              </span>
            </div>
            <div className="bg-neutral-50 dark:bg-[#12131A] p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-semibold">Time</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-[#D40000] dark:text-red-400" />
                {event.time}
              </span>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-[#12131A] p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
            <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-semibold">Venue</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#D40000] dark:text-red-400 shrink-0" />
              {event.venue}
            </span>
          </div>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
            Please present this digital pass or student ID card at the entry gate check-in desk.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-neutral-100 dark:bg-[#0F1017] px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Pass
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#D40000] text-white hover:bg-red-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
