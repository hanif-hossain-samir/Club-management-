import React from 'react';
import { Flame } from 'lucide-react';
import { Announcement } from '../types.ts';

interface NoticeTickerProps {
  announcements: Announcement[];
  onSelectNotice: (announcement: Announcement) => void;
}

export const NoticeTicker: React.FC<NoticeTickerProps> = ({ announcements, onSelectNotice }) => {
  const urgentOrPinned = announcements.filter(a => a.priority === 'urgent' || a.pinned || a.priority === 'competition');
  const items = urgentOrPinned.length > 0 ? urgentOrPinned : announcements.slice(0, 4);

  if (items.length === 0) return null;

  return (
    <div className="bg-red-50/80 dark:bg-[#1C060E] border-y border-red-200/80 dark:border-[#3E101E] text-xs py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D40000] text-white font-bold text-[11px] uppercase tracking-wide">
            <Flame className="w-3 h-3 text-amber-300" />
            Official Notice
          </span>
        </div>

        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap flex items-center gap-6 text-neutral-800 dark:text-neutral-200">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => onSelectNotice(item)}
              className="flex items-center gap-2 hover:text-[#D40000] dark:hover:text-red-400 transition-colors cursor-pointer group"
            >
              {item.priority === 'urgent' && (
                <span className="px-1.5 py-0.2 rounded bg-red-600 text-white font-bold text-[9px] uppercase">
                  Urgent
                </span>
              )}
              {item.priority === 'competition' && (
                <span className="px-1.5 py-0.2 rounded bg-amber-600 text-white font-bold text-[9px] uppercase">
                  Contest
                </span>
              )}
              <span className="font-medium group-hover:underline">{item.title}</span>
              {idx < items.length - 1 && <span className="text-neutral-300 dark:text-neutral-700 ml-4">•</span>}
            </button>
          ))}
        </div>

        <div className="shrink-0 hidden md:block">
          <span className="text-[11px] text-[#D40000] dark:text-red-300 font-semibold flex items-center gap-0.5">
            Updated Today
          </span>
        </div>
      </div>
    </div>
  );
};
