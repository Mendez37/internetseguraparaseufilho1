import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Lock, AlertTriangle, ShieldAlert, Check, Star, ChevronRight, Eye, Users, Clock, Zap } from "lucide-react";
import { QuizOption } from "@/components/funnel/QuizOption";
import { ProgressBar } from "@/components/funnel/ProgressBar";
import { Countdown } from "@/components/funnel/Countdown";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Guia Internet Segura Para Seus Filhos" },
      { name: "description", content: "Descubra em 2 minutos se seu filho está realmente seguro na internet. Quiz gratuito + guia completo de proteção digital." },
      { property: "og:title", content: "Você sabe o que seu filho faz na internet?" },
      { property: "og:description", content: "Quiz gratuito de segurança digital infantil. Descubra os riscos ocultos em 2 minutos." },
    ],
  }),
  component: Funnel,
});

type Step =
  | "news"
  | "intro"
  | "name"
  | "q1" | "q2" | "q3"
  | "break1"
  | "q4" | "q5" | "q6"
  | "break2"
  | "q7" | "q8" | "q9"
  | "break3"
  | "loading"
  | "result"
  | "sales";

const QUIZ_STEPS: Step[] = ["q1","q2","q3","q4","q5","q6","q7","q8","q9"];

// risco: quanto maior, mais "exposto" — usado para o score final
const QUESTIONS: Record<string, { title: (name: string) => string; options: string[]; risk: number[] }> = {
  q1: { title: (n) => `${n} usa celular sem supervisão?`, options: ["📱 Todos os dias","⏰ Frequentemente","👀 Às vezes","🛡️ Quase nunca"], risk: [3,2,1,0] },
  q2: { title: () => `Você sabe com quem ele(a) conversa online?`, options: ["✅ Sei exatamente","🤔 Tenho uma ideia","⚠️ Não tenho certeza","🚨 Não faço ideia"], risk: [0,1,2,3] },
  q3: { title: () => `Ele(a) possui redes sociais?`, options: ["📲 Sim, várias","👥 Apenas algumas","🔎 Apenas uma","🛡️ Não possui"], risk: [3,2,1,0] },
  q4: { title: () => "Você verifica as configurações de privacidade dos aplicativos?", options: ["🔐 Sempre","👀 Às vezes","⚠️ Raramente","🚫 Nunca"], risk: [0,1,2,3] },
  q5: { title: (n) => `${n} já recebeu mensagens de desconhecidos?`, options: ["🚨 Sim","🤔 Talvez","⚠️ Não sei","✅ Não"], risk: [3,2,2,0] },
  q6: { title: () => "Você utiliza algum tipo de controle parental?", options: ["🛡️ Sim","🔧 Já tentei","📘 Conheço mas não uso","🚫 Não uso"], risk: [0,1,2,3] },
  q7: { title: () => "Como você gostaria de se sentir em relação à internet?", options: ["😌 Tranquilo","💪 Confiante","🛡️ Seguro","🎯 No controle"], risk: [0,0,0,0] },
  q8: { title: () => "O que seria mais importante para você?", options: ["🚨 Evitar perigos","🔐 Proteger a privacidade","⏳ Controlar o tempo de tela","✅ Tudo isso"], risk: [0,0,0,0] },
  q9: { title: () => "Você gostaria de aprender estratégias simples para proteger seus filhos?", options: ["🛡️ Com certeza","✅ Sim","🤔 Talvez","📘 Preciso conhecer"], risk: [0,0,0,0] },
};

const SECTION_LABELS: Record<string, string> = {
  q1: "Hábitos de Uso", q2: "Hábitos de Uso", q3: "Hábitos de Uso",
  q4: "Privacidade & Riscos", q5: "Privacidade & Riscos", q6: "Privacidade & Riscos",
  q7: "Seus Objetivos", q8: "Seus Objetivos", q9: "Seus Objetivos",
};

const SECTION_INTROS: Record<string, string> = {
  q4: "✅ Etapa \"Hábitos de Uso\" concluída. Agora vamos entender como está a privacidade e a exposição a riscos.",
  q7: "✅ Etapa \"Privacidade & Riscos\" concluída. Faltam só 3 perguntas — e elas são sobre o que você quer pra sua família.",
};

const CHECKOUT_URL = "https://pay.kirvano.com/ccf64799-e255-4be5-baf8-8c79f6196ce8";
const PRODUCT_MOCKUP_URL = "/__l5e/assets-v1/4cc41eae-daa7-43af-b33f-149bacd357fe/guia-internet-segura-mockup.png";

