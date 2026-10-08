import React, { useState, useRef, useEffect } from 'react';
import { UserStats, PetState, AppTab } from '../types';
import {
  Sparkles,
  Flame,
  Plus,
  Wind,
  Brain,
  Award,
  Crown,
  CheckSquare,
  ChevronDown,
  Calendar,
  Gift,
  Smile,
  Shield,
  Settings
} from 'lucide-react';
import { MascotCloud } from './MascotCloud';

interface HeaderProps {
  stats: UserStats;
  pet: PetState;
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenNewTask: () => void;
  onOpenSmartPick: () => void;
  onOpenPanic: () => void;
  onOpenPricing: () => void;
  onOpenDailyReward: () => void;
  isProUser: boolean;
  onToggleProMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  pet,
  currentTab,
  onTabChange,
  onOpenNewTask,
  onOpenSmartPick,
  onOpenPanic,
  onOpenPricing,
  onOpenDailyReward,
  isProUser,
  onToggleProMode,
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    if (isToolsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isToolsOpen]);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE4D9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            onClick={() => onTabChange('tasks')}
          >
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform rounded-2xl bg-white/80 p-0.5 border border-[#E2DACB] shadow-2xs">
              <img
                src="/mascot/cloud_celebrate_done_1789549091591.jpg"
                alt="Freak Out Mascot"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#2C2C24]">
                  freak out
                </span>
                {isProUser ? (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4E0] text-[#B87A24] border border-[#F4E1BD] shadow-2xs">
                    <Crown className="w-2.5 h-2.5 fill-current" /> PRO
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAE8F5] text-[#5C4D82] border border-[#DDD5EF]">
                    calm & focus
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#7A786C] font-medium hidden sm:block">
                แอปช่วยจัดการงานและลดการคิดเยอะ
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs - Modern & Pastel */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F0EBE1] p-1 rounded-2xl border border-[#E2DACB]">
            <button
              onClick={() => onTabChange('tasks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                currentTab === 'tasks'
                  ? 'bg-white text-[#2C2C24] shadow-xs'
                  : 'text-[#6E6E60] hover:text-[#2C2C24] hover:bg-white/50'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#5F7554]" />
              <span>งานของฉัน</span>
            </button>

            <button
              onClick={() => onTabChange('cloud-pet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                currentTab === 'cloud-pet'
                  ? 'bg-white text-[#2C2C24] shadow-xs'
                  : 'text-[#6E6E60] hover:text-[#2C2C24] hover:bg-white/50'
              }`}
            >
              <Smile className="w-3.5 h-3.5 text-[#B87A24]" />
              <span>น้อง{pet.name}</span>
            </button>

            <button
              onClick={() => onTabChange('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                currentTab === 'calendar'
                  ? 'bg-white text-[#2C2C24] shadow-xs'
                  : 'text-[#6E6E60] hover:text-[#2C2C24] hover:bg-white/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#385E82]" />
              <span>ปฏิทินอัจฉริยะ</span>
            </button>

            <button
              onClick={() => onTabChange('smart-pick')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                currentTab === 'smart-pick'
                  ? 'bg-white text-[#2C2C24] shadow-xs'
                  : 'text-[#6E6E60] hover:text-[#2C2C24] hover:bg-white/50'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-[#8A56AC]" />
              <span>AI ช่วยเลือกงาน</span>
            </button>

            <button
              onClick={() => onTabChange('gamification')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                currentTab === 'gamification'
                  ? 'bg-white text-[#2C2C24] shadow-xs'
                  : 'text-[#6E6E60] hover:text-[#2C2C24] hover:bg-white/50'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#B07248]" />
              <span>รางวัล</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Daily Login Reward Button */}
            <button
              onClick={onOpenDailyReward}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-[#FFF4E0] hover:bg-[#FFE8BF] text-[#B87A24] font-bold text-xs border border-[#F4E1BD] shadow-2xs transition active:scale-95 cursor-pointer"
              title="กดรับของขวัญเช็คอินรายวัน"
            >
              <Gift className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ของขวัญ</span>
            </button>

            {/* Streak Counter */}
            <div
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-[#FDECE8] text-[#9A4A38] text-xs font-bold border border-[#F6D7D0] shadow-2xs"
              title={`รักษาความสม่ำเสมอ ${stats.streakDays} วันติด!`}
            >
              <Flame className="w-3.5 h-3.5 fill-[#BC5E48] text-[#BC5E48]" />
              <span>{stats.streakDays} วัน</span>
            </div>

            {/* Demo Toggle Pro / Free Mode Switch */}
            <button
              onClick={onToggleProMode}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-[#F2EEE9] hover:bg-[#EAE4D9] text-[#7A786C] text-[11px] font-semibold border border-[#E2DACB] transition cursor-pointer"
              title="สลับโหมด Free / Pro เพื่อทดสอบดูความแตกต่าง"
            >
              <span className="text-[10px]">โหมด:</span>
              <span className={`font-bold ${isProUser ? 'text-[#B87A24]' : 'text-[#5F7554]'}`}>
                {isProUser ? 'PRO' : 'FREE'}
              </span>
            </button>

            {/* Add Task Button */}
            <button
              onClick={onOpenNewTask}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#E2ECE0] hover:bg-[#D5E5D1] text-[#3B5433] font-bold text-xs sm:text-sm border border-[#CFDFCB] shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">เพิ่มงาน</span>
            </button>

            {/* Unified Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-[#F0EBE1] hover:bg-[#E5DFD3] text-[#4A4A3E] font-semibold text-xs sm:text-sm border border-[#E2DACB] transition cursor-pointer shadow-2xs"
                title="เมนูเครื่องมือ"
              >
                <Sparkles className="w-4 h-4 text-[#8A56AC]" />
                <span className="hidden sm:inline">เครื่องมือ</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isToolsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#FAF8F5] rounded-3xl shadow-xl border border-[#E2DACB] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[#EAE4D9] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#7A786C] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#828D7A]" />
                      <span>เมนูและเครื่องมือ</span>
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAE8F5] text-[#5C4D82]">
                      Lv.{stats.level} ({stats.xp} XP)
                    </span>
                  </div>

                  <div className="space-y-1 mt-1.5">
                    {/* Item 1: Smart Pick */}
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onOpenSmartPick();
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#EAE8F5] text-left transition cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#EAE8F5] group-hover:bg-white flex items-center justify-center shrink-0 border border-[#DDD5EF]">
                        <Brain className="w-4 h-4 text-[#7C5CA5]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#2C2C24]">AI ช่วยเลือกงาน (Smart Pick)</div>
                        <p className="text-[10px] text-[#7A786C]">คัด 1 งานเด็ดตามแรงและเวลาที่มี</p>
                      </div>
                    </button>

                    {/* Item 2: Panic Calm */}
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onOpenPanic();
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#E2ECE0] text-left transition cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#E2ECE0] group-hover:bg-white flex items-center justify-center shrink-0 border border-[#CFDFCB]">
                        <Wind className="w-4 h-4 text-[#4D6C44] animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#2C2C24]">SOS ผ่อนคลาย & หายใจ 4-7-8</div>
                        <p className="text-[10px] text-[#7A786C]">พักสมอง 1 นาที สยบความวิตกกังวล</p>
                      </div>
                    </button>

                    {/* Item 3: Calendar */}
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onTabChange('calendar');
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#E8F2FA] text-left transition cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#E8F2FA] group-hover:bg-white flex items-center justify-center shrink-0 border border-[#CEE0F0]">
                        <Calendar className="w-4 h-4 text-[#385E82]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#2C2C24]">ปฏิทินและไทม์ไลน์อัจฉริยะ</div>
                        <p className="text-[10px] text-[#7A786C]">ตรวจจับช่องว่างระหว่างวันอัตโนมัติ</p>
                      </div>
                    </button>

                    {/* Item 4: Pet Sanctuary */}
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onTabChange('cloud-pet');
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#FFF4E0] text-left transition cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#FFF4E0] group-hover:bg-white flex items-center justify-center shrink-0 border border-[#F4E1BD]">
                        <Smile className="w-4 h-4 text-[#B87A24]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#2C2C24]">ห้องดูแลน้อง{pet.name}</div>
                        <p className="text-[10px] text-[#7A786C]">แต่งตัว ให้อาหาร และเปลี่ยนสภาพอากาศ</p>
                      </div>
                    </button>

                    {/* Item 5: Upgrade */}
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onOpenPricing();
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#FDECE8] text-left transition cursor-pointer group border-t border-[#EAE4D9] mt-1 pt-2"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#FDECE8] group-hover:bg-white flex items-center justify-center shrink-0 border border-[#F6D7D0]">
                        <Crown className="w-4 h-4 text-[#B85842]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#2C2C24] flex items-center gap-1">
                          <span>{isProUser ? 'Freak Out PRO (Active)' : 'อัปเกรดเป็น PRO'}</span>
                          {!isProUser && (
                            <span className="px-1.5 py-0.2 rounded bg-[#EAE8F5] text-[#5C4D82] text-[9px] font-bold">
                              ฿49
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#7A786C]">
                          {isProUser ? 'เพลิดเพลินกับประสบการณ์ไร้โฆษณา' : 'ปิดโฆษณา & ปลดล็อก AI ไม่จำกัด'}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-[#EAE4D9] text-xs">
          <button
            onClick={() => onTabChange('tasks')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition ${
              currentTab === 'tasks' ? 'text-[#3B5433] font-bold' : 'text-[#7A786C]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span className="text-[10px]">งาน</span>
          </button>

          <button
            onClick={() => onTabChange('cloud-pet')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition ${
              currentTab === 'cloud-pet' ? 'text-[#B87A24] font-bold' : 'text-[#7A786C]'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span className="text-[10px]">น้องเมฆ</span>
          </button>

          <button
            onClick={() => onTabChange('calendar')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition ${
              currentTab === 'calendar' ? 'text-[#385E82] font-bold' : 'text-[#7A786C]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[10px]">ปฏิทิน</span>
          </button>

          <button
            onClick={() => onTabChange('smart-pick')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition ${
              currentTab === 'smart-pick' ? 'text-[#7C5CA5] font-bold' : 'text-[#7A786C]'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span className="text-[10px]">AI Pick</span>
          </button>

          <button
            onClick={() => onTabChange('gamification')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition ${
              currentTab === 'gamification' ? 'text-[#A06C22] font-bold' : 'text-[#7A786C]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="text-[10px]">รางวัล</span>
          </button>
        </div>
      </div>
    </header>
  );
};
