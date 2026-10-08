import React, { useState } from 'react';
import { FocusSpace } from '../types';
import {
  Folder,
  Plus,
  Crown,
  Sparkles,
  BookOpen,
  Briefcase,
  Heart,
  Palette,
  Check,
  X
} from 'lucide-react';

export const DEFAULT_SPACES: FocusSpace[] = [
  {
    id: 'space-general',
    name: 'ห้องหลัก (General)',
    icon: 'Folder',
    description: 'พื้นที่จัดการภารกิจและชีวิตประจำวัน',
    accentColor: '#828D7A',
    isProOnly: false,
  },
  {
    id: 'space-thesis',
    name: 'Thesis & Research Lab',
    icon: 'BookOpen',
    description: 'งานวิจัย วิทยานิพนธ์ อ่านเปเปอร์',
    accentColor: '#5C8A8A',
    isProOnly: true,
  },
  {
    id: 'space-freelance',
    name: 'Client Studio',
    icon: 'Briefcase',
    description: 'โปรเจกต์ลูกค้า บรีฟงาน ดราฟต์แรก',
    accentColor: '#B88E76',
    isProOnly: true,
  },
  {
    id: 'space-wellness',
    name: 'Sanctuary & Self-Care',
    icon: 'Heart',
    description: 'บันทึกความรู้สึก ฝึกหายใจ พักสมอง',
    accentColor: '#8A7A9A',
    isProOnly: true,
  },
];

interface SpacesDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaces: FocusSpace[];
  activeSpaceId: string;
  onSelectSpace: (spaceId: string) => void;
  onAddSpace: (newSpace: Omit<FocusSpace, 'id'>) => void;
  isProUser: boolean;
  onOpenPricing: () => void;
}

export const SpacesDrawerModal: React.FC<SpacesDrawerModalProps> = ({
  isOpen,
  onClose,
  spaces,
  activeSpaceId,
  onSelectSpace,
  onAddSpace,
  isProUser,
  onOpenPricing,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDesc, setNewSpaceDesc] = useState('');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;

    if (!isProUser) {
      onOpenPricing();
      return;
    }

    onAddSpace({
      name: newSpaceName.trim(),
      description: newSpaceDesc.trim() || 'พื้นที่โฟกัสส่วนตัว',
      icon: 'Folder',
      accentColor: '#828D7A',
      isProOnly: true,
    });

    setNewSpaceName('');
    setNewSpaceDesc('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-t-[36px] w-full max-h-[85%] overflow-y-auto shadow-2xl border-t border-[#E8E2D5] p-5 relative animate-in slide-in-from-bottom duration-300 no-scrollbar select-none">
        {/* iOS Pull Handle */}
        <div className="w-10 h-1 bg-[#2C2C24]/20 rounded-full mx-auto mb-3 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EAE4D9]">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-heading text-[#2C2C24]">
              Focus Spaces (Notion Workspace)
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF4E0] text-[#B87A24] border border-[#F4E1BD]">
              PRO
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#EAE4D9] text-[#7A786C] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explanation */}
        <p className="text-xs text-[#7A786C] leading-relaxed mb-4">
          แยกบริบทงานไม่ให้ปนกัน (Context Separation) ลดการสลับโฟกัสไปมาในสมอง
        </p>

        {/* Space List */}
        <div className="space-y-2 mb-4">
          {spaces.map((sp) => {
            const isSelected = sp.id === activeSpaceId;
            const isLocked = sp.isProOnly && !isProUser;

            return (
              <div
                key={sp.id}
                onClick={() => {
                  if (isLocked) {
                    onOpenPricing();
                  } else {
                    onSelectSpace(sp.id);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#6C7764] ring-2 ring-[#6C7764]/20 shadow-xs'
                    : 'bg-white/80 border-[#E8E2D5] hover:bg-white hover:border-[#D5CDC0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-2xs"
                    style={{ backgroundColor: sp.accentColor }}
                  >
                    <Folder className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#2C2C24]">{sp.name}</span>
                      {sp.isProOnly && (
                        <Crown className="w-3 h-3 text-[#B87A24]" />
                      )}
                    </div>
                    <span className="text-[10px] text-[#7A786C]">{sp.description}</span>
                  </div>
                </div>

                {isSelected ? (
                  <span className="text-[10px] font-bold text-[#3B5433] bg-[#EBF0E8] px-2 py-0.5 rounded-full">
                    กำลังใช้งาน
                  </span>
                ) : isLocked ? (
                  <span className="text-[10px] font-bold text-[#B87A24] bg-[#FFF4E0] px-2 py-0.5 rounded-full">
                    ปลดล็อก PRO
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Create Space Form or CTA */}
        {isCreating ? (
          <form onSubmit={handleCreateSubmit} className="p-3.5 bg-white rounded-2xl border border-[#E2DACB] space-y-3">
            <span className="text-xs font-bold text-[#2C2C24] block">สร้าง Space ใหม่</span>
            <input
              type="text"
              required
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
              placeholder="ชื่อ Space เช่น Studio Project X"
              className="w-full px-3 py-2 rounded-xl border border-[#E2DACB] text-xs text-[#2C2C24] outline-none"
            />
            <input
              type="text"
              value={newSpaceDesc}
              onChange={(e) => setNewSpaceDesc(e.target.value)}
              placeholder="คำอธิบายสั้นๆ"
              className="w-full px-3 py-2 rounded-xl border border-[#E2DACB] text-xs text-[#2C2C24] outline-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-[#7A786C] cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#6C7764] text-white text-xs font-bold cursor-pointer"
              >
                สร้าง Space
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!isProUser) {
                onOpenPricing();
              } else {
                setIsCreating(true);
              }
            }}
            className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-[#6C7764]/40 hover:bg-[#EFE9DE] text-[#55634E] text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ สร้าง Focus Space ใหม่ (PRO)</span>
          </button>
        )}
      </div>
    </div>
  );
};
