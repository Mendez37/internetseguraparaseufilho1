import { useEffect, useState } from "react";

export function Countdown({ minutes = 15 }: { minutes?: number }) {
  const [seconds, setSeconds] = useState(minutes * 60);
  useEffect(() => {
    const i = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(i);
  }, []);
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 px-5 py-3 glow-red">
      <span className="text-sm font-semibold text-destructive tracking-wide">⏳ OFERTA EXPIRA EM</span>
      <span className="font-display text-2xl font-bold text-foreground tabular-nums animate-blink">
        {m}:{s}
      </span>
    </div>
  );
}
