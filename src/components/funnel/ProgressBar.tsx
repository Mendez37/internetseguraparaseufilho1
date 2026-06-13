export function ProgressBar({ value, sectionLabel }: { value: number; sectionLabel?: string }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-2 font-medium tracking-wide">
        <span className="text-neon">ANÁLISE EM ANDAMENTO</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon to-primary transition-all duration-500 glow-blue"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground italic">
          Estamos avaliando o nível de segurança digital da sua família.
        </p>
        {sectionLabel && (
          <span className="ml-2 whitespace-nowrap rounded-full border border-neon/40 bg-neon/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon">
            {sectionLabel}
          </span>
        )}
      </div>
    </div>
  );
}
