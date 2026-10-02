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

interface CloudPetViewProps {
  pet: PetState;
  onUpdatePet: (updater: (prev: PetState) => PetState) => void;
  onOpenPanic: () => void;
  streakDays: number;
}

const MASCOT_POSES = [
  { id: 'celebrate', name: 'ฉลองสำเร็จ 🎉', file: '/mascot/cloud_celebrate_done_1789549091591.jpg', desc: 'กระโดดดีใจ มีประกายวิ้งๆ' },
  { id: 'focus', name: 'โฟกัสอ่านหนังสือ 📖', file: '/mascot/cloud_focus_mode_1789549067226.jpg', desc: 'ตั้งใจทำงาน หน้าจอโน้ตบุ๊ก' },
  { id: 'zen', name: 'เซน ผ่อนคลาย 🧘', file: '/mascot/03_zen_relax.jpg', desc: 'หลับตาพริ้ม หายใจลึกๆ' },
  { id: 'working', name: 'ปั่นงานไฟลุก ✍️', file: '/mascot/05_doraemon_hands_rolling_sheet.jpg', desc: 'มือเป็นระวิง สู้ตายเพื่อเดดไลน์' },
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
  const [activePose, setActivePose] = useState<string>('celebrate');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(pet.name);
  const [petFeedback, setPetFeedback] = useState<string | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const currentPose = MASCOT_POSES.find((p) => p.id === activePose) || MASCOT_POSES[0];

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner / Mood Card */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#E2DACB] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#F5EFE6] to-transparent opacity-60 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Pet Visual Center */}
          <div className="flex flex-col items-center">
            {/* Speech Bubble */}
            <div className="mb-3 px-4 py-2 rounded-2xl bg-white border border-[#E2DACB] text-xs sm:text-sm font-semibold text-[#2C2C24] shadow-xs flex items-center gap-2">
              <Smile className="w-4 h-4 text-[#C49B5C]" />
              <span>{petFeedback || `สวัสดีฮับ! เค้าชื่อ ${pet.name} วันนี้มาลุยไปด้วยกันนะ`}</span>
            </div>

            {/* Clickable Pet Frame with Hearts */}
            <div
              onClick={handlePet}
              className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl p-3 bg-white/80 border-2 border-[#E2DACB] shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center group select-none"
              title="คลิกเพื่อลูบหัวน้องเมฆ 💖"
            >
              <img
                src={currentPose.file}
                alt={currentPose.name}
                className="w-full h-full object-contain rounded-2xl drop-shadow-sm pointer-events-none"
              />

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
          <div className="flex-1 w-full space-y-4">
            <div className="bg-white/90 rounded-2xl p-4 border border-[#EAE4D9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7A786C] uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#C49B5C]" /> ระดับความสนิท (Affinity)
                </span>
                <span className="text-xs font-bold text-[#828D7A]">
                  Lv.{pet.level} ({pet.affinity}/100%)
                </span>
              </div>
              <div className="w-full h-3 bg-[#EFE9DE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#828D7A] to-[#B8C9AE] rounded-full transition-all duration-500"
                  style={{ width: `${pet.affinity}%` }}
                />
              </div>
              <p className="text-[11px] text-[#7A786C]">
                💡 ยิ่งโฟกัสทำงานเสร็จ น้องจะสะสมเลเวลและปลดล็อกสภาพอากาศใหม่ๆ
              </p>
            </div>

            {/* Quick Currency & Freeze status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/90 rounded-2xl p-3 border border-[#EAE4D9] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF4E0] border border-[#F4E1BD] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#B87A24]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2C2C24]">{pet.stardust}</div>
                  <div className="text-[10px] text-[#7A786C]">ละอองดาวสะสม</div>
                </div>
              </div>

              <div className="bg-white/90 rounded-2xl p-3 border border-[#EAE4D9] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E8F2FA] border border-[#CEE0F0] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-[#385E82]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2C2C24]">{pet.streakFreezes} ขวด</div>
                  <div className="text-[10px] text-[#7A786C]">น้ำยาแช่แข็งสตรีค</div>
                </div>
              </div>
            </div>

            {/* Care Actions */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-[#4A4A3E]">การดูแลน้องเมฆ:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleFeed('water')}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-[#EAF2F8] hover:bg-[#D9EAF5] border border-[#D0E2EE] text-[#2C4A6F] transition active:scale-95 cursor-pointer text-xs font-semibold"
                >
                  <Droplet className="w-4 h-4 text-[#3A78B8]" />
                  <span>รดละอองน้ำ</span>
                </button>

                <button
                  onClick={() => handleFeed('tea')}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-[#FFF4E8] hover:bg-[#FFEAD5] border border-[#F6DCBE] text-[#8C4A1E] transition active:scale-95 cursor-pointer text-xs font-semibold"
                >
                  <Coffee className="w-4 h-4 text-[#B85824]" />
                  <span>ชงชาอุ่นๆ</span>
                </button>

                <button
                  onClick={onOpenPanic}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-[#E8EFE8] hover:bg-[#D8E6D8] border border-[#CDE0CD] text-[#2E522E] transition active:scale-95 cursor-pointer text-xs font-semibold"
                >
                  <Wind className="w-4 h-4 text-[#4D784D]" />
                  <span>ฝึกหายใจ 4-7-8</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Choose Mascot Poses (Dynamic Switcher) */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-[#E2DACB] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2C2C24] font-heading flex items-center gap-2">
              <span>🎭 ท่าทางและอารมณ์ของน้องก้อนเมฆ</span>
            </h3>
            <p className="text-xs text-[#7A786C]">
              เปลี่ยนอารมณ์น้องเมฆให้เข้ากับสถานะการทำงานปัจจุบัน
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MASCOT_POSES.map((pose) => {
            const isSelected = activePose === pose.id;
            return (
              <div
                key={pose.id}
                onClick={() => {
                  setActivePose(pose.id);
                  setPetFeedback(`เปลี่ยนเป็นโหมด "${pose.name}" แล้วฮะ! ☁️`);
                }}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#828D7A] shadow-md ring-2 ring-[#828D7A]/30'
                    : 'bg-white/60 border-[#EAE4D9] hover:bg-white hover:border-[#D5CDC0]'
                }`}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden mb-2 bg-[#F9F7F2] p-1 flex items-center justify-center">
                  <img src={pose.file} alt={pose.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-bold text-[#2C2C24] text-center">{pose.name}</span>
                <span className="text-[10px] text-[#7A786C] text-center line-clamp-1 mt-0.5">{pose.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wardrobe & Accessories */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-[#E2DACB] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2C2C24] font-heading flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#828D7A]" />
              <span>ตู้เสื้อผ้าและไอเท็มตกแต่ง (Wardrobe)</span>
            </h3>
            <p className="text-xs text-[#7A786C]">
              สะสมละอองดาวจากการเคลียร์งานเพื่อปลดล็อกไอเท็มน่ารักๆ ให้น้องเมฆ
            </p>
          </div>
          <div className="text-xs font-bold text-[#B87A24] bg-[#FFF4E0] px-3 py-1 rounded-xl border border-[#F4E1BD]">
            {pet.stardust} 🪙
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
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
                className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isEquipped
                    ? 'bg-[#E2ECE0] border-[#828D7A] shadow-xs'
                    : acc.unlocked
                    ? 'bg-white border-[#EAE4D9] hover:bg-white/80'
                    : 'bg-[#F2EEE9] border-[#E2DACB] opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="text-2xl mb-1">{acc.icon}</div>
                <div className="text-xs font-bold text-[#2C2C24] line-clamp-1">{acc.name}</div>
                <div className="text-[10px] text-[#7A786C] mt-0.5">
                  {isEquipped ? 'กำลังสวมใส่' : acc.unlocked ? 'ปลดล็อกแล้ว' : `${acc.price} ดาว`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticker Pack Gallery Showcase */}
      <div className="bg-[#EFE9DE]/60 rounded-3xl p-6 border border-[#E2DACB] space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#828D7A]" />
          <h4 className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider">
            คอลเลกชันสติ๊กเกอร์ของน้องเมฆ (Official Sticker Sheet)
          </h4>
        </div>
        <p className="text-xs text-[#7A786C]">
          สติ๊กเกอร์ทั้งหมดจะถูกปลดล็อกโดยอัตโนมัติเมื่อทำภารกิจรายวันและรักษาสถิติสตรีคต่อเนื่อง!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="rounded-2xl overflow-hidden border border-[#E2DACB] shadow-2xs bg-white p-2">
            <img
              src="/mascot/cloud_sticker_sheet_1789549157860.jpg"
              alt="Sticker Sheet"
              className="w-full h-44 object-contain rounded-xl"
            />
            <p className="text-[10px] text-center text-[#7A786C] font-semibold mt-1">Sticker Pack: Emotions & Workflows</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#E2DACB] shadow-2xs bg-white p-2">
            <img
              src="/mascot/04_sticker_pack_4in1.jpg"
              alt="4 in 1 pack"
              className="w-full h-44 object-contain rounded-xl"
            />
            <p className="text-[10px] text-center text-[#7A786C] font-semibold mt-1">Sticker Pack: 4-in-1 Daily Moods</p>
          </div>
        </div>
      </div>
    </div>
  );
};
