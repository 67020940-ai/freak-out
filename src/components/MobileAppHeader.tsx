import React from 'react';
import { UserStats, PetState, AppTab } from '../types';
import { Sparkles, Flame, Wind, Crown, Gift } from 'lucide-react';
import { PixelCloud8Bit } from './PixelCloud8Bit';
import { useSecretTap } from '../utils/useSecretTap';
import { resetToDemo } from '../utils/demoMode';

interface MobileAppHeaderProps {
  stats: UserStats;
  pet: PetState;
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenPanic: () => void;
  onOpenPricing: () => void;
  onOpenDailyReward: () => void;
  isProUser: boolean;
}

export const MobileAppHeader: React.FC<MobileAppHeaderProps> = ({
  stats,
  pet,
  currentTab,
  onTabChange,
  onOpenPanic,
  onOpenPricing,
  onOpenDailyReward,
  isProUser,
}) => {
  const secretTap = useSecretTap(resetToDemo);

  const getTabTitle = () => {
    switch (currentTab) {
      case 'tasks':
        return { title: 'งานวันนี้', sub: 'Less thinking, more doing' };
      case 'calendar':
        return { title: 'ตารางเวลา', sub: 'สแกนช่วงว่าง & โฟกัส' };
      case 'smart-pick':
        return { title: 'Smart Pick', sub: 'AI วิเคราะห์ 1 งานที่เหมาะที่สุด' };
      case 'cloud-pet':
        return { title: `ห้องของน้อง${pet.name}`, sub: 'เพื่อนคู่คิดลดความเครียด' };
      case 'gamification':
        return { title: 'สถิติ & สตรีค', sub: `เลเวล ${stats.level} • ${stats.levelTitle}` };
      default:
        return { title: 'ตั้งค่า', sub: 'การตั้งค่าระบบและบัญชี' };
    }
  };

  const { title, sub } = getTabTitle();

  return (
    <header className="px-4 py-3 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE4D9] shrink-0 z-30 select-none">
      <div className="flex items-center justify-between gap-3 w-full">
        {/* Left: Mascot Pet Avatar & Name */}
        <button
          onClick={() => {
            secretTap();
            onTabChange('cloud-pet');
          }}
          className="flex items-center gap-2.5 group p-0.5 rounded-2xl hover:bg-[#EFE9DE] transition active:scale-95 text-left cursor-pointer shrink-0"
          title="ห้องของน้องนูเบ้"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-[#E8E2D5] shadow-2xs flex items-center justify-center p-0.5">
              <PixelCloud8Bit pose="idle" size="sm" accessory={pet.equippedAccessory} interactive={false} />
            </div>
            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-[#6C7764] text-white text-[9px] font-bold shadow-2xs border border-[#FAF8F5]">
              L{pet.level}
            </span>
          </div>

          <div className="shrink-0">
            <span className="font-heading font-bold text-sm text-[#2C2C24] whitespace-nowrap block">
              {pet.name}
            </span>
            <span className="text-[10px] text-[#7A786C] whitespace-nowrap">
              เพื่อนคู่คิด
            </span>
          </div>
        </button>

        {/* Right: Essential Focus Actions Only (Stardust + SOS) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Daily Reward / Stardust */}
          <button
            onClick={onOpenDailyReward}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF9E6] hover:bg-[#FFF2CC] border border-[#F4E1BD] text-[#8A5C1E] text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
            title="ละอองดาวสะสม"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D49E35]" />
            <span className="text-xs font-mono font-bold">{pet.stardust}</span>
          </button>

          {/* Panic SOS Button - Calm Breathing */}
          <button
            onClick={onOpenPanic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8EFF7] hover:bg-[#D5E3F2] border border-[#CADAEB] text-[#345A82] text-xs font-bold transition active:scale-95 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
            title="ฝึกหายใจ คลายกังวลทันที"
          >
            <Wind className="w-3.5 h-3.5 text-[#3B6C9D]" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
