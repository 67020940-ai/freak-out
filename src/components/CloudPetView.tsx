import React, { useState } from 'react';
import { PetState } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Droplet,
  Coffee,
  Wind,
  ShieldAlert,
  ShoppingBag,
  Edit3,
  Check,
  Smile,
  Sun,
  Flame,
  Star,
  Info,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PixelCloud8Bit, PixelCloudPose, CLOUD_COLOR_THEMES } from './PixelCloud8Bit';

interface CloudPetViewProps {
  pet: PetState;
  onUpdatePet: (updater: (prev: PetState) => PetState) => void;
  onOpenPanic: () => void;
  streakDays: number;
}

const PIXEL_POSES: { id: PixelCloudPose; name: string; desc: string }[] = [
  { id: 'idle', name: 'สบายใจ', desc: 'ลอยเบาๆ พักผ่อน' },
  { id: 'focus', name: 'ปั่นงาน', desc: 'พิมพ์งาน โฟกัสเต็มที่' },
  { id: 'celebrate', name: 'ฉลองสำเร็จ', desc: 'กระโดดดีใจ มีดาววิ้ง' },
];

const ACCESSORIES = [
  { id: 'none', name: 'ปกติ (Original)', desc: 'ร่างธรรมชาติ ไร้สิ่งปรุงแต่ง', price: 0, defaultUnlocked: true },
  { id: 'glasses', name: 'แว่นเด็กเนิร์ด', desc: 'เพิ่มความฉลาด +10%', price: 50, defaultUnlocked: false },
  { id: 'coffee', name: 'แก้วชานมไข่มุก', desc: 'เติมน้ำตาล เติมกำลังใจ', price: 100, defaultUnlocked: false },
  { id: 'grad_cap', name: 'หมวกรับปริญญา', desc: 'ลุยทีซิสให้จบไวๆ', price: 150, defaultUnlocked: false },
  { id: 'headphones', name: 'หูฟังตัดเสียงรบกวน', desc: 'ตัดโลกภายนอก โฟกัส 100%', price: 200, defaultUnlocked: false },
  { id: 'crown', name: 'มงกุฎ Focus King', desc: 'ราชาแห่งการไม่ผัดวัน', price: 500, defaultUnlocked: false },
];

const AccessoryBadgeIcon: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'glasses':
      return (
        <div className="w-8 h-8 rounded-xl bg-[#E8F0F8] border border-[#C5D7E8] flex items-center justify-center shadow-2xs">
          <svg className="w-4.5 h-4.5 text-[#2C3E50]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="14" r="4" fill="#BFDBFE" fillOpacity="0.4" />
            <circle cx="18" cy="14" r="4" fill="#BFDBFE" fillOpacity="0.4" />
            <path d="M10 14h4" />
            <path d="M2 12l2-4" />
            <path d="M22 12l-2-4" />
          </svg>
        </div>
      );
    case 'grad_cap':
      return (
        <div className="w-8 h-8 rounded-xl bg-[#F0EBF8] border border-[#DACDEC] flex items-center justify-center shadow-2xs">
          <svg className="w-4.5 h-4.5 text-[#583D72]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="#E9D5FF" fillOpacity="0.5" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
      );
    case 'headphones':
      return (
        <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center shadow-2xs">
          <svg className="w-4.5 h-4.5 text-[#2E7D32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" fill="#A5D6A7" fillOpacity="0.5" />
          </svg>
        </div>
      );
    case 'crown':
      return (
        <div className="w-8 h-8 rounded-xl bg-[#FFF8E1] border border-[#FFE082] flex items-center justify-center shadow-2xs">
          <svg className="w-4.5 h-4.5 text-[#D49E35]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15 8 21 9 17 14 18 20 12 17 6 20 7 14 3 9 9 8 12 2" fill="#FDE047" fillOpacity="0.6" />
          </svg>
        </div>
      );
    case 'coffee':
      return (
        <div className="w-8 h-8 rounded-xl bg-[#FFF3E0] border border-[#FFE0B2] flex items-center justify-center shadow-2xs">
          <svg className="w-4.5 h-4.5 text-[#B85824]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" fill="#FED7AA" fillOpacity="0.5" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5] flex items-center justify-center shadow-2xs">
          <svg className="w-4.5 h-4.5 text-[#6C7764]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#E8ECE5" />
          </svg>
        </div>
      );
  }
};

