import React from 'react';
import { UserStats, PetState, AppTab } from '../types';
import { Sparkles, Flame, Wind, Crown, Gift, CheckSquare, Calendar, Brain, Smile, Settings } from 'lucide-react';
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
  activeSpaceName?: string;
  onOpenSpaces?: () => void;
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
  activeSpaceName = 'ห้องหลัก',
  onOpenSpaces,
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
    <header className="sticky top-0 px-4 py-2.5 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE4D9] shrink-0 z-30 select-none">
      <div className="flex items-center justify-between gap-3 w-full max-w-6xl mx-auto">
        {/* Left: Mascot Pet Avatar & Space Switcher (Notion-style) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              secretTap();
              onTabChange('cloud-pet');
            }}
            className="flex items-center gap-2 group p-0.5 rounded-2xl hover:bg-[#EFE9DE] transition active:scale-95 text-left cursor-pointer shrink-0"
            title="ห้องของน้องนูเบ้"
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-[#E8E2D5] shadow-2xs flex items-center justify-center p-0.5">
                <PixelCloud8Bit pose="idle" size="sm" accessory={pet.equippedAccessory} color={pet.color || 'white'} interactive={false} />
              </div>
              <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-[#6C7764] text-white text-[9px] font-bold shadow-2xs border border-[#FAF8F5]">
                L{pet.level}
              </span>
            </div>
          </button>

          {/* Notion-style Space Selector Button */}
          <button
            onClick={onOpenSpaces}
            className="flex flex-col text-left px-2 py-1 rounded-xl hover:bg-[#EFE9DE] transition cursor-pointer"
            title="สลับ Focus Space (Notion Workspace)"
          >
            <div className="flex items-center gap-1">
              <span className="font-heading font-bold text-xs text-[#2C2C24] leading-tight truncate max-w-[130px]">
                {activeSpaceName}
              </span>
              <span className="text-[10px] text-[#8C8A7D]">▾</span>
            </div>
            <span className="text-[10px] text-[#7A786C] flex items-center gap-1">
              <span>{isProUser ? 'PRO Workspace' : 'Free Canvas'}</span>
            </span>
          </button>
        </div>

        {/* Center: Desktop Navigation Tabs (md+) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#EFE9DE]/80 p-1 rounded-2xl border border-[#E2DACB] shadow-2xs">
          <button
            type="button"
            onClick={() => onTabChange('tasks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentTab === 'tasks'
                ? 'bg-white text-[#2C2C24] font-bold shadow-2xs'
                : 'text-[#7A786C] hover:text-[#2C2C24] hover:bg-white/50'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>งานวันนี้</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentTab === 'calendar'
                ? 'bg-white text-[#2C2C24] font-bold shadow-2xs'
                : 'text-[#7A786C] hover:text-[#2C2C24] hover:bg-white/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>ตารางเวลา</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('smart-pick')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentTab === 'smart-pick'
                ? 'bg-[#6C7764] text-white shadow-2xs'
                : 'text-[#6C7764] hover:bg-[#6C7764]/10'
            }`}
          >
            <Brain className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Smart Pick</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('cloud-pet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentTab === 'cloud-pet'
                ? 'bg-white text-[#2C2C24] font-bold shadow-2xs'
                : 'text-[#7A786C] hover:text-[#2C2C24] hover:bg-white/50'
            }`}
          >
            <Smile className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>น้อง{pet.name}</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentTab === 'settings'
                ? 'bg-white text-[#2C2C24] font-bold shadow-2xs'
                : 'text-[#7A786C] hover:text-[#2C2C24] hover:bg-white/50'
            }`}
          >
            <Settings className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>ตั้งค่า</span>
          </button>
        </nav>

        {/* Center for sm screens (tablet portrait / small tablet): Title info */}
        <div className="hidden sm:flex md:hidden flex-col items-center text-center">
          <span className="font-heading font-bold text-sm text-[#2C2C24]">{title}</span>
          <span className="text-[10px] text-[#7A786C]">{sub}</span>
        </div>

        {/* Right: Pro Badge / Stardust + SOS */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Pro Mode Badge / Upgrade Trigger */}
          <button
            onClick={onOpenPricing}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition cursor-pointer flex items-center gap-1 ${
              isProUser
                ? 'bg-[#FFF4E0] border-[#F4E1BD] text-[#B87A24] shadow-2xs'
                : 'bg-[#F2EEE9] border-[#E2DACB] text-[#7A786C] hover:bg-[#EAE4D9]'
            }`}
            title={isProUser ? 'คุณเป็นสมาชิก Freak Out PRO' : 'อัปเกรดเป็น PRO'}
          >
            <Crown className="w-3 h-3 fill-current" />
            <span>{isProUser ? 'PRO' : 'FREE'}</span>
          </button>
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
