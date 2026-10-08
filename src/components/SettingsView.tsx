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
  Sparkles,
  ShieldCheck,
  Clock,
  Volume2,
  Check,
  X,
  Bot,
  Key
} from 'lucide-react';
import {
  getSavedSession,
  logoutAuth,
  updateUserProfile,
  updateUserPassword,
  deactivateAccount
} from '../services/firebase';
import { analyzeReadinessWithAI, CognitiveAnalysisResult } from '../utils/aiHelper';
import { PixelCloud8Bit } from './PixelCloud8Bit';
import { AppLogo8Bit } from './AppLogo8Bit';

interface SettingsViewProps {
  tasks: Task[];
  energy: EnergyLevel;
  cloudColor: string;
  onUpdateCloudColor: (color: string) => void;
  onUpdateUserName?: (name: string) => void;
  onLogout: () => void;
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
}

type ModalType = 'profile' | 'password' | 'notifications' | 'gemini-key' | 'about' | 'faq' | null;

export const SettingsView: React.FC<SettingsViewProps> = ({
  tasks,
  energy,
  cloudColor,
  onLogout,
  onUpdateUserName,
  settings,
  onUpdateSettings,
}) => {
  const [session, setSession] = useState(getSavedSession());
  const [analysis, setAnalysis] = useState<CognitiveAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  // Gemini API Key config state
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    const directKey = localStorage.getItem('freakout_gemini_api_key');
    if (directKey) return directKey;
    const sess = getSavedSession();
    if (sess?.user?.email === 'admin@freakout.app' || sess?.user?.uid === 'admin-master-uid') {
      const adminKey = localStorage.getItem('freakout_admin_gemini_api_key');
      if (adminKey) {
        localStorage.setItem('freakout_gemini_api_key', adminKey);
        return adminKey;
      }
    }
    return '';
  });
  const [geminiKeySuccess, setGeminiKeySuccess] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [geminiTestMsg, setGeminiTestMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Form states for profile editing
  const [editName, setEditName] = useState(session?.user?.displayName || 'ผู้ใช้งาน');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Form states for password change
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Notifications preference states
  const [notifFocus, setNotifFocus] = useState(true);
  const [notifEnergy, setNotifEnergy] = useState(true);
  const [notifDaily, setNotifDaily] = useState(false);
  const [notifSuccessMsg, setNotifSuccessMsg] = useState('');

  // Dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('freakout_dark_mode') === 'true';
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const overthinkCount = tasks.filter((t) => !t.completed && t.isOverthinkingProne).length;
  const completedToday = tasks.filter((t) => t.completed).length;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editName.trim();
    if (!trimmed) return;
    await updateUserProfile(trimmed);
    const updated = getSavedSession();
    setSession(updated);
    onUpdateUserName?.(trimmed);
    setProfileSuccessMsg('บันทึกข้อมูลโปรไฟล์เรียบร้อย');
    setTimeout(() => {
      setProfileSuccessMsg('');
      setActiveModal(null);
    }, 1200);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ text: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'รหัสผ่านยืนยันไม่ตรงกัน', isError: true });
      return;
    }

    try {
      await updateUserPassword(newPassword);
      setPasswordMsg({ text: 'เปลี่ยนรหัสผ่านสำเร็จเรียบร้อย', isError: false });
      setTimeout(() => {
        setPasswordMsg(null);
        setNewPassword('');
        setConfirmPassword('');
        setActiveModal(null);
      }, 1200);
    } catch (err: any) {
      setPasswordMsg({ text: err.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน', isError: true });
    }
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifSuccessMsg('บันทึกการตั้งค่าการแจ้งเตือนแล้ว');
    setTimeout(() => {
      setNotifSuccessMsg('');
      setActiveModal(null);
    }, 1200);
  };

  const handleDeactivate = async () => {
    await deactivateAccount();
    onLogout();
  };

  const handleTestGeminiKey = async () => {
    const keyToTest = geminiApiKey.trim();
    if (!keyToTest) {
      setGeminiTestMsg({ text: 'กรุณาวาง API Key ก่อนทำการทดสอบ', isError: true });
      return;
    }

    setIsTestingKey(true);
    setGeminiTestMsg(null);

    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: keyToTest });
      const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.8-flash'];
      let resp: any = null;
      let lastErr: any = null;

      for (const m of candidateModels) {
        try {
          resp = await ai.models.generateContent({
            model: m,
            contents: 'ตอบสั้นๆ เพียง 1 คำ: สำเร็จ',
          });
          if (resp && resp.text) break;
        } catch (e: any) {
          lastErr = e;
          if (e?.message?.includes('API key not valid') || e?.message?.includes('INVALID_ARGUMENT')) {
            throw e;
          }
        }
      }

      if (!resp || !resp.text) {
        throw lastErr || new Error('ไม่สามารถเชื่อมต่อโมเดลได้');
      }

      if (resp && resp.text) {
        setGeminiTestMsg({ text: 'เชื่อมต่อ Gemini สำเร็จ 100%! คีย์ถูกต้องและพร้อมใช้งาน', isError: false });
        // Automatically persist the valid key
        localStorage.setItem('freakout_gemini_api_key', keyToTest);
        if (session?.user?.email === 'admin@freakout.app' || session?.user?.uid === 'admin-master-uid') {
          localStorage.setItem('freakout_admin_gemini_api_key', keyToTest);
        }
      } else {
        throw new Error('ไม่ได้รับข้อความตอบกลับจากโมเดล');
      }
    } catch (err: any) {
      console.error('Gemini Key Test Error:', err);
      const errMsg = err?.message || 'เชื่อมต่อไม่สำเร็จ';
      let friendlyError = 'ไม่สามารถเชื่อมต่อได้: ตรวจสอบว่า API Key ถูกต้องหรือไม่';
      if (errMsg.includes('API key not valid') || errMsg.includes('INVALID_ARGUMENT') || errMsg.includes('API_KEY_INVALID')) {
        friendlyError = 'API Key ไม่ถูกต้อง กรุณาคัดลอกคีย์ใหม่จาก Google AI Studio';
      } else if (errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('Quota')) {
        friendlyError = 'โควตาใช้งานของคีย์นี้เต็ม (Quota Exceeded) กรุณาตรวจสอบใน Google AI Studio';
      } else if (errMsg.includes('PERMISSION_DENIED')) {
        friendlyError = 'สิทธิ์การใช้งานถูกปฏิเสธ (Permission Denied)';
      }
      setGeminiTestMsg({ text: friendlyError, isError: true });
    } finally {
      setIsTestingKey(false);
    }
  };

  const currentDisplayName = session?.user?.displayName || editName || 'ผู้ใช้งาน';
  const currentUserEmail = session?.user?.email || 'user@freakout.app';

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-5 select-none">
      {/* Top Header - Simple and Clean (No Non-functional Back Button) */}
      <div className="py-1">
        <h1 className="text-xl font-bold font-heading text-[#2C2C24] dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-[#8A887A] dark:text-[#A0A0A0] mt-0.5">
          จัดการบัญชีและระบบการทำงาน
        </p>
      </div>

      {/* User Profile Card (Reference Card Style) */}
      <div
        onClick={() => {
          setEditName(currentDisplayName);
          setActiveModal('profile');
        }}
        className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-4 border border-[#ECE6DB] dark:border-[#2C2C2C] shadow-2xs hover:border-[#828D7A]/50 transition cursor-pointer flex items-center justify-between active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F0ECE1] dark:bg-[#2C2C2C] border border-[#E0D9CB] dark:border-[#3C3C3C] overflow-hidden flex items-center justify-center shrink-0">
            <PixelCloud8Bit pose="idle" size="sm" color={cloudColor} interactive={false} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2C2C24] dark:text-white leading-tight">
              {currentDisplayName}
            </h2>
            <p className="text-xs text-[#8A887A] dark:text-[#A0A0A0] mt-0.5 truncate max-w-[200px]">
              {currentUserEmail}
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
            onClick={() => {
              setEditName(currentDisplayName);
              setActiveModal('profile');
            }}
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
            onClick={() => {
              setPasswordMsg(null);
              setNewPassword('');
              setConfirmPassword('');
              setActiveModal('password');
            }}
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

          {/* 4. Gemini AI Configuration */}
          <button
            type="button"
            onClick={() => setActiveModal('gemini-key')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] dark:hover:bg-[#262626] transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F0F5ED] dark:bg-[#273324] flex items-center justify-center text-[#4A633F] dark:text-[#84AB73]">
                <Bot className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#2C2C24] dark:text-white block">
                  Gemini AI API Key
                </span>
                <span className="text-[10px] text-[#8C8A7D]">
                  {geminiApiKey ? 'ตั้งค่าแล้ว (พร้อมใช้งาน AI จริง)' : 'ยังไม่ได้ระบุ (แตะเพื่อใส่ Key)'}
                </span>
              </div>
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

        {/* Log Out (Distinct font styling) */}
        <button
          type="button"
          onClick={async () => {
            await logoutAuth();
            onLogout();
          }}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] dark:hover:bg-[#262626] transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F6ECE8] dark:bg-[#382622] flex items-center justify-center text-[#B85824] dark:text-[#E07A4B]">
              <LogOut className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-[#B85824] dark:text-[#E07A4B] tracking-wide">
              Log out (ออกจากระบบ)
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#B85824]/60 dark:text-[#E07A4B]/60" />
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

      {/* Section 4: Danger Zone - Deactivate Account at very bottom */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowDeactivateConfirm(true)}
          className="w-full px-4 py-3 rounded-2xl bg-[#FFF5F4] dark:bg-[#2A1818] border border-[#FCD8D4] dark:border-[#4A2424] flex items-center justify-between text-left hover:bg-[#FDECE8] dark:hover:bg-[#3D1E1B] transition cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#FDECE8] dark:bg-[#3D1E1B] flex items-center justify-center text-[#D0422B] group-hover:scale-105 transition-transform">
              <LogOut className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#D0422B] block">
                Deactivate my account
              </span>
              <span className="text-[10px] text-[#D0422B]/70">
                ลบบัญชีและข้อมูลทั้งหมดออกจากอุปกรณ์
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#D0422B]/60" />
        </button>
      </div>

      {/* Modal Sheet for Profile Details (REAL EDITABLE) */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-sm p-5 border border-[#ECE6DB] dark:border-[#333333] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] dark:border-[#2C2C2C] pb-2">
              <h3 className="text-sm font-bold text-[#2C2C24] dark:text-white font-heading">
                Profile Details
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-[#8A887A] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2C2C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              {profileSuccessMsg && (
                <div className="p-2 rounded-xl bg-[#EBF0E8] text-[#3B5433] text-center font-medium">
                  {profileSuccessMsg}
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-[#7A786C] dark:text-[#999999] block mb-1">
                  Full Name / ชื่อที่แสดง
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DB] dark:border-[#333333] bg-[#FAF8F5] dark:bg-[#262626] text-[#2C2C24] dark:text-white outline-none focus:border-[#6C7764]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7A786C] dark:text-[#999999] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={currentUserEmail}
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DB] dark:border-[#333333] bg-[#F2ECE1]/50 dark:bg-[#262626]/50 text-[#7A786C] outline-none"
                  disabled
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F4EFE6] dark:bg-[#2A2A2A] text-[#5C5B50] dark:text-white font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#6C7764] hover:bg-[#586350] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sheet for Password (REAL CHANGE) */}
      {activeModal === 'password' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-sm p-5 border border-[#ECE6DB] dark:border-[#333333] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] dark:border-[#2C2C2C] pb-2">
              <h3 className="text-sm font-bold text-[#2C2C24] dark:text-white font-heading">
                Change Password
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-[#8A887A] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2C2C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-3 text-xs">
              {passwordMsg && (
                <div className={`p-2 rounded-xl text-center font-medium ${
                  passwordMsg.isError
                    ? 'bg-[#FDECE8] text-[#C23A25]'
                    : 'bg-[#EBF0E8] text-[#3B5433]'
                }`}>
                  {passwordMsg.text}
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-[#7A786C] dark:text-[#999999] block mb-1">
                  New Password / รหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DB] dark:border-[#333333] bg-[#FAF8F5] dark:bg-[#262626] text-[#2C2C24] dark:text-white outline-none focus:border-[#6C7764]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7A786C] dark:text-[#999999] block mb-1">
                  Confirm Password / ยืนยันรหัสผ่าน
                </label>
                <input
                  type="password"
                  placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DB] dark:border-[#333333] bg-[#FAF8F5] dark:bg-[#262626] text-[#2C2C24] dark:text-white outline-none focus:border-[#6C7764]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F4EFE6] dark:bg-[#2A2A2A] text-[#5C5B50] dark:text-white font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#6C7764] hover:bg-[#586350] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sheet for Notifications (REAL WORKING PREFERENCES) */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-sm p-5 border border-[#ECE6DB] dark:border-[#333333] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] dark:border-[#2C2C2C] pb-2">
              <h3 className="text-sm font-bold text-[#2C2C24] dark:text-white font-heading">
                Notification Preferences
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-[#8A887A] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2C2C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNotifications} className="space-y-3 text-xs">
              {notifSuccessMsg && (
                <div className="p-2 rounded-xl bg-[#EBF0E8] text-[#3B5433] text-center font-medium">
                  {notifSuccessMsg}
                </div>
              )}

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#262626] cursor-pointer">
                  <span className="text-[#2C2C24] dark:text-white font-medium">แจ้งเตือนก่อนเริ่มรอบโฟกัส</span>
                  <input
                    type="checkbox"
                    checked={notifFocus}
                    onChange={(e) => setNotifFocus(e.target.checked)}
                    className="accent-[#6C7764] w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#262626] cursor-pointer">
                  <span className="text-[#2C2C24] dark:text-white font-medium">เตือนเช็กอินระดับพลังงานประจำวัน</span>
                  <input
                    type="checkbox"
                    checked={notifEnergy}
                    onChange={(e) => setNotifEnergy(e.target.checked)}
                    className="accent-[#6C7764] w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#262626] cursor-pointer">
                  <span className="text-[#2C2C24] dark:text-white font-medium">สรุปงานที่ค้างในรายการตอนเช้า</span>
                  <input
                    type="checkbox"
                    checked={notifDaily}
                    onChange={(e) => setNotifDaily(e.target.checked)}
                    className="accent-[#6C7764] w-4 h-4"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#6C7764] hover:bg-[#586350] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Save Preferences
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sheet for Gemini AI Key Configuration */}
      {activeModal === 'gemini-key' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-sm p-5 border border-[#ECE6DB] dark:border-[#333333] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] dark:border-[#2C2C2C] pb-2">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#5F7554]" />
                <h3 className="text-sm font-bold text-[#2C2C24] dark:text-white font-heading">
                  Gemini AI API Key
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-[#8A887A] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2C2C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {geminiKeySuccess && (
                <div className="p-2 rounded-xl bg-[#EBF0E8] text-[#3B5433] text-center font-medium">
                  {geminiKeySuccess}
                </div>
              )}

              {geminiTestMsg && (
                <div
                  className={`p-2.5 rounded-xl text-center font-medium border text-[11px] ${
                    geminiTestMsg.isError
                      ? 'bg-[#FDECE8] text-[#C23A25] border-[#F8D2CA]'
                      : 'bg-[#EBF0E8] text-[#3B5433] border-[#CFDFCB]'
                  }`}
                >
                  {geminiTestMsg.text}
                </div>
              )}

              <p className="text-[11px] text-[#7A786C] dark:text-[#A0A0A0] leading-relaxed">
                ใส่ Google Gemini API Key เพื่อเปิดใช้งานระบบ AI จริง 100% ทั้งน้อง Cloudy AI Agent และระบบย่อยงาน/วิเคราะห์ภาระสมอง
              </p>

              <div>
                <label className="text-[11px] font-semibold text-[#7A786C] dark:text-[#999999] block mb-1">
                  API Key (เริ่มต้นด้วย AIzaSy...)
                </label>
                <input
                  type="password"
                  placeholder="วางคีย์ Gemini ที่นี่"
                  value={geminiApiKey}
                  onChange={(e) => {
                    setGeminiApiKey(e.target.value);
                    setGeminiTestMsg(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#ECE6DB] dark:border-[#333333] bg-[#FAF8F5] dark:bg-[#262626] text-[#2C2C24] dark:text-white outline-none focus:border-[#6C7764] font-mono text-[11px]"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#262626] border border-[#ECE6DB] dark:border-[#333333] text-[10px] text-[#7A786C] dark:text-[#A0A0A0] flex items-center justify-between">
                <span>รับ API Key ฟรีได้จาก Google AI Studio</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#6C7764] dark:text-[#9BB191] font-bold underline ml-1"
                >
                  เปิด AI Studio ↗
                </a>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestGeminiKey}
                  disabled={isTestingKey || !geminiApiKey.trim()}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#828D7A] text-[#4F5948] dark:text-[#C5D1BF] dark:border-[#586350] hover:bg-[#F0ECE1] dark:hover:bg-[#2C332A] font-bold text-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {isTestingKey ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>กำลังทดสอบ...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ทดสอบการเชื่อมต่อ</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const cleanKey = geminiApiKey.trim();
                    localStorage.setItem('freakout_gemini_api_key', cleanKey);
                    if (session?.user?.email === 'admin@freakout.app' || session?.user?.uid === 'admin-master-uid') {
                      localStorage.setItem('freakout_admin_gemini_api_key', cleanKey);
                    }
                    setGeminiKeySuccess('บันทึกคีย์เรียบร้อย พร้อมใช้งาน AI จริง');
                    setTimeout(() => {
                      setGeminiKeySuccess('');
                      setActiveModal(null);
                    }, 1200);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#6C7764] hover:bg-[#586350] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  บันทึกคีย์
                </button>
              </div>

              {geminiApiKey && (
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setGeminiApiKey('');
                      localStorage.removeItem('freakout_gemini_api_key');
                      if (session?.user?.email === 'admin@freakout.app' || session?.user?.uid === 'admin-master-uid') {
                        localStorage.removeItem('freakout_admin_gemini_api_key');
                      }
                      setGeminiKeySuccess('ลบคีย์เรียบร้อย');
                      setGeminiTestMsg(null);
                      setTimeout(() => setGeminiKeySuccess(''), 1500);
                    }}
                    className="text-[11px] text-[#C23A25] hover:underline cursor-pointer"
                  >
                    ลบคีย์ออกจากเครื่องนี้
                  </button>
                </div>
              )}
            </div>
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
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-[#8A887A] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2C2C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center py-2 space-y-2 text-xs text-[#5C5B50] dark:text-[#B0B0B0] leading-relaxed">
              <AppLogo8Bit size="lg" />
              <p className="font-bold text-sm text-[#2C2C24] dark:text-white mt-1">Freak Out App</p>
              <p>เครื่องมือจัดการภาระงานและลดความตื่นตระหนก เพื่อคนสมาธิสั้นและคนคิดวน ย่อยงานใหญ่เป็นก้าวเล็ก 2 นาทีแรก</p>
              <div className="pt-2 text-[10px] text-[#8A887A] dark:text-[#888888] border-t border-[#F2ECE1] dark:border-[#2C2C2C] w-full">
                Version 2.5.0 • Powered by Gemini AI & Firebase Auth
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#6C7764] text-white font-bold text-xs shadow-xs cursor-pointer"
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
                type="button"
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
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#6C7764] text-white font-bold text-xs shadow-xs cursor-pointer"
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
