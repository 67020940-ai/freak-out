import React from 'react';
import { EnergyLevel } from '../types';
import { Battery, BatteryCharging, Zap, BatteryLow, BatteryMedium } from 'lucide-react';

interface EnergyGaugeSliderProps {
  value: EnergyLevel;
  onChange: (level: EnergyLevel) => void;
}

export interface EnergyConfig {
  id: EnergyLevel;
  step: number;
  label: string;
  badge: string;
  desc: string;
  color: string;
  activeBg: string;
  activeBorder: string;
  textColor: string;
}

export const ENERGY_CONFIGS: EnergyConfig[] = [
  {
    id: 'depleted',
    step: 1,
    label: 'หมดแรง',
    badge: '1. หมดแรง',
    desc: 'งานเบาๆ 5-10 นาที ค่อยๆ ทำ',
    color: '#D47559',
    activeBg: 'bg-[#FDF2F0]',
    activeBorder: 'border-[#F1B9AC]',
    textColor: 'text-[#B04C33]',
  },
  {
    id: 'tired',
    step: 2,
    label: 'ล้า ๆ',
    badge: '2. ล้า ๆ',
    desc: 'งานง่าย ไม่ต้องใช้สมองเยอะ',
    color: '#DE9B52',
    activeBg: 'bg-[#FEF8ED]',
    activeBorder: 'border-[#F8D8A7]',
    textColor: 'text-[#AC6F24]',
  },
  {
    id: 'okay',
    step: 3,
    label: 'พอไหว',
    badge: '3. พอไหว',
    desc: 'งานขนาดกลางทั่วๆ ไป',
    color: '#828D7A',
    activeBg: 'bg-[#F2F5F0]',
    activeBorder: 'border-[#CBD5C5]',
    textColor: 'text-[#485642]',
  },
  {
    id: 'ready',
    step: 4,
    label: 'พร้อมลุย',
    badge: '4. พร้อมลุย',
    desc: 'สมองแล่น มีสมาธิดี ลุยงานหลักได้',
    color: '#5C8A8A',
    activeBg: 'bg-[#EEF6F6]',
    activeBorder: 'border-[#BCD7D7]',
    textColor: 'text-[#2D5A5A]',
  },
  {
    id: 'full',
    step: 5,
    label: 'พลังเต็ม!',
    badge: '5. พลังเต็ม!',
    desc: 'พลังงานล้นเหลือ ลุยงานชิ้นใหญ่ยากๆ ได้เลย',
    color: '#4B7354',
    activeBg: 'bg-[#EBF3EC]',
    activeBorder: 'border-[#BCD2BF]',
    textColor: 'text-[#2B4E33]',
  },
];

export const EnergyGaugeSlider: React.FC<EnergyGaugeSliderProps> = ({ value, onChange }) => {
  const currentIndex = ENERGY_CONFIGS.findIndex((c) => c.id === value);
  const activeConfig = ENERGY_CONFIGS[currentIndex >= 0 ? currentIndex : 2];
  const fillPercentage = (( (currentIndex >= 0 ? currentIndex : 2) + 1) / 5) * 100;

  return (
    <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] shadow-2xs space-y-3">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-heading text-[#2C2C24]">
            เกจวัดพลังงานวันนี้
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${activeConfig.activeBg} ${activeConfig.activeBorder} ${activeConfig.textColor}`}>
            {activeConfig.badge}
          </span>
        </div>
        <span className="text-[11px] text-[#7A786C]">
          {activeConfig.desc}
        </span>
      </div>

      {/* Vertical Pill Segments (Horizontal Container with 5 vertical pill bars matching screenshot) */}
      <div className="grid grid-cols-5 gap-2 pt-1">
        {ENERGY_CONFIGS.map((cfg, idx) => {
          const isSelected = cfg.id === value;
          const isFilled = idx <= (currentIndex >= 0 ? currentIndex : 2);

          return (
            <button
              key={cfg.id}
              type="button"
              aria-label={cfg.badge}
              onClick={() => onChange(cfg.id)}
              className={`group flex flex-col items-center gap-2 p-2 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? `${cfg.activeBg} ${cfg.activeBorder} ring-2 ring-black/10 shadow-xs scale-102`
                  : 'bg-white border-[#E8E2D5] hover:bg-white/80 hover:border-[#D5CDC0]'
              }`}
            >
              {/* Vertical Capsule Pill */}
              <div className="relative w-5 h-16 rounded-full bg-[#EAE5D9] p-0.5 flex flex-col justify-end overflow-hidden border border-[#DDD5C5]">
                <div
                  className="w-full rounded-full transition-all duration-300"
                  style={{
                    height: isFilled ? '100%' : '0%',
                    backgroundColor: isFilled ? cfg.color : 'transparent',
                    opacity: isSelected ? 1 : 0.65,
                  }}
                />
              </div>

              {/* Level Number & Label */}
              <div className="text-center">
                <span className={`block text-[11px] font-bold ${isSelected ? cfg.textColor : 'text-[#4A4A3E]'}`}>
                  {cfg.badge}
                </span>
                <span className="sr-only">{cfg.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Level description bar */}
      <div className="bg-white/90 rounded-2xl px-3 py-2 border border-[#EAE4D9] flex items-center justify-between text-xs">
        <span className="text-[#8C8A7D]">ระบบจะจัดลำดับงานตามพลังงาน:</span>
        <span className={`font-bold ${activeConfig.textColor}`}>
          {activeConfig.label} ({fillPercentage}% ชาร์จ)
        </span>
      </div>
    </div>
  );
};
