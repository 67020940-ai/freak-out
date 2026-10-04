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
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PixelCloud8Bit, PixelCloudPose } from './PixelCloud8Bit';

interface CloudPetViewProps {
  pet: PetState;
  onUpdatePet: (updater: (prev: PetState) => PetState) => void;
  onOpenPanic: () => void;
  streakDays: number;
}

const PIXEL_POSES: { id: PixelCloudPose; name: string; desc: string }[] = [
  { id: 'idle', name: 'สบายใจ ☁️', desc: 'ลอยเบาๆ กระพริบตา' },
  { id: 'focus', name: 'ปั่นงาน 🔥', desc: 'พิมพ์งาน โฟกัสลุกโชน' },
  { id: 'celebrate', name: 'ฉลองสำเร็จ 🎉', desc: 'กระโดดดีใจ มีดาววิ้ง' },
];

const ACCESSORIES = [
  { id: 'none', name: 'ปกติ (Original)', icon: '☁️', price: 0, unlocked: true },
  { id: 'glasses', name: 'แว่นเด็กเนิร์ด', icon: '👓', price: 50, unlocked: true },
  { id: 'grad_cap', name: 'หมวกรับปริญญา', icon: '🎓', price: 150, unlocked: true },
  { id: 'headphones', name: 'หูฟังตัดเสียงรบกวน', icon: '🎧', price: 200, unlocked: true },
  { id: 'crown', name: 'มงกุฎ Focus King', icon: '👑', price: 500, unlocked: false },
  { id: 'coffee', name: 'แก้วชานมไข่มุก', icon: '🧋', price: 100, unlocked: true },
];

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

  // Petting interaction
  const handlePet = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now(), x, y };
    setHearts((prev) => [...prev.slice(-4), newHeart]);

    onUpdatePet((prev) => ({
      ...prev,
      affinity: Math.min(100, prev.affinity + 2),
      stardust: prev.stardust + 1,
    }));

    const feedbackPhrases = [
      'งุ้ยยย อบอุ่นจังเลย ✨',
      'ลุยงานด้วยกันต่อน้า! 💖',
      'สมองโล่งขึ้นเยอะเลยฮะ ☁️',
      'พร้อมลุยภารกิจแล้ว! 🚀',
      'ขอบคุณที่ดูแลเค้าน้า 🌸'
    ];
    setPetFeedback(feedbackPhrases[Math.floor(Math.random() * feedbackPhrases.length)]);
  };

  const handleFeed = (type: 'water' | 'tea') => {
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.6 },
      colors: type === 'water' ? ['#70B8FF', '#A0D2FF', '#FFFFFF'] : ['#E8A87C', '#C38D9E', '#E27D60'],
    });

    onUpdatePet((prev) => ({
      ...prev,
      affinity: Math.min(100, prev.affinity + 10),
      stardust: prev.stardust + 5,
    }));

    setPetFeedback(type === 'water' ? 'สดชื่นเหมือนฝนตกใหม่ๆ เลย! 💧' : 'พลังงานโฟกัสชาร์จเต็มเปี่ยม! ☕');
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
              <Smile className="w-4 h-4 text-[#D49E35] shrink-0" />
              <span className="truncate">{petFeedback || `สวัสดีฮับ! วันนี้ลุยไปด้วยกันนะ`}</span>
            </div>

            {/* Clickable Pet Frame with Hearts */}
            <div
              onClick={handlePet}
              className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl p-3 bg-white border border-[#E8E2D5] shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center group select-none"
              title="คลิกเพื่อลูบหัวน้องเมฆ 💖"
            >
              <div className="w-full h-full flex items-center justify-center p-2">
                <PixelCloud8Bit pose={activePose} size="lg" interactive={false} />
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
                    💖
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Little prompt */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#8C8A7D] font-medium bg-white/90 px-2 py-0.5 rounded-full border border-[#EAE4D9] opacity-80 group-hover:opacity-100 transition">
                แตะเพื่อลูบหัว ✨
              </div>
            </div>

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
                <button
                  onClick={() => handleFeed('water')}
                  className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-[#EAF2F8] hover:bg-[#D9EAF5] border border-[#D0E2EE] text-[#2C4A6F] transition active:scale-95 cursor-pointer text-xs font-semibold"
                >
                  <Droplet className="w-4 h-4 text-[#3A78B8]" />
                  <span className="text-[11px] whitespace-nowrap">รดละอองน้ำ</span>
                </button>

                <button
                  onClick={() => handleFeed('tea')}
                  className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-[#FFF4E8] hover:bg-[#FFEAD5] border border-[#F6DCBE] text-[#8C4A1E] transition active:scale-95 cursor-pointer text-xs font-semibold"
                >
                  <Coffee className="w-4 h-4 text-[#B85824]" />
                  <span className="text-[11px] whitespace-nowrap">ชงชาอุ่นๆ</span>
                </button>

                <button
                  onClick={onOpenPanic}
                  className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-[#E8EFE8] hover:bg-[#D8E6D8] border border-[#CDE0CD] text-[#2E522E] transition active:scale-95 cursor-pointer text-xs font-semibold"
                >
                  <Wind className="w-4 h-4 text-[#4D784D]" />
                  <span className="text-[11px] whitespace-nowrap">ฝึกหายใจ</span>
                </button>
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
                  <PixelCloud8Bit pose={poseItem.id} size="sm" interactive={false} />
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

      {/* Wardrobe & Accessories */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E2DACB] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#2C2C24] font-heading flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#828D7A]" />
              <span>ตู้เสื้อผ้าและไอเท็มตกแต่ง</span>
            </h3>
            <p className="text-[11px] text-[#7A786C]">
              สะสมละอองดาวเพื่อปลดล็อกไอเท็มน่ารักๆ
            </p>
          </div>
          <div className="text-xs font-bold text-[#B87A24] bg-[#FFF4E0] px-2.5 py-0.5 rounded-xl border border-[#F4E1BD] shrink-0">
            {pet.stardust} 🪙
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {ACCESSORIES.map((acc) => {
            const isEquipped = pet.equippedAccessory === acc.id || (!pet.equippedAccessory && acc.id === 'none');
            return (
              <div
                key={acc.id}
                onClick={() => {
                  if (acc.unlocked) {
                    onUpdatePet((prev) => ({ ...prev, equippedAccessory: acc.id }));
                    setPetFeedback(`ใส่ ${acc.name} ให้น้องเมฆเรียบร้อยแล้วฮะ! ✨`);
                  }
                }}
                className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isEquipped
                    ? 'bg-[#E2ECE0] border-[#828D7A] shadow-xs'
                    : acc.unlocked
                    ? 'bg-white border-[#EAE4D9] hover:bg-white/80'
                    : 'bg-[#F2EEE9] border-[#E2DACB] opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="text-xl mb-0.5">{acc.icon}</div>
                <div className="text-[11px] font-bold text-[#2C2C24] line-clamp-1">{acc.name}</div>
                <div className="text-[9px] text-[#7A786C] mt-0.5">
                  {isEquipped ? 'กำลังใส่' : acc.unlocked ? 'ปลดล็อก' : `${acc.price} ดาว`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
