import React from 'react';
import { UserStats, Badge } from '../types';
import { Award, Flame, Zap, Trophy, Clock, CheckCircle2, Star, Sparkles, Lock } from 'lucide-react';
import { MascotCloud } from './MascotCloud';

interface GamificationViewProps {
  stats: UserStats;
  badges: Badge[];
  onClaimBadge?: (badgeId: string) => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({ stats, badges }) => {
  const currentXp = stats.xp;
  const nextLevelXp = stats.level * 500;
  const prevLevelXp = (stats.level - 1) * 500;
  const levelProgress = Math.min(
    100,
    Math.max(0, ((currentXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100)
  );

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Level Progress & Mascot */}
      <div className="bg-gradient-to-r from-[#EFE9DE] via-[#FAF8F5] to-[#F6EFEA] rounded-3xl p-6 border border-[#E2DACB] shadow-2xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <MascotCloud size="md" mood="cheering" withSparkles={true} bubbleText="เก่งมาก! ทำงานสำเร็จอีกขั้นแล้ว ✨" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#828D7A] text-white font-bold text-xs shadow-2xs">
                  Level {stats.level}
                </span>
                <span className="text-xs text-[#55634E] font-bold">
                  {stats.levelTitle}
                </span>
              </div>

              <h2 className="text-2xl font-extrabold font-heading text-[#2C2C24] mt-1">
                {stats.xp} <span className="text-sm font-semibold text-[#6E6E60]">/ {nextLevelXp} XP</span>
              </h2>

              {/* Progress Bar */}
              <div className="w-full sm:w-64 bg-[#EFE9DE] h-3 rounded-full overflow-hidden border border-[#E2DACB] mt-2">
                <div
                  className="bg-[#828D7A] h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-[#6E6E60] mt-1 font-medium">
                ต้องการอีก {nextLevelXp - currentXp} XP เพื่อเลเวลอัพเป็น Lv.{stats.level + 1}!
              </p>
            </div>
          </div>

          {/* Streak Flame Showcase */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2DACB] shadow-2xs flex items-center gap-3.5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF3E5] border border-[#EDE0C4] flex items-center justify-center">
              <Flame className="w-7 h-7 text-[#B88E76] fill-[#B88E76] animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xl font-extrabold text-[#2C2C24]">
                {stats.streakDays} วันติด! 🔥
              </div>
              <p className="text-xs text-[#6E6E60]">
                รักษาความสม่ำเสมอทุกวันเพื่อโบนัส XP
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2DACB] shadow-2xs">
          <div className="flex items-center gap-2 text-[#55634E] text-xs font-bold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>งานที่เสร็จสิ้น</span>
          </div>
          <div className="text-2xl font-extrabold text-[#2C2C24]">
            {stats.tasksCompletedTotal}
          </div>
          <div className="text-[11px] text-[#8A8A7A] mt-0.5">ชิ้นงานทั้งหมด</div>
        </div>

        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2DACB] shadow-2xs">
          <div className="flex items-center gap-2 text-[#828D7A] text-xs font-bold mb-1">
            <Clock className="w-4 h-4" />
            <span>เวลาที่โฟกัส</span>
          </div>
          <div className="text-2xl font-extrabold text-[#2C2C24]">
            {stats.minutesFocusedTotal}
          </div>
          <div className="text-[11px] text-[#8A8A7A] mt-0.5">นาทีในโหมด Focus</div>
        </div>

        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2DACB] shadow-2xs">
          <div className="flex items-center gap-2 text-[#B88E76] text-xs font-bold mb-1">
            <Zap className="w-4 h-4" />
            <span>ปราบ Overthinking</span>
          </div>
          <div className="text-2xl font-extrabold text-[#2C2C24]">
            {stats.overthinkingTasksSolved}
          </div>
          <div className="text-[11px] text-[#8A8A7A] mt-0.5">งานที่เคยคิดวนแต่ทำสำเร็จ</div>
        </div>

        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2DACB] shadow-2xs">
          <div className="flex items-center gap-2 text-[#8C6D37] text-xs font-bold mb-1">
            <Trophy className="w-4 h-4" />
            <span>เหรียญรางวัล (Badges)</span>
          </div>
          <div className="text-2xl font-extrabold text-[#2C2C24]">
            {unlockedCount}/{badges.length}
          </div>
          <div className="text-[11px] text-[#8A8A7A] mt-0.5">ปลดล็อกแล้ว</div>
        </div>
      </div>

      {/* Badges Collection Grid */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-[#E2DACB] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-heading text-[#2C2C24] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#828D7A]" />
              <span>คลังเหรียญรางวัล & สติกเกอร์ (Badges Collection)</span>
            </h3>
            <p className="text-xs text-[#6E6E60] mt-0.5">
              ปลดล็อกเพื่อรับ XP และเพิ่มพลังใจให้ตัวเอง!
            </p>
          </div>
          <span className="text-xs font-bold text-[#55634E] bg-[#EFE9DE] px-3 py-1 rounded-full border border-[#E2DACB]">
            สำเร็จ {Math.round((unlockedCount / badges.length) * 100)}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-[#EFE9DE]/50 to-[#FAF8F5] border-[#828D7A] shadow-2xs'
                  : 'bg-[#FAF8F5]/60 border-[#E2DACB] opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#E2DACB] flex items-center justify-center text-xl shadow-2xs">
                    {badge.icon}
                  </div>
                  {badge.unlocked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF0E8] text-[#485942] border border-[#D4DDD0]">
                      <Sparkles className="w-3 h-3 text-[#55634E]" />
                      <span>ได้แล้ว</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFE9DE] text-[#6E6E60]">
                      <Lock className="w-3 h-3 text-[#8A8A7A]" />
                      <span>ล็อกอยู่</span>
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-[#2C2C24]">
                  {badge.title}
                </h4>
                <p className="text-xs text-[#6E6E60] mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#E2DACB] flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#55634E]">
                  +{badge.xpReward} XP
                </span>
                {badge.unlockedAt && (
                  <span className="text-[#8A8A7A] font-mono text-[10px]">
                    {badge.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
