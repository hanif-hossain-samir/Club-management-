import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  Clock, 
  Award, 
  Layers, 
  HeartHandshake, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export const AboutContactPage: React.FC = () => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setInquiryMessage('');
    setInquirySubject('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 text-center max-w-3xl mx-auto space-y-4">
        <div className="flex justify-center">
          <a 
            href="https://cityuniversity.ac.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-1 shadow-lg ring-4 ring-red-100 dark:ring-red-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group/seal"
            title="Click to visit City University official website: https://cityuniversity.ac.bd/"
          >
            <img 
              src="/city-university-logo.jpg" 
              alt="City University Official Logo" 
              className="w-full h-full object-contain rounded-full"
            />
          </a>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-[#D40000] dark:text-red-300 text-xs font-bold uppercase tracking-wider">
          <a 
            href="https://cityuniversity.ac.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:underline"
            title="Visit cityuniversity.ac.bd"
          >
            <span>University Directorate of Student Welfare</span>
            <ExternalLink className="w-3 h-3 text-[#D40000] dark:text-red-300" />
          </a>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-900 dark:text-white">
          About CUEC & Campus Contacts
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          City University Events & Club (CUEC) is the central governing body fostering technological innovation, competitive sportsmanship, and performing arts.
        </p>
      </div>

      {/* Vision & Charter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#18050E] border border-neutral-200 dark:border-[#380E1C] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-[#D40000] dark:text-red-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base font-heading text-neutral-900 dark:text-white">
            Our Central Mission
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            To coordinate all student extracurricular endeavors under an accountable, transparent administrative framework that elevates City University on national and global stages.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#18050E] border border-neutral-200 dark:border-[#380E1C] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base font-heading text-neutral-900 dark:text-white">
            Scalable 3-Tier Governance
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Governed by Administrators (Faculty & DSW), managed by Student Controllers (Wing Leads), and actively energized by thousands of registered Student Members.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#18050E] border border-neutral-200 dark:border-[#380E1C] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-[#D40000] dark:text-red-400 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base font-heading text-neutral-900 dark:text-white">
            Future Club Expansion
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Architected to support future chapters including Robotics & IoT, Debating Society, Entrepreneurship Cell, and Environmental Green Club seamlessly.
          </p>
        </div>
      </div>

      {/* Contact & Map & Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Contact Info & Office (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#18050E] border border-neutral-200 dark:border-[#380E1C] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-bold text-lg font-heading text-neutral-900 dark:text-white">
              Central Directorate Office
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D40000] dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block">City University Permanent Campus</span>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Room 204, Directorate of Student Welfare, Khagan, Birulia, Savar, Dhaka-1216
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#D40000] dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block">Office Working Hours</span>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Saturday to Thursday: 09:00 AM – 05:00 PM (Closed on Fridays)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D40000] dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block">Direct Telephones & Extensions</span>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Central Exchange: +880 2-9876543 (Ext. 201 for CUCC, Ext. 305 for CUEC)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D40000] dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block">Official University Emails</span>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                    dsw@cityuniversity.edu • cuec@cityuniversity.edu
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Card */}
          <div className="bg-neutral-50 dark:bg-[#1E0712] border border-neutral-200 dark:border-[#380E1C] rounded-2xl p-6 space-y-3 text-xs">
            <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#D40000] dark:text-red-400" />
              Frequently Asked Questions
            </h4>
            <div className="space-y-2">
              <details className="group">
                <summary className="font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer list-none flex items-center justify-between">
                  <span>How can I join the Computer Club or Events & Clubs?</span>
                  <span className="text-xs text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1 pl-2 border-l border-red-500">
                  Navigate to the Membership page to generate your digital club card, or attend weekly sessions at Lab 402 or the Gymnasium.
                </p>
              </details>

              <details className="group">
                <summary className="font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer list-none flex items-center justify-between">
                  <span>Who approves Controller applications?</span>
                  <span className="text-xs text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1 pl-2 border-l border-red-500">
                  Applications are strictly vetted and approved by the University Administrators (Directorate of Student Welfare).
                </p>
              </details>
            </div>
          </div>
        </div>

        {/* Right: Student Inquiry Form (Col 7) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#18050E] border border-neutral-200 dark:border-[#380E1C] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-lg font-heading text-neutral-900 dark:text-white">
              Submit Inquiries or Club Proposals
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Have an idea for a new workshop, hackathon topic, or partnership? Contact our central team.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                Inquiry Transmitted Successfully
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-sm mx-auto">
                Thank you for contacting CUEC. A club representative will follow up via your university email within 24–48 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 underline cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={e => setInquiryName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    University / Personal Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={e => setInquiryEmail(e.target.value)}
                    placeholder="tanvir@cityuniversity.edu"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={inquirySubject}
                  onChange={e => setInquirySubject(e.target.value)}
                  placeholder="e.g. Proposal for Intra Hackathon sponsorship or membership inquiry"
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Message Details *
                </label>
                <textarea
                  rows={5}
                  required
                  value={inquiryMessage}
                  onChange={e => setInquiryMessage(e.target.value)}
                  placeholder="Please describe your question or proposal..."
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#11121A] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#D40000] hover:bg-red-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry to Directorate</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
