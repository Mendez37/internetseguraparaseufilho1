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
  | "intro"
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

const QUESTIONS: Record<string, { title: string; options: string[] }> = {
  q1: { title: "Seu filho usa celular sem supervisão?", options: ["📱 Todos os dias","⏰ Frequentemente","👀 Às vezes","🛡️ Quase nunca"] },
  q2: { title: "Você sabe com quem ele conversa online?", options: ["✅ Sei exatamente","🤔 Tenho uma ideia","⚠️ Não tenho certeza","🚨 Não faço ideia"] },
  q3: { title: "Seu filho possui redes sociais?", options: ["📲 Sim, várias","👥 Apenas algumas","🔎 Apenas uma","🛡️ Não possui"] },
  q4: { title: "Você verifica as configurações de privacidade dos aplicativos?", options: ["🔐 Sempre","👀 Às vezes","⚠️ Raramente","🚫 Nunca"] },
  q5: { title: "Seu filho já recebeu mensagens de desconhecidos?", options: ["🚨 Sim","🤔 Talvez","⚠️ Não sei","✅ Não"] },
  q6: { title: "Você utiliza algum tipo de controle parental?", options: ["🛡️ Sim","🔧 Já tentei","📘 Conheço mas não uso","🚫 Não uso"] },
  q7: { title: "Como você gostaria de se sentir em relação à internet?", options: ["😌 Tranquilo","💪 Confiante","🛡️ Seguro","🎯 No controle"] },
  q8: { title: "O que seria mais importante para você?", options: ["🚨 Evitar perigos","🔐 Proteger a privacidade","⏳ Controlar o tempo de tela","✅ Tudo isso"] },
  q9: { title: "Você gostaria de aprender estratégias simples para proteger seus filhos?", options: ["🛡️ Com certeza","✅ Sim","🤔 Talvez","📘 Preciso conhecer"] },
};

const CHECKOUT_URL = "https://pay.kirvano.com/ccf64799-e255-4be5-baf8-8c79f6196ce8";
const PRODUCT_MOCKUP_URL = "/__l5e/assets-v1/4cc41eae-daa7-43af-b33f-149bacd357fe/guia-internet-segura-mockup.png";

function Funnel() {
  const [step, setStep] = useState<Step>("intro");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const quizIndex = QUIZ_STEPS.indexOf(step as Step);
  const progress = quizIndex >= 0 ? ((quizIndex + 1) / QUIZ_STEPS.length) * 100 : 0;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,184,255,0.15),transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl px-5 py-8 md:py-14">
        {step === "intro" && <Intro onStart={() => setStep("q1")} />}

        {quizIndex >= 0 && (
          <QuizScreen
            step={step as keyof typeof QUESTIONS}
            progress={progress}
            onAnswer={() => {
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
            title="O risco é mais real do que você imagina"
            body="Milhares de crianças são expostas diariamente a golpes, cyberbullying, conteúdos inadequados e pessoas mal-intencionadas através da internet."
            cta="CONTINUAR"
            onContinue={() => setStep("q4")}
            tone="alert"
          />
        )}

        {step === "break2" && <BreakShock onContinue={() => setStep("q7")} />}

        {step === "break3" && (
          <Break
            icon={<Users className="h-14 w-14 text-neon" />}
            badge="VOCÊ NÃO ESTÁ SOZINHO"
            title="Milhares de pais já tomaram esta decisão"
            body="Milhares de pais estão buscando maneiras de proteger seus filhos dos riscos digitais que aumentam todos os dias. A maioria só percebe o problema depois que algo acontece."
            cta="CONTINUAR"
            onContinue={() => setStep("loading")}
            tone="neon"
          />
        )}

        {step === "loading" && <LoadingResult onDone={() => setStep("result")} />}

        {step === "result" && <Result onContinue={() => setStep("sales")} />}

        {step === "sales" && <Sales />}
      </div>
    </main>
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

      <h1 className="mt-6 text-center text-4xl font-bold leading-[1.05] md:text-6xl">
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
          className="group relative w-full max-w-md rounded-xl bg-gradient-to-r from-neon to-primary px-8 py-5 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow md:text-lg"
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
  onAnswer,
}: {
  step: keyof typeof QUESTIONS;
  progress: number;
  onAnswer: () => void;
}) {
  const q = QUESTIONS[step];
  return (
    <section className="animate-fade-up">
      <ProgressBar value={progress} />
      <div className="mt-8 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur md:p-10">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neon">
          <Eye className="h-4 w-4" /> Pergunta
        </div>
        <h2 className="text-2xl font-bold leading-tight md:text-3xl">{q.title}</h2>
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
      <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">{body}</p>
      <button
        onClick={onContinue}
        className="mt-10 rounded-xl bg-gradient-to-r from-neon to-primary px-10 py-4 font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] animate-pulse-glow"
      >
        {cta} <ChevronRight className="ml-1 inline h-5 w-5" />
      </button>
    </section>
  );
}

