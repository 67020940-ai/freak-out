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
    <div className="w-full space-y-4 pb-16">
      {/* Top Banner: Level Progress & Mascot */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E2D5] shadow-2xs space-y-3">
        <div className="flex items-center gap-3">
          <MascotCloud size="sm" mood="cheering" withSparkles={true} bubbleText="เก่งมาก! ✨" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-2 py-0.2 rounded-full bg-[#6C7764] text-white font-bold text-[10px]">
                Lv. {stats.level}
              </span>
              <span className="text-[11px] text-[#485342] font-bold truncate">
                {stats.levelTitle}
              </span>
            </div>

            <h2 className="text-lg font-bold font-heading text-[#2C2C24]">
              {stats.xp} <span className="text-xs font-semibold text-[#8A887A]">/ {nextLevelXp} XP</span>
            </h2>

            {/* Progress Bar */}
            <div className="w-full bg-[#EFE9DE] h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#6C7764] h-full rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-[#8A887A] mt-1 font-medium">
              ต้องการอีก {nextLevelXp - currentXp} XP เพื่อเลเวลอัพ
            </p>
          </div>
        </div>

        {/* Streak Flame Showcase */}
        <div className="bg-white p-3 rounded-2xl border border-[#E8E2D5] shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FDECE8] border border-[#F6D7D0] flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#E05A47] fill-[#E05A47]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-[#2C2C24]">
                สตรีคต่อเนื่อง {stats.streakDays} วัน 🔥
              </div>
              <p className="text-[10px] text-[#8A887A]">
                เช็คอินทุกวันเพื่อรับละอองดาว
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid (2x2 Mobile Grid) */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E2DACB] shadow-2xs">
          <div className="flex items-center gap-1.5 text-[#55634E] text-[11px] font-bold mb-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>งานเสร็จสิ้น</span>
          </div>
          <div className="text-xl font-extrabold text-[#2C2C24]">
            {stats.tasksCompletedTotal}
          </div>
          <div className="text-[10px] text-[#8A8A7A]">ชิ้นงานทั้งหมด</div>
        </div>

        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E2DACB] shadow-2xs">
          <div className="flex items-center gap-1.5 text-[#828D7A] text-[11px] font-bold mb-0.5">
            <Clock className="w-3.5 h-3.5" />
            <span>เวลาโฟกัส</span>
          </div>
          <div className="text-xl font-extrabold text-[#2C2C24]">
            {stats.minutesFocusedTotal}
          </div>
          <div className="text-[10px] text-[#8A8A7A]">นาทีโฟกัส</div>
        </div>

        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E2DACB] shadow-2xs">
          <div className="flex items-center gap-1.5 text-[#9E745E] text-[11px] font-bold mb-0.5">
            <Zap className="w-3.5 h-3.5" />
            <span>ปราบคิดวน</span>
          </div>
          <div className="text-xl font-extrabold text-[#2C2C24]">
            {stats.overthinkingTasksSolved}
          </div>
          <div className="text-[10px] text-[#8A8A7A]">งานที่เอาชนะได้</div>
        </div>

        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E2DACB] shadow-2xs">
          <div className="flex items-center gap-1.5 text-[#8C6D37] text-[11px] font-bold mb-0.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>เหรียญรางวัล</span>
          </div>
          <div className="text-xl font-extrabold text-[#2C2C24]">
            {unlockedCount}/{badges.length}
          </div>
          <div className="text-[10px] text-[#8A8A7A]">ปลดล็อกแล้ว</div>
        </div>
      </div>

      {/* Badges Collection Grid (Mobile-friendly 2 columns) */}
      <div className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E2DACB] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold font-heading text-[#2C2C24] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#828D7A]" />
              <span>คลังเหรียญรางวัล (Badges)</span>
            </h3>
            <p className="text-[10px] text-[#7A786C]">
              สะสมเมื่อพิชิตภารกิจและก้าวข้ามการคิดวน
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#55634E] bg-[#EFE9DE] px-2.5 py-0.5 rounded-full border border-[#E2DACB] shrink-0">
            {unlockedCount}/{badges.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-2xl border transition relative flex flex-col justify-between ${
                badge.unlocked
                  ? 'bg-white border-[#828D7A] shadow-2xs'
                  : 'bg-[#FAF8F5]/80 border-[#E2DACB] opacity-65'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#E2DACB] flex items-center justify-center text-lg shadow-2xs">
                    {badge.icon}
                  </div>
                  {badge.unlocked ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#EBF0E8] text-[#485942] border border-[#D4DDD0]">
                      <Sparkles className="w-2.5 h-2.5 text-[#55634E]" />
                      <span>ได้แล้ว</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-[#EFE9DE] text-[#6E6E60]">
                      <Lock className="w-2.5 h-2.5 text-[#8A887A]" />
                      <span>ล็อก</span>
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-[#2C2C24] leading-snug line-clamp-1">
                  {badge.title}
                </h4>
                <p className="text-[10px] text-[#7A786C] mt-0.5 leading-snug line-clamp-2">
                  {badge.description}
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-[#EAE4D9] flex items-center justify-between text-[10px]">
                <span className="font-semibold text-[#55634E]">
                  +{badge.xpReward} XP
                </span>
                {badge.unlockedAt && (
                  <span className="text-[#8A887A] font-mono text-[9px]">
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
