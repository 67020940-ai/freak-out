import React from 'react';
import { motion } from 'motion/react';

interface MascotCloudProps {
  mood?: 'happy' | 'focus' | 'cheering' | 'thinking' | 'sleeping' | 'celebrating';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withPencil?: boolean;
  withHeadphones?: boolean;
  withSparkles?: boolean;
  bubbleText?: string;
  className?: string;
  onClick?: () => void;
}

export const MascotCloud: React.FC<MascotCloudProps> = ({
  mood = 'happy',
  size = 'md',
  withPencil = false,
  withHeadphones = false,
  withSparkles = true,
  bubbleText,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: 'w-16 h-12',
    md: 'w-28 h-20',
    lg: 'w-40 h-28',
    xl: 'w-56 h-40',
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`} onClick={onClick}>
      {/* Speech Bubble */}
      {bubbleText && (
        <motion.div
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 max-w-xs bg-[#FAF8F5] text-[#2C2C24] px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-medium shadow-xs border border-[#E2DACB] relative text-center z-10"
        >
          {bubbleText}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FAF8F5] border-b border-r border-[#E2DACB] transform rotate-45" />
        </motion.div>
      )}

      {/* Cloud Character Container */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: mood === 'cheering' ? [0, -3, 3, 0] : [0, 1, -1, 0],
        }}
        transition={{
          duration: mood === 'cheering' ? 1.5 : 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`relative ${sizeMap[size]} cursor-pointer`}
      >
        {/* Sparkles */}
        {withSparkles && (
          <>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              className="absolute -top-2 -right-1 text-[#C49B5C] text-sm font-bold z-20 pointer-events-none"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.7, 1.1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
              className="absolute -bottom-1 -left-2 text-[#828D7A] text-xs font-bold z-20 pointer-events-none"
            >
              ✦
            </motion.div>
          </>
        )}

        {/* Headphones Accessory */}
        {withHeadphones && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[85%] h-12 z-20 pointer-events-none">
            {/* Band */}
            <div className="w-full h-8 border-4 border-[#828D7A] rounded-t-full" />
            {/* Left Ear Muff */}
            <div className="absolute -bottom-1 -left-2 w-4 h-6 bg-[#828D7A] rounded-full border border-[#6C7764] shadow-xs" />
            {/* Right Ear Muff */}
            <div className="absolute -bottom-1 -right-2 w-4 h-6 bg-[#828D7A] rounded-full border border-[#6C7764] shadow-xs" />
          </div>
        )}

        {/* SVG Cloud Body */}
        <svg viewBox="0 0 160 110" className="w-full h-full drop-shadow-sm overflow-visible">
          <defs>
            {/* Natural Cream / Stone Gradient */}
            <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F5EFE6" />
              <stop offset="100%" stopColor="#EFE9DE" />
            </linearGradient>
            <linearGradient id="pencilWood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4A373" />
              <stop offset="100%" stopColor="#B88E76" />
            </linearGradient>
          </defs>

          {/* Cloud Base Puff Paths */}
          <path
            d="M 35 85 
               C 15 85, 10 65, 25 50 
               C 15 35, 30 18, 55 22 
               C 70 8, 100 8, 115 25 
               C 135 15, 155 35, 145 60 
               C 158 75, 145 92, 125 90 
               C 115 102, 45 102, 35 85 Z"
            fill="url(#cloudGrad)"
            stroke="#828D7A"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Highlights */}
          <path
            d="M 60 18 C 80 12, 100 12, 110 22"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 28 42 C 32 30, 45 25, 52 26"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Cheeks (Blushing in warm peach) */}
          <circle cx="46" cy="62" r="6" fill="#E8A598" opacity="0.7" />
          <circle cx="114" cy="62" r="6" fill="#E8A598" opacity="0.7" />

          {/* Eyes & Expressions based on mood */}
          {mood === 'happy' && (
            <>
              {/* Happy dots */}
              <circle cx="60" cy="54" r="4.5" fill="#2C2C24" />
              <circle cx="100" cy="54" r="4.5" fill="#2C2C24" />
              {/* Eye sparkle */}
              <circle cx="58.5" cy="52.5" r="1.5" fill="#FFFFFF" />
              <circle cx="98.5" cy="52.5" r="1.5" fill="#FFFFFF" />
              {/* Smile */}
              <path
                d="M 72 63 Q 80 72 88 63"
                fill="none"
                stroke="#2C2C24"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </>
          )}

          {mood === 'focus' && (
            <>
              {/* Determined focused eyes */}
              <path d="M 54 53 Q 61 50 67 55" fill="none" stroke="#2C2C24" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 93 55 Q 99 50 106 53" fill="none" stroke="#2C2C24" strokeWidth="3.5" strokeLinecap="round" />
              {/* Tiny determined mouth */}
              <ellipse cx="80" cy="65" rx="3.5" ry="2" fill="#2C2C24" />
            </>
          )}

          {mood === 'cheering' || mood === 'celebrating' && (
            <>
              {/* Happy closed arched eyes */}
              <path d="M 53 56 Q 60 48 67 56" fill="none" stroke="#2C2C24" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 93 56 Q 100 48 107 56" fill="none" stroke="#2C2C24" strokeWidth="3.5" strokeLinecap="round" />
              {/* Open happy smile */}
              <path
                d="M 70 61 Q 80 76 90 61 Z"
                fill="#C97D60"
                stroke="#2C2C24"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </>
          )}

          {mood === 'thinking' && (
            <>
              {/* Curious eyes looking up */}
              <circle cx="60" cy="51" r="4.5" fill="#2C2C24" />
              <circle cx="100" cy="51" r="4.5" fill="#2C2C24" />
              <circle cx="61" cy="49" r="1.5" fill="#FFFFFF" />
              <circle cx="101" cy="49" r="1.5" fill="#FFFFFF" />
              {/* Wavy thoughtful mouth */}
              <path
                d="M 72 65 Q 77 62 82 65 T 88 64"
                fill="none"
                stroke="#2C2C24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {mood === 'sleeping' && (
            <>
              {/* Sleeping cute closed eyes */}
              <path d="M 54 55 Q 60 59 66 55" fill="none" stroke="#2C2C24" strokeWidth="3" strokeLinecap="round" />
              <path d="M 94 55 Q 100 59 106 55" fill="none" stroke="#2C2C24" strokeWidth="3" strokeLinecap="round" />
              {/* Zzz text */}
              <text x="115" y="35" fill="#828D7A" fontSize="14" fontWeight="bold">z</text>
              <text x="125" y="25" fill="#B88E76" fontSize="16" fontWeight="bold">Z</text>
            </>
          )}

          {/* Little hands */}
          <ellipse cx="40" cy="74" rx="5" ry="4" fill="#EFE9DE" stroke="#828D7A" strokeWidth="2" />
          <ellipse cx="120" cy="74" rx="5" ry="4" fill="#EFE9DE" stroke="#828D7A" strokeWidth="2" />

          {/* Pencil Accessory in Hand (like in the slide!) */}
          {withPencil && (
            <g transform="translate(112, 50) rotate(-25)">
              {/* Pencil Body */}
              <rect x="0" y="0" width="8" height="28" rx="2" fill="url(#pencilWood)" stroke="#5C4D3C" strokeWidth="1" />
              {/* Eraser */}
              <rect x="0" y="24" width="8" height="6" rx="2" fill="#E8A598" stroke="#5C4D3C" strokeWidth="1" />
              <rect x="0" y="22" width="8" height="3" fill="#A89F91" />
              {/* Tip */}
              <polygon points="0,0 8,0 4,-9" fill="#EFE9DE" stroke="#5C4D3C" strokeWidth="1" />
              {/* Graphite */}
              <polygon points="2.5,-5 5.5,-5 4,-9" fill="#2C2C24" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
