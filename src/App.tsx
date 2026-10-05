import React, { useState, useEffect } from 'react';
import { Task, UserStats, Badge, PetState } from './types';
import { INITIAL_TASKS, INITIAL_STATS, INITIAL_BADGES } from './data/mockData';
import { AppTab } from './components/Header';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { MobileStatusBar } from './components/MobileStatusBar';
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

  const [currentTab, setCurrentTab] = useState<AppTab>('tasks');
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSmartPickOpen, setIsSmartPickOpen] = useState<boolean>(false);
  const [isPanicModalOpen, setIsPanicModalOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);

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
    <MobileDeviceFrame
      isProUser={isProUser}
      onToggleProMode={() => setIsProUser((prev) => !prev)}
      onToggleAuth={() => {
        const next = !isAuthenticated;
        setIsAuthenticated(next);
        localStorage.setItem('freakout_authenticated', String(next));
      }}
      isAuthenticated={isAuthenticated}
    >
      {/* iOS Mobile Status Bar */}
      <MobileStatusBar />

      {/* Conditional Rendering: Auth/Onboarding vs Main App */}
      {!isAuthenticated ? (
        <AuthOnboardingView
          onLogin={(name) => {
            setUserName(name);
            setIsAuthenticated(true);
            localStorage.setItem('freakout_authenticated', 'true');
            localStorage.setItem('freakout_username', name);
          }}
        />
      ) : (
        <>
          <div className="flex-1 min-h-0 flex flex-col w-full relative overflow-hidden">
            {/* Mobile Top Bar */}
            <MobileAppHeader
              stats={stats}
              pet={pet}
              currentTab={currentTab}
              onTabChange={(tab) => setCurrentTab(tab)}
              onOpenPanic={() => setIsPanicModalOpen(true)}
              onOpenPricing={() => setIsPricingModalOpen(true)}
              onOpenDailyReward={() => setIsDailyRewardOpen(true)}
              isProUser={isProUser}
            />

            {/* Scrollable Screen Content */}
            <main className="flex-1 min-h-0 overflow-y-auto px-4 py-3 relative no-scrollbar">
              {/* Tab 1: Tasks (Clean, Intentional Home Dashboard) */}
              {currentTab === 'tasks' && (
                <TaskList
                  tasks={tasks}
                  userName={userName}
                  streakDays={stats.streakDays}
                  minutesFocusedTotal={stats.minutesFocusedTotal}
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

          <FocusModeModal
            isOpen={!!activeFocusTask}
            task={activeFocusTask}
            onClose={() => setActiveFocusTask(null)}
            onCompleteTask={handleCompleteFocusTask}
            onToggleStep={handleToggleStep}
            onOpenPanic={() => setIsPanicModalOpen(true)}
          />

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
        </>
      )}
    </MobileDeviceFrame>
  );
}
