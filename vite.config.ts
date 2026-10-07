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
            const { energy, taskCount, overthinkCount, completedToday } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

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
