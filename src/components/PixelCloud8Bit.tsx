import React from 'react';

export type PixelCloudPose = 'idle' | 'focus' | 'celebrate';

interface PixelCloud8BitProps {
  pose?: PixelCloudPose;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const PixelCloud8Bit: React.FC<PixelCloud8BitProps> = ({
  pose = 'idle',
  size = 'md',
  interactive = true,
  onClick,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-44 h-44 sm:w-52 sm:h-52',
    xl: 'w-60 h-60 sm:w-68 sm:h-68',
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} ${
        interactive ? 'cursor-pointer active:scale-95 transition-transform' : ''
      } ${className}`}
      title={
        pose === 'idle'
          ? 'นูเบ้กำลังลอยสบายใจ ☁️'
          : pose === 'focus'
          ? 'นูเบ้กำลังตั้งใจปั่นงาน 💻'
          : 'นูเบ้กำลังฉลองสำเร็จ! 🎉'
      }
    >
      <svg
        viewBox="0 0 32 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
        style={{ shapeRendering: 'crispEdges' }}
      >
        <defs>
          <style>{`
            /* 8-bit Stepped Frame Ticking */
            @keyframes pixelFloat {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-2px); }
            }
            @keyframes pixelJump {
              0%, 100% { transform: translateY(0) scale(1); }
              30% { transform: translateY(-4px) scale(1.04); }
              60% { transform: translateY(-1px) scale(0.98); }
            }
            @keyframes pixelType {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-1px); }
            }
            @keyframes pixelFlame {
              0%, 100% { opacity: 0.3; transform: scale(0.9); }
              50% { opacity: 1; transform: scale(1.15) translateY(-1px); }
            }
            @keyframes pixelBlink {
              0%, 92%, 100% { transform: scaleY(1); }
              96% { transform: scaleY(0.15); }
            }
            @keyframes pixelStarSpin {
              0% { transform: rotate(0deg) scale(0.85); opacity: 0.6; }
              50% { transform: rotate(45deg) scale(1.1); opacity: 1; }
              100% { transform: rotate(90deg) scale(0.85); opacity: 0.6; }
            }

            .anim-idle {
              animation: pixelFloat 2s steps(4) infinite;
              transform-origin: center bottom;
            }
            .anim-focus {
              animation: pixelFloat 1.4s steps(3) infinite;
              transform-origin: center bottom;
            }
            .anim-celebrate {
              animation: pixelJump 0.8s steps(4) infinite;
              transform-origin: center bottom;
            }
            .anim-blink {
              animation: pixelBlink 3.2s infinite;
              transform-origin: center;
            }
            .anim-typing {
              animation: pixelType 0.25s steps(2) infinite;
            }
            .anim-flame {
              animation: pixelFlame 0.6s steps(3) infinite alternate;
              transform-origin: center;
            }
            .anim-star {
              animation: pixelStarSpin 1.2s steps(4) infinite;
              transform-origin: center;
            }
          `}</style>
        </defs>

        {/* -------------------- POSE: IDLE (ลอยดุ๊กดิ๊ก สบายใจ) -------------------- */}
        {pose === 'idle' && (
          <g className="anim-idle">
            {/* Outline Shadow (Pixelated Charcoal) */}
            {/* Top bumps */}
            <rect x="10" y="4" width="12" height="2" fill="#2C2C24" />
            <rect x="7" y="6" width="3" height="2" fill="#2C2C24" />
            <rect x="22" y="6" width="3" height="2" fill="#2C2C24" />
            
            {/* Left and Right shoulders */}
            <rect x="5" y="8" width="2" height="4" fill="#2C2C24" />
            <rect x="3" y="12" width="2" height="7" fill="#2C2C24" />
            <rect x="25" y="8" width="2" height="4" fill="#2C2C24" />
            <rect x="27" y="12" width="2" height="7" fill="#2C2C24" />
            
            {/* Bottom outline */}
            <rect x="5" y="19" width="3" height="2" fill="#2C2C24" />
            <rect x="24" y="19" width="3" height="2" fill="#2C2C24" />
            <rect x="8" y="21" width="16" height="2" fill="#2C2C24" />

            {/* Cloud Main White Body Fill */}
            <rect x="10" y="6" width="12" height="15" fill="#FFFFFF" />
            <rect x="7" y="8" width="18" height="11" fill="#FFFFFF" />
            <rect x="5" y="12" width="22" height="7" fill="#FFFFFF" />

            {/* Soft Warm Linen Bottom Shading */}
            <rect x="8" y="19" width="16" height="2" fill="#EAE3D5" />
            <rect x="5" y="17" width="2" height="2" fill="#EAE3D5" />
            <rect x="25" y="17" width="2" height="2" fill="#EAE3D5" />
            <rect x="10" y="17" width="12" height="2" fill="#F4EFE6" />

            {/* Cute Pixel Eyes with Blinking */}
            <g className="anim-blink">
              {/* Left Eye */}
              <rect x="10" y="12" width="2" height="3" fill="#2C2C24" />
              <rect x="10" y="12" width="1" height="1" fill="#FFFFFF" />
              {/* Right Eye */}
              <rect x="20" y="12" width="2" height="3" fill="#2C2C24" />
              <rect x="20" y="12" width="1" height="1" fill="#FFFFFF" />
            </g>

            {/* Cute Pixel Smile */}
            <rect x="15" y="15" width="2" height="1" fill="#2C2C24" />
            <rect x="14" y="14" width="1" height="1" fill="#2C2C24" />
            <rect x="17" y="14" width="1" height="1" fill="#2C2C24" />

            {/* Soft Coral/Pink Pixel Cheeks */}
            <rect x="7" y="14" width="2" height="1" fill="#E58270" opacity="0.85" />
            <rect x="23" y="14" width="2" height="1" fill="#E58270" opacity="0.85" />

            {/* Tiny Floating Calm Particle (Sage Green / Stardust) */}
            <rect x="2" y="7" width="1" height="1" fill="#828D7A" />
            <rect x="3" y="8" width="1" height="1" fill="#828D7A" />
            <rect x="28" y="6" width="1" height="1" fill="#B88E76" />
          </g>
        )}

        {/* -------------------- POSE: FOCUS (ก้มหน้าปั่นงานไฟลุก) -------------------- */}
        {pose === 'focus' && (
          <g className="anim-focus">
            {/* Determined Fire Sparks on Top (Pixel Flames) */}
            <g className="anim-flame">
              <rect x="15" y="1" width="2" height="2" fill="#E05A47" />
              <rect x="14" y="3" width="4" height="1" fill="#D49E35" />
              <rect x="16" y="2" width="1" height="1" fill="#FFE17D" />
            </g>

            {/* Cloud Outline */}
            <rect x="10" y="4" width="12" height="2" fill="#2C2C24" />
            <rect x="7" y="6" width="3" height="2" fill="#2C2C24" />
            <rect x="22" y="6" width="3" height="2" fill="#2C2C24" />
            <rect x="5" y="8" width="2" height="4" fill="#2C2C24" />
            <rect x="3" y="12" width="2" height="7" fill="#2C2C24" />
            <rect x="25" y="8" width="2" height="4" fill="#2C2C24" />
            <rect x="27" y="12" width="2" height="7" fill="#2C2C24" />
            <rect x="5" y="19" width="3" height="2" fill="#2C2C24" />
            <rect x="24" y="19" width="3" height="2" fill="#2C2C24" />
            <rect x="8" y="21" width="16" height="2" fill="#2C2C24" />

            {/* Cloud Body Fill */}
            <rect x="10" y="6" width="12" height="15" fill="#FFFFFF" />
            <rect x="7" y="8" width="18" height="11" fill="#FFFFFF" />
            <rect x="5" y="12" width="22" height="7" fill="#FFFFFF" />

            {/* Shading */}
            <rect x="8" y="19" width="16" height="2" fill="#EAE3D5" />
            <rect x="10" y="17" width="12" height="2" fill="#F4EFE6" />

            {/* Determined Focus Eyes (Looking slightly down at laptop) */}
            <rect x="10" y="12" width="3" height="2" fill="#2C2C24" />
            <rect x="9" y="11" width="2" height="1" fill="#2C2C24" />
            <rect x="19" y="12" width="3" height="2" fill="#2C2C24" />
            <rect x="21" y="11" width="2" height="1" fill="#2C2C24" />

            {/* Concentrated Mouth (Determined Line) */}
            <rect x="15" y="15" width="2" height="1" fill="#2C2C24" />

            {/* 8-bit Mini Laptop on Lap */}
            {/* Screen */}
            <rect x="11" y="16" width="10" height="6" fill="#2C2C24" />
            <rect x="12" y="17" width="8" height="4" fill="#6C7764" />
            {/* Glowing terminal prompt on screen */}
            <rect x="13" y="18" width="3" height="1" fill="#4ADE80" />
            <rect x="13" y="19" width="5" height="1" fill="#A7F3D0" />

            {/* Keyboard base */}
            <rect x="10" y="22" width="12" height="2" fill="#3D3C35" />

            {/* Fast Typing Hands (Animated) */}
            <g className="anim-typing">
              <rect x="9" y="19" width="2" height="2" fill="#FFFFFF" stroke="#2C2C24" strokeWidth="0.5" />
              <rect x="21" y="19" width="2" height="2" fill="#FFFFFF" stroke="#2C2C24" strokeWidth="0.5" />
            </g>
          </g>
        )}

        {/* -------------------- POSE: CELEBRATE (กระโดดฉลอง ดาววิ้งๆ) -------------------- */}
        {pose === 'celebrate' && (
          <g className="anim-celebrate">
            {/* 8-Bit Gold Stars Bursting Around */}
            <g className="anim-star" style={{ transformOrigin: '4px 6px' }}>
              <rect x="3" y="5" width="3" height="1" fill="#D49E35" />
              <rect x="4" y="4" width="1" height="3" fill="#D49E35" />
              <rect x="4" y="5" width="1" height="1" fill="#FFE17D" />
            </g>

            <g className="anim-star" style={{ transformOrigin: '28px 6px' }}>
              <rect x="27" y="5" width="3" height="1" fill="#D49E35" />
              <rect x="28" y="4" width="1" height="3" fill="#D49E35" />
              <rect x="28" y="5" width="1" height="1" fill="#FFE17D" />
            </g>

            {/* Cloud Outline */}
            <rect x="10" y="4" width="12" height="2" fill="#2C2C24" />
            <rect x="7" y="6" width="3" height="2" fill="#2C2C24" />
            <rect x="22" y="6" width="3" height="2" fill="#2C2C24" />
            <rect x="5" y="8" width="2" height="4" fill="#2C2C24" />
            <rect x="3" y="12" width="2" height="7" fill="#2C2C24" />
            <rect x="25" y="8" width="2" height="4" fill="#2C2C24" />
            <rect x="27" y="12" width="2" height="7" fill="#2C2C24" />
            <rect x="5" y="19" width="3" height="2" fill="#2C2C24" />
            <rect x="24" y="19" width="3" height="2" fill="#2C2C24" />
            <rect x="8" y="21" width="16" height="2" fill="#2C2C24" />

            {/* Cloud Body Fill */}
            <rect x="10" y="6" width="12" height="15" fill="#FFFFFF" />
            <rect x="7" y="8" width="18" height="11" fill="#FFFFFF" />
            <rect x="5" y="12" width="22" height="7" fill="#FFFFFF" />

            {/* Shading */}
            <rect x="8" y="19" width="16" height="2" fill="#EAE3D5" />
            <rect x="10" y="17" width="12" height="2" fill="#F4EFE6" />

            {/* Cheerful Raised Hands (Hooray!) */}
            <rect x="3" y="9" width="2" height="3" fill="#2C2C24" />
            <rect x="4" y="8" width="2" height="2" fill="#FFFFFF" />
            <rect x="27" y="9" width="2" height="3" fill="#2C2C24" />
            <rect x="26" y="8" width="2" height="2" fill="#FFFFFF" />

            {/* Joyful Squinting Eyes (^ ^) */}
            {/* Left Eye */}
            <rect x="9" y="13" width="1" height="1" fill="#2C2C24" />
            <rect x="10" y="12" width="2" height="1" fill="#2C2C24" />
            <rect x="12" y="13" width="1" height="1" fill="#2C2C24" />

            {/* Right Eye */}
            <rect x="19" y="13" width="1" height="1" fill="#2C2C24" />
            <rect x="20" y="12" width="2" height="1" fill="#2C2C24" />
            <rect x="22" y="13" width="1" height="1" fill="#2C2C24" />

            {/* Happy Open Mouth :D */}
            <rect x="14" y="14" width="4" height="3" fill="#2C2C24" />
            <rect x="15" y="15" width="2" height="2" fill="#E05A47" />

            {/* Cheerful Cheeks */}
            <rect x="7" y="14" width="2" height="1" fill="#E58270" />
            <rect x="23" y="14" width="2" height="1" fill="#E58270" />
          </g>
        )}
      </svg>
    </div>
  );
};
