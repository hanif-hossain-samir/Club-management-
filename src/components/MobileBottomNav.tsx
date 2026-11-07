import React from 'react';
import { 
  Home, 
  Layers, 
  Calendar, 
  Image as ImageIcon, 
  Info, 
  Shield 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { role } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'clubs', label: 'Clubs', icon: Layers },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'about', label: 'About', icon: Info },
    { id: 'dashboard', label: 'Dashboard(CC)', icon: Shield },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    // Smoothly scroll to top when switching sections on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#14050D]/95 backdrop-blur-lg border-t border-neutral-200 dark:border-[#380E1C] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.7)] transition-colors duration-200"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2px)' }}
    >
      <div className="grid grid-cols-6 items-center px-1 py-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-90 select-none ${
                isActive
                  ? 'text-[#D40000] dark:text-[#FF859B]'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <div 
                className={`relative p-1 rounded-xl transition-all duration-200 flex items-center justify-center ${
                  isActive 
                    ? 'bg-red-50 dark:bg-[#2C0A17] scale-110 shadow-xs' 
                    : 'bg-transparent'
                }`}
              >
                <Icon 
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'
                  }`} 
                />
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#D40000] dark:bg-[#FF859B]" />
                )}
              </div>

              <span 
                className={`text-[10px] mt-0.5 tracking-tight leading-none truncate max-w-full ${
                  isActive 
                    ? 'font-bold text-[#D40000] dark:text-[#FF859B]' 
                    : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
