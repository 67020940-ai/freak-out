import React, { useState } from 'react';
import { PixelCloud8Bit } from './PixelCloud8Bit';
import { ArrowRight, Sparkles, Check, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthOnboardingViewProps {
  onLogin: (userName: string) => void;
}

export const AuthOnboardingView: React.FC<AuthOnboardingViewProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'welcome' | 'email-login' | 'email-signup'>('welcome');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleQuickLogin = (userName = 'Jay') => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#6C7764', '#9E745E', '#EAE3D5'],
    });
    onLogin(userName);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuickLogin(name.trim() || 'เพื่อนใหม่');
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-8 bg-[#FAF8F5] text-[#2C2C24] relative overflow-y-auto no-scrollbar">
      {/* Top Brand Logo */}
      <div className="text-center pt-2 select-none">
        <h1 className="font-heading font-extrabold text-3xl tracking-tight text-[#2C2C24]">
          freak out
        </h1>
        <p className="text-xs text-[#7A786C] font-medium mt-1">
          Less thinking, more doing.
        </p>
      </div>

      {/* Center 8-bit Mascot Stage (Inspired by moimoi & Habitz references) */}
      <div className="my-auto py-6 flex flex-col items-center justify-center text-center">
        {/* Animated Speech Bubble */}
        <div className="mb-3 px-4 py-2 rounded-2xl bg-white border border-[#E8E2D5] text-xs sm:text-sm font-bold text-[#2C2C24] shadow-2xs relative animate-bounce">
          <span>Hello~ พร้อมเริ่มวันใหม่แบบสมองโล่งรึยัง? ☁️</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b border-r border-[#E8E2D5] transform rotate-45" />
        </div>

        {/* 8-bit Animated Cloud Character */}
        <div className="relative my-2">
          <div className="w-36 h-36 rounded-full bg-[#EBF0E8]/70 flex items-center justify-center p-3 shadow-inner border border-[#CFDFCB]">
            <PixelCloud8Bit pose="celebrate" size="lg" interactive={true} />
          </div>
          {/* Subtle decorative badges */}
          <div className="absolute -top-1 -right-1 px-2.5 py-0.5 rounded-full bg-[#FFF4E0] border border-[#F4E1BD] text-[10px] font-bold text-[#8A5C1E] shadow-2xs">
            ✨ ปลอดสารพิษ 0 Toxic
          </div>
        </div>

        {/* Philosophy headline */}
        <div className="mt-4 max-w-xs space-y-1">
          <h2 className="text-lg font-bold font-heading text-[#2C2C24]">
            หยุดคิดเยอะ แล้วลงมือทำ
          </h2>
          <p className="text-xs text-[#7A786C] leading-relaxed">
            เปลี่ยน To-Do List ที่น่าอึดอัด ให้เหลือเพียง 1 งานที่เหมาะที่สุด พร้อมเพื่อนก้อนเมฆดูแลใจ
          </p>
        </div>
      </div>

      {/* Bottom Auth Actions */}
      <div className="w-full max-w-xs mx-auto space-y-2.5 pb-2">
        {authMode === 'welcome' ? (
          <>
            <div className="text-center mb-1">
              <span className="text-[11px] font-semibold text-[#8A887A]">
                เข้าสู่ระบบเพื่อเริ่มต้นใช้งาน
              </span>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={() => handleQuickLogin('Jay (Google)')}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#F7F4EE] active:scale-98 text-[#2C2C24] font-bold text-xs sm:text-sm border border-[#DED7C8] shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Apple Sign In Button */}
            <button
              type="button"
              onClick={() => handleQuickLogin('Jay (Apple)')}
              className="w-full py-3 px-4 rounded-2xl bg-[#1E1E1A] hover:bg-[#2C2C24] active:scale-98 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.85-11.75-14.42-6.19-9.88-10.87-20.9-14.04-33.05-3.17-12.16-4.75-23.77-4.75-34.82 0-16.71 4.54-30.06 13.62-40.06 9.08-10 20.35-15.09 33.8-15.26 5.86 0 11.95 1.52 18.27 4.57 6.32 3.04 10.42 4.62 12.3 4.73 1.52 0 5.83-1.63 12.92-4.89 7.09-3.26 13.41-4.73 18.97-4.41 14.19.76 25.4 6.13 33.62 16.12-12.54 7.6-18.66 18.02-18.36 31.25.32 10.43 4.34 19.16 12.05 26.2 7.71 7.04 16.94 11.24 27.69 12.6-2.39 7.17-5.32 14.45-8.8 21.84zM119.22 31.84c0-7.71 2.76-14.98 8.28-21.82 5.53-6.84 12.34-11.14 20.45-12.9-1.08 7.49-3.92 14.54-8.52 21.14-4.6 6.6-10.87 11.25-18.8 13.96-.44-.13-.91-.25-1.41-.38z" />
              </svg>
              <span>Sign in with Apple</span>
            </button>

            {/* Quick Guest / Direct Try Out Button */}
            <button
              type="button"
              onClick={() => handleQuickLogin('Jay')}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#EBF0E8] hover:bg-[#DCE5D7] active:scale-98 text-[#3B5433] font-bold text-xs border border-[#CFDFCB] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>ทดลองใช้งานทันที (Guest Mode)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Email login toggle */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setAuthMode('email-login')}
                className="text-[11px] text-[#7A786C] hover:text-[#2C2C24] underline cursor-pointer"
              >
                หรือเข้าสู่ระบบด้วยอีเมล
              </button>
            </div>
          </>
        ) : (
          /* Email Form */
          <form onSubmit={handleFormSubmit} className="space-y-2.5 animate-in fade-in duration-200">
            <div className="text-center mb-1">
              <span className="text-xs font-bold text-[#2C2C24]">
                {authMode === 'email-login' ? 'เข้าสู่ระบบด้วยอีเมล' : 'สร้างบัญชีใหม่'}
              </span>
            </div>

            {authMode === 'email-signup' && (
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A887A]" />
                <input
                  type="text"
                  required
                  placeholder="ชื่อของคุณ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-8.5 pr-3 py-2 text-xs rounded-xl bg-white border border-[#E8E2D5] text-[#2C2C24] outline-none focus:border-[#6C7764]"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A887A]" />
              <input
                type="email"
                required
                placeholder="อีเมลของคุณ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-8.5 pr-3 py-2 text-xs rounded-xl bg-white border border-[#E8E2D5] text-[#2C2C24] outline-none focus:border-[#6C7764]"
              />
            </div>

            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A887A]" />
              <input
                type="password"
                required
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8.5 pr-3 py-2 text-xs rounded-xl bg-white border border-[#E8E2D5] text-[#2C2C24] outline-none focus:border-[#6C7764]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#6C7764] hover:bg-[#586350] text-white text-xs font-bold active:scale-98 transition cursor-pointer shadow-xs"
            >
              {authMode === 'email-login' ? 'เข้าใช้งาน' : 'ลงทะเบียน'}
            </button>

            <div className="flex items-center justify-between text-[11px] text-[#7A786C] pt-1">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'email-login' ? 'email-signup' : 'email-login')}
                className="underline cursor-pointer"
              >
                {authMode === 'email-login' ? 'ยังไม่มีบัญชี? สมัครใหม่' : 'มีบัญชีแล้ว? เข้าสู่ระบบ'}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('welcome')}
                className="underline cursor-pointer"
              >
                ย้อนกลับ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
