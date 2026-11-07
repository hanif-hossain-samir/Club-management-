import React from 'react';
import { Code2 } from 'lucide-react';

interface WingIconProps {
  slug: string;
  className?: string;
  isSelected?: boolean;
}

export const WING_CUSTOM_ICONS: Record<string, { red: string; pink: string; white: string; label: string }> = {
  cyber_security: {
    red: '/assets/icons/cyber_security_red.png',
    pink: '/assets/icons/cyber_security_pink.png',
    white: '/assets/icons/cyber_security_white.png',
    label: 'Cyber Security'
  },
  research: {
    red: '/assets/icons/research_red.png',
    pink: '/assets/icons/research_pink.png',
    white: '/assets/icons/research_white.png',
    label: 'Research'
  },
  sports: {
    red: '/assets/icons/sports_red.png',
    pink: '/assets/icons/sports_pink.png',
    white: '/assets/icons/sports_white.png',
    label: 'Sports'
  },
  cultural: {
    red: '/assets/icons/cultural_red.png',
    pink: '/assets/icons/cultural_pink.png',
    white: '/assets/icons/cultural_white.png',
    label: 'Cultural'
  },
  tour: {
    red: '/assets/icons/tour_red.png',
    pink: '/assets/icons/tour_pink.png',
    white: '/assets/icons/tour_white.png',
    label: 'Tour'
  }
};

export const WingIcon: React.FC<WingIconProps> = ({ slug, className = 'w-5 h-5', isSelected = false }) => {
  const custom = WING_CUSTOM_ICONS[slug];

  if (custom) {
    if (isSelected) {
      return (
        <span className={`inline-flex items-center justify-center ${className} select-none pointer-events-none shrink-0`}>
          <img
            src={custom.white}
            alt={custom.label}
            className="w-full h-full object-contain"
            loading="eager"
          />
        </span>
      );
    }

    return (
      <span className={`inline-flex items-center justify-center ${className} select-none pointer-events-none shrink-0`}>
        <img
          src={custom.red}
          alt={custom.label}
          className="w-full h-full object-contain dark:hidden"
          loading="eager"
        />
        <img
          src={custom.pink}
          alt={custom.label}
          className="w-full h-full object-contain hidden dark:block"
          loading="eager"
        />
      </span>
    );
  }

  // Programming Club default icon
  return <Code2 className={`${className} stroke-[2] ${isSelected ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />;
};
