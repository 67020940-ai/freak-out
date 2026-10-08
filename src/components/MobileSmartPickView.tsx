import React, { useState } from 'react';
import { Task, EnergyLevel } from '../types';
import { recommendBestTask } from '../utils/aiHelper';
import { MascotCloud } from './MascotCloud';
import {
  Brain,
  Clock,
  Play,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Plus,
  MessageCircle,
  HelpCircle,
  Send,
  Zap,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MobileSmartPickViewProps {
  tasks: Task[];
  energy?: EnergyLevel;
  onEnergyChange?: (energy: EnergyLevel) => void;
  onUpdateSteps?: (taskId: string, steps: import('../types').MicroStep[]) => void;
  onStartFocus: (task: Task) => void;
  onOpenNewTask: () => void;
}

type MentalStateOption = {
  id: string;
  label: string;
  sub: string;
  bias: 'easy' | 'urgent' | 'creative' | 'quick';
};

const MENTAL_STATE_OPTIONS: MentalStateOption[] = [
  { id: 'overwhelmed', label: 'สมองล้า / คิดวน', sub: 'ไม่อยากใช้พลังสมองเยอะ', bias: 'easy' },
  { id: 'deadline', label: 'กังวลเดดไลน์', sub: 'อยากเคลียร์สิ่งที่ค้างคาใจ', bias: 'urgent' },
  { id: 'lazy_start', label: 'ขี้เกียจเริ่ม / ผัดวัน', sub: 'ขอแค่งานจิ๋ว 5 นาทีให้เริ่มได้', bias: 'quick' },
  { id: 'clear_focus', label: 'พร้อมมีสมาธิ', sub: 'อยากลุยงานชิ้นสำคัญ', bias: 'creative' },
];

export const MobileSmartPickView: React.FC<MobileSmartPickViewProps> = ({
  tasks,
  energy = 'okay',
  onEnergyChange,
  onUpdateSteps,
  onStartFocus,
  onOpenNewTask,
}) => {
  const [mentalState, setMentalState] = useState<string>('overwhelmed');
  const [availableMinutes, setAvailableMinutes] = useState<number>(25);
  const [isThinking, setIsThinking] = useState(false);
  const [isDecomposing, setIsDecomposing] = useState(false);

  // Conversational Mind Offload State
  const [conversationStep, setConversationStep] = useState<1 | 2 | 3>(1);
  const [customWorryText, setCustomWorryText] = useState('');
  const [aiCustomAdvice, setAiCustomAdvice] = useState<string | null>(null);

  const pendingTasks = tasks.filter((t) => !t.completed);

  // Filter tasks bias based on selected mental state
  const selectedStateObj = MENTAL_STATE_OPTIONS.find((o) => o.id === mentalState) || MENTAL_STATE_OPTIONS[0];

  const effectiveEnergy: EnergyLevel =
    selectedStateObj.bias === 'easy' || selectedStateObj.bias === 'quick'
      ? 'depleted'
      : selectedStateObj.bias === 'urgent'
      ? 'ready'
      : 'full';

  const recommendation = recommendBestTask(tasks, effectiveEnergy, availableMinutes);

  const handleSelectMentalState = (stateId: string) => {
    setMentalState(stateId);
    setConversationStep(2);
    setIsThinking(true);
    setTimeout(() => setIsThinking(false), 300);
  };

  const handleSelectTime = (mins: number) => {
    setAvailableMinutes(mins);
    setConversationStep(3);
    setIsThinking(true);
    setTimeout(() => setIsThinking(false), 300);
  };

  const handleCustomWorrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWorryText.trim()) return;
    setIsThinking(true);
    setTimeout(() => {
      setAiCustomAdvice(`เข้าใจเลยนะที่รู้สึกว่า "${customWorryText}" ลองตัดความกังวลทิ้งไปก่อน แล้วหยิบ 1 งานนี้มาเริ่มเพียง 2 นาทีแรก`);
      setIsThinking(false);
      setConversationStep(3);
    }, 400);
  };

  const handleDecomposePickedTask = async () => {
    if (!recommendation || isDecomposing) return;
    setIsDecomposing(true);
    try {
      const { decomposeTaskWithAI } = await import('../utils/aiHelper');
      const { steps } = await decomposeTaskWithAI(recommendation.task.title, recommendation.task.category);
      onUpdateSteps?.(recommendation.task.id, steps);
    } finally {
      setIsDecomposing(false);
    }
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

  const handleResetFlow = () => {
    setConversationStep(1);
    setAiCustomAdvice(null);
    setCustomWorryText('');
  };

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* 1. Conversational Companion Header */}
      <div className="bg-[#FAF8F5] dark:bg-[#1A1A18] rounded-3xl p-5 border border-[#E8E2D5] dark:border-[#2C2C28] shadow-2xs space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <MascotCloud
            mood={conversationStep === 3 ? 'celebrate' : 'thinking'}
            size="sm"
            useArtwork={false}
          />
          <div className="flex-1">
            <span className="text-[10px] font-bold text-[#828D7A] dark:text-[#9BB391] uppercase tracking-wider block">
              Cognitive Companion
            </span>
            <h2 className="text-base font-bold font-heading text-[#2C2C24] dark:text-[#F0EEE6]">
              {conversationStep === 1
                ? 'ตอนนี้รู้สึกหนักหัวเรื่องอะไรเป็นพิเศษ?'
                : conversationStep === 2
                ? 'อยากให้เวลากับตัวเองกี่นาทีดี?'
                : 'คัดมาให้เหลือเพียง 1 งานแล้ว'}
            </h2>
          </div>

          {conversationStep > 1 && (
            <button
              onClick={handleResetFlow}
              className="p-1.5 rounded-xl hover:bg-[#EAE4D9] dark:hover:bg-[#2C2C28] text-[#8C8A7D] dark:text-[#A8A599] hover:text-[#2C2C24] dark:hover:text-white transition cursor-pointer"
              title="เริ่มคุยใหม่"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Interactive Step 1: Mind Offloader Question */}
        {conversationStep === 1 && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-2">
              {MENTAL_STATE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectMentalState(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    mentalState === opt.id
                      ? 'bg-white dark:bg-[#242422] border-[#6C7764] dark:border-[#9BB391] shadow-xs ring-2 ring-[#6C7764]/20'
                      : 'bg-white/80 dark:bg-[#20201E] border-[#E8E2D5] dark:border-[#333330] hover:bg-white dark:hover:bg-[#282824] hover:border-[#D5CDC0]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#2C2C24] dark:text-[#F0EEE6] block leading-snug">
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-[#7A786C] dark:text-[#A8A599] block mt-0.5 leading-tight">
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>

            {/* Optional write-in box to vent thoughts */}
            <form onSubmit={handleCustomWorrySubmit} className="pt-1 flex items-center gap-2">
              <input
                type="text"
                value={customWorryText}
                onChange={(e) => setCustomWorryText(e.target.value)}
                placeholder="หรือพิมพ์ระบายสั้นๆ เช่น กลัวงานออกมาไม่ดี..."
                className="flex-1 px-3 py-2 rounded-xl border border-[#E2DACB] dark:border-[#383834] bg-white dark:bg-[#242422] text-xs text-[#2C2C24] dark:text-white outline-none placeholder:text-[#9A988D] dark:placeholder:text-[#666660] focus:border-[#6C7764]"
              />
              <button
                type="submit"
                disabled={!customWorryText.trim()}
                className="p-2 rounded-xl bg-[#6C7764] hover:bg-[#586350] text-white disabled:opacity-40 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Interactive Step 2: Time Duration Selection */}
        {conversationStep === 2 && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-200">
            <p className="text-xs text-[#7A786C] dark:text-[#A8A599]">
              ไม่ต้องเยอะ แค่เริ่มสั้นๆ ไม่กดดันตัวเอง:
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleSelectTime(mins)}
                  className={`p-2.5 rounded-2xl border text-center transition cursor-pointer ${
                    availableMinutes === mins
                      ? 'bg-[#6C7764] text-white border-[#6C7764] font-bold shadow-xs'
                      : 'bg-white dark:bg-[#20201E] border-[#E8E2D5] dark:border-[#333330] text-[#2C2C24] dark:text-[#F0EEE6] hover:bg-[#FAF8F5] dark:hover:bg-[#282824]'
                  }`}
                >
                  <span className="text-xs font-bold block">{mins} นาที</span>
                  <span className={`text-[9px] block mt-0.5 ${availableMinutes === mins ? 'text-white/80' : 'text-[#8A887A] dark:text-[#A09D90]'}`}>
                    {mins === 15 ? 'ก้าวสั้นๆ' : mins === 25 ? '1 รอบ' : 'เน้นๆ'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step Indicator Progress Bar */}
        <div className="flex items-center gap-1.5 pt-1">
          <div className={`h-1 flex-1 rounded-full transition-colors ${conversationStep >= 1 ? 'bg-[#6C7764]' : 'bg-[#EAE4D9] dark:bg-[#333330]'}`} />
          <div className={`h-1 flex-1 rounded-full transition-colors ${conversationStep >= 2 ? 'bg-[#6C7764]' : 'bg-[#EAE4D9] dark:bg-[#333330]'}`} />
          <div className={`h-1 flex-1 rounded-full transition-colors ${conversationStep >= 3 ? 'bg-[#6C7764]' : 'bg-[#EAE4D9] dark:bg-[#333330]'}`} />
        </div>
      </div>

      {/* AI Advice Bubble if user typed a custom worry */}
      {aiCustomAdvice && (
        <div className="p-3.5 rounded-2xl bg-[#F4EFE6] dark:bg-[#22201C] border border-[#E5DEC9] dark:border-[#3A362E] text-xs text-[#5C5B50] dark:text-[#D5D3CB] flex items-start gap-2.5 animate-in fade-in">
          <MessageCircle className="w-4 h-4 text-[#828D7A] dark:text-[#9BB391] shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[#2C2C24] dark:text-[#F0EEE6] font-medium">
            {aiCustomAdvice}
          </p>
        </div>
      )}

      {/* 2. The Single Chosen Task Card (Breathing Room & Tactile Focus) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6C7764] dark:text-[#9BB391]">
            งานเดียวที่คุณต้องโฟกัสตอนนี้
          </span>
          {pendingTasks.length > 1 && (
            <span className="text-[11px] text-[#8A887A] dark:text-[#A09D90]">
              (คัดจากทั้งหมด {pendingTasks.length} งาน)
            </span>
          )}
        </div>

        {recommendation ? (
          <div className={`bg-[#FAF8F5] dark:bg-[#1A1A18] rounded-3xl p-5 border-2 border-[#828D7A] dark:border-[#9BB391] shadow-md space-y-4 transition-opacity ${isThinking ? 'opacity-50' : 'opacity-100'}`}>
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF0E8] dark:bg-[#1E281C] text-[#3B5433] dark:text-[#88B580] border border-[#CFDFCB] dark:border-[#2C4229]">
                  คัดเลือกตามสภาพใจ: {selectedStateObj.label}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white dark:bg-[#242422] text-[#7A786C] dark:text-[#A8A599] border border-[#E8E2D5] dark:border-[#383834]">
                  {recommendation.task.estimatedMinutes} นาที
                </span>
                {recommendation.task.isOverthinkingProne && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDECE8] dark:bg-[#381C16] text-[#9A4A38] dark:text-[#F28472] border border-[#F6D7D0] dark:border-[#542820]">
                    งานเริ่มยาก
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold font-heading text-[#2C2C24] dark:text-[#F0EEE6] leading-snug">
                {recommendation.task.title}
              </h3>
              {recommendation.task.description && (
                <p className="text-xs text-[#7A786C] dark:text-[#A8A599] mt-1.5 leading-relaxed">
                  {recommendation.task.description}
                </p>
              )}
            </div>

            {/* AI Rationale Box */}
            <div className="p-3.5 rounded-2xl bg-[#F4EFE6] dark:bg-[#22201C] border border-[#E5DEC9] dark:border-[#3A362E] text-xs text-[#5C5B50] dark:text-[#D5D3CB]">
              <p className="leading-relaxed">
                <strong className="text-[#2C2C24] dark:text-[#F0EEE6]">เหตุผลที่แนะนำ:</strong> {recommendation.reasonTh}
              </p>
            </div>

            {/* Micro Steps Preview or AI Decompose CTA */}
            {recommendation.task.microSteps && recommendation.task.microSteps.length > 0 ? (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7A786C] dark:text-[#A8A599]">
                    ก้าวเล็กๆ 2 นาทีแรก:
                  </span>
                  <button
                    type="button"
                    onClick={handleDecomposePickedTask}
                    disabled={isDecomposing}
                    className="text-[11px] text-[#55634E] dark:text-[#9BB391] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isDecomposing ? 'animate-spin' : ''}`} />
                    <span>{isDecomposing ? 'กำลังย่อยใหม่...' : 'ย่อยใหม่ด้วย AI'}</span>
                  </button>
                </div>
                <div className="space-y-1.5">
                  {recommendation.task.microSteps.slice(0, 3).map((step, idx) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-[#242422] border border-[#EAE4D9] dark:border-[#383834] text-xs text-[#2C2C24] dark:text-[#F0EEE6]"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#EBF0E8] dark:bg-[#1E281C] text-[#3B5433] dark:text-[#88B580] text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1 truncate">{step.title}</span>
                      <span className="text-[10px] text-[#8A887A] dark:text-[#A09D90]">{step.estimatedMinutes}น.</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleDecomposePickedTask}
                  disabled={isDecomposing}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#EFE9DE] dark:bg-[#242422] hover:bg-[#E5DDD0] dark:hover:bg-[#2C2C28] text-[#55634E] dark:text-[#9BB391] text-xs font-semibold border border-[#E2DACB] dark:border-[#383834] flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-[#6C7764] dark:text-[#9BB391] ${isDecomposing ? 'animate-spin' : ''}`} />
                  <span>{isDecomposing ? 'กำลังให้ AI ย่อยก้าวแรก 2 นาที...' : 'ให้ AI ช่วยย่อยก้าวแรก (ลดการคิดเยอะ)'}</span>
                </button>
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
          <div className="p-8 rounded-3xl bg-[#FAF8F5] dark:bg-[#1A1A18] border border-[#E8E2D5] dark:border-[#2C2C28] text-center space-y-3">
            <h3 className="font-heading font-bold text-base text-[#2C2C24] dark:text-[#F0EEE6]">
              ไม่มีงานค้างอยู่ในรายการเลย
            </h3>
            <p className="text-xs text-[#7A786C] dark:text-[#A8A599] max-w-xs mx-auto">
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

      {/* 3. Hallmark Gentle Tip Card */}
      <div className="bg-[#EFE9DE]/80 dark:bg-[#242422]/80 rounded-2xl p-4 border border-[#E2DACB] dark:border-[#383834] text-xs space-y-1.5">
        <div className="font-bold text-[#2C2C24] dark:text-[#F0EEE6]">
          กฎ 2 นาทีสยบ Overthinking:
        </div>
        <p className="text-[#6E6D62] dark:text-[#A8A599] text-[11px] leading-relaxed">
          อย่าเพิ่งคิดถึงผลลัพธ์ปลายทาง แค่เปิดไฟล์หรือหยิบสมุดขึ้นมาใน 2 นาทีแรก สมองจะสลับจากโหมดกังวลเป็นโหมดลงมือทำโดยอัตโนมัติ
        </p>
      </div>
    </div>
  );
};
