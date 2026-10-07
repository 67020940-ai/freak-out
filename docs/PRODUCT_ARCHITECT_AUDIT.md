# 🏗️ Product Architect Audit: Project Freak Out!
**บันทึกผลการ Audit & แผนการพัฒนาสำหรับวันถัดไป**
*วันที่บันทึก: 8 ตุลาคม 2569 (2026-10-08)*
*สถานะโค้ดปัจจุบัน: Commit `eaf9567` (Clean working tree, ผ่าน Playwright tests 7/7)*

---

## 🔍 1. Current State Diagnosis (วินิจฉัยจุดบกพร่องที่พบ)

1. **Disconnected Focus Spaces (Hollow Feature / UI เปล่า):**
   - มี `SpacesDrawerModal.tsx` ให้เลือก Space (General, Thesis, Freelance, Wellness)
   - แต่โมเดล `Task` ใน `src/types.ts` ยังไม่มีฟิลด์ `spaceId?: string`
   - การสลับ Space ไม่ได้กรองงานจริงใน `TaskList.tsx` และการเพิ่มงานใหม่ไม่ได้แท็ก Space ทำให้อรรถประโยชน์ของ Pro Plan ยังไม่สมบูรณ์
2. **Destructive Delete Without Safety Net (ขาดระบบ Undo ป้องกันข้อมูลสูญหาย):**
   - การลบงาน (`handleDeleteTask`) เป็นการลบถาวรทันที ไม่มีระยะเวลาผ่อนปรน (Grace Period)
   - สำหรับผู้ใช้ ADHD หรือคนที่กำลัง Overwhelmed การเผลอกดลบงานที่จด Micro-steps ละเอียดไว้อาจทำให้หมดกำลังใจได้ง่าย
3. **Misleading Empty Search State:**
   - เมื่อพิมพ์ค้นหาแล้วไม่พบผลลัพธ์ ระบบแสดงการ์ดฉลอง "ไม่มีงานค้างอยู่ในรายการ" แทนที่จะแจ้งว่า "ไม่พบงานที่ค้นหา" พร้อมปุ่มล้างคำค้นหา
4. **Calendar Gap Slotting ยังไม่ Actionable:**
   - ใน `CalendarView.tsx` มีระบบสแกนหาช่องว่างเวลา (Gap Detection) แต่ยังไม่มีปุ่ม 1-Tap บรรจุงานที่แนะนำลงในช่องว่างนั้น

---

## 💡 2. High-Impact Upgrade Proposals (แผนงานที่จะทำในรอบหน้า)

### 📌 P0: ฟีเจอร์ความสำคัญสูงสุด
1. **True Space-Aware Task Isolation (เชื่อมต่อระบบ Spaces จริง):**
   - เพิ่ม `spaceId?: string` ใน `Task` (Default: `'space-general'`)
   - กรองงานใน `TaskList` ตาม `activeSpaceId` (พร้อมตัวเลือก "แสดงทุก Space")
   - ผูก `spaceId` อัตโนมัติเมื่อกดสร้างงานใหม่จาก Space นั้น ๆ
2. **5-Second Undo Safety Net (ระบบกู้คืนงานที่เผลอลบ):**
   - สร้างคอมโพเนนต์ `UndoToast.tsx`
   - เมื่อกดลบงาน ให้ทำ Soft-delete และหน่วงเวลา 5 วินาทีก่อนลบจริง เพื่อให้กด "กู้คืน (Undo)" ได้ทันที

### 📌 P1: ฟีเจอร์ยกระดับ UX
3. **Contextual Empty State & Quick Clear Filter:**
   - แยกหน้าจอเมื่อเคลียร์งานหมดจริง ๆ ออกจากหน้าจอ "ค้นหาไม่พบ" พร้อมปุ่มกด Reset Search
4. **1-Tap Focus Shield Slotting in Calendar:**
   - เพิ่มปุ่มคลิกเดียวเพื่อจองคิวงานลงในช่องว่างของ Google Calendar / Timeline

---

## 🛡️ 3. Safety & Blast Radius

- **ไฟล์ที่จะแก้ไข:**
  - `src/types.ts`
  - `src/App.tsx`
  - `src/components/TaskList.tsx`
  - `src/components/TaskInputModal.tsx`
  - `src/components/CalendarView.tsx`
- **ไฟล์ใหม่ที่จะสร้าง:**
  - `src/components/UndoToast.tsx`
- **ระบบเดิมที่ต้องไม่กระทบกระเทือน:**
  - Firebase Authentication & Google Calendar Integration
  - Gemini AI Proxy (`/api/decompose`, `/api/analyze-readiness`)
  - Pixel Cloud Mascot & Gamification
  - Playwright Test Suite (`npm run build` && `npx playwright test` ต้องผ่าน 100%)

---

## 🚀 4. Checklist สำหรับเริ่มงานในวันถัดไป

- [ ] 1. เพิ่ม `spaceId` ใน `types.ts` และอัปเดต mock data
- [ ] 2. กรอง `tasks` ใน `TaskList.tsx` ตาม `activeSpaceId`
- [ ] 3. สร้าง `src/components/UndoToast.tsx` และต่อระบบ Undo ใน `App.tsx`
- [ ] 4. แก้ไข Empty Search State ใน `TaskList.tsx`
- [ ] 5. เพิ่มปุ่ม 1-Tap Slotting ใน `CalendarView.tsx`
- [ ] 6. รัน `npx playwright test` และตรวจทาน
