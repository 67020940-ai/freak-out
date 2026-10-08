import React, { useState, useEffect } from 'react';
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
  Info,
  RefreshCw
} from 'lucide-react';
import { fetchGoogleCalendarEvents } from '../services/calendarService';
import { getSavedSession, loginWithGoogle } from '../services/firebase';

interface CalendarViewProps {
  tasks: Task[];
  onStartFocus: (task: Task) => void;
  isProUser: boolean;
  onOpenPricing: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onStartFocus,
  isProUser,
  onOpenPricing,
}) => {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [focusShieldEnabled, setFocusShieldEnabled] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const session = getSavedSession();
    if (session?.googleAccessToken) {
      setGoogleConnected(true);
      loadEvents();
    }
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const gcalEvents = await fetchGoogleCalendarEvents();
      setEvents(gcalEvents || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'ไม่สามารถดึงข้อมูลจาก Google Calendar ได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleGoogle = async () => {
    setErrorMessage('');
    if (googleConnected) {
      setGoogleConnected(false);
      setEvents([]);
    } else {
      setIsLoading(true);
      try {
        await loginWithGoogle();
        setGoogleConnected(true);
        await loadEvents();
      } catch (err: any) {
        setErrorMessage(
          err.message ||
            'ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาตรวจสอบการตั้งค่า Firebase ในไฟล์ .env.local'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Find a pending task that fits the gap
  const recommendedTask = tasks.find((t) => !t.completed && (t.estimatedMinutes || 25) <= 45) || tasks[0];

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
              <h2 className="text-base font-bold font-heading text-[#2C2C24]">ปฏิทินและไทม์ไลน์</h2>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-[#EBF0E8] text-[#3B5433] border border-[#CFDFCB]">
                Google Calendar Sync
              </span>
            </div>
            <p className="text-[11px] text-[#7A786C]">
              สแกนตารางงานและประชุมอัตโนมัติ เพื่อค้นหาช่องว่างสมองโล่ง
            </p>
          </div>
        </div>

        {/* Focus Shield Status */}
        <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-2xl border border-[#E8E2D5] shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5F7554]" />
            <div>
              <span className="text-xs font-bold text-[#2C2C24] block">Focus Shield</span>
              <span className="text-[10px] text-[#8C8A7D]">ป้องกันการนัดซ้อนในช่วงที่ต้องการสมาธิ</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFocusShieldEnabled(!focusShieldEnabled)}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition ${
              focusShieldEnabled ? 'bg-[#EBF0E8] text-[#3B5433]' : 'bg-[#F2EEE9] text-[#7A786C]'
            }`}
          >
            {focusShieldEnabled ? 'เปิดใช้งาน' : 'ปิด'}
          </button>
        </div>
      </div>

      {/* Error / Instruction Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-[#FDECE8] border border-[#F6D7D0] text-[#C23A25] text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 shrink-0" />
            <span>แจ้งเตือนการเชื่อมต่อ</span>
          </div>
          <p className="text-[11px] leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Sync Accounts */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#7A786C] uppercase tracking-wider block">
            ปฏิทินที่เชื่อมต่อ
          </span>
          {googleConnected && (
            <button
              onClick={loadEvents}
              disabled={isLoading}
              className="text-[10px] text-[#6C7764] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>ซิงค์ข้อมูลใหม่</span>
            </button>
          )}
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#EAE4D9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8F0F8] border border-[#CADDEC] flex items-center justify-center text-[#2F5275] font-bold text-xs">
              G
            </div>
            <div>
              <span className="text-xs font-bold text-[#2C2C24] block">Google Calendar</span>
              <span className="text-[10px] text-[#8C8A7D]">
                {googleConnected ? 'ซิงค์กับบัญชี Google แล้ว' : 'เชื่อมต่อเพื่อดึงตารางนัดหมายจริง'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleGoogle}
            disabled={isLoading}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              googleConnected
                ? 'bg-[#EBF0E8] text-[#3B5433] hover:bg-[#DDE9D9]'
                : 'bg-[#6C7764] text-white hover:bg-[#586350]'
            }`}
          >
            {isLoading ? 'กำลังโหลด...' : googleConnected ? 'ยกเลิกการเชื่อมต่อ' : 'เชื่อมต่อ'}
          </button>
        </div>
      </div>

      {/* Calm Timeline View */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E2DACB] space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#2C2C24]">เส้นเวลาวันนี้</span>
            <span className="text-[11px] text-[#7A786C]">• วันนี้</span>
          </div>
          <span className="text-[10px] font-semibold text-[#5F7554] bg-[#E2ECE0] px-2 py-0.5 rounded-full border border-[#CFDFCB]">
            {events.length > 0 ? `มีกิจกรรม ${events.length} รายการ` : 'ไม่มีกิจกรรมในปฏิทินวันนี้'}
          </span>
        </div>

        {/* Timeline Items or Empty State */}
        {events.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#EFE9DE] border border-[#E0D7C6] mx-auto flex items-center justify-center text-[#7A786C]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#2C2C24]">
              {googleConnected ? 'วันนี้ไม่มีกิจกรรมใน Google Calendar ของคุณ' : 'ยังไม่ได้เชื่อมต่อ Google Calendar'}
            </p>
            <p className="text-[11px] text-[#7A786C] max-w-xs mx-auto">
              {googleConnected
                ? 'สมองโล่งตลอดวัน! เหมาะกับการเริ่มทำ 1 งานที่สำคัญได้ทันที'
                : 'แตะปุ่ม "เชื่อมต่อ" ด้านบน หรือล็อกอินด้วย Google เพื่อดึงตารางกิจกรรมจริง'}
            </p>
          </div>
        ) : (
        <div className="space-y-3">
          {events.map((evt, idx) => (
            <React.Fragment key={evt.id || idx}>
              <div className="flex gap-2.5 items-start">
                <div className="w-12 text-right shrink-0 pt-0.5">
                  <span className="text-xs font-bold text-[#2C2C24] block">{evt.startTime}</span>
                  <span className="text-[10px] text-[#8C8A7D]">{evt.endTime}</span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#E58270] mt-1 shrink-0 ring-4 ring-[#FDECE8]" />
                <div className="flex-1 bg-white p-3 rounded-2xl border border-[#EAE4D9] shadow-2xs">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-[#2C2C24] leading-snug">{evt.title}</span>
                    <span className="text-[9px] text-[#8C8A7D] bg-[#F2EEE9] px-1.5 py-0.2 rounded-md shrink-0">
                      {evt.source === 'google' ? 'Google' : 'ระบบ'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#7A786C]">ช่วงเวลา {evt.startTime} - {evt.endTime}</p>
                </div>
              </div>

              {/* Insert recommended smart gap after 1st event */}
              {idx === 0 && recommendedTask && (
                <div className="flex gap-2.5 items-start">
                  <div className="w-12 text-right shrink-0 pt-2">
                    <span className="text-xs font-bold text-[#6C7764] block">{evt.endTime}</span>
                    <span className="text-[10px] text-[#5F7554]">ช่วงว่าง</span>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6C7764] mt-2.5 shrink-0 ring-4 ring-[#E2ECE0]" />

                  <div className="flex-1 bg-linear-to-br from-[#F5EFE6] to-[#FAF8F5] p-3.5 rounded-2xl border-2 border-dashed border-[#6C7764] shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6C7764] text-white flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> ช่วงว่างสมองโล่ง
                      </span>
                      <span className="text-[10px] text-[#7A786C]">แนะนำโดย AI</span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#2C2C24]">
                        แนะนำทำ: <span className="text-[#3B5433]">{recommendedTask.title}</span>
                      </div>
                      <p className="text-[10px] text-[#7A786C] mt-0.5 leading-snug">
                        ใช้เวลา ~{recommendedTask.estimatedMinutes || 25} นาที เหมาะเจาะกับเวลาว่าง
                      </p>
                    </div>

                    <button
                      onClick={() => onStartFocus(recommendedTask)}
                      className="w-full py-2 px-3 rounded-xl bg-[#6C7764] hover:bg-[#586350] active:scale-95 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>เริ่มโฟกัสงานนี้ทันที</span>
                    </button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};
