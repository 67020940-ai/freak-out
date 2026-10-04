import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Gift,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Lock,
  Flame,
  Star,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  onClaimReward: (reward: { stardust: number; xp: number; freezes?: number }) => void;
}

const REWARDS = [
  { day: 1, title: '50 ดาว', icon: '🪙', desc: 'ละอองดาวสะสม', stardust: 50, xp: 20, status: 'claimed' },
  { day: 2, title: '100 ดาว', icon: '🪙', desc: 'ละอองดาวสะสม', stardust: 100, xp: 30, status: 'claimed' },
  { day: 3, title: 'หยดน้ำสดชื่น', icon: '💧', desc: 'อาหารน้องเมฆ', stardust: 80, xp: 40, status: 'claimed' },
  { day: 4, title: 'เสียงฝน Lofi', icon: '🎧', desc: 'เสียงโฟกัส', stardust: 100, xp: 50, status: 'claimed' },
  { day: 5, title: '200 ดาว + XP', icon: '⭐', desc: 'รางวัลวันนี้!', stardust: 200, xp: 80, status: 'today' },
  { day: 6, title: 'Streak Freeze', icon: '🛡️', desc: 'แช่แข็งสตรีค 1 วัน', stardust: 100, xp: 50, freezes: 1, status: 'locked' },
  { day: 7, title: 'กล่องสุ่มคอสตูม', icon: '🎁', desc: 'สกินพิเศษน้องเมฆ', stardust: 300, xp: 150, status: 'locked' },
];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
  streakDays,
  onClaimReward,
}) => {
  const [claimedToday, setClaimedToday] = useState(false);

  if (!isOpen) return null;

  const handleClaim = () => {
    setClaimedToday(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FFE17D', '#FFB480', '#A3E4D7', '#F1948A'],
    });
    onClaimReward({ stardust: 200, xp: 80 });
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-t-[36px] w-full max-h-[94%] overflow-y-auto border-t border-[#E8E2D5] shadow-2xl p-5 relative animate-in slide-in-from-bottom duration-300 no-scrollbar">
        {/* iOS Pull Handle */}
        <div className="w-10 h-1 bg-[#2C2C24]/20 rounded-full mx-auto mb-3 shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#7A786C] hover:text-[#2C2C24] hover:bg-[#EFE9DE] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF4E0] border border-[#F4E1BD] text-[#B87A24] text-[11px] font-bold mb-1">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>เช็คอินต่อเนื่อง {streakDays} วันแล้ว!</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-[#2C2C24]">
            ปฏิทินของขวัญรายวัน
          </h2>
          <p className="text-xs text-[#7A786C] max-w-xs mx-auto">
            เข้าแอพทุกวันเพื่อรับละอองดาว คอสตูม และน้ำยาป้องกันสตรีคหลุด 🛡️
          </p>
        </div>

        {/* 7-Day Rewards Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {REWARDS.map((r) => {
            const isToday = r.status === 'today' && !claimedToday;
            const isClaimed = r.status === 'claimed' || (r.status === 'today' && claimedToday);

            return (
              <div
                key={r.day}
                className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all ${
                  isToday
                    ? 'bg-linear-to-b from-[#FFF9E6] to-[#FFEFC2] border-[#C49B5C] shadow-md ring-2 ring-[#C49B5C]/30 scale-105'
                    : isClaimed
                    ? 'bg-[#E2ECE0]/60 border-[#CFDFCB] text-[#3B5433]'
                    : 'bg-white/80 border-[#EAE4D9] opacity-75'
                }`}
              >
                <span className="text-[10px] font-bold text-[#7A786C] uppercase mb-1">
                  วันที่ {r.day}
                </span>
                <div className="text-2xl my-1">{r.icon}</div>
                <span className="text-[11px] font-bold text-[#2C2C24] line-clamp-1">
                  {r.title}
                </span>

                <div className="mt-1.5">
                  {isClaimed ? (
                    <span className="inline-flex items-center text-[9px] font-bold text-[#3B5433] bg-[#D4E8D1] px-1.5 py-0.5 rounded-md">
                      <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> รับแล้ว
                    </span>
                  ) : isToday ? (
                    <span className="inline-flex items-center text-[9px] font-bold text-[#B87A24] bg-white px-1.5 py-0.5 rounded-md shadow-2xs">
                      วันนี้!
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[9px] text-[#8C8A7D]">
                      <Lock className="w-2.5 h-2.5 mr-0.5" /> ล็อค
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          {!claimedToday ? (
            <button
              onClick={handleClaim}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#828D7A] to-[#6C7764] hover:from-[#6C7764] hover:to-[#55634E] text-white font-bold text-sm shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <PartyPopper className="w-4 h-4" />
              <span>กดรับของขวัญวันนี้ (+200 ดาว, +80 XP)</span>
            </button>
          ) : (
            <div className="w-full py-3 rounded-2xl bg-[#E2ECE0] text-[#3B5433] font-bold text-sm text-center border border-[#CFDFCB] flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>คุณได้รับของขวัญของวันนี้เรียบร้อยแล้ว พรุ่งนี้มารับ Streak Freeze นะ!</span>
            </div>
          )}

          {/* Anti-Burnout Note */}
          <div className="p-3 bg-[#EFE9DE]/60 rounded-2xl border border-[#E2DACB] flex items-start gap-2.5 text-[11px] text-[#6E6E60]">
            <ShieldCheck className="w-4 h-4 text-[#828D7A] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#2C2C24]">กลไกบำบัดใจ (Anti-Burnout Rule): </span>
              Freak Out ไม่ลงโทษหากคุณลืมเข้าแอพ! เมื่อสะสมน้ำยา Streak Freeze ไว้ สตรีคของคุณจะไม่ถูกรีเซ็ตในวันที่เหนื่อยล้าหรือติดสอบ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
