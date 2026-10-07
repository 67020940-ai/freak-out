import React, { useState } from 'react';
import { Task, CalendarEvent } from '../types';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Coffee,
  Plus,
  ArrowRight,
  ExternalLink,
  Sliders,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { MascotCloud } from './MascotCloud';

interface CalendarViewProps {
  tasks: Task[];
  onStartFocus: (task: Task) => void;
  isProUser: boolean;
  onOpenPricing: () => void;
}

const DEFAULT_SCHEDULE: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'บรรยายวิชาการตลาดดิจิทัล (ห้อง 402)',
    startTime: '09:00',
    endTime: '11:30',
    category: 'class',
    source: 'google',
  },
  {
    id: 'cal-2',
    title: 'พักรับประทานอาหารกลางวัน & พักสมอง',
    startTime: '13:00',
    endTime: '14:00',
    category: 'break',
    source: 'freakout',
  },
  {
    id: 'cal-3',
    title: 'นัดประชุมกลุ่มโปรเจกต์ Freak Out',
    startTime: '14:00',
    endTime: '15:30',
    category: 'meeting',
    source: 'google',
  },
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onStartFocus,
  isProUser,
  onOpenPricing,
}) => {
  const [googleConnected, setGoogleConnected] = useState(true);
  const [appleConnected, setAppleConnected] = useState(true);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [focusShieldEnabled, setFocusShieldEnabled] = useState(true);
  const [bufferMinutes, setBufferMinutes] = useState(15);

  const [showOAuthModal, setShowOAuthModal] = useState<'google' | 'apple' | null>(null);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const handleConnectGoogle = () => {
    if (googleConnected) {
      setGoogleConnected(false);
    } else {
      setShowOAuthModal('google');
    }
  };

  const handleConfirmOAuth = () => {
    setIsOAuthLoading(true);
    setTimeout(() => {
      setIsOAuthLoading(false);
      if (showOAuthModal === 'google') setGoogleConnected(true);
      if (showOAuthModal === 'apple') setAppleConnected(true);
      setShowOAuthModal(null);
    }, 600);
  };

  // Find a pending task that fits the gap (e.g. <= 30 mins)
  const recommendedTask = tasks.find((t) => !t.completed && t.estimatedMinutes <= 45) || tasks[0];

  return (
    <div className="w-full space-y-4 pb-16">
      {/* Header Banner */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] shadow-2xs flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F0F8] border border-[#CADDEC] flex items-center justify-center shrink-0">
            <CalendarIcon className="w-5 h-5 text-[#2F5275]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-heading text-[#2C2C24]">Smart Calendar</h2>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-[#EBF0E8] text-[#3B5433] border border-[#CFDFCB]">
                AI Context-Aware
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-[#FFF4E0] text-[#8A5C1E] border border-[#F4E1BD]">
                Demo Data
              </span>
            </div>
            <p className="text-[11px] text-[#7A786C]">
              สแกนตารางเรียน/งานอัตโนมัติ เพื่อหาช่องว่างสมองโล่ง
            </p>
          </div>
        </div>

        {/* Focus Shield Status */}
        <div className="flex items-center justify-between bg-white px-3 py-2 rounded-2xl border border-[#E8E2D5] shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5F7554]" />
            <span className="text-xs font-bold text-[#2C2C24]">Focus Shield</span>
            <span className="text-[9px] bg-[#EAE4D9] text-[#6E6D62] px-1.5 py-0.2 rounded-full font-mono">
              Roadmap: Calendar API
            </span>
          </div>
          <span className="text-[11px] text-[#5F7554] font-semibold bg-[#EBF0E8] px-2 py-0.5 rounded-full">
            {focusShieldEnabled ? 'บล็อกเวลา Do Not Disturb' : 'ปิด'}
          </span>
        </div>
      </div>

      {/* Sync Accounts */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#7A786C] uppercase tracking-wider block">
            🔗 ปฏิทินที่เชื่อมต่อ
          </span>
          <span className="text-[10px] text-[#8A887A] font-medium">
            (กดเพื่อจำลองการเชื่อมต่อ)
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {/* Google */}
          <button
            type="button"
            onClick={handleConnectGoogle}
            className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer text-left ${
              googleConnected ? 'bg-white border-[#CFDFCB]' : 'bg-[#F3EFE6] border-[#E2DACB] opacity-75'
            }`}
          >
            <span className="text-xs font-bold text-[#2C2C24]">📅 Google</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              googleConnected ? 'bg-[#EBF0E8] text-[#3B5433]' : 'bg-white text-[#7A786C]'
            }`}>
              {googleConnected ? 'เชื่อมแล้ว' : 'เชื่อมต่อ'}
            </span>
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={() => setAppleConnected(!appleConnected)}
            className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer text-left ${
              appleConnected ? 'bg-white border-[#CFDFCB]' : 'bg-[#F3EFE6] border-[#E2DACB] opacity-75'
            }`}
          >
            <span className="text-xs font-bold text-[#2C2C24]">🍏 Apple</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              appleConnected ? 'bg-[#EBF0E8] text-[#3B5433]' : 'bg-white text-[#7A786C]'
            }`}>
              {appleConnected ? 'เชื่อมแล้ว' : 'เชื่อมต่อ'}
            </span>
          </button>

          {/* Outlook */}
          <button
            type="button"
            onClick={() => {
              if (!isProUser) {
                onOpenPricing();
              } else {
                setOutlookConnected(!outlookConnected);
              }
            }}
            className="p-2.5 bg-white rounded-xl border border-[#EAE4D9] flex items-center justify-between cursor-pointer text-left"
          >
            <span className="text-xs font-bold text-[#2C2C24]">💼 Outlook</span>
            <span className="text-[10px] text-[#B87A24] font-bold">Pro</span>
          </button>
        </div>
      </div>

      {/* Mock OAuth Modal */}
      {showOAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-[#E2DACB] space-y-4">
            <div className="text-center space-y-1">
              <span className="text-3xl">📅</span>
              <h3 className="font-heading font-bold text-base text-[#2C2C24]">
                เชื่อมต่อ {showOAuthModal === 'google' ? 'Google Calendar' : 'Apple Calendar'}
              </h3>
              <p className="text-xs text-[#7A786C]">
                Freak Out ขออนุญาตอ่านตารางเรียน/นัดหมาย เพื่อค้นหาช่องว่างเวลาและสร้างบล็อกสมาธิ
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EAE4D9] text-xs space-y-1.5 text-[#5C5B50]">
              <div className="flex items-center gap-1.5 font-semibold text-[#2C2C24]">
                <span>🔒</span> ความปลอดภัยของข้อมูล:
              </div>
              <p className="text-[11px] leading-relaxed">
                ในเวอร์ชันทดสอบนี้ เป็นหน้าจำลองสิทธิ์ (OAuth Demo Simulation) โดยข้อมูลตารางเรียนจะถูกประมวลผลบนเครื่องของคุณเท่านั้น
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowOAuthModal(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#FAF8F5] text-xs font-semibold text-[#6E6E60] border border-[#E2DACB] cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmOAuth}
                disabled={isOAuthLoading}
                className="flex-1 py-2 px-3 rounded-xl bg-[#6C7764] hover:bg-[#586350] text-xs font-bold text-white shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isOAuthLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>กำลังเชื่อมต่อ...</span>
                  </>
                ) : (
                  <span>อนุญาตและเชื่อมต่อ</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calm Timeline View */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E2DACB] space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#2C2C24]">เส้นเวลาวันนี้</span>
            <span className="text-[11px] text-[#7A786C]">• อังคาร 2 ต.ค.</span>
          </div>
          <span className="text-[10px] font-semibold text-[#5F7554] bg-[#E2ECE0] px-2 py-0.5 rounded-full border border-[#CFDFCB]">
            ตรวจพบ 2 ช่วงว่างโฟกัส
          </span>
        </div>

        {/* Timeline Items */}
        <div className="space-y-3">
          {/* Event 1 */}
          <div className="flex gap-2.5 items-start">
            <div className="w-12 text-right shrink-0 pt-0.5">
              <span className="text-xs font-bold text-[#2C2C24] block">09:00</span>
              <span className="text-[10px] text-[#8C8A7D]">11:30</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#E58270] mt-1 shrink-0 ring-4 ring-[#FDECE8]" />
            <div className="flex-1 bg-white p-3 rounded-2xl border border-[#EAE4D9] shadow-2xs">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-xs font-bold text-[#2C2C24] leading-snug">บรรยายวิชาการตลาดดิจิทัล</span>
                <span className="text-[9px] text-[#8C8A7D] bg-[#F2EEE9] px-1.5 py-0.2 rounded-md shrink-0">Google</span>
              </div>
              <p className="text-[10px] text-[#7A786C]">ห้อง 402 • มีเรียนต่อเนื่อง 2.5 ชม. (จบแล้ว)</p>
            </div>
          </div>

          {/* AI AUTO-SLOT GAP HIGHLIGHT (Crucial Feature!) */}
          <div className="flex gap-2.5 items-start">
            <div className="w-12 text-right shrink-0 pt-2">
              <span className="text-xs font-bold text-[#6C7764] block">11:30</span>
              <span className="text-[10px] text-[#5F7554]">13:00</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#6C7764] mt-2.5 shrink-0 ring-4 ring-[#E2ECE0]" />

            {/* Smart Slot Box */}
            <div className="flex-1 bg-linear-to-br from-[#F5EFE6] to-[#FAF8F5] p-3.5 rounded-2xl border-2 border-dashed border-[#6C7764] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6C7764] text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> ช่วงว่างสมองโล่ง (1.5 ชม.)
                </span>
                <span className="text-[10px] text-[#7A786C]">ช่วงพักเที่ยง</span>
              </div>

              <div>
                <div className="text-xs font-bold text-[#2C2C24]">
                  💡 แนะนำทำ: <span className="text-[#3B5433]">{recommendedTask?.title || 'เคลียร์สรุปรายงาน'}</span>
                </div>
                <p className="text-[10px] text-[#7A786C] mt-0.5 leading-snug">
                  ใช้เวลา ~{recommendedTask?.estimatedMinutes || 25} นาที เสร็จแล้วยังมีเวลาพักกินข้าวสบายๆ อีก 1 ชั่วโมงเต็ม!
                </p>
              </div>

              {recommendedTask && (
                <button
                  onClick={() => onStartFocus(recommendedTask)}
                  className="w-full py-2 px-3 rounded-xl bg-[#6C7764] hover:bg-[#586350] active:scale-95 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>เริ่มโฟกัสงานนี้ทันที</span>
                </button>
              )}
            </div>
          </div>

          {/* Event 2: Lunch Buffer */}
          <div className="flex gap-2.5 items-start">
            <div className="w-12 text-right shrink-0 pt-0.5">
              <span className="text-xs font-bold text-[#2C2C24] block">13:00</span>
              <span className="text-[10px] text-[#8C8A7D]">14:00</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#B88E76] mt-1 shrink-0 ring-4 ring-[#FFF4E8]" />
            <div className="flex-1 bg-white p-3 rounded-2xl border border-[#EAE4D9] shadow-2xs flex items-center justify-between gap-1">
              <div className="flex items-center gap-2 min-w-0">
                <Coffee className="w-3.5 h-3.5 text-[#B88E76] shrink-0" />
                <span className="text-xs font-bold text-[#2C2C24] truncate">พักรับประทานอาหารกลางวัน</span>
              </div>
              <span className="text-[9px] text-[#7A786C] bg-[#FAF8F5] px-1.5 py-0.2 rounded-md border border-[#EAE4D9] shrink-0">Buffer</span>
            </div>
          </div>

          {/* Event 3: Meeting */}
          <div className="flex gap-2.5 items-start">
            <div className="w-12 text-right shrink-0 pt-0.5">
              <span className="text-xs font-bold text-[#2C2C24] block">14:00</span>
              <span className="text-[10px] text-[#8C8A7D]">15:30</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#4A729A] mt-1 shrink-0 ring-4 ring-[#E8F2FA]" />
            <div className="flex-1 bg-white p-3 rounded-2xl border border-[#EAE4D9] shadow-2xs">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-xs font-bold text-[#2C2C24] leading-snug">นัดประชุมกลุ่ม Freak Out</span>
                <span className="text-[9px] text-[#8C8A7D] bg-[#F2EEE9] px-1.5 py-0.2 rounded-md shrink-0">Google</span>
              </div>
              <p className="text-[10px] text-[#7A786C]">คุยเรื่อง Business Model Canvas และสไลด์นำเสนอ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