export const CloudPetView: React.FC<CloudPetViewProps> = ({
  pet,
  onUpdatePet,
  onOpenPanic,
  streakDays,
}) => {
  const [activePose, setActivePose] = useState<PixelCloudPose>('idle');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(pet.name);
  const [petFeedback, setPetFeedback] = useState<string | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const [isBouncing, setIsBouncing] = useState(false);

  // Petting interaction with lively squish and bounce movement
  const handlePet = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now(), x, y };
    setHearts((prev) => [...prev.slice(-4), newHeart]);

    // Trigger lively spring bounce & switch pose temporarily
    setIsBouncing(true);
    setActivePose('celebrate');
    setTimeout(() => {
      setIsBouncing(false);
      setActivePose('idle');
    }, 600);

    onUpdatePet((prev) => ({
      ...prev,
      affinity: Math.min(100, prev.affinity + 2),
      stardust: prev.stardust + 1,
    }));

    const feedbackPhrases = [
      'อบอุ่นจังเลยนะ',
      'ลุยงานด้วยกันต่อนะ',
      'สมองโล่งขึ้นเยอะเลย',
      'พร้อมลุยภารกิจถัดไปแล้ว',
      'ขอบคุณที่แวะมาทักทายนะ'
    ];
    setPetFeedback(feedbackPhrases[Math.floor(Math.random() * feedbackPhrases.length)]);
  };

  const [activeCareAnimation, setActiveCareAnimation] = useState<'water' | 'sun' | 'meditate' | null>(null);

  const handleCareAction = (type: 'water' | 'sun' | 'meditate') => {
    setActiveCareAnimation(type);

    if (type === 'water') {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#70B8FF', '#A0D2FF', '#FFFFFF', '#3A78B8'],
      });
      setPetFeedback('สดชื่นเหมือนฝนตกใหม่ๆ เลย น้องเมฆชุ่มฉ่ำ 💧');
    } else if (type === 'sun') {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#F59E0B', '#FDE68A', '#FFFBEB'],
      });
      setPetFeedback('อบอุ่นใจ สังเคราะห์แสงรับวิตามินดีเต็มที่ ☀️');
    } else {
      setPetFeedback('หายใจเข้าลึกๆ หายใจออกช้าๆ จิตใจสงบนิ่ง 🍃');
    }

    setIsBouncing(true);
    setActivePose('celebrate');
    setTimeout(() => {
      setIsBouncing(false);
      setActivePose('idle');
      setActiveCareAnimation(null);
    }, 900);

    onUpdatePet((prev) => ({
      ...prev,
      affinity: Math.min(100, prev.affinity + 8),
      stardust: prev.stardust + 3,
    }));
  };

  const handleBuyOrEquipAccessory = (acc: typeof ACCESSORIES[number]) => {
    const isUnlocked = acc.defaultUnlocked || (pet.purchasedAccessories && pet.purchasedAccessories.includes(acc.id));

    if (isUnlocked) {
      onUpdatePet((prev) => ({ ...prev, equippedAccessory: acc.id }));
      setPetFeedback(`ใส่ "${acc.name}" ให้น้องแล้ว น่ารักสุดๆ!`);
      return;
    }

    // Buying check
    if (pet.stardust < acc.price) {
      setPetFeedback(`ละอองดาวไม่พอฮะ! ขาดอีก ${acc.price - pet.stardust} แต้ม (เคลียร์งานเพื่อรับเพิ่มนะ)`);
      return;
    }

    // Deduct stardust, record purchased accessory, and equip immediately!
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FBBF24', '#34D399', '#60A5FA'],
    });

    onUpdatePet((prev) => {
      const currentPurchased = prev.purchasedAccessories || [];
      return {
        ...prev,
        stardust: prev.stardust - acc.price,
        purchasedAccessories: [...currentPurchased, acc.id],
        equippedAccessory: acc.id,
      };
    });

    setIsBouncing(true);
    setActivePose('celebrate');
    setTimeout(() => {
      setIsBouncing(false);
      setActivePose('idle');
    }, 800);

    setPetFeedback(`ปลดล็อกและใส่ "${acc.name}" เรียบร้อยแล้ว! ขอบคุณนะฮะ ✨`);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdatePet((prev) => ({ ...prev, name: tempName.trim() }));
    }
    setIsEditingName(false);
  };

  return (
    <div className="w-full space-y-4 pb-16">
      {/* Top Banner / Mood Card */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 sm:p-6 border border-[#E8E2D5] shadow-2xs relative overflow-hidden">
        <div className="flex flex-col items-center justify-between gap-4 relative z-10">
          {/* Pet Visual Center */}
          <div className="flex flex-col items-center w-full">
            {/* Speech Bubble */}
            <div className="mb-2 px-3.5 py-1.5 rounded-2xl bg-white border border-[#E8E2D5] text-xs font-semibold text-[#2C2C24] shadow-2xs flex items-center gap-2 max-w-xs text-center">
              <Smile className="w-4 h-4 text-[#828D7A] shrink-0" />
              <span className="truncate">{petFeedback || `สวัสดี วันนี้ค่อยๆ ทำทีละอย่างนะ`}</span>
            </div>

            {/* Clickable Pet Frame with Spring Physics Squish & Bounce Movement */}
            <motion.div
              onClick={handlePet}
              animate={isBouncing ? {
                scale: [1, 1.18, 0.92, 1.08, 1],
                y: [0, -16, 4, -6, 0],
                rotate: [0, -4, 4, -2, 0]
              } : { scale: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl p-3 bg-white border border-[#E8E2D5] shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center group select-none"
              title="แตะเพื่อลูบหัวน้องเมฆ"
            >
              <div className="w-full h-full flex items-center justify-center p-2">
                <PixelCloud8Bit pose={activePose} size="lg" accessory={pet.equippedAccessory} color={pet.color || 'white'} interactive={false} />
              </div>

              {/* Heart particles */}
              <AnimatePresence>
                {hearts.map((h) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 1, scale: 0.8, y: 0 }}
                    animate={{ opacity: 0, scale: 1.5, y: -40 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ left: h.x, top: h.y }}
                    className="absolute pointer-events-none text-rose-500 font-bold text-lg"
                  >
                    ♥
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Little prompt */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#8C8A7D] font-medium bg-white/90 px-2 py-0.5 rounded-full border border-[#EAE4D9] opacity-80 group-hover:opacity-100 transition">
                แตะเพื่อลูบหัว
              </div>
            </motion.div>

            {/* Pet Name & Title */}
            <div className="mt-4 flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="px-3 py-1 text-sm font-bold bg-white border border-[#828D7A] rounded-xl focus:outline-hidden text-[#2C2C24]"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 rounded-xl bg-[#828D7A] text-white hover:bg-[#6C7764] cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-heading text-[#2C2C24]">น้อง{pet.name}</h3>
                  <button
                    onClick={() => {
                      setTempName(pet.name);
                      setIsEditingName(true);
                    }}
                    className="p-1 text-[#8C8A7D] hover:text-[#2C2C24] transition cursor-pointer"
                    title="เปลี่ยนชื่อน้องก้อนเมฆ"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-[#7A786C] font-medium">
              ก้อนเมฆคู่หูประจำตัว • สภาพอากาศ: ท้องฟ้าสดใส ☀️
            </p>
          </div>

          {/* Pet Stats & Status Dashboard */}
          <div className="flex-1 w-full space-y-3">
            <div className="bg-white/90 rounded-2xl p-3.5 border border-[#EAE4D9] space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#7A786C] uppercase tracking-wider flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                  <Star className="w-3.5 h-3.5 text-[#C49B5C] shrink-0" /> ระดับความสนิท
                </span>
                <span className="text-xs font-bold text-[#828D7A] shrink-0 whitespace-nowrap">
                  Lv.{pet.level} ({pet.affinity}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#EFE9DE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#828D7A] to-[#B8C9AE] rounded-full transition-all duration-500"
                  style={{ width: `${pet.affinity}%` }}
                />
              </div>
              <p className="text-[10px] text-[#7A786C] leading-snug">
                💡 ยิ่งโฟกัสเคลียร์งาน น้องจะสะสมเลเวลและปลดล็อกสภาพอากาศใหม่ๆ
              </p>
            </div>

            {/* Quick Currency & Freeze status */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/90 rounded-2xl p-2.5 border border-[#EAE4D9] flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-xl bg-[#FFF4E0] border border-[#F4E1BD] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#B87A24]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#2C2C24] leading-tight">{pet.stardust}</div>
                  <div className="text-[10px] text-[#7A786C] truncate">ละอองดาวสะสม</div>
                </div>
              </div>

              <div className="bg-white/90 rounded-2xl p-2.5 border border-[#EAE4D9] flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-xl bg-[#E8F2FA] border border-[#CEE0F0] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4 text-[#385E82]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#2C2C24] leading-tight">{pet.streakFreezes} ขวด</div>
                  <div className="text-[10px] text-[#7A786C] truncate">แช่แข็งสตรีค</div>
                </div>
              </div>
            </div>

              {/* Care Actions */}
              <div className="space-y-1.5 pt-0.5">
                <span className="text-xs font-bold text-[#4A4A3E]">การดูแลน้องเมฆ:</span>
                <div className="grid grid-cols-3 gap-2">
                  <motion.button
                    whileTap={{ scale: 0.92, y: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleCareAction('water')}
                    className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-[#EAF2F8] hover:bg-[#D9EAF5] border border-[#D0E2EE] text-[#2C4A6F] transition active:scale-95 cursor-pointer text-xs font-semibold shadow-2xs"
                  >
                    <motion.div
                      animate={activeCareAnimation === 'water' ? { y: [0, -6, 2, 0], scale: [1, 1.25, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <Droplet className="w-4 h-4 text-[#3A78B8]" />
                    </motion.div>
                    <span className="text-[11px] whitespace-nowrap">รดละอองน้ำ</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.92, y: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleCareAction('sun')}
                    className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-[#FFF8E8] hover:bg-[#FFF0D0] border border-[#F6E2BE] text-[#9E6514] transition active:scale-95 cursor-pointer text-xs font-semibold shadow-2xs"
                  >
                    <motion.div
                      animate={activeCareAnimation === 'sun' ? { rotate: [0, 90, 180, 360], scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      <Sun className="w-4 h-4 text-[#D9822B]" />
                    </motion.div>
                    <span className="text-[11px] whitespace-nowrap">อาบแสงแดด</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.92, y: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      handleCareAction('meditate');
                      setTimeout(() => {
                        onOpenPanic();
                      }, 500);
                    }}
                    className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-[#E8EFE8] hover:bg-[#D8E6D8] border border-[#CDE0CD] text-[#2E522E] transition active:scale-95 cursor-pointer text-xs font-semibold shadow-2xs"
                  >
                    <motion.div
                      animate={activeCareAnimation === 'meditate' ? { scale: [1, 1.2, 0.9, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Wind className="w-4 h-4 text-[#4D784D]" />
                    </motion.div>
                    <span className="text-[11px] whitespace-nowrap">ฝึกสมาธิ</span>
                  </motion.button>
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* 8-bit Animated Poses Switcher */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#2C2C24] font-heading flex items-center gap-1.5">
              <span>🎮 ท่าทาง 8-bit ของน้องเมฆ (3 Core Poses)</span>
            </h3>
            <p className="text-[11px] text-[#7A786C]">
              คลิกเพื่อทดสอบแอนิเมชันขยับได้ในแต่ละท่า
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {PIXEL_POSES.map((poseItem) => {
            const isSelected = activePose === poseItem.id;
            return (
              <button
                key={poseItem.id}
                onClick={() => {
                  setActivePose(poseItem.id);
                  setPetFeedback(`เปลี่ยนเป็นท่า "${poseItem.name}" แล้วฮะ! ✨`);
                }}
                className={`flex flex-col items-center p-2 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#6C7764] shadow-xs ring-2 ring-[#6C7764]/20'
                    : 'bg-white/70 border-[#E8E2D5] hover:bg-white hover:border-[#D5CDC0]'
                }`}
              >
                <div className="w-13 h-13 rounded-xl mb-1 bg-[#FAF8F5] flex items-center justify-center p-0.5">
                  <PixelCloud8Bit pose={poseItem.id} size="sm" accessory={pet.equippedAccessory} color={pet.color || 'white'} interactive={false} />
                </div>
                <span className="text-[11px] font-bold text-[#2C2C24] text-center leading-tight whitespace-nowrap">
                  {poseItem.name}
                </span>
                <span className="text-[9px] text-[#8A887A] text-center truncate w-full mt-0.5">
                  {poseItem.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cloud Color Theme Picker (Screenshot 23.18.55) */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#2C2C24] font-heading flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#828D7A]" />
              <span>โทนสีของน้องเมฆ (Color Theme)</span>
            </h3>
            <p className="text-[11px] text-[#7A786C]">
              เปลี่ยนสีสันให้น้องเมฆตามอารมณ์ของคุณ
            </p>
          </div>
          <span className="text-[10px] font-semibold text-[#828D7A] bg-[#ECEFEA] px-2 py-0.5 rounded-full border border-[#D5DDD0]">
            {CLOUD_COLOR_THEMES.find(t => t.id === (pet.color || 'white'))?.name || 'ปุยนุ่นคลาสสิก'}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CLOUD_COLOR_THEMES.map((theme) => {
            const isSelected = (pet.color || 'white') === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  onUpdatePet((prev) => ({ ...prev, color: theme.id }));
                  setPetFeedback(`เปลี่ยนเป็นสี "${theme.name}" แล้วฮะ!`);
                }}
                className={`flex flex-col items-center p-2 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#6C7764] shadow-xs ring-2 ring-[#6C7764]/25'
                    : 'bg-white/70 border-[#E8E2D5] hover:bg-white hover:border-[#D5CDC0]'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full border border-black/10 shadow-2xs mb-1.5 flex items-center justify-center transition-transform"
                  style={{ backgroundColor: theme.colorHex }}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#2C2C24]" />}
                </div>
                <span className="text-[11px] font-bold text-[#2C2C24] text-center leading-tight">
                  {theme.name}
                </span>
                <span className="text-[9px] text-[#8A887A] text-center mt-0.5">
                  {theme.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wardrobe & Accessories */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E2DACB] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#2C2C24] font-heading flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#828D7A]" />
              <span>ตู้เสื้อผ้าและไอเท็มตกแต่ง</span>
            </h3>
            <p className="text-[11px] text-[#7A786C]">
              เปลี่ยนชุดและไอเท็มให้น้องเมฆได้ทันที
            </p>
          </div>
          <div className="text-xs font-bold text-[#B87A24] bg-[#FFF4E0] px-2.5 py-0.5 rounded-xl border border-[#F4E1BD] shrink-0">
            {pet.stardust} แต้ม
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {ACCESSORIES.map((acc) => {
            const isUnlocked = acc.defaultUnlocked || (pet.purchasedAccessories && pet.purchasedAccessories.includes(acc.id));
            const isEquipped = pet.equippedAccessory === acc.id || (!pet.equippedAccessory && acc.id === 'none');
            const canAfford = pet.stardust >= acc.price;

            return (
              <div
                key={acc.id}
                onClick={() => handleBuyOrEquipAccessory(acc)}
                className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isEquipped
                    ? 'bg-[#EBF0E8] border-[#6C7764] ring-2 ring-[#6C7764]/20 shadow-xs'
                    : isUnlocked
                    ? 'bg-white border-[#EAE4D9] hover:bg-white/90 hover:border-[#D5CDC0] shadow-2xs'
                    : canAfford
                    ? 'bg-[#FFFDF7] border-[#E8DDBE] hover:border-[#D49E35] hover:shadow-2xs'
                    : 'bg-[#F2EEE9] border-[#E2DACB] opacity-75'
                }`}
              >
                <div className="mb-1.5 flex items-center justify-center">
                  <AccessoryBadgeIcon id={acc.id} />
                </div>
                <div className="text-[11px] font-bold text-[#2C2C24] line-clamp-1">{acc.name}</div>
                <div className="text-[9px] text-[#7A786C] mt-0.5 line-clamp-1">{acc.desc}</div>
                <div className="mt-1.5 w-full">
                  {isEquipped ? (
                    <span className="inline-block text-[9px] font-bold text-[#3B5433] bg-[#DDE9D9] px-2 py-0.5 rounded-full">
                      กำลังใส่
                    </span>
                  ) : isUnlocked ? (
                    <span className="inline-block text-[9px] font-semibold text-[#6C7764] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#E2DACB]">
                      แตะเพื่อใส่
                    </span>
                  ) : (
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      canAfford
                        ? 'bg-[#FFF4E0] text-[#B87A24] border-[#F4E1BD]'
                        : 'bg-[#ECEAE4] text-[#8C8A7D] border-[#DDD8CE]'
                    }`}>
                      ซื้อ {acc.price} แต้ม
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
