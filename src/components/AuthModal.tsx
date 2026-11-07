import React, { useState } from 'react';
import { X, Shield, GraduationCap, UserCheck, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, registerUser, loginAsDemo } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  
  // Register form
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('3rd Semester');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await loginWithEmail(loginEmail);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Login failed. Check your email or use a demo account.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await registerUser({
      name,
      email: regEmail,
      studentId,
      department,
      semester
    });
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#151620] border border-neutral-200 dark:border-[#382026] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Official University Logo */}
        <div className="bg-gradient-to-r from-[#D40000] via-[#7A0000] to-[#550000] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-14 h-14 rounded-full bg-white p-1 shadow-lg ring-2 ring-white/70 overflow-hidden flex items-center justify-center shrink-0">
              <img 
                src="/city-university-logo.jpg" 
                alt="City University Official Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-200 block">
                City University • DSW
              </span>
              <span className="text-xs text-white/90 font-medium italic">
                ...creating a culture of excellence
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold font-heading">
            {mode === 'login' ? 'CUEC Student & Executive Sign In' : 'Student Portal Registration'}
          </h3>
          <p className="text-xs text-red-100 mt-1">
            Access City University club memberships, event passes & management.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'login'
                ? 'border-b-2 border-[#D40000] text-[#D40000] dark:text-red-400 bg-red-50/50 dark:bg-red-950/20'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Log In with Email
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'register'
                ? 'border-b-2 border-[#D40000] text-[#D40000] dark:text-red-400 bg-red-50/50 dark:bg-red-950/20'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            New Student Sign Up
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  University Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@cityuniversity.edu"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11121A] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-[#D40000] hover:bg-red-800 text-white font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>

              {/* Instant pre-seeded credentials helper */}
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  1-Click Demo Profiles:
                </p>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemo('administrator');
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 border border-red-200 dark:border-red-900/50 text-xs text-[#D40000] dark:text-red-300 flex items-center justify-between"
                  >
                    <span className="font-semibold flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-red-600" />
                      Administrator
                    </span>
                    <span className="text-[10px] text-neutral-500">admin@cityuniversity.edu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemo('controller', 'programming');
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between"
                  >
                    <span className="font-semibold flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                      Controller (Tech)
                    </span>
                    <span className="text-[10px] text-neutral-500">controller.tech@...</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemo('user');
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span className="font-semibold flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
                      Regular Student
                    </span>
                    <span className="text-[10px] text-neutral-500">student@cityuniversity.edu</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sadia Islam"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11121A] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Student ID Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CU-24-CSE-099"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11121A] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  University Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sadia@cityuniversity.edu"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11121A] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#D40000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11121A] text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Electrical & Electronic Eng.">EEE</option>
                    <option value="Civil Engineering">Civil</option>
                    <option value="Business Administration">BBA</option>
                    <option value="English & Humanities">English</option>
                    <option value="Law & Justice">Law</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11121A] text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded-lg bg-[#D40000] hover:bg-red-800 text-white font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
