import { 
  Club, 
  ClubEvent, 
  Announcement, 
  GalleryItem, 
  ControllerApplication, 
  MemberRequest,
  User, 
  ClubCategory,
  ClubSubsector
} from '../types.ts';

const API_BASE = '/api';

/**
 * Helper to always attach x-user-id authentication header.
 * Falls back to current session in localStorage if authUserId is not explicitly provided.
 */
const getAuthHeaders = (authUserId?: string): Record<string, string> => {
  let id = authUserId;
  if (!id && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('cuec_current_user');
      if (saved) {
        id = JSON.parse(saved)?.id;
      }
    } catch (e) {
      // ignore
    }
  }
  return id ? { 'x-user-id': id } : {};
};

export const api = {
  // Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  // Clubs
  async getClubs(): Promise<{ success: boolean; clubs: Club[] }> {
    const res = await fetch(`${API_BASE}/clubs`);
    return res.json();
  },

  async updateClub(id: string, data: Partial<Club>, authUserId?: string): Promise<{ success: boolean; club?: Club; message?: string }> {
    const res = await fetch(`${API_BASE}/clubs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Events
  async getEvents(params?: { clubId?: string; wingSlug?: string; status?: string; search?: string }): Promise<{ success: boolean; events: ClubEvent[] }> {
    const query = new URLSearchParams();
    if (params?.clubId && params.clubId !== 'all') query.set('clubId', params.clubId);
    if (params?.wingSlug && params.wingSlug !== 'all') query.set('wingSlug', params.wingSlug);
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/events?${query.toString()}`);
    return res.json();
  },

  async getEvent(id: string): Promise<{ success: boolean; event: ClubEvent }> {
    const res = await fetch(`${API_BASE}/events/${id}`);
    return res.json();
  },

  async createEvent(eventData: Partial<ClubEvent>, authUserId?: string): Promise<{ success: boolean; event: ClubEvent; message?: string }> {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify(eventData)
    });
    return res.json();
  },

  async updateEvent(id: string, eventData: Partial<ClubEvent>, authUserId?: string): Promise<{ success: boolean; event: ClubEvent; message?: string }> {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify(eventData)
    });
    return res.json();
  },

  async deleteEvent(id: string, authUserId?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(authUserId)
      }
    });
    return res.json();
  },

  async registerForEvent(eventId: string, studentData: {
    userId?: string;
    userName: string;
    studentId: string;
    email: string;
    department: string;
  }): Promise<{ success: boolean; registration?: any; event?: ClubEvent; message?: string }> {
    const res = await fetch(`${API_BASE}/events/${eventId}/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(studentData.userId)
      },
      body: JSON.stringify(studentData)
    });
    return res.json();
  },

  // Announcements
  async getAnnouncements(params?: { clubId?: string; priority?: string }): Promise<{ success: boolean; announcements: Announcement[] }> {
    const query = new URLSearchParams();
    if (params?.clubId && params.clubId !== 'all') query.set('clubId', params.clubId);
    if (params?.priority && params.priority !== 'all') query.set('priority', params.priority);

    const res = await fetch(`${API_BASE}/announcements?${query.toString()}`);
    return res.json();
  },

  async createAnnouncement(data: Partial<Announcement>, authUserId?: string): Promise<{ success: boolean; announcement: Announcement; message?: string }> {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateAnnouncement(id: string, data: Partial<Announcement>, authUserId?: string): Promise<{ success: boolean; announcement: Announcement; message?: string }> {
    const res = await fetch(`${API_BASE}/announcements/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteAnnouncement(id: string, authUserId?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/announcements/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(authUserId)
      }
    });
    return res.json();
  },

  // Gallery
  async getGallery(params?: { clubId?: string; wingSlug?: string }): Promise<{ success: boolean; gallery: GalleryItem[] }> {
    const query = new URLSearchParams();
    if (params?.clubId && params.clubId !== 'all') query.set('clubId', params.clubId);
    if (params?.wingSlug && params.wingSlug !== 'all') query.set('wingSlug', params.wingSlug);

    const res = await fetch(`${API_BASE}/gallery?${query.toString()}`);
    return res.json();
  },

  async createGalleryItem(data: Partial<GalleryItem> & { imageUrls?: string[] }, authUserId?: string): Promise<{ success: boolean; item?: GalleryItem; items?: GalleryItem[]; message?: string }> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async likeGalleryItem(id: string): Promise<{ success: boolean; likes: number }> {
    const res = await fetch(`${API_BASE}/gallery/${id}/like`, { method: 'POST' });
    return res.json();
  },

  async updateGalleryItem(id: string, data: Partial<GalleryItem>, authUserId?: string): Promise<{ success: boolean; item: GalleryItem; message?: string }> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteGalleryItem(id: string, authUserId?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(authUserId)
      }
    });
    return res.json();
  },

  // Member Requests
  async getMemberRequests(authUserId?: string): Promise<{ success: boolean; requests: MemberRequest[]; message?: string }> {
    const res = await fetch(`${API_BASE}/member-requests`, {
      headers: {
        ...getAuthHeaders(authUserId)
      }
    });
    return res.json();
  },

  async submitMemberRequest(data: {
    clubId: ClubCategory;
    wingSlug: ClubSubsector;
    reason: string;
    name?: string;
    studentId?: string;
    email?: string;
    department?: string;
  }, authUserId?: string): Promise<{ success: boolean; request?: MemberRequest; message?: string }> {
    const res = await fetch(`${API_BASE}/member-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async approveMemberRequest(id: string, authUserId?: string): Promise<{ success: boolean; request?: MemberRequest; message?: string }> {
    const res = await fetch(`${API_BASE}/member-requests/${id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      }
    });
    return res.json();
  },

  async rejectMemberRequest(id: string, authUserId?: string): Promise<{ success: boolean; request?: MemberRequest; message?: string }> {
    const res = await fetch(`${API_BASE}/member-requests/${id}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      }
    });
    return res.json();
  },

  // Members Management
  async getMembers(clubId?: string, authUserId?: string): Promise<{ success: boolean; members: User[]; message?: string }> {
    const query = new URLSearchParams();
    if (clubId && clubId !== 'all') query.set('clubId', clubId);
    const res = await fetch(`${API_BASE}/members?${query.toString()}`, {
      headers: {
        ...getAuthHeaders(authUserId)
      }
    });
    return res.json();
  },

  async removeMember(userId: string, authUserId?: string): Promise<{ success: boolean; user?: User; message?: string }> {
    const res = await fetch(`${API_BASE}/members/${userId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(authUserId)
      }
    });
    return res.json();
  },

  // Controller Applications (Admin Only)
  async getApplications(authUserId?: string): Promise<{ success: boolean; applications: ControllerApplication[]; message?: string }> {
    const res = await fetch(`${API_BASE}/applications`, {
      headers: {
        ...getAuthHeaders(authUserId)
      }
    });
    return res.json();
  },

  async submitApplication(data: Partial<ControllerApplication>, authUserId?: string): Promise<{ success: boolean; application: ControllerApplication; message?: string }> {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async approveApplication(id: string, adminNotes?: string, authUserId?: string): Promise<{ success: boolean; application: ControllerApplication; message?: string }> {
    const res = await fetch(`${API_BASE}/applications/${id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify({ adminNotes })
    });
    return res.json();
  },

  async rejectApplication(id: string, adminNotes?: string, authUserId?: string): Promise<{ success: boolean; application: ControllerApplication; message?: string }> {
    const res = await fetch(`${API_BASE}/applications/${id}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify({ adminNotes })
    });
    return res.json();
  },

  async deleteApplication(id: string, authUserId?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(authUserId)
      }
    });
    return res.json();
  },

  // Users & Auth
  async getUsers(authUserId?: string): Promise<{ success: boolean; users: User[]; message?: string }> {
    const res = await fetch(`${API_BASE}/users`, {
      headers: {
        ...getAuthHeaders(authUserId)
      }
    });
    return res.json();
  },

  async createUser(userData: Partial<User>, authUserId?: string): Promise<{ success: boolean; user: User; message?: string }> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async updateUser(id: string, userData: Partial<User>, authUserId?: string): Promise<{ success: boolean; user: User; message?: string }> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(authUserId)
      },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async deleteUser(id: string, authUserId?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(authUserId)
      }
    });
    return res.json();
  },

  async login(email: string): Promise<{ success: boolean; user?: User; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  async register(data: {
    name: string;
    email: string;
    studentId: string;
    department: string;
    semester?: string;
    clubAffiliation?: ClubCategory;
    assignedWing?: ClubSubsector;
  }): Promise<{ success: boolean; user?: User; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
