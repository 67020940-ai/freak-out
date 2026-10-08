import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Smile, Heart, CheckCircle2, ChevronRight, PenLine } from 'lucide-react';
import { PixelCloud8Bit } from './PixelCloud8Bit';
import confetti from 'canvas-confetti';

interface MindfulJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutesFocused: number;
  tasksCompleted: number;
}

export const MindfulJournalModal: React.FC<MindfulJournalModalProps> = ({
  isOpen,
  onClose,
  minutesFocused,
  tasksCompleted,
}) => {
  const [journalNote, setJournalNote] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('happy');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#6C7764', '#9E745E', '#FAF8F5'],
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const emotions = [
    { id: 'happy', label: 'สดใส', pct: 48, color: '#D49E35', bg: 'bg-[#FFF9E6]' },
    { id: 'calm', label: 'สงบ', pct: 33, color: '#6C7764', bg: 'bg-[#EBF0E8]' },
    { id: 'tired', label: 'ล้า', pct: 27, color: '#9E745E', bg: 'bg-[#F6EFEA]' },
    { id: 'overthink', label: 'คิดวน', pct: 22, color: '#A06B9A', bg: 'bg-[#F5EEF6]' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-t-[36px] w-full max-h-[94%] overflow-y-auto shadow-2xl border-t border-[#E8E2D5] p-5 relative animate-in slide-in-from-bottom duration-300 no-scrollbar">
        {/* iOS Pull Handle */}
        <div className="w-10 h-1 bg-[#2C2C24]/20 rounded-full mx-auto mb-3 shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#8A8A7A] hover:text-[#2C2C24] hover:bg-[#EFE9DE] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF0E8] text-[#3B5433] text-[11px] font-bold mb-1.5 border border-[#CFDFCB]">
            <BookOpen className="w-3 h-3 text-[#6C7764]" />
            <span>สมุดบันทึกความรู้สึก & สมาธิ (My Journal)</span>
          </div>

          {/* Large Stat (Inspired by 420 stat in reference) */}
          <div className="mt-1">
            <h2 className="text-3xl font-extrabold font-heading text-[#2C2C24] tracking-tight">
              {minutesFocused || 120} <span className="text-base font-medium text-[#7A786C]">นาที</span>
            </h2>
            <p className="text-xs text-[#7A786C] mt-0.5">
              เวลาสมาธิสะสมทั้งหมด • เคลียร์สำเร็จ {tasksCompleted} งาน
            </p>
          </div>
        </div>

        {/* Emotion Vertical Capsule Bar Charts (Exact match to Instagram reference) */}
        <div className="bg-white rounded-3xl p-4 border border-[#E8E2D5] shadow-2xs space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider">
              สภาวะอารมณ์ในสัปดาห์นี้
            </span>
            <span className="text-[10px] text-[#7A786C]">
              4 แกนหลัก
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 pt-2">
            {emotions.map((em) => (
              <div
                key={em.id}
                onClick={() => setSelectedMood(em.id)}
                className={`flex flex-col items-center cursor-pointer transition p-1.5 rounded-2xl ${
                  selectedMood === em.id ? 'bg-[#F9F7F2] ring-2 ring-[#6C7764]/30' : ''
                }`}
              >
                {/* Capsule track */}
                <div className="w-full h-24 sm:h-28 bg-[#F0EBE1] rounded-full relative overflow-hidden flex flex-col justify-end p-1">
                  <div
                    className="w-full rounded-full transition-all duration-700 ease-out flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                    style={{
                      height: `${em.pct}%`,
                      backgroundColor: em.color,
                    }}
                  >
                    {em.pct}%
                  </div>
                </div>

                <span className="text-[11px] font-bold text-[#2C2C24] mt-2">
                  {em.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reflection Note Input */}
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#2C2C24] mb-1.5">
              ✍️ บันทึกความรู้สึกสั้นๆ วันนี้ (1-2 ประโยค)
            </label>
            <textarea
              rows={2}
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="วันนี้ภูมิใจที่ได้เริ่มก้าวแรก... สมองโล่งขึ้นมาก 🌸"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#E8E2D5] text-xs text-[#2C2C24] placeholder:text-[#8A8A7A] outline-none focus:border-[#6C7764] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#6C7764] hover:bg-[#586350] active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>บันทึกเรียบร้อยแล้ว ✨</span>
              </>
            ) : (
              <>
                <PenLine className="w-4 h-4" />
                <span>บันทึกลงสมุดประจำวัน (Save Journal)</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
