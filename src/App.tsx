import React, { useState, useEffect } from 'react';
import { Task, UserStats, Badge, PetState } from './types';
import { INITIAL_TASKS, INITIAL_STATS, INITIAL_BADGES } from './data/mockData';
import { Header, AppTab } from './components/Header';
import { TaskList } from './components/TaskList';
import { SmartPickModal } from './components/SmartPickModal';
import { FocusModeModal } from './components/FocusModeModal';
import { TaskInputModal } from './components/TaskInputModal';
import { PanicCalmModal } from './components/PanicCalmModal';
import { GamificationView } from './components/GamificationView';
import { PricingModal } from './components/PricingModal';
import { MascotCloud } from './components/MascotCloud';
import { CloudPetView } from './components/CloudPetView';
import { CalendarView } from './components/CalendarView';
import { DailyRewardModal } from './components/DailyRewardModal';
import { AdSimulationBanner } from './components/AdSimulationBanner';

const INITIAL_PET: PetState = {
  name: 'นูเบ้',
  level: 2,
  affinity: 50,
  mood: 'happy',
  equippedAccessory: 'glasses',
  stardust: 350,
  streakFreezes: 1,
};

export default function App() {
  // Persistence via localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('freakout_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('freakout_stats');
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem('freakout_badges');
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [pet, setPet] = useState<PetState>(() => {
    try {
      const saved = localStorage.getItem('freakout_pet');
      return saved ? JSON.parse(saved) : INITIAL_PET;
    } catch {
      return INITIAL_PET;
    }
  });

  const [isProUser, setIsProUser] = useState<boolean>(() => {
    try {
      return localStorage.getItem('freakout_is_pro') === 'true';
    } catch {
      return false;
    }
  });

  const [currentTab, setCurrentTab] = useState<AppTab>('tasks');
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSmartPickOpen, setIsSmartPickOpen] = useState<boolean>(false);
  const [isPanicModalOpen, setIsPanicModalOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('freakout_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('freakout_stats', JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem('freakout_badges', JSON.stringify(badges));
    } catch (e) {
      console.error(e);
    }
  }, [badges]);

  useEffect(() => {
    try {
      localStorage.setItem('freakout_pet', JSON.stringify(pet));
    } catch (e) {
      console.error(e);
    }
  }, [pet]);

  useEffect(() => {
    try {
      localStorage.setItem('freakout_is_pro', String(isProUser));
    } catch (e) {
      console.error(e);
    }
  }, [isProUser]);

  // Award XP and update stats
  const awardXp = (amount: number, isOverthinkingTask = false, minutesFocused = 0) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      const nextLevelThreshold = prev.level * 500;
      const newLevel = newXp >= nextLevelThreshold ? prev.level + 1 : prev.level;
      let levelTitle = prev.levelTitle;
      if (newLevel === 2) levelTitle = 'นักเริ่มงานมือโปร (Focus Starter)';
      if (newLevel === 3) levelTitle = 'ผู้ปราบความขี้เกียจ (Procrastination Slayer)';
      if (newLevel >= 4) levelTitle = 'ปรมาจารย์สมองโล่ง (Zen Productivity Master)';

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        levelTitle,
        tasksCompletedTotal: prev.tasksCompletedTotal + 1,
        minutesFocusedTotal: prev.minutesFocusedTotal + minutesFocused,
        overthinkingTasksSolved: isOverthinkingTask
          ? prev.overthinkingTasksSolved + 1
          : prev.overthinkingTasksSolved,
      };
    });

    // Also increase pet affinity and stardust!
    setPet((prev) => ({
      ...prev,
      affinity: Math.min(100, prev.affinity + 5),
      stardust: prev.stardust + 10,
    }));
  };

  // Toggle Task Completion
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            awardXp(50, t.isOverthinkingProne, t.estimatedMinutes);
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  // Toggle MicroStep Completion
  const handleToggleStep = (taskId: string, stepId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSteps = t.microSteps.map((s) =>
            s.id === stepId ? { ...s, completed: !s.completed } : s
          );
          const allDone = updatedSteps.length > 0 && updatedSteps.every((s) => s.completed);
          return {
            ...t,
            microSteps: updatedSteps,
            completed: allDone ? true : t.completed,
          };
        }
        return t;
      })
    );
  };

  // Add or Edit Task
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'> & { id?: string }) => {
    if (taskData.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
              }
            : t
        )
      );
    } else {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        completed: false,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleStartFocus = (task: Task) => {
    setActiveFocusTask(task);
  };

  const handleCompleteFocusTask = (task: Task) => {
    handleToggleTask(task.id);
  };

  const handleClaimDailyReward = (reward: { stardust: number; xp: number; freezes?: number }) => {
    setPet((prev) => ({
      ...prev,
      stardust: prev.stardust + reward.stardust,
      streakFreezes: prev.streakFreezes + (reward.freezes || 0),
    }));
    awardXp(reward.xp);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2] text-[#2C2C24]">
      {/* App Header */}
      <Header
        stats={stats}
        pet={pet}
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenNewTask={() => {
          setEditingTask(null);
          setIsNewTaskModalOpen(true);
        }}
        onOpenSmartPick={() => setIsSmartPickOpen(true)}
        onOpenPanic={() => setIsPanicModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenDailyReward={() => setIsDailyRewardOpen(true)}
        isProUser={isProUser}
        onToggleProMode={() => setIsProUser((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Ad simulation banner for free users */}
        <AdSimulationBanner
          isProUser={isProUser}
          onOpenPricing={() => setIsPricingModalOpen(true)}
          onRewardGranted={() => {
            setPet((prev) => ({ ...prev, stardust: prev.stardust + 30 }));
          }}
        />

        {/* Tab 1: Tasks */}
        {currentTab === 'tasks' && (
          <TaskList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onToggleStep={handleToggleStep}
            onStartFocus={handleStartFocus}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsNewTaskModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onOpenNewTask={() => {
              setEditingTask(null);
              setIsNewTaskModalOpen(true);
            }}
            onOpenSmartPick={() => setIsSmartPickOpen(true)}
          />
        )}

        {/* Tab 2: Cloud Pet Sanctuary */}
        {currentTab === 'cloud-pet' && (
          <CloudPetView
            pet={pet}
            onUpdatePet={setPet}
            onOpenPanic={() => setIsPanicModalOpen(true)}
            streakDays={stats.streakDays}
          />
        )}

        {/* Tab 3: Calendar & Timeline */}
        {currentTab === 'calendar' && (
          <CalendarView
            tasks={tasks}
            onStartFocus={handleStartFocus}
            isProUser={isProUser}
            onOpenPricing={() => setIsPricingModalOpen(true)}
          />
        )}

        {/* Tab 4: Smart Pick */}
        {currentTab === 'smart-pick' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#E2DACB] shadow-2xs text-center">
              <MascotCloud size="lg" mood="cheering" useArtwork={true} bubbleText="บอกระดับพลังงานมาได้เลย เค้าจะเลือกงานให้เอง!" />
              <h2 className="text-2xl font-bold font-heading text-[#2C2C24] mt-4">
                AI & Smart Recommendation Engine
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E60] max-w-md mx-auto mt-1 mb-6">
                ฟังก์ชันหลักตามแนวคิด freak out: วิเคราะห์งานตามความเร่งด่วน ความสำคัญ เวลาที่มี และระดับพลังงานของผู้ใช้
              </p>
              <button
                onClick={() => setIsSmartPickOpen(true)}
                className="px-6 py-3 rounded-2xl bg-[#828D7A] hover:bg-[#6C7764] text-white font-bold text-sm shadow-md transition active:scale-95 cursor-pointer"
              >
                เปิดเครื่องมือช่วยเลือกงาน (Smart Pick) 🎯
              </button>
            </div>

            {/* Quick Tips */}
            <div className="bg-[#EFE9DE]/70 rounded-3xl p-6 border border-[#E2DACB] space-y-3">
              <h3 className="text-sm font-bold text-[#2C2C24] uppercase tracking-wider">
                💡 กฎ 2 นาทีสยบ Overthinking:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#2C2C24]">
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E2DACB] shadow-2xs">
                  <span className="font-bold text-[#55634E]">1. ก้าวแรกสุดจิ๋ว:</span> อย่าคิดถึงงานทั้งก้อน ให้เริ่มแค่เปิดไฟล์หรือหยิบปากกา
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E2DACB] shadow-2xs">
                  <span className="font-bold text-[#55634E]">2. ทำแบบร่างห่วยๆ:</span> ร่างแรกไม่จำเป็นต้องสมบูรณ์แบบ แค่ทำให้มีตัวตนขึ้นมาก่อน
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E2DACB] shadow-2xs">
                  <span className="font-bold text-[#55634E]">3. Low Energy Mode:</span> วันที่เหนื่อยล้า ให้เลือกงานเบาๆ 5-10 นาที
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E2DACB] shadow-2xs">
                  <span className="font-bold text-[#55634E]">4. ปล่อยวางความกังวล:</span> ใช้ปุ่ม SOS ฝึกหายใจเมื่อรู้สึกเริ่มคิดวน
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Gamification & Badges */}
        {currentTab === 'gamification' && (
          <GamificationView stats={stats} badges={badges} />
        )}
      </main>

      {/* Hallmark Ft1 Minimal Status Bar Footer */}
      <footer className="border-t border-[#EAE4D9] bg-[#FAF8F5]/90 py-6 text-xs text-[#7A786C]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-heading font-bold text-[#2C2C24] tracking-tight">freak out</span>
            <span className="text-[#8A8A7A]">•</span>
            <span className="font-medium text-[#5F7554]">Less thinking, More doing</span>
            <span className="hidden sm:inline text-[#E2DACB]">|</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#EAE8F5] text-[#5C4D82] border border-[#DDD5EF]">
              Hallmark · Workbench
            </span>
          </div>
          <div className="text-[11px] text-[#8A887A]">
            Tactile Habit & Anti-Burnout Companion • ออกแบบสำหรับคนรุ่นใหม่และคนวัยทำงาน 🌿
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TaskInputModal
        isOpen={isNewTaskModalOpen}
        onClose={() => {
          setIsNewTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSaveTask={handleSaveTask}
        initialTask={editingTask}
      />

      <SmartPickModal
        isOpen={isSmartPickOpen}
        onClose={() => setIsSmartPickOpen(false)}
        tasks={tasks}
        onStartFocus={handleStartFocus}
        onOpenNewTask={() => {
          setIsSmartPickOpen(false);
          setIsNewTaskModalOpen(true);
        }}
      />

      <FocusModeModal
        isOpen={!!activeFocusTask}
        task={activeFocusTask}
        onClose={() => setActiveFocusTask(null)}
        onCompleteTask={handleCompleteFocusTask}
        onToggleStep={handleToggleStep}
        onOpenPanic={() => setIsPanicModalOpen(true)}
      />

      <PanicCalmModal
        isOpen={isPanicModalOpen}
        onClose={() => setIsPanicModalOpen(false)}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        isProUser={isProUser}
        onUpgradePro={() => setIsProUser(true)}
      />

      <DailyRewardModal
        isOpen={isDailyRewardOpen}
        onClose={() => setIsDailyRewardOpen(false)}
        streakDays={stats.streakDays}
        onClaimReward={handleClaimDailyReward}
      />
    </div>
  );
}
