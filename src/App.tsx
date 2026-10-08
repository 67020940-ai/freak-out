import React, { useState, useEffect } from 'react';
import { Task, UserStats, Badge, PetState, EnergyLevel, MicroStep, AppTab, AppSettings, FocusSpace } from './types';
import { INITIAL_TASKS, INITIAL_STATS, INITIAL_BADGES } from './data/mockData';
import { MobileAppHeader } from './components/MobileAppHeader';
import { MobileBottomTabBar } from './components/MobileBottomTabBar';
import { MobileSmartPickView } from './components/MobileSmartPickView';
import { TaskList } from './components/TaskList';
import { SmartPickModal } from './components/SmartPickModal';
import { FocusModeModal } from './components/FocusModeModal';
import { TaskInputModal } from './components/TaskInputModal';
import { PanicCalmModal } from './components/PanicCalmModal';
import { GamificationView } from './components/GamificationView';
import { PricingModal } from './components/PricingModal';
import { CloudPetView } from './components/CloudPetView';
import { CalendarView } from './components/CalendarView';
import { DailyRewardModal } from './components/DailyRewardModal';
import { AdSimulationBanner } from './components/AdSimulationBanner';
import { AuthOnboardingView } from './components/AuthOnboardingView';
import { MindfulJournalModal } from './components/MindfulJournalModal';
import { SettingsView } from './components/SettingsView';
import { SpacesDrawerModal, DEFAULT_SPACES } from './components/SpacesDrawerModal';

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
  // Auth state
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem('freakout_username') || 'Jay';
    } catch {
      return 'Jay';
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('freakout_authenticated');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

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

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('freakout_app_settings');
      return saved ? JSON.parse(saved) : {
        focusShieldEnabled: true,
        smartBufferMinutes: 15,
        soundEnabled: true,
        hapticEnabled: true,
        cloudColor: 'white',
        autoSyncGoogleCalendar: true,
      };
    } catch {
      return {
        focusShieldEnabled: true,
        smartBufferMinutes: 15,
        soundEnabled: true,
        hapticEnabled: true,
        cloudColor: 'white',
        autoSyncGoogleCalendar: true,
      };
    }
  });

  const [spaces, setSpaces] = useState<FocusSpace[]>(() => {
    try {
      const saved = localStorage.getItem('freakout_spaces');
      return saved ? JSON.parse(saved) : DEFAULT_SPACES;
    } catch {
      return DEFAULT_SPACES;
    }
  });
  const [activeSpaceId, setActiveSpaceId] = useState<string>('space-general');
  const [isSpacesDrawerOpen, setIsSpacesDrawerOpen] = useState<boolean>(false);

  const [currentTab, setCurrentTab] = useState<AppTab>('tasks');
  // Track by id so Focus Mode always renders the live task (step ticks update instantly)
  const [activeFocusTaskId, setActiveFocusTaskId] = useState<string | null>(null);
  const activeFocusTask = tasks.find((t) => t.id === activeFocusTaskId) ?? null;
  // Shared between Home and Smart Pick so the energy chosen on Home carries over
  const [energy, setEnergy] = useState<EnergyLevel>('okay');
  // Bumped when a focus session completes so Home can play the sky-clearing moment
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSmartPickOpen, setIsSmartPickOpen] = useState<boolean>(false);
  const [isPanicModalOpen, setIsPanicModalOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);

  // Sync spaces to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('freakout_spaces', JSON.stringify(spaces));
    } catch (e) {
      console.error(e);
    }
  }, [spaces]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('freakout_app_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

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
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    const nextCompleted = !target.completed;
    if (nextCompleted) {
      awardXp(50, target.isOverthinkingProne, target.estimatedMinutes);
    }
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  };

  // Replace a task's micro-steps (AI breakdown from Smart Pick)
  const handleUpdateSteps = (taskId: string, microSteps: MicroStep[]) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, microSteps } : t)));
  };

  // Toggle MicroStep Completion (ticking the last step completes the task)
  const handleToggleStep = (taskId: string, stepId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    const updatedSteps = target.microSteps.map((s) =>
      s.id === stepId ? { ...s, completed: !s.completed } : s
    );
    const allDone = updatedSteps.length > 0 && updatedSteps.every((s) => s.completed);
    const becomesCompleted = allDone && !target.completed;
    if (becomesCompleted) {
      awardXp(50, target.isOverthinkingProne, target.estimatedMinutes);
    }
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              microSteps: updatedSteps,
              completed: allDone ? true : t.completed,
              completedAt: becomesCompleted ? new Date().toISOString() : t.completedAt,
            }
          : t
      )
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
    setActiveFocusTaskId(task.id);
  };

  // Idempotent: ticking every step may already have completed the task.
  const handleCompleteFocusTask = (task: Task) => {
    const current = tasks.find((t) => t.id === task.id);
    if (current && !current.completed) handleToggleTask(task.id);
    setPet((prev) => ({ ...prev, mood: 'celebrate' }));
    setCurrentTab('tasks');
    setCelebrateKey((k) => k + 1);
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
    <div className="min-h-screen bg-[#F9F7F2] text-[#2C2C24] flex flex-col selection:bg-[#E2DACB] antialiased">
      {/* Conditional Rendering: Auth/Onboarding vs Main App */}
      {!isAuthenticated ? (
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-[#FAF8F5] rounded-3xl border border-[#EAE4D9] p-4 shadow-sm">
            <AuthOnboardingView
              onLogin={(name) => {
                setUserName(name);
                setIsAuthenticated(true);
                localStorage.setItem('freakout_authenticated', 'true');
                localStorage.setItem('freakout_username', name);
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0 flex flex-col w-full">
          {/* Top Web & Mobile Header */}
          <MobileAppHeader
            stats={stats}
            pet={pet}
            currentTab={currentTab}
            onTabChange={(tab) => setCurrentTab(tab)}
            onOpenPanic={() => setIsPanicModalOpen(true)}
            onOpenPricing={() => setIsPricingModalOpen(true)}
            onOpenDailyReward={() => setIsDailyRewardOpen(true)}
            isProUser={isProUser}
            activeSpaceName={spaces.find((s) => s.id === activeSpaceId)?.name || 'ห้องหลัก (General)'}
            onOpenSpaces={() => setIsSpacesDrawerOpen(true)}
          />

          {/* Scrollable Screen Content */}
          <main className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 w-full max-w-4xl mx-auto relative no-scrollbar">
              {/* Tab 1: Tasks (Clean, Intentional Home Dashboard) */}
              {currentTab === 'tasks' && (
                <TaskList
                  tasks={tasks}
                  userName={userName}
                  streakDays={stats.streakDays}
                  minutesFocusedTotal={stats.minutesFocusedTotal}
                  energy={energy}
                  onEnergyChange={setEnergy}
                  petAccessory={pet.equippedAccessory}
                  celebrateKey={celebrateKey}
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
                  onOpenSmartPick={() => {
                    setCurrentTab('smart-pick');
                  }}
                  onOpenPanic={() => setIsPanicModalOpen(true)}
                  onOpenJournal={() => setIsJournalOpen(true)}
                />
              )}

              {/* Tab 2: Calendar & Gap Detection */}
              {currentTab === 'calendar' && (
                <CalendarView
                  tasks={tasks}
                  onStartFocus={handleStartFocus}
                  isProUser={isProUser}
                  onOpenPricing={() => setIsPricingModalOpen(true)}
                />
              )}

              {/* Tab 3: Dedicated Smart Pick View */}
              {currentTab === 'smart-pick' && (
                <MobileSmartPickView
                  tasks={tasks}
                  energy={energy}
                  onEnergyChange={setEnergy}
                  onUpdateSteps={handleUpdateSteps}
                  onStartFocus={handleStartFocus}
                  onOpenNewTask={() => {
                    setEditingTask(null);
                    setIsNewTaskModalOpen(true);
                  }}
                />
              )}

              {/* Tab 4: Cloud Pet Sanctuary (นูเบ้) */}
              {currentTab === 'cloud-pet' && (
                <CloudPetView
                  pet={pet}
                  onUpdatePet={setPet}
                  onOpenPanic={() => setIsPanicModalOpen(true)}
                  streakDays={stats.streakDays}
                />
              )}

              {/* Tab 5: Gamification, Badges & Streaks */}
              {currentTab === 'gamification' && (
                <GamificationView stats={stats} badges={badges} />
              )}

              {/* Tab 6: Settings & AI Cognitive Assessment */}
              {currentTab === 'settings' && (
                <SettingsView
                  tasks={tasks}
                  energy={energy}
                  cloudColor={pet.color || 'white'}
                  onUpdateCloudColor={(color) => setPet((prev) => ({ ...prev, color }))}
                  onLogout={() => {
                    setIsAuthenticated(false);
                    localStorage.removeItem('freakout_authenticated');
                  }}
                  settings={settings}
                  onUpdateSettings={setSettings}
                />
              )}
            </main>

            {/* Docked Mobile Bottom Tab Bar */}
            <MobileBottomTabBar
              currentTab={currentTab}
              onTabChange={(tab) => setCurrentTab(tab)}
              onTriggerSmartPick={() => setCurrentTab('smart-pick')}
            />
          </div>

          {/* Modals & Overlays */}
          <SmartPickModal
            isOpen={isSmartPickOpen}
            onClose={() => setIsSmartPickOpen(false)}
            tasks={tasks}
            onStartFocus={handleStartFocus}
            onOpenNewTask={() => {
              setIsSmartPickOpen(false);
              setEditingTask(null);
              setIsNewTaskModalOpen(true);
            }}
          />

          {activeFocusTask && (
            <FocusModeModal
              key={activeFocusTask.id}
              isOpen
              task={activeFocusTask}
              onClose={() => setActiveFocusTaskId(null)}
              onCompleteTask={handleCompleteFocusTask}
              onToggleStep={handleToggleStep}
              onOpenPanic={() => setIsPanicModalOpen(true)}
            />
          )}

          <TaskInputModal
            isOpen={isNewTaskModalOpen}
            onClose={() => {
              setIsNewTaskModalOpen(false);
              setEditingTask(null);
            }}
            onSaveTask={handleSaveTask}
            initialTask={editingTask}
          />

          <PanicCalmModal
            isOpen={isPanicModalOpen}
            onClose={() => setIsPanicModalOpen(false)}
          />

          <PricingModal
            isOpen={isPricingModalOpen}
            onClose={() => setIsPricingModalOpen(false)}
            isProUser={isProUser}
            onSelectPlan={(planId) => {
              setIsProUser(true);
              setIsPricingModalOpen(false);
            }}
          />

          <DailyRewardModal
            isOpen={isDailyRewardOpen}
            onClose={() => setIsDailyRewardOpen(false)}
            onClaim={handleClaimDailyReward}
            streakDays={stats.streakDays}
            freezesAvailable={pet.streakFreezes}
          />

          <MindfulJournalModal
            isOpen={isJournalOpen}
            onClose={() => setIsJournalOpen(false)}
            minutesFocused={stats.minutesFocusedTotal}
            tasksCompleted={stats.tasksCompletedTotal}
          />

          <SpacesDrawerModal
            isOpen={isSpacesDrawerOpen}
            onClose={() => setIsSpacesDrawerOpen(false)}
            spaces={spaces}
            activeSpaceId={activeSpaceId}
            onSelectSpace={setActiveSpaceId}
            onAddSpace={(newSpace) => {
              const createdSpace = {
                ...newSpace,
                id: `space-${Date.now()}`,
              };
              setSpaces((prev) => [...prev, createdSpace]);
              setActiveSpaceId(createdSpace.id);
            }}
            isProUser={isProUser}
            onOpenPricing={() => setIsPricingModalOpen(true)}
          />
        </>
      )}
    </div>
  );
}
