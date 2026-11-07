export type UserRole = 'user' | 'controller' | 'administrator';

export type ClubCategory = 'computer_club' | 'events_and_clubs';

export type ClubSubsector = 
  | 'programming' 
  | 'cyber_security' 
  | 'research' 
  | 'sports' 
  | 'cultural' 
  | 'tour';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId: string;
  department: string;
  semester?: string;
  avatar?: string;
  clubAffiliation?: ClubCategory;
  assignedWing?: ClubSubsector;
  joinedAt: string;
  phone?: string;
}

export interface ClubExecutive {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatar: string;
  email: string;
  linkedin?: string;
}

export interface PastAchievement {
  year: string;
  title: string;
  description: string;
}

export interface ClubWing {
  id: string;
  clubId: ClubCategory;
  slug: ClubSubsector;
  name: string;
  kicker: string;
  shortDesc: string;
  fullDesc: string;
  badge: string;
  iconName: string;
  bannerUrl: string;
  vision: string;
  weeklySchedule: string;
  roomLocation: string;
  conveners: ClubExecutive[];
  keyActivities: string[];
  pastAchievements: PastAchievement[];
  membershipPerks: string[];
}

export interface Club {
  id: ClubCategory;
  name: string;
  shortCode: string;
  categoryName: string;
  motto: string;
  establishedYear: number;
  totalMembers: number;
  logoUrl: string;
  email: string;
  hotline: string;
  presidentName: string;
  advisorName: string;
  advisorDesignation: string;
  wings: ClubWing[];
}

export interface EventRegistration {
  id: string;
  userId: string;
  userName: string;
  studentId: string;
  email: string;
  department: string;
  registeredAt: string;
  ticketCode: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  clubId: ClubCategory;
  wingSlug: ClubSubsector;
  category: string;
  kicker?: string;
  description: string;
  fullDetails: string;
  bannerUrl: string;
  date: string;
  time: string;
  venue: string;
  registrationDeadline: string;
  capacity: number;
  registeredCount: number;
  chiefGuests: string[];
  tags: string[];
  isFeatured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registrations: EventRegistration[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  clubId: ClubCategory | 'all';
  wingSlug?: ClubSubsector | 'all';
  priority: 'urgent' | 'important' | 'general' | 'competition';
  publishedAt: string;
  authorName: string;
  authorRole: string;
  attachmentName?: string;
  imageUrl?: string;
  category: string;
  pinned: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  clubId: ClubCategory;
  wingSlug: ClubSubsector;
  eventName: string;
  date: string;
  photogName?: string;
  likes: number;
}

export interface ControllerApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  studentId: string;
  department: string;
  currentSemester: string;
  cgpa: string;
  targetClub: ClubCategory;
  targetWing: ClubSubsector;
  statementOfIntent: string;
  experience: string;
  portfolioLink?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

export interface MemberRequest {
  id: string;
  userId: string;
  name: string;
  studentId: string;
  email: string;
  department: string;
  clubId: ClubCategory;
  wingSlug: ClubSubsector;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}


