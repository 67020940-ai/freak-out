import React from 'react';
import { UserStats, PetState, AppTab } from '../types';
import { Sparkles, Flame, Wind, Crown, Gift, CheckSquare, Calendar, Brain, Smile, Settings, Bot } from 'lucide-react';
import { PixelCloud8Bit } from './PixelCloud8Bit';
import { AppLogo8Bit } from './AppLogo8Bit';
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
  onOpenAiChat?: () => void;
  isProUser: boolean;
  isAdmin?: boolean;
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
  onOpenAiChat,
  isProUser,
  isAdmin = false,
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

  // If user is on 'tasks', show the activeSpaceName (e.g. ห้องหลัก (General)).
  // If user is on another tab (e.g. 'settings', 'calendar', 'cloud-pet'), show that menu name directly!
  const headerMainTitle = currentTab === 'tasks' ? activeSpaceName : title;
  const headerSubTitle = currentTab === 'tasks'
    ? (isProUser ? 'PRO Workspace' : 'Free Canvas')
    : sub;

  return (
    <header className="sticky top-0 px-4 py-2.5 bg-[#FAF8F5]/95 dark:bg-[#1A1A18]/95 backdrop-blur-md border-b border-[#EAE4D9] dark:border-[#2E2E2A] shrink-0 z-30 select-none">
      <div className="flex items-center justify-between gap-3 w-full max-w-6xl mx-auto">
        {/* Left: 8-Bit Mascot App Logo & Space / Active View Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              secretTap();
              onTabChange('tasks');
            }}
            className="flex items-center gap-1 group p-0.5 rounded-2xl hover:bg-[#EFE9DE] dark:hover:bg-[#2C2C28] transition active:scale-95 text-left cursor-pointer shrink-0"
            title="Freak Out - หน้าหลัก"
          >
            <div className="relative shrink-0">
              <AppLogo8Bit size="sm" />
              <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-[#6C7764] text-white text-[9px] font-bold shadow-2xs border border-[#FAF8F5] dark:border-[#1A1A18]">
                L{pet.level}
              </span>
            </div>
          </button>

          {/* Active View / Space Selector Button */}
          <button
            onClick={() => {
              if (currentTab === 'tasks') {
                onOpenSpaces?.();
              } else {
                onTabChange('tasks');
              }
            }}
            className="flex flex-col text-left px-2 py-1 rounded-xl hover:bg-[#EFE9DE] dark:hover:bg-[#2C2C28] transition cursor-pointer"
            title={currentTab === 'tasks' ? 'สลับ Focus Space (Notion Workspace)' : 'กลับไปหน้างานวันนี้'}
          >
            <div className="flex items-center gap-1">
              <span className="font-heading font-bold text-xs text-[#2C2C24] dark:text-[#F0EEE6] leading-tight truncate max-w-[140px]">
                {headerMainTitle}
              </span>
              <span className="text-[10px] text-[#8C8A7D] dark:text-[#7A7870]">
                {currentTab === 'tasks' ? '▾' : '•'}
              </span>
            </div>
            <span className="text-[10px] text-[#7A786C] dark:text-[#A8A599] flex items-center gap-1 truncate max-w-[140px]">
              <span>{headerSubTitle}</span>
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
              isAdmin
                ? 'bg-[#EBF0E8] dark:bg-[#1E281C] border-[#CFDFCB] dark:border-[#2C4229] text-[#3B5433] dark:text-[#88B580] shadow-2xs'
                : isProUser
                ? 'bg-[#FFF4E0] dark:bg-[#342814] border-[#F4E1BD] dark:border-[#523F1E] text-[#B87A24] dark:text-[#E2A64E] shadow-2xs'
                : 'bg-[#F2EEE9] dark:bg-[#262624] border-[#E2DACB] dark:border-[#383834] text-[#7A786C] dark:text-[#A8A599] hover:bg-[#EAE4D9]'
            }`}
            title={isAdmin ? 'เข้าสู่ระบบในฐานะ Admin (PRO + Unlimited)' : isProUser ? 'คุณเป็นสมาชิก Freak Out PRO' : 'อัปเกรดเป็น PRO'}
          >
            <Crown className="w-3 h-3 fill-current" />
            <span>{isAdmin ? 'ADMIN' : isProUser ? 'PRO' : 'FREE'}</span>
          </button>
          {/* Daily Reward / Stardust */}
          <button
            onClick={onOpenDailyReward}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF9E6] dark:bg-[#2C2414] hover:bg-[#FFF2CC] border border-[#F4E1BD] dark:border-[#523F1E] text-[#8A5C1E] dark:text-[#E2A64E] text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
            title={isAdmin ? 'ละอองดาวไม่จำกัด (Admin Unlimited)' : 'ละอองดาวสะสม'}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D49E35]" />
            <span className="text-xs font-mono font-bold">
              {isAdmin ? '∞ ไม่จำกัด' : pet.stardust}
            </span>
          </button>

          {/* AI Agent Chat Button */}
          {onOpenAiChat && (
            <button
              onClick={onOpenAiChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0F5ED] dark:bg-[#1E281C] hover:bg-[#E3EDE0] dark:hover:bg-[#283626] border border-[#D5E2CF] dark:border-[#2C4229] text-[#4A633F] dark:text-[#88B580] text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
              title="คุยกับน้องเมฆ AI Agent"
            >
              <Bot className="w-3.5 h-3.5 text-[#5B7B4E] dark:text-[#88B580]" />
              <span className="hidden sm:inline">AI Agent</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
