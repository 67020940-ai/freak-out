# Freak Out! — Domain Context & System Memory

> **Repository:** `/Users/jay/freak-out`  
> **Status:** Active · Hallmark Certified (Linen & Sage · Workbench)  
> **Last Updated:** 2 ตุลาคม 2026

---

## 1. Domain Philosophy & Glossary (พจนานุกรมและแนวคิดหลัก)

* **Analysis Paralysis (ภาวะคิดเยอะจนไม่เริ่มทำ):** สภาวะที่สมองมีตัวเลือก (To-Do List) มากเกินไปจนเกิดความเครียดสะสม Freak Out แก้ด้วยการทำ **Cognitive Offloading**
* **Single-Task Smart Pick (AI เลือก 1 งาน):** กลไกคัดเลือกงานที่เหมาะสมที่สุด 1 ชิ้น โดยประเมินจาก Deadline, เวลาว่างในปฏิทิน, และระดับพลังงานของผู้ใช้ (1-5)
* **Emotional Cloud Pet (น้องเมฆ นูเบ้ / FuFu):** สัตว์เลี้ยงสะท้อนสภาพจิตใจและชั่วโมงโฟกัสของผู้ใช้ ไม่มีการลงโทษจนตาย (Zero Toxic Guilt) มีเฉพาะอาการผล็อยหลับหรือหมอกจางๆ เมื่อขาดการดูแล
* **Atmospheric Mirror (กระจกสภาพอากาศ):** เมื่อทำงานสำเร็จ ท้องฟ้าจะแจ่มใส มีประกายแดดและสายรุ้ง
* **Focus Shield (โล่ป้องกันสมาธิ):** ระบบ Two-Way Calendar Sync ที่ปักบล็อกเวลา Do Not Disturb ลงใน Google Calendar จริงเวลากดเริ่ม Focus Mode
* **Auto-Slot Gap Detection:** สแกนหาช่วงว่างระหว่างคาบเรียน (เช่น ว่าง 45 นาที) แล้วแนะนำงานสั้นที่ทำเสร็จได้ทันที
* **Anti-Burnout & Streak Freeze:** ระบบเช็คอิน 7 วัน ที่แจกน้ำยาแช่แข็งสตรีคในวันที่ 6 เพื่อปกป้องสถิติสตรีคในวันที่ผู้ใช้ป่วยหรือหมดไฟ
* **Stardust (ละอองดาว):** สกุลเงินในแอปที่ได้จากการโฟกัสจริง ใช้แลกคอสตูมและของแต่งตัวน้องเมฆ

---

## 2. Technical Architecture & Stack

```
Frontend:     React 19 + TypeScript + Vite 6
Styling:      Tailwind CSS v4 + Hallmark Tactile Linen & Sage tokens
Motion:       Motion (Framer Motion 12) + Custom Keyframes (float, wiggle)
AI Engine:    Google GenAI SDK (@google/genai) — Gemini 1.5 Flash
State:        React Hooks + LocalStorage Persistence (Offline-First)
Mobile Path:  Capacitor 6 (iOS Swift / Android Kotlin)
Monetization: RevenueCat (Apple StoreKit 2 + Google Play Billing)
```

---

## 3. Business Model & Financials

* **Student Plan:** ฿49 / เดือน หรือ ฿449 / ปี (สำหรับนักศึกษา .ac.th)
* **General Pro:** ฿79 / เดือน หรือ ฿699 / ปี
* **Free Tier:** รองรับ Rewarded Ads (5-15 วินาที) สำหรับแลกโควต้า AI และละอองดาว ห้ามแสดงโฆษณาระหว่าง Focus Mode เด็ดขาด
* **Breakeven Point:** สมาชิก Pro ประมาณ **300 - 500 คน** สามารถครอบคลุมค่าสโตร์และค่าเซิร์ฟเวอร์ทั้งปี

---

## 4. Design System Standards (Hallmark Locked DNA)

* **Macrostructure:** `Workbench`
* **Genre:** `playful` (Post-Linear Soft School)
* **Theme:** `Linen & Sage` (`--bg: #F9F7F2`, `--ink: #2C2C24`, `--sage: #828D7A`, `--earth: #B88E76`)
* **Typography:** Upright Roman headings (`font-style: normal !important;`) คู่ฟอนต์ Playfair Display / Mitr (Headings) และ Prompt / Plus Jakarta Sans (Body)
* **Interactive Standard:** 8-State Discipline (`.btn-tactile-primary`, `.btn-tactile-secondary`, `.card-tactile`)
* **Responsive Standard:** รองรับ 320px, 375px, 414px, 768px โดยไม่ล้นแนวนอน (`overflow-x: clip`)
