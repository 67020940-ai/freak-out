import React, { useState } from 'react';
import { X, Check, Crown, Sparkles, Zap, Heart, Shield, CheckCircle2, CreditCard, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProUser?: boolean;
  onUpgradePro?: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  isProUser = false,
  onUpgradePro,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<'student' | 'pro'>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'apple' | 'promptpay' | 'card'>('promptpay');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleActivateTrial = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FFE17D', '#FFB480', '#A3E4D7', '#F1948A'],
    });

    if (onUpgradePro) {
      onUpgradePro();
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-t-[36px] w-full max-h-[94%] overflow-y-auto shadow-2xl border-t border-[#E8E2D5] p-5 relative animate-in slide-in-from-bottom duration-300 no-scrollbar">
        {/* iOS Pull Handle */}
        <div className="w-10 h-1 bg-[#2C2C24]/20 rounded-full mx-auto mb-3 shrink-0" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#8A8A7A] hover:text-[#2C2C24] hover:bg-[#EFE9DE] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF4E0] text-[#B87A24] text-[11px] font-bold mb-2 border border-[#F4E1BD]">
            <Crown className="w-3 h-3 fill-current" />
            <span>Freak Out Pro & Student Plans</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-[#2C2C24]">
            เลือกแผนการใช้งานที่เหมาะกับคุณ 🌿
          </h2>
          <p className="text-xs text-[#6E6E60] max-w-xs mx-auto mt-1">
            ใช้งานฟรีพร้อมโฆษณา หรืออัปเกรดเพื่อตัดสิ่งรบกวน ไร้โฆษณา 100% พร้อม AI ไม่จำกัด
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-[#EFE9DE] border border-[#E2DACB] mt-3.5 text-xs font-bold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 rounded-xl transition cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#2C2C24] shadow-xs'
                  : 'text-[#6E6E60]'
              }`}
            >
              รายเดือน
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                billingCycle === 'annual'
                  ? 'bg-[#828D7A] text-white shadow-xs'
                  : 'text-[#6E6E60]'
              }`}
            >
              <span>รายปี</span>
              <span className="px-1.5 py-0.2 bg-[#FAF3E5] text-[#8C6D37] rounded text-[10px] font-bold">
                ลด 35% 🔥
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Stack */}
        <div className="flex flex-col gap-3.5 mb-6">
          {/* Card 1: Free Plan */}
          <div className="bg-white rounded-3xl p-5 border border-[#EAE4D9] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#7A786C] uppercase">สายฟรี (Basic)</span>
              <div className="text-2xl font-extrabold text-[#2C2C24] font-heading mt-1">
                ฿0 <span className="text-xs font-normal text-[#7A786C]">/ ตลอดชีพ</span>
              </div>
              <p className="text-[11px] text-[#7A786C] mt-1">
                เครื่องมือจัดการงานและลดความกังวลขั้นพื้นฐาน
              </p>

              <div className="space-y-2 mt-4 text-xs text-[#2C2C24]">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#5F7554] shrink-0" />
                  <span>จดงาน To-Do ไม่จำกัด</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#5F7554] shrink-0" />
                  <span>AI Smart Pick วันละ 3-5 ครั้ง</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#5F7554] shrink-0" />
                  <span>โหมด Focus Timer & เสียงฝน</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#8C8A7D]">
                  <span>📺 มีโฆษณาแบนเนอร์และคลิปสปอนเซอร์</span>
                </div>
              </div>
            </div>

            <div className="mt-5 py-2 rounded-xl bg-[#F2EEE9] text-center text-xs font-bold text-[#7A786C]">
              {!isProUser ? 'กำลังใช้งานอยู่' : 'แผนฟรี'}
            </div>
          </div>

          {/* Card 2: Student Plan */}
          <div
            onClick={() => setSelectedPlan('student')}
            className={`rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
              selectedPlan === 'student'
                ? 'bg-[#FAF8F5] border-[#828D7A] shadow-md ring-2 ring-[#828D7A]/20'
                : 'bg-white border-[#EAE4D9] hover:border-[#D5CDC0]'
            }`}
          >
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#EAE8F5] text-[#5C4D82]">
              🎓 นักเรียน/นศ.
            </div>
            <div>
              <span className="text-xs font-bold text-[#5C4D82] uppercase">Student Plan</span>
              <div className="text-2xl font-extrabold text-[#2C2C24] font-heading mt-1">
                {billingCycle === 'monthly' ? '฿49' : '฿449'}
                <span className="text-xs font-normal text-[#7A786C]">
                  {billingCycle === 'monthly' ? '/เดือน' : '/ปี (~฿37/ด.)'}
                </span>
              </div>
              <p className="text-[11px] text-[#7A786C] mt-1">
                สำหรับผู้มีอีเมลสถาบันการศึกษา (.ac.th)
              </p>

              <div className="space-y-2 mt-4 text-xs text-[#2C2C24]">
                <div className="flex items-center gap-1.5 font-semibold text-[#3B5433]">
                  <Check className="w-3.5 h-3.5 text-[#5F7554] shrink-0" />
                  <span>ไร้โฆษณา 100% (Clean Flow)</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#828D7A] shrink-0" />
                  <span>AI Smart Pick ไม่จำกัด</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#5F7554] shrink-0" />
                  <span>ปลดล็อกคอสตูม & เสียงโฟกัสครบ</span>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center">
              <span className="text-[10px] text-[#7A786C]">ราคานักศึกษาสบายกระเป๋า</span>
            </div>
          </div>

          {/* Card 3: Pro Plan (Best Value) */}
          <div
            onClick={() => setSelectedPlan('pro')}
            className={`rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
              selectedPlan === 'pro'
                ? 'bg-linear-to-b from-[#FFF9E6] to-[#FAF8F5] border-[#C49B5C] shadow-lg ring-2 ring-[#C49B5C]/30 scale-[1.02]'
                : 'bg-white border-[#EAE4D9] hover:border-[#D5CDC0]'
            }`}
          >
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#C49B5C] text-white shadow-2xs">
              แผนแนะนำ
            </div>
            <div>
              <span className="text-xs font-bold text-[#B87A24] uppercase">Freak Out Pro</span>
              <div className="text-2xl font-extrabold text-[#2C2C24] font-heading mt-1">
                {billingCycle === 'monthly' ? '฿79' : '฿699'}
                <span className="text-xs font-normal text-[#7A786C]">
                  {billingCycle === 'monthly' ? '/เดือน' : '/ปี (~฿58/ด.)'}
                </span>
              </div>
              <p className="text-[11px] text-[#7A786C] mt-1">
                ปลดล็อกระบบ Focus Spaces สไตล์ Notion, AI De-clutter ไม่จำกัด และกันนัดซ้อนใน Google Calendar
              </p>

              <div className="space-y-2 mt-4 text-xs text-[#2C2C24]">
                <div className="flex items-center gap-1.5 font-bold text-[#3B5433]">
                  <Check className="w-3.5 h-3.5 text-[#5F7554] shrink-0" />
                  <span>สร้าง Focus Spaces (ห้องทำงานแยกตามบริบท) ไม่จำกัด</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[#55634E]">
                  <Zap className="w-3.5 h-3.5 text-[#6C7764] shrink-0" />
                  <span>AI Cognitive Copilot & Decompose ไม่จำกัด</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[#7C5CA5]">
                  <Shield className="w-3.5 h-3.5 text-[#7C5CA5] shrink-0" />
                  <span>Google Calendar Auto-Shielding ป้องกันนัดซ้อนอัตโนมัติ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C49B5C] shrink-0" />
                  <span>ปลดล็อกโทนสีธรรมชาติ Nordic Earth ทั้งหมดของน้องเมฆ</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#3B5433]">
                  <Check className="w-3.5 h-3.5 text-[#5F7554] shrink-0" />
                  <span>ไร้โฆษณา สะอาดตา 100%</span>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center">
              <span className="text-[10px] font-bold text-[#B87A24]">คุ้มค่าที่สุด ประหยัด 35%</span>
            </div>
          </div>
        </div>

        {/* Real Payment Options Display */}
        <div className="bg-[#EFE9DE]/60 rounded-2xl p-4 border border-[#E2DACB] mb-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#2C2C24] block">ช่องทางการชำระเงินที่รองรับ:</span>
              <span className="text-[11px] text-[#7A786C]">ตัดรอบบิลอัตโนมัติ ยกเลิกได้ตลอดเวลา ไม่มีข้อผูกมัด</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaymentMethod('promptpay')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                  paymentMethod === 'promptpay' ? 'bg-white border-[#828D7A] text-[#2C2C24] shadow-2xs' : 'bg-white/60 border-[#EAE4D9]'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-[#1D3557]" />
                <span>PromptPay</span>
              </button>
              <button
                onClick={() => setPaymentMethod('apple')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                  paymentMethod === 'apple' ? 'bg-white border-[#828D7A] text-[#2C2C24] shadow-2xs' : 'bg-white/60 border-[#EAE4D9]'
                }`}
              >
                <span>🍏 Apple Pay</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                  paymentMethod === 'card' ? 'bg-white border-[#828D7A] text-[#2C2C24] shadow-2xs' : 'bg-white/60 border-[#EAE4D9]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>บัตรเดบิต/เครดิต</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trial Activation Button */}
        {showSuccess ? (
          <div className="w-full py-4 rounded-2xl bg-[#E2ECE0] text-[#3B5433] font-bold text-sm text-center border border-[#CFDFCB] flex items-center justify-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5" />
            <span>เปิดใช้งานโหมด PRO สำเร็จแล้ว! ยินดีต้อนรับสู่ประสบการณ์ไร้โฆษณา ✨</span>
          </div>
        ) : (
          <button
            onClick={handleActivateTrial}
            className="w-full py-3.5 rounded-2xl bg-[#828D7A] hover:bg-[#6C7764] text-white font-bold text-sm shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>เริ่มทดลองใช้ฟรี 7 วัน ({selectedPlan === 'pro' ? 'Freak Out Pro' : 'Student Plan'})</span>
          </button>
        )}
      </div>
    </div>
  );
};
