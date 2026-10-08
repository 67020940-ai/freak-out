import React from 'react';

interface AppLogo8BitProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const AppLogo8Bit: React.FC<AppLogo8BitProps> = ({
  size = 'md',
  showText = false,
  className = '',
}) => {
  const pixelDimensions = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* 8-bit Crisp Pixel App Icon Container */}
      <div
        className={`${pixelDimensions[size]} rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-[#EFE9DE] dark:from-[#262624] dark:to-[#181816] border border-[#E2DACB] dark:border-[#383834] shadow-2xs flex items-center justify-center p-1 relative overflow-hidden transition-transform active:scale-95`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
          style={{ shapeRendering: 'crispEdges' }}
        >
          {/* Subtle 8-bit Backdrop Accent Pixels */}
          <rect x="2" y="4" width="2" height="2" fill="#D49E35" fillOpacity="0.4" />
          <rect x="4" y="2" width="2" height="2" fill="#D49E35" fillOpacity="0.4" />
          <rect x="26" y="2" width="2" height="2" fill="#6C7764" fillOpacity="0.5" />
          <rect x="28" y="4" width="2" height="2" fill="#6C7764" fillOpacity="0.5" />

          {/* Cloud Outline in Dark Ink */}
          <rect x="10" y="6" width="12" height="2" fill="#2C2C24" />
          <rect x="8" y="8" width="2" height="2" fill="#2C2C24" />
          <rect x="22" y="8" width="2" height="2" fill="#2C2C24" />
          <rect x="6" y="10" width="2" height="4" fill="#2C2C24" />
          <rect x="24" y="10" width="2" height="4" fill="#2C2C24" />
          <rect x="4" y="14" width="2" height="8" fill="#2C2C24" />
          <rect x="26" y="14" width="2" height="8" fill="#2C2C24" />
          <rect x="6" y="22" width="20" height="2" fill="#2C2C24" />

          {/* Cloud Body / Fill */}
          <rect x="10" y="8" width="12" height="2" fill="#FFFFFF" />
          <rect x="8" y="10" width="16" height="4" fill="#FFFFFF" />
          <rect x="6" y="14" width="20" height="6" fill="#FFFFFF" />
          <rect x="6" y="20" width="20" height="2" fill="#EAE5DA" />

          {/* 8-bit Eyes */}
          <rect x="10" y="14" width="2" height="3" fill="#2C2C24" />
          <rect x="20" y="14" width="2" height="3" fill="#2C2C24" />

          {/* Cheerful Pixel Smile */}
          <rect x="13" y="18" width="6" height="1" fill="#2C2C24" />
          <rect x="12" y="17" width="1" height="1" fill="#2C2C24" />
          <rect x="19" y="17" width="1" height="1" fill="#2C2C24" />

          {/* Rosy Cheeks */}
          <rect x="8" y="16" width="2" height="2" fill="#F4A594" fillOpacity="0.8" />
          <rect x="22" y="16" width="2" height="2" fill="#F4A594" fillOpacity="0.8" />

          {/* Golden 8-Bit Focus Star on top-right */}
          <rect x="22" y="3" width="2" height="2" fill="#FBBF24" />
          <rect x="21" y="4" width="4" height="2" fill="#F59E0B" />
          <rect x="22" y="6" width="2" height="2" fill="#FBBF24" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-heading font-black text-sm tracking-tight text-[#2C2C24] dark:text-[#F0EEE6] leading-none">
            freak out
          </span>
          <span className="text-[10px] text-[#7A786C] dark:text-[#A8A599] font-medium leading-tight mt-0.5">
            Less thinking, more doing.
          </span>
        </div>
      )}
    </div>
  );
};
