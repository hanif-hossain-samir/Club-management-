import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  FileText, 
  Download, 
  Pin, 
  Search, 
  Calendar, 
  ShieldCheck
} from 'lucide-react';
import { Announcement } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface AnnouncementsPageProps {
  announcements: Announcement[];
  selectedNotice: Announcement | null;
  setSelectedNotice: (notice: Announcement | null) => void;
  setActiveTab: (tab: string) => void;
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({
  announcements,
  selectedNotice,
  setSelectedNotice,
  setActiveTab
}) => {
  const { role } = useAuth();
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [clubFilter, setClubFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (selectedNotice) {
      setSearchQuery(selectedNotice.title);
      setSelectedNotice(null);
    }
  }, [selectedNotice, setSelectedNotice]);

  const filteredAnnouncements = announcements.filter((a) => {
    if (priorityFilter !== 'all' && a.priority !== priorityFilter) return false;
    if (clubFilter !== 'all' && a.clubId !== clubFilter && a.clubId !== 'all') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-[#D40000] dark:text-red-300 text-xs font-bold uppercase tracking-wider">
            Official University Circulars
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 dark:text-white">
            CUEC Notice Board & Press Releases
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Official announcements issued by the Directorate of Student Welfare and Authorized Club Controllers.
          </p>
        </div>

        {(role === 'administrator' || role === 'controller') && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2.5 rounded-xl bg-[#D40000] hover:bg-red-800 text-white font-bold text-xs transition-colors self-start md:self-auto cursor-pointer shadow-sm flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Manage & Publish Notices (CMS)</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#141520] border border-neutral-200 dark:border-[#2D1B22] p-4 rounded-2xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search circulars by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
            />
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🔴 Urgent Circulars</option>
              <option value="competition">🏆 Contests & Auditions</option>
              <option value="important">⚠️ Important Notices</option>
              <option value="general">ℹ️ General Updates</option>
            </select>
          </div>

          <div>
            <select
              value={clubFilter}
              onChange={(e) => setClubFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
            >
              <option value="all">All Club Entities</option>
              <option value="computer_club">Computer Club (CUCC)</option>
              <option value="events_and_clubs">Events & Clubs</option>
            </select>
          </div>

        </div>
      </div>

      {/* Notice Board List Layout */}
      <div className="space-y-4">
        {filteredAnnouncements.map((item) => {
          const isUrgent = item.priority === 'urgent';
          const isCompetition = item.priority === 'competition';

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all p-5 sm:p-6 shadow-xs ${
                item.pinned
                  ? 'bg-red-50/50 dark:bg-[#200A13] border-red-300 dark:border-red-900/70 ring-1 ring-red-400/20'
                  : 'bg-white dark:bg-[#18050E] border-neutral-200 dark:border-[#380E1C] hover:border-red-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  {item.pinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D40000] text-white font-bold text-[10px] uppercase">
                      <Pin className="w-3 h-3 fill-current" /> Pinned
                    </span>
                  )}
                  {isUrgent && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] uppercase">
                      <Flame className="w-3 h-3 text-amber-300" /> Urgent
                    </span>
                  )}
                  {isCompetition && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-bold text-[10px] uppercase">
                      Contest Alert
                    </span>
                  )}
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span>
                    Ref: #{item.id.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white font-heading">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>

                {/* Attached Notice Poster Image */}
                {item.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 max-h-80 w-full max-w-2xl bg-neutral-900 shadow-xs">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover max-h-80"
                    />
                  </div>
                )}

                {/* Attachment Simulation */}
                {item.attachmentName && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="font-semibold">{item.attachmentName}</span>
                    <span className="text-[10px] text-neutral-500">(Official Circular PDF)</span>
                    <Download className="w-3.5 h-3.5 ml-2 text-neutral-500" />
                  </div>
                )}
              </div>

              {/* Author & Verification Footer */}
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between text-xs text-neutral-500 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 text-[#D40000] dark:text-red-400 flex items-center justify-center font-bold text-[10px]">
                    CU
                  </div>
                  <span>
                    Signatory: <strong className="text-neutral-800 dark:text-neutral-200">{item.authorName}</strong> ({item.authorRole})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Digitally Verified by City University Central Office</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
