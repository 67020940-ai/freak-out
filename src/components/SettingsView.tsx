import React, { useState, useEffect } from 'react';
import { AppSettings, Task, EnergyLevel } from '../types';
import {
  ChevronRight,
  User,
  Lock,
  Bell,
  Moon,
  Info,
  HelpCircle,
  LogOut,
  Brain,
  Sparkles,
  ShieldCheck,
  Clock,
  Volume2,
  Check,
  ChevronLeft,
  X
} from 'lucide-react';
import { getSavedSession, logoutAuth } from '../services/firebase';
import { analyzeReadinessWithAI, CognitiveAnalysisResult } from '../utils/aiHelper';
import { CLOUD_COLOR_THEMES, PixelCloud8Bit } from './PixelCloud8Bit';

interface SettingsViewProps {
  tasks: Task[];
  energy: EnergyLevel;
  cloudColor: string;
  onUpdateCloudColor: (color: string) => void;
  onLogout: () => void;
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
}

type ModalType = 'profile' | 'password' | 'notifications' | 'about' | 'faq' | 'deactivate' | 'ai-analysis' | null;

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
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  // Local state for Dark mode toggle (persisted in localStorage / document element)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('freakout_dark_mode') === 'true';
  });

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

  const handleToggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('freakout_dark_mode', String(nextMode));
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await logoutAuth();
    onLogout();
  };

  const handleDeactivate = async () => {
    localStorage.clear();
    await logoutAuth();
    onLogout();
  };

  const displayName = session?.user?.displayName || 'Alfred Daniel';
  const roleTitle = 'Product / UI Designer';
  const userEmail = session?.user?.email || 'alfred.daniel@example.com';

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-5 select-none">
      {/* Header bar matching reference with back button */}
      <div className="flex items-center justify-between py-1">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-full bg-white dark:bg-[#2A2A2A] border border-[#EAE4D9] dark:border-[#3A3A3A] flex items-center justify-center text-[#2C2C24] dark:text-white shadow-2xs hover:bg-[#F5EFE6] transition active:scale-95 cursor-pointer"
          title="ย้อนกลับ"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <h1 className="text-base font-bold font-heading text-[#2C2C24] dark:text-white tracking-tight">
          Settings
        </h1>

        <div className="w-9 h-9" /> {/* Spacer for centering balance */}
      </div>

      {/* User Profile Card (Reference Item 1) */}
      <div
        onClick={() => setActiveModal('profile')}
        className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-4 border border-[#ECE6DB] dark:border-[#2C2C2C] shadow-2xs hover:border-[#828D7A]/50 transition cursor-pointer flex items-center justify-between active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F0ECE1] dark:bg-[#2C2C2C] border border-[#E0D9CB] dark:border-[#3C3C3C] overflow-hidden flex items-center justify-center shrink-0">
            <PixelCloud8Bit pose="idle" size="sm" color={cloudColor} interactive={false} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2C2C24] dark:text-white leading-tight">
              {displayName}
            </h2>
            <p className="text-xs text-[#8A887A] dark:text-[#A0A0A0] mt-0.5">
              {roleTitle}
            </p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-[#A8A599] dark:text-[#666666] shrink-0" />
      </div>

      {/* Section 1: Other Settings (Reference Main Group) */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#8A887A] dark:text-[#999999] px-1">
          Other settings
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#ECE6DB] dark:border-[#2C2C2C] shadow-2xs overflow-hidden divide-y divide-[#F2ECE1] dark:divide-[#2A2A2A]">
          {/* 1. Profile details */}
          <button
            type="button"
            onClick={() => setActiveModal('profile')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] dark:hover:bg-[#262626] transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F4EFE6] dark:bg-[#2A2A2A] flex items-center justify-center text-[#2C2C24] dark:text-white">
                <User className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-[#2C2C24] dark:text-white">
                Profile details
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A8A599] dark:text-[#666666]" />
          </button>

          {/* 2. Password */}
          <button
            type="button"
            onClick={() => setActiveModal('password')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] dark:hover:bg-[#262626] transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F4EFE6] dark:bg-[#2A2A2A] flex items-center justify-center text-[#2C2C24] dark:text-white">
                <Lock className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-[#2C2C24] dark:text-white">
                Password
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A8A599] dark:text-[#666666]" />
          </button>

          {/* 3. Notifications */}
          <button
            type="button"
            onClick={() => setActiveModal('notifications')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] dark:hover:bg-[#262626] transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F4EFE6] dark:bg-[#2A2A2A] flex items-center justify-center text-[#2C2C24] dark:text-white">
                <Bell className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-[#2C2C24] dark:text-white">
                Notifications
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A8A599] dark:text-[#666666]" />
          </button>

          {/* 4. Dark mode toggle */}
          <div className="px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F4EFE6] dark:bg-[#2A2A2A] flex items-center justify-center text-[#2C2C24] dark:text-white">
                <Moon className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-[#2C2C24] dark:text-white">
                Dark mode
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isDarkMode ? 'bg-[#2C2C24] dark:bg-white' : 'bg-[#DDD5C5]'
              }`}
              title="สลับโหมดมืด"
            >
              <span
                className={`block w-4 h-4 rounded-full transition-transform absolute top-1 ${
                  isDarkMode
                    ? 'left-6 bg-white dark:bg-[#1E1E1E]'
                    : 'left-1 bg-white'
                } shadow-xs`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Application Info & Account Action (Reference Bottom Group) */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#ECE6DB] dark:border-[#2C2C2C] shadow-2xs overflow-hidden divide-y divide-[#F2ECE1] dark:divide-[#2A2A2A]">
        {/* About application */}
        <button
          type="button"
          onClick={() => setActiveModal('about')}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] dark:hover:bg-[#262626] transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F4EFE6] dark:bg-[#2A2A2A] flex items-center justify-center text-[#2C2C24] dark:text-white">
              <Info className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-[#2C2C24] dark:text-white">
              About application
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#A8A599] dark:text-[#666666]" />
        </button>

        {/* Help/FAQ */}
        <button
          type="button"
          onClick={() => setActiveModal('faq')}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] dark:hover:bg-[#262626] transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F4EFE6] dark:bg-[#2A2A2A] flex items-center justify-center text-[#2C2C24] dark:text-white">
              <HelpCircle className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-[#2C2C24] dark:text-white">
              Help/FAQ
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#A8A599] dark:text-[#666666]" />
        </button>

        {/* Deactivate my account (Destructive Red Row) */}
        <button
          type="button"
          onClick={() => setShowDeactivateConfirm(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FFF5F4] dark:hover:bg-[#331818] transition cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FDECE8] dark:bg-[#3D1E1B] flex items-center justify-center text-[#D0422B] group-hover:scale-105 transition-transform">
              <LogOut className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-[#D0422B]">
              Deactivate my account
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#D0422B]/60" />
        </button>
      </div>

      {/* Section 3: App Specialty Features (Focus Shield & AI Analysis) */}
      <div className="bg-[#FAF8F5] dark:bg-[#1E1E1E] rounded-3xl p-4 border border-[#ECE6DB] dark:border-[#2C2C2C] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6C7764]" />
            <span className="text-xs font-bold text-[#2C2C24] dark:text-white">
              Focus Shield & AI Assistant
            </span>
          </div>

          <button
            type="button"
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="text-[10px] font-semibold text-[#6C7764] dark:text-[#9BB191] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'กำลังวิเคราะห์...' : 'ประเมินซ้ำ'}</span>
          </button>
        </div>

        {analysis && (
          <div className="bg-white dark:bg-[#262626] p-3 rounded-2xl border border-[#ECE6DB] dark:border-[#333333] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#7A786C] dark:text-[#A0A0A0]">ความพร้อมลุยงาน:</span>
              <span className="font-bold text-[#2C2C24] dark:text-white">{analysis.readinessScore} / 100</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#7A786C] dark:text-[#A0A0A0]">ระดับความตึงเครียด:</span>
              <span className={`font-bold ${
                analysis.stressLevel === 'สูง' ? 'text-[#D0422B]' : analysis.stressLevel === 'ปานกลาง' ? 'text-[#B87A24]' : 'text-[#5F7554]'
              }`}>
                {analysis.stressLevel}
              </span>
            </div>
            <p className="text-[11px] text-[#5C5B50] dark:text-[#B0B0B0] leading-relaxed pt-1 border-t border-[#F2ECE1] dark:border-[#333333]">
              {analysis.advice}
            </p>
          </div>
        )}

        {/* Focus Shield Toggles */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5C5B50] dark:text-[#A0A0A0]">ระบบป้องกันสิ่งรบกวน (Focus Shield)</span>
            <button
              type="button"
              onClick={() => onUpdateSettings((prev) => ({ ...prev, focusShieldEnabled: !prev.focusShieldEnabled }))}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                settings.focusShieldEnabled ? 'bg-[#6C7764]' : 'bg-[#DDD5C5]'
              }`}
            >
              <span
                className={`block w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                  settings.focusShieldEnabled ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5C5B50] dark:text-[#A0A0A0]">เสียงแอมเบียนต์และเอฟเฟกต์</span>
            <button
              type="button"
              onClick={() => onUpdateSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-[#6C7764]' : 'bg-[#DDD5C5]'
              }`}
            >
              <span
                className={`block w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                  settings.soundEnabled ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Sheet for Profile Details */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-sm p-5 border border-[#ECE6DB] dark:border-[#333333] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] dark:border-[#2C2C2C] pb-2">
              <h3 className="text-sm font-bold text-[#2C2C24] dark:text-white font-heading">
                Profile Details
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-[#8A887A] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2C2C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#7A786C] dark:text-[#999999] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={displayName}
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DB] dark:border-[#333333] bg-[#FAF8F5] dark:bg-[#262626] text-[#2C2C24] dark:text-white outline-none"
                  readOnly
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7A786C] dark:text-[#999999] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={userEmail}
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DB] dark:border-[#333333] bg-[#FAF8F5] dark:bg-[#262626] text-[#2C2C24] dark:text-white outline-none"
                  readOnly
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7A786C] dark:text-[#999999] block mb-1">
                  Role
                </label>
                <input
                  type="text"
                  defaultValue={roleTitle}
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DB] dark:border-[#333333] bg-[#FAF8F5] dark:bg-[#262626] text-[#2C2C24] dark:text-white outline-none"
                  readOnly
                />
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#6C7764] text-white font-bold text-xs shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Modal Sheet for Password */}
      {activeModal === 'password' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-sm p-5 border border-[#ECE6DB] dark:border-[#333333] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] dark:border-[#2C2C2C] pb-2">
              <h3 className="text-sm font-bold text-[#2C2C24] dark:text-white font-heading">
                Change Password
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-[#8A887A] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2C2C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#7A786C] dark:text-[#999999] block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DB] dark:border-[#333333] bg-[#FAF8F5] dark:bg-[#262626] text-[#2C2C24] dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7A786C] dark:text-[#999999] block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DB] dark:border-[#333333] bg-[#FAF8F5] dark:bg-[#262626] text-[#2C2C24] dark:text-white outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#6C7764] text-white font-bold text-xs shadow-xs"
            >
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* Modal Sheet for Notifications */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-sm p-5 border border-[#ECE6DB] dark:border-[#333333] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] dark:border-[#2C2C2C] pb-2">
              <h3 className="text-sm font-bold text-[#2C2C24] dark:text-white font-heading">
                Notification Preferences
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-[#8A887A] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2C2C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#262626]">
                <span className="text-[#2C2C24] dark:text-white font-medium">แจ้งเตือนก่อนเริ่มรอบโฟกัส</span>
                <input type="checkbox" defaultChecked className="accent-[#6C7764]" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#262626]">
                <span className="text-[#2C2C24] dark:text-white font-medium">เตือนเช็กอินระดับพลังงานประจำวัน</span>
                <input type="checkbox" defaultChecked className="accent-[#6C7764]" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#262626]">
                <span className="text-[#2C2C24] dark:text-white font-medium">สรุปงานที่ค้างในรายการ</span>
                <input type="checkbox" defaultChecked className="accent-[#6C7764]" />
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#6C7764] text-white font-bold text-xs shadow-xs"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Modal Sheet for About Application */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-sm p-5 border border-[#ECE6DB] dark:border-[#333333] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] dark:border-[#2C2C2C] pb-2">
              <h3 className="text-sm font-bold text-[#2C2C24] dark:text-white font-heading">
                About Application
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-[#8A887A] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2C2C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2 text-[#5C5B50] dark:text-[#B0B0B0] leading-relaxed">
              <p className="font-bold text-[#2C2C24] dark:text-white">Freak Out App</p>
              <p>เครื่องมือจัดการภาระงานและลดความตื่นตระหนก เพื่อคนสมาธิสั้นและคนคิดวน ย่อยงานใหญ่เป็นก้าวเล็ก 2 นาทีแรก</p>
              <div className="pt-2 text-[10px] text-[#8A887A] dark:text-[#888888] border-t border-[#F2ECE1] dark:border-[#2C2C2C]">
                Version 2.5.0 • Powered by Gemini AI
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#6C7764] text-white font-bold text-xs shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal Sheet for Help/FAQ */}
      {activeModal === 'faq' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-sm p-5 border border-[#ECE6DB] dark:border-[#333333] shadow-xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] dark:border-[#2C2C2C] pb-2">
              <h3 className="text-sm font-bold text-[#2C2C24] dark:text-white font-heading">
                Help & FAQ
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-[#8A887A] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2C2C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#5C5B50] dark:text-[#B0B0B0]">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#262626]">
                <div className="font-bold text-[#2C2C24] dark:text-white mb-1">ปุ่ม Smart Pick ทำงานอย่างไร?</div>
                <div>ระบบจะประเมินเวลาที่คุณมีกับระดับพลังงาน แล้วคัดเลือก 1 งานที่เหมาะที่สุด เพื่อให้เริ่มทำได้ทันทีโดยไม่ต้องคิดวน</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#262626]">
                <div className="font-bold text-[#2C2C24] dark:text-white mb-1">การฝึก 5-4-3-2-1 คืออะไร?</div>
                <div>เป็นเทคนิค Grounding ทางจิตวิทยา ช่วยดึงสติกลับมาที่ประสาทสัมผัสทั้ง 5 เมื่อเริ่มรู้สึกตื่นตระหนก</div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#6C7764] text-white font-bold text-xs shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Deactivation */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-xs p-5 border border-[#ECE6DB] dark:border-[#333333] shadow-2xl space-y-3.5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FDECE8] dark:bg-[#3D1E1B] text-[#D0422B] flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6 stroke-[2]" />
            </div>

            <h3 className="text-sm font-bold text-[#2C2C24] dark:text-white font-heading">
              Deactivate Account?
            </h3>
            <p className="text-xs text-[#7A786C] dark:text-[#A0A0A0] leading-relaxed">
              การปิดการใช้งานบัญชีจะล้างข้อมูลและออกจากระบบบนอุปกรณ์นี้ คุณแน่ใจหรือไม่?
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeactivateConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#F4EFE6] dark:bg-[#2A2A2A] text-[#5C5B50] dark:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                className="flex-1 py-2.5 rounded-xl bg-[#D0422B] hover:bg-[#B33520] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