/* ---------- BREAK 2 - SHOCK ---------- */
function BreakShock({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="animate-fade-up -mx-5 rounded-3xl border border-destructive/40 bg-black/80 p-8 text-center backdrop-blur md:p-14">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-destructive bg-destructive/10 animate-pulse-red">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="mt-6 text-5xl font-black leading-none tracking-tight text-destructive text-glow-red md:text-7xl">
        🚨 ATENÇÃO
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-xl font-semibold text-foreground md:text-2xl">
        Seu filho pode estar em perigo neste exato momento.
      </p>
      <div className="mx-auto mt-8 max-w-xl space-y-4 text-left text-base text-muted-foreground md:text-lg">
        <p>Eu sei que você jamais gostaria de receber uma ligação da escola.</p>
        <p>Ou descobrir tarde demais que seu filho foi vítima de cyberbullying.</p>
        <p>Ou perceber que ele teve contato com pessoas perigosas online.</p>
        <p className="font-semibold text-foreground">Mas a verdade é simples:</p>
        <p className="border-l-2 border-neon pl-4 italic text-foreground">
          A segurança digital do seu filho depende das decisões tomadas hoje.
        </p>
      </div>
      <button
        onClick={onContinue}
        className="mt-10 rounded-xl bg-destructive px-8 py-4 font-bold uppercase tracking-wide text-destructive-foreground transition-transform hover:scale-[1.02] glow-red"
      >
        QUERO PROTEGER MEU FILHO
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
function Result({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="animate-fade-up">
      <div className="rounded-3xl border border-destructive/40 bg-card/60 p-8 backdrop-blur md:p-12">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-destructive">
          <ShieldAlert className="h-5 w-5" /> SUA ANÁLISE FOI CONCLUÍDA
        </div>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">
          ⚠️ Sua Análise Foi Concluída...
        </h2>

        <div className="mt-6 rounded-2xl border border-border bg-deep/60 p-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Nível de exposição</span>
            <span className="font-bold text-destructive">ALTO</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[78%] bg-gradient-to-r from-yellow-500 via-orange-500 to-destructive glow-red" />
          </div>
        </div>

        <div className="mt-6 space-y-4 text-lg text-muted-foreground">
          <p>Com base nas suas respostas, identificamos alguns sinais que merecem atenção.</p>
          <p>Isso não significa que seu filho esteja correndo perigo neste momento.</p>
          <p>Mas significa que existem riscos digitais que podem passar despercebidos pela maioria dos pais.</p>
          <p className="font-semibold text-foreground">E é exatamente assim que muitos problemas começam.</p>
          <p>Primeiro vem a sensação de segurança.</p>
          <p>Depois vem a surpresa.</p>
          <p className="font-semibold text-destructive">E quando os pais descobrem o que aconteceu, geralmente já é tarde demais.</p>
        </div>

        <button
          onClick={onContinue}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-neon to-primary px-8 py-5 text-lg font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.01] animate-pulse-glow"
        >
          🛡️ QUERO PROTEGER MEU FILHO AGORA <ChevronRight className="ml-1 inline h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

/* ---------- SALES ---------- */
function Sales() {
  return (
    <article className="animate-fade-up pb-32 md:pb-12">
      <div className="text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-1.5 text-xs font-bold tracking-widest text-destructive">
          <AlertTriangle className="h-3.5 w-3.5" /> LEITURA URGENTE
        </div>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl">
          ⚠️ O Guia Que Todo Pai e Toda Mãe{" "}
          <span className="text-neon text-glow-blue">Deveriam Ler</span>{" "}
          Antes Que Seja Tarde
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Descubra como proteger seus filhos contra golpes, cyberbullying, conteúdos impróprios, predadores online e riscos digitais que a maioria dos pais desconhece.
        </p>
      </div>

      {/* MOCKUP */}
      <div className="relative mx-auto mt-10 flex max-w-md justify-center">
        <div className="absolute inset-0 rounded-full bg-neon/30 blur-3xl" />
        <img
          src={ebookMockup}
          alt="Guia Internet Segura Para Seus Filhos - Capa do ebook"
          width={1024}
          height={1024}
          loading="lazy"
          className="relative w-full max-w-xs animate-float drop-shadow-[0_0_40px_rgba(0,184,255,0.4)] md:max-w-sm"
        />
      </div>

      {/* ALERT BOX */}
      <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-destructive/50 bg-destructive/10 p-6 glow-red">
        <p className="text-center text-lg font-semibold text-foreground md:text-xl">
          🚨 Seu filho pode estar a apenas <span className="text-destructive">um clique</span> de um problema que poderia ter sido evitado.
        </p>
      </div>

      {/* BENEFITS */}
      <section className="mt-14">
        <h2 className="text-center text-3xl font-bold md:text-4xl">O Que Você Vai Aprender</h2>
        <ul className="mx-auto mt-8 grid max-w-2xl gap-3">
          {[
            "Aprenda a identificar sinais de perigo",
            "Proteja seu filho contra pessoas mal-intencionadas",
            "Evite exposição a conteúdos inadequados",
            "Entenda como funcionam os principais riscos digitais",
            "Aprenda a conversar sobre internet sem conflitos",
            "Crie hábitos digitais saudáveis",
            "Mais tranquilidade para toda a família",
          ].map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4 backdrop-blur">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neon/20">
                <Check className="h-4 w-4 text-neon" />
              </div>
              <span className="text-base text-foreground md:text-lg">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Pais que já protegeram seus filhos</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { stars: 5, text: "Abriu meus olhos para coisas que eu nunca tinha percebido.", name: "Mariana C." },
            { stars: 5, text: "Depois desse guia, configurei a segurança dos celulares dos meus filhos.", name: "Ricardo M." },
            { stars: 5, text: "Leitura obrigatória para qualquer pai.", name: "Patrícia L." },
          ].map((r) => (
            <div key={r.name} className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
              <div className="flex gap-0.5 text-neon">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-neon" />
                ))}
              </div>
              <p className="mt-3 text-foreground">"{r.text}"</p>
              <p className="mt-3 text-sm text-muted-foreground">— {r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OFFER */}
      <section className="mt-16 rounded-3xl border border-neon/40 bg-gradient-to-b from-card/80 to-deep/80 p-8 backdrop-blur md:p-12 glow-blue">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-1.5 text-xs font-bold tracking-widest text-destructive">
            <Clock className="h-3.5 w-3.5" /> OFERTA POR TEMPO LIMITADO
          </div>
          <h2 className="mt-5 text-3xl font-bold md:text-4xl">Acesso Imediato ao Guia Completo</h2>

          <div className="mx-auto mt-8 flex max-w-sm flex-col items-center">
            <div className="text-sm text-muted-foreground">De <span className="line-through">R$ 97,00</span> por apenas:</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-muted-foreground">R$</span>
              <span className="font-display text-7xl font-black text-neon text-glow-blue">37</span>
              <span className="text-2xl font-bold text-muted-foreground">,00</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Pagamento único · Acesso imediato</p>
          </div>

          <div className="mt-6 flex justify-center">
            <Countdown minutes={15} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            ⚠️ Desconto promocional disponível apenas hoje. Quando o contador zerar, o valor poderá voltar para R$97.
          </p>

          <a
            href={CHECKOUT_URL}
            className="mt-8 inline-flex w-full max-w-md items-center justify-center rounded-xl bg-gradient-to-r from-neon to-primary px-8 py-5 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] animate-pulse-glow md:text-lg"
          >
            QUERO PROTEGER MEU FILHO AGORA
            <ChevronRight className="ml-2 h-5 w-5" />
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

      {/* STICKY MOBILE CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neon/30 bg-deep/95 p-3 backdrop-blur md:hidden">
        <a
          href={CHECKOUT_URL}
          className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-neon to-primary px-6 py-4 text-sm font-bold uppercase tracking-wide text-primary-foreground glow-blue"
        >
          PROTEGER MEU FILHO · R$37
          <ChevronRight className="ml-1 h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
