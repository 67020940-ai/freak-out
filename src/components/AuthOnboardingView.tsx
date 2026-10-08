import React, { useState } from 'react';
import { PixelCloud8Bit } from './PixelCloud8Bit';
import { ArrowRight, Sparkles, Check, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loginWithGoogle, registerWithEmail, loginWithEmail } from '../services/firebase';

interface AuthOnboardingViewProps {
  onLogin: (userName: string) => void;
}

export const AuthOnboardingView: React.FC<AuthOnboardingViewProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'welcome' | 'email-login' | 'email-signup'>('email-signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const session = await loginWithGoogle();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6C7764', '#9E745E', '#EAE3D5'],
      });
      onLogin(session.user?.displayName || 'ผู้ใช้งานใหม่');
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setErrorMessage(err.message || 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickGuestLogin = () => {
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#6C7764', '#9E745E', '#EAE3D5'],
    });
    const guestName = 'ผู้เยี่ยมชม';
    const guestSession = {
      user: {
        uid: `guest-${Date.now()}`,
        displayName: guestName,
        email: 'guest@freakout.app',
        photoURL: null,
      },
      googleAccessToken: null,
    };
    localStorage.setItem('freakout_auth_session', JSON.stringify(guestSession));
    onLogin(guestName);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (authMode === 'email-signup') {
        const session = await registerWithEmail(name, email, password);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#6C7764', '#9E745E', '#EAE3D5'],
        });
        onLogin(session.user?.displayName || name);
      } else {
        const session = await loginWithEmail(email, password);
        onLogin(session.user?.displayName || email.split('@')[0]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsLoading(false);
    }
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

      {/* Center 8-bit Mascot Stage */}
      <div className="my-auto py-6 flex flex-col items-center justify-center text-center">
        {/* Animated Speech Bubble */}
        <div className="mb-3 px-4 py-2 rounded-2xl bg-white border border-[#E8E2D5] text-xs sm:text-sm font-bold text-[#2C2C24] shadow-2xs relative animate-bounce">
          <span>พร้อมเริ่มวันใหม่แบบสมองโล่งรึยัง?</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b border-r border-[#E8E2D5] transform rotate-45" />
        </div>

        {/* 8-bit Animated Cloud Character */}
        <div className="relative my-2">
          <div className="w-36 h-36 rounded-full bg-[#EBF0E8]/70 flex items-center justify-center p-3 shadow-inner border border-[#CFDFCB]">
            <PixelCloud8Bit pose="celebrate" size="lg" interactive={true} />
          </div>
          <div className="absolute -top-1 -right-1 px-2.5 py-0.5 rounded-full bg-[#FFF4E0] border border-[#F4E1BD] text-[10px] font-bold text-[#8A5C1E] shadow-2xs">
            Hallmark Minimal
          </div>
        </div>

        {/* Philosophy headline */}
        <div className="mt-4 max-w-xs space-y-1">
          <h2 className="text-lg font-bold font-heading text-[#2C2C24]">
            หยุดคิดเยอะ แล้วลงมือทำ
          </h2>
          <p className="text-xs text-[#7A786C] leading-relaxed">
            เปลี่ยนความกังวลให้เป็น 1 ก้าวเล็กๆ ที่ทำได้จริง พร้อมเชื่อมต่อ Google Calendar และ AI วิเคราะห์พลังงาน
          </p>
        </div>
      </div>

      {/* Bottom Auth Actions */}
      <div className="w-full max-w-xs mx-auto space-y-2.5 pb-2">
        {authMode === 'welcome' ? (
          <>
            <div className="text-center mb-1">
              <span className="text-[11px] font-semibold text-[#8A887A]">
                เข้าสู่ระบบเพื่อซิงค์ข้อมูลจริง
              </span>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#F7F4EE] active:scale-98 text-[#2C2C24] font-bold text-xs sm:text-sm border border-[#DED7C8] shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
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
              <span>{isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google'}</span>
            </button>

            {/* Email Login/Signup buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAuthMode('email-signup')}
                className="w-full py-2.5 px-3 rounded-2xl bg-[#6C7764] hover:bg-[#586350] active:scale-98 text-white font-bold text-xs shadow-xs transition cursor-pointer text-center"
              >
                สมัครสมาชิกใหม่
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('email-login')}
                className="w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-[#F7F4EE] active:scale-98 text-[#2C2C24] font-bold text-xs border border-[#DED7C8] shadow-xs transition cursor-pointer text-center"
              >
                เข้าสู่ระบบ
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

            {errorMessage && (
              <div className="p-2 rounded-xl bg-[#FDECE8] border border-[#F6D7D0] text-[#C23A25] text-[11px] text-center font-medium">
                {errorMessage}
              </div>
            )}

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