function Funnel() {
  const [step, setStep] = useState<Step>("news");
  const [childName, setChildName] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const displayName = childName.trim() || "seu filho";

  const quizIndex = QUIZ_STEPS.indexOf(step as Step);
  const progress = quizIndex >= 0 ? ((quizIndex + 1) / QUIZ_STEPS.length) * 100 : 0;

  const riskScore = QUIZ_STEPS.slice(0, 6).reduce((acc, key) => {
    const ansIndex = answers[key];
    if (ansIndex === undefined) return acc;
    return acc + QUESTIONS[key].risk[ansIndex];
  }, 0);
  // máximo possível: q1-q6, risco máximo 3 cada = 18
  const riskPct = Math.round((riskScore / 18) * 100);
  const riskLevel: "ALTO" | "MÉDIO" | "BAIXO" = riskPct >= 55 ? "ALTO" : riskPct >= 25 ? "MÉDIO" : "BAIXO";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,184,255,0.15),transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl px-5 py-8 md:py-14">
        {step === "news" && <NewsIntro onContinue={() => setStep("intro")} />}

        {step === "intro" && <Intro onStart={() => setStep("name")} />}

        {step === "name" && (
          <NameCapture
            value={childName}
            onChange={setChildName}
            onContinue={() => setStep("q1")}
          />
        )}

        {quizIndex >= 0 && (
          <QuizScreen
            step={step as keyof typeof QUESTIONS}
            progress={progress}
            childName={displayName}
            sectionLabel={SECTION_LABELS[step]}
            sectionIntro={SECTION_INTROS[step]}
            onAnswer={(idx) => {
              setAnswers((prev) => ({ ...prev, [step]: idx }));
              const nextMap: Record<string, Step> = {
                q1: "q2", q2: "q3", q3: "break1",
                q4: "q5", q5: "q6", q6: "break2",
                q7: "q8", q8: "q9", q9: "break3",
              };
              setStep(nextMap[step]);
            }}
          />
        )}

        {step === "break1" && (
          <Break
            icon={<AlertTriangle className="h-14 w-14 text-destructive" />}
            badge="⚠️ ATENÇÃO"
            title={`Enquanto você responde isso, ${displayName} pode estar online agora`}
            body="Milhares de crianças são expostas diariamente a golpes, cyberbullying, conteúdos inadequados e pessoas mal-intencionadas através da internet — muitas vezes sem que os pais percebam."
            cta="VER MAIS"
            onContinue={() => setStep("q4")}
            tone="alert"
          />
        )}

        {step === "break2" && <BreakShock childName={displayName} onContinue={() => setStep("q7")} />}

        {step === "break3" && (
          <Break
            icon={<Users className="h-14 w-14 text-neon" />}
            badge="VOCÊ NÃO ESTÁ SOZINHO"
            title="Milhares de pais já tomaram esta decisão"
            body="Milhares de pais estão buscando maneiras de proteger seus filhos dos riscos digitais que aumentam todos os dias. A maioria só percebe o problema depois que algo acontece. 'Eu não fazia ideia de quase nada disso até fazer esse teste' — relato comum entre os pais que chegam até aqui."
            cta="VER RESULTADO"
            onContinue={() => setStep("loading")}
            tone="neon"
          />
        )}

        {step === "loading" && <LoadingResult onDone={() => setStep("result")} />}

        {step === "result" && (
          <Result
            childName={displayName}
            riskPct={riskPct}
            riskLevel={riskLevel}
            answers={answers}
            onContinue={() => setStep("sales")}
          />
        )}

        {step === "sales" && <Sales childName={displayName} />}
      </div>
    </main>
  );
}

/* ---------- NEWS (estilo portal) ---------- */
function NewsIntro({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="animate-fade-up">
      <div className="flex items-center justify-between border-b border-border pb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <span className="text-foreground">Portal Família & Tecnologia</span>
        <span>Seção: Comportamento</span>
      </div>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-destructive">
        <span className="h-2 w-2 rounded-full bg-destructive animate-pulse-red" />
        ALERTA AOS PAIS
      </div>

      <h1 className="mt-5 text-2xl font-bold leading-tight md:text-4xl">
        Pesquisa revela: 72% das crianças acessam a internet sem qualquer supervisão dos pais
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Por Redação · Comportamento Digital · Atualizado hoje</p>

      <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
        <p>
          Um levantamento nacional com mais de 2,4 mil crianças e adolescentes mostrou números que preocupam especialistas:
          a maioria dos jovens passa horas online diariamente, muitas vezes sem que os responsáveis saibam exatamente o quê
          estão acessando ou com quem estão conversando.
        </p>
        <p>
          Entre os dados levantados, chama atenção o número de pais que <span className="font-semibold text-foreground">acreditam
          que seus filhos estão seguros</span> — enquanto, na prática, mensagens de desconhecidos, conteúdos inadequados e
          jogos com chats abertos fazem parte da rotina de boa parte dessas crianças.
        </p>
        <p>
          Para especialistas em segurança digital infantil, o problema não é falta de cuidado dos pais — é falta de
          informação sobre <span className="font-semibold text-foreground">onde estão os riscos reais</span> e como
          identificá-los antes que se tornem um problema.
        </p>
        <p className="font-semibold text-foreground">
          Diante desse cenário, foi desenvolvido um teste rápido — gratuito — para ajudar os pais a entenderem, em poucos
          minutos, o nível de exposição digital dos próprios filhos.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onContinue}
          className="group relative w-full max-w-md rounded-xl bg-gradient-to-r from-neon to-primary px-6 py-6 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow md:px-8 md:py-5 md:text-lg"
        >
          FAZER O TESTE GRATUITO AGORA
          <ChevronRight className="ml-2 inline h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}

/* ---------- NAME CAPTURE ---------- */
function NameCapture({
  value, onChange, onContinue,
}: { value: string; onChange: (v: string) => void; onContinue: () => void }) {
  return (
    <section className="animate-fade-up text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-neon/50 bg-card/60">
        <Users className="h-10 w-10 text-neon" />
      </div>
      <h2 className="mt-6 text-2xl font-bold md:text-4xl">
        Antes de começar, qual o nome do seu filho ou filha?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        Vamos usar o nome para personalizar a análise e o resultado final.
      </p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: João, Maria..."
        className="mx-auto mt-6 block w-full max-w-sm rounded-xl border border-border bg-card/60 px-5 py-4 text-center text-lg text-foreground outline-none focus:border-neon"
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) onContinue();
        }}
      />
      <button
        onClick={onContinue}
        disabled={!value.trim()}
        className="group relative mt-6 w-full max-w-sm rounded-xl bg-gradient-to-r from-neon to-primary px-6 py-5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow disabled:opacity-40 md:text-base"
      >
        COMEÇAR ANÁLISE
        <ChevronRight className="ml-2 inline h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>
    </section>
  );
}

