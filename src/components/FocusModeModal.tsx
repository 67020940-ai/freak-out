import React, { useState, useEffect, useRef } from 'react';
import { Task, MicroStep } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  X,
  Volume2,
  VolumeX,
  Wind,
  Trophy,
  Sparkles,
  Flame,
  Check,
} from 'lucide-react';
import { MascotCloud } from './MascotCloud';
import confetti from 'canvas-confetti';
import { focusTickMs } from '../utils/demoMode';

interface FocusModeModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onCompleteTask: (task: Task) => void;
  onToggleStep: (taskId: string, stepId: string) => void;
  onOpenPanic: () => void;
}

export const FocusModeModal: React.FC<FocusModeModalProps> = ({
  isOpen,
  task,
  onClose,
  onCompleteTask,
  onToggleStep,
  onOpenPanic,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>((task?.estimatedMinutes || 25) * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundscape, setSoundscape] = useState<'none' | 'rain' | 'whitenoise' | 'lofi'>('none');
  const [mascotQuote, setMascotQuote] = useState<string>('You got this! ก้าวแรกสำคัญที่สุดนะ 🎧');
  const [timerDone, setTimerDone] = useState(false);

  // Audio simulation via Web Audio API synth for cozy focus sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    let timer: any = null;
    if (isActive && timeLeft > 0) {
      // Demo mode compresses time (1 minute = 3 seconds); display still counts real mm:ss.
      timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, focusTickMs());
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setTimerDone(true);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      setMascotQuote('หมดเวลาโฟกัสแล้ว! เก่งมากๆ เลยนะ 🥳');
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Audio tone generator
  useEffect(() => {
    if (soundscape === 'none') {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Create gentle brown noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 0.8; // volume scale
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter
      const filter = ctx.createBiquadFilter();
      filter.type = soundscape === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = soundscape === 'rain' ? 600 : 400;

      const gain = ctx.createGain();
      gain.gain.value = 0.08;
      soundNodeRef.current = gain;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(0);
    } catch (e) {
      console.log('Audio init skipped');
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [soundscape]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setMascotQuote('กำลังเข้าสู่โหมดสมาธิ... สู้ๆ นะ! 💜');
    } else {
      setMascotQuote('พักหายใจสักนิด แล้วค่อยไปต่อกันนะ ☁️');
    }
  };

  const resetTimer = (mins = task.estimatedMinutes || 25) => {
    setIsActive(false);
    setTimeLeft(mins * 60);
  };

  const addTime = (minutes: number) => {
    setTimeLeft((prev) => prev + minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    onCompleteTask(task);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#828D7A', '#B88E76', '#C49B5C', '#6C7764'],
    });
    onClose();
  };

  const completedSteps = task.microSteps.filter((s) => s.completed).length;
  const totalSteps = task.microSteps.length;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-t-[36px] w-full max-h-[94%] overflow-y-auto shadow-2xl border-t border-[#E2DACB] p-4.5 relative no-scrollbar animate-in slide-in-from-bottom duration-300">
        {/* iOS Pull Handle */}
        <div className="w-10 h-1 bg-[#2C2C24]/20 rounded-full mx-auto mb-2 shrink-0" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2DACB]">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFE9DE] text-[#55634E] text-[11px] font-bold border border-[#E2DACB]">
              <Sparkles className="w-3 h-3 text-[#828D7A]" />
              <span>Focus Mode</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* SOS Calm Button */}
            <button
              onClick={onOpenPanic}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EFE9DE] hover:bg-[#E5DDD0] text-[#55634E] text-xs font-bold border border-[#E2DACB] transition cursor-pointer"
              title="รู้สึกคิดเยอะหรือเครียด? กดเพื่อฝึกหายใจ 1 นาที"
            >
              <Wind className="w-3.5 h-3.5 text-[#828D7A] animate-pulse" />
              <span>SOS กังวล/ตัน</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#8A8A7A] hover:text-[#2C2C24] hover:bg-[#EFE9DE] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Task Spotlight */}
        <div className="text-center my-4">
          <h2 className="text-lg sm:text-2xl font-bold font-heading text-[#2C2C24] leading-snug">
            {task.title}
          </h2>
          {task.description && (
            <p className="text-xs sm:text-sm text-[#6E6E60] mt-1 max-w-md mx-auto">
              {task.description}
            </p>
          )}
        </div>

        {/* Mascot Companion with Headphones & Quote */}
        <div className="flex flex-col items-center my-3">
          <MascotCloud
            mood={isActive ? 'focus' : 'happy'}
            size="md"
            withHeadphones={true}
            withPencil={false}
            bubbleText={mascotQuote}
          />
        </div>

        {/* Timer Display */}
        <div className="my-6 text-center">
          <div className="font-heading font-extrabold text-5xl sm:text-6xl tracking-tight text-[#2C2C24] font-mono">
            {formatTime(timeLeft)}
          </div>

          {/* Quick Timer Presets */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <button
              onClick={() => resetTimer(15)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EFE9DE] hover:bg-[#E5DDD0] text-[#6E6E60] transition cursor-pointer"
            >
              15 นาที (Sprint)
            </button>
            <button
              onClick={() => resetTimer(25)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#828D7A] text-white shadow-2xs transition cursor-pointer"
            >
              25 นาที (Pomodoro)
            </button>
            <button
              onClick={() => addTime(5)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EFE9DE] hover:bg-[#E5DDD0] text-[#6E6E60] transition cursor-pointer"
            >
              +5 นาที
            </button>
          </div>

          {/* Play / Pause / Reset Controls */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-sm sm:text-base shadow-lg transition active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-[#B88E76] hover:bg-[#A67D65]'
                  : 'bg-[#828D7A] hover:bg-[#6C7764]'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 fill-white" />
                  <span>พักชั่วคราว</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>{timeLeft < (task.estimatedMinutes || 25) * 60 ? 'โฟกัสต่อ' : 'เริ่มจับเวลา ⏱️'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => resetTimer()}
              className="p-3 rounded-2xl bg-[#EFE9DE] hover:bg-[#E5DDD0] text-[#6E6E60] transition cursor-pointer"
              title="รีเซ็ตเวลา"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ambient Soundscapes */}
        <div className="bg-[#EFE9DE]/60 p-3 rounded-2xl border border-[#E2DACB] flex flex-wrap items-center justify-between gap-2 my-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#55634E]">
            <Volume2 className="w-4 h-4 text-[#828D7A]" />
            <span>เสียงสร้างสมาธิ (White Noise / Ambient):</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSoundscape('none')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                soundscape === 'none' ? 'bg-[#828D7A] text-white shadow-2xs' : 'bg-[#FAF8F5] text-[#6E6E60] border border-[#E2DACB] hover:bg-[#EFE9DE]'
              }`}
            >
              ปิดเสียง
            </button>
            <button
              onClick={() => setSoundscape('rain')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                soundscape === 'rain' ? 'bg-[#828D7A] text-white shadow-2xs' : 'bg-[#FAF8F5] text-[#6E6E60] border border-[#E2DACB] hover:bg-[#EFE9DE]'
              }`}
            >
              🌧️ เสียงฝน
            </button>
            <button
              onClick={() => setSoundscape('whitenoise')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                soundscape === 'whitenoise' ? 'bg-[#828D7A] text-white shadow-2xs' : 'bg-[#FAF8F5] text-[#6E6E60] border border-[#E2DACB] hover:bg-[#EFE9DE]'
              }`}
            >
              📻 White Noise
            </button>
          </div>
        </div>

        {/* Micro-Steps Checklist in Focus Mode */}
        {totalSteps > 0 && (
          <div className="bg-[#EFE9DE]/40 p-4 rounded-2xl border border-[#E2DACB] my-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2C2C24] uppercase tracking-wider">
                ก้าวย่อยที่จะทำในรอบนี้ ({completedSteps}/{totalSteps})
              </span>
              <span className="text-[#55634E] font-semibold">
                ติ๊กทีละข้อ สมองจะยิ่งโล่ง!
              </span>
            </div>

            <div className="space-y-1.5">
              {task.microSteps.map((step, idx) => (
                <div
                  key={step.id}
                  onClick={() => onToggleStep(task.id, step.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl transition cursor-pointer ${
                    step.completed
                      ? 'bg-[#EBF0E8] text-[#485942] border border-[#D4DDD0]'
                      : 'bg-[#FAF8F5] text-[#2C2C24] border border-[#E2DACB] hover:border-[#828D7A]'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#55634E] shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#8A8A7A] shrink-0" />
                  )}
                  <span className={`text-xs flex-1 ${step.completed ? 'line-through text-[#8A8A7A]' : 'font-medium'}`}>
                    {idx + 1}. {step.title}
                  </span>
                  {step.estimatedMinutes && (
                    <span className="text-[10px] text-[#8A8A7A] font-mono">
                      ~{step.estimatedMinutes} นาที
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete Task CTA */}
        <div className="pt-4 border-t border-[#E2DACB] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[#6E6E60] hover:bg-[#EFE9DE] text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            พักไว้ก่อน / ออก
          </button>

          <button
            onClick={handleFinish}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#828D7A] hover:bg-[#6C7764] text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>ทำงานนี้เสร็จสมบูรณ์แล้ว! (+50 XP) 🌿</span>
          </button>
        </div>
      </div>
    </div>
  );
};
