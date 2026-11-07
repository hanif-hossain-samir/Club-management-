import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Calendar, 
  Bell, 
  Image as ImageIcon, 
  Users, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  LayoutDashboard,
  UserMinus,
  Pin
} from 'lucide-react';
import { 
  Club, 
  ClubEvent, 
  Announcement, 
  GalleryItem, 
  User, 
  ClubCategory,
  ClubSubsector 
} from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';

interface AdminDashboardProps {
  clubs: Club[];
  events: ClubEvent[];
  announcements: Announcement[];
  gallery: GalleryItem[];
  onRefreshData: () => void;
}

const CUCC_WINGS: { slug: ClubSubsector; label: string }[] = [
  { slug: 'programming', label: 'Programming Club' },
  { slug: 'cyber_security', label: 'Cyber Security Wing' },
  { slug: 'research', label: 'Research & Innovation Wing' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  clubs,
  events,
  announcements,
  gallery,
  onRefreshData
}) => {
  const { user } = useAuth();
  
  // Dedicated CUCC Controller authority
  const controllerClubId: ClubCategory = 'computer_club';
  const activeWings = CUCC_WINGS;

  // Active sub-tab inside CUCC Controller Dashboard
  type TabType = 'overview' | 'events' | 'gallery' | 'announcements' | 'members';
  const [currentTab, setCurrentTab] = useState<TabType>('overview');

  const [actionProcessing, setActionProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-dismiss notification
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  /* ==========================================================================
     MEMBERS STATE & HANDLERS (CUCC ONLY)
     ========================================================================== */
  const [clubMembersList, setClubMembersList] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberWingFilter, setMemberWingFilter] = useState<string>('all');

  const fetchClubMembers = async () => {
    setLoadingMembers(true);
    try {
      const res = await api.getMembers(controllerClubId, user?.id);
      if (res.success && res.members) {
        setClubMembersList(res.members);
      }
    } catch (e) {
      //
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchClubMembers();
  }, [user]);

  const handleRemoveMember = async (memberUser: User) => {
    if (!window.confirm(`Revoke Computer Club (CUCC) membership for "${memberUser.name}" (${memberUser.studentId})? Their user account will be preserved, but their assigned wing and club membership will be removed.`)) {
      return;
    }

    setActionProcessing(true);
    try {
      const res = await api.removeMember(memberUser.id, user?.id);
      if (res.success) {
        setSuccessMessage(`Member "${memberUser.name}" removed from Computer Club.`);
        fetchClubMembers();
        onRefreshData();
      } else {
        setErrorMessage(res.message || 'Failed to remove member.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error removing member.');
    } finally {
      setActionProcessing(false);
    }
  };

  /* ==========================================================================
     NOTICES & ANNOUNCEMENTS STATE & HANDLERS (CUCC ONLY)
     ========================================================================== */
  const [annModalOpen, setAnnModalOpen] = useState(false);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'urgent' | 'important' | 'general' | 'competition'>('general');
  const [annCategory, setAnnCategory] = useState('Notice');
  const [annImageUrl, setAnnImageUrl] = useState('');
  const [annAttachmentName, setAnnAttachmentName] = useState('');
  const [annPinned, setAnnPinned] = useState(false);
  const [annWingSlug, setAnnWingSlug] = useState<ClubSubsector | 'all'>('all');
  const [annSearch, setAnnSearch] = useState('');
  const [annPriorityFilter, setAnnPriorityFilter] = useState<'all' | 'urgent' | 'important' | 'general' | 'competition'>('all');

  const handleOpenCreateAnn = () => {
    setEditingAnnId(null);
    setAnnTitle('');
    setAnnContent('');
    setAnnPriority('general');
    setAnnCategory('Notice');
    setAnnImageUrl('');
    setAnnAttachmentName('');
    setAnnPinned(false);
    setAnnWingSlug('all');
    setAnnModalOpen(true);
  };

  const handleOpenEditAnn = (ann: Announcement) => {
    setEditingAnnId(ann.id);
    setAnnTitle(ann.title);
    setAnnContent(ann.content);
    setAnnPriority(ann.priority);
    setAnnCategory(ann.category);
    setAnnImageUrl(ann.imageUrl || '');
    setAnnAttachmentName(ann.attachmentName || '');
    setAnnPinned(ann.pinned);
    setAnnWingSlug(ann.wingSlug || 'all');
    setAnnModalOpen(true);
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionProcessing(true);

    const payload = {
      title: annTitle.trim(),
      content: annContent.trim(),
      priority: annPriority,
      category: annCategory,
      imageUrl: annImageUrl.trim() || undefined,
      attachmentName: annAttachmentName.trim() || undefined,
      pinned: annPinned,
      clubId: controllerClubId,
      wingSlug: annWingSlug
    };

    try {
      if (editingAnnId) {
        const res = await api.updateAnnouncement(editingAnnId, payload, user?.id);
        if (res.success) {
          setSuccessMessage('CUCC Notice updated successfully.');
        } else {
          setErrorMessage(res.message || 'Failed to update notice.');
        }
      } else {
        const res = await api.createAnnouncement(payload, user?.id);
        if (res.success) {
          setSuccessMessage('New CUCC announcement published successfully.');
        } else {
          setErrorMessage(res.message || 'Failed to publish notice.');
        }
      }
      setActionProcessing(false);
      setAnnModalOpen(false);
      onRefreshData();
    } catch (e: any) {
      setActionProcessing(false);
      setErrorMessage(e.message || 'Network error.');
    }
  };

  const handleDeleteAnnouncement = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the notice: "${title}"?`)) return;
    try {
      const res = await api.deleteAnnouncement(id, user?.id);
      if (res.success) {
        setSuccessMessage('Notice deleted successfully.');
        onRefreshData();
      } else {
        setErrorMessage(res.message || 'Failed to delete notice.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network error.');
    }
  };

  /* ==========================================================================
     GALLERY PHOTOS STATE & HANDLERS (CUCC ONLY)
     ========================================================================== */
  const [galModalOpen, setGalModalOpen] = useState(false);
  const [editingGalId, setEditingGalId] = useState<string | null>(null);
  const [galTitle, setGalTitle] = useState('');
  const [galImageUrl, setGalImageUrl] = useState('');
  const [galBatchUrls, setGalBatchUrls] = useState('');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [galWingSlug, setGalWingSlug] = useState<ClubSubsector>('programming');
  const [galEventName, setGalEventName] = useState('');
  const [galCaption, setGalCaption] = useState('');
  const [galWingFilter, setGalWingFilter] = useState<string>('all');

  const handleOpenCreateGal = () => {
    setEditingGalId(null);
    setGalTitle('');
    setGalImageUrl('');
    setGalBatchUrls('');
    setIsBatchMode(false);
    setGalWingSlug('programming');
    setGalEventName('Programming Contest 2026');
    setGalCaption('');
    setGalModalOpen(true);
  };

  const handleOpenEditGal = (item: GalleryItem) => {
    setEditingGalId(item.id);
    setGalTitle(item.title);
    setGalImageUrl(item.imageUrl);
    setIsBatchMode(false);
    setGalWingSlug(item.wingSlug);
    setGalEventName(item.eventName || '');
    setGalCaption(item.caption || '');
    setGalModalOpen(true);
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionProcessing(true);

    try {
      if (editingGalId) {
        const payload = {
          title: galTitle.trim(),
          imageUrl: galImageUrl.trim(),
          clubId: controllerClubId,
          wingSlug: galWingSlug,
          eventName: galEventName.trim() || undefined,
          caption: galCaption.trim() || undefined
        };
        const res = await api.updateGalleryItem(editingGalId, payload, user?.id);
        if (res.success) {
          setSuccessMessage('Photo updated successfully.');
        } else {
          setErrorMessage(res.message || 'Failed to update photo.');
        }
      } else if (isBatchMode) {
        const urls = galBatchUrls
          .split('\n')
          .map(u => u.trim())
          .filter(u => u.length > 5);

        if (urls.length === 0) {
          setErrorMessage('Please provide at least one valid image URL.');
          setActionProcessing(false);
          return;
        }

        const res = await api.createGalleryItem({
          title: galTitle.trim() || 'CUCC Archive',
          clubId: controllerClubId,
          wingSlug: galWingSlug,
          eventName: galEventName.trim() || 'CUCC Archive',
          caption: galCaption.trim() || undefined,
          imageUrls: urls
        }, user?.id);

        if (res.success) {
          setSuccessMessage(`${urls.length} photos added to the ${galWingSlug.replace('_', ' ')} album.`);
        } else {
          setErrorMessage(res.message || 'Batch upload failed.');
        }
      } else {
        const payload = {
          title: galTitle.trim() || 'CUCC Wing Photo',
          imageUrl: galImageUrl.trim(),
          clubId: controllerClubId,
          wingSlug: galWingSlug,
          eventName: galEventName.trim() || undefined,
          caption: galCaption.trim() || undefined
        };
        const res = await api.createGalleryItem(payload, user?.id);
        if (res.success) {
          setSuccessMessage('Photo added to CUCC wing gallery.');
        } else {
          setErrorMessage(res.message || 'Failed to add photo.');
        }
      }
      setActionProcessing(false);
      setGalModalOpen(false);
      onRefreshData();
    } catch (e: any) {
      setActionProcessing(false);
      setErrorMessage(e.message || 'Network error.');
    }
  };

  const handleDeleteGalleryItem = async (id: string, title: string) => {
    if (!window.confirm(`Delete photo: "${title}" from the gallery?`)) return;
    try {
      const res = await api.deleteGalleryItem(id, user?.id);
      if (res.success) {
        setSuccessMessage('Photo removed from gallery.');
        onRefreshData();
      } else {
        setErrorMessage(res.message || 'Failed to delete photo.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network error.');
    }
  };

  /* ==========================================================================
     EVENTS STATE & HANDLERS (CUCC ONLY)
     ========================================================================== */
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventWingSlug, setEventWingSlug] = useState<ClubSubsector>('programming');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [eventVenue, setEventVenue] = useState('Software Lab 402, Campus');
  const [eventDesc, setEventDesc] = useState('');
  const [eventBanner, setEventBanner] = useState('');
  const [eventCapacity, setEventCapacity] = useState('100');
  const [eventIsFeatured, setEventIsFeatured] = useState(false);
  const [attendeeRosterEvent, setAttendeeRosterEvent] = useState<ClubEvent | null>(null);

  const handleOpenCreateEvent = () => {
    setEditingEventId(null);
    setEventTitle('');
    setEventWingSlug('programming');
    setEventDate(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
    setEventTime('10:00 AM');
    setEventVenue('Software Lab 402, City University Campus');
    setEventDesc('');
    setEventBanner('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80');
    setEventCapacity('100');
    setEventIsFeatured(true);
    setEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: ClubEvent) => {
    setEditingEventId(evt.id);
    setEventTitle(evt.title);
    setEventWingSlug(evt.wingSlug);
    setEventDate(evt.date);
    setEventTime(evt.time);
    setEventVenue(evt.venue);
    setEventDesc(evt.description);
    setEventBanner(evt.bannerUrl || '');
    setEventCapacity(String(evt.capacity || 100));
    setEventIsFeatured(evt.isFeatured || false);
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionProcessing(true);

    const payload = {
      title: eventTitle.trim(),
      clubId: controllerClubId,
      wingSlug: eventWingSlug,
      date: eventDate,
      time: eventTime,
      venue: eventVenue.trim(),
      description: eventDesc.trim(),
      bannerUrl: eventBanner.trim() || undefined,
      capacity: parseInt(eventCapacity, 10) || 100,
      isFeatured: eventIsFeatured,
      registrationOpen: true
    };

    try {
      if (editingEventId) {
        const res = await api.updateEvent(editingEventId, payload, user?.id);
        if (res.success) {
          setSuccessMessage('CUCC event updated successfully.');
        } else {
          setErrorMessage(res.message || 'Failed to update event.');
        }
      } else {
        const res = await api.createEvent(payload, user?.id);
        if (res.success) {
          setSuccessMessage('New CUCC event published successfully.');
        } else {
          setErrorMessage(res.message || 'Failed to create event.');
        }
      }
      setActionProcessing(false);
      setEventModalOpen(false);
      onRefreshData();
    } catch (e: any) {
      setActionProcessing(false);
      setErrorMessage(e.message || 'Network error.');
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!window.confirm(`Delete event "${title}"? This cannot be undone.`)) return;
    try {
      const res = await api.deleteEvent(id, user?.id);
      if (res.success) {
        setSuccessMessage('Event deleted successfully.');
        onRefreshData();
      } else {
        setErrorMessage(res.message || 'Failed to delete event.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network error.');
    }
  };

  // Filtered collections strictly for CUCC
  const visibleEvents = events.filter(e => e.clubId === controllerClubId);
  const visibleGallery = gallery.filter(g => g.clubId === controllerClubId);
  const visibleAnnouncements = announcements.filter(a => a.clubId === controllerClubId || a.clubId === 'all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-xl animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white font-medium text-xs shadow-xl">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Top Banner: CUCC Controller Command Console */}
      <div className="bg-gradient-to-r from-[#D40000] via-[#850000] to-[#400000] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-red-500/30">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl ring-2 ring-white/80 flex items-center justify-center shrink-0">
            <img 
              src="/city-university-logo.jpg" 
              alt="City University Official Logo" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-red-950 font-bold text-[11px] uppercase tracking-wider border border-amber-300">
                <UserCheck className="w-3.5 h-3.5" /> CUCC Controller Authority • 3 Wings
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
              Computer Club (CUCC) Controller Dashboard
            </h1>
            
            <p className="text-xs text-red-100 max-w-xl">
              Official command hub for City University Computer Club. Full management over Events & Competitions, Photo Archives, Notices, and Enrolled Members across Programming, Cyber Security, and Research wings.
            </p>
          </div>
        </div>

        {/* Quick KPI Stat Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-black/35 backdrop-blur-xs border border-white/10 px-3.5 py-2 rounded-xl text-center">
            <span className="block text-[10px] text-red-200 uppercase font-bold">Club Members</span>
            <span className="text-xl font-bold font-mono text-white">
              {clubMembersList.length}
            </span>
          </div>
          <div className="bg-black/35 backdrop-blur-xs border border-white/10 px-3.5 py-2 rounded-xl text-center">
            <span className="block text-[10px] text-red-200 uppercase font-bold">Active Events</span>
            <span className="text-xl font-bold font-mono text-white">{visibleEvents.length}</span>
          </div>
          <div className="bg-black/35 backdrop-blur-xs border border-white/10 px-3.5 py-2 rounded-xl text-center">
            <span className="block text-[10px] text-red-200 uppercase font-bold">Photo Archives</span>
            <span className="text-xl font-bold font-mono text-emerald-300">{visibleGallery.length}</span>
          </div>
          <div className="bg-black/35 backdrop-blur-xs border border-white/10 px-3.5 py-2 rounded-xl text-center">
            <span className="block text-[10px] text-red-200 uppercase font-bold">Notices</span>
            <span className="text-xl font-bold font-mono text-amber-300">{visibleAnnouncements.length}</span>
          </div>
        </div>
      </div>

      {/* Main Control Tabs (Strictly CUCC Controller Tabs) */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs font-bold">
        
        {/* TAB 0: OVERVIEW */}
        <button
          onClick={() => setCurrentTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            currentTab === 'overview'
              ? 'bg-[#D40000] text-white shadow-sm'
              : 'bg-white dark:bg-[#151620] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-red-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        {/* TAB 1: EVENTS */}
        <button
          onClick={() => setCurrentTab('events')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            currentTab === 'events'
              ? 'bg-[#D40000] text-white shadow-sm'
              : 'bg-white dark:bg-[#151620] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-red-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Events & Competitions ({visibleEvents.length})</span>
        </button>

        {/* TAB 2: GALLERY */}
        <button
          onClick={() => setCurrentTab('gallery')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            currentTab === 'gallery'
              ? 'bg-[#D40000] text-white shadow-sm'
              : 'bg-white dark:bg-[#151620] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-red-400'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Gallery Archives ({visibleGallery.length})</span>
        </button>

        {/* TAB 3: NOTICES */}
        <button
          onClick={() => setCurrentTab('announcements')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            currentTab === 'announcements'
              ? 'bg-[#D40000] text-white shadow-sm'
              : 'bg-white dark:bg-[#151620] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-red-400'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notices & Circulars ({visibleAnnouncements.length})</span>
        </button>

        {/* TAB 4: MEMBERS */}
        <button
          onClick={() => setCurrentTab('members')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            currentTab === 'members'
              ? 'bg-[#D40000] text-white shadow-sm'
              : 'bg-white dark:bg-[#151620] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-red-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Enrolled Members ({clubMembersList.length})</span>
        </button>

      </div>

      {/* =====================================================================
          TAB 0: OVERVIEW
          ===================================================================== */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#141520] border border-neutral-200 dark:border-[#2D1B22] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D40000] dark:text-red-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> CUCC Controller Operations
              </span>
              <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white">
                Welcome back, {user?.name || 'Tanvir Ahmed'}!
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl">
                You have exclusive management authority over City University Computer Club (CUCC) across Programming, Cyber Security, and Research wings. Create events, curate photo archives, publish circulars, and monitor student members.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleOpenCreateEvent}
                className="px-4 py-2.5 rounded-xl bg-[#D40000] hover:bg-red-800 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
              <button
                onClick={handleOpenCreateAnn}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span>Post Notice</span>
              </button>
              <button
                onClick={handleOpenCreateGal}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            </div>
          </div>

          {/* Quick Overview Cards: Events & Notices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Events Card */}
            <div className="bg-white dark:bg-[#141520] border border-neutral-200 dark:border-[#2D1B22] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <h4 className="font-bold text-base font-heading text-neutral-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D40000]" />
                  Active CUCC Events ({visibleEvents.length})
                </h4>
                <button
                  onClick={() => setCurrentTab('events')}
                  className="text-xs text-[#D40000] dark:text-red-400 font-semibold hover:underline cursor-pointer"
                >
                  Manage All Events
                </button>
              </div>

              <div className="space-y-3">
                {visibleEvents.slice(0, 3).map(evt => (
                  <div 
                    key={evt.id}
                    className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#191A28] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white">{evt.title}</span>
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-red-100 dark:bg-red-950 text-[#D40000] dark:text-red-300 font-bold uppercase">
                          {evt.wingSlug.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                        {evt.date} • {evt.venue}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenEditEvent(evt)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Edit
                    </button>
                  </div>
                ))}

                {visibleEvents.length === 0 && (
                  <p className="text-center py-6 text-xs text-neutral-400">No events created yet for CUCC.</p>
                )}
              </div>
            </div>

            {/* Recent Notices Card */}
            <div className="bg-white dark:bg-[#141520] border border-neutral-200 dark:border-[#2D1B22] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <h4 className="font-bold text-base font-heading text-neutral-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#D40000]" />
                  CUCC Notices & Circulars ({visibleAnnouncements.length})
                </h4>
                <button
                  onClick={() => setCurrentTab('announcements')}
                  className="text-xs text-[#D40000] dark:text-red-400 font-semibold hover:underline cursor-pointer"
                >
                  Manage All Notices
                </button>
              </div>

              <div className="space-y-3">
                {visibleAnnouncements.slice(0, 3).map(ann => (
                  <div 
                    key={ann.id}
                    className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#191A28] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">{ann.title}</span>
                        {ann.pinned && (
                          <span className="px-1.5 py-0.5 rounded font-mono text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold uppercase">
                            Pinned
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                        {ann.category} • {new Date(ann.publishedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenEditAnn(ann)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Edit
                    </button>
                  </div>
                ))}

                {visibleAnnouncements.length === 0 && (
                  <p className="text-center py-6 text-xs text-neutral-400">No notices posted yet for CUCC.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 1: EVENTS & COMPETITIONS (CREATE, EDIT, DELETE)
          ===================================================================== */}
      {currentTab === 'events' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D40000]" />
                Computer Club (CUCC) Events ({visibleEvents.length})
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Publish and manage hackathons, bootcamps, workshops, and research symposiums across Programming, Cyber Security, and Research wings.
              </p>
            </div>

            <button
              onClick={handleOpenCreateEvent}
              className="px-4 py-2.5 rounded-xl bg-[#D40000] hover:bg-red-800 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white dark:bg-[#141520] border border-neutral-200 dark:border-[#2D1B22] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-red-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-[10px] uppercase">
                      {evt.wingSlug.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs text-neutral-500 font-semibold">{evt.date}</span>
                  </div>

                  <h4 className="font-bold text-base text-neutral-900 dark:text-white mt-2 leading-snug">
                    {evt.title}
                  </h4>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
                    {evt.description}
                  </p>

                  <div className="space-y-1 text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 font-mono">
                    <div>Venue: <strong className="text-neutral-700 dark:text-neutral-300">{evt.venue}</strong></div>
                    <div>Time: {evt.time} • Registered: {evt.registeredCount || 0} (Unlimited Seats)</div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 text-xs">
                  <button
                    onClick={() => setAttendeeRosterEvent(evt)}
                    className="text-[#D40000] dark:text-red-400 font-semibold hover:underline cursor-pointer"
                  >
                    View Attendees ({evt.registeredCount || 0})
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditEvent(evt)}
                      className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                      title="Edit Event"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(evt.id, evt.title)}
                      className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {visibleEvents.length === 0 && (
              <div className="col-span-full py-12 text-center text-xs text-neutral-400 bg-white dark:bg-[#141520] rounded-2xl border border-neutral-200 dark:border-neutral-800">
                No events currently scheduled. Click "Create New Event" to launch one!
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: GALLERY & PHOTO ALBUMS
          ===================================================================== */}
      {currentTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#D40000]" />
                CUCC Photo Archives ({visibleGallery.length})
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Curate high-resolution event and workshop photos across Programming, Cyber Security, and Research wings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={galWingFilter}
                onChange={e => setGalWingFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#141520] text-neutral-900 dark:text-white font-medium"
              >
                <option value="all">All CUCC Wings</option>
                {activeWings.map(w => (
                  <option key={w.slug} value={w.slug}>{w.label}</option>
                ))}
              </select>

              <button
                onClick={handleOpenCreateGal}
                className="px-4 py-2 rounded-xl bg-[#D40000] hover:bg-red-800 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Photos</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleGallery
              .filter(g => galWingFilter === 'all' || g.wingSlug === galWingFilter)
              .map((item) => (
                <div 
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 aspect-square shadow-sm"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 flex flex-col justify-between">
                    <span className="self-start px-2 py-0.5 rounded font-mono text-[9px] bg-red-600/90 text-white font-bold uppercase">
                      {item.wingSlug.replace('_', ' ')}
                    </span>

                    <div>
                      <h5 className="font-bold text-white text-xs line-clamp-1">{item.title}</h5>
                      <p className="text-[10px] text-neutral-300 truncate">{item.eventName}</p>
                      
                      <div className="flex items-center justify-end gap-1.5 mt-2 pt-2 border-t border-white/20">
                        <button
                          onClick={() => handleOpenEditGal(item)}
                          className="p-1 rounded bg-white/20 hover:bg-white/40 text-white cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGalleryItem(item.id, item.title)}
                          className="p-1 rounded bg-red-600/80 hover:bg-red-700 text-white cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {visibleGallery.filter(g => galWingFilter === 'all' || g.wingSlug === galWingFilter).length === 0 && (
              <div className="col-span-full py-12 text-center text-xs text-neutral-400 bg-white dark:bg-[#141520] rounded-2xl border border-neutral-200 dark:border-neutral-800">
                No photos in this album. Click "Upload Photos" to add some!
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: NOTICES & PRESS CMS
          ===================================================================== */}
      {currentTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#D40000]" />
                CUCC Notices & Circulars ({visibleAnnouncements.length})
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Issue official club circulars, workshop schedules, and contest advisories for Computer Club students.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenCreateAnn}
                className="px-4 py-2.5 rounded-xl bg-[#D40000] hover:bg-red-800 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Post Notice</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white dark:bg-[#141520] border border-neutral-200 dark:border-[#2D1B22] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {ann.pinned && (
                        <span className="p-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          <Pin className="w-3.5 h-3.5 fill-amber-500" />
                        </span>
                      )}
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        ann.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        ann.priority === 'important' ? 'bg-amber-100 text-amber-800' :
                        'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}>
                        {ann.priority}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {ann.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {new Date(ann.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-neutral-900 dark:text-white leading-snug">
                    {ann.title}
                  </h4>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>

                  {ann.imageUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 aspect-16/9 bg-neutral-900 group">
                      <img 
                        src={ann.imageUrl} 
                        alt={ann.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-neutral-400">
                    Signatory: <strong>{ann.authorName}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditAnn(ann)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                      className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {visibleAnnouncements.length === 0 && (
              <div className="col-span-full py-12 text-center text-xs text-neutral-400 bg-white dark:bg-[#141520] rounded-2xl border border-neutral-200 dark:border-neutral-800">
                No circulars posted yet. Click "Post Notice" to inform members!
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: MEMBERS DIRECTORY (REMOVE MEMBERS ONLY; DON'T DELETE ACCOUNT)
          ===================================================================== */}
      {currentTab === 'members' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D40000]" />
                Enrolled CUCC Members ({clubMembersList.length})
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Active student members in Computer Club across Programming, Cyber Security, and Research wings.
              </p>
            </div>
          </div>

          {/* Search & Wing Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-[#141520] border border-neutral-200 dark:border-[#2D1B22] p-3 rounded-2xl shadow-xs text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search member by name, student ID, or department..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>

            <select
              value={memberWingFilter}
              onChange={e => setMemberWingFilter(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white font-medium"
            >
              <option value="all">All CUCC Wings</option>
              {activeWings.map(w => (
                <option key={w.slug} value={w.slug}>{w.label}</option>
              ))}
            </select>
          </div>

          {/* Members Table */}
          <div className="bg-white dark:bg-[#141520] border border-neutral-200 dark:border-[#2D1B22] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-[#1A1B28] border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="p-3.5">Student Member</th>
                    <th className="p-3.5">Student ID</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Assigned Wing</th>
                    <th className="p-3.5">Joined Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                  {clubMembersList
                    .filter(m => {
                      if (memberWingFilter !== 'all' && m.assignedWing !== memberWingFilter) return false;
                      if (memberSearch.trim()) {
                        const q = memberSearch.toLowerCase();
                        return (
                          m.name.toLowerCase().includes(q) ||
                          m.studentId.toLowerCase().includes(q) ||
                          m.email.toLowerCase().includes(q) ||
                          m.department.toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((m) => (
                      <tr key={m.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950 text-[#D40000] dark:text-red-300 flex items-center justify-center font-bold text-xs uppercase overflow-hidden shrink-0">
                              {m.avatar ? (
                                <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                              ) : (
                                m.name.substring(0, 2)
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-neutral-900 dark:text-white">{m.name}</div>
                              <div className="text-[11px] text-neutral-500 font-mono">{m.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-mono font-semibold">{m.studentId}</td>
                        <td className="p-3.5">{m.department}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-red-100 dark:bg-red-950 text-[#D40000] dark:text-red-300 font-bold uppercase">
                            {m.assignedWing ? m.assignedWing.replace('_', ' ') : 'General Member'}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-neutral-400 text-[11px]">{m.joinedAt}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleRemoveMember(m)}
                            disabled={actionProcessing}
                            className="px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/80 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ml-auto"
                            title="Remove member from club (clears club affiliation; does not delete account)"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            <span>Remove Member</span>
                          </button>
                        </td>
                      </tr>
                    ))}

                  {clubMembersList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-neutral-400">
                        No members currently enrolled in CUCC.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: NOTICE CREATE / EDIT
          ===================================================================== */}
      {annModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151620] border border-neutral-200 dark:border-[#382026] rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col">
            <div className="bg-[#D40000] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <h3 className="font-bold font-heading text-base">
                  {editingAnnId ? 'Update Notice' : 'Publish New CUCC Notice'}
                </h3>
              </div>
              <button onClick={() => setAnnModalOpen(false)} className="text-white cursor-pointer hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call for CUCC Programming Contest / Workshop"
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Priority Level
                  </label>
                  <select
                    value={annPriority}
                    onChange={e => setAnnPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                  >
                    <option value="general">General Circular</option>
                    <option value="important">Important Notice</option>
                    <option value="urgent">🔴 Urgent / Reschedule</option>
                    <option value="competition">🏆 Contest / Hackathon</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Notice, Contest, Workshop..."
                    value={annCategory}
                    onChange={e => setAnnCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Target Wing
                </label>
                <select
                  value={annWingSlug}
                  onChange={e => setAnnWingSlug(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white font-medium"
                >
                  <option value="all">All CUCC Wings</option>
                  {activeWings.map(w => (
                    <option key={w.slug} value={w.slug}>{w.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Poster Image URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://... or leave blank"
                  value={annImageUrl}
                  onChange={e => setAnnImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Notice Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter notice details, schedules, venues..."
                  value={annContent}
                  onChange={e => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAnnModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionProcessing}
                  className="px-5 py-2 rounded-xl bg-[#D40000] hover:bg-red-800 text-white font-bold cursor-pointer"
                >
                  {editingAnnId ? 'Update Notice' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: GALLERY IMAGE ADD / EDIT
          ===================================================================== */}
      {galModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151620] border border-neutral-200 dark:border-[#382026] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col">
            <div className="bg-[#D40000] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                <h3 className="font-bold font-heading text-base">
                  {editingGalId ? 'Update Photo' : 'Add Photos to CUCC Wing Album'}
                </h3>
              </div>
              <button onClick={() => setGalModalOpen(false)} className="text-white cursor-pointer hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="p-6 space-y-4 overflow-y-auto text-xs">
              {!editingGalId && (
                <div className="flex items-center gap-3 p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsBatchMode(false)}
                    className={`flex-1 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      !isBatchMode ? 'bg-[#D40000] text-white' : 'text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    Single Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBatchMode(true)}
                    className={`flex-1 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      isBatchMode ? 'bg-[#D40000] text-white' : 'text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    Batch Upload
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Target Wing Album *
                  </label>
                  <select
                    value={galWingSlug}
                    onChange={e => setGalWingSlug(e.target.value as ClubSubsector)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white font-medium"
                  >
                    {activeWings.map(w => (
                      <option key={w.slug} value={w.slug}>{w.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Event / Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hackathon 2026"
                    value={galEventName}
                    onChange={e => setGalEventName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Photo Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coding Finals Round"
                  value={galTitle}
                  onChange={e => setGalTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                />
              </div>

              {isBatchMode && !editingGalId ? (
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Image URLs (One per line) *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="https://images.unsplash.com/..."
                    value={galBatchUrls}
                    onChange={e => setGalBatchUrls(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={galImageUrl}
                    onChange={e => setGalImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Caption (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description..."
                  value={galCaption}
                  onChange={e => setGalCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGalModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionProcessing}
                  className="px-5 py-2 rounded-xl bg-[#D40000] hover:bg-red-800 text-white font-bold cursor-pointer"
                >
                  {editingGalId ? 'Update Photo' : 'Add to Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: EVENT CREATE & EDIT
          ===================================================================== */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151620] border border-neutral-200 dark:border-[#382026] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col">
            <div className="bg-[#D40000] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <h3 className="font-bold font-heading text-base">
                  {editingEventId ? 'Edit CUCC Event' : 'Create New CUCC Event'}
                </h3>
              </div>
              <button onClick={() => setEventModalOpen(false)} className="text-white cursor-pointer hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-3.5 overflow-y-auto text-xs">
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Intra University Programming Contest"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Club Entity
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Computer Club (CUCC)"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Subsector Wing *
                  </label>
                  <select
                    value={eventWingSlug}
                    onChange={e => setEventWingSlug(e.target.value as ClubSubsector)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white font-semibold"
                  >
                    {activeWings.map(w => (
                      <option key={w.slug} value={w.slug}>{w.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={eventTime}
                    onChange={e => setEventTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Capacity</label>
                  <input
                    type="number"
                    value={eventCapacity}
                    onChange={e => setEventCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Lab 402, Campus"
                  value={eventVenue}
                  onChange={e => setEventVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Banner URL</label>
                <input
                  type="text"
                  value={eventBanner}
                  onChange={e => setEventBanner(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Description</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={e => setEventDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionProcessing}
                  className="px-5 py-2 rounded-xl bg-[#D40000] hover:bg-red-800 text-white font-bold cursor-pointer"
                >
                  {editingEventId ? 'Save Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: ATTENDEE ROSTER MODAL
          ===================================================================== */}
      {attendeeRosterEvent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151620] border border-neutral-200 dark:border-[#382026] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="bg-[#D40000] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold font-heading text-base">{attendeeRosterEvent.title}</h3>
                <p className="text-xs text-red-100">Registered Student Attendee Pass Roster</p>
              </div>
              <button onClick={() => setAttendeeRosterEvent(null)} className="text-white cursor-pointer hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-xs space-y-3">
              {attendeeRosterEvent.registrations?.length ? (
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {attendeeRosterEvent.registrations.map(r => (
                    <div key={r.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white block">{r.userName}</span>
                        <span className="text-[11px] text-neutral-500 font-mono">{r.studentId} • {r.department}</span>
                      </div>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        {r.ticketCode}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-neutral-400">No students registered yet for this event.</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
