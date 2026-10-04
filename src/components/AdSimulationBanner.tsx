import React, { useState } from 'react';
import { Sparkles, Crown, X, Play, Video, Gift, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdSimulationBannerProps {
  isProUser: boolean;
  onOpenPricing: () => void;
  onRewardGranted: () => void;
}

export const AdSimulationBanner: React.FC<AdSimulationBannerProps> = ({
  isProUser,
  onOpenPricing,
  onRewardGranted,
}) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [adFinished, setAdFinished] = useState(false);

  // If user is Pro, ads are completely hidden!
  if (isProUser) return null;

  const startWatchAd = () => {
    setIsWatchingAd(true);
    setAdFinished(false);
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdFinished(true);
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 },
          });
          onRewardGranted();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <>
      {/* Banner */}
      <div className="bg-[#FAF8F5] border border-[#E2DACB] rounded-3xl p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF4E0] border border-[#F4E1BD] flex items-center justify-center shrink-0 text-xl">
            🧋
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#2C2C24]">ชานมไข่มุก Lamun x Freak Out</span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#F2EEE9] text-[#7A786C] font-semibold">
                ผู้สนับสนุน (Ad)
              </span>
            </div>
            <p className="text-[11px] text-[#7A786C] mt-0.5">
              เติมความหวานลดความเครียดช่วงสอบ ลด 15% ทันทีเมื่อโชว์หน้าแอพ Freak Out ที่หน้าร้าน
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={startWatchAd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F2FA] hover:bg-[#D9EAF5] text-[#2C4A6F] font-bold border border-[#D0E2EE] transition active:scale-95 cursor-pointer text-[11px]"
          >
            <Video className="w-3.5 h-3.5 text-[#3A78B8]" />
            <span>ดูคลิป 5 วิ (+3 Smart Pick ฟรี)</span>
          </button>

          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FDECE8] hover:bg-[#F9DCD5] text-[#9A4A38] font-bold border border-[#F6D7D0] transition active:scale-95 cursor-pointer text-[11px]"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>ปิดโฆษณา (Pro)</span>
          </button>
        </div>
      </div>

      {/* Rewarded Ad Simulation Modal */}
      {isWatchingAd && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF8F5] rounded-3xl w-full max-w-[320px] p-6 text-center border border-[#E2DACB] shadow-2xl relative">
            {!adFinished ? (
              <div className="space-y-4 py-4">
                <div className="w-16 h-16 rounded-3xl bg-[#FFF4E0] border-2 border-[#F4E1BD] mx-auto flex items-center justify-center text-3xl animate-bounce">
                  🧋
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2C2C24]">กำลังชมคลิปสปอนเซอร์...</h3>
                  <p className="text-xs text-[#7A786C] mt-1">
                    ชานมไข่มุกอารมณ์ดี หวานน้อย คลายกังวล
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE8F5] text-[#5C4D82] text-xs font-bold">
                  <Play className="w-3 h-3 fill-current" />
                  <span>เหลืออีก {countdown} วินาที</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="w-16 h-16 rounded-3xl bg-[#E2ECE0] border-2 border-[#CFDFCB] mx-auto flex items-center justify-center text-3xl">
                  🎉
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2C2C24]">รับรางวัลสำเร็จ!</h3>
                  <p className="text-xs text-[#3B5433] font-semibold mt-1">
                    คุณได้รับโควต้า AI Smart Pick เพิ่ม 3 ครั้งเรียบร้อยแล้ว
                  </p>
                </div>
                <button
                  onClick={() => setIsWatchingAd(false)}
                  className="w-full py-2.5 rounded-2xl bg-[#828D7A] hover:bg-[#6C7764] text-white font-bold text-xs transition cursor-pointer"
                >
                  ตกลง ขอบคุณครับ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
