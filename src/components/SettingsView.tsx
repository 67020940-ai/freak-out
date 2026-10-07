import React, { useState, useEffect } from 'react';
import { AppSettings, Task, EnergyLevel } from '../types';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Calendar,
  Volume2,
  VolumeX,
  Palette,
  LogOut,
  Brain,
  Sparkles,
  Info,
  Clock,
  RotateCcw,
  Check
} from 'lucide-react';
import { getSavedSession, logoutAuth, isFirebaseConfigured } from '../services/firebase';
import { analyzeReadinessWithAI, CognitiveAnalysisResult } from '../utils/aiHelper';
import { CLOUD_COLOR_THEMES } from './PixelCloud8Bit';

interface SettingsViewProps {
  tasks: Task[];
  energy: EnergyLevel;
  cloudColor: string;
  onUpdateCloudColor: (color: string) => void;
  onLogout: () => void;
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  tasks,
  energy,
  cloudColor,
  onUpdateCloudColor,
  onLogout,
  settings,
  onUpdateSettings,
}) => {
  const [session, setSession] = useState(getSavedSession());
  const [analysis, setAnalysis] = useState<CognitiveAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const overthinkCount = tasks.filter((t) => !t.completed && t.isOverthinkingProne).length;
  const completedToday = tasks.filter((t) => t.completed).length;

  useEffect(() => {
    runAnalysis();
  }, [energy, pendingCount]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeReadinessWithAI(energy, pendingCount, overthinkCount, completedToday);
      setAnalysis(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogout = async () => {
    await logoutAuth();
    onLogout();
  };

  return (
    <div className="w-full space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EFE9DE] border border-[#E2DACB] flex items-center justify-center text-[#2C2C24]">
            <SettingsIcon className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-bold font-heading text-[#2C2C24]">ตั้งค่าระบบ</h2>
            <p className="text-[11px] text-[#7A786C]">ปรับแต่งการทำงานและบัญชีผู้ใช้</p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#E2DACB] text-[#8C8A7D]">
          v2.5.0
        </span>
      </div>

      {/* Real AI Cognitive Readiness & Stress Analysis Card (Requirement 9) */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4.5 border border-[#828D7A]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#EBF0E8] text-[#3B5433] flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#2C2C24]">AI ประเมินความเครียดและความพร้อม</h3>
              <p className="text-[10px] text-[#7A786C]">Gemini 2.5 Flash วิเคราะห์ปริมาณงานและพลังงาน</p>
            </div>
          </div>

          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="text-[10px] font-semibold text-[#6C7764] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'กำลังวิเคราะห์...' : 'วิเคราะห์ใหม่'}</span>
          </button>
        </div>

        {analysis && (
          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2.5 rounded-2xl border border-[#EAE4D9]">
                <span className="text-[10px] text-[#8C8A7D] block">ระดับความตึงเครียด:</span>
                <span className={`text-xs font-bold ${
                  analysis.stressLevel === 'สูง' ? 'text-[#B04C33]' : analysis.stressLevel === 'ปานกลาง' ? 'text-[#B87A24]' : 'text-[#3B5433]'
                }`}>
                  {analysis.stressLevel}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-2xl border border-[#EAE4D9]">
                <span className="text-[10px] text-[#8C8A7D] block">คะแนนความพร้อมลุยงาน:</span>
                <span className="text-xs font-bold text-[#2C2C24]">
                  {analysis.readinessScore} / 100
                </span>
              </div>
            </div>

            <div className="bg-[#F4EFE6] p-3 rounded-2xl border border-[#E5DEC9] text-xs space-y-1">
              <span className="font-bold text-[#2C2C24] block">คำแนะนำลดอาการสมองล้า:</span>
              <p className="text-[11px] text-[#5C5B50] leading-relaxed">
                {analysis.advice}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] shadow-2xs space-y-3">
        <span className="text-[11px] font-bold text-[#7A786C] uppercase tracking-wider block">
          บัญชีและการซิงค์ข้อมูล
        </span>

        <div className="bg-white p-3 rounded-2xl border border-[#EAE4D9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EBF0E8] border border-[#CFDFCB] flex items-center justify-center font-bold text-sm text-[#3B5433]">
              {session?.user?.displayName ? session.user.displayName[0] : 'J'}
            </div>
            <div>
              <span className="text-xs font-bold text-[#2C2C24] block">
                {session?.user?.displayName || 'Jay'}
              </span>
              <span className="text-[10px] text-[#8C8A7D]">
                {session?.user?.email || 'เข้าสู่ระบบด้วยบัญชีชั่วคราว'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl border border-[#EAE4D9] hover:bg-[#FDF2F0] hover:text-[#B04C33] text-xs font-semibold text-[#7A786C] transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Focus Shield Settings */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] shadow-2xs space-y-3">
        <span className="text-[11px] font-bold text-[#7A786C] uppercase tracking-wider block">
          การทำงานและสมาธิ (Focus Shield)
        </span>

        <div className="space-y-2">
          {/* Toggle Focus Shield */}
          <div className="bg-white p-3 rounded-2xl border border-[#EAE4D9] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#5F7554]" />
              <div>
                <span className="text-xs font-bold text-[#2C2C24] block">ระบบ Focus Shield</span>
                <span className="text-[10px] text-[#8C8A7D]">บล็อกช่วงเวลาว่างให้เป็นเขตห้ามรบกวน</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings((prev) => ({ ...prev, focusShieldEnabled: !prev.focusShieldEnabled }))}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.focusShieldEnabled ? 'bg-[#6C7764]' : 'bg-[#DDD5C5]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform absolute top-1 ${
                  settings.focusShieldEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Buffer Minutes */}
          <div className="bg-white p-3 rounded-2xl border border-[#EAE4D9] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#7A786C]" />
              <div>
                <span className="text-xs font-bold text-[#2C2C24] block">ระยะเวลา Buffer พักผ่อน</span>
                <span className="text-[10px] text-[#8C8A7D]">แทรกเวลาพักหลังโฟกัสเสร็จ</span>
              </div>
            </div>
            <select
              value={settings.smartBufferMinutes}
              onChange={(e) => onUpdateSettings((prev) => ({ ...prev, smartBufferMinutes: Number(e.target.value) }))}
              className="text-xs px-2 py-1 rounded-xl bg-[#FAF8F5] border border-[#E2DACB] text-[#2C2C24] outline-none"
            >
              <option value={10}>10 นาที</option>
              <option value={15}>15 นาที</option>
              <option value={20}>20 นาที</option>
            </select>
          </div>

          {/* Sound toggle */}
          <div className="bg-white p-3 rounded-2xl border border-[#EAE4D9] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-[#5F7554]" /> : <VolumeX className="w-4 h-4 text-[#8C8A7D]" />}
              <div>
                <span className="text-xs font-bold text-[#2C2C24] block">เสียงประกอบโฟกัส</span>
                <span className="text-[10px] text-[#8C8A7D]">เสียงแจ้งเตือนและแอมเบียนต์ผ่อนคลาย</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-[#6C7764]' : 'bg-[#DDD5C5]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform absolute top-1 ${
                  settings.soundEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
