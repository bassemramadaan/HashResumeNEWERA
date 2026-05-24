import { useEffect, useRef, useState } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";

// ── Config ──────────────────────────────────────────────
const BASE_COUNT   = 3500;   // ← غيّر ده لعدد الـ CVs الحقيقي أو حسب ما تريد
const ANIM_DURATION = 1800;  // مدة الـ count-up animation بالـ ms
// ────────────────────────────────────────────────────────

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, duration: number) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;

    const step = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.floor(easeOut(progress) * target));
      
      if (progress < 1) {
        rafId.current = requestAnimationFrame(step);
      }
    };

    rafId.current = requestAnimationFrame(step);
    
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [target, duration]);

  return value;
}

// Localized initials for avatars
const AVATARS_AR = [
  { initials: "أح", bg: "#FFDDD6", color: "#993C1D" },
  { initials: "سم", bg: "#D6E8FF", color: "#185FA5" },
  { initials: "مع", bg: "#D6F5E8", color: "#0F6E56" },
  { initials: "نر", bg: "#F5D6FF", color: "#534AB7" },
  { initials: "عم", bg: "#FFF3D6", color: "#854F0B" },
];

const AVATARS_EN = [
  { initials: "AH", bg: "#FFDDD6", color: "#993C1D" },
  { initials: "SM", bg: "#D6E8FF", color: "#185FA5" },
  { initials: "MA", bg: "#D6F5E8", color: "#0F6E56" },
  { initials: "NR", bg: "#F5D6FF", color: "#534AB7" },
  { initials: "OM", bg: "#FFF3D6", color: "#854F0B" },
];

export default function LiveCounter({ className = "" }: { className?: string }) {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  // يزيد الـ count تلقائياً كل شوية عشان يبدو حي
  const [liveCount, setLiveCount] = useState(BASE_COUNT);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {                    // 30% احتمال كل 5 ثواني
        setLiveCount((c) => c + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const displayed = useCountUp(liveCount, ANIM_DURATION);

  const avatars = isAr ? AVATARS_AR : AVATARS_EN;
  const formattedCount = isAr 
    ? displayed.toLocaleString("ar-EG")
    : displayed.toLocaleString("en-US");

  const labelText = isAr 
    ? "سيرة ذاتية تم إنشاؤها" 
    : language === "fr"
    ? "CVs créés"
    : "Resumes Created";

  return (
    <div
      className={className}
      dir={isAr ? "rtl" : "ltr"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        background: "rgba(255,77,45,0.07)",
        border: "1px solid rgba(255,77,45,0.18)",
        borderRadius: "99px",
        padding: isAr ? "6px 8px 6px 14px" : "6px 14px 6px 8px",
        userSelect: "none",
      }}
    >
      {/* Avatar stack */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {avatars.map((av, i) => (
          <div
            key={i}
            title={av.initials}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: av.bg,
              color: av.color,
              fontSize: 10,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid white",
              marginLeft: isAr ? 0 : (i === 0 ? 0 : -8),
              marginRight: isAr ? (i === 0 ? 0 : -8) : 0,
              zIndex: avatars.length - i,
              position: "relative",
            }}
          >
            {av.initials}
          </div>
        ))}
      </div>

      {/* نص + عداد */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {/* النقطة الخضراء الحية */}
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#22c55e",
            display: "inline-block",
            animation: "pulse-dot 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#FF4D2D",
            minWidth: 38,
            textAlign: isAr ? "left" : "right",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          +{formattedCount}
        </span>
        <span style={{ fontSize: 12, color: "#666", whiteSpace: "nowrap" }}>
          {labelText}
        </span>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
}
