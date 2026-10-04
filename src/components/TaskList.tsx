import React, { useState } from 'react';
import { Task, TaskCategory, EnergyLevel } from '../types';
import {
  CheckCircle2,
  Circle,
  Play,
  Clock,
  Zap,
  BatteryMedium,
  BatteryLow,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Sparkles,
  Plus,
  Search,
  X,
  Brain,
  Check,
  BookOpen,
  Wind,
  Flame,
  Folder,
  ArrowRight,
  Sun,
  Flag,
  Calendar as CalendarIcon,
  Smile,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { PixelCloud8Bit } from './PixelCloud8Bit';
import confetti from 'canvas-confetti';

interface TaskListProps {
  tasks: Task[];
  userName?: string;
  streakDays?: number;
  minutesFocusedTotal?: number;
  onToggleTask: (taskId: string) => void;
  onToggleStep: (taskId: string, stepId: string) => void;
  onStartFocus: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewTask: () => void;
  onOpenSmartPick: () => void;
  onOpenPanic?: () => void;
  onOpenJournal?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  userName = 'Jay',
  streakDays = 5,
  minutesFocusedTotal = 120,
  onToggleTask,
  onToggleStep,
  onStartFocus,
  onEditTask,
  onDeleteTask,
  onOpenNewTask,
  onOpenSmartPick,
  onOpenPanic,
  onOpenJournal,
}) => {
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'today' | 'overthink'>('today');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentVibeEnergy, setCurrentVibeEnergy] = useState<EnergyLevel>('medium');
  const [selectedDate, setSelectedDate] = useState<number>(4);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Week days (Inspired by Save this & Instagram references)
  const weekDays = [
    { day: 'จ.', date: 29, isToday: false },
    { day: 'อ.', date: 30, isToday: false },
    { day: 'พ.', date: 1, isToday: false },
    { day: 'พฤ.', date: 2, isToday: false },
    { day: 'ศ.', date: 3, isToday: false },
    { day: 'ส.', date: 4, isToday: true },
    { day: 'อา.', date: 5, isToday: false },
  ];

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleTaskComplete = (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onToggleTask(taskId);
    confetti({
      particleCount: 45,
      spread: 65,
      origin: { y: 0.7 },
      colors: ['#6C7764', '#9E745E', '#D49E35'],
    });
  };

  // Filter tasks based on search, category, and active tab
  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (activeFilterTab === 'overthink' && !t.isOverthinkingProne) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  // Top focus task (Hero Spotlight Card - Task Management reference)
  const topFocusTask = pendingTasks.find((t) => t.urgency === 'high') || pendingTasks[0];

  const getCategoryBadge = (cat: TaskCategory) => {
    switch (cat) {
      case 'study':
        return { label: 'เรียน & วิจัย', emoji: '📚', style: 'bg-[#EBF0E8] text-[#3B5433] border-[#CFDFCB]' };
      case 'work':
        return { label: 'การทำงาน', emoji: '💼', style: 'bg-[#FAF0E6] text-[#8A5C1E] border-[#E8DEC9]' };
      case 'project':
        return { label: 'โปรเจกต์', emoji: '🚀', style: 'bg-[#E8F0F8] text-[#2F5275] border-[#CADDEC]' };
      case 'personal':
        return { label: 'ส่วนตัว', emoji: '🧸', style: 'bg-[#F4EFE6] text-[#6E6D62] border-[#E2DACB]' };
      case 'life':
        return { label: 'ชีวิต & สุขภาพ', emoji: '🌿', style: 'bg-[#EFE9DE] text-[#55634E] border-[#DED7C8]' };
    }
  };

  const getEnergyBadge = (energy: EnergyLevel) => {
    switch (energy) {
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF0E8] text-[#3B5433] border border-[#CFDFCB]">
            <BatteryLow className="w-3 h-3 text-[#5F7554]" />
            <span>แรงน้อย</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF9E6] text-[#8A5C1E] border border-[#F4E1BD]">
            <BatteryMedium className="w-3 h-3 text-[#B07248]" />
            <span>ปานกลาง</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDECE8] text-[#9A4A38] border border-[#F6D7D0]">
            <Zap className="w-3 h-3 text-[#BC5E48]" />
            <span>ไฟแรง</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-24 select-none">
      {/* 1. Serene Date & Personal Greeting */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-semibold text-[#8C8A7D] uppercase tracking-wider block">
            วันเสาร์ที่ 4 ตุลาคม
          </span>
          <h1 className="text-xl font-bold font-heading text-[#2C2C24] leading-tight">
            โฟกัสทีละอย่างนะ {userName} ☁️
          </h1>
        </div>

        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#6C7764] hover:bg-[#586350] active:scale-95 text-white text-xs font-bold transition shadow-2xs cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>เพิ่มงาน</span>
        </button>
      </div>

      {/* 2. Hero Single Focus Task (The One Thing to Do Now) */}
      {topFocusTask && (
        <div className="bg-[#6C7764] text-white rounded-3xl p-4.5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold backdrop-blur-xs">
              🎯 งานสำคัญตอนนี้
            </span>
            <div className="flex items-center gap-1 text-white/90 text-xs font-mono">
              <Clock className="w-3 h-3" />
              <span>~{topFocusTask.estimatedMinutes} นาที</span>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-white leading-tight">
              {topFocusTask.title}
            </h2>
            {topFocusTask.description && (
              <p className="text-xs text-white/80 mt-1 line-clamp-2">
                {topFocusTask.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => onStartFocus(topFocusTask)}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-white text-[#2C2C24] hover:bg-[#FAF8F5] active:scale-98 font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>เริ่มทำเลย (Focus)</span>
            </button>
            <button
              type="button"
              onClick={(e) => handleTaskComplete(topFocusTask.id, e)}
              className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition active:scale-95 cursor-pointer"
              title="ทำเสร็จแล้ว"
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Quiet Filter Bar */}
      <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-1 pt-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveFilterTab('today')}
            className={`pb-1 text-xs font-semibold transition border-b-2 cursor-pointer ${
              activeFilterTab === 'today'
                ? 'border-[#6C7764] text-[#2C2C24] font-bold'
                : 'border-transparent text-[#8C8A7D] hover:text-[#2C2C24]'
            }`}
          >
            ค้างอยู่ ({pendingTasks.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('all')}
            className={`pb-1 text-xs font-semibold transition border-b-2 cursor-pointer ${
              activeFilterTab === 'all'
                ? 'border-[#2C2C24] text-[#2C2C24] font-bold'
                : 'border-transparent text-[#8C8A7D] hover:text-[#2C2C24]'
            }`}
          >
            ทั้งหมด ({tasks.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('overthink')}
            className={`pb-1 text-xs font-semibold transition border-b-2 cursor-pointer ${
              activeFilterTab === 'overthink'
                ? 'border-[#9E745E] text-[#9E745E] font-bold'
                : 'border-transparent text-[#8C8A7D] hover:text-[#2C2C24]'
            }`}
          >
            🧠 คิดวน ({tasks.filter((t) => t.isOverthinkingProne && !t.completed).length})
          </button>
        </div>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="text-[#8C8A7D] hover:text-[#2C2C24] p-1 cursor-pointer"
          title="ค้นหางาน"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Collapsible Search Input */}
      {showSearch && (
        <div className="relative animate-in fade-in duration-150">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A887A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่องาน..."
            autoFocus
            className="w-full pl-8.5 pr-8 py-1.5 rounded-xl bg-white border border-[#E8E2D5] text-xs text-[#2C2C24] placeholder:text-[#8A8A7A] outline-none focus:border-[#6C7764]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8A7A] hover:text-[#2C2C24]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* 4. Task List & Micro-steps */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2C2C24]">
            งานทั้งหมดในรายการ ({pendingTasks.length})
          </span>
          <span className="text-[11px] text-[#7A786C]">
            ก้าวเล็กๆ ก็ยอดเยี่ยมแล้ว 🌸
          </span>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="bg-[#FAF8F5] rounded-3xl p-6 text-center border border-[#E8E2D5] shadow-2xs space-y-2.5">
            <PixelCloud8Bit pose="celebrate" size="sm" interactive={false} />
            <h4 className="text-sm font-bold font-heading text-[#2C2C24]">ไม่มีงานค้างอยู่ในรายการ</h4>
            <p className="text-xs text-[#7A786C] max-w-xs mx-auto">
              คุณเคลียร์งานเรียบร้อย หรือกดปุ่ม + เพื่อระบายความคิดใหม่
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingTasks.map((task) => {
              const catInfo = getCategoryBadge(task.category);
              const completedSteps = task.microSteps.filter((s) => s.completed).length;
              const totalSteps = task.microSteps.length;
              const isExpanded = expandedTasks[task.id] ?? false;

              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl border transition-all shadow-2xs hover:shadow-xs p-3.5 space-y-2.5 ${
                    task.isOverthinkingProne
                      ? 'border-[#828D7A]/50 bg-gradient-to-r from-white via-white to-[#F4F6F3]'
                      : 'border-[#E8E2D5]'
                  }`}
                >
                  {/* Top Task Row */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => handleTaskComplete(task.id, e)}
                      className="mt-0.5 w-6 h-6 rounded-full border-2 border-[#D5CDBD] hover:border-[#6C7764] active:scale-90 flex items-center justify-center transition-all cursor-pointer group shrink-0"
                      title="กดเมื่อทำงานเสร็จ"
                    >
                      <Circle className="w-3.5 h-3.5 text-transparent group-hover:text-[#6C7764]/30" />
                    </button>

                    <div className="flex-1 min-w-0" onClick={() => toggleExpand(task.id)}>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#7A786C] mb-1">
                        <span className="font-semibold text-[#4A4940]">{catInfo.emoji} {catInfo.label}</span>
                        <span>•</span>
                        <span className="font-mono">{task.estimatedMinutes} นาที</span>
                        {task.isOverthinkingProne && (
                          <>
                            <span>•</span>
                            <span className="text-[#9E745E] font-medium">คิดวน</span>
                          </>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-[#2C2C24] leading-snug cursor-pointer">
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-[#7A786C] line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onStartFocus(task)}
                      className="w-8 h-8 rounded-full bg-[#EBF0E8] hover:bg-[#6C7764] text-[#3B5433] hover:text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0 shadow-2xs"
                      title="เริ่มโหมดโฟกัส"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>

                  {/* Micro Steps Section */}
                  {task.microSteps && task.microSteps.length > 0 && (
                    <div className="pt-1 border-t border-[#F0EBE1]">
                      <button
                        onClick={() => toggleExpand(task.id)}
                        className="w-full flex items-center justify-between text-[11px] text-[#7A786C] hover:text-[#2C2C24] py-0.5 cursor-pointer"
                      >
                        <span className="font-semibold">
                          ก้าวเล็กๆ 2 นาที ({completedSteps}/{totalSteps})
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="space-y-1.5 mt-1.5 animate-in fade-in duration-150">
                          {task.microSteps.map((step) => (
                            <div
                              key={step.id}
                              onClick={() => onToggleStep(task.id, step.id)}
                              className={`flex items-center gap-2 p-2 rounded-xl text-xs transition cursor-pointer border ${
                                step.completed
                                  ? 'bg-[#FAF8F5] text-[#8A887A] line-through border-transparent'
                                  : 'bg-[#F9F7F2] text-[#2C2C24] border-[#E8E2D5] hover:bg-white'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                                  step.completed
                                    ? 'bg-[#6C7764] border-[#6C7764] text-white'
                                    : 'border-[#C5BCAB]'
                                }`}
                              >
                                {step.completed && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="flex-1 truncate">{step.title}</span>
                              <span className="text-[10px] text-[#8A887A] shrink-0">
                                {step.estimatedMinutes}น.
                              </span>
                            </div>
                          ))}

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => onEditTask(task)}
                              className="text-[11px] text-[#7A786C] hover:text-[#2C2C24] flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" /> แก้ไข
                            </button>
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="text-[11px] text-[#BC5E48] hover:text-[#9A4A38] flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" /> ลบ
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Tasks Accordion */}
      {completedTasks.length > 0 && (
        <div className="pt-1">
          <details className="group">
            <summary className="text-xs font-bold text-[#8A887A] flex items-center justify-between cursor-pointer select-none list-none py-1">
              <span>งานที่เสร็จแล้ว ({completedTasks.length})</span>
              <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="space-y-2 mt-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#FAF8F5] rounded-xl p-3 border border-[#E8E2D5] flex items-center justify-between gap-2 opacity-75 hover:opacity-100 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={(e) => handleTaskComplete(task.id, e)}
                      className="w-5 h-5 rounded-full bg-[#6C7764] text-white flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </button>
                    <span className="text-xs text-[#5C5B50] line-through truncate">
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-[#8A887A] hover:text-[#BC5E48] p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Mobile Floating Action Button (FAB) */}
      <button
        onClick={onOpenNewTask}
        className="absolute bottom-4 right-4 z-30 w-13 h-13 rounded-full bg-[#6C7764] hover:bg-[#586350] active:scale-90 text-white flex items-center justify-center shadow-lg shadow-[#6C7764]/30 border-2 border-white transition-all cursor-pointer"
        title="ระบายงานใหม่ (+)"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