/* ---------- INTRO ---------- */
function Intro({ onStart }: { onStart: () => void }) {
  return (
    <section className="animate-fade-up">
      <div className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-destructive">
        <span className="h-2 w-2 rounded-full bg-destructive animate-pulse-red" />
        ALERTA DE SEGURANÇA DIGITAL
      </div>

      <h1 className="mt-6 text-center text-3xl font-bold leading-[1.05] md:text-6xl">
        Você Sabe o Que Seu Filho{" "}
        <span className="text-neon text-glow-blue">Faz na Internet</span>{" "}
        Quando Você Não Está Olhando?
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground md:text-xl">
        Em apenas <span className="font-semibold text-foreground">2 minutos</span> descubra se seu filho está realmente seguro ou{" "}
        <span className="font-semibold text-destructive">exposto aos perigos ocultos</span> da internet.
      </p>

      <div className="mt-10 flex justify-center">
        <div className="relative animate-float">
          <div className="absolute inset-0 rounded-full bg-neon/30 blur-3xl" />
          <Shield className="relative h-32 w-32 text-neon" strokeWidth={1.2} />
          <Lock className="absolute inset-0 m-auto h-12 w-12 text-foreground" strokeWidth={2} />
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-base text-muted-foreground md:text-lg">
        Mais de <span className="font-bold text-foreground">90% das crianças e adolescentes</span> acessam a internet diariamente.
        A maioria dos pais acredita que seus filhos estão seguros.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          onClick={onStart}
          className="group relative w-full max-w-md rounded-xl bg-gradient-to-r from-neon to-primary px-6 py-6 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow md:px-8 md:py-5 md:text-lg"
        >
          QUERO DESCOBRIR AGORA
          <ChevronRight className="ml-2 inline h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-neon" /> Gratuito</li>
          <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-neon" /> Resultado imediato</li>
          <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-neon" /> Leva apenas 2 minutos</li>
        </ul>
      </div>
    </section>
  );
}

