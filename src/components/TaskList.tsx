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
  streakDays = 5,
  minutesFocusedTotal = 120,
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
          <span className="text-[11px] font-semibold text-[#8C8A7D] uppercase tracking-wider block">
            วันเสาร์ที่ 4 ตุลาคม
          </span>
          <h1 className="text-xl font-bold font-heading text-[#2C2C24] leading-tight">
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
        let skyGradient = 'from-[#F5F2EB] to-[#ECE7DE]';
        let skyBorder = 'border-[#E4DCD0]';
        let skyTitle = 'บรรยากาศ: ปลอดโปร่ง สงบนิ่ง';
        let skyDesc = 'ก้าวทีละ 1 เรื่องเล็กๆ ไม่ต้องรีบ สมองจะค่อยๆ ผ่อนคลาย';
        let pose: 'idle' | 'focus' | 'celebrate' = 'idle';

        if (completedCount === 1) {
          skyGradient = 'from-[#EDF4F7] to-[#E3ECF2]';
          skyBorder = 'border-[#D2DFE8]';
          skyTitle = 'บรรยากาศ: ท้องฟ้าเริ่มเปิดกว้าง';
          skyDesc = 'สำเร็จไป 1 งานแล้ว สมองโล่งขึ้นอย่างชัดเจน';
          pose = 'focus';
        } else if (completedCount >= 2) {
          skyGradient = 'from-[#F3F7EE] to-[#E5EFE0]';
          skyBorder = 'border-[#CDE0C5]';
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
                <div className="w-13 h-13 bg-white/80 backdrop-blur-xs rounded-2xl border border-white/90 shadow-2xs flex items-center justify-center p-1 shrink-0">
                  <PixelCloud8Bit pose={pose} size="sm" accessory={petAccessory} interactive={false} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#2C2C24] leading-snug">{skyTitle}</h3>
                  <p className="text-xs text-[#6E6D62] mt-1 leading-relaxed">{skyDesc}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-white/90 border border-[#E2DACB] text-[#55634E] shadow-2xs">
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
                ? 'bg-[#2C2C24] text-white border-[#2C2C24]'
                : 'bg-white border-[#E8E2D5] text-[#7A786C] hover:bg-[#FAF8F5]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 5. Status Filter Bar (Pending / All / Overthink) + Search */}
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
            placeholder="ค้นหาชื่องาน, แท็ก, หรือสถานที่..."
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

      {/* 6. Task List & Micro-steps */}
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
                    task.flagged
                      ? 'border-[#D49E35]/60 bg-gradient-to-r from-white via-white to-[#FFFDF7]'
                      : task.isOverthinkingProne
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
                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-1.5">
                        {task.flagged && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#FFF4E0] text-[#9E6E15] border border-[#F4E1BD]">
                            ปักธง
                          </span>
                        )}
                        <span className="font-semibold px-2 py-0.2 rounded-full bg-[#FAF8F5] border border-[#E8E2D5] text-[#4A4940] text-[10px]">
                          {catInfo.label}
                        </span>
                        {getSizeBadge(task.size)}
                        {task.urgency === 'high' && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#FDECE8] text-[#C23A25] border border-[#F6D7D0]">
                            งานด่วน
                          </span>
                        )}
                        <span className="font-mono text-[#7A786C] text-[10px]">{task.estimatedMinutes} นาที</span>
                        {task.isOverthinkingProne && (
                          <span className="text-[#9E745E] font-medium text-[10px] bg-[#FAF3EE] px-1.5 py-0.2 rounded-full border border-[#EADBD0]">
                            🧠 คิดวน
                          </span>
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

                      {/* Metadata: Dates, Location, Tags */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-[#7A786C]">
                        {task.deadline && (
                          <span className="inline-flex items-center gap-1 text-[#8C4A1E] font-medium bg-[#FFF5EE] px-2 py-0.5 rounded-lg border border-[#F6DEC9]">
                            <CalendarIcon className="w-3 h-3 text-[#B85824]" />
                            <span>เดดไลน์: {task.deadline}</span>
                            {task.time && <span>({task.time})</span>}
                          </span>
                        )}
                        {task.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#6C7764]" />
                            <span>{task.location}</span>
                          </span>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {task.tags.map((t) => (
                              <span key={t} className="px-1.5 py-0.2 rounded-md bg-[#FAF8F5] border border-[#E8E2D5] text-[#6C7764] font-medium">
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
                        className="w-12 h-12 rounded-xl object-cover border border-[#E8E2D5] shrink-0"
                      />
                    )}

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
      <div className="sticky bottom-4 flex justify-end pointer-events-none z-20">
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
