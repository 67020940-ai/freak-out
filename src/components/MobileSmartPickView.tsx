import React, { useState } from 'react';
import { Task, EnergyLevel } from '../types';
import { recommendBestTask } from '../utils/aiHelper';
import { MascotCloud } from './MascotCloud';
import {
  Brain,
  Clock,
  Zap,
  BatteryMedium,
  BatteryLow,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MobileSmartPickViewProps {
  tasks: Task[];
  onStartFocus: (task: Task) => void;
  onOpenNewTask: () => void;
}

export const MobileSmartPickView: React.FC<MobileSmartPickViewProps> = ({
  tasks,
  onStartFocus,
  onOpenNewTask,
}) => {
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>('okay');
  const [availableMinutes, setAvailableMinutes] = useState<number>(25);
  const [isThinking, setIsThinking] = useState(false);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const recommendation = recommendBestTask(tasks, selectedEnergy, availableMinutes);

  const handleEnergyChange = (energy: EnergyLevel) => {
    setSelectedEnergy(energy);
    setIsThinking(true);
    setTimeout(() => setIsThinking(false), 250);
  };

  const handleTimeChange = (time: number) => {
    setAvailableMinutes(time);
    setIsThinking(true);
    setTimeout(() => setIsThinking(false), 250);
  };

  const handleStartTask = (task: Task) => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#828D7A', '#B88E76', '#EFE9DE'],
    });
    onStartFocus(task);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Hero Mascot Header */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] shadow-2xs text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-3">
          <MascotCloud
            mood="thinking"
            size="md"
            useArtwork={true}
            bubbleText="เหนื่อยมั้ย? ส่งงานมาให้เค้าช่วยคัด 1 งานนะ"
          />
        </div>
        <h2 className="text-lg font-bold font-heading text-[#2C2C24] mt-2">
          AI Smart Pick
        </h2>
        <p className="text-xs text-[#7A786C] max-w-xs mx-auto mt-0.5">
          ลดอาการคิดเยอะ (Analysis Paralysis) โดยเลือกให้เหลือเพียง 1 งานที่เหมาะที่สุด
        </p>
      </div>

      {/* Energy Level Selector (5 Levels matching Screenshot 2) */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider">
            1. ระดับพลังงานของคุณตอนนี้
          </label>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { id: 'depleted' as EnergyLevel, name: '1. หมดแรง', emoji: '🪫', desc: '5-10น.' },
            { id: 'tired' as EnergyLevel, name: '2. ล้า ๆ', emoji: '🥱', desc: 'งานเบา' },
            { id: 'okay' as EnergyLevel, name: '3. พอไหว', emoji: '🌿', desc: 'ขนาดกลาง' },
            { id: 'ready' as EnergyLevel, name: '4. พร้อมลุย', emoji: '⚡', desc: 'โฟกัสดี' },
            { id: 'full' as EnergyLevel, name: '5. พลังเต็ม!', emoji: '🔥', desc: 'จัดเต็ม' },
          ].map((item) => {
            const isSelected = selectedEnergy === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleEnergyChange(item.id)}
                className={`p-2 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#6C7764] text-white border-[#6C7764] shadow-xs font-bold ring-2 ring-[#6C7764]/20 scale-102'
                    : 'bg-white border-[#E8E2D5] text-[#7A786C] hover:bg-[#FAF8F5]'
                }`}
              >
                <span className="text-base mb-0.5">{item.emoji}</span>
                <span className="text-[10px] whitespace-nowrap leading-tight">{item.name}</span>
                <span className={`text-[8px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#8A887A]'}`}>
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Time Selector */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] shadow-2xs space-y-2.5">
        <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider">
          2. มีเวลาว่างตอนนี้กี่นาที?
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => handleTimeChange(mins)}
              className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                availableMinutes === mins
                  ? 'bg-[#6C7764] text-white border-[#6C7764] shadow-xs'
                  : 'bg-white border-[#E8E2D5] text-[#7A786C] hover:bg-[#F3EFE6]'
              }`}
            >
              ⏱️ {mins} นาที
            </button>
          ))}
        </div>
      </div>

      {/* The Single Chosen Task Card (Zero Toxic Overwhelm) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6C7764]">
            ✨ งานเดียวที่คุณต้องโฟกัสตอนนี้
          </span>
          {pendingTasks.length > 1 && (
            <span className="text-[11px] text-[#8A887A]">
              (คัดจากทั้งหมด {pendingTasks.length} งาน)
            </span>
          )}
        </div>

        {recommendation ? (
          <div className={`bg-[#FAF8F5] rounded-3xl p-5 border-2 border-[#828D7A] shadow-md space-y-4 transition-opacity ${isThinking ? 'opacity-50' : 'opacity-100'}`}>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF0E8] text-[#3B5433] border border-[#CFDFCB]">
                  💡 เหมาะกับพลังงานของคุณ
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white text-[#7A786C] border border-[#E8E2D5]">
                  ⏱️ {recommendation.task.estimatedMinutes} นาที
                </span>
                {recommendation.task.isOverthinkingProne && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDECE8] text-[#9A4A38] border border-[#F6D7D0]">
                    🧠 งานคิดวน
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold font-heading text-[#2C2C24] leading-snug">
                {recommendation.task.title}
              </h3>
              {recommendation.task.description && (
                <p className="text-xs text-[#7A786C] mt-1 leading-relaxed">
                  {recommendation.task.description}
                </p>
              )}
            </div>

            {/* AI Rationale Box */}
            <div className="p-3 rounded-2xl bg-[#F4EFE6] border border-[#E5DEC9] text-xs text-[#5C5B50] flex items-start gap-2">
              <span className="text-sm">🎯</span>
              <p className="leading-relaxed">
                <strong className="text-[#2C2C24]">เหตุผลที่แนะนำ:</strong> {recommendation.reasonTh}
              </p>
            </div>

            {/* Micro Steps Preview */}
            {recommendation.task.microSteps && recommendation.task.microSteps.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-[#7A786C] block">
                  ก้าวเล็กๆ 2 นาทีแรก:
                </span>
                <div className="space-y-1">
                  {recommendation.task.microSteps.slice(0, 3).map((step, idx) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#EAE4D9] text-xs text-[#2C2C24]"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#EBF0E8] text-[#3B5433] text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1 truncate">{step.title}</span>
                      <span className="text-[10px] text-[#8A887A]">{step.estimatedMinutes}น.</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Start Focus Button */}
            <button
              type="button"
              onClick={() => handleStartTask(recommendation.task)}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#6C7764] hover:bg-[#586350] active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>เริ่มทำทันที (เปิดโหมดโฟกัส)</span>
            </button>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#E8E2D5] text-center space-y-3">
            <span className="text-3xl">🎉</span>
            <h3 className="font-heading font-bold text-base text-[#2C2C24]">
              ไม่มีงานค้างอยู่ในรายการเลย!
            </h3>
            <p className="text-xs text-[#7A786C] max-w-xs mx-auto">
              คุณเคลียร์งานหมดแล้ว หรือระบายความคิดใหม่ๆ เข้ามาในแอปได้เลย
            </p>
            <button
              onClick={onOpenNewTask}
              className="px-4 py-2 rounded-xl bg-[#6C7764] text-white text-xs font-bold active:scale-95 transition cursor-pointer"
            >
              + จดงานใหม่
            </button>
          </div>
        )}
      </div>

      {/* Quick 2-Minute Anti-Overthinking Rule Card */}
      <div className="bg-[#EFE9DE]/80 rounded-2xl p-3.5 border border-[#E2DACB] text-xs space-y-1.5">
        <div className="font-bold text-[#2C2C24] flex items-center gap-1.5">
          <span>💡</span> กฎ 2 นาทีสยบ Overthinking:
        </div>
        <p className="text-[#6E6D62] text-[11px] leading-relaxed">
          อย่าเพิ่งคิดถึงปลายทาง แค่เปิดไฟล์หรือหยิบปากกาขึ้นมาใน 2 นาทีแรก สมองจะสลับจากโหมดกังวลเป็นโหมดลงมือทำโดยอัตโนมัติ
        </p>
      </div>
    </div>
  );
};
