import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  X, 
  Plus,
  Trophy,
  Code2,
  ShieldCheck,
  Search,
  Sparkles,
  Compass,
  ArrowRight,
  ArrowLeft,
  Upload,
  FolderPlus,
  Image as ImageIcon,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { GalleryItem, ClubCategory, ClubSubsector } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';

export interface AlbumInfo {
  slug: ClubSubsector;
  title: string;
  clubId: ClubCategory;
  clubName: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: React.ElementType;
  themeColor: string;
  defaultCover: string;
}

export const ALBUMS_LIST: AlbumInfo[] = [
  {
    slug: 'programming',
    title: 'Programming & Hackathons Album',
    clubId: 'computer_club',
    clubName: 'Computer Club (CUCC)',
    subtitle: 'Code Sprints, 24-Hour Hackathons & ICPC',
    description: 'Coding sprints, 24-hour intra-varsity hackathons, algorithms competitions, software project expos, and ICPC bootcamps.',
    badge: 'Competitive Programming & Dev',
    icon: Code2,
    themeColor: 'from-blue-600 to-indigo-700',
    defaultCover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    slug: 'cyber_security',
    title: 'Cyber Security & CTF Album',
    clubId: 'computer_club',
    clubName: 'Computer Club (CUCC)',
    subtitle: 'National Cyber Drills & CTF Battlegrounds',
    description: 'National cyber drill trophies, ethical hacking battlegrounds, capture-the-flag competitions, and security symposiums.',
    badge: 'Ethical Hacking & Defense',
    icon: ShieldCheck,
    themeColor: 'from-red-600 to-rose-800',
    defaultCover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80'
  },
  {
    slug: 'research',
    title: 'Research & Colloquium Album',
    clubId: 'computer_club',
    clubName: 'Computer Club (CUCC)',
    subtitle: 'IEEE Papers, Colloquiums & Poster Sessions',
    description: 'IEEE conferences, undergraduate poster presentations, Bangla NLP breakthroughs, and scholarly paper reviews.',
    badge: 'Scholarly Research & Innovation',
    icon: Search,
    themeColor: 'from-emerald-600 to-teal-700',
    defaultCover: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80'
  }
];

