import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, Minimize2, MessageSquare, Flame, CheckCircle2 } from 'lucide-react';
import { Task, EnergyLevel } from '../types';
import { PixelCloud8Bit } from './PixelCloud8Bit';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AiAgentChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  energy: EnergyLevel;
  tasks: Task[];
  onQuickAddTask?: (title: string) => void;
}

export const AiAgentChatModal: React.FC<AiAgentChatModalProps> = ({
  isOpen,
  onClose,
  userName,
  energy,
  tasks,
  onQuickAddTask,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      text: `สวัสดีครับคุณ ${userName || 'เพื่อน'}! ผมคือน้อง Cloudy AI Agent ส่วนตัวของคุณ วันนี้มีเรื่องอะไรที่ทำให้กังวลหรือคิดวนอยู่ไหมครับ? เล่าให้ผมฟังได้เลย เดี๋ยวผมช่วยย่อยงานให้`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const userApiKey = (localStorage.getItem('freakout_gemini_api_key') || '').trim();

      // 1. Direct Client-side Gemini SDK call if key is saved in localStorage
      if (userApiKey) {
        try {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey: userApiKey });

          const systemInstruction = `You are "น้อง Cloudy" (น้องคลาวดี้) — an intelligent, empathic, highly versatile personal AI productivity agent, psychologist, and thinking partner inside the "Freak Out!" app.
Your core expertise is ADHD-friendly productivity, emotional grounding, anti-procrastination, deep task breakdown, creative brainstorming, and answering any intellectual or life questions thoughtfully.

User context:
- Name: ${userName || 'เพื่อน'}
- Energy level: ${energy || 'okay'}
- Pending tasks: ${tasks.filter((t) => !t.completed).length}

Behavior Guidelines:
1. Flexible & Intelligent Depth:
   - If the user asks for a task breakdown, plan, explanation, writing, coding, or deep advice: Provide a rich, structured, comprehensive, and practical answer without artificial brevity limits. Use bullet points or steps when helpful.
   - If the user is overwhelmed, anxious, or just chatting briefly: Be warm, calming, reassuring, and give actionable tiny steps without lecturing.
   - You can answer ANY question, discuss any topic, brainstorm ideas, draft content, and help solve problems thoroughly.
2. Tone: Warm, natural, friendly Thai (สุภาพ เป็นกันเอง มีความเข้าอกเข้าใจสูง).
3. No toxic positivity. Acknowledge real friction, cognitive overload, and emotions.`;

          // In Gemini API, conversation turns must alternate and the first message MUST have role 'user'
          const contents: any[] = [];
          const validHistory = messages.filter((m) => m.id !== 'welcome');
          
          // Take recent turns, ensuring we start with a user message
          let startIdx = Math.max(0, validHistory.length - 6);
          while (startIdx < validHistory.length && validHistory[startIdx].role !== 'user') {
            startIdx++;
          }
          
          for (let i = startIdx; i < validHistory.length; i++) {
            contents.push({
              role: validHistory[i].role === 'user' ? 'user' : 'model',
              parts: [{ text: validHistory[i].text }],
            });
          }

          // Append current user message
          contents.push({
            role: 'user',
            parts: [{ text: userText }],
          });

          // Try gemini-3.8-flash as requested by Google API, falling back to gemini-2.5-flash if needed
          let response: any;
          try {
            response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents,
              config: {
                systemInstruction,
              },
            });
          } catch (modelErr: any) {
            if (modelErr?.message?.includes('404') || modelErr?.message?.includes('not found')) {
              response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents,
                config: {
                  systemInstruction,
                },
              });
            } else {
              throw modelErr;
            }
          }

          const reply = response.text || 'น้อง Cloudy อยู่ตรงนี้เสมอ ค่อยๆ ทำทีละก้าวนะครับ';
          const botMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, botMsg]);
          return;
        } catch (directErr: any) {
          console.error('Direct client Gemini call failed:', directErr);
          const errMsg = directErr?.message || String(directErr);
          throw new Error(`Gemini ตอบกลับไม่ได้: ${errMsg}`);
        }
      }

      // 2. Try proxy /api/chat
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          userApiKey: userApiKey || undefined,
          userContext: {
            name: userName,
            energy,
            taskCount: tasks.filter((t) => !t.completed).length,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: data.reply || 'ผมเข้าใจแล้วครับ ค่อยๆ ก้าวไปทีละ 1 อย่างนะ',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        return;
      }

      // 3. Built-in smart conversational fallback if offline or non-proxy host
      const lower = userText.toLowerCase();
      let fallbackText = '';
      if (!userApiKey) {
        fallbackText = `💡 ตอนนี้ยังไม่ได้ใส่ Gemini API Key ในหน้าตั้งค่า (Settings) ครับ 

น้อง Cloudy จึงทำงานในโหมด Offline สำรอง:
- ถ้าต้องการให้ตอบคำถามได้อิสระ จัดการงานเชิงลึก ร่างบทความ หรือปรึกษาได้แบบเต็มพลัง Gemini 2.5
👉 กรุณาไปที่ **Settings -> Gemini AI API Key** แล้วใส่คีย์ฟรีจาก Google AI Studio นะครับ!`;
      } else if (lower.includes('คิดวน') || lower.includes('เริ่มไม่ได้') || lower.includes('ตัน') || lower.includes('กังวล')) {
        fallbackText = `น้อง Cloudy เข้าใจเลยครับ เวลาสมองคิดวน มันเหมือนเปิดแท็บเยอะเกินไปจนเครื่องค้าง ลองทิ้งภาพปลายทางไว้ก่อน แล้วเลือกงานที่ง่ายที่สุดเพียง "1 ก้าวเล็กๆ ใน 2 นาทีแรก" พอทำเสร็จสมองจะเริ่มโล่งขึ้นทันทีเลยครับ`;
      } else if (lower.includes('ย่อยงาน') || lower.includes('งานใหญ่') || lower.includes('โปรเจกต์') || lower.includes('รายงาน')) {
        fallbackText = `ได้เลยครับ งานใหญ่ทำให้เรากลัวเป็นเรื่องปกติ เคล็ดลับคือหั่นเป็น 3 ช่วง: 1) เปิดไฟล์เปล่าแล้วพิมพ์ชื่อหัวข้อ 2) ร่างหัวข้อย่อย 3 ข้อแบบไม่ต้องกลัวผิด 3) จัดการทีละหัวข้อ ลองเริ่มแค่ข้อแรก 3 นาทีก่อนครับ`;
      } else if (lower.includes('หมดแรง') || lower.includes('เหนื่อย') || lower.includes('เพลีย') || lower.includes('ขี้เกียจ')) {
        fallbackText = `ถ้าวันนี้หมดแรง ไม่ต้องฝืนทำเรื่องยากเลยครับ จิบน้ำสักแก้ว แล้วเลือกทำเรื่องเบาๆ เช่น เช็คของ จัดโต๊ะ 1 มุม หรือแค่นั่งพักสัก 5 นาทีก็ถือว่าดูแลตัวเองได้ดีมากแล้วครับ`;
      } else {
        fallbackText = `น้อง Cloudy รับฟังอยู่เสมอนะครับ ไม่ว่าภาระงานจะเยอะแค่ไหน เราไม่ต้องทำทุกอย่างให้เสร็จพร้อมกัน แค่โฟกัสทีละอย่างตามพลังงานที่มี น้อง Cloudy เชื่อมั่นในตัวคุณครับ`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: `เกิดข้อผิดพลาดในการเรียกใช้ Gemini API: ${err.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'} (กรุณาตรวจสอบการตั้งค่า Gemini API Key ในหน้าตั้งค่า)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-[#FAF8F5] dark:bg-[#1E1E1E] rounded-t-[32px] sm:rounded-3xl w-full max-w-lg h-[92vh] sm:h-[650px] shadow-2xl border border-[#ECE6DB] dark:border-[#333333] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Top Header */}
        <div className="px-4 py-3 border-b border-[#ECE6DB] dark:border-[#2C2C2C] bg-white dark:bg-[#252525] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF0E8] dark:bg-[#2C332A] border border-[#CFDFCB] dark:border-[#3C4A37] flex items-center justify-center p-0.5 overflow-hidden">
              <PixelCloud8Bit pose="idle" size="sm" interactive={false} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-[#2C2C24] dark:text-white font-heading">
                  น้อง Cloudy AI Agent
                </h3>
                <span className="px-1.5 py-0.2 rounded-md bg-[#EAE8F5] text-[#5C4D82] text-[9px] font-bold">
                  Gemini 3.8 Flash
                </span>
                {(() => {
                  const key = (typeof window !== 'undefined' ? localStorage.getItem('freakout_gemini_api_key') : '') || '';
                  return key ? (
                    <span className="px-1.5 py-0.2 rounded-md bg-[#EBF0E8] text-[#3B5433] dark:bg-[#2C332A] dark:text-[#88B07D] text-[9px] font-bold">
                      ● เชื่อมต่อ API แล้ว
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded-md bg-[#FDECE8] text-[#C23A25] text-[9px] font-bold">
                      ● ยังไม่ใส่ API Key
                    </span>
                  );
                })()}
              </div>
              <p className="text-[10px] text-[#7A786C] dark:text-[#A0A0A0]">
                ผู้ช่วยส่วนตัวช่วยย่อยงานและสยบ Overthinking
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#8A887A] hover:text-[#2C2C24] hover:bg-[#F2ECE1] dark:hover:bg-[#333333] transition cursor-pointer"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-[#F6F2E9] dark:bg-[#202020] border-b border-[#EAE4D9] dark:border-[#2C2C2C] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => handleQuickPrompt('ตอนนี้คิดวนจนเริ่มงานไม่ได้ ช่วยจัดลำดับให้หน่อย')}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#2A2A2A] border border-[#E0D9CC] dark:border-[#3A3A3A] text-[11px] font-medium text-[#2C2C24] dark:text-white whitespace-nowrap hover:bg-[#EDE7DA] transition cursor-pointer"
          >
            คิดวนจนเริ่มไม่ได้
          </button>
          <button
            type="button"
            onClick={() => handleQuickPrompt('ช่วยย่อยงานชิ้นใหญ่ให้เป็นก้าวละ 2 นาทีที')}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#2A2A2A] border border-[#E0D9CC] dark:border-[#3A3A3A] text-[11px] font-medium text-[#2C2C24] dark:text-white whitespace-nowrap hover:bg-[#EDE7DA] transition cursor-pointer"
          >
            ช่วยย่อยงานก้อนใหญ่
          </button>
          <button
            type="button"
            onClick={() => handleQuickPrompt('หมดแรงมาก วันนี้ทำอะไรเบาๆ ได้บ้าง')}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#2A2A2A] border border-[#E0D9CC] dark:border-[#3A3A3A] text-[11px] font-medium text-[#2C2C24] dark:text-white whitespace-nowrap hover:bg-[#EDE7DA] transition cursor-pointer"
          >
            หมดแรง แนะนำงานเบา
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-[#EBF0E8] dark:bg-[#2C332A] flex items-center justify-center shrink-0 mt-0.5 border border-[#CFDFCB] dark:border-[#3C4A37]">
                    <Bot className="w-3.5 h-3.5 text-[#3B5433] dark:text-[#88B07D]" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-[#6C7764] text-white rounded-tr-xs'
                      : 'bg-white dark:bg-[#282828] text-[#2C2C24] dark:text-white border border-[#E8E2D5] dark:border-[#383838] rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      isUser ? 'text-white/70' : 'text-[#8A887A] dark:text-[#777777]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-[#6C7764]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#6C7764]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 justify-start items-center">
              <div className="w-7 h-7 rounded-xl bg-[#EBF0E8] dark:bg-[#2C332A] flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-[#3B5433]" />
              </div>
              <div className="px-3 py-2 rounded-2xl bg-white dark:bg-[#282828] border border-[#E8E2D5] dark:border-[#383838] text-xs text-[#7A786C] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 animate-spin text-[#6C7764]" />
                <span>น้อง Cloudy กำลังเรียบเรียงความคิด...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Footer */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white dark:bg-[#252525] border-t border-[#ECE6DB] dark:border-[#2C2C2C] flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์บอกงานหรือความกังวล..."
            className="flex-1 px-3.5 py-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#1E1E1E] border border-[#E2DACB] dark:border-[#383838] text-xs text-[#2C2C24] dark:text-white placeholder:text-[#8A887A] outline-none focus:border-[#6C7764]"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-[#6C7764] hover:bg-[#586350] active:scale-95 disabled:opacity-40 text-white transition cursor-pointer shadow-xs shrink-0"
            title="ส่งข้อความ"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
