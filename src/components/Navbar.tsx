import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Shield, 
  UserCheck, 
  GraduationCap, 
  Menu, 
  X, 
  ChevronDown, 
  Calendar, 
  Image as ImageIcon, 
  Info, 
  Home, 
  Layers, 
  LogOut,
  LogIn,
  Search,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
  openSearchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAuthModal, openSearchModal }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, role, logout, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'clubs', label: 'Clubs', icon: Layers },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  // Display name formatted for the button, e.g. "Hi, abir"
  const displayName = user?.name ? `Hi, ${user.name.split(' ')[0].toLowerCase()}` : 'Hi, abir';

  return (
    <header className="sticky top-0 z-50 transition-colors duration-200 shadow-xs">
      {/* Main Navbar */}
      <div className="bg-white dark:bg-[#14050D] border-b border-neutral-100 dark:border-[#380E1C] px-4 lg:px-8 py-3.5 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & CUEC Brand Lockup */}
          <div className="flex items-center gap-3">
            {/* Official City University Logo - clicks to visit varsity website */}
            <a 
              href="https://cityuniversity.ac.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white p-1 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700 hover:ring-2 hover:ring-[#D40000] dark:hover:ring-[#E5486B] overflow-hidden flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer group/logo relative"
              title="Click logo to visit City University official website: https://cityuniversity.ac.bd/"
              aria-label="City University Official Website"
            >
              <img 
                src="/city-university-logo.jpg" 
                alt="City University Official Logo" 
                className="w-full h-full object-contain rounded-md"
              />
            </a>

            {/* Portal Title - navigates home */}
            <button 
              onClick={() => handleNav('home')}
              className="flex flex-col text-left group cursor-pointer focus:outline-none"
              aria-label="CUEC Home"
              title="City University Events & Clubs Portal"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg leading-tight tracking-tight text-neutral-900 dark:text-white group-hover:text-[#D40000] dark:group-hover:text-[#E5486B] transition-colors">
                  CUEC
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-red-100 dark:bg-red-950/80 text-[#D40000] dark:text-[#E5486B] rounded border border-red-200 dark:border-red-900 hidden sm:inline">
                  Portal
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal leading-none mt-0.5">
                Events & Clubs
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-sm">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`transition-colors cursor-pointer text-sm ${
                    isActive
                      ? 'text-[#D40000] dark:text-[#E5486B] font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:text-[#D40000] dark:hover:text-[#E5486B] font-medium'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Admin / Controller Dashboard Navigation */}
            <button
              onClick={() => handleNav('dashboard')}
              className={`transition-all cursor-pointer text-xs sm:text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                activeTab === 'dashboard'
                  ? 'bg-[#D40000] text-white border-[#D40000] font-bold shadow-xs'
                  : 'border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 text-[#D40000] dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/60 font-semibold'
              }`}
              title="CUCC Controller Dashboard"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Dashboard(CC)</span>
            </button>
          </nav>

          {/* Right Action Cluster: Search, Moon/Sun Theme Toggle & Pill User Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Icon Button */}
            <button
              onClick={openSearchModal}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700/80 hover:border-[#D40000] dark:hover:border-[#E5486B] bg-transparent text-neutral-600 dark:text-neutral-300 hover:text-[#D40000] dark:hover:text-[#E5486B] transition-colors cursor-pointer shadow-xs flex items-center justify-center"
              title="Search clubs, events, notices (Ctrl+K)"
              aria-label="Search CUEC Portal"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Day / Night Mode Switcher Button */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to Night Mode (Dark & Deep-Red)' : 'Switch to Day Mode (White & Deep-Red)'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-[#4A1325] hover:border-[#D40000] dark:hover:border-[#E5486B] bg-white dark:bg-[#1D0611] text-neutral-800 dark:text-[#FFF0F3] shadow-xs cursor-pointer transition-all duration-200"
              title={theme === 'light' ? 'Switch to Night Mode: Dark & Deep-Red background' : 'Switch to Day Mode: White & Deep-Red background'}
            >
              {theme === 'light' ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-red-50 text-[#D40000] flex items-center justify-center">
                    <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                  <span className="text-xs font-bold text-neutral-800 hidden sm:inline">Day</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-full bg-[#3B0C1E] text-[#FF859B] flex items-center justify-center">
                    <Moon className="w-3.5 h-3.5 fill-[#FF859B]" />
                  </div>
                  <span className="text-xs font-bold text-[#FFB3C2] hidden sm:inline">Night</span>
                </>
              )}
            </button>

            {/* Profile / Action Button from Screenshot ("Hi, abir") */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="bg-[#D40000] hover:bg-[#700000] active:scale-95 text-white font-medium text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                title="User profile and role menu"
              >
                <span>{displayName}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {/* CUCC Controller Session Dropdown */}
              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-[#161722] border border-neutral-200 dark:border-[#382026] shadow-2xl p-3 z-50 text-neutral-900 dark:text-neutral-100 text-xs"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-1 py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                        Current Session: CUCC Controller
                      </p>
                    </div>
                    <p className="font-bold text-sm truncate text-[#D40000] dark:text-red-400">
                      Tanvir Ahmed
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      controller.tech@cityuniversity.edu
                    </p>
                  </div>

                  {/* CUCC Scope Details */}
                  <div className="py-2.5 px-1 space-y-1.5 text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Role:</span>
                      <span className="font-bold text-neutral-900 dark:text-white">Club Controller</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Club:</span>
                      <span className="font-bold text-[#D40000] dark:text-red-400">Computer Club (CUCC)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Student ID:</span>
                      <span className="font-mono text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">CU-21-CSE-045</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Department:</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">CSE (7th Semester)</span>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                        Assigned Wings (Full Access):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-[#D40000] dark:text-red-300 font-semibold text-[10px]">
                          Programming
                        </span>
                        <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-[#D40000] dark:text-red-300 font-semibold text-[10px]">
                          Cyber Security
                        </span>
                        <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-[#D40000] dark:text-red-300 font-semibold text-[10px]">
                          Research
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between px-1">
                    <button
                      onClick={() => {
                        handleNav('dashboard');
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full py-1.5 rounded-lg bg-[#D40000] hover:bg-red-700 text-white font-bold text-center text-xs transition-colors cursor-pointer"
                    >
                      Open Controller Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:text-[#D40000] focus:outline-none"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-[#16060D] border-b border-neutral-200 dark:border-[#380E1C] px-4 py-4 shadow-xl transition-colors">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-left ${
                    isActive
                      ? 'bg-[#D40000] text-white font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => handleNav('dashboard')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-left mt-2 ${
                activeTab === 'dashboard'
                  ? 'bg-red-800 text-white'
                  : 'bg-red-50 dark:bg-red-950/40 text-[#D40000] dark:text-red-300 border border-red-200 dark:border-red-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Dashboard(CC)</span>
            </button>

            {/* Direct Link to City University Official Website */}
            <a
              href="https://cityuniversity.ac.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100/90 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors mt-2"
              title="Visit City University Official Website: https://cityuniversity.ac.bd/"
            >
              <div className="flex items-center gap-2.5">
                <img src="/city-university-logo.jpg" alt="Logo" className="w-5 h-5 object-contain rounded" />
                <span>Visit Varsity Website (cityuniversity.ac.bd)</span>
              </div>
              <ExternalLink className="w-4 h-4 text-red-600 dark:text-red-400" />
            </a>

            {/* Mobile Theme Switcher Row */}
            <div className="pt-3 mt-3 border-t border-neutral-200 dark:border-[#2D181F] flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Mode: {theme === 'light' ? '☀️ Day (White & Crimson)' : '🌙 Night (Dark & Deep-Red)'}
              </span>
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-amber-100 border-amber-300 text-amber-950'
                    : 'bg-red-950 border-red-800 text-red-200'
                }`}
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Switch to Night</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Switch to Day</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
