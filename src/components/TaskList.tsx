import React, { useState, useRef, useEffect } from 'react';
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
  Flame,
  Brain,
  CheckCheck,
  Plus,
  Search,
  SlidersHorizontal,
  MoreVertical,
  X,
} from 'lucide-react';
import { MascotCloud } from './MascotCloud';
import confetti from 'canvas-confetti';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onToggleStep: (taskId: string, stepId: string) => void;
  onStartFocus: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewTask: () => void;
  onOpenSmartPick: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onToggleStep,
  onStartFocus,
  onEditTask,
  onDeleteTask,
  onOpenNewTask,
  onOpenSmartPick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEnergy, setSelectedEnergy] = useState<string>('all');
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTaskMenu, setActiveTaskMenu] = useState<string | null>(null);

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleTaskComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleTask(taskId);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#A2C498', '#E5B496', '#D6B4E8', '#90B4CE'],
    });
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (selectedEnergy !== 'all' && t.energy !== selectedEnergy) return false;
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

  const getCategoryBadge = (cat: TaskCategory) => {
    switch (cat) {
      case 'study':
        return { label: 'เรียน', emoji: '📚', style: 'bg-[#EAE8F5] text-[#5C4D82] border-[#DDD5EF]' };
      case 'work':
        return { label: 'งาน', emoji: '💼', style: 'bg-[#E2ECE0] text-[#3B5433] border-[#CFDFCB]' };
      case 'project':
        return { label: 'โปรเจกต์', emoji: '🚀', style: 'bg-[#E8F2FA] text-[#385E82] border-[#CEE0F0]' };
      case 'personal':
        return { label: 'ส่วนตัว', emoji: '🧸', style: 'bg-[#FFF4E0] text-[#8A5C1E] border-[#F4E1BD]' };
      case 'life':
        return { label: 'ชีวิต', emoji: '🌿', style: 'bg-[#FDECE8] text-[#9A4A38] border-[#F6D7D0]' };
    }
  };

  const getEnergyBadge = (energy: EnergyLevel) => {
    switch (energy) {
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E2ECE0] text-[#3B5433] border border-[#CFDFCB]">
            <BatteryLow className="w-3 h-3 text-[#5F7554]" />
            <span>แรงน้อย</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF4E0] text-[#8A5C1E] border border-[#F4E1BD]">
            <BatteryMedium className="w-3 h-3 text-[#B07248]" />
            <span>แรงปานกลาง</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FDECE8] text-[#9A4A38] border border-[#F6D7D0]">
            <Zap className="w-3 h-3 text-[#BC5E48]" />
            <span>ไฟแรง</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Friendly Encouragement Banner / Mascot Hero */}
      <div className="bg-gradient-to-r from-[#FAF0E6] via-[#F4EBE2] to-[#EAE8F5] rounded-3xl p-5 sm:p-6 border border-[#EAE4D9] shadow-2xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="shrink-0">
              <MascotCloud
                mood="cheering"
                size="md"
                withPencil={true}
                withHeadphones={false}
                bubbleText="ก้าวเล็กๆ ก็ยอดเยี่ยมแล้วนะ!"
              />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-[#2C2C24]">
                เคลียร์สมอง ลดความกังวล ☁️
              </h2>
              <p className="text-xs sm:text-sm text-[#7A786C] mt-0.5 max-w-md leading-relaxed">
                ไม่ต้องทำทุกอย่างพร้อมกัน แค่เลือก 1 งานที่ตรงกับพลังงานของคุณตอนนี้ แล้วเริ่มทำแค่ 2 นาทีแรก
              </p>
            </div>
          </div>

          {/* Banner Actions */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenSmartPick}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#EAE8F5] hover:bg-[#DDD5EF] text-[#5C4D82] font-bold text-xs sm:text-sm border border-[#D5CBEA] shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Brain className="w-4 h-4 text-[#7C5CA5]" />
              <span>ให้ AI เลือกงาน 🎯</span>
            </button>
            <button
              onClick={onOpenNewTask}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#E2ECE0] hover:bg-[#D5E5D1] text-[#3B5433] font-bold text-xs sm:text-sm border border-[#CFDFCB] shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ระบายงาน</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unified Minimalist Filter & Search Bar */}
      <div className="bg-[#FAF8F5] p-3.5 sm:p-4 rounded-3xl border border-[#EAE4D9] shadow-2xs space-y-3">
        {/* Category Pills & Search */}
        <div className="flex flex-col md:flex-row gap-2.5 items-center justify-between">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-0.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#EAE8F5] text-[#5C4D82] font-bold border border-[#DDD5EF] shadow-2xs'
                  : 'bg-[#F0EBE1] text-[#7A786C] hover:bg-[#E5DFD3]'
              }`}
            >
              ทั้งหมด ({tasks.length})
            </button>
            {[
              { id: 'study', label: 'เรียน 📚' },
              { id: 'work', label: 'งาน 💼' },
              { id: 'project', label: 'โปรเจกต์ 🚀' },
              { id: 'personal', label: 'ส่วนตัว 🧸' },
              { id: 'life', label: 'ชีวิต 🌿' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#EAE8F5] text-[#5C4D82] font-bold border border-[#DDD5EF] shadow-2xs'
                    : 'bg-[#F0EBE1] text-[#7A786C] hover:bg-[#E5DFD3]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-56 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A7A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหางาน..."
              className="w-full pl-8.5 pr-3 py-1.5 rounded-xl bg-white border border-[#E2DACB] text-xs text-[#2C2C24] placeholder:text-[#8A8A7A] outline-none focus:border-[#7C5CA5]"
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
        </div>

        {/* Compact Energy Filter Row */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-[#EAE4D9] text-xs text-[#7A786C] overflow-x-auto no-scrollbar">
          <span className="font-semibold text-[#2C2C24] shrink-0">ระดับพลังงาน:</span>
          <button
            onClick={() => setSelectedEnergy('all')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
              selectedEnergy === 'all' ? 'bg-[#2C2C24] text-white font-bold' : 'hover:bg-[#F0EBE1]'
            }`}
          >
            ทุกระดับ
          </button>
          <button
            onClick={() => setSelectedEnergy('low')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
              selectedEnergy === 'low'
                ? 'bg-[#E2ECE0] text-[#3B5433] font-bold border border-[#CFDFCB]'
                : 'hover:bg-[#F0EBE1]'
            }`}
          >
            🪫 แรงน้อย (Low)
          </button>
          <button
            onClick={() => setSelectedEnergy('medium')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
              selectedEnergy === 'medium'
                ? 'bg-[#FFF4E0] text-[#8A5C1E] font-bold border border-[#F4E1BD]'
                : 'hover:bg-[#F0EBE1]'
            }`}
          >
            🔋 ปานกลาง (Mid)
          </button>
          <button
            onClick={() => setSelectedEnergy('high')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
              selectedEnergy === 'high'
                ? 'bg-[#FDECE8] text-[#9A4A38] font-bold border border-[#F6D7D0]'
                : 'hover:bg-[#F0EBE1]'
            }`}
          >
            ⚡ ไฟแรง (High)
          </button>
        </div>
      </div>

      {/* Task List Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-heading font-bold text-[#2C2C24] text-sm sm:text-base flex items-center gap-2">
            <span>สิ่งที่ต้องทำตอนนี้ ({pendingTasks.length})</span>
          </h3>
          <span className="text-[11px] text-[#7A786C]">
            ค่อยๆ ทำทีละอย่างนะ 🌸
          </span>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="bg-[#FAF8F5] rounded-3xl p-8 text-center border border-[#EAE4D9] shadow-2xs space-y-3">
            <MascotCloud size="md" mood="sleeping" bubbleText="สมองโล่งแล้ว! ไม่มีงานค้างเลย" />
            <h4 className="text-base font-bold text-[#2C2C24] mt-2">ไม่มีงานที่ค้างอยู่</h4>
            <p className="text-xs text-[#7A786C] max-w-sm mx-auto">
              สุดยอดมาก! เคลียร์งานหมดแล้ว หรือจะเพิ่มงานใหม่เพื่อระบายความคิดก็ได้นะ
            </p>
            <button
              onClick={onOpenNewTask}
              className="px-4 py-2 rounded-2xl bg-[#E2ECE0] hover:bg-[#D5E5D1] text-[#3B5433] font-bold text-xs shadow-2xs transition cursor-pointer border border-[#CFDFCB]"
            >
              + ระบายงานใหม่
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => {
              const catInfo = getCategoryBadge(task.category);
              const completedSteps = task.microSteps.filter((s) => s.completed).length;
              const totalSteps = task.microSteps.length;
              const isExpanded = expandedTasks[task.id] ?? false;
              const isMenuOpen = activeTaskMenu === task.id;

              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 shadow-2xs hover:shadow-xs relative ${
                    task.isOverthinkingProne
                      ? 'border-[#DDD5EF] ring-1 ring-[#DDD5EF]'
                      : 'border-[#EAE4D9]'
                  }`}
                >
                  <div className="p-4 sm:p-5">
                    {/* Top Row: Category, Energy, Time, and Actions */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Category Tag */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${catInfo.style}`}>
                          <span>{catInfo.emoji}</span>
                          <span>{catInfo.label}</span>
                        </span>

                        {/* Energy Tag */}
                        {getEnergyBadge(task.energy)}

                        {/* Estimated Time */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F0EBE1] text-[#7A786C]">
                          <Clock className="w-3 h-3 text-[#8A8A7A]" />
                          <span>{task.estimatedMinutes} น.</span>
                        </span>

                        {/* Overthinking Alert */}
                        {task.isOverthinkingProne && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAE8F5] text-[#5C4D82] border border-[#DDD5EF]">
                            <Brain className="w-3 h-3 text-[#7C5CA5]" />
                            <span>คิดเยอะ</span>
                          </span>
                        )}
                      </div>

                      {/* Right Menu (Edit / Delete streamlined) */}
                      <div className="relative">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1.5 rounded-xl text-[#8A8A7A] hover:text-[#2C2C24] hover:bg-[#F0EBE1] transition cursor-pointer"
                            title="แก้ไขงาน"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1.5 rounded-xl text-[#8A8A7A] hover:text-[#9A4A38] hover:bg-[#FDECE8] transition cursor-pointer"
                            title="ลบงาน"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Main Content Row: Checkbox, Title, Description */}
                    <div className="flex items-start gap-3 mt-1">
                      <button
                        onClick={(e) => handleTaskComplete(task.id, e)}
                        className="mt-0.5 text-[#8A8A7A] hover:text-[#5F7554] transition cursor-pointer shrink-0"
                        title="ทำเครื่องหมายว่าเสร็จสิ้น (+50 XP)"
                      >
                        <Circle className="w-5 h-5 hover:fill-[#E2ECE0]" />
                      </button>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-[#2C2C24] leading-snug">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-[#7A786C] mt-1 leading-relaxed line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Micro-Steps Preview Bar */}
                    {totalSteps > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#EAE4D9] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-[#F0EBE1] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#7C5CA5] h-full rounded-full transition-all duration-300"
                              style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-[#5C4D82]">
                            ก้าวย่อย {completedSteps}/{totalSteps}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleExpand(task.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-[#7C5CA5] hover:text-[#5C4D82] transition cursor-pointer"
                        >
                          <span>{isExpanded ? 'ซ่อนก้าวย่อย' : 'ดูก้าวย่อย (2 นาที)'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    )}

                    {/* Expanded Micro-steps checklist */}
                    {isExpanded && totalSteps > 0 && (
                      <div className="mt-2.5 p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D9] space-y-1.5">
                        <div className="text-[10px] font-bold text-[#7A786C] uppercase tracking-wider mb-1">
                          ก้าวเล็กๆ ช่วยให้เริ่มได้ทันที:
                        </div>
                        {task.microSteps.map((step, idx) => (
                          <div
                            key={step.id}
                            onClick={() => onToggleStep(task.id, step.id)}
                            className="flex items-center gap-2 text-xs text-[#2C2C24] hover:bg-white p-1.5 rounded-xl transition cursor-pointer"
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-[#3B5433] shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-[#8A8A7A] shrink-0" />
                            )}
                            <span className={`flex-1 ${step.completed ? 'line-through text-[#8A8A7A]' : 'font-medium'}`}>
                              {idx + 1}. {step.title}
                            </span>
                            {step.estimatedMinutes && (
                              <span className="text-[10px] text-[#8A8A7A] font-mono">
                                ~{step.estimatedMinutes} น.
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Card Footer: Single Clean Focus Button */}
                    <div className="mt-3 pt-2.5 border-t border-[#EAE4D9] flex items-center justify-end">
                      <button
                        onClick={() => onStartFocus(task)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-[#EAE8F5] hover:bg-[#DDD5EF] text-[#5C4D82] font-bold text-xs border border-[#DDD5EF] shadow-2xs transition active:scale-95 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-[#5C4D82]" />
                        <span>เริ่มโหมด Focus ✨</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <div className="pt-5">
            <h4 className="font-heading font-bold text-[#7A786C] text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCheck className="w-3.5 h-3.5 text-[#3B5433]" />
              <span>งานที่ทำสำเร็จแล้ว ({completedTasks.length})</span>
            </h4>
            <div className="space-y-1.5 opacity-80 hover:opacity-100 transition">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#FAF8F5] rounded-2xl p-3 border border-[#EAE4D9] flex items-center justify-between text-xs text-[#7A786C]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="text-[#3B5433] hover:text-[#8A8A7A] transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 fill-[#E2ECE0]" />
                    </button>
                    <span className="line-through truncate font-medium">{task.title}</span>
                  </div>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-[#8A8A7A] hover:text-[#9A4A38] p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

