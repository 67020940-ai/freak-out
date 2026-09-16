import React, { useState, useRef, useEffect } from 'react';
import { UserStats } from '../types';
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
} from 'lucide-react';
import { MascotCloud } from './MascotCloud';

interface HeaderProps {
  stats: UserStats;
  currentTab: 'tasks' | 'smart-pick' | 'gamification';
  onTabChange: (tab: 'tasks' | 'smart-pick' | 'gamification') => void;
  onOpenNewTask: () => void;
  onOpenSmartPick: () => void;
  onOpenPanic: () => void;
  onOpenPricing: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  currentTab,
  onTabChange,
  onOpenNewTask,
  onOpenSmartPick,
  onOpenPanic,
  onOpenPricing,
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => onTabChange('tasks')}
          >
            <div className="w-10 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MascotCloud size="sm" mood="happy" withSparkles={false} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#2C2C24]">
                  freak out
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAE8F5] text-[#5C4D82] border border-[#DDD5EF]">
                  calm & focus
                </span>
              </div>
              <p className="text-[10px] text-[#7A786C] font-medium hidden sm:block">
                แอปช่วยจัดการงานและลดการคิดเยอะ ✨
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs - Clean & Minimalist */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#F0EBE1] p-1 rounded-2xl border border-[#E2DACB]">
            <button
              onClick={() => onTabChange('tasks')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                currentTab === 'tasks'
                  ? 'bg-white text-[#2C2C24] shadow-xs'
                  : 'text-[#6E6E60] hover:text-[#2C2C24] hover:bg-white/50'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#5F7554]" />
              <span>งานของฉัน</span>
            </button>

            <button
              onClick={() => onTabChange('smart-pick')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                currentTab === 'gamification'
                  ? 'bg-white text-[#2C2C24] shadow-xs'
                  : 'text-[#6E6E60] hover:text-[#2C2C24] hover:bg-white/50'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#B07248]" />
              <span>ความสำเร็จ & รางวัล</span>
            </button>
          </nav>

          {/* Right Actions: Clean Minimalist Buttons */}
          <div className="flex items-center gap-2">
            {/* Streak Counter - Compact & Sweet */}
            <div
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FDECE8] text-[#9A4A38] text-xs font-bold border border-[#F6D7D0] shadow-2xs"
              title={`รักษาความสม่ำเสมอ ${stats.streakDays} วันติด!`}
            >
              <Flame className="w-3.5 h-3.5 fill-[#BC5E48] text-[#BC5E48]" />
              <span>{stats.streakDays} วัน</span>
            </div>

            {/* Primary Action Button: Add Task */}
            <button
              onClick={onOpenNewTask}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#E2ECE0] hover:bg-[#D5E5D1] text-[#3B5433] font-bold text-xs sm:text-sm border border-[#CFDFCB] shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มงาน</span>
            </button>

            {/* Unified Tools & More Dropdown Button ("รวมเป็นปุ่มเดียว") */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#F0EBE1] hover:bg-[#E5DFD3] text-[#4A4A3E] font-semibold text-xs sm:text-sm border border-[#E2DACB] transition cursor-pointer shadow-2xs"
                aria-expanded={isToolsOpen}
                title="เมนูเครื่องมือและฟังก์ชันทั้งหมด"
              >
                <Sparkles className="w-4 h-4 text-[#8A56AC]" />
                <span className="hidden sm:inline">เครื่องมือ</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isToolsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Pastel Dropdown Menu */}
              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#FAF8F5] rounded-3xl shadow-xl border border-[#E2DACB] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[#EAE4D9] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#7A786C] uppercase tracking-wider">
                      ✨ เครื่องมือช่วยลดคิดเยอะ
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
                        <div className="text-xs font-bold text-[#2C2C24] flex items-center gap-1.5">
                          <span>AI ช่วยเลือกงาน (Smart Pick)</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#FDECE8] text-[#9A4A38] text-[9px] font-bold">ฮิต</span>
                        </div>
                        <p className="text-[10px] text-[#7A786C]">
                          แมตช์ 1 งานที่ควรทำตามแรงและเวลาที่มี
                        </p>
                      </div>
                    </button>

                    {/* Item 2: Panic Calm SOS */}
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
                        <div className="text-xs font-bold text-[#2C2C24]">
                          SOS ผ่อนคลาย & ฝึกหายใจ 4-7-8
                        </div>
                        <p className="text-[10px] text-[#7A786C]">
                          เวลาเครียดหรือคิดวน ให้พักเคลียร์สมอง 1 นาที
                        </p>
                      </div>
                    </button>

                    {/* Item 3: Gamification & Badges */}
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onTabChange('gamification');
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#FFF4E0] text-left transition cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#FFF4E0] group-hover:bg-white flex items-center justify-center shrink-0 border border-[#F4E1BD]">
                        <Award className="w-4 h-4 text-[#A06C22]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#2C2C24]">
                          ความสำเร็จ & เหรียญรางวัล (Badges)
                        </div>
                        <p className="text-[10px] text-[#7A786C]">
                          ดูเลเวล, สถิติโฟกัส, และสะสม XP
                        </p>
                      </div>
                    </button>

                    {/* Item 4: Premium Plan */}
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
                          <span>Student & Pro (Freemium)</span>
                          <span className="px-1 py-0.2 rounded bg-[#EAE8F5] text-[#5C4D82] text-[9px] font-bold">฿49</span>
                        </div>
                        <p className="text-[10px] text-[#7A786C]">
                          ปลดล็อก AI วิเคราะห์เชิงลึกและสกินพิเศษ
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
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#EAE4D9] text-xs">
          <button
            onClick={() => onTabChange('tasks')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition ${
              currentTab === 'tasks' ? 'text-[#3B5433] font-bold' : 'text-[#7A786C]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span className="text-[10px]">งานของฉัน</span>
          </button>

          <button
            onClick={() => onTabChange('smart-pick')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition ${
              currentTab === 'smart-pick' ? 'text-[#7C5CA5] font-bold' : 'text-[#7A786C]'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span className="text-[10px]">Smart Pick</span>
          </button>

          <button
            onClick={() => onTabChange('gamification')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition ${
              currentTab === 'gamification' ? 'text-[#A06C22] font-bold' : 'text-[#7A786C]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="text-[10px]">เหรียญ</span>
          </button>
        </div>
      </div>
    </header>
  );
};

