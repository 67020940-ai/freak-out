import React, { useState, useEffect } from 'react';
import { X, Wind, Sparkles, Heart, RefreshCw } from 'lucide-react';
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
    'งานกองโตไม่ได้แปลว่าคุณทำไม่ทัน ค่อยๆ ทำทีละ 1 ข้อนะ 🌸',
    'คุณไม่จำเป็นต้องสมบูรณ์แบบ แค่ลงมือทำเวอร์ชันร่างแรกก็ยอดเยี่ยมแล้ว! ✨',
    'ความเครียดคือสัญญาณว่าคุณแคร์ แต่อย่าปล่อยให้มันทำร้ายใจคุณนะ 💜',
    'หายใจเข้าลึกๆ... ปล่อยวางความกังวลในอนาคต แล้วอยู่กับปัจจุบัน 🌿',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C24]/60 backdrop-blur-md">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E2DACB] p-6 sm:p-7 relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#8A8A7A] hover:text-[#2C2C24] hover:bg-[#EFE9DE] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9DE] text-[#55634E] text-xs font-bold mb-2 border border-[#E2DACB]">
          <Wind className="w-3.5 h-3.5 text-[#828D7A]" />
          <span>SOS Reset Your Mind</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#2C2C24]">
          ผ่อนคลายและเคลียร์สมอง 🌿
        </h2>
        <p className="text-xs sm:text-sm text-[#6E6E60] max-w-xs mx-auto mt-1">
          เวลาที่รู้สึกตื่นตระหนก คิดวน หรือสมองตื้อ ให้เวลาตัวเอง 1 นาทีตรงนี้นะ
        </p>

        {/* Tab Selection */}
        <div className="flex items-center justify-center gap-2 my-4">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'breathing' ? 'bg-[#828D7A] text-white shadow-2xs' : 'bg-[#EFE9DE] text-[#6E6E60] hover:bg-[#E5DDD0]'
            }`}
          >
            🌬️ ฝึกหายใจ 4-7-8
          </button>
          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'grounding' ? 'bg-[#828D7A] text-white shadow-2xs' : 'bg-[#EFE9DE] text-[#6E6E60] hover:bg-[#E5DDD0]'
            }`}
          >
            🖐️ เทคนิค 5-4-3-2-1
          </button>
          <button
            onClick={() => setActiveTab('affirmation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'affirmation' ? 'bg-[#828D7A] text-white shadow-2xs' : 'bg-[#EFE9DE] text-[#6E6E60] hover:bg-[#E5DDD0]'
            }`}
          >
            🌿 ปลอบประโลมใจ
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
            <div className="p-2 bg-[#FAF8F5] rounded-xl border border-[#E2DACB] shadow-2xs">
              <span className="font-bold text-[#828D7A]">👁️ 5 สิ่ง:</span> มองหา 5 สิ่งรอบตัวที่คุณมองเห็นตอนนี้
            </div>
            <div className="p-2 bg-[#FAF8F5] rounded-xl border border-[#E2DACB] shadow-2xs">
              <span className="font-bold text-[#828D7A]">🖐️ 4 สิ่ง:</span> สัมผัส 4 สิ่งใกล้ตัว (เช่น เสื้อผ้า โต๊ะ มือถือ)
            </div>
            <div className="p-2 bg-[#FAF8F5] rounded-xl border border-[#E2DACB] shadow-2xs">
              <span className="font-bold text-[#828D7A]">👂 3 สิ่ง:</span> ตั้งใจฟัง 3 เสียงที่ได้ยินในห้องตอนนี้
            </div>
            <div className="p-2 bg-[#FAF8F5] rounded-xl border border-[#E2DACB] shadow-2xs">
              <span className="font-bold text-[#828D7A]">👃 2 สิ่ง:</span> ดมกลิ่น 2 กลิ่นรอบตัว
            </div>
            <div className="p-2 bg-[#FAF8F5] rounded-xl border border-[#E2DACB] shadow-2xs">
              <span className="font-bold text-[#828D7A]">👅 1 สิ่ง:</span> สัมผัสรสชาติในปาก หรือจิบน้ำ 1 อึก
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
            className="w-full py-2.5 rounded-xl bg-[#828D7A] hover:bg-[#6C7764] text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
          >
            รู้สึกดีขึ้นแล้ว กลับไปลุยงานต่อ ✨
          </button>
        </div>
      </div>
    </div>
  );
};