interface GalleryPageProps {
  gallery: GalleryItem[];
  onPhotoLiked: (id: string, newLikes: number) => void;
  onPhotoAdded: (item: GalleryItem) => void;
  onPhotosAdded?: (items: GalleryItem[]) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  gallery,
  onPhotoLiked,
  onPhotoAdded,
  onPhotosAdded
}) => {
  const { user } = useAuth();
  
  // Navigation: null = 6 Dedicated Albums Directory view, or a specific ClubSubsector album
  const [selectedAlbum, setSelectedAlbum] = useState<ClubSubsector | null>(null);
  const [albumClubFilter, setAlbumClubFilter] = useState<'all' | ClubCategory>('all');
  
  // Lightbox
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Limitless Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [targetWing, setTargetWing] = useState<ClubSubsector>('programming');
  const [targetTitle, setTargetTitle] = useState('');
  const [targetEventName, setTargetEventName] = useState('');
  const [targetCaption, setTargetCaption] = useState('');
  const [photogName, setPhotogName] = useState(user?.name || '');
  
  // Input methods: URLs or File Picker
  const [uploadTab, setUploadTab] = useState<'files' | 'urls'>('files');
  const [urlsInput, setUrlsInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Array<{ name: string; dataUrl: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // Handle Like action
  const handleLike = async (item: GalleryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (likedMap[item.id]) return;

    setLikedMap(prev => ({ ...prev, [item.id]: true }));
    try {
      const res = await api.likeGalleryItem(item.id);
      if (res.success) {
        onPhotoLiked(item.id, res.likes);
        if (activeItem && activeItem.id === item.id) {
          setActiveItem({ ...activeItem, likes: res.likes });
        }
      }
    } catch {
      // rollback
    }
  };

  // Helper: Open upload modal pre-set for a specific album
  const openUploadForAlbum = (albumSlug: ClubSubsector) => {
    setTargetWing(albumSlug);
    setUploadModalOpen(true);
    setUploadSuccessMsg('');
  };

  // File Picker conversion to base64 Data URLs (enables limitless local photos without external hosting)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedFiles((prev) => [
            ...prev,
            { name: file.name, dataUrl: event.target!.result as string }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Submit limitless photos into the selected album
  const handleAddPhotosSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gather all image URLs from either files or text URLs
    const gatheredUrls: string[] = [];
    
    if (uploadTab === 'files') {
      selectedFiles.forEach(f => gatheredUrls.push(f.dataUrl));
    } else {
      const lines = urlsInput
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);
      gatheredUrls.push(...lines);
    }

    if (gatheredUrls.length === 0) {
      alert('Please select at least one photo file or paste image URLs.');
      return;
    }

    setIsUploading(true);
    setUploadSuccessMsg('');

    try {
      const targetAlbumObj = ALBUMS_LIST.find(a => a.slug === targetWing);
      const targetClubId = targetAlbumObj?.clubId || (['programming', 'cyber_security', 'research'].includes(targetWing) ? 'computer_club' : 'events_and_clubs');

      const res = await api.createGalleryItem({
        title: targetTitle || `${targetAlbumObj?.title || 'Album'} Photo`,
        caption: targetCaption,
        clubId: targetClubId,
        wingSlug: targetWing,
        eventName: targetEventName || targetAlbumObj?.title || 'Campus Moment',
        photogName: photogName || user?.name || 'City University Member',
        imageUrl: gatheredUrls[0],
        imageUrls: gatheredUrls
      }, user?.id);

      setIsUploading(false);

      if (res.success) {
        if (res.items && res.items.length > 0) {
          if (onPhotosAdded) {
            onPhotosAdded(res.items);
          } else {
            res.items.forEach(item => onPhotoAdded(item));
          }
        } else if (res.item) {
          onPhotoAdded(res.item);
        }

        setUploadSuccessMsg(`🎉 Successfully added ${gatheredUrls.length} photo${gatheredUrls.length > 1 ? 's' : ''} to ${targetAlbumObj?.title}!`);
        
        // Reset inputs
        setSelectedFiles([]);
        setUrlsInput('');
        setTargetTitle('');
        setTargetCaption('');
        setTargetEventName('');

        // Close after short feedback
        setTimeout(() => {
          setUploadModalOpen(false);
          setUploadSuccessMsg('');
        }, 1200);
      }
    } catch {
      setIsUploading(false);
      alert('Failed to add photos to album. Please try again.');
    }
  };

  // Get active album details if opened
  const currentAlbumObj = selectedAlbum ? ALBUMS_LIST.find(a => a.slug === selectedAlbum) : null;
  const currentAlbumPhotos = selectedAlbum ? gallery.filter(item => item.wingSlug === selectedAlbum) : [];

  // Filtered albums for directory view
  const filteredAlbums = ALBUMS_LIST.filter(a => {
    if (albumClubFilter === 'all') return true;
    return a.clubId === albumClubFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-[#D40000] dark:text-red-300 text-xs font-bold uppercase tracking-wider">
            City University Visual Archives
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 dark:text-white">
            Campus Albums & Visual Records
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Explore dedicated photo albums for each university wing. Upload limitless memories from cricket championships, programming hackathons, CTFs, research colloquiums, and tours.
          </p>
        </div>

        {/* Action Button: Add Photos to Any Album */}
        <button
          onClick={() => {
            if (selectedAlbum) {
              setTargetWing(selectedAlbum);
            }
            setUploadModalOpen(true);
            setUploadSuccessMsg('');
          }}
          className="px-5 py-2.5 rounded-xl bg-[#D40000] hover:bg-red-800 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all self-start md:self-auto cursor-pointer shadow-md flex items-center gap-2"
        >
          <FolderPlus className="w-4 h-4" />
          <span>+ Add Photos to Album</span>
        </button>
      </div>

      {/* CUCC Dedicated Albums Directory Header */}
      {selectedAlbum === null && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              CUCC Archives:
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#D40000] dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-900/60">
              <span>Computer Club (CUCC) · All 3 Specialized Wings</span>
            </div>
          </div>

          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Showing 3 official technological albums
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENARIO 1: SPECIFIC ALBUM VIEW (INSIDE ONE ALBUM)       */}
      {/* ======================================================== */}
      {selectedAlbum && currentAlbumObj && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Back button & Album Header Banner */}
          <div className="space-y-4">
            <button
              onClick={() => setSelectedAlbum(null)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:text-[#D40000] dark:hover:text-[#D40000] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to All 6 Albums</span>
            </button>

            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 text-white p-6 sm:p-10 border border-neutral-800 shadow-xl">
              {/* Subtle background glow */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#D40000]/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#D40000] text-white flex items-center justify-center shadow-xs">
                      <currentAlbumObj.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-red-200 border border-white/10">
                      {currentAlbumObj.clubName}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D40000] text-white">
                      {currentAlbumPhotos.length} Photo{currentAlbumPhotos.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                    {currentAlbumObj.title}
                  </h2>
                  <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                    {currentAlbumObj.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                  <button
                    onClick={() => openUploadForAlbum(currentAlbumObj.slug)}
                    className="px-5 py-3 rounded-xl bg-[#D40000] hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Photos to this Album</span>
                  </button>
                  <span className="text-[11px] text-neutral-400 text-center">
                    Unlimited uploads supported
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Photos Grid Inside Album */}
          {currentAlbumPhotos.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-300 dark:border-neutral-700 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-950/60 text-[#D40000] flex items-center justify-center">
                <ImageIcon className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  No photos in this album yet
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                  Be the first to add memories, competition photos, or victory celebrations to this album!
                </p>
              </div>
              <button
                onClick={() => openUploadForAlbum(currentAlbumObj.slug)}
                className="px-6 py-2.5 rounded-xl bg-[#D40000] hover:bg-red-800 text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Photo</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentAlbumPhotos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className="group rounded-2xl bg-white dark:bg-[#18050E] border border-neutral-200 dark:border-[#380E1C] overflow-hidden shadow-xs hover:shadow-xl hover:border-red-400 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-neutral-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded bg-[#D40000] text-white text-[10px] font-bold uppercase shadow-xs flex items-center gap-1">
                        <currentAlbumObj.icon className="w-3 h-3 text-amber-200" />
                        <span>{item.wingSlug.replace('_', ' ')}</span>
                      </span>
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={(e) => handleLike(item, e)}
                      className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-xs transition-colors ${
                        likedMap[item.id]
                          ? 'bg-red-600 text-white'
                          : 'bg-black/40 text-white hover:bg-red-600'
                      }`}
                      title="Cheer and like this activity photo"
                    >
                      <Heart className={`w-4 h-4 ${likedMap[item.id] ? 'fill-current' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[10px] text-amber-300 font-semibold">{item.eventName}</p>
                      <h3 className="font-bold text-sm leading-snug line-clamp-1">{item.title}</h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs">
                    <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {item.caption || `${item.title} at City University.`}
                    </p>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {item.date}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">
                        <Heart className="w-3.5 h-3.5 fill-current" /> {item.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENARIO 2: ALL 6 ALBUMS DIRECTORY VIEW                  */}
      {/* ======================================================== */}
      {selectedAlbum === null && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredAlbums.map((album) => {
              const albumPhotos = gallery.filter(item => item.wingSlug === album.slug);
              // Use latest uploaded photo as album cover, or fallback cover
              const coverUrl = albumPhotos.length > 0 ? albumPhotos[0].imageUrl : album.defaultCover;
              const IconComp = album.icon;

              return (
                <div
                  key={album.slug}
                  onClick={() => setSelectedAlbum(album.slug)}
                  className="group rounded-3xl bg-white dark:bg-[#16050C] border border-neutral-200 dark:border-[#380E1C] overflow-hidden shadow-xs hover:shadow-2xl hover:border-[#D40000] dark:hover:border-[#D40000] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Album Cover Photo with Badge */}
                  <div className="relative aspect-16/10 overflow-hidden bg-neutral-900">
                    <img
                      src={coverUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Top Club Badge */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                        {album.clubName}
                      </span>
                    </div>

                    {/* Photo Count Tag */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className="px-3 py-1 rounded-full bg-[#D40000] text-white text-[11px] font-bold shadow-md">
                        {albumPhotos.length} Photo{albumPhotos.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {/* Bottom Album Info on image */}
                    <div className="absolute bottom-3.5 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-[#D40000] text-white flex items-center justify-center shadow-xs">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold font-heading leading-tight drop-shadow-sm">
                          {album.title}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-300 line-clamp-1">
                        {album.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Album Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {album.description}
                    </p>

                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openUploadForAlbum(album.slug);
                        }}
                        className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-[#D40000] dark:hover:text-[#D40000] transition-colors flex items-center gap-1.5 cursor-pointer py-1"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#D40000]" />
                        <span>+ Add Photos</span>
                      </button>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D40000] group-hover:translate-x-1 transition-transform">
                        <span>Open Album</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LIMITLESS PHOTO UPLOAD MODAL                             */}
      {/* ======================================================== */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#151620] border border-neutral-200 dark:border-[#382026] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
            
            <button
              onClick={() => {
                setUploadModalOpen(false);
                setSelectedFiles([]);
                setUploadSuccessMsg('');
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-[#D40000] dark:text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Upload className="w-3.5 h-3.5" />
                <span>Limitless Photo Addition</span>
              </div>
              <h3 className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">
                Add Photos to Album
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Upload photos from your computer or phone, or paste multiple image URLs with no limit.
              </p>
            </div>

            {uploadSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{uploadSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddPhotosSubmit} className="space-y-4">
              
              {/* Target Album Selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Select Target Album *
                </label>
                <select
                  value={targetWing}
                  onChange={(e) => setTargetWing(e.target.value as ClubSubsector)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                >
                  <option value="programming">💻 Programming & Hackathons Album (CUCC Coding)</option>
                  <option value="cyber_security">🛡️ Cyber Security & CTF Album (CUCC CTFs, Drills)</option>
                  <option value="research">🔬 Research & Colloquium Album (CUCC IEEE, AI Labs)</option>
                </select>
              </div>

              {/* Upload Method Switcher: Files vs URLs */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Photo Source *
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl mb-3">
                  <button
                    type="button"
                    onClick={() => setUploadTab('files')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      uploadTab === 'files'
                        ? 'bg-white dark:bg-neutral-900 text-[#D40000] dark:text-white shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Files from Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadTab('urls')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      uploadTab === 'urls'
                        ? 'bg-white dark:bg-neutral-900 text-[#D40000] dark:text-white shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Paste Image URLs</span>
                  </button>
                </div>

                {/* Tab 1: Local File Picker */}
                {uploadTab === 'files' && (
                  <div className="space-y-3">
                    <label className="block border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-[#D40000] dark:hover:border-[#D40000] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-neutral-50/50 dark:bg-neutral-900/40">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/70 text-[#D40000] flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                          Click to select photos or drag & drop
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Select 1, 5, 20+ photos at once (JPG, PNG, WebP)
                        </p>
                      </div>
                    </label>

                    {/* Previews of selected files */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300">
                          <span>{selectedFiles.length} photo{selectedFiles.length === 1 ? '' : 's'} ready to add:</span>
                          <button
                            type="button"
                            onClick={() => setSelectedFiles([])}
                            className="text-[#D40000] hover:underline text-[11px]"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl">
                          {selectedFiles.map((file, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group/thumb border border-neutral-300 dark:border-neutral-700">
                              <img src={file.dataUrl} alt={file.name} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeSelectedFile(idx)}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: URLs Input */}
                {uploadTab === 'urls' && (
                  <div>
                    <textarea
                      value={urlsInput}
                      onChange={(e) => setUrlsInput(e.target.value)}
                      rows={3}
                      placeholder="Paste image URLs (one per line, e.g. https://... or /assets/...)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1">
                      Paste as many URLs as you like, one per line. Limitless additions supported.
                    </p>
                  </div>
                )}
              </div>

              {/* Event Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Event / Occasion Name
                  </label>
                  <input
                    type="text"
                    value={targetEventName}
                    onChange={(e) => setTargetEventName(e.target.value)}
                    placeholder="e.g. CPCL Tournament Final 2026"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Photo Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={targetTitle}
                    onChange={(e) => setTargetTitle(e.target.value)}
                    placeholder="e.g. Trophy Celebration Moment"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                  />
                </div>
              </div>

              {/* Caption & Credit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={targetCaption}
                    onChange={(e) => setTargetCaption(e.target.value)}
                    placeholder="Brief highlight description"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Photographer Credit
                  </label>
                  <input
                    type="text"
                    value={photogName}
                    onChange={(e) => setPhotogName(e.target.value)}
                    placeholder="e.g. CU Media Wing"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 rounded-xl bg-[#D40000] hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {isUploading ? 'Uploading Photos...' : 'Save & Add Photos to Album'}
                  </span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LIGHTBOX MODAL                                           */}
      {/* ======================================================== */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151620] border border-neutral-200 dark:border-[#382026] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-16/10 bg-black overflow-hidden flex items-center justify-center">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-[#D40000] uppercase tracking-wider">
                    {activeItem.wingSlug.replace('_', ' ')} · {activeItem.eventName}
                  </span>
                  <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white">
                    {activeItem.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleLike(activeItem)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    likedMap[activeItem.id]
                      ? 'bg-red-50 text-[#D40000] border border-red-200'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedMap[activeItem.id] ? 'fill-current text-[#D40000]' : ''}`} />
                  <span>{activeItem.likes}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                {activeItem.caption || `${activeItem.title} at City University.`}
              </p>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                <span>Photographer: {activeItem.photogName || 'CU Media'}</span>
                <span>Captured on {activeItem.date}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
