import React, { useState } from 'react';
import { X, Check, Crown, Sparkles, Zap, Heart, Shield } from 'lucide-react';
import { MascotCloud } from './MascotCloud';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C24]/50 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2DACB] p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#8A8A7A] hover:text-[#2C2C24] hover:bg-[#EFE9DE] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9DE] text-[#55634E] text-xs font-bold mb-2 border border-[#E2DACB]">
            <Crown className="w-3.5 h-3.5 text-[#828D7A]" />
            <span>freak out Freemium & Subscription</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#2C2C24]">
            เลือกแผนการใช้งานที่เหมาะกับคุณ 🌿
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6E60] max-w-md mx-auto mt-1">
            ใช้งานฟรีได้ตลอดชีพ หรืออัปเกรดเพื่อปลดล็อก AI วิเคราะห์เชิงลึกและธีมสุดพิเศษ
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-[#EFE9DE] border border-[#E2DACB] mt-4 text-xs font-bold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-xl transition cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-[#FAF8F5] text-[#2C2C24] shadow-2xs border border-[#E2DACB]' : 'text-[#6E6E60]'
              }`}
            >
              รายเดือน
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                billingCycle === 'annual' ? 'bg-[#828D7A] text-white shadow-2xs' : 'text-[#6E6E60]'
              }`}
            >
              <span>รายปี</span>
              <span className="px-1.5 py-0.2 bg-[#FAF3E5] text-[#8C6D37] rounded text-[10px] border border-[#EDE0C4]">ประหยัด 30%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Free Plan */}
          <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 border border-[#E2DACB] flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-[#55634E] mb-1">แผนเริ่มต้น (Free)</div>
              <div className="text-3xl font-extrabold text-[#2C2C24] font-heading">
                ฿0 <span className="text-xs font-normal text-[#6E6E60]">/ ตลอดชีพ</span>
              </div>
              <p className="text-xs text-[#6E6E60] mt-1">
                เหมาะสำหรับนักศึกษาที่ต้องการเครื่องมือช่วยจัดการงานประจำวัน
              </p>

              <div className="space-y-2.5 mt-5 text-xs text-[#2C2C24]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#828D7A] shrink-0" />
                  <span>จัดการงานและ To-Do ไม่จำกัด</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#828D7A] shrink-0" />
                  <span>ระบบจำแนกตามระดับพลังงาน (Energy Tags)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#828D7A] shrink-0" />
                  <span>โหมด Focus Timer & เสียงสร้างสมาธิ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#828D7A] shrink-0" />
                  <span>สะสมแต้ม XP, Badges, และนับ Streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#828D7A] shrink-0" />
                  <span>ระบบ SOS ผ่อนคลายฝึกหายใจ 4-7-8</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 mt-6 rounded-2xl bg-[#EFE9DE] hover:bg-[#E5DDD0] text-[#2C2C24] font-bold text-xs border border-[#E2DACB] transition cursor-pointer"
            >
              ใช้งานแผนนี้อยู่แล้ว
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-b from-[#EFE9DE]/80 via-[#FAF8F5] to-[#F6EFEA] rounded-3xl p-5 sm:p-6 border-2 border-[#828D7A] shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#B88E76] text-white shadow-2xs">
                ยอดนิยม 🔥
              </span>
            </div>

            <div>
              <div className="text-sm font-bold text-[#55634E] mb-1">
                Student & Pro (Premium)
              </div>
              <div className="text-3xl font-extrabold text-[#2C2C24] font-heading">
                {billingCycle === 'monthly' ? '฿49' : '฿390'}{' '}
                <span className="text-xs font-normal text-[#6E6E60]">
                  {billingCycle === 'monthly' ? '/ เดือน' : '/ ปี (~฿32/ด.)'}
                </span>
              </div>
              <p className="text-xs text-[#828D7A] mt-1">
                🎓 ราคานักศึกษา เพื่อการทำงานที่มีประสิทธิภาพและสุขภาพจิตที่ดี
              </p>

              <div className="space-y-2.5 mt-5 text-xs text-[#2C2C24]">
                <div className="flex items-center gap-2 font-semibold">
                  <Sparkles className="w-4 h-4 text-[#828D7A] shrink-0" />
                  <span>Personalized AI Smart Recommendation ไม่จำกัด</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Zap className="w-4 h-4 text-[#B88E76] shrink-0" />
                  <span>AI ช่วยแตกก้าวย่อย Micro-steps อัจฉริยะ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#828D7A] shrink-0" />
                  <span>รายงานสถิติพฤติกรรมเชิงลึก (Productivity Insights)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#B88E76] shrink-0" />
                  <span>สกินและธีมมาสคอต Cloud พิเศษ + สติกเกอร์ Exclusive</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#8C6D37] shrink-0" />
                  <span>โล่ป้องกัน Streak ขาด 1 วัน/เดือน</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert('ขอบคุณที่สนใจ freak out Premium! ฟีเจอร์นี้จำลองในเวอร์ชันต้นแบบ');
                onClose();
              }}
              className="w-full py-3 mt-6 rounded-2xl bg-[#828D7A] hover:bg-[#6C7764] text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              ทดลองใช้ฟรี 7 วัน ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
