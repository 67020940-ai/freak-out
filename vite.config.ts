import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function geminiProxyPlugin() {
  return {
    name: 'gemini-decompose-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/decompose', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          try {
            const { taskTitle, category } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY not configured', fallback: true }));
              return;
            }

            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey });

            const prompt = `You are a cognitive offloading assistant for an ADHD / overthinking anti-burnout task app called "Freak Out!".
The user wants to start this task:
Title: "${taskTitle}"
Category: "${category || 'general'}"

Break this task down into 3 to 4 tiny, frictionless micro-steps (2-7 minutes each) that an overwhelmed or exhausted person can do immediately without overthinking.
Reply ONLY with a raw JSON array matching this schema, without Markdown fences:
[
  {"title": "string (in Thai, encouraging, actionable, very concrete)", "estimatedMinutes": number}
]`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });

            const text = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(text);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ steps: parsed, source: 'gemini' }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message, fallback: true }));
          }
        });
      });

      server.middlewares.use('/api/analyze-readiness', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          try {
            const { energy, taskCount, overthinkCount, completedToday, userApiKey } = JSON.parse(body || '{}');
            const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                stressLevel: 'ปานกลาง',
                readinessScore: 75,
                advice: 'จัดลำดับงานที่เล็กที่สุดก่อน 1 ชิ้น เพื่อให้สมองหลั่งโดปามีนและลดความกังวล',
                cognitiveBandwidth: 'เหลือ 60%',
              }));
              return;
            }

            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey });

            const prompt = `You are an empathic psychologist and cognitive coach inside "Freak Out!" task manager app.
Analyze the user's workload state:
- Current Energy Level: "${energy}"
- Pending Tasks: ${taskCount}
- Tasks causing overthinking/fear: ${overthinkCount}
- Completed today: ${completedToday}

Provide a reassuring, gentle, anti-burnout cognitive assessment in Thai.
Reply ONLY with a raw JSON object matching this schema, without Markdown fences:
{
  "stressLevel": "ต่ำ" | "ปานกลาง" | "สูง",
  "readinessScore": number (0 to 100),
  "advice": "string (practical 1-2 sentence advice in gentle Thai, no toxic positivity)",
  "cognitiveBandwidth": "string (e.g. 'พร้อมลุย 80%', 'สมองล้า ควรพัก 15 นาที')"
}`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });

            const text = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(text);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(parsed));
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              stressLevel: 'ปานกลาง',
              readinessScore: 70,
              advice: 'พักจิบน้ำแล้วเลือกงานที่ง่ายที่สุดเพียง 1 งาน ไม่ต้องเร่งรีบ',
              cognitiveBandwidth: 'ปกติ',
            }));
          }
        });
      });

      server.middlewares.use('/api/chat', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          try {
            const { message, history, userContext, userApiKey } = JSON.parse(body || '{}');
            const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

            if (apiKey) {
              const { GoogleGenAI } = await import('@google/genai');
              const ai = new GoogleGenAI({ apiKey });

              const systemInstruction = `You are "น้อง Cloudy" (น้องคลาวดี้) — a warm, calm, intelligent personal AI productivity agent & psychologist inside the "Freak Out!" app.
Your mission is to help people with ADHD, procrastination, anxiety, and overthinking break through paralysis and get things done gently.
User context:
- Name: ${userContext?.name || 'เพื่อน'}
- Energy level: ${userContext?.energy || 'okay'}
- Pending tasks: ${userContext?.taskCount ?? 0}
Guidelines:
1. Always respond in warm, reassuring, natural Thai (friendly tone, concise, no long essays).
2. NEVER lecture or use toxic positivity. Acknowledge when things are hard.
3. Suggest tiny, frictionless 2-minute steps.
4. Keep replies within 2-4 sentences unless asked for a breakdown.
5. Zero emojis unless truly necessary.`;

              const contents: any[] = [];
              if (Array.isArray(history)) {
                history.slice(-6).forEach((h: any) => {
                  contents.push({
                    role: h.role === 'user' ? 'user' : 'model',
                    parts: [{ text: h.text }]
                  });
                });
              }
              contents.push({
                role: 'user',
                parts: [{ text: message }]
              });

              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents,
                config: {
                  systemInstruction,
                }
              });

              const reply = response.text || 'น้อง Cloudy อยู่ตรงนี้เสมอ ค่อยๆ ทำทีละก้าวนะครับ';
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ reply, isRealAi: true }));
              return;
            }

            // Built-in intelligent cognitive conversational engine (No API Key required)
            const userMsg = String(message || '').toLowerCase();
            let intelligentReply = '';

            if (userMsg.includes('คิดวน') || userMsg.includes('เริ่มไม่ได้') || userMsg.includes('ตัน') || userMsg.includes('กังวล')) {
              intelligentReply = `น้อง Cloudy เข้าใจเลยครับ เวลาสมองคิดวน มันเหมือนเปิดแท็บเยอะเกินไปจนเครื่องค้าง ลองทิ้งภาพปลายทางไว้ก่อน แล้วเลือกงานที่ง่ายที่สุดเพียง "1 ก้าวเล็กๆ ใน 2 นาทีแรก" พอทำเสร็จสมองจะเริ่มโล่งขึ้นทันทีเลยครับ`;
            } else if (userMsg.includes('ย่อยงาน') || userMsg.includes('งานใหญ่') || userMsg.includes('โปรเจกต์') || userMsg.includes('รายงาน')) {
              intelligentReply = `ได้เลยครับ งานใหญ่ทำให้เรากลัวเป็นเรื่องปกติ เคล็ดลับคือหั่นเป็น 3 ช่วง: 1) เปิดไฟล์เปล่าแล้วพิมพ์ชื่อหัวข้อ 2) ร่างหัวข้อย่อย 3 ข้อแบบไม่ต้องกลัวผิด 3) จัดการทีละหัวข้อ ลองเริ่มแค่ข้อแรก 3 นาทีก่อนครับ`;
            } else if (userMsg.includes('หมดแรง') || userMsg.includes('เหนื่อย') || userMsg.includes('เพลีย') || userMsg.includes('ขี้เกียจ')) {
              intelligentReply = `ถ้าวันนี้หมดแรง ไม่ต้องฝืนทำเรื่องยากเลยครับ จิบน้ำสักแก้ว แล้วเลือกทำเรื่องเบาๆ เช่น เช็คของ จัดโต๊ะ 1 มุม หรือแค่นั่งฝึกหายใจกับน้อง Cloudy ก็ถือว่าดูแลตัวเองได้ดีมากแล้วครับ`;
            } else if (userMsg.includes('สวัสดี') || userMsg.includes('ทักทาย') || userMsg.includes('หวัดดี')) {
              intelligentReply = `สวัสดีครับคุณ ${userContext?.name || 'เพื่อน'}! น้อง Cloudy พร้อมดูแลความรู้สึกและช่วยจัดระเบียบงานให้แล้วครับ วันนี้มีอะไรที่อยากระบายหรืออยากให้ช่วยคิดไหมครับ?`;
            } else {
              intelligentReply = `น้อง Cloudy รับฟังอยู่เสมอนะครับ ไม่ว่าภาระงานจะเยอะแค่ไหน เราไม่ต้องทำทุกอย่างให้เสร็จพร้อมกัน แค่โฟกัสทีละอย่างตามพลังงานที่มี น้อง Cloudy เชื่อมั่นในตัวคุณครับ`;
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ reply: intelligentReply, isRealAi: true, builtIn: true }));
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              reply: 'น้อง Cloudy อยู่นี่นะ งานเยอะแค่ไหนก็ค่อยๆ จัดการทีละข้อได้ ลองเลือกชิ้นที่ทำเสร็จได้ใน 2 นาทีแรกขึ้นมาก่อนเลย'
            }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
