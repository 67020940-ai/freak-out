import React from 'react';
import { motion } from 'motion/react';
import { PixelCloud8Bit, PixelCloudPose } from './PixelCloud8Bit';

interface MascotCloudProps {
  mood?: 'happy' | 'focus' | 'cheering' | 'thinking' | 'sleeping' | 'celebrating' | 'zen' | 'working';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withPencil?: boolean;
  withHeadphones?: boolean;
  withSparkles?: boolean;
  useArtwork?: boolean;
  bubbleText?: string;
  className?: string;
  onClick?: () => void;
}

export const MascotCloud: React.FC<MascotCloudProps> = ({
  mood = 'happy',
  size = 'md',
  withSparkles = true,
  bubbleText,
  className = '',
  onClick,
}) => {
  // Map moods to the 3 Core 8-bit Poses
  let pixelPose: PixelCloudPose = 'idle';
  if (mood === 'focus' || mood === 'working' || mood === 'thinking') {
    pixelPose = 'focus';
  } else if (mood === 'celebrating' || mood === 'cheering') {
    pixelPose = 'celebrate';
  } else {
    pixelPose = 'idle';
  }

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      onClick={onClick}
    >
      {/* 8-bit Retro Speech Bubble */}
      {bubbleText && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 max-w-xs bg-[#FAF8F5] text-[#2C2C24] px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold shadow-2xs border border-[#E8E2D5] relative text-center z-10"
        >
          {bubbleText}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#FAF8F5] border-b border-r border-[#E8E2D5] transform rotate-45" />
        </motion.div>
      )}

      {/* 8-Bit Pixel Character */}
      <div className="relative">
        <PixelCloud8Bit pose={pixelPose} size={size} interactive={!!onClick} />

        {/* Ambient 8-bit Sparkles */}
        {withSparkles && pixelPose === 'celebrate' && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-1 -right-2 text-xs font-bold pointer-events-none select-none text-[#D49E35]"
          >
            ✨
          </motion.div>
        )}
      </div>
    </div>
  );
};
