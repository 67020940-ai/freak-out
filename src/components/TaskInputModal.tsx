import React, { useState } from 'react';
import { Task, UrgencyLevel, TaskCategory, TaskSize, MicroStep } from '../types';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Clock,
  AlertCircle,
  Calendar,
  Flag,
  MapPin,
  Image as ImageIcon,
  Check,
  Tag,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generateMicroSteps, decomposeTaskWithAI } from '../utils/aiHelper';
import { CustomDatePicker } from './CustomDatePicker';

interface TaskInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'> & { id?: string }) => void;
  initialTask?: Task | null;
}

const SUGGESTED_TEMPLATES = [
  {
    title: 'อ่านหนังสือสอบ Midterm',
    category: 'education' as TaskCategory,
    size: 'medium' as TaskSize,
    tags: ['#exam', '#midterm'],
    estimatedMinutes: 30,
  },
  {
    title: 'ทำสรุปรายงานและส่งอัปเดต',
    category: 'work' as TaskCategory,
    size: 'medium' as TaskSize,
    tags: ['#report', '#urgent'],
    estimatedMinutes: 25,
  },
  {
    title: 'ตอบบรีฟและส่งดราฟต์ให้ลูกค้า',
    category: 'freelance' as TaskCategory,
    size: 'small' as TaskSize,
    tags: ['#client', '#draft'],
    estimatedMinutes: 15,
  },
  {
    title: 'ออกกำลังกายยืดเหยียด',
    category: 'personal' as TaskCategory,
    size: 'small' as TaskSize,
    tags: ['#health', '#workout'],
    estimatedMinutes: 20,
  },
  {
    title: 'จัดระเบียบโต๊ะทำงานและตรวจเช็คอีเมล',
    category: 'personal' as TaskCategory,
    size: 'small' as TaskSize,
    tags: ['#tidy', '#routine'],
    estimatedMinutes: 15,
  },
];

