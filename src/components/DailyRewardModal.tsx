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
  { day: 1, title: '50 ดาว + XP', icon: '⭐', desc: 'รางวัลเริ่มต้น!', stardust: 50, xp: 20 },
  { day: 2, title: '100 ดาว', icon: '🪙', desc: 'ละอองดาวสะสม', stardust: 100, xp: 30 },
  { day: 3, title: 'หยดน้ำสดชื่น', icon: '💧', desc: 'อาหารน้องเมฆ', stardust: 80, xp: 40 },
  { day: 4, title: 'เสียงฝน Lofi', icon: '🎧', desc: 'เสียงโฟกัส', stardust: 100, xp: 50 },
  { day: 5, title: '200 ดาว + XP', icon: '✨', desc: 'รางวัลสตรีค!', stardust: 200, xp: 80 },
  { day: 6, title: 'Streak Freeze', icon: '🛡️', desc: 'แช่แข็งสตรีค 1 วัน', stardust: 100, xp: 50, freezes: 1 },
  { day: 7, title: 'กล่องสุ่มคอสตูม', icon: '🎁', desc: 'สกินพิเศษน้องเมฆ', stardust: 300, xp: 150 },
];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
  streakDays,
  onClaimReward,
}) => {
  const [claimedToday, setClaimedToday] = useState(() => {
    try {
      const todayIso = new Date().toISOString().slice(0, 10);
      return localStorage.getItem('freakout_daily_reward_claimed_date') === todayIso;
    } catch {
      return false;
    }
  });

  if (!isOpen) return null;

  // Day 1 to 7 cycle based on streak (starts at 1)
  const currentRewardDay = Math.min(7, Math.max(1, (streakDays % 7) || 1));
  const activeReward = REWARDS.find((r) => r.day === currentRewardDay) || REWARDS[0];

  const handleClaim = () => {
    setClaimedToday(true);
    const todayIso = new Date().toISOString().slice(0, 10);
    localStorage.setItem('freakout_daily_reward_claimed_date', todayIso);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FFE17D', '#FFB480', '#A3E4D7', '#F1948A'],
    });
    onClaimReward({
      stardust: activeReward.stardust,
      xp: activeReward.xp,
      freezes: activeReward.freezes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] dark:bg-[#1E1E1C] rounded-t-[36px] w-full max-h-[94%] overflow-y-auto border-t border-[#E8E2D5] dark:border-[#383834] shadow-2xl p-5 relative animate-in slide-in-from-bottom duration-300 no-scrollbar">
        {/* iOS Pull Handle */}
        <div className="w-10 h-1 bg-[#2C2C24]/20 dark:bg-white/20 rounded-full mx-auto mb-3 shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#7A786C] dark:text-[#A8A599] hover:text-[#2C2C24] dark:hover:text-white hover:bg-[#EFE9DE] dark:hover:bg-[#2C2C28] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF4E0] dark:bg-[#342814] border border-[#F4E1BD] dark:border-[#523F1E] text-[#B87A24] dark:text-[#E2A64E] text-[11px] font-bold mb-1">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>เช็คอินต่อเนื่อง {streakDays} วันแล้ว!</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-[#2C2C24] dark:text-[#F0EEE6]">
            ปฏิทินของขวัญรายวัน
          </h2>
          <p className="text-xs text-[#7A786C] dark:text-[#A8A599] max-w-xs mx-auto">
            เข้าแอพทุกวันเพื่อรับละอองดาว คอสตูม และน้ำยาป้องกันสตรีคหลุด 🛡️
          </p>
        </div>

        {/* 7-Day Rewards Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {REWARDS.map((r) => {
            const isToday = r.day === currentRewardDay && !claimedToday;
            const isClaimed = r.day < currentRewardDay || (r.day === currentRewardDay && claimedToday);
            const isLocked = r.day > currentRewardDay;

            return (
              <div
                key={r.day}
                className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all ${
                  isToday
                    ? 'bg-linear-to-b from-[#FFF9E6] to-[#FFEFC2] dark:from-[#3D321A] dark:to-[#2B2312] border-[#C49B5C] shadow-md ring-2 ring-[#C49B5C]/30 scale-105'
                    : isClaimed
                    ? 'bg-[#E2ECE0]/60 dark:bg-[#1E2E1C]/60 border-[#CFDFCB] dark:border-[#2C4229] text-[#3B5433] dark:text-[#88B580]'
                    : 'bg-white/80 dark:bg-[#242422]/80 border-[#EAE4D9] dark:border-[#383834] opacity-75'
                }`}
              >
                <span className="text-[10px] font-bold text-[#7A786C] dark:text-[#A09D90] uppercase mb-1">
                  วันที่ {r.day}
                </span>
                <div className="text-2xl my-1">{r.icon}</div>
                <span className="text-[11px] font-bold text-[#2C2C24] dark:text-[#E8E6DF] line-clamp-1">
                  {r.title}
                </span>

                <div className="mt-1.5">
                  {isClaimed ? (
                    <span className="inline-flex items-center text-[9px] font-bold text-[#3B5433] dark:text-[#97C58E] bg-[#D4E8D1] dark:bg-[#20361E] px-1.5 py-0.5 rounded-md">
                      <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> รับแล้ว
                    </span>
                  ) : isToday ? (
                    <span className="inline-flex items-center text-[9px] font-bold text-[#B87A24] dark:text-[#F3BA63] bg-white dark:bg-[#2E2412] px-1.5 py-0.5 rounded-md shadow-2xs">
                      วันนี้!
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[9px] text-[#8C8A7D] dark:text-[#7A7870]">
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
              <span>กดรับของขวัญวันที่ {currentRewardDay} (+{activeReward.stardust} ดาว, +{activeReward.xp} XP)</span>
            </button>
          ) : (
            <div className="w-full py-3 rounded-2xl bg-[#E2ECE0] dark:bg-[#1E2E1C] text-[#3B5433] dark:text-[#88B580] font-bold text-sm text-center border border-[#CFDFCB] dark:border-[#2C4229] flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>คุณได้รับของขวัญของวันนี้เรียบร้อยแล้ว พรุ่งนี้มารับวันที่ {Math.min(7, currentRewardDay + 1)} นะ!</span>
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
