import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CustomDatePickerProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  placeholder?: string;
  minDate?: string;
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'เลือกวันที่',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize display year and month from value or today
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear() || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth() ?? new Date().getMonth());

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Format date display for input: dd/mm/yyyy (CE or BE)
  const formatDisplay = (val: string) => {
    if (!val) return '';
    const [y, m, d] = val.split('-');
    if (!y || !m || !d) return val;
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays: Array<{
    day: number;
    month: 'prev' | 'current' | 'next';
    fullDateString: string;
  }> = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = viewMonth === 0 ? 12 : viewMonth;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    calendarDays.push({
      day: d,
      month: 'prev',
      fullDateString: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      month: 'current',
      fullDateString: `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
    });
  }

  // Next month leading days to complete grid (up to 35 or 42)
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const m = viewMonth === 11 ? 1 : viewMonth + 2;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    calendarDays.push({
      day: i,
      month: 'next',
      fullDateString: `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
    });
  }

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleSelectToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(todayString);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-[11px] font-semibold text-[#7A786C] mb-1">
        {label}
      </label>

      {/* Input button triggering calendar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-2.5 py-1.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
          isOpen
            ? 'border-[#6C7764] ring-2 ring-[#6C7764]/20 bg-white'
            : 'border-[#E2DACB] bg-[#FAF8F5] hover:border-[#6C7764]/60'
        }`}
      >
        <span className={value ? 'text-[#2C2C24] font-medium' : 'text-[#A09D90]'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <CalendarIcon className="w-3.5 h-3.5 text-[#8A887A] shrink-0" />
      </div>

      {/* Popover Calendar Modal/Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 left-0 right-0 sm:w-68 bg-white rounded-2xl shadow-xl border border-[#E2DACB] p-3 animate-in fade-in zoom-in-95 duration-150">
          {/* Header: Month Year + Arrows */}
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#F0ECE1]">
            <div className="text-xs font-bold text-[#2C2C24]">
              {THAI_MONTHS[viewMonth]} {viewYear}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-[#F2ECE1] text-[#7A786C] hover:text-[#2C2C24] transition cursor-pointer"
                title="เดือนก่อนหน้า"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-[#F2ECE1] text-[#7A786C] hover:text-[#2C2C24] transition cursor-pointer"
                title="เดือนถัดไป"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAYS.map((w, idx) => (
              <div
                key={idx}
                className={`text-[10px] font-bold ${
                  idx === 0 ? 'text-[#C23A25]' : 'text-[#7A786C]'
                }`}
              >
                {w}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((item, idx) => {
              const isSelected = value === item.fullDateString;
              const isToday = todayString === item.fullDateString;
              const isCurrentMonth = item.month === 'current';

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDate(item.fullDateString)}
                  className={`h-7 w-7 mx-auto rounded-lg text-[11px] font-medium flex items-center justify-center transition cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-[#6C7764] text-white font-bold shadow-xs'
                      : isToday
                      ? 'border border-[#6C7764] text-[#6C7764] font-bold hover:bg-[#F2ECE1]'
                      : isCurrentMonth
                      ? 'text-[#2C2C24] hover:bg-[#F2ECE1]'
                      : 'text-[#C5BEB1] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Actions */}
          <div className="mt-2.5 pt-2 border-t border-[#F0ECE1] flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={handleClear}
              className="text-[#8A887A] hover:text-[#C23A25] transition cursor-pointer font-medium"
            >
              ล้าง
            </button>
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-[#6C7764] hover:text-[#4A5344] font-bold transition cursor-pointer"
            >
              วันนี้
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
