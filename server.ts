import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_USERS,
  INITIAL_CLUBS,
  INITIAL_EVENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_GALLERY,
  INITIAL_APPLICATIONS,
  INITIAL_MEMBER_REQUESTS
} from './src/data/initialData.ts';
import type {
  User,
  Club,
  ClubCategory,
  ClubSubsector,
  ClubEvent,
  Announcement,
  GalleryItem,
  ControllerApplication,
  MemberRequest,
  EventRegistration,
  UserRole
} from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database Store
let users: User[] = [...INITIAL_USERS];
let clubs: Club[] = JSON.parse(JSON.stringify(INITIAL_CLUBS));
let events: ClubEvent[] = JSON.parse(JSON.stringify(INITIAL_EVENTS));
let announcements: Announcement[] = JSON.parse(JSON.stringify(INITIAL_ANNOUNCEMENTS));
let gallery: GalleryItem[] = JSON.parse(JSON.stringify(INITIAL_GALLERY));
let applications: ControllerApplication[] = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));
let memberRequests: MemberRequest[] = JSON.parse(JSON.stringify(INITIAL_MEMBER_REQUESTS));

// Wing to Club mapping helper
const CLUB_WINGS: Record<ClubCategory, ClubSubsector[]> = {
  computer_club: ['programming', 'cyber_security', 'research'],
  events_and_clubs: ['sports', 'cultural', 'tour']
};

const getClubForWing = (wingSlug: ClubSubsector): ClubCategory => {
  if (['programming', 'cyber_security', 'research'].includes(wingSlug)) {
    return 'computer_club';
  }
  return 'events_and_clubs';
};

// Security helper: checks if a user is allowed to manage a specific club entity
const canManageClub = (user: User, targetClubId: ClubCategory): boolean => {
  if (user.role === 'administrator') return true;
  if (user.role === 'controller' && user.clubAffiliation === targetClubId) return true;
  return false;
};

