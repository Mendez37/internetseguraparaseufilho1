export function ProgressBar({ value }: { value: number }) {
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
      <p className="mt-2 text-xs text-muted-foreground italic">
        Estamos avaliando o nível de segurança digital da sua família.
      </p>
    </div>
  );
}
