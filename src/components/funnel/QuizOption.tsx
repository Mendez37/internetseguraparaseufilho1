import { cn } from "@/lib/utils";

export function QuizOption({
  label,
  onClick,
  index,
}: {
  label: string;
  onClick: () => void;
  index: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full text-left rounded-xl border border-border bg-card/60 backdrop-blur",
        "px-5 py-4 text-base md:text-lg font-medium text-foreground",
        "transition-all duration-200 hover:border-neon hover:bg-card hover:-translate-y-0.5 hover:glow-blue",
        "active:scale-[0.98] animate-fade-up"
      )}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="text-neon opacity-0 group-hover:opacity-100 transition-opacity">→</span>
      </span>
    </button>
  );
}
