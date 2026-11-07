import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Shield, 
  CheckCircle2, 
  Search, 
  AlertCircle, 
  QrCode,
  UserPlus,
  Clock,
  Sparkles,
  ChevronRight,
  Send
} from 'lucide-react';
import { 
  ControllerApplication, 
  MemberRequest, 
  ClubCategory, 
  ClubSubsector, 
  User 
} from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { DigitalMembershipCard } from '../components/DigitalMembershipCard.tsx';

interface MembershipPageProps {
  onApplicationSubmitted: (app: ControllerApplication) => void;
}

export const MembershipPage: React.FC<MembershipPageProps> = ({
  onApplicationSubmitted
}) => {
  const { user } = useAuth();
  const [activeStream, setActiveStream] = useState<'join' | 'controller' | 'student'>('join');

  /* ==========================================================================
     1. MEMBER REQUEST (REQUEST TO JOIN CLUB & WING)
     ========================================================================== */
  const [joinClub, setJoinClub] = useState<ClubCategory>('computer_club');
  const [joinWing, setJoinWing] = useState<ClubSubsector>('programming');
  const [joinReason, setJoinReason] = useState('');
  const [joinSubmitting, setJoinSubmitting] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  // List of member requests for current user
  const [userMemberRequests, setUserMemberRequests] = useState<MemberRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const loadMemberRequests = async () => {
    if (!user) return;
    setLoadingRequests(true);
    try {
      const res = await api.getMemberRequests(user.id);
      if (res.success && res.requests) {
        setUserMemberRequests(res.requests);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadMemberRequests();
  }, [user]);

  // Check if current user already has a pending request for the selected club
  const pendingForSelectedClub = userMemberRequests.find(
    r => r.clubId === joinClub && r.status === 'pending'
  );

  const handleMemberRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setJoinError('Please sign in or select a demo role from the navbar to submit a membership request.');
      return;
    }
    if (pendingForSelectedClub) {
      setJoinError(`You already have a pending request for ${joinClub === 'computer_club' ? 'Computer Club' : 'Events & Clubs'} under review.`);
      return;
    }
    if (!joinReason.trim()) {
      setJoinError('Please provide a brief reason or motivation for joining this wing.');
      return;
    }

    setJoinSubmitting(true);
    setJoinError(null);
    setJoinSuccess(null);

    try {
      const res = await api.submitMemberRequest({
        clubId: joinClub,
        wingSlug: joinWing,
        reason: joinReason.trim(),
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        department: user.department
      }, user.id);

      setJoinSubmitting(false);

      if (res.success && res.request) {
        setJoinSuccess(`Your membership request for ${joinWing.replace('_', ' ').toUpperCase()} (${joinClub === 'computer_club' ? 'Computer Club' : 'Events & Clubs'}) has been submitted! The Club Controller will review it shortly.`);
        setJoinReason('');
        loadMemberRequests();
      } else {
        setJoinError(res.message || 'Failed to submit request. Please try again.');
      }
    } catch (err: any) {
      setJoinSubmitting(false);
      setJoinError(err.message || 'Network error.');
    }
  };

  /* ==========================================================================
     2. CONTROLLER CANDIDACY APPLICATION
     ========================================================================== */
  const [applicantName, setApplicantName] = useState(user?.name || '');
  const [applicantEmail, setApplicantEmail] = useState(user?.email || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [currentSemester, setCurrentSemester] = useState('5th Semester');
  const [cgpa, setCgpa] = useState('3.65');
  const [targetClub, setTargetClub] = useState<ClubCategory>('computer_club');
  const [targetWing, setTargetWing] = useState<ClubSubsector>('programming');
  const [statementOfIntent, setStatementOfIntent] = useState('');
  const [experience, setExperience] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Status Tracker State
  const [trackStudentId, setTrackStudentId] = useState('');
  const [trackedApp, setTrackedApp] = useState<ControllerApplication | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);
  const [trackLoading, setTrackLoading] = useState(false);

  // Student Member Card state
  const [showMemberCardModal, setShowMemberCardModal] = useState(false);
  const [cardUser, setCardUser] = useState<User | null>(user);

  // Sync user state
  useEffect(() => {
    if (user) {
      setApplicantName(user.name);
      setApplicantEmail(user.email);
      setStudentId(user.studentId);
      if (user.department) setDepartment(user.department);
      setCardUser(user);
    }
  }, [user]);

  const handleControllerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitting(true);

    try {
      const res = await api.submitApplication({
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
      }, user?.id);

      setSubmitting(false);

      if (res.success && res.application) {
        setSubmitSuccess(
          `Application submitted successfully! Application ID: #${res.application.id.toUpperCase()}. It has been forwarded to the Directorate of Student Welfare (Administrators) for official review.`
        );
        onApplicationSubmitted(res.application);
        setStatementOfIntent('');
        setExperience('');
      } else {
        setSubmitError(res.message || 'Submission failed. Please check inputs.');
      }
    } catch (err: any) {
      setSubmitting(false);
      setSubmitError(err.message || 'Network error.');
    }
  };

  const handleTrackStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackStudentId.trim()) return;

    setTrackLoading(true);
    setTrackSearched(true);
    try {
      const res = await api.getApplications(user?.id);
      setTrackLoading(false);
      if (res.success && res.applications) {
        const found = res.applications.find(
          a => a.studentId.toLowerCase() === trackStudentId.trim().toLowerCase()
        );
        setTrackedApp(found || null);
      }
    } catch (e) {
      setTrackLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 text-center max-w-3xl mx-auto space-y-3">
        <div className="flex justify-center mb-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 shadow-md ring-4 ring-red-100 dark:ring-red-950 flex items-center justify-center">
            <img 
              src="/city-university-logo.jpg" 
              alt="City University Official Logo" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-[#D40000] dark:text-red-300 text-xs font-bold uppercase tracking-wider">
          University Membership & Executive Leadership
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 dark:text-white">
          Club Membership & Leadership Portal
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Request to join a specialized club wing, apply for executive controller leadership, or generate your digital club ID card.
        </p>

        {/* Tab switch */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-4">
          <button
            onClick={() => setActiveStream('join')}
            className={`px-4 sm:px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              activeStream === 'join'
                ? 'bg-[#D40000] text-white ring-2 ring-red-400/40 shadow-md'
                : 'bg-white dark:bg-[#161722] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-red-400'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Request to Join Club (Member)</span>
          </button>

          <button
            onClick={() => setActiveStream('controller')}
            className={`px-4 sm:px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              activeStream === 'controller'
                ? 'bg-[#D40000] text-white ring-2 ring-red-400/40 shadow-md'
                : 'bg-white dark:bg-[#161722] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-red-400'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Controller Leadership Application</span>
          </button>

          <button
            onClick={() => setActiveStream('student')}
            className={`px-4 sm:px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              activeStream === 'student'
                ? 'bg-[#D40000] text-white ring-2 ring-red-400/40 shadow-md'
                : 'bg-white dark:bg-[#161722] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-red-400'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Student Digital Club Pass</span>
          </button>
        </div>
      </div>

      {/* STREAM 1: Request to Join Club (Member Request Flow) */}
      {activeStream === 'join' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Request Form (Col 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#18050E] rounded-2xl border border-neutral-200 dark:border-[#380E1C] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-2 text-[#D40000] dark:text-red-400 font-bold text-sm">
                <UserPlus className="w-5 h-5" />
                <span>Request to Join a Club Wing</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Choose a club and wing to submit your membership request. Once approved by the Club Controller, you will gain access to member-only hackathons, workshops, and sports kits.
              </p>
            </div>

            {/* Current Affiliation Status if any */}
            {user?.clubAffiliation && (
              <div className="p-4 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Your Current Membership</span>
                  <span className="font-bold text-[#D40000] dark:text-red-300 text-sm">
                    {user.clubAffiliation === 'computer_club' ? 'City University Computer Club' : 'Events & Clubs'}
                    {user.assignedWing && ` • ${user.assignedWing.replace('_', ' ').toUpperCase()} WING`}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase">
                  Active Member
                </span>
              </div>
            )}

            {/* Notice banner if user has pending request for this club */}
            {pendingForSelectedClub && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-3">
                <Clock className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <h5 className="font-bold">Pending Request Already Under Review</h5>
                  <p className="mt-1 leading-relaxed">
                    You have an active pending request for <strong>{pendingForSelectedClub.wingSlug.replace('_', ' ').toUpperCase()}</strong> submitted on {new Date(pendingForSelectedClub.submittedAt).toLocaleDateString()}. Duplicate requests are blocked while this is being reviewed.
                  </p>
                </div>
              </div>
            )}

            {/* Success or Error Notice */}
            {joinSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <h5 className="font-bold">Request Submitted!</h5>
                  <p className="mt-1 leading-relaxed">{joinSuccess}</p>
                </div>
              </div>
            )}

            {joinError && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                <div>
                  <h5 className="font-bold">Notice</h5>
                  <p className="mt-1 leading-relaxed">{joinError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleMemberRequestSubmit} className="space-y-4 text-xs">
              
              {/* Target Club & Wing Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-[#120409] border border-neutral-200 dark:border-[#380E1C]">
                <div>
                  <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                    1. Select Club Entity *
                  </label>
                  <select
                    value={joinClub}
                    onChange={e => {
                      const newClub = e.target.value as ClubCategory;
                      setJoinClub(newClub);
                      setJoinWing(newClub === 'computer_club' ? 'programming' : 'sports');
                      setJoinError(null);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#190610] text-neutral-900 dark:text-white font-semibold"
                  >
                    <option value="computer_club">Computer Club (CUCC)</option>
                    <option value="events_and_clubs">Events & Clubs</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                    2. Desired Wing Subsector *
                  </label>
                  <select
                    value={joinWing}
                    onChange={e => setJoinWing(e.target.value as ClubSubsector)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#190610] text-neutral-900 dark:text-white font-semibold"
                  >
                    {joinClub === 'computer_club' ? (
                      <>
                        <option value="programming">Programming Club</option>
                        <option value="cyber_security">Cyber Security Club</option>
                        <option value="research">Research Club</option>
                      </>
                    ) : (
                      <>
                        <option value="sports">Sports Club</option>
                        <option value="cultural">Cultural Club</option>
                        <option value="tour">Tour & Adventure Club</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Student Identity Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-[#120409] border border-neutral-200 dark:border-neutral-800 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px]">Applicant Name:</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">{user?.name || 'Please sign in'}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Student ID:</span>
                  <span className="font-bold font-mono text-neutral-800 dark:text-neutral-200">{user?.studentId || 'CU-23-CSE-...'}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Email:</span>
                  <span className="text-neutral-600 dark:text-neutral-300 font-mono text-[11px]">{user?.email || 'student@cityuniversity.edu'}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Department:</span>
                  <span className="text-neutral-600 dark:text-neutral-300">{user?.department || 'Undergraduate'}</span>
                </div>
              </div>

              {/* Statement / Reason */}
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Why would you like to join this wing? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={joinReason}
                  onChange={e => setJoinReason(e.target.value)}
                  placeholder="Share your interests, what you hope to learn or contribute, previous experience in coding, security, sports, music, etc..."
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                />
              </div>

              {/* Submit CTA */}
              <div>
                <button
                  type="submit"
                  disabled={joinSubmitting || !!pendingForSelectedClub || !user}
                  className="w-full py-3.5 rounded-xl bg-[#D40000] hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {joinSubmitting ? 'Submitting Request...' : pendingForSelectedClub ? 'Request Already Pending' : 'Submit Request to Join'}
                  </span>
                </button>
              </div>

            </form>
          </div>

          {/* Right: Submitted Requests Status List (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white dark:bg-[#18050E] rounded-2xl border border-neutral-200 dark:border-[#380E1C] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <h4 className="font-bold text-sm font-heading text-neutral-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D40000] dark:text-red-400" />
                  Your Membership Requests Status
                </h4>
                <button
                  onClick={loadMemberRequests}
                  className="text-[11px] text-[#D40000] dark:text-red-400 hover:underline cursor-pointer"
                >
                  Refresh
                </button>
              </div>

              {loadingRequests ? (
                <div className="py-6 text-center text-xs text-neutral-400">Loading requests...</div>
              ) : userMemberRequests.length > 0 ? (
                <div className="space-y-3">
                  {userMemberRequests.map(req => (
                    <div 
                      key={req.id}
                      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#13040A] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 dark:text-white text-xs">
                          {req.wingSlug.replace('_', ' ').toUpperCase()} WING
                        </span>
                        {req.status === 'approved' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Approved
                          </span>
                        )}
                        {req.status === 'pending' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px] uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        )}
                        {req.status === 'rejected' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-bold text-[10px] uppercase flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Rejected
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-neutral-500">
                        Club: <strong>{req.clubId === 'computer_club' ? 'Computer Club (CUCC)' : 'Events & Clubs'}</strong>
                      </div>

                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 italic bg-white dark:bg-[#190610] p-2 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
                        "{req.reason}"
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-400">
                        <span>Submitted: {new Date(req.submittedAt).toLocaleDateString()}</span>
                        {req.reviewedBy && (
                          <span className="text-neutral-500 font-semibold">Reviewed by {req.reviewedBy}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-neutral-400">
                  <p>You have not submitted any membership requests yet.</p>
                  <p className="text-[11px] mt-1">Submit the form on the left to join a club wing!</p>
                </div>
              )}
            </div>

            {/* Quick Benefits Card */}
            <div className="bg-red-50/60 dark:bg-[#1A0610] rounded-2xl border border-red-200 dark:border-[#380E1C] p-6 space-y-3 text-xs">
              <h4 className="font-bold text-[#D40000] dark:text-red-400 flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4" />
                Wing Membership Privileges
              </h4>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300 leading-relaxed list-disc list-inside">
                <li>Direct mentorship from senior student conveners and faculty advisors.</li>
                <li>Reserved workstation quota in Software Lab 402 and Cyber Range 405.</li>
                <li>Official varsity jersey and event tickets at zero or subsidized fees.</li>
                <li>Eligible to represent City University in national collegiate contests and tournaments.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* STREAM 2: Controller Application Flow */}
      {activeStream === 'controller' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form (Col 8) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#18050E] rounded-2xl border border-neutral-200 dark:border-[#380E1C] p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-2 text-[#D40000] dark:text-red-400 font-bold text-sm">
                <Shield className="w-5 h-5" />
                <span>Executive Controller Candidacy Form</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Controllers manage their club with full access over all 3 wings (Events, Notices, Media Albums, and Member Requests). Applications are reviewed exclusively by University Administrators.
              </p>
            </div>

            {/* Success or Error Notice */}
            {submitSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <h5 className="font-bold">Application Received!</h5>
                  <p className="mt-1 leading-relaxed">{submitSuccess}</p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                <div>
                  <h5 className="font-bold">Submission Notice</h5>
                  <p className="mt-1 leading-relaxed">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleControllerSubmit} className="space-y-5 text-xs">
              
              {/* Applicant Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={e => setApplicantName(e.target.value)}
                    placeholder="e.g. Ahsan Habib"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    University Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={e => setApplicantEmail(e.target.value)}
                    placeholder="e.g. ahsan.habib@cityuniversity.edu"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                  />
                </div>
              </div>

              {/* Student Academic Standing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder="e.g. CU-22-CSE-091"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Academic Semester *
                  </label>
                  <select
                    value={currentSemester}
                    onChange={e => setCurrentSemester(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                  >
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Current CGPA *
                  </label>
                  <input
                    type="text"
                    required
                    value={cgpa}
                    onChange={e => setCgpa(e.target.value)}
                    placeholder="e.g. 3.75"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="Computer Science & Engineering"
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                />
              </div>

              {/* Target Wing Choice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-red-50/50 dark:bg-[#1C0D12] border border-red-200 dark:border-[#381620]">
                <div>
                  <label className="block font-bold text-[#D40000] dark:text-red-400 mb-1">
                    1. Target Major Club Entity *
                  </label>
                  <select
                    value={targetClub}
                    onChange={e => {
                      const newClub = e.target.value as ClubCategory;
                      setTargetClub(newClub);
                      setTargetWing(newClub === 'computer_club' ? 'programming' : 'sports');
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11121A] text-neutral-900 dark:text-white font-medium"
                  >
                    <option value="computer_club">Computer Club (CUCC)</option>
                    <option value="events_and_clubs">Events & Clubs</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#D40000] dark:text-red-400 mb-1">
                    2. Primary Wing Focus *
                  </label>
                  <select
                    value={targetWing}
                    onChange={e => setTargetWing(e.target.value as ClubSubsector)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11121A] text-neutral-900 dark:text-white font-medium"
                  >
                    {targetClub === 'computer_club' ? (
                      <>
                        <option value="programming">Programming Club</option>
                        <option value="cyber_security">Cyber Security Club</option>
                        <option value="research">Research Club</option>
                      </>
                    ) : (
                      <>
                        <option value="sports">Sports Club</option>
                        <option value="cultural">Cultural Club</option>
                        <option value="tour">Tour & Adventure Club</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Statement of Intent */}
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Statement of Intent & Vision for the Club * (Min. 50 characters)
                </label>
                <textarea
                  rows={4}
                  required
                  value={statementOfIntent}
                  onChange={e => setStatementOfIntent(e.target.value)}
                  placeholder="Describe your vision, proposed events, workshop topics, or competition plans if appointed as Controller..."
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                />
              </div>

              {/* Prior Experience */}
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Relevant Technical, Leadership, or Event Experience *
                </label>
                <textarea
                  rows={3}
                  required
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  placeholder="Hackathons attended, CTF rankings, student organizations led, athletic tournaments played, or stage productions..."
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                />
              </div>

              {/* Portfolio Link */}
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  GitHub / LinkedIn / Portfolio / Social Link (Optional)
                </label>
                <input
                  type="url"
                  value={portfolioLink}
                  onChange={e => setPortfolioLink(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-[#D40000] hover:bg-red-800 text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>{submitting ? 'Submitting to Directorate...' : 'Submit Controller Application to Administrators'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Status Tracker & Prerequisite Guidelines (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live Application Status Checker */}
            <div className="bg-white dark:bg-[#18050E] rounded-2xl border border-neutral-200 dark:border-[#380E1C] p-6 shadow-xs space-y-4">
              <h4 className="font-bold text-sm font-heading text-neutral-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-[#D40000] dark:text-red-400" />
                Track Controller Candidacy Status
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Enter your university student ID to check if your Controller application was approved by Administrators.
              </p>

              <form onSubmit={handleTrackStatus} className="flex gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Enter Student ID (e.g. CU-22-CSE-091)"
                  value={trackStudentId}
                  onChange={e => setTrackStudentId(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={trackLoading}
                  className="px-3 py-2 rounded-lg bg-[#D40000] text-white font-bold cursor-pointer"
                >
                  Track
                </button>
              </form>

              {/* Result display */}
              {trackSearched && (
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                  {trackedApp ? (
                    <div className="space-y-2 p-3.5 rounded-xl bg-neutral-50 dark:bg-[#191A26] border border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100">
                          {trackedApp.applicantName}
                        </span>
                        {trackedApp.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] uppercase">
                            Approved ✓
                          </span>
                        )}
                        {trackedApp.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px] uppercase">
                            Under Review ⏳
                          </span>
                        )}
                        {trackedApp.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold text-[10px] uppercase">
                            Not Approved ✗
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-500">
                        Target Wing: <strong>{trackedApp.targetWing.toUpperCase()}</strong> ({trackedApp.targetClub === 'computer_club' ? 'Computer Club' : 'Events & Clubs'})
                      </p>

                      {trackedApp.adminNotes && (
                        <div className="p-2.5 rounded-lg bg-white dark:bg-[#12131C] border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-700 dark:text-neutral-300">
                          <span className="block font-bold text-[#D40000] dark:text-red-400">DSW Admin Review:</span>
                          <span className="italic">"{trackedApp.adminNotes}"</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-neutral-500 text-center py-2">
                      No application record found for this Student ID.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Prerequisites & Regulations */}
            <div className="bg-amber-50/70 dark:bg-[#1A140E] rounded-2xl border border-amber-300 dark:border-amber-900/60 p-6 space-y-3 text-xs">
              <h4 className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1.5 text-sm">
                <AlertCircle className="w-4 h-4" />
                Administrative Controller Regulations
              </h4>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Prerequisite:</strong> Minimum 4th trimester / semester completion with cumulative GPA ≥ 3.20.
                </li>
                <li>
                  <strong>Direct Authority:</strong> Approved controllers acquire credentials to publish notices, manage photo albums, organize competitions, and review member requests for their club.
                </li>
                <li>
                  <strong>Approval Protocol:</strong> Controller applications are exclusively vetted and sanctioned by University Administrators.
                </li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* STREAM 3: Student Membership Card Issuance */}
      {activeStream === 'student' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#141520] rounded-2xl border border-neutral-200 dark:border-[#2D1B22] p-8 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950 text-[#D40000] dark:text-red-400 flex items-center justify-center font-bold mx-auto shadow-sm">
            <QrCode className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">
              Official City University Club Pass
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              Every registered student is entitled to an official digital membership card featuring an active QR token, departmental affiliation, and validity stamp.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#171824] border border-neutral-200 dark:border-neutral-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Member Name:</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">{cardUser?.name || 'Nafis Fuad'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Student ID:</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">{cardUser?.studentId || 'CU-23-CSE-188'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Department:</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">{cardUser?.department || 'Computer Science & Engineering'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Primary Affiliation:</span>
              <span className="font-bold text-[#D40000] dark:text-red-400">
                {cardUser?.clubAffiliation === 'events_and_clubs' ? 'Events & Clubs' : 'City University Computer Club'}
                {cardUser?.assignedWing && ` (${cardUser.assignedWing.replace('_', ' ').toUpperCase()})`}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowMemberCardModal(true)}
            className="w-full py-3.5 rounded-xl bg-[#D40000] hover:bg-red-800 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate & View Digital ID Card</span>
          </button>
        </div>
      )}

      {/* Digital Member Card Modal */}
      {showMemberCardModal && cardUser && (
        <DigitalMembershipCard
          user={cardUser}
          onClose={() => setShowMemberCardModal(false)}
        />
      )}

    </div>
  );
};
