import React, { useState } from 'react';
import { Task, EnergyLevel } from '../types';
import { Sparkles, Brain, Clock, Zap, BatteryMedium, BatteryLow, Play, RefreshCw, X, ArrowRight, CheckCircle } from 'lucide-react';
import { MascotCloud } from './MascotCloud';
import { recommendBestTask } from '../utils/aiHelper';

interface SmartPickModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onStartFocus: (task: Task) => void;
  onOpenNewTask: () => void;
}

export const SmartPickModal: React.FC<SmartPickModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onStartFocus,
  onOpenNewTask,
}) => {
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>('medium');
  const [availableMinutes, setAvailableMinutes] = useState<number>(25);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<{ task: Task; reasonTh: string } | null>(() =>
    recommendBestTask(tasks, 'medium', 25)
  );

  if (!isOpen) return null;

  const handleRecalculate = (energy = selectedEnergy, time = availableMinutes) => {
    setIsCalculating(true);
    setTimeout(() => {
      const rec = recommendBestTask(tasks, energy, time);
      setRecommendation(rec);
      setIsCalculating(false);
    }, 350);
  };

  const handleEnergySelect = (energy: EnergyLevel) => {
    setSelectedEnergy(energy);
    handleRecalculate(energy, availableMinutes);
  };

  const handleTimeSelect = (time: number) => {
    setAvailableMinutes(time);
    handleRecalculate(selectedEnergy, time);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-t-[36px] w-full max-h-[94%] overflow-y-auto shadow-2xl border-t border-[#E8E2D5] p-5 relative animate-in slide-in-from-bottom duration-300 no-scrollbar">
        {/* iOS Drag Handle */}
        <div className="w-10 h-1 bg-[#2C2C24]/20 rounded-full mx-auto mb-3 shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#8A8A7A] hover:text-[#2C2C24] hover:bg-[#EFE9DE] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EFE9DE] text-[#55634E] text-[11px] font-bold mb-2 border border-[#E2DACB]">
            <Brain className="w-3 h-3 text-[#828D7A]" />
            <span>Anti-Overthinking Engine</span>
          </div>
          <h2 className="text-lg font-bold font-heading text-[#2C2C24]">
            ช่วยเลือกสิ่งที่ควรทำตอนนี้ 🎯
          </h2>
          <p className="text-xs text-[#6E6E60] max-w-xs mx-auto mt-1">
            หยุดคิดวน แล้วเลือกระดับพลังงานและเวลาที่มี เราจะเลือก 1 งานที่ดีที่สุดให้คุณ
          </p>
        </div>

        {/* Step 1: Select Energy Level */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider mb-2">
              1. ตอนนี้คุณมีระดับพลังงานแค่ไหน?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleEnergySelect('low')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  selectedEnergy === 'low'
                    ? 'bg-[#EBF0E8] border-[#828D7A] ring-2 ring-[#828D7A]/30 font-bold shadow-2xs'
                    : 'bg-[#F9F7F2] border-[#E2DACB] hover:bg-[#EFE9DE]'
                }`}
              >
                <div className="text-lg">🪫</div>
                <div className="text-xs font-bold text-[#485942] mt-1">Low Energy</div>
                <div className="text-[10px] text-[#6E6E60]">หมดแรง / ชิลๆ</div>
              </button>

              <button
                type="button"
                onClick={() => handleEnergySelect('medium')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  selectedEnergy === 'medium'
                    ? 'bg-[#F6EFEA] border-[#B88E76] ring-2 ring-[#B88E76]/30 font-bold shadow-2xs'
                    : 'bg-[#F9F7F2] border-[#E2DACB] hover:bg-[#EFE9DE]'
                }`}
              >
                <div className="text-lg">🔋</div>
                <div className="text-xs font-bold text-[#8C6048] mt-1">Mid Energy</div>
                <div className="text-[10px] text-[#6E6E60]">พร้อมทำงานทั่วไป</div>
              </button>

              <button
                type="button"
                onClick={() => handleEnergySelect('high')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  selectedEnergy === 'high'
                    ? 'bg-[#F5ECE5] border-[#9A6246] ring-2 ring-[#9A6246]/30 font-bold shadow-2xs'
                    : 'bg-[#F9F7F2] border-[#E2DACB] hover:bg-[#EFE9DE]'
                }`}
              >
                <div className="text-lg">⚡</div>
                <div className="text-xs font-bold text-[#9A6246] mt-1">High Energy</div>
                <div className="text-[10px] text-[#6E6E60]">ไฟแรง สมาธิเต็มร้อย</div>
              </button>
            </div>
          </div>

          {/* Step 2: Available Time */}
          <div>
            <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider mb-2">
              2. คุณมีเวลาว่างประมาณกี่นาที?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { time: 10, label: '10 นาที' },
                { time: 25, label: '25 นาที' },
                { time: 45, label: '45 นาที' },
                { time: 60, label: '60+ นาที' },
              ].map((item) => (
                <button
                  key={item.time}
                  type="button"
                  onClick={() => handleTimeSelect(item.time)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    availableMinutes === item.time
                      ? 'bg-[#828D7A] border-[#828D7A] text-white shadow-xs'
                      : 'bg-[#F9F7F2] border-[#E2DACB] text-[#6E6E60] hover:bg-[#EFE9DE]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation Result Display */}
          <div className="pt-2">
            {isCalculating ? (
              <div className="bg-[#EFE9DE]/60 rounded-3xl p-8 text-center border border-[#E2DACB] animate-pulse">
                <MascotCloud size="sm" mood="thinking" />
                <p className="text-xs font-bold text-[#55634E] mt-2">
                  กำลังคำนวณงานที่เหมาะกับพลังงานของคุณ...
                </p>
              </div>
            ) : recommendation ? (
              <div className="bg-gradient-to-br from-[#EFE9DE] via-[#F6EFEA] to-[#EBF0E8] rounded-3xl p-5 border-2 border-[#828D7A] shadow-md relative overflow-hidden">
                {/* Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#828D7A] text-white text-xs font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>งานที่ควรทำที่สุดตอนนี้ ✨</span>
                  </span>

                  <button
                    onClick={() => handleRecalculate()}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#828D7A] hover:text-[#55634E] transition cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>สุ่มใหม่</span>
                  </button>
                </div>

                {/* Task Card Info */}
                <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E2DACB] shadow-2xs mb-3">
                  <h3 className="text-base sm:text-lg font-bold text-[#2C2C24]">
                    {recommendation.task.title}
                  </h3>
                  {recommendation.task.description && (
                    <p className="text-xs text-[#6E6E60] mt-1">
                      {recommendation.task.description}
                    </p>
                  )}

                  {/* Micro steps preview */}
                  {recommendation.task.microSteps.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-[#E2DACB] space-y-1">
                      <div className="text-[11px] font-bold text-[#55634E]">
                        ก้าวแรกที่ทำได้ทันที:
                      </div>
                      <div className="text-xs text-[#2C2C24] font-medium flex items-center gap-1.5 bg-[#EFE9DE]/70 p-1.5 rounded-lg">
                        <ArrowRight className="w-3.5 h-3.5 text-[#828D7A] shrink-0" />
                        <span>1. {recommendation.task.microSteps[0].title}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reason Explanation */}
                <div className="flex items-start gap-2.5 bg-[#FAF3E5] p-3 rounded-2xl text-xs text-[#8C6D37] border border-[#EDE0C4] mb-4">
                  <Brain className="w-4 h-4 text-[#8C6D37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">ทำไมถึงเลือกงานนี้: </span>
                    <span>{recommendation.reasonTh}</span>
                  </div>
                </div>

                {/* Start Focus CTA */}
                <button
                  onClick={() => {
                    onClose();
                    onStartFocus(recommendation.task);
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-[#828D7A] hover:bg-[#6C7764] text-white font-bold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>ลุยเลย! เริ่มต้นก้าวแรกใน Focus Mode 🚀</span>
                </button>
              </div>
            ) : (
              <div className="bg-[#FAF8F5] rounded-2xl p-6 text-center border border-[#E2DACB] space-y-3">
                <p className="text-xs text-[#6E6E60] font-medium">
                  ไม่มีงานค้างอยู่ในระบบ หรือทุกงานทำเสร็จหมดแล้ว!
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenNewTask();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#828D7A] text-white text-xs font-bold cursor-pointer"
                >
                  + เพิ่มงานเข้ามาก่อน
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