export const TaskInputModal: React.FC<TaskInputModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  initialTask,
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [category, setCategory] = useState<TaskCategory>(
    (initialTask?.category as TaskCategory) || 'education'
  );
  const [size, setSize] = useState<TaskSize>(initialTask?.size || 'medium');
  const [isUrgent, setIsUrgent] = useState<boolean>(initialTask?.urgency === 'high');
  const [flagged, setFlagged] = useState<boolean>(initialTask?.flagged ?? false);
  const [tags, setTags] = useState<string[]>(initialTask?.tags || []);
  const [newTagInput, setNewTagInput] = useState<string>('');
  
  const [startDate, setStartDate] = useState<string>(
    initialTask?.startDate || new Date().toISOString().split('T')[0]
  );
  const [deadline, setDeadline] = useState<string>(
    initialTask?.deadline || ''
  );
  const [time, setTime] = useState<string>(initialTask?.time || '');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(
    initialTask?.estimatedMinutes || 25
  );

  const [location, setLocation] = useState<string>(initialTask?.location || '');
  const [imageUrl, setImageUrl] = useState<string>(initialTask?.imageUrl || '');
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(
    Boolean(initialTask?.location || initialTask?.imageUrl || initialTask?.time)
  );

  const [isOverthinkingProne, setIsOverthinkingProne] = useState<boolean>(
    initialTask?.isOverthinkingProne ?? true
  );
  const [microSteps, setMicroSteps] = useState<MicroStep[]>(
    initialTask?.microSteps || []
  );
  const [isDecomposing, setIsDecomposing] = useState(false);

  if (!isOpen) return null;

  const handleApplyTemplate = (tmpl: typeof SUGGESTED_TEMPLATES[0]) => {
    setTitle(tmpl.title);
    setCategory(tmpl.category);
    setSize(tmpl.size);
    setTags(tmpl.tags);
    setEstimatedMinutes(tmpl.estimatedMinutes);
    const steps = generateMicroSteps(tmpl.title, tmpl.category);
    setMicroSteps(steps);
  };

  const handleAddTag = () => {
    const clean = newTagInput.trim();
    if (!clean) return;
    const formattedTag = clean.startsWith('#') ? clean : `#${clean}`;
    if (!tags.includes(formattedTag)) {
      setTags([...tags, formattedTag]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAutoDecompose = async () => {
    if (!title.trim() || isDecomposing) return;
    setIsDecomposing(true);
    try {
      const { steps } = await decomposeTaskWithAI(title, category);
      setMicroSteps(steps);
    } finally {
      setIsDecomposing(false);
    }
  };

  const handleAddStep = () => {
    setMicroSteps([
      ...microSteps,
      {
        id: `step-${Date.now()}`,
        title: '',
        completed: false,
        estimatedMinutes: 5,
      },
    ]);
  };

  const handleUpdateStepTitle = (id: string, newTitle: string) => {
    setMicroSteps(microSteps.map((s) => (s.id === id ? { ...s, title: newTitle } : s)));
  };

  const handleDeleteStep = (id: string) => {
    setMicroSteps(microSteps.filter((s) => s.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: initialTask?.id,
      title: title.trim(),
      description: description.trim(),
      category,
      size,
      urgency: isUrgent ? 'high' : 'medium',
      importance: flagged ? 'high' : 'medium',
      flagged,
      tags,
      startDate: startDate || undefined,
      deadline: deadline || undefined,
      time: time || undefined,
      location: location.trim() || undefined,
      imageUrl: imageUrl || undefined,
      estimatedMinutes: Number(estimatedMinutes) || 25,
      isOverthinkingProne,
      microSteps: microSteps.filter((s) => s.title.trim() !== ''),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-t-[36px] w-full max-h-[94%] overflow-y-auto shadow-2xl border-t border-[#E8E2D5] p-5 relative animate-in slide-in-from-bottom duration-300 no-scrollbar">
        {/* iOS Pull Handle */}
        <div className="w-10 h-1 bg-[#2C2C24]/20 rounded-full mx-auto mb-3 shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-full text-[#8A8A7A] hover:text-[#2C2C24] hover:bg-[#EFE9DE] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Header */}
        <div className="mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EFE9DE] text-[#55634E] text-[11px] font-bold mb-1.5 border border-[#E2DACB]">
            <Sparkles className="w-3 h-3 text-[#828D7A]" />
            <span>Smart Task Creation</span>
          </div>
          <h2 className="text-lg font-bold font-heading text-[#2C2C24]">
            {initialTask ? 'แก้ไขงาน' : 'สร้างงานใหม่ (New Task)'}
          </h2>
        </div>

        {/* Suggested List Chips (Quick Templates) */}
        {!initialTask && (
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A887A] block mb-1.5">
              Suggested List (แตะเพื่อใส่เทมเพลตไว)
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SUGGESTED_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-2.5 py-1 rounded-xl bg-white border border-[#E2DACB] hover:border-[#6C7764] hover:bg-[#F2ECE1] text-[11px] font-semibold text-[#2C2C24] transition shrink-0 shadow-2xs active:scale-95 cursor-pointer"
                >
                  {tmpl.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Task Title */}
          <div>
            <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider mb-1.5">
              1. หัวข้องาน / สิ่งที่ต้องทำ <span className="text-[#B88E76]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น อ่านบทสรุปวิจัย, ร่างสัญญาลูกค้า, ทำสไลด์ Canva"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2DACB] bg-white focus:border-[#6C7764] focus:ring-2 focus:ring-[#6C7764]/20 outline-none text-sm font-medium text-[#2C2C24] placeholder:text-[#8A8A7A] transition"
            />
          </div>

          {/* 2. Category & Custom Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider">
              2. หมวดหมู่ & แท็ก (Category & Tags)
            </label>
            
            {/* Category 4 options */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'personal', label: 'ส่วนตัว' },
                { id: 'work', label: 'งาน (Work)' },
                { id: 'freelance', label: 'ฟรีแลนซ์' },
                { id: 'education', label: 'การเรียน' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as TaskCategory)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer text-center ${
                    category === cat.id
                      ? 'bg-[#6C7764] border-[#6C7764] text-white shadow-2xs font-bold'
                      : 'bg-white border-[#E2DACB] text-[#6E6E60] hover:bg-[#EFE9DE]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Custom Tag input & chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAE4D9] text-[#4A483E] text-xs font-semibold"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}

              <div className="inline-flex items-center gap-1 bg-white border border-[#E2DACB] rounded-xl px-2 py-1">
                <Tag className="w-3 h-3 text-[#8A887A]" />
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="+ เพิ่มแท็ก (เช่น #thesis)"
                  className="text-xs text-[#2C2C24] outline-none placeholder:text-[#9A988D] w-32"
                />
                {newTagInput && (
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="text-[10px] font-bold text-[#6C7764] hover:underline cursor-pointer"
                  >
                    เพิ่ม
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 3. Task Size & Priority Controls */}
          <div>
            <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider mb-1.5">
              3. ขนาดงาน & ความสำคัญ (Size & Priority)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { id: 'small', label: 'งานเล็ก', desc: '~5-15 นาที' },
                { id: 'medium', label: 'งานกลาง', desc: '~25-45 นาที' },
                { id: 'large', label: 'งานใหญ่', desc: '~60 นาที+' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s.id as TaskSize)}
                  className={`p-2.5 rounded-2xl border text-center transition cursor-pointer ${
                    size === s.id
                      ? 'bg-[#EBF0E8] border-[#6C7764] ring-2 ring-[#6C7764]/20 font-bold'
                      : 'bg-white border-[#E2DACB] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#2C2C24]">{s.label}</div>
                  <div className="text-[10px] text-[#7A786C] mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>

            {/* Urgent & Flag Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsUrgent(!isUrgent)}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition cursor-pointer ${
                  isUrgent
                    ? 'bg-[#FDECE8] border-[#E05A47] text-[#C23A25] shadow-2xs'
                    : 'bg-white border-[#E2DACB] text-[#7A786C] hover:bg-[#FAF8F5]'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${isUrgent ? 'text-[#E05A47]' : 'text-[#8A887A]'}`} />
                <span>{isUrgent ? 'งานเร่งด่วน (Urgent)' : 'งานปกติ'}</span>
              </button>

              <button
                type="button"
                onClick={() => setFlagged(!flagged)}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition cursor-pointer ${
                  flagged
                    ? 'bg-[#FFF4E0] border-[#D49E35] text-[#9E6E15] shadow-2xs'
                    : 'bg-white border-[#E2DACB] text-[#7A786C] hover:bg-[#FAF8F5]'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flagged ? 'text-[#D49E35] fill-current' : 'text-[#8A887A]'}`} />
                <span>{flagged ? 'ปักธงสำคัญ' : 'ปักธง'}</span>
              </button>
            </div>
          </div>

          {/* 4. Calendar Date Range & Deadline */}
          <div className="bg-white rounded-2xl p-3 border border-[#E2DACB] space-y-2.5">
            <div className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#6C7764]" />
              <span>4. กำหนดเวลา & เดดไลน์ (Timeline)</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <CustomDatePicker
                label="วันที่เริ่ม (Start Date)"
                value={startDate}
                onChange={setStartDate}
                placeholder="เลือกวันเริ่มต้น"
              />

              <CustomDatePicker
                label="กำหนดส่ง (Deadline)"
                value={deadline}
                onChange={setDeadline}
                placeholder="เลือกวันกำหนดส่ง"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-[#7A786C] mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#8A887A]" />
                  <span>เวลาที่นัดหมาย (Time)</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[#E2DACB] bg-[#FAF8F5] text-xs text-[#2C2C24] outline-none focus:border-[#6C7764]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#7A786C] mb-1">
                  เวลาโดยประมาณ (นาที)
                </label>
                <select
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[#E2DACB] bg-[#FAF8F5] text-xs text-[#2C2C24] outline-none focus:border-[#6C7764]"
                >
                  <option value={5}>5 นาที (ด่วนจิ๋ว)</option>
                  <option value={15}>15 นาที (กำลังดี)</option>
                  <option value={25}>25 นาที (1 รอบ Pomodoro)</option>
                  <option value={45}>45 นาที (ขนาดกลาง)</option>
                  <option value={60}>60+ นาที (โปรเจกต์)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. Additional Details (Location & Photo Attachment) */}
          <div className="bg-white rounded-2xl border border-[#E2DACB] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-[#4A483E] hover:bg-[#FAF8F5] transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#6C7764]" />
                <span>สถานที่ & แนบรูปถ่าย (Optional)</span>
              </span>
              {showOptionalFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showOptionalFields && (
              <div className="p-3.5 pt-1 space-y-3 border-t border-[#F0EBE1] animate-in fade-in duration-150">
                {/* Location */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#7A786C] mb-1">
                    สถานที่ทำงาน (Location)
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8A887A] shrink-0" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="เช่น หอสมุดกลาง, ออฟฟิศชั้น 3, บ้าน"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#E2DACB] bg-[#FAF8F5] text-xs text-[#2C2C24] outline-none focus:border-[#6C7764]"
                    />
                  </div>
                </div>

                {/* Photo attachment */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#7A786C] mb-1">
                    แนบรูปถ่าย / ภาพอ้างอิง
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E2DACB] hover:bg-[#EFE9DE] text-xs font-semibold text-[#4A483E] transition cursor-pointer">
                      <ImageIcon className="w-4 h-4 text-[#6C7764]" />
                      <span>เลือกไฟล์รูปภาพ</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    {imageUrl && (
                      <div className="relative group">
                        <img
                          src={imageUrl}
                          alt="preview"
                          className="w-12 h-12 object-cover rounded-xl border border-[#E2DACB]"
                        />
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#C23A25] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#7A786C] mb-1">
                    บันทึกย่อ / รายละเอียดเพิ่มเติม
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="เช่น กังวลว่าจะทำออกมาไม่ดี, ร่างหัวข้อคร่าวๆ ไว้แล้ว..."
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E2DACB] bg-[#FAF8F5] text-xs text-[#2C2C24] outline-none focus:border-[#6C7764] resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Overthinking Checkbox */}
          <div className="bg-[#EFE9DE]/60 p-3 rounded-2xl border border-[#E2DACB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="overthinkingCheck"
                checked={isOverthinkingProne}
                onChange={(e) => setIsOverthinkingProne(e.target.checked)}
                className="w-4 h-4 text-[#6C7764] rounded focus:ring-[#6C7764]/40 border-[#E2DACB] cursor-pointer"
              />
              <label htmlFor="overthinkingCheck" className="text-xs font-semibold text-[#2C2C24] cursor-pointer">
                งานนี้ทำให้คิดเยอะ / รู้สึกเริ่มยากเป็นพิเศษ
              </label>
            </div>
          </div>

          {/* 6. Subtasks (Micro-Steps) */}
          <div className="pt-2 border-t border-[#E2DACB]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider">
                  Subtasks (รายการก้าวย่อย 2 นาที)
                </span>
                <p className="text-[11px] text-[#6E6E60]">ย่อยงานชิ้นเล็กเพื่อให้สมองไม่กลัวและเริ่มได้เลย</p>
              </div>

              <button
                type="button"
                onClick={handleAutoDecompose}
                disabled={!title.trim() || isDecomposing}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EFE9DE] hover:bg-[#E5DDD0] text-[#55634E] text-xs font-semibold transition disabled:opacity-50 cursor-pointer border border-[#E2DACB]"
              >
                <Sparkles className={`w-3.5 h-3.5 text-[#6C7764] ${isDecomposing ? 'animate-spin' : ''}`} />
                <span>{isDecomposing ? 'กำลังย่อยขั้น...' : 'AI ช่วยย่อยขั้น'}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {microSteps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#6C7764] w-4">{idx + 1}.</span>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleUpdateStepTitle(step.id, e.target.value)}
                    placeholder={`ขั้นตอนที่ ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E2DACB] rounded-xl text-[#2C2C24] outline-none focus:border-[#6C7764]"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteStep(step.id)}
                    className="text-[#8A8A7A] hover:text-[#B88E76] p-1 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddStep}
                className="w-full py-1.5 border border-dashed border-[#6C7764]/40 rounded-xl text-xs font-semibold text-[#55634E] hover:bg-[#EFE9DE] flex items-center justify-center gap-1 transition mt-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มก้าวย่อยเอง</span>
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#6E6E60] hover:bg-[#EFE9DE] text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#6C7764] hover:bg-[#586350] text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer active:scale-95"
            >
              {initialTask ? 'บันทึกการแก้ไข' : 'บันทึกงาน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