/* ---------- QUIZ ---------- */
function QuizScreen({
  step,
  progress,
  childName,
  sectionLabel,
  sectionIntro,
  onAnswer,
}: {
  step: keyof typeof QUESTIONS;
  progress: number;
  childName: string;
  sectionLabel?: string;
  sectionIntro?: string;
  onAnswer: (index: number) => void;
}) {
  const q = QUESTIONS[step];
  return (
    <section className="animate-fade-up">
      <ProgressBar value={progress} sectionLabel={sectionLabel} />
      {sectionIntro && (
        <p className="mt-4 rounded-xl border border-neon/30 bg-neon/5 px-4 py-3 text-sm italic text-muted-foreground animate-fade-up">
          {sectionIntro}
        </p>
      )}
      <div className="mt-8 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur md:p-10">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neon">
          <Eye className="h-4 w-4" /> Pergunta
        </div>
        <h2 className="text-2xl font-bold leading-tight md:text-3xl">{q.title(childName)}</h2>
        <div className="mt-8 grid gap-3">
          {q.options.map((opt, i) => (
            <QuizOption key={opt} label={opt} index={i} onClick={onAnswer} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- BREAK (autoridade / prova social) ---------- */
function Break({
  icon, badge, title, body, cta, onContinue, tone,
}: {
  icon: React.ReactNode;
  badge: string;
  title: string;
  body: string;
  cta: string;
  onContinue: () => void;
  tone: "alert" | "neon";
}) {
  const isAlert = tone === "alert";
  return (
    <section className="animate-fade-up text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border bg-card/60 backdrop-blur"
        style={{ borderColor: isAlert ? "rgba(255,59,48,0.5)" : "rgba(0,184,255,0.5)" }}>
        {icon}
      </div>
      <div className={`mx-auto mt-6 w-fit rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest ${
        isAlert ? "border-destructive/50 bg-destructive/10 text-destructive" : "border-neon/50 bg-neon/10 text-neon"
      }`}>
        {badge}
      </div>
      <h2 className="mx-auto mt-5 max-w-2xl text-2xl font-bold leading-tight md:text-5xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">{body}</p>
      <button
        onClick={onContinue}
        className="mt-10 w-full max-w-sm rounded-xl bg-gradient-to-r from-neon to-primary px-6 py-5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] animate-pulse-glow md:w-auto md:px-10 md:py-4 md:text-base"
      >
        {cta} <ChevronRight className="ml-1 inline h-5 w-5" />
      </button>
    </section>
  );
}

/* ---------- BREAK 2 - SHOCK ---------- */
function BreakShock({ childName, onContinue }: { childName: string; onContinue: () => void }) {
  return (
    <section className="animate-fade-up -mx-5 rounded-3xl border border-destructive/40 bg-black/80 p-8 text-center backdrop-blur md:p-14">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-destructive bg-destructive/10 animate-pulse-red">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="mt-6 text-4xl font-black leading-none tracking-tight text-destructive text-glow-red md:text-7xl">
        🚨 ATENÇÃO
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-lg font-semibold text-foreground md:text-2xl">
        {childName} pode estar em perigo neste exato momento.
      </p>
      <div className="mx-auto mt-8 max-w-xl space-y-4 text-left text-base text-muted-foreground md:text-lg">
        <p>Eu sei que você jamais gostaria de receber uma ligação da escola sobre ele(a).</p>
        <p>Ou descobrir tarde demais que ele(a) foi vítima de cyberbullying.</p>
        <p>Ou perceber que ele(a) teve contato com pessoas perigosas online.</p>
        <p className="font-semibold text-foreground">Mas a verdade é simples:</p>
        <p className="border-l-2 border-neon pl-4 italic text-foreground">
          A segurança digital de {childName} depende das decisões tomadas hoje.
        </p>
      </div>
      <button
        onClick={onContinue}
        className="mt-10 w-full max-w-sm rounded-xl bg-destructive px-6 py-5 text-sm font-bold uppercase tracking-wide text-destructive-foreground transition-transform hover:scale-[1.02] glow-red md:w-auto md:px-8 md:py-4 md:text-base"
      >
        QUERO PROTEGER {childName.toUpperCase()}
      </button>
    </section>
  );
}

/* ---------- LOADING RESULT ---------- */
function LoadingResult({ onDone }: { onDone: () => void }) {
  const steps = [
    "Analisando respostas",
    "Avaliando nível de exposição",
    "Gerando resultado",
    "Resultado pronto",
  ];
  const [done, setDone] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => {
      setPct((p) => {
        const next = Math.min(100, p + 2);
        return next;
      });
    }, 60);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (pct >= 100) {
      setDone(4);
      const t = window.setTimeout(onDone, 700);
      return () => window.clearTimeout(t);
    }
    if (pct >= 85) setDone(3);
    else if (pct >= 55) setDone(2);
    else if (pct >= 25) setDone(1);
  }, [pct, onDone]);

  return (
    <section className="animate-fade-up text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-neon/50 bg-card/60 animate-pulse-glow">
        <Zap className="h-12 w-12 text-neon" />
      </div>
      <h2 className="mt-6 text-3xl font-bold md:text-4xl">Processando sua análise</h2>
      <p className="mt-3 text-muted-foreground">Aguarde alguns segundos...</p>

      <div className="mx-auto mt-8 max-w-md">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-gradient-to-r from-neon to-primary glow-blue transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 text-right text-sm text-neon font-medium">{pct}%</div>
      </div>

      <ul className="mx-auto mt-8 max-w-md space-y-3 text-left">
        {steps.map((s, i) => (
          <li key={s} className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
            i < done ? "border-neon/40 bg-neon/5 text-foreground" : "border-border bg-card/40 text-muted-foreground"
          }`}>
            {i < done ? (
              <Check className="h-5 w-5 text-neon" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40 border-t-neon animate-spin" />
            )}
            <span className="font-medium">{s}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- RESULT ---------- */
const FINDINGS: Record<string, (name: string) => string> = {
  q1: (n) => `${n} costuma usar o celular sem supervisão direta.`,
  q2: (n) => `Você não sabe com certeza com quem ${n} conversa online.`,
  q3: (n) => `${n} possui múltiplas redes sociais ativas.`,
  q4: (n) => `As configurações de privacidade dos apps de ${n} raramente são revisadas.`,
  q5: (n) => `${n} já recebeu mensagens de pessoas desconhecidas.`,
  q6: (n) => `Não há controle parental configurado na rotina de ${n}.`,
};

function Result({
  childName, riskPct, riskLevel, answers, onContinue,
}: {
  childName: string;
  riskPct: number;
  riskLevel: "ALTO" | "MÉDIO" | "BAIXO";
  answers: Record<string, number>;
  onContinue: () => void;
}) {
  const findings = (["q1","q2","q3","q5","q6","q4"] as const)
    .filter((k) => (QUESTIONS[k].risk[answers[k] ?? -1] ?? 0) >= 2)
    .slice(0, 3)
    .map((k) => FINDINGS[k](childName));

  const levelColor = riskLevel === "ALTO" ? "text-destructive" : riskLevel === "MÉDIO" ? "text-yellow-500" : "text-green-500";
  const barWidth = Math.max(15, riskPct);

  return (
    <section className="animate-fade-up">
      <div className="rounded-3xl border border-destructive/40 bg-card/60 p-8 backdrop-blur md:p-12">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-destructive">
          <ShieldAlert className="h-5 w-5" /> SUA ANÁLISE FOI CONCLUÍDA
        </div>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">
          ⚠️ A análise de {childName} foi concluída...
        </h2>

        <div className="mt-6 rounded-2xl border border-border bg-deep/60 p-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Nível de exposição de {childName}</span>
            <span className={`font-bold ${levelColor}`}>{riskLevel}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-destructive glow-red" style={{ width: `${barWidth}%` }} />
          </div>
        </div>

        {findings.length > 0 && (
          <div className="mt-6 space-y-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
            <p className="text-sm font-bold uppercase tracking-wider text-destructive">Pontos identificados na sua resposta</p>
            <ul className="space-y-2 text-base text-foreground">
              {findings.map((f) => (
                <li key={f} className="flex gap-2"><span>🚨</span><span>{f}</span></li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 space-y-4 text-lg text-muted-foreground">
          <p>Com base nas suas respostas, identificamos sinais que merecem atenção na rotina digital de {childName}.</p>
          <p>Isso não significa que {childName} esteja correndo perigo neste momento.</p>
          <p>Mas significa que existem riscos que podem passar despercebidos pela maioria dos pais.</p>
          <p className="font-semibold text-foreground">E é exatamente assim que muitos problemas começam.</p>
          <p>Primeiro vem a sensação de segurança.</p>
          <p>Depois vem a surpresa.</p>
          <p className="font-semibold text-destructive">E quando os pais descobrem o que aconteceu, geralmente já é tarde demais.</p>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-neon/30 bg-neon/5 p-5">
          <span className="text-2xl">🎁</span>
          <p className="text-sm text-foreground md:text-base">
            Como agradecimento por completar a análise, preparamos um material gratuito com as primeiras ações que você
            pode tomar hoje para proteger {childName} — disponível na próxima tela, junto com o guia completo.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-neon to-primary px-8 py-5 text-lg font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.01] animate-pulse-glow"
        >
          🛡️ QUERO PROTEGER {childName.toUpperCase()} AGORA <ChevronRight className="ml-1 inline h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

/* ---------- SALES ---------- */
function Sales({ childName }: { childName: string }) {
  const risks = [
    "🚨 Perfis falsos",
    "🚨 Conversas aparentemente inocentes",
    "🚨 Jogos online com desconhecidos",
    "🚨 Vídeos impróprios sugeridos por algoritmos",
    "🚨 Cyberbullying",
    "🚨 Golpes digitais",
    "🚨 Exposição excessiva da vida pessoal",
  ];

  const learnings = [
    "Como identificar comportamentos que podem indicar problemas online",
    "Como conversar sobre segurança digital sem criar conflitos",
    "Como proteger a privacidade dos seus filhos",
    "Como reduzir riscos em redes sociais",
    "Como evitar golpes e contatos perigosos",
    "Como criar regras digitais saudáveis dentro de casa",
    "Como agir antes que o problema aconteça",
  ];

  const bonuses = [
    { title: "📘 Guia Internet Segura Para Seus Filhos", from: "R$97,00", to: "R$37,00", text: "O material principal com orientações práticas para proteger seus filhos dos riscos digitais." },
    { title: "🚨 Checklist: 50 Sinais de Alerta", from: "R$27,00", to: "R$0", text: "Descubra comportamentos que podem indicar exposição a riscos online antes que se tornem um problema sério." },
    { title: "💬 Roteiro de Conversa com Seu Filho", from: "R$19,00", to: "R$0", text: "Saiba exatamente o que dizer para abordar segurança digital sem discussões ou resistência." },
    { title: "📱 Guia por Aplicativo", from: "R$37,00", to: "R$0", text: "Aprenda os principais riscos e cuidados em TikTok, Roblox, Instagram, WhatsApp, YouTube, Discord e outros aplicativos populares." },
  ];

  const testimonials = [
    { text: "Eu achava que meu filho estava seguro porque ficava dentro de casa. Esse guia me mostrou riscos que eu nunca tinha imaginado.", name: "Patrícia M." },
    { text: "Leitura obrigatória para qualquer pai. Simples, prática e extremamente útil.", name: "Rodrigo A." },
    { text: "Depois do guia conversei com minha filha e descobri situações que ela nunca tinha comentado comigo.", name: "Fernanda S." },
  ];

  const advantages = [
    "Linguagem simples",
    "Aplicação imediata",
    "Acesso vitalício",
    "Atualizações futuras",
    "Funciona para qualquer nível de conhecimento",
    "Pode ser lido em poucas horas",
    "Ajuda a prevenir problemas antes que aconteçam",
  ];

  return (
    <article className="animate-fade-up pb-32 md:pb-12">
      <header className="text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-1.5 text-xs font-bold tracking-widest text-destructive">
          <AlertTriangle className="h-3.5 w-3.5" /> LEITURA URGENTE
        </div>
        <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-[1.05] md:text-6xl">
          O Guia Que Está Ajudando Pais a Protegerem Seus Filhos dos{" "}
          <span className="text-neon text-glow-blue">Perigos Ocultos da Internet</span>{" "}
          Antes Que Algo Grave Aconteça
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-xl">
          Descubra como identificar ameaças digitais, evitar exposição a conteúdos inadequados e proteger seus filhos mesmo que você não entenda nada de tecnologia.
        </p>

        <div className="mx-auto mt-7 max-w-2xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-destructive md:px-5 md:py-3">
          <p className="text-xs font-bold leading-snug tracking-wide md:text-sm">
            A maioria dos pais só descobre o perigo depois que algo acontece. Descubra como evitar isso hoje.
          </p>
        </div>
      </header>

      {/* MOCKUP */}
      <div className="relative mx-auto mt-8 flex max-w-2xl justify-center">
        <div className="absolute inset-0 rounded-full bg-neon/30 blur-3xl" />
        <img
          src={PRODUCT_MOCKUP_URL}
          alt="Guia Internet Segura Para Seus Filhos - Capa do ebook"
          width={2000}
          height={2000}
          loading="lazy"
          className="relative w-full max-w-md animate-float drop-shadow-[0_0_45px_rgba(0,184,255,0.45)] md:max-w-xl"
        />
      </div>

      <div className="mt-8 flex justify-center px-1">
        <a
          href={CHECKOUT_URL}
          className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon to-primary px-4 py-5 text-[13px] font-bold uppercase leading-tight tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] animate-pulse-glow md:px-8 md:py-5 md:text-lg"
        >
          <span className="md:hidden">🛡️ PROTEGER MEU FILHO · R$37</span>
          <span className="hidden md:inline">🛡️ QUERO PROTEGER MEU FILHO AGORA</span>
          <ChevronRight className="h-5 w-5 shrink-0" />
        </a>
      </div>

      <section className="mt-16 space-y-5 text-lg leading-relaxed text-muted-foreground md:text-xl">
        <p className="text-foreground">Se você chegou até aqui...</p>
        <p>Provavelmente existe uma preocupação que passa pela sua cabeça de vez em quando.</p>
        <p className="rounded-2xl border border-neon/40 bg-neon/10 p-5 text-center font-semibold text-foreground glow-blue">
          “Será que {childName} está realmente seguro(a) quando está online?”
        </p>
        <p>A verdade é que nenhuma mãe ou pai consegue vigiar uma tela 24 horas por dia.</p>
        <p>E não é por falta de cuidado.</p>
        <p>É porque os perigos digitais evoluíram muito mais rápido do que a maioria das famílias consegue acompanhar.</p>
        <div className="grid gap-3 text-foreground md:grid-cols-3">
          <p className="rounded-xl border border-border bg-card/50 p-4">Enquanto você trabalha...</p>
          <p className="rounded-xl border border-border bg-card/50 p-4">Enquanto está preparando o jantar...</p>
          <p className="rounded-xl border border-border bg-card/50 p-4">Enquanto está dormindo...</p>
        </div>
        <p className="font-semibold text-destructive">{childName} pode estar navegando por ambientes que você nem imagina.</p>
      </section>

      <section className="mt-16 rounded-3xl border border-destructive/40 bg-card/60 p-6 backdrop-blur md:p-10">
        <h2 className="text-2xl font-bold md:text-4xl">O perigo nem sempre parece perigo</h2>
        <div className="mt-6 space-y-4 text-base text-muted-foreground md:text-lg">
          <p>O maior erro dos pais hoje não é deixar o filho usar a internet.</p>
          <p>O erro é acreditar que o perigo é óbvio.</p>
          <p className="text-xl font-bold text-foreground md:text-2xl">Não é.</p>
          <p>Os maiores riscos geralmente chegam disfarçados.</p>
        </div>
        <ul className="mt-6 grid gap-3">
          {risks.map((risk) => (
            <li key={risk} className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-foreground md:text-base">
              {risk}
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-4 text-base text-muted-foreground md:text-lg">
          <p>Muitos pais acreditam que seus filhos saberiam identificar um problema.</p>
          <p>Mas crianças e adolescentes ainda estão aprendendo a reconhecer riscos.</p>
          <p className="font-semibold text-foreground">É por isso que precisam de orientação.</p>
        </div>
        <div className="mt-8 flex justify-center px-1">
          <a
            href={CHECKOUT_URL}
            className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon to-primary px-4 py-5 text-[13px] font-bold uppercase leading-tight tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] animate-pulse-glow md:px-8 md:py-5 md:text-lg"
          >
            <span className="md:hidden">🔒 GARANTIR PROTEÇÃO · R$37</span>
            <span className="hidden md:inline">🔒 QUERO GARANTIR A PROTEÇÃO AGORA</span>
            <ChevronRight className="h-5 w-5 shrink-0" />
          </a>
        </div>
      </section>

      <section className="mt-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-destructive bg-destructive/10 animate-pulse-red">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="mt-6 text-2xl font-black leading-tight text-destructive text-glow-red md:text-5xl">Imagine receber uma ligação da escola sobre {childName}...</h2>
        <div className="mx-auto mt-7 max-w-2xl space-y-4 text-base text-muted-foreground md:text-xl">
          <p>Ele(a) sofreu cyberbullying.</p>
          <p>Ou você descobre que ele(a) passou meses conversando com alguém que fingia ser outra criança.</p>
          <p>Ou percebe que conteúdos impróprios influenciaram comportamentos dele(a) que você não consegue entender.</p>
          <p className="font-bold text-foreground">Nenhum pai acredita que isso vai acontecer com sua família.</p>
          <p className="font-bold text-destructive">Até acontecer.</p>
        </div>
        <div className="mt-8 flex justify-center px-1">
          <a
            href={CHECKOUT_URL}
            className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-5 text-[13px] font-bold uppercase leading-tight tracking-wide text-destructive-foreground transition-transform hover:scale-[1.02] animate-pulse-red md:px-8 md:py-5 md:text-lg"
          >
            <span className="md:hidden">🚨 NÃO QUERO ARRISCAR · R$37</span>
            <span className="hidden md:inline">🚨 NÃO QUERO CORRER ESSE RISCO</span>
            <ChevronRight className="h-5 w-5 shrink-0" />
          </a>
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-neon/40 bg-gradient-to-b from-card/80 to-deep/80 p-6 backdrop-blur glow-blue md:p-10">
        <h2 className="text-center text-2xl font-bold md:text-4xl">A boa notícia</h2>
        <div className="mt-6 grid gap-3 text-base text-foreground md:grid-cols-4 md:text-lg">
          <p className="rounded-xl border border-border bg-card/60 p-4">Você não precisa se tornar especialista em tecnologia.</p>
          <p className="rounded-xl border border-border bg-card/60 p-4">Você só precisa aprender o que observar.</p>
          <p className="rounded-xl border border-border bg-card/60 p-4">O que configurar.</p>
          <p className="rounded-xl border border-border bg-card/60 p-4">Quais sinais nunca ignorar.</p>
        </div>
        <p className="mt-7 text-center text-base text-muted-foreground md:text-lg">Foi exatamente para isso que criamos o:</p>
        <h2 className="mt-3 text-center text-2xl font-black uppercase text-neon text-glow-blue md:text-5xl">
          Guia Internet Segura Para Seus Filhos
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base text-muted-foreground md:text-lg">
          Um material direto ao ponto que mostra como proteger seus filhos dos principais perigos da internet moderna.
        </p>
      </section>

      {/* BENEFITS */}
      <section className="mt-14">
        <h2 className="text-center text-3xl font-bold md:text-4xl">O Que Você Vai Aprender</h2>
        <p className="mt-3 text-center text-lg text-muted-foreground">Ao acessar o guia você descobrirá:</p>
        <ul className="mx-auto mt-8 grid max-w-2xl gap-3">
          {learnings.map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4 backdrop-blur">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neon/20">
                <Check className="h-4 w-4 text-neon" />
              </div>
              <span className="text-base text-foreground md:text-lg">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur md:p-7">
          <h2 className="text-xl font-bold md:text-3xl">Por que este guia é diferente</h2>
          <div className="mt-5 space-y-3 text-base text-muted-foreground md:text-lg">
            <p>A maioria dos conteúdos sobre segurança digital é complicada.</p>
            <p>Cheia de termos técnicos.</p>
            <p>Difícil de aplicar.</p>
            <p className="font-semibold text-foreground">Este guia foi criado para pais comuns.</p>
          </div>
        </div>
        <div className="rounded-3xl border border-neon/40 bg-neon/10 p-6 backdrop-blur md:p-7">
          <h2 className="text-xl font-bold md:text-3xl">Orientações simples</h2>
          <div className="mt-5 space-y-3 text-base text-muted-foreground md:text-lg">
            <p>Você recebe orientações simples.</p>
            <p>Objetivas.</p>
            <p>Práticas.</p>
            <p className="font-semibold text-foreground">Mesmo que você não tenha conhecimento técnico.</p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Como Funciona</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ["PASSO 1", "Acesse o material imediatamente após a compra."],
            ["PASSO 2", "Aprenda os riscos digitais que mais afetam crianças e adolescentes atualmente."],
            ["PASSO 3", "Implemente as orientações práticas com sua família."],
            ["PASSO 4", "Tenha muito mais tranquilidade sabendo que está preparado para proteger quem você mais ama."],
          ].map(([stepTitle, text]) => (
            <div key={stepTitle} className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
              <p className="text-sm font-bold tracking-widest text-neon">{stepTitle}</p>
              <p className="mt-3 text-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Você Recebe Hoje</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {bonuses.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
              <h3 className="text-lg font-bold text-foreground md:text-xl">{item.title}</h3>
              <p className="mt-2 text-sm font-bold">
                <span className="text-muted-foreground">Valor: </span>
                <span className="text-destructive line-through">{item.from}</span>
                <span className="mx-2 text-muted-foreground">por</span>
                <span className="font-black text-green-500">{item.to}</span>
              </p>
              <p className="mt-3 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Pais que já protegeram seus filhos</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((r) => (
            <div key={r.name} className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
              <div className="flex gap-0.5 text-neon">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-neon" />
                ))}
              </div>
              <p className="mt-3 text-foreground">"{r.text}"</p>
              <p className="mt-3 text-sm text-muted-foreground">— {r.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Vantagens</h2>
        <ul className="mx-auto mt-8 grid max-w-2xl gap-3 md:grid-cols-2">
          {advantages.map((advantage) => (
            <li key={advantage} className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4 backdrop-blur">
              <Check className="h-5 w-5 flex-shrink-0 text-neon" />
              <span className="font-medium text-foreground">{advantage}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* OFFER */}
      <section className="mt-16 rounded-3xl border border-neon/40 bg-gradient-to-b from-card/80 to-deep/80 p-8 backdrop-blur md:p-12 glow-blue">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-1.5 text-xs font-bold tracking-widest text-destructive">
            <Clock className="h-3.5 w-3.5" /> OFERTA POR TEMPO LIMITADO
          </div>
          <h2 className="mt-5 text-2xl font-bold md:text-4xl">Acesso Imediato ao Guia Completo</h2>

          <div className="mx-auto mt-7 max-w-md space-y-2 rounded-2xl border border-border bg-card/60 p-4 text-left text-sm text-muted-foreground md:p-5 md:text-base">
            <p>Hoje você não vai pagar:</p>
            <p><span className="line-through">R$97</span> pelo guia</p>
            <p><span className="line-through">R$27</span> pelo checklist</p>
            <p><span className="line-through">R$19</span> pelo roteiro</p>
            <p><span className="line-through">R$37</span> pelo guia de aplicativos</p>
            <p className="pt-2 text-center text-base font-bold text-foreground md:text-lg">Total: <span className="line-through text-destructive">R$180</span></p>
          </div>

          <div className="mx-auto mt-8 flex max-w-sm flex-col items-center">
            <div className="text-sm text-muted-foreground">Por apenas:</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold text-muted-foreground md:text-2xl">R$</span>
              <span className="font-display text-5xl font-black text-neon text-glow-blue md:text-7xl">37</span>
              <span className="text-xl font-bold text-muted-foreground md:text-2xl">,00</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Pagamento único · Acesso imediato</p>
          </div>

          <div className="mt-6 flex justify-center">
            <Countdown minutes={15} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            ⚠️ Esta condição promocional foi liberada por tempo limitado. Quando a promoção encerrar, o valor poderá retornar para R$97.
          </p>

          <a
            href={CHECKOUT_URL}
            className="mt-8 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon to-primary px-4 py-5 text-[13px] font-bold uppercase leading-tight tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] animate-pulse-glow md:px-8 md:py-5 md:text-lg"
          >
            <span className="md:hidden">✅ ACESSO IMEDIATO · R$37</span>
            <span className="hidden md:inline">✅ QUERO ACESSO IMEDIATO AGORA</span>
            <ChevronRight className="h-5 w-5 shrink-0" />
          </a>

          {/* GUARANTEE */}
          <div className="mx-auto mt-8 flex max-w-md items-center gap-4 rounded-2xl border border-border bg-card/60 p-5 text-left">
            <Shield className="h-12 w-12 flex-shrink-0 text-neon" />
            <div>
              <p className="font-bold text-foreground">🛡️ Garantia incondicional de 7 dias</p>
              <p className="text-sm text-muted-foreground">Se não gostar, basta solicitar o reembolso.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-border bg-card/60 p-6 backdrop-blur md:p-10">
        <h2 className="text-center text-2xl font-bold md:text-4xl">Perguntas Frequentes</h2>
        <div className="mt-8 grid gap-4">
          {[
            ["Preciso entender de tecnologia?", "Não. O guia foi criado para pais comuns."],
            ["Meu filho ainda é pequeno. Vale a pena?", "Sim. Quanto mais cedo você criar hábitos digitais saudáveis, melhor."],
            ["Recebo o acesso na hora?", "Sim. O acesso é imediato após a confirmação do pagamento."],
            ["Funciona para adolescentes?", "Sim. O conteúdo foi desenvolvido para pais de crianças e adolescentes."],
            ["O pagamento é único?", "Sim. Sem mensalidades ou cobranças recorrentes."],
          ].map(([question, answer]) => (
            <div key={question} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
              <h3 className="text-base font-bold text-foreground md:text-lg">{question}</h3>
              <p className="mt-1 text-sm text-muted-foreground md:text-base">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold md:text-4xl">A melhor proteção sempre será a prevenção.</h2>
        <div className="mx-auto mt-5 max-w-2xl space-y-4 text-base text-muted-foreground md:text-lg">
          <p>Seu filho não precisa passar por uma situação perigosa para que você comece a agir.</p>
          <p>Quanto mais cedo você aprender a identificar os riscos, maiores são as chances de evitar problemas que podem impactar sua família por anos.</p>
        </div>
        <a
          href={CHECKOUT_URL}
          className="mt-8 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon to-primary px-4 py-5 text-[13px] font-bold uppercase leading-tight tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] animate-pulse-glow md:px-8 md:py-5 md:text-lg"
        >
          <span className="md:hidden">👨‍👩‍👧 PROTEGER MINHA FAMÍLIA · R$37</span>
          <span className="hidden md:inline">👨‍👩‍👧 QUERO PROTEGER MINHA FAMÍLIA POR R$37</span>
          <ChevronRight className="h-5 w-5 shrink-0" />
        </a>
      </section>

      {/* STICKY MOBILE CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neon/30 bg-deep/95 p-3 pb-5 backdrop-blur md:hidden">
        <a
          href={CHECKOUT_URL}
          className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-neon to-primary px-5 py-5 text-sm font-bold uppercase tracking-wide text-primary-foreground glow-blue min-h-[56px]"
        >
          🛡️ PROTEGER MEU FILHO · R$37
          <ChevronRight className="ml-1 h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
