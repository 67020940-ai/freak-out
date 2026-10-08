import React, { useState } from 'react';
import { Task, TaskCategory, EnergyLevel, TaskSize } from '../types';
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
  ChevronRight,
  MapPin,
  Tag
} from 'lucide-react';
import { PixelCloud8Bit } from './PixelCloud8Bit';
import { EnergyGaugeSlider } from './EnergyGaugeSlider';
import confetti from 'canvas-confetti';

interface TaskListProps {
  tasks: Task[];
  userName?: string;
  streakDays?: number;
  minutesFocusedTotal?: number;
  energy?: EnergyLevel;
  onEnergyChange?: (energy: EnergyLevel) => void;
  petAccessory?: string;
  celebrateKey?: number;
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
  streakDays = 0,
  minutesFocusedTotal = 0,
  energy = 'okay',
  onEnergyChange,
  petAccessory,
  celebrateKey = 0,
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
  const [currentVibeEnergy, setCurrentVibeEnergy] = useState<EnergyLevel>(energy);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Sync external energy prop
  React.useEffect(() => {
    setCurrentVibeEnergy(energy);
  }, [energy]);

  const handleSelectEnergy = (lvl: EnergyLevel) => {
    setCurrentVibeEnergy(lvl);
    onEnergyChange?.(lvl);
  };

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
    if (selectedCategory === 'flagged' && !t.flagged) return false;
    if (selectedCategory !== 'all' && selectedCategory !== 'flagged' && t.category !== selectedCategory) return false;
    if (activeFilterTab === 'overthink' && !t.isOverthinkingProne) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q))) ||
        (t.location && t.location.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  // Top focus task (Hero Spotlight Card)
  const topFocusTask = pendingTasks.find((t) => t.flagged || t.urgency === 'high') || pendingTasks[0];

  const getCategoryBadge = (cat: TaskCategory) => {
    switch (cat) {
      case 'education':
      case 'study':
        return { label: 'การเรียน', style: 'bg-[#EBF0E8] text-[#3B5433] border-[#CFDFCB]' };
      case 'work':
        return { label: 'งาน', style: 'bg-[#FAF0E6] text-[#8A5C1E] border-[#E8DEC9]' };
      case 'freelance':
      case 'project':
        return { label: 'ฟรีแลนซ์', style: 'bg-[#E8F0F8] text-[#2F5275] border-[#CADDEC]' };
      case 'personal':
      case 'life':
      default:
        return { label: 'ส่วนตัว', style: 'bg-[#F4EFE6] text-[#6E6D62] border-[#E2DACB]' };
    }
  };

  const getSizeBadge = (size?: TaskSize) => {
    switch (size) {
      case 'small':
        return (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] font-semibold bg-[#EBF0E8] text-[#3B5433] border border-[#CFDFCB]">
            งานเล็ก
          </span>
        );
      case 'large':
        return (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] font-semibold bg-[#FDECE8] text-[#9A4A38] border border-[#F6D7D0]">
            งานใหญ่
          </span>
        );
      case 'medium':
      default:
        return (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] font-semibold bg-[#FFF9E6] text-[#8A5C1E] border border-[#F4E1BD]">
            งานกลาง
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-24 select-none">
      {/* 1. Header & Greeting */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-semibold text-[#8C8A7D] dark:text-[#A09D90] uppercase tracking-wider block">
            วันเสาร์ที่ 4 ตุลาคม
          </span>
          <h1 className="text-xl font-bold font-heading text-[#2C2C24] dark:text-[#F0EEE6] leading-tight">
            โฟกัสทีละอย่างนะ {userName}
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

      {/* Atmospheric Mirror: Dynamic sky condition based on tasks completed today */}
      {(() => {
        const completedCount = completedTasks.length;
        let skyGradient = 'from-[#F5F2EB] to-[#ECE7DE] dark:from-[#242422] dark:to-[#1B1B19]';
        let skyBorder = 'border-[#E4DCD0] dark:border-[#383834]';
        let skyTitle = 'บรรยากาศ: ปลอดโปร่ง สงบนิ่ง';
        let skyDesc = 'ก้าวทีละ 1 เรื่องเล็กๆ ไม่ต้องรีบ สมองจะค่อยๆ ผ่อนคลาย';
        let pose: 'idle' | 'focus' | 'celebrate' = 'idle';

        if (completedCount === 1) {
          skyGradient = 'from-[#EDF4F7] to-[#E3ECF2] dark:from-[#1E272E] dark:to-[#172026]';
          skyBorder = 'border-[#D2DFE8] dark:border-[#2C3B47]';
          skyTitle = 'บรรยากาศ: ท้องฟ้าเริ่มเปิดกว้าง';
          skyDesc = 'สำเร็จไป 1 งานแล้ว สมองโล่งขึ้นอย่างชัดเจน';
          pose = 'focus';
        } else if (completedCount >= 2) {
          skyGradient = 'from-[#F3F7EE] to-[#E5EFE0] dark:from-[#1F291D] dark:to-[#172115]';
          skyBorder = 'border-[#CDE0C5] dark:border-[#2C3D29]';
          skyTitle = 'บรรยากาศ: สมาธิบริสุทธิ์ วันนี้ทำได้ยอดเยี่ยม';
          skyDesc = `เคลียร์สำเร็จไป ${completedCount} งานแล้ว พักผ่อนและชื่นชมตัวเองได้เต็มที่`;
          pose = 'celebrate';
        }

        return (
          <div
            key={celebrateKey}
            className={`relative rounded-3xl p-5 bg-gradient-to-br ${skyGradient} border ${skyBorder} shadow-2xs overflow-hidden transition-all duration-700 animate-in fade-in`}
          >
            <div className="flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 bg-white/80 dark:bg-[#2C2C28]/80 backdrop-blur-xs rounded-2xl border border-white/90 dark:border-white/10 shadow-2xs flex items-center justify-center p-1 shrink-0">
                  <PixelCloud8Bit pose={pose} size="sm" accessory={petAccessory} interactive={false} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#2C2C24] dark:text-[#EAE7DF] leading-snug">{skyTitle}</h3>
                  <p className="text-xs text-[#6E6D62] dark:text-[#A8A599] mt-1 leading-relaxed">{skyDesc}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-white/90 dark:bg-[#2A2A26] border border-[#E2DACB] dark:border-[#42423C] text-[#55634E] dark:text-[#9BB391] shadow-2xs">
                  {completedCount} สำเร็จ
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. Hero Single Focus Task (The One Thing to Do Now) */}
      {topFocusTask && (
        <div className="bg-[#6C7764] text-white rounded-3xl p-5 shadow-sm space-y-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold backdrop-blur-xs">
              งานสำคัญที่สุดตอนนี้ {topFocusTask.flagged && '★'}
            </span>
            <div className="flex items-center gap-1.5 text-white/90 text-xs font-mono">
              <Clock className="w-3.5 h-3.5" />
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

      {/* 4. Category Chips Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'ทั้งหมด' },
          { id: 'personal', label: 'ส่วนตัว' },
          { id: 'work', label: 'งาน' },
          { id: 'freelance', label: 'ฟรีแลนซ์' },
          { id: 'education', label: 'การเรียน' },
          { id: 'flagged', label: 'ปักธง' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-[#2C2C24] dark:bg-white text-white dark:text-[#181818] border-[#2C2C24] dark:border-white shadow-2xs'
                : 'bg-white dark:bg-[#222220] border-[#E8E2D5] dark:border-[#383834] text-[#7A786C] dark:text-[#A8A599] hover:bg-[#FAF8F5] dark:hover:bg-[#2C2C28]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 5. Status Filter Bar (Pending / All / Overthink) + Search */}
      <div className="flex items-center justify-between border-b border-[#EAE4D9] dark:border-[#333330] pb-1 pt-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveFilterTab('today')}
            className={`pb-1 text-xs font-semibold transition border-b-2 cursor-pointer ${
              activeFilterTab === 'today'
                ? 'border-[#6C7764] dark:border-[#9BB391] text-[#2C2C24] dark:text-white font-bold'
                : 'border-transparent text-[#8C8A7D] dark:text-[#888880] hover:text-[#2C2C24] dark:hover:text-white'
            }`}
          >
            ค้างอยู่ ({pendingTasks.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('all')}
            className={`pb-1 text-xs font-semibold transition border-b-2 cursor-pointer ${
              activeFilterTab === 'all'
                ? 'border-[#2C2C24] dark:border-white text-[#2C2C24] dark:text-white font-bold'
                : 'border-transparent text-[#8C8A7D] dark:text-[#888880] hover:text-[#2C2C24] dark:hover:text-white'
            }`}
          >
            ทั้งหมด ({tasks.length})
          </button>
          <button
            onClick={() => setActiveFilterTab('overthink')}
            className={`pb-1 text-xs font-semibold transition border-b-2 cursor-pointer flex items-center gap-1 ${
              activeFilterTab === 'overthink'
                ? 'border-[#9E745E] dark:border-[#D49E78] text-[#9E745E] dark:text-[#D49E78] font-bold'
                : 'border-transparent text-[#8C8A7D] dark:text-[#888880] hover:text-[#2C2C24] dark:hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>คิดวน ({tasks.filter((t) => t.isOverthinkingProne && !t.completed).length})</span>
          </button>
        </div>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="text-[#8C8A7D] dark:text-[#888880] hover:text-[#2C2C24] dark:hover:text-white p-1 cursor-pointer"
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
            placeholder="ค้นหาชื่องาน, แท็ก, หรือสถานที่..."
            autoFocus
            className="w-full pl-8.5 pr-8 py-1.5 rounded-xl bg-white dark:bg-[#222220] border border-[#E8E2D5] dark:border-[#383834] text-xs text-[#2C2C24] dark:text-white placeholder:text-[#8A8A7A] outline-none focus:border-[#6C7764]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8A7A] hover:text-[#2C2C24] dark:hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* 6. Task List & Micro-steps */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2C2C24] dark:text-[#E8E6E0]">
            งานทั้งหมดในรายการ ({pendingTasks.length})
          </span>
          <span className="text-[11px] text-[#7A786C] dark:text-[#A09D90]">
            ก้าวเล็กๆ ก็ยอดเยี่ยมแล้ว
          </span>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="bg-[#FAF8F5] dark:bg-[#1E1E1C] rounded-3xl p-6 text-center border border-[#E8E2D5] dark:border-[#333330] shadow-2xs space-y-2.5">
            <PixelCloud8Bit pose="celebrate" size="sm" interactive={false} />
            <h4 className="text-sm font-bold font-heading text-[#2C2C24] dark:text-[#F0EEE6]">ไม่มีงานค้างอยู่ในรายการ</h4>
            <p className="text-xs text-[#7A786C] dark:text-[#A8A599] max-w-xs mx-auto">
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
                  className={`rounded-2xl border transition-all shadow-2xs hover:shadow-xs p-3.5 space-y-2.5 ${
                    task.flagged
                      ? 'border-[#D49E35]/60 bg-gradient-to-r from-white via-white to-[#FFFDF7] dark:from-[#242420] dark:via-[#22221E] dark:to-[#2A261A] dark:border-[#D49E35]/40'
                      : task.isOverthinkingProne
                      ? 'border-[#828D7A]/50 bg-gradient-to-r from-white via-white to-[#F4F6F3] dark:from-[#202420] dark:via-[#1E221E] dark:to-[#222822] dark:border-[#828D7A]/40'
                      : 'bg-white dark:bg-[#1E1E1C] border-[#E8E2D5] dark:border-[#333330]'
                  }`}
                >
                  {/* Top Task Row */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => handleTaskComplete(task.id, e)}
                      className="mt-0.5 w-6 h-6 rounded-full border-2 border-[#D5CDBD] dark:border-[#55554E] hover:border-[#6C7764] dark:hover:border-[#9BB391] active:scale-90 flex items-center justify-center transition-all cursor-pointer group shrink-0"
                      title="กดเมื่อทำงานเสร็จ"
                    >
                      <Circle className="w-3.5 h-3.5 text-transparent group-hover:text-[#6C7764]/30" />
                    </button>

                    <div className="flex-1 min-w-0" onClick={() => toggleExpand(task.id)}>
                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-1.5">
                        {task.flagged && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#FFF4E0] dark:bg-[#342814] text-[#9E6E15] dark:text-[#E2A64E] border border-[#F4E1BD] dark:border-[#523F1E]">
                            ปักธง
                          </span>
                        )}
                        <span className="font-semibold px-2 py-0.2 rounded-full bg-[#FAF8F5] dark:bg-[#282824] border border-[#E8E2D5] dark:border-[#3A3A34] text-[#4A4940] dark:text-[#D5D3CB] text-[10px]">
                          {catInfo.label}
                        </span>
                        {getSizeBadge(task.size)}
                        {task.urgency === 'high' && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#FDECE8] dark:bg-[#381C16] text-[#C23A25] dark:text-[#F28472] border border-[#F6D7D0] dark:border-[#542820]">
                            งานด่วน
                          </span>
                        )}
                        <span className="font-mono text-[#7A786C] dark:text-[#A8A599] text-[10px]">{task.estimatedMinutes} นาที</span>
                        {task.isOverthinkingProne && (
                          <span className="text-[#9E745E] dark:text-[#D8A78D] font-medium text-[10px] bg-[#FAF3EE] dark:bg-[#2E241E] px-1.5 py-0.2 rounded-full border border-[#EADBD0] dark:border-[#4E392E] inline-flex items-center gap-1">
                            <Brain className="w-2.5 h-2.5" />
                            <span>คิดวน</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-[#2C2C24] dark:text-[#F0EEE6] leading-snug cursor-pointer">
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-[#7A786C] dark:text-[#A8A599] line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}

                      {/* Metadata: Dates, Location, Tags */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-[#7A786C] dark:text-[#A8A599]">
                        {task.deadline && (
                          <span className="inline-flex items-center gap-1 text-[#8C4A1E] dark:text-[#E29260] font-medium bg-[#FFF5EE] dark:bg-[#302018] px-2 py-0.5 rounded-lg border border-[#F6DEC9] dark:border-[#503022]">
                            <CalendarIcon className="w-3 h-3 text-[#B85824] dark:text-[#E29260]" />
                            <span>เดดไลน์: {task.deadline}</span>
                            {task.time && <span>({task.time})</span>}
                          </span>
                        )}
                        {task.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#6C7764] dark:text-[#88B580]" />
                            <span>{task.location}</span>
                          </span>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {task.tags.map((t) => (
                              <span key={t} className="px-1.5 py-0.2 rounded-md bg-[#FAF8F5] dark:bg-[#282824] border border-[#E8E2D5] dark:border-[#383834] text-[#6C7764] dark:text-[#88B580] font-medium">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Thumbnail if image is attached */}
                    {task.imageUrl && (
                      <img
                        src={task.imageUrl}
                        alt="attachment"
                        className="w-12 h-12 rounded-xl object-cover border border-[#E8E2D5] dark:border-[#383834] shrink-0"
                      />
                    )}

                    <button
                      onClick={() => onStartFocus(task)}
                      className="w-8 h-8 rounded-full bg-[#EBF0E8] dark:bg-[#223320] hover:bg-[#6C7764] dark:hover:bg-[#436338] text-[#3B5433] dark:text-[#A0D494] hover:text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0 shadow-2xs"
                      title="เริ่มโหมดโฟกัส"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>

                  {/* Micro Steps Section */}
                  {task.microSteps && task.microSteps.length > 0 && (
                    <div className="pt-1 border-t border-[#F0EBE1] dark:border-[#2C2C28]">
                      <button
                        onClick={() => toggleExpand(task.id)}
                        className="w-full flex items-center justify-between text-[11px] text-[#7A786C] dark:text-[#A8A599] hover:text-[#2C2C24] dark:hover:text-white py-0.5 cursor-pointer"
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
                                  ? 'bg-[#FAF8F5] dark:bg-[#222220] text-[#8A887A] dark:text-[#666660] line-through border-transparent'
                                  : 'bg-[#F9F7F2] dark:bg-[#262624] text-[#2C2C24] dark:text-[#E8E6E0] border-[#E8E2D5] dark:border-[#383834] hover:bg-white dark:hover:bg-[#2D2D2A]'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                                  step.completed
                                    ? 'bg-[#6C7764] border-[#6C7764] text-white'
                                    : 'border-[#C5BCAB] dark:border-[#55554E]'
                                }`}
                              >
                                {step.completed && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="flex-1 truncate">{step.title}</span>
                              <span className="text-[10px] text-[#8A887A] dark:text-[#777770] shrink-0">
                                {step.estimatedMinutes}น.
                              </span>
                            </div>
                          ))}

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => onEditTask(task)}
                              className="text-[11px] text-[#7A786C] dark:text-[#A8A599] hover:text-[#2C2C24] dark:hover:text-white flex items-center gap-1 cursor-pointer"
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
            <summary className="text-xs font-bold text-[#8A887A] dark:text-[#A09D90] flex items-center justify-between cursor-pointer select-none list-none py-1">
              <span>งานที่เสร็จแล้ว ({completedTasks.length})</span>
              <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="space-y-2 mt-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#FAF8F5] dark:bg-[#1E1E1C] rounded-xl p-3 border border-[#E8E2D5] dark:border-[#333330] flex items-center justify-between gap-2 opacity-75 hover:opacity-100 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={(e) => handleTaskComplete(task.id, e)}
                      className="w-5 h-5 rounded-full bg-[#6C7764] text-white flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </button>
                    <span className="text-xs text-[#5C5B50] dark:text-[#8E8D86] line-through truncate">
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-[#8A887A] dark:text-[#666660] hover:text-[#BC5E48] p-1 cursor-pointer"
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
      <div className="sm:hidden sticky bottom-4 flex justify-end pointer-events-none z-20">
        <button
          onClick={onOpenNewTask}
          className="pointer-events-auto w-13 h-13 rounded-full bg-[#6C7764] hover:bg-[#586350] active:scale-90 text-white flex items-center justify-center shadow-lg shadow-[#6C7764]/30 border-2 border-white transition-all cursor-pointer mr-1"
          title="สร้างงานใหม่ (+)"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
