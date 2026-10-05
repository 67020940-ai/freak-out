import React from 'react';
import { AppTab } from './Header';
import { CheckSquare, Calendar, Brain, Smile, Trophy } from 'lucide-react';

interface MobileBottomTabBarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onTriggerSmartPick: () => void;
}

export const MobileBottomTabBar: React.FC<MobileBottomTabBarProps> = ({
  currentTab,
  onTabChange,
  onTriggerSmartPick,
}) => {
  return (
    <nav className="w-full shrink-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-lg border-t border-[#EAE4D9] pb-safe pt-1.5 px-3 select-none mt-auto">
      <div className="flex items-center justify-around max-w-lg mx-auto relative">
        {/* Tab 1: Tasks */}
        <button
          onClick={() => onTabChange('tasks')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
            currentTab === 'tasks'
              ? 'text-[#485342] font-bold'
              : 'text-[#8A887A] hover:text-[#2C2C24]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentTab === 'tasks' ? 'bg-[#EBF0E8] scale-105' : ''}`}>
            <CheckSquare className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">งานวันนี้</span>
        </button>

        {/* Tab 2: Calendar */}
        <button
          onClick={() => onTabChange('calendar')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
            currentTab === 'calendar'
              ? 'text-[#485342] font-bold'
              : 'text-[#8A887A] hover:text-[#2C2C24]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentTab === 'calendar' ? 'bg-[#EBF0E8] scale-105' : ''}`}>
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">ตารางเวลา</span>
        </button>

        {/* Tab 3: Smart Pick (Center Hero Action Button) */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-5 relative">
          <button
            onClick={() => {
              onTabChange('smart-pick');
              onTriggerSmartPick();
            }}
            className="w-13 h-13 rounded-full bg-[#6C7764] hover:bg-[#586350] active:scale-95 text-white flex items-center justify-center shadow-md shadow-[#6C7764]/30 border-3 border-[#FAF8F5] transition-transform cursor-pointer group"
            title="AI Smart Pick: ช่วยเลือก 1 งานทันที"
          >
            <Brain className="w-6 h-6 group-hover:rotate-6 transition-transform text-[#F9F7F2]" />
          </button>
          <span className="text-[10px] mt-1 font-bold text-[#6C7764] tracking-tight">
            Smart Pick
          </span>
        </div>

        {/* Tab 4: Cloud Pet */}
        <button
          onClick={() => onTabChange('cloud-pet')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
            currentTab === 'cloud-pet'
              ? 'text-[#485342] font-bold'
              : 'text-[#8A887A] hover:text-[#2C2C24]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentTab === 'cloud-pet' ? 'bg-[#EBF0E8] scale-105' : ''}`}>
            <Smile className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">นูเบ้</span>
        </button>

        {/* Tab 5: Gamification / Rewards */}
        <button
          onClick={() => onTabChange('gamification')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
            currentTab === 'gamification'
              ? 'text-[#485342] font-bold'
              : 'text-[#8A887A] hover:text-[#2C2C24]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentTab === 'gamification' ? 'bg-[#EBF0E8] scale-105' : ''}`}>
            <Trophy className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">รางวัล</span>
        </button>
      </div>

      {/* iOS Home Indicator Line */}
      <div className="w-32 h-1 bg-[#2C2C24]/15 rounded-full mx-auto mt-2 mb-1" />
    </nav>
  );
};
