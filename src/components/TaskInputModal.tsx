import React, { useState } from 'react';
import { Task, EnergyLevel, UrgencyLevel, TaskCategory, MicroStep } from '../types';
import { X, Sparkles, Plus, Trash2, Zap, BatteryMedium, BatteryLow, Clock, AlertCircle } from 'lucide-react';
import { generateMicroSteps } from '../utils/aiHelper';

interface TaskInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'> & { id?: string }) => void;
  initialTask?: Task | null;
}

export const TaskInputModal: React.FC<TaskInputModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  initialTask,
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category || 'study');
  const [energy, setEnergy] = useState<EnergyLevel>(initialTask?.energy || 'medium');
  const [urgency, setUrgency] = useState<UrgencyLevel>(initialTask?.urgency || 'medium');
  const [importance, setImportance] = useState<UrgencyLevel>(initialTask?.importance || 'medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(initialTask?.estimatedMinutes || 25);
  const [isOverthinkingProne, setIsOverthinkingProne] = useState<boolean>(
    initialTask?.isOverthinkingProne ?? true
  );
  const [microSteps, setMicroSteps] = useState<MicroStep[]>(
    initialTask?.microSteps || []
  );

  if (!isOpen) return null;

  const handleAutoDecompose = () => {
    if (!title.trim()) return;
    const generated = generateMicroSteps(title, category);
    setMicroSteps(generated);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: initialTask?.id,
      title: title.trim(),
      description: description.trim(),
      category,
      energy,
      urgency,
      importance,
      estimatedMinutes: Number(estimatedMinutes) || 15,
      isOverthinkingProne,
      microSteps: microSteps.filter((s) => s.title.trim() !== ''),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C24]/50 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E2DACB] p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#8A8A7A] hover:text-[#2C2C24] hover:bg-[#EFE9DE] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Concept Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFE9DE] text-[#55634E] text-xs font-semibold mb-1.5 border border-[#E2DACB]">
            <Sparkles className="w-3.5 h-3.5 text-[#828D7A]" />
            <span>Anti-Overthinking Task</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#2C2C24]">
            {initialTask ? 'แก้ไขงาน' : 'ระบายสิ่งที่ต้องทำ (Brain Dump)'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6E60] mt-0.5">
            ใส่สิ่งที่คุณคิดอยู่ในหัว แล้วระบบจะช่วยย่อยให้เริ่มต้นได้ง่ายใน 2 นาที!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider mb-1.5">
              ชื่องาน / สิ่งที่คิดวนอยู่ในหัว <span className="text-[#B88E76]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น อ่านบทสรุปวิจัย, ร่างอีเมลส่งอาจารย์, ทำสไลด์ Canva"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2DACB] bg-[#FAF8F5] focus:border-[#828D7A] focus:ring-2 focus:ring-[#828D7A]/20 outline-none text-sm font-medium text-[#2C2C24] placeholder:text-[#8A8A7A] transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider mb-1.5">
              รายละเอียดเพิ่มเติม / ทำไมถึงยังไม่เริ่ม
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="เช่น รู้สึกเนื้อหาเยอะเกินไป, กังวลว่าจะทำออกมาไม่ดี"
              className="w-full px-4 py-2 rounded-xl border border-[#E2DACB] bg-[#FAF8F5] focus:border-[#828D7A] focus:ring-2 focus:ring-[#828D7A]/20 outline-none text-xs sm:text-sm text-[#2C2C24] placeholder:text-[#8A8A7A] transition resize-none"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider mb-1.5">
              หมวดหมู่งาน
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'study', label: 'เรียน 📚' },
                { id: 'work', label: 'งาน 💼' },
                { id: 'project', label: 'โปรเจกต์ 🚀' },
                { id: 'personal', label: 'ส่วนตัว 🧸' },
                { id: 'life', label: 'ชีวิต 🌿' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as TaskCategory)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer text-center ${
                    category === cat.id
                      ? 'bg-[#828D7A] border-[#828D7A] text-white shadow-2xs'
                      : 'bg-[#F9F7F2] border-[#E2DACB] text-[#6E6E60] hover:bg-[#EFE9DE]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level Selection (Core BMC Concept) */}
          <div>
            <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>พลังงานที่ต้องใช้ (Energy Required)</span>
              <span className="text-[11px] text-[#55634E] font-normal">ระบบจะแมตช์กับแรงของคุณ</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEnergy('low')}
                className={`p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                  energy === 'low'
                    ? 'bg-[#EBF0E8] border-[#828D7A] ring-2 ring-[#828D7A]/30'
                    : 'bg-[#F9F7F2] border-[#E2DACB] hover:bg-[#EFE9DE]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#485942] font-bold text-xs">
                  <BatteryLow className="w-4 h-4" />
                  <span>🪫 ต่ำ / ชิลๆ</span>
                </div>
                <p className="text-[10px] text-[#6E6E60] mt-0.5">ไม่ต้องคิดเยอะ เคลียร์ง่าย</p>
              </button>

              <button
                type="button"
                onClick={() => setEnergy('medium')}
                className={`p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                  energy === 'medium'
                    ? 'bg-[#F6EFEA] border-[#B88E76] ring-2 ring-[#B88E76]/30'
                    : 'bg-[#F9F7F2] border-[#E2DACB] hover:bg-[#EFE9DE]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#8C6048] font-bold text-xs">
                  <BatteryMedium className="w-4 h-4" />
                  <span>🔋 ปานกลาง</span>
                </div>
                <p className="text-[10px] text-[#6E6E60] mt-0.5">ใช้สมาธิระดับปกติ</p>
              </button>

              <button
                type="button"
                onClick={() => setEnergy('high')}
                className={`p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                  energy === 'high'
                    ? 'bg-[#F5ECE5] border-[#9A6246] ring-2 ring-[#9A6246]/30'
                    : 'bg-[#F9F7F2] border-[#E2DACB] hover:bg-[#EFE9DE]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#9A6246] font-bold text-xs">
                  <Zap className="w-4 h-4" />
                  <span>⚡ เต็มร้อย</span>
                </div>
                <p className="text-[10px] text-[#6E6E60] mt-0.5">งานใหญ่ ใช้พลังสมองเยอะ</p>
              </button>
            </div>
          </div>

          {/* Time & Urgency Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Time Estimate */}
            <div>
              <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#8A8A7A]" />
                <span>เวลาโดยประมาณ</span>
              </label>
              <select
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E2DACB] bg-[#FAF8F5] text-xs sm:text-sm font-medium text-[#2C2C24] outline-none focus:border-[#828D7A]"
              >
                <option value={5}>5 นาที (ด่วนจิ๋ว)</option>
                <option value={15}>15 นาที (กำลังดี)</option>
                <option value={25}>25 นาที (1 รอบ Pomodoro)</option>
                <option value={45}>45 นาที (งานขนาดกลาง)</option>
                <option value={60}>60+ นาที (งานชิ้นใหญ่)</option>
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-bold text-[#2C2C24] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#8A8A7A]" />
                <span>ความเร่งด่วน</span>
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2DACB] bg-[#FAF8F5] text-xs sm:text-sm font-medium text-[#2C2C24] outline-none focus:border-[#828D7A]"
              >
                <option value="high">🔥 ด่วนมาก (ส่งวันนี้/พรุ่งนี้)</option>
                <option value="medium">⚡ ปานกลาง (สัปดาห์นี้)</option>
                <option value="low">🌱 เรื่อยๆ (ไม่มีเดดไลน์ตายตัว)</option>
              </select>
            </div>
          </div>

          {/* Overthinking Checkbox */}
          <div className="bg-[#EFE9DE]/60 p-3 rounded-2xl border border-[#E2DACB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="overthinkingCheck"
                checked={isOverthinkingProne}
                onChange={(e) => setIsOverthinkingProne(e.target.checked)}
                className="w-4 h-4 text-[#828D7A] rounded focus:ring-[#828D7A]/40 border-[#E2DACB]"
              />
              <label htmlFor="overthinkingCheck" className="text-xs font-semibold text-[#2C2C24] cursor-pointer">
                🧠 งานนี้ทำให้คิดเยอะ / รู้สึกเริ่มยากเป็นพิเศษ
              </label>
            </div>
          </div>

          {/* Micro-Steps Section */}
          <div className="pt-2 border-t border-[#E2DACB]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider">
                  Micro-Steps (ก้าวย่อย 2 นาที)
                </span>
                <p className="text-[11px] text-[#6E6E60]">ย่อยงานเป็นชิ้นเล็กๆ เพื่อให้สมองไม่กลัว</p>
              </div>

              <button
                type="button"
                onClick={handleAutoDecompose}
                disabled={!title.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EFE9DE] hover:bg-[#E5DDD0] text-[#55634E] text-xs font-semibold transition disabled:opacity-50 cursor-pointer border border-[#E2DACB]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#828D7A]" />
                <span>AI ช่วยย่อยขั้น</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {microSteps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#828D7A] w-4">{idx + 1}.</span>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleUpdateStepTitle(step.id, e.target.value)}
                    placeholder={`ขั้นตอนที่ ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E2DACB] rounded-lg text-[#2C2C24] outline-none focus:border-[#828D7A]"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteStep(step.id)}
                    className="text-[#8A8A7A] hover:text-[#B88E76] p-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddStep}
                className="w-full py-1.5 border border-dashed border-[#828D7A]/40 rounded-xl text-xs font-semibold text-[#55634E] hover:bg-[#EFE9DE] flex items-center justify-center gap-1 transition mt-1 cursor-pointer"
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
              className="px-5 py-2 rounded-xl bg-[#828D7A] hover:bg-[#6C7764] text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer active:scale-95"
            >
              {initialTask ? 'บันทึกการแก้ไข' : 'บันทึกงาน ✨'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
