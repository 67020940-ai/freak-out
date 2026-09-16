# ⚡ Freak Out! — Less Thinking, More Doing

แอปพลิเคชันช่วยจัดการงานและลดภาวะคิดเยอะเกินไป (Analysis Paralysis / Choice Overload) สำหรับนักศึกษาและคนรุ่นใหม่ ด้วยระบบ AI Context-Aware และ Gamification

---

## 🌟 ฟีเจอร์หลัก (Key Features)

- **🎯 Smart Pick (AI ช่วยเลือก 1 งาน):** ไม่ต้องทนมอง To-Do List ขนาดยาว ระบบจะวิเคราะห์ Deadlines, เวลาว่าง และระดับพลังงาน เพื่อเลือก 1 งานที่เหมาะที่สุดในขณะนั้น
- **⏱️ Focus Mode & Pomodoro:** เข้าสู่โหมดโฟกัสพร้อมตัวจับเวลาและเพลงผ่อนคลาย เพื่อทำลายแรงต้านในการเริ่มต้นทำงาน
- **🧘 Panic Calm Mode:** โหมดคลายความตื่นตระหนกและลดความเครียดสะสมด้วยแบบฝึกหายใจและจัดระเบียบความคิด
- **🏆 Gamification System:** สะสมแต้ม XP, ไต่ระดับ Level, เก็บ Badge และรักษาสถิติ Streak ทุกครั้งที่ทำงานสำเร็จ

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion)
- **Tooling:** Vite, Lucide Icons, Canvas Confetti
- **AI Integration:** Google GenAI SDK (@google/genai)

---

## 🚀 วิธีการรันบนเครื่อง (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment Variables (ถ้ามี)
คัดลอก `.env.example` เป็น `.env` และใส่ค่า API Key:
```bash
cp .env.example .env
```

### 3. รัน Development Server
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000) (หรือพอร์ตที่ระบบระบุ)

---

## 📦 Build & Deploy
```bash
npm run build
```
ไฟล์ Production จะอยู่ที่โฟลเดอร์ `dist/` สามารถนำไป Deploy บน Vercel, Netlify หรือแปลงเป็น Mobile App ผ่าน Capacitor ได้ทันที
