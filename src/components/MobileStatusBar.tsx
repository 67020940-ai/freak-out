import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface MobileStatusBarProps {
  darkText?: boolean;
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({ darkText = true }) => {
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const textColor = darkText ? 'text-[#2C2C24]' : 'text-white';

  return (
    <div className={`w-full px-6 pt-2 pb-1 flex items-center justify-between text-xs font-semibold select-none ${textColor} shrink-0 z-40`}>
      {/* Time */}
      <span className="w-14 font-mono tracking-tight text-[13px]">{currentTime}</span>

      {/* Dynamic Island Pill (375px @3x = 125pt) */}
      <div className="h-7 w-[125px] bg-[#1E1E1A] rounded-full flex items-center justify-between shadow-inner px-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#1A261D] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
        </div>
      </div>

      {/* Status Icons */}
      <div className="w-14 flex items-center justify-end gap-1.5 opacity-90">
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <Battery className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
