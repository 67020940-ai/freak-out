import React, { useState, useEffect } from 'react';
import { X, Wind, Sparkles, Heart, Eye, Hand, Ear, Smile, Coffee } from 'lucide-react';
import { MascotCloud } from './MascotCloud';

interface PanicCalmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PanicCalmModal: React.FC<PanicCalmModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<'breathing' | 'grounding' | 'affirmation'>('breathing');

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          // Switch phase
          if (phase === 'inhale') {
            setPhase('hold');
            return 7;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 8;
          } else {
            setPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, phase]);

  if (!isOpen) return null;

  const affirmations = [
    'งานกองโตไม่ได้แปลว่าคุณทำไม่ทัน ค่อยๆ ทำทีละ 1 ข้อนะ',
    'คุณไม่จำเป็นต้องสมบูรณ์แบบ แค่ลงมือทำเวอร์ชันร่างแรกก็ยอดเยี่ยมแล้ว!',
    'ความเครียดคือสัญญาณว่าคุณแคร์ แต่อย่าปล่อยให้มันทำร้ายใจคุณนะ',
    'หายใจเข้าลึกๆ... ปล่อยวางความกังวลในอนาคต แล้วอยู่กับปัจจุบัน',
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-t-[36px] w-full max-h-[94%] overflow-y-auto shadow-2xl border-t border-[#E8E2D5] p-5 relative text-center animate-in slide-in-from-bottom duration-300 no-scrollbar">
        {/* iOS Drag Handle */}
        <div className="w-10 h-1 bg-[#2C2C24]/20 rounded-full mx-auto mb-3 shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#8A8A7A] hover:text-[#2C2C24] hover:bg-[#EFE9DE] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EFE9DE] text-[#55634E] text-[11px] font-bold mb-2 border border-[#E2DACB]">
          <Wind className="w-3 h-3 text-[#828D7A]" />
          <span>SOS Reset Your Mind</span>
        </div>
        <h2 className="text-lg font-bold font-heading text-[#2C2C24]">
          ผ่อนคลายและเคลียร์สมอง
        </h2>
        <p className="text-xs text-[#6E6E60] max-w-xs mx-auto mt-1">
          เวลาที่รู้สึกตื่นตระหนก คิดวน หรือสมองตื้อ ให้เวลาตัวเอง 1 นาทีตรงนี้นะ
        </p>

        {/* Tab Selection */}
        <div className="flex items-center justify-center gap-2 my-4">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'breathing' ? 'bg-[#828D7A] text-white shadow-2xs' : 'bg-[#EFE9DE] text-[#6E6E60] hover:bg-[#E5DDD0]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>ฝึกหายใจ 4-7-8</span>
          </button>
          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grounding' ? 'bg-[#828D7A] text-white shadow-2xs' : 'bg-[#EFE9DE] text-[#6E6E60] hover:bg-[#E5DDD0]'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>เทคนิค 5-4-3-2-1</span>
          </button>
          <button
            onClick={() => setActiveTab('affirmation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'affirmation' ? 'bg-[#828D7A] text-white shadow-2xs' : 'bg-[#EFE9DE] text-[#6E6E60] hover:bg-[#E5DDD0]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>ปลอบประโลมใจ</span>
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === 'breathing' && (
          <div className="my-6 space-y-6 flex flex-col items-center">
            {/* Animated Pulsing Breathing Circle */}
            <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
              {/* Outer Pulse Glow */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  phase === 'inhale'
                    ? 'scale-110 bg-[#828D7A]/25'
                    : phase === 'hold'
                    ? 'scale-105 bg-[#B88E76]/25'
                    : 'scale-90 bg-[#6C7764]/25'
                }`}
              />

              {/* Main Breathing Circle */}
              <div
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 shadow-lg ${
                  phase === 'inhale'
                    ? 'bg-[#828D7A] scale-105'
                    : phase === 'hold'
                    ? 'bg-[#B88E76] scale-100'
                    : 'bg-[#55634E] scale-95'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                  {phase === 'inhale' ? 'สูดหายใจเข้า' : phase === 'hold' ? 'กลั้นไว้' : 'ผ่อนลมหายใจออก'}
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold font-mono mt-1">
                  {seconds}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#6E6E60] max-w-xs leading-relaxed">
              ทำตามจังหวะนี้ 3 รอบ จะช่วยกระตุ้นระบบประสาท Parasympathetic ให้หัวใจเต้นช้าลงและสมองคลายความวิตก
            </p>
          </div>
        )}

        {activeTab === 'grounding' && (
          <div className="my-4 text-left bg-[#EFE9DE]/50 p-4 rounded-2xl border border-[#E2DACB] space-y-2.5 text-xs text-[#2C2C24]">
            <div className="font-bold text-[#55634E] text-sm mb-1 text-center">
              ดึงสติกลับมาที่ร่างกาย (5-4-3-2-1 Grounding)
            </div>
            <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E2DACB] shadow-2xs flex items-center gap-2">
              <span className="font-bold text-[#55634E] flex items-center gap-1.5 shrink-0">
                <Eye className="w-4 h-4 text-[#828D7A]" />
                <span>5 สิ่ง:</span>
              </span>
              <span>มองหา 5 สิ่งรอบตัวที่คุณมองเห็นตอนนี้</span>
            </div>
            <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E2DACB] shadow-2xs flex items-center gap-2">
              <span className="font-bold text-[#55634E] flex items-center gap-1.5 shrink-0">
                <Hand className="w-4 h-4 text-[#828D7A]" />
                <span>4 สิ่ง:</span>
              </span>
              <span>สัมผัส 4 สิ่งใกล้ตัว (เช่น เสื้อผ้า โต๊ะ มือถือ)</span>
            </div>
            <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E2DACB] shadow-2xs flex items-center gap-2">
              <span className="font-bold text-[#55634E] flex items-center gap-1.5 shrink-0">
                <Ear className="w-4 h-4 text-[#828D7A]" />
                <span>3 สิ่ง:</span>
              </span>
              <span>ตั้งใจฟัง 3 เสียงที่ได้ยินในห้องตอนนี้</span>
            </div>
            <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E2DACB] shadow-2xs flex items-center gap-2">
              <span className="font-bold text-[#55634E] flex items-center gap-1.5 shrink-0">
                <Wind className="w-4 h-4 text-[#828D7A]" />
                <span>2 สิ่ง:</span>
              </span>
              <span>ดมกลิ่น 2 กลิ่นรอบตัว</span>
            </div>
            <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E2DACB] shadow-2xs flex items-center gap-2">
              <span className="font-bold text-[#55634E] flex items-center gap-1.5 shrink-0">
                <Coffee className="w-4 h-4 text-[#828D7A]" />
                <span>1 สิ่ง:</span>
              </span>
              <span>สัมผัสรสชาติในปาก หรือจิบน้ำ 1 อึก</span>
            </div>
          </div>
        )}

        {activeTab === 'affirmation' && (
          <div className="my-6 space-y-4">
            <MascotCloud size="sm" mood="cheering" />
            <div className="space-y-2">
              {affirmations.map((text, i) => (
                <div
                  key={i}
                  className="p-3 bg-[#FAF3E5] rounded-2xl border border-[#EDE0C4] text-xs font-medium text-[#8C6D37] leading-relaxed"
                >
                  {text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#E2DACB]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#828D7A] hover:bg-[#6C7764] text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>รู้สึกดีขึ้นแล้ว กลับไปลุยงานต่อ</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
