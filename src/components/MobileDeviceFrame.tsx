import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Crown, Sparkles, RefreshCw, Volume2 } from 'lucide-react';
import { useSecretTap } from '../utils/useSecretTap';
import { resetToDemo } from '../utils/demoMode';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  isProUser: boolean;
  onToggleProMode: () => void;
  onToggleAuth?: () => void;
  isAuthenticated?: boolean;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  children,
  isProUser,
  onToggleProMode,
  onToggleAuth,
  isAuthenticated = true,
}) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');
  const [scaleMode, setScaleMode] = useState<'fit' | '100' | '90' | '80'>('fit');
  const [calculatedFitScale, setCalculatedFitScale] = useState(0.85);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const secretTap = useSecretTap(resetToDemo);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileScreen(isMobile);

      // Height of iPhone shell is around 906px (874px inner + 32px bezel)
      // Available window height minus top bar and padding (~120px)
      const availableH = window.innerHeight - 120;
      const fit = Math.min(1.0, Math.max(0.65, availableH / 906));
      setCalculatedFitScale(Number(fit.toFixed(2)));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeScale = scaleMode === 'fit' ? calculatedFitScale : Number(scaleMode) / 100;

  // On real mobile devices, always display full screen without device mockup
  if (isMobileScreen) {
    return (
      <div className="w-full min-h-screen bg-[#F9F7F2] text-[#2C2C24] flex flex-col antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFECE6] text-[#2C2C24] flex flex-col items-center justify-start py-4 px-4 selection:bg-[#E2DACB] overflow-x-hidden">
      {/* Top Floating Control Bar for Demo / Prototype Presentation */}
      <aside aria-label="Prototype controls" className="mb-4 flex flex-wrap items-center justify-center gap-2.5 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#DED7C8] shadow-md z-50">
        <div className="flex items-center gap-2 shrink-0">
          <span
            onClick={secretTap}
            className="font-heading font-bold text-xs tracking-tight text-[#2C2C24] cursor-default"
          >
            Freak Out!
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EBF0E8] text-[#485342] font-mono font-semibold border border-[#CFDFCB]">
            2622 × 1206 px (iPhone 16 Pro)
          </span>
        </div>

        <div className="h-3.5 w-px bg-[#DED7C8]" />

        {/* View Mode Toggle */}
        <div className="flex items-center bg-[#EAE4D9]/80 p-0.5 rounded-full text-xs shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-white text-[#2C2C24] shadow-2xs font-bold'
                : 'text-[#7A786C] hover:text-[#2C2C24]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>โหมดมือถือ</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('responsive')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition cursor-pointer ${
              viewMode === 'responsive'
                ? 'bg-white text-[#2C2C24] shadow-2xs font-bold'
                : 'text-[#7A786C] hover:text-[#2C2C24]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>เต็มจอ</span>
          </button>
        </div>

        {viewMode === 'mobile' && (
          <>
            <div className="h-3.5 w-px bg-[#DED7C8]" />
            {/* Scale Presets */}
            <div className="flex items-center bg-[#EAE4D9]/80 p-0.5 rounded-full text-[11px] font-mono shrink-0">
              <button
                type="button"
                onClick={() => setScaleMode('fit')}
                className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                  scaleMode === 'fit' ? 'bg-white text-[#2C2C24] font-bold shadow-2xs' : 'text-[#7A786C]'
                }`}
                title="ย่อขยายให้พอดีกับความสูงของหน้าจอคุณอัตโนมัติ"
              >
                พอดีจอ ({Math.round(calculatedFitScale * 100)}%)
              </button>
              <button
                type="button"
                onClick={() => setScaleMode('100')}
                className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                  scaleMode === '100' ? 'bg-white text-[#2C2C24] font-bold shadow-2xs' : 'text-[#7A786C]'
                }`}
                title="ขนาดดั้งเดิม 1:1 (402 x 874 pt)"
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => setScaleMode('90')}
                className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                  scaleMode === '90' ? 'bg-white text-[#2C2C24] font-bold shadow-2xs' : 'text-[#7A786C]'
                }`}
              >
                90%
              </button>
            </div>
          </>
        )}

        <div className="h-3.5 w-px bg-[#DED7C8]" />

        {/* Pro Mode Simulation Toggle */}
        <button
          type="button"
          onClick={onToggleProMode}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer border shrink-0 ${
            isProUser
              ? 'bg-[#FFF4E0] border-[#F4E1BD] text-[#B87A24] shadow-2xs'
              : 'bg-white border-[#DED7C8] text-[#6E6D62] hover:bg-[#F4EFE6]'
          }`}
          title="จำลองสถานะสมาชิกระหว่าง Free และ Pro"
        >
          <Crown className="w-3 h-3 fill-current" />
          <span>{isProUser ? 'Pro Mode' : 'Free Mode'}</span>
        </button>

        {onToggleAuth && (
          <>
            <div className="h-3.5 w-px bg-[#DED7C8]" />
            <button
              type="button"
              onClick={onToggleAuth}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#DED7C8] text-[#7A786C] hover:text-[#2C2C24] hover:bg-[#F4EFE6] transition active:scale-95 cursor-pointer shrink-0"
              title="ทดสอบสลับหน้าระหว่างล็อกอินและหน้าหลัก"
            >
              <span>{isAuthenticated ? '🚪 ออกจากระบบ' : '🔑 หน้าล็อกอิน'}</span>
            </button>
          </>
        )}
      </aside>

      {/* Main Container */}
      {viewMode === 'mobile' ? (
        /* Authentic iPhone 16 Pro Frame: Exactly 402 × 874 pt (1206 × 2622 px @3x) */
        <div
          className="flex justify-center items-start w-full origin-top transition-transform duration-200"
          style={{
            transform: `scale(${activeScale})`,
            marginBottom: `${-(906 * (1 - activeScale))}px`,
          }}
        >
          <div className="relative w-[428px] h-[906px] bg-[#1C1B18] rounded-[54px] p-3 shadow-[0_30px_90px_-20px_rgba(44,44,36,0.45)] border-4 border-[#3D3C35] flex flex-col shrink-0 select-none">
            {/* Outer Hardware Buttons (Action Button / Volume / Side Key / Camera Control) */}
            <div className="absolute -left-4.5 top-28 w-1 h-7 bg-[#33322B] rounded-l-md" title="Action Button" />
            <div className="absolute -left-4.5 top-39 w-1 h-12 bg-[#33322B] rounded-l-md" title="Volume Up" />
            <div className="absolute -left-4.5 top-54 w-1 h-12 bg-[#33322B] rounded-l-md" title="Volume Down" />
            <div className="absolute -right-4.5 top-36 w-1 h-16 bg-[#33322B] rounded-r-md" title="Side Power Key" />
            <div className="absolute -right-4.5 top-64 w-1 h-10 bg-[#424139] rounded-r-md" title="Camera Control" />

            {/* Inner Screen - Exactly 402px × 874px (1206 × 2622 px @3x) */}
            <div className="w-[402px] h-[874px] bg-[#F9F7F2] rounded-[44px] overflow-hidden flex flex-col relative border border-[#E5DEC9] shadow-inner">
              {children}
            </div>
          </div>
        </div>
      ) : (
        /* Responsive Wide Container */
        <div className="w-full max-w-4xl bg-[#F9F7F2] rounded-3xl overflow-hidden border border-[#DED7C8] shadow-xl flex flex-col min-h-[820px] relative">
          {children}
        </div>
      )}
    </div>
  );
};