async function startServer() {
  const app = express();
  
  // Resolve port
  const portArgIndex = process.argv.indexOf('--port');
  const cliPort = portArgIndex !== -1 ? Number(process.argv[portArgIndex + 1]) : NaN;
  const envPort = Number(process.env.PORT);
  const defaultPort = Number(process.env.DEFAULT_APP_PORT);
  const PORT = !isNaN(cliPort) && cliPort > 0
    ? cliPort
    : (defaultPort || (envPort && envPort !== 8080 ? envPort : 3000));

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // CORS headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Helper auth check from header
  const getAuthUser = (req: Request): User | undefined => {
    const userId = req.headers['x-user-id'] as string;
    if (userId) {
      return users.find(u => u.id === userId);
    }
    return undefined;
  };

  /* ==========================================================================
     API ROUTES
     ========================================================================== */

  // 0. Health check & Portal Meta
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      success: true,
      app: 'City University Events & Clubs (CUEC)',
      status: 'healthy',
      version: '1.1.0',
      timestamp: new Date().toISOString()
    });
  });

  // 1. Stats overview
  app.get('/api/stats', (_req: Request, res: Response) => {
    const totalMembers = clubs.reduce((acc, c) => acc + c.totalMembers, 0);
    const activeEvents = events.filter(e => e.status === 'upcoming').length;
    const totalAnnouncements = announcements.length;
    const pendingApplications = applications.filter(a => a.status === 'pending').length;
    const pendingMemberRequests = memberRequests.filter(r => r.status === 'pending').length;

    res.json({
      success: true,
      stats: {
        totalClubs: clubs.length,
        totalWings: clubs.reduce((acc, c) => acc + c.wings.length, 0),
        totalMembers,
        activeEvents,
        totalAnnouncements,
        pendingApplications,
        pendingMemberRequests,
        registeredUsers: users.length
      }
    });
  });

  // 2. Clubs & Wings (Controller cannot edit club core details; Admin only)
  app.get('/api/clubs', (_req: Request, res: Response) => {
    res.json({ success: true, clubs });
  });

  app.get('/api/clubs/:id', (req: Request, res: Response) => {
    const club = clubs.find(c => c.id === req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }
    res.json({ success: true, club });
  });

  app.put('/api/clubs/:id', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
    }
    if (authUser.role !== 'administrator') {
      return res.status(403).json({ success: false, message: 'Forbidden. Only Administrators can modify club core details.' });
    }
    const idx = clubs.findIndex(c => c.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }
    clubs[idx] = { ...clubs[idx], ...req.body, id: clubs[idx].id };
    res.json({ success: true, club: clubs[idx] });
  });

  // 3. Events (Admin or Controller for their own club)
  app.get('/api/events', (req: Request, res: Response) => {
    let result = [...events];
    const { clubId, wingSlug, status, search } = req.query;

    if (clubId && clubId !== 'all') {
      result = result.filter(e => e.clubId === clubId);
    }
    if (wingSlug && wingSlug !== 'all') {
      result = result.filter(e => e.wingSlug === wingSlug);
    }
    if (status && status !== 'all') {
      result = result.filter(e => e.status === status);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, events: result });
  });

  app.get('/api/events/:id', (req: Request, res: Response) => {
    const evt = events.find(e => e.id === req.params.id);
    if (!evt) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, event: evt });
  });

  app.post('/api/events', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required to create events.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Forbidden. Only Administrators and Controllers can create events.' });
    }

    // Force clubId for controllers to their own club
    const effectiveClubId: ClubCategory = authUser.role === 'controller' 
      ? (authUser.clubAffiliation || 'computer_club')
      : (req.body.clubId || 'computer_club');

    const {
      title,
      wingSlug,
      category,
      description,
      fullDetails,
      bannerUrl,
      date,
      time,
      venue,
      registrationDeadline,
      capacity,
      chiefGuests,
      tags,
      kicker
    } = req.body;

    if (!title || !wingSlug || !date || !venue) {
      return res.status(400).json({ success: false, message: 'Missing required event fields (title, wing, date, venue).' });
    }

    // Verify wing belongs to the effective club
    const validWings = CLUB_WINGS[effectiveClubId];
    if (!validWings.includes(wingSlug)) {
      return res.status(403).json({
        success: false,
        message: `Invalid wing '${wingSlug}' for ${effectiveClubId === 'computer_club' ? 'Computer Club' : 'Events & Clubs'}. Allowed wings: ${validWings.join(', ')}.`
      });
    }

    const newEvent: ClubEvent = {
      id: `evt-${Date.now()}`,
      title,
      clubId: effectiveClubId,
      wingSlug,
      category: category || 'General Event',
      kicker: kicker || `${(category || 'Event').toUpperCase()} · ${wingSlug.replace('_', ' ').toUpperCase()}`,
      description: description || '',
      fullDetails: fullDetails || description || '',
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      date,
      time: time || '10:00 AM',
      venue,
      registrationDeadline: registrationDeadline || date,
      capacity: Number(capacity) || 100,
      registeredCount: 0,
      chiefGuests: Array.isArray(chiefGuests) ? chiefGuests : (chiefGuests ? [chiefGuests] : []),
      tags: Array.isArray(tags) ? tags : ['CUEC', 'Campus'],
      isFeatured: req.body.isFeatured || false,
      status: 'upcoming',
      registrations: []
    };

    events.unshift(newEvent);
    res.status(201).json({ success: true, event: newEvent });
  });

  app.put('/api/events/:id', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    const idx = events.findIndex(e => e.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const existingEvent = events[idx];
    if (!canManageClub(authUser, existingEvent.clubId)) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only modify events belonging to your own club.' });
    }

    // Protect clubId and ID from change if controller
    const updatedClubId: ClubCategory = authUser.role === 'administrator' ? (req.body.clubId || existingEvent.clubId) : existingEvent.clubId;
    const updatedWing = req.body.wingSlug || existingEvent.wingSlug;

    // Check wing validity for target club
    if (!CLUB_WINGS[updatedClubId].includes(updatedWing)) {
      return res.status(400).json({ success: false, message: `Wing '${updatedWing}' does not belong to ${updatedClubId}.` });
    }

    events[idx] = {
      ...events[idx],
      ...req.body,
      id: existingEvent.id, // protect ID
      clubId: updatedClubId,
      wingSlug: updatedWing
    };

    res.json({ success: true, event: events[idx] });
  });

  app.delete('/api/events/:id', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    const evt = events.find(e => e.id === req.params.id);
    if (!evt) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (!canManageClub(authUser, evt.clubId)) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only delete events belonging to your own club.' });
    }

    events = events.filter(e => e.id !== req.params.id);
    res.json({ success: true, message: 'Event removed successfully.' });
  });

  // Register for event
  app.post('/api/events/:id/register', (req: Request, res: Response) => {
    const evt = events.find(e => e.id === req.params.id);
    if (!evt) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const { userId, userName, studentId, email, department } = req.body;
    if (!userName || !studentId || !email) {
      return res.status(400).json({ success: false, message: 'Student information is required for registration.' });
    }

    // Check duplicate
    const alreadyRegistered = evt.registrations.some(
      r => r.studentId === studentId || r.email === email || (userId && r.userId === userId)
    );
    if (alreadyRegistered) {
      return res.status(400).json({ success: false, message: 'Student is already registered for this event.' });
    }

    // Seat limitations removed - open access for all club and sidewings

    const registration: EventRegistration = {
      id: `reg-${Date.now()}`,
      userId: userId || `guest-${Date.now()}`,
      userName,
      studentId,
      email,
      department: department || 'General Studies',
      registeredAt: new Date().toISOString(),
      ticketCode: `CUEC-${evt.clubId.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    evt.registrations.push(registration);
    evt.registeredCount = evt.registrations.length;

    res.status(201).json({ success: true, registration, event: evt });
  });

  // 4. Announcements (Admin or Controller for their own club)
  app.get('/api/announcements', (req: Request, res: Response) => {
    let result = [...announcements];
    const { clubId, priority } = req.query;

    if (clubId && clubId !== 'all') {
      result = result.filter(a => a.clubId === clubId || a.clubId === 'all');
    }
    if (priority && priority !== 'all') {
      result = result.filter(a => a.priority === priority);
    }

    result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    res.json({ success: true, announcements: result });
  });

  app.post('/api/announcements', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Forbidden. Only Administrators and Controllers can issue announcements.' });
    }

    const { title, content, priority, category, attachmentName, imageUrl, pinned, wingSlug } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    // Force clubId for controllers
    let effectiveClubId: ClubCategory | 'all' = req.body.clubId || 'all';
    if (authUser.role === 'controller') {
      effectiveClubId = authUser.clubAffiliation || 'computer_club';
    }

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      clubId: effectiveClubId,
      wingSlug: wingSlug || 'all',
      priority: priority || 'general',
      publishedAt: new Date().toISOString(),
      authorName: authUser.name,
      authorRole: authUser.role === 'administrator' ? 'Administrator' : `Club Controller (${effectiveClubId === 'computer_club' ? 'CUCC' : 'Events & Clubs'})`,
      attachmentName,
      imageUrl: imageUrl || undefined,
      category: category || 'Notice',
      pinned: !!pinned
    };

    announcements.unshift(newAnnouncement);
    res.status(201).json({ success: true, announcement: newAnnouncement });
  });

  app.put('/api/announcements/:id', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const idx = announcements.findIndex(a => a.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    const existing = announcements[idx];
    if (authUser.role === 'controller' && existing.clubId !== authUser.clubAffiliation) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only edit announcements for your own club.' });
    }

    const updatedClubId = authUser.role === 'controller' ? existing.clubId : (req.body.clubId || existing.clubId);

    announcements[idx] = {
      ...existing,
      ...req.body,
      id: existing.id,
      clubId: updatedClubId
    };

    res.json({ success: true, announcement: announcements[idx] });
  });

  app.delete('/api/announcements/:id', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const ann = announcements.find(a => a.id === req.params.id);
    if (!ann) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    if (authUser.role === 'controller' && ann.clubId !== authUser.clubAffiliation) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only delete announcements for your own club.' });
    }

    announcements = announcements.filter(a => a.id !== req.params.id);
    res.json({ success: true, message: 'Announcement removed successfully.' });
  });

  // 5. Gallery (Admin or Controller for their own club)
  app.get('/api/gallery', (req: Request, res: Response) => {
    let result = [...gallery];
    const { clubId, wingSlug } = req.query;

    if (clubId && clubId !== 'all') {
      result = result.filter(g => g.clubId === clubId);
    }
    if (wingSlug && wingSlug !== 'all') {
      result = result.filter(g => g.wingSlug === wingSlug);
    }

    res.json({ success: true, gallery: result });
  });

  app.post('/api/gallery', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Unauthorized. Only Administrators and Controllers can upload gallery media.' });
    }

    const { title, caption, imageUrl, imageUrls, wingSlug, eventName } = req.body;
    if (!wingSlug) {
      return res.status(400).json({ success: false, message: 'Target wing slug is required.' });
    }

    // Force clubId
    const effectiveClubId: ClubCategory = authUser.role === 'controller'
      ? (authUser.clubAffiliation || 'computer_club')
      : (req.body.clubId || getClubForWing(wingSlug));

    // Verify wing belongs to club
    if (!CLUB_WINGS[effectiveClubId].includes(wingSlug)) {
      return res.status(403).json({
        success: false,
        message: `Wing '${wingSlug}' does not belong to ${effectiveClubId === 'computer_club' ? 'Computer Club' : 'Events & Clubs'}.`
      });
    }

    // Batch upload support
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      const createdItems: GalleryItem[] = [];
      imageUrls.forEach((url: string, index: number) => {
        if (!url || typeof url !== 'string') return;
        const newItem: GalleryItem = {
          id: `gal-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
          title: title || `${String(wingSlug).replace('_', ' ')} Photo ${index + 1}`,
          caption: caption || '',
          imageUrl: url,
          clubId: effectiveClubId,
          wingSlug,
          eventName: eventName || 'University Album Photo',
          date: new Date().toISOString().split('T')[0],
          photogName: authUser.name,
          likes: 0
        };
        gallery.unshift(newItem);
        createdItems.push(newItem);
      });
      return res.status(201).json({ success: true, items: createdItems, item: createdItems[0] });
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image URL is required.' });
    }

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title || `${String(wingSlug).replace('_', ' ')} Photo`,
      caption: caption || '',
      imageUrl,
      clubId: effectiveClubId,
      wingSlug,
      eventName: eventName || 'University Album Photo',
      date: new Date().toISOString().split('T')[0],
      photogName: authUser.name,
      likes: 0
    };

    gallery.unshift(newItem);
    res.status(201).json({ success: true, item: newItem });
  });

  app.post('/api/gallery/:id/like', (req: Request, res: Response) => {
    const item = gallery.find(g => g.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }
    item.likes += 1;
    res.json({ success: true, likes: item.likes });
  });

  app.put('/api/gallery/:id', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const idx = gallery.findIndex(g => g.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    const item = gallery[idx];
    if (!canManageClub(authUser, item.clubId)) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only edit photos in your own club album.' });
    }

    gallery[idx] = { 
      ...gallery[idx], 
      ...req.body, 
      id: gallery[idx].id,
      clubId: item.clubId // protect clubId
    };
    res.json({ success: true, item: gallery[idx] });
  });

  app.delete('/api/gallery/:id', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const item = gallery.find(g => g.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    if (!canManageClub(authUser, item.clubId)) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only delete photos from your own club album.' });
    }

    gallery = gallery.filter(g => g.id !== req.params.id);
    res.json({ success: true, message: 'Gallery item deleted.' });
  });

  // 6. Member Requests (Student submits, Controller/Admin reviews for their own club)
  app.post('/api/member-requests', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Please sign in to submit a membership request.' });
    }

    const { clubId, wingSlug, reason } = req.body;
    if (!clubId || !wingSlug || !reason) {
      return res.status(400).json({ success: false, message: 'Club, wing choice, and statement of interest are required.' });
    }

    // Verify wing belongs to club
    if (!CLUB_WINGS[clubId as ClubCategory]?.includes(wingSlug)) {
      return res.status(400).json({ success: false, message: `Wing '${wingSlug}' does not belong to the selected club.` });
    }

    // Check duplicate pending request for this user and club
    const hasPending = memberRequests.some(
      r => (r.userId === authUser.id || r.studentId === authUser.studentId) && 
           r.clubId === clubId && 
           r.status === 'pending'
    );

    if (hasPending) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active pending membership request for this club under review.'
      });
    }

    const newRequest: MemberRequest = {
      id: `mreq-${Date.now()}`,
      userId: authUser.id,
      name: authUser.name,
      studentId: authUser.studentId,
      email: authUser.email,
      department: authUser.department || 'General',
      clubId,
      wingSlug,
      reason: reason.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    memberRequests.unshift(newRequest);
    res.status(201).json({ success: true, request: newRequest });
  });

  app.get('/api/member-requests', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    let result = [...memberRequests];

    if (authUser.role === 'controller') {
      // Controller only sees requests for their own club
      result = result.filter(r => r.clubId === authUser.clubAffiliation);
    } else if (authUser.role === 'user') {
      // Regular user sees their own requests
      result = result.filter(r => r.userId === authUser.id || r.studentId === authUser.studentId);
    }
    // Administrator sees all requests

    res.json({ success: true, requests: result });
  });

  app.patch('/api/member-requests/:id/approve', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Unauthorized. Only Administrators and Controllers can approve member requests.' });
    }

    const request = memberRequests.find(r => r.id === req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Member request not found.' });
    }

    if (!canManageClub(authUser, request.clubId)) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only approve member requests for your own club.' });
    }

    if (request.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Member request is already approved.' });
    }

    request.status = 'approved';
    request.reviewedAt = new Date().toISOString();
    request.reviewedBy = `${authUser.name} (${authUser.role === 'administrator' ? 'Administrator' : 'Controller'})`;

    // Assign club and wing to user
    const targetUser = users.find(u => u.id === request.userId || u.studentId === request.studentId);
    if (targetUser) {
      targetUser.clubAffiliation = request.clubId;
      targetUser.assignedWing = request.wingSlug;
    }

    // Increment club total members
    const club = clubs.find(c => c.id === request.clubId);
    if (club) {
      club.totalMembers += 1;
    }

    res.json({ success: true, request, message: 'Member request approved and student joined the wing.' });
  });

  app.patch('/api/member-requests/:id/reject', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const request = memberRequests.find(r => r.id === req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Member request not found.' });
    }

    if (!canManageClub(authUser, request.clubId)) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only reject member requests for your own club.' });
    }

    request.status = 'rejected';
    request.reviewedAt = new Date().toISOString();
    request.reviewedBy = `${authUser.name} (${authUser.role === 'administrator' ? 'Administrator' : 'Controller'})`;

    res.json({ success: true, request, message: 'Member request marked as rejected.' });
  });

  // 7. Club Members Management
  app.get('/api/members', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    let members = users.filter(u => u.role === 'user');

    if (authUser.role === 'controller') {
      members = members.filter(u => u.clubAffiliation === authUser.clubAffiliation);
    } else {
      const { clubId } = req.query;
      if (clubId && clubId !== 'all') {
        members = members.filter(u => u.clubAffiliation === clubId);
      }
    }

    res.json({ success: true, members });
  });

  app.delete('/api/members/:userId', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator' && authUser.role !== 'controller') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const targetUser = users.find(u => u.id === req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    // Role check: Only 'user' can be removed as regular members
    if (targetUser.role !== 'user') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only regular student members can be removed here. Controllers and administrators cannot be removed via member management.' 
      });
    }

    // Club ownership check
    if (targetUser.clubAffiliation && !canManageClub(authUser, targetUser.clubAffiliation)) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only remove members from your own club.' });
    }

    const oldClubId = targetUser.clubAffiliation;
    targetUser.clubAffiliation = undefined;
    targetUser.assignedWing = undefined;

    // Decrease club member count
    if (oldClubId) {
      const club = clubs.find(c => c.id === oldClubId);
      if (club && club.totalMembers > 0) {
        club.totalMembers -= 1;
      }
    }

    res.json({ success: true, user: targetUser, message: 'Student removed from club membership successfully.' });
  });

  // 8. Controller Candidacy Applications (ADMIN ONLY)
  app.get('/api/applications', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator') {
      return res.status(403).json({ success: false, message: 'Forbidden. Controller applications are restricted to Administrators.' });
    }
    res.json({ success: true, applications });
  });

  app.post('/api/applications', (req: Request, res: Response) => {
    const {
      applicantName,
      applicantEmail,
      studentId,
      department,
      currentSemester,
      cgpa,
      targetClub,
      targetWing,
      statementOfIntent,
      experience,
      portfolioLink
    } = req.body;

    if (!applicantName || !applicantEmail || !studentId || !targetClub || !targetWing || !statementOfIntent) {
      return res.status(400).json({ success: false, message: 'Please complete all required application fields.' });
    }

    const existing = applications.find(
      a => a.studentId === studentId && a.status === 'pending'
    );
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active pending controller application under review.'
      });
    }

    const newApp: ControllerApplication = {
      id: `app-${Date.now()}`,
      applicantName,
      applicantEmail,
      studentId,
      department: department || 'Undergraduate',
      currentSemester: currentSemester || '5th Semester',
      cgpa: cgpa || '3.50',
      targetClub,
      targetWing,
      statementOfIntent,
      experience: experience || 'Active university volunteer',
      portfolioLink,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    applications.unshift(newApp);
    res.status(201).json({ success: true, application: newApp });
  });

  app.patch('/api/applications/:id/approve', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator') {
      return res.status(403).json({ success: false, message: 'Forbidden. Only Administrators can approve controller applications.' });
    }

    const appItem = applications.find(a => a.id === req.params.id);
    if (!appItem) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    appItem.status = 'approved';
    appItem.reviewedAt = new Date().toISOString();
    appItem.reviewedBy = authUser.name;
    appItem.adminNotes = req.body.adminNotes || 'Application reviewed and approved for official Controller status.';

    const existingUser = users.find(u => u.email === appItem.applicantEmail || u.studentId === appItem.studentId);
    if (existingUser) {
      existingUser.role = 'controller';
      existingUser.clubAffiliation = appItem.targetClub;
      existingUser.assignedWing = appItem.targetWing;
    } else {
      users.push({
        id: `usr-ctrl-${Date.now()}`,
        name: appItem.applicantName,
        email: appItem.applicantEmail,
        role: 'controller',
        studentId: appItem.studentId,
        department: appItem.department,
        semester: appItem.currentSemester,
        clubAffiliation: appItem.targetClub,
        assignedWing: appItem.targetWing,
        joinedAt: new Date().toISOString().split('T')[0]
      });
    }

    res.json({ success: true, application: appItem, message: 'Controller application approved successfully.' });
  });

  app.patch('/api/applications/:id/reject', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator') {
      return res.status(403).json({ success: false, message: 'Forbidden. Only Administrators can reject controller applications.' });
    }

    const appItem = applications.find(a => a.id === req.params.id);
    if (!appItem) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    appItem.status = 'rejected';
    appItem.reviewedAt = new Date().toISOString();
    appItem.reviewedBy = authUser.name;
    appItem.adminNotes = req.body.adminNotes || 'Does not meet current trimester prerequisites. Encouraged to reapply next session.';

    res.json({ success: true, application: appItem, message: 'Application marked as rejected.' });
  });

  app.delete('/api/applications/:id', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator') {
      return res.status(403).json({ success: false, message: 'Forbidden. Restricted to Administrators.' });
    }
    applications = applications.filter(a => a.id !== req.params.id);
    res.json({ success: true, message: 'Application record removed.' });
  });

  // 9. Users & Auth endpoints (Admin ONLY for user mutations)
  app.get('/api/users', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    res.json({ success: true, users });
  });

  app.post('/api/users', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator') {
      return res.status(403).json({ success: false, message: 'Forbidden. Only Administrators can create users or assign roles.' });
    }

    const { name, email, studentId, department, semester, role, clubAffiliation, assignedWing, phone } = req.body;
    if (!name || !email || !studentId) {
      return res.status(400).json({ success: false, message: 'Name, email, and Student ID are required.' });
    }

    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase() || u.studentId === studentId);
    if (exists) {
      return res.status(400).json({ success: false, message: 'A user with this email or ID already exists.' });
    }

    const newUser: User = {
      id: `usr-${role || 'std'}-${Date.now()}`,
      name,
      email,
      role: role || 'user',
      studentId,
      department: department || 'Undergraduate',
      semester: semester || '1st Semester',
      clubAffiliation: clubAffiliation || 'computer_club',
      assignedWing: assignedWing || undefined,
      phone: phone || undefined,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=D40000`,
      joinedAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    res.status(201).json({ success: true, user: newUser });
  });

  app.put('/api/users/:id', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator') {
      return res.status(403).json({ success: false, message: 'Forbidden. Only Administrators can update user accounts and roles.' });
    }

    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    users[idx] = { ...users[idx], ...req.body, id: users[idx].id };
    res.json({ success: true, user: users[idx] });
  });

  app.delete('/api/users/:id', (req: Request, res: Response) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (authUser.role !== 'administrator') {
      return res.status(403).json({ success: false, message: 'Forbidden. Only Administrators can delete accounts.' });
    }

    const targetUser = users.find(u => u.id === req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    users = users.filter(u => u.id !== req.params.id);
    res.json({ success: true, message: `User "${targetUser.name}" successfully removed.` });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found. Try one of the pre-seeded demo accounts or register below.' });
    }

    res.json({ success: true, user });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, studentId, department, semester, clubAffiliation, assignedWing } = req.body;
    if (!name || !email || !studentId) {
      return res.status(400).json({ success: false, message: 'Name, email, and Student ID are required.' });
    }

    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase() || u.studentId === studentId);
    if (exists) {
      return res.status(400).json({ success: false, message: 'A student account with this email or ID already exists.' });
    }

    const newUser: User = {
      id: `usr-std-${Date.now()}`,
      name,
      email,
      role: 'user',
      studentId,
      department: department || 'Undergraduate',
      semester: semester || '1st Semester',
      clubAffiliation: clubAffiliation || undefined,
      assignedWing: assignedWing || undefined,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=D40000`,
      joinedAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    res.status(201).json({ success: true, user: newUser });
  });

  /* ==========================================================================
     VITE INTEGRATION
     ========================================================================== */
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CUEC] Portal server listening on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error('[CUEC] Server error:', err);
  });
}

startServer().catch(err => {
  console.error('[CUEC] Error initializing server:', err);
  process.exit(1);
});
