"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  AgencyComparison,
  FounderHero,
  GrowthMapPreview,
  MarketSegments,
  LeandroTestimonial,
} from "@/components/LandingPresentation";
import { trackMetaEvent } from "@/components/MetaPixel";
import {
  Answers,
  CAL_LINK,
  FUNNEL_VERSION,
  WHATSAPP,
  getDiagnosis,
  getQualification,
  getSteps,
  pillars,
  qualificationSteps,
  restoreAnswers,
} from "@/lib/funnel";

const BookingCalendar = dynamic(() => import("@/components/BookingCalendar"), {
  ssr: false,
  loading: () => (
    <p className="calendar-loading" role="status">
      Abrindo os horários disponíveis...
    </p>
  ),
});
type View =
  | "landing"
  | "quiz"
  | "gate"
  | "result"
  | "qualify"
  | "calendar"
  | "followup";
type Lead = { name: string; company: string; whatsapp: string; email: string };
const DRAFT_KEY = "elite-raiox-respostas-v2";

function OptionIcon({ index }: { index: number }) {
  return (
    <svg className="option-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      {index % 2 === 0 ? (
        <path d="M8 12l3 3 5-6" />
      ) : (
        <path d="M7 14l4-4 3 2 4-5" />
      )}
    </svg>
  );
}

function AnimatedScore({ score, label }: { score: number; label: string }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const p = Math.min((now - start) / 900, 1);
      setDisplayed(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);
  return (
    <div
      className="score-ring score-ring-animated"
      style={{ "--score": `${displayed * 3.6}deg` } as React.CSSProperties}
    >
      <div>
        <div className="score-value">
          <strong>{displayed}</strong>
          <span>/ 100</span>
        </div>
        <small>{label}</small>
      </div>
    </div>
  );
}

function RadarChart({
  scores,
}: {
  scores: ReturnType<typeof getDiagnosis>["scores"];
}) {
  const c = 180,
    r = 112;
  const point = (i: number, s: number) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return `${c + Math.cos(a) * r * s},${c + Math.sin(a) * r * s}`;
  };
  return (
    <section className="radar-section" aria-labelledby="radar-title">
      <div className="radar-copy">
        <span>Seu perfil em uma visão</span>
        <h2 id="radar-title">Forças atuais e pontos de atenção.</h2>
        <p>
          O gráfico resume suas respostas nos cinco pilares. Ele não representa
          comparação com outras empresas ou previsão de faturamento.
        </p>
      </div>
      <div className="radar-card">
        <svg
          viewBox="0 0 360 360"
          role="img"
          aria-label="Autoavaliação nos cinco pilares E.L.I.T.E."
        >
          {[0.25, 0.5, 0.75, 1].map((s) => (
            <polygon
              key={s}
              points={scores.map((_, i) => point(i, s)).join(" ")}
              className="radar-grid"
            />
          ))}
          {scores.map((s, i) => (
            <line
              key={s.id}
              x1={c}
              y1={c}
              x2={point(i, 1).split(",")[0]}
              y2={point(i, 1).split(",")[1]}
              className="radar-axis"
            />
          ))}
          <polygon
            points={scores
              .map((s, i) => point(i, Math.max(s.percent, 6) / 100))
              .join(" ")}
            className="radar-shape"
          />
          {scores.map((s, i) => {
            const a = ((-90 + i * 72) * Math.PI) / 180,
              x = c + Math.cos(a) * 148,
              y = c + Math.sin(a) * 140;
            return (
              <text
                key={s.id}
                x={x}
                y={y}
                textAnchor="middle"
                className="radar-label"
              >
                <tspan x={x}>{s.name.replace(" & Oferta", "")}</tspan>
                <tspan x={x} dy="15">
                  {s.percent}%
                </tspan>
              </text>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer result-footer">
      <img src="/images/logo-elite.png" alt="Elite Mídias" />
      <p>Elite Mídias · Marketing, vendas e crescimento.</p>
      <a
        href="https://instagram.com/nandoborbaaa"
        target="_blank"
        rel="noreferrer"
      >
        @nandoborbaaa
      </a>
      <a
        href={`https://wa.me/${WHATSAPP}`}
        onClick={() => trackMetaEvent("Contact")}
        target="_blank"
        rel="noreferrer"
      >
        (21) 96655-9243
      </a>
      <a href="/privacidade">Uso dos dados</a>
    </footer>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [lead, setLead] = useState<Lead>({
    name: "",
    company: "",
    whatsapp: "",
    email: "",
  });
  const [qualification, setQualification] = useState<Record<string, string>>(
    {},
  );
  const [qualificationIndex, setQualificationIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState("");
  const [soundOn, setSoundOn] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [bookingAt, setBookingAt] = useState("");
  const [bookingSyncError, setBookingSyncError] = useState(false);
  const sessionRef = useRef("");
  const attributionRef = useRef<Record<string, string>>({
    landing_variant: FUNNEL_VERSION,
  });
  const transitionRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bookingRef = useRef(false);
  const segment = String(answers.segment ?? "");
  const steps = useMemo(() => getSteps(segment), [segment]);
  const diagnosis = useMemo(
    () => getDiagnosis(segment, answers),
    [segment, answers],
  );
  const primary = diagnosis.priorities[0];
  const current = steps[stepIndex];
  const qStatus = getQualification(qualification);

  useEffect(() => {
    const hydrationFrame = requestAnimationFrame(() => {
      try {
        const draft = JSON.parse(
          sessionStorage.getItem(DRAFT_KEY) ?? "null",
        ) as { answers?: unknown; savedAt?: number } | null;
        if (draft?.savedAt && Date.now() - draft.savedAt < 86400000)
          setAnswers(restoreAnswers(draft.answers));
        const params = new URLSearchParams(window.location.search);
        const saved = JSON.parse(
          sessionStorage.getItem("elite-raiox-origem-v2") ?? "{}",
        ) as Record<string, string>;
        const origin: Record<string, string> = {
          landing_variant: FUNNEL_VERSION,
        };
        for (const key of [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_content",
          "utm_term",
          "fbclid",
          "gclid",
        ]) {
          const value = params.get(key) ?? saved[key];
          if (typeof value === "string" && value)
            origin[key] = value.slice(0, 300);
        }
        attributionRef.current = origin;
        sessionStorage.setItem("elite-raiox-origem-v2", JSON.stringify(origin));
      } catch {
        /* A retomada é opcional quando o navegador restringe armazenamento. */
      }
      setDraftReady(true);
    });
    return () => {
      cancelAnimationFrame(hydrationFrame);
      if (timerRef.current) clearTimeout(timerRef.current);
      void audioRef.current?.close();
    };
  }, []);
  useEffect(() => {
    if (!draftReady) return;
    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ answers, savedAt: Date.now() }),
      );
    } catch {}
  }, [answers, draftReady]);
  useEffect(() => {
    if (view === "landing") return;
    const f = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      headingRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(f);
  }, [view, stepIndex, qualificationIndex]);

  const sendLead = useCallback(
    async (
      phase: "diagnostic" | "qualification" | "booking",
      extra: Record<string, unknown> = {},
    ) => {
      if (!sessionRef.current) sessionRef.current = crypto.randomUUID();
      const controller = new AbortController(),
        timer = setTimeout(() => controller.abort(), 16000);
      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phase,
            lead,
            answers,
            qualification,
            sessionId: sessionRef.current,
            attribution: attributionRef.current,
            ...extra,
          }),
          signal: controller.signal,
        });
        const result = (await response.json().catch(() => null)) as {
          ok?: boolean;
          error?: string;
        } | null;
        if (!response.ok || !result?.ok)
          throw new Error(
            result?.error ??
              "Não conseguimos concluir o envio. Tente novamente.",
          );
      } finally {
        clearTimeout(timer);
      }
    },
    [lead, answers, qualification],
  );
  function start(fresh = false) {
    setError("");
    if (fresh) {
      setAnswers({});
      setStepIndex(0);
      setView("quiz");
    } else {
      const i = steps.findIndex(
        (s) => !s.options.some((o) => o.value === answers[s.id]),
      );
      setStepIndex(Math.max(i, 0));
      setView(i === -1 ? "gate" : "quiz");
    }
    trackMetaEvent("DiagnosticStarted", { variant: FUNNEL_VERSION });
  }
  function tone(index: number) {
    if (!soundOn || typeof window.AudioContext === "undefined") return;
    try {
      const c = audioRef.current ?? new AudioContext();
      audioRef.current = c;
      const o = c.createOscillator(),
        g = c.createGain();
      o.frequency.value = 400 + index * 60;
      g.gain.setValueAtTime(0.04, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.09);
      o.connect(g);
      g.connect(c.destination);
      o.start();
      o.stop(c.currentTime + 0.1);
    } catch {}
  }
  function answer(value: string | number, index: number) {
    if (transitionRef.current) return;
    transitionRef.current = true;
    setTransitioning(true);
    tone(index);
    setAnswers((a) => ({ ...a, [current.id]: value }));
    trackMetaEvent("QuestionAnswered", {
      question_id: current.id,
      step: stepIndex + 1,
    });
    timerRef.current = setTimeout(() => {
      if (stepIndex === 7) setView("gate");
      else setStepIndex((i) => i + 1);
      transitionRef.current = false;
      setTransitioning(false);
    }, 180);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await sendLead("diagnostic");
      trackMetaEvent("Lead");
      trackMetaEvent("ReportViewed", { variant: FUNNEL_VERSION });
      setView("result");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Confira sua conexão e tente novamente.",
      );
      trackMetaEvent("FormError", { step: "lead" });
    } finally {
      setSubmitting(false);
    }
  }
  function beginQualification() {
    setError("");
    setQualificationIndex(0);
    setView("qualify");
    trackMetaEvent("QualificationStarted");
  }
  async function finishQualification() {
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      await sendLead("qualification");
      trackMetaEvent("QualificationCompleted", { status: qStatus });
      if (qStatus === "ready" || qStatus === "review") {
        setView("calendar");
        trackMetaEvent("SchedulingViewed");
      } else setView("followup");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não conseguimos enviar. Tente novamente.",
      );
      trackMetaEvent("FormError", { step: "qualification" });
    } finally {
      setSubmitting(false);
    }
  }
  const booked = useCallback(
    (date: string, uid: string) => {
      if (bookingRef.current || Number.isNaN(new Date(date).getTime())) return;
      bookingRef.current = true;
      setBookingAt(date);
      trackMetaEvent("Schedule");
      void sendLead("booking", { bookingAt: date, bookingUid: uid }).catch(() =>
        setBookingSyncError(true),
      );
    },
    [sendLead],
  );
  const whatsappHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Sou ${lead.name || "um empresário"}, da ${lead.company || "minha empresa"}. Fiz o Raio X Elite Mídias. Meu principal ponto de atenção foi ${primary.name} e meu score foi ${diagnosis.score}/100. Quero falar sobre meu diagnóstico e a análise estratégica.`)}`;
  const savePdf = () => {
    trackMetaEvent("ReportPrintRequested");
    window.print();
  };

  if (view === "landing")
    return (
      <main className="site-shell">
        <header className="topbar">
          <img
            src="/images/logo-elite.png"
            alt="Elite Mídias"
            className="brand-logo"
          />
          <div className="topbar-actions">
            <span className="topbar-note">
              <i /> Diagnóstico de marketing e vendas
            </span>
            <button className="header-cta" onClick={() => start()}>
              Começar meu Raio X
            </button>
          </div>
        </header>
        <section className="hero">
          <div className="hero-copy">
            <div className="kicker">
              <span>Raio X Elite Mídias</span>
            </div>
            <p className="audience-label">
              Para donos de empresas que querem vender melhor
            </p>
            <h1>
              Descubra o que está travando suas vendas e{" "}
              <em>o que corrigir primeiro.</em>
            </h1>
            <p className="hero-lead">
              Receba três prioridades de marketing e vendas para o seu negócio.
              Depois, transforme esse diagnóstico em um{" "}
              <strong>Mapa de Crescimento para os próximos 90 dias</strong>, em
              uma reunião estratégica com a Elite Mídias.
            </p>
            <button
              className="primary-button green-button"
              onClick={() => start()}
            >
              {Object.keys(answers).length
                ? "Retomar meu diagnóstico"
                : "Descobrir meu principal gargalo"}
              <span>→</span>
            </button>
            {Object.keys(answers).length > 0 && (
              <button className="text-button" onClick={() => start(true)}>
                Começar do zero
              </button>
            )}
            <div className="trust-row">
              <span>✓ 8 perguntas</span>
              <span>✓ Gratuito</span>
              <span>✓ Adaptado ao seu segmento</span>
            </div>
            <p className="entry-note">
              Ao final, informe seu nome, empresa e WhatsApp para abrir o
              relatório. O email é opcional.
            </p>
          </div>
          <FounderHero />
        </section>
        <AgencyComparison onStart={() => start()} />
        <LeandroTestimonial onStart={() => start()} />
        <section
          className="deliverable-preview"
          aria-labelledby="deliverable-title"
        >
          <div>
            <span className="section-kicker">
              Um diagnóstico que vira direção
            </span>
            <h2 id="deliverable-title">
              Você entende o gargalo.
              <br />
              Na análise, construímos o próximo passo.
            </h2>
            <p>
              Seu relatório inicial mostra o que suas respostas indicam. Na
              conversa de 30 minutos, validamos esse cenário e organizamos três
              ações, a ordem de execução e os indicadores para acompanhar.
            </p>
            <button
              className="primary-button green-button"
              onClick={() => start()}
            >
              Quero minhas três prioridades <span>→</span>
            </button>
          </div>
          <GrowthMapPreview />
        </section>
        <MarketSegments />
        <section className="specialist-section">
          <figure className="specialist-photo">
            <Image
              src="/images/nando-bastidores.jpg"
              alt="Nando Borba nos bastidores da Elite Mídias"
              width={1737}
              height={3088}
              sizes="(max-width: 600px) 160px, 230px"
            />
            <figcaption>Nos bastidores da Elite.</figcaption>
          </figure>
          <div>
            <span className="section-kicker">
              A conversa é sobre a sua empresa
            </span>
            <h2>Nando Borba e a equipe Elite Mídias.</h2>
            <p>
              Vamos olhar para marketing e para o caminho que transforma
              interesse em venda. Você recebe um mapa inicial de prioridades.
              Havendo aderência, apresentamos como a assessoria pode ajudar na
              execução.
            </p>
            <a
              href="https://instagram.com/nandoborbaaa"
              target="_blank"
              rel="noreferrer"
            >
              Conhecer o trabalho do Nando ↗
            </a>
          </div>
        </section>
        <details className="method-details">
          <summary>Conheça os cinco pilares do método E.L.I.T.E.</summary>
          <section className="method-section" aria-label="Áreas do diagnóstico">
            <div className="method-system">
              <div className="method-core">
                <small>Diagnóstico</small>
                <strong>E.L.I.T.E.</strong>
              </div>
              {pillars.map((p, i) => (
                <article
                  key={p.id}
                  className={`method-node node-${i + 1}`}
                  style={{ "--delay": `${i * 0.16}s` } as React.CSSProperties}
                >
                  <b>{p.letter}</b>
                  <span>
                    <strong>{p.name}</strong>
                    <small>{p.blurb}</small>
                  </span>
                </article>
              ))}
            </div>
          </section>
        </details>
        <section className="faq-section">
          <div className="section-heading">
            <span>Antes de começar</span>
            <h2>O que esperar do seu Raio X.</h2>
          </div>
          <details>
            <summary>O diagnóstico e a análise são gratuitos?</summary>
            <p>
              Sim. O relatório inicial é gratuito. A análise é oferecida
              conforme o perfil e a disponibilidade de agenda, sem compromisso
              de contratação.
            </p>
          </details>
          <details>
            <summary>O que recebo no relatório e na reunião?</summary>
            <p>
              No relatório, uma autoavaliação dos cinco pilares, a hipótese de
              gargalo e três prioridades. Na reunião, validamos o cenário e
              construímos um mapa inicial com ações, sequência e indicadores
              para os próximos 90 dias.
            </p>
          </details>
          <details>
            <summary>Preciso investir para contratar a Elite?</summary>
            <p>
              Se houver interesse na assessoria, trabalhamos com uma referência
              de investimento total a partir de R$ 2.000 por mês, somando
              assessoria e verba para anúncios. O escopo e a divisão desse valor
              são apresentados na proposta.
            </p>
          </details>
          <details>
            <summary>O score é uma auditoria dos meus anúncios?</summary>
            <p>
              É uma autoavaliação baseada nas respostas, não uma inspeção das
              suas contas de anúncio ou uma previsão de faturamento. A análise
              com a equipe serve para validar as hipóteses e definir o próximo
              passo.
            </p>
          </details>
          <button
            className="primary-button green-button"
            onClick={() => start()}
          >
            Fazer meu Raio X gratuito <span>→</span>
          </button>
        </section>
        <Footer />
      </main>
    );

  if (view === "result")
    return (
      <main className="result-page">
        <header className="quiz-header result-header">
          <img
            src="/images/logo-elite.png"
            alt="Elite Mídias"
            className="brand-logo"
          />
          <div className="result-header-actions">
            <span>Seu relatório está aberto</span>
            <button className="pdf-button" onClick={savePdf}>
              Salvar relatório em PDF
            </button>
          </div>
        </header>
        <section className="result-hero">
          <div className="result-kicker">Raio X · {lead.company}</div>
          <div className="result-grid">
            <div>
              <h1 ref={headingRef} tabIndex={-1}>
                Sua primeira prioridade está em <em>{primary.name}.</em>
              </h1>
              <p>
                Você informou: <strong>“{primary.answer}”</strong>. Esse é um
                ponto para validar antes de definir o próximo investimento.
              </p>
              <div className="result-context">
                <strong>{segment}</strong>
                <i>·</i>
                <strong>{String(answers.revenue)}</strong>
                <i>·</i>
                <strong>{String(answers.goal)}</strong>
              </div>
            </div>
            <AnimatedScore score={diagnosis.score} label={diagnosis.band} />
          </div>
          <p className="score-explanation">
            Índice de maturidade declarado. Cada pilar representa uma resposta,
            com o mesmo peso. O faturamento dá contexto e não aumenta ou reduz
            sua nota.
          </p>
          <div className="first-action">
            <span>Sua primeira ação recomendada</span>
            <p>{primary.action}</p>
          </div>
          <div className="result-next-step">
            <div>
              <span>Análise estratégica gratuita</span>
              <h2>
                Transforme essas prioridades em um plano para os próximos 90
                dias.
              </h2>
              <p>
                Em 30 minutos, validamos seu cenário e construímos seu Mapa de
                Crescimento com três ações, sequência e indicadores.
              </p>
            </div>
            <button
              className="primary-button green-button"
              onClick={beginQualification}
            >
              Quero agendar minha reunião <span>→</span>
            </button>
            <small>
              Antes da agenda, três perguntas para preparar a conversa.
            </small>
          </div>
        </section>
        <section className="results-body">
          <div className="priority-section compact-priorities">
            <div className="result-section-title">
              <span>Seu plano inicial</span>
              <h2>Três prioridades para investigar.</h2>
              <p>
                A ordem considera suas respostas e usa seu objetivo para
                desempatar os pontos de atenção.
              </p>
            </div>
            <div className="priority-grid">
              {diagnosis.priorities.map((p, i) => (
                <article key={p.id}>
                  <div className="priority-number">0{i + 1}</div>
                  <span>{p.name}</span>
                  <h3>
                    {i === 0
                      ? "Primeiro ponto de atenção"
                      : "Próxima prioridade"}
                  </h3>
                  <p>{p.action}</p>
                  <small>Você respondeu: {p.answer}</small>
                </article>
              ))}
            </div>
          </div>
          <div className="result-section-title">
            <span>Visão por pilar</span>
            <h2>O retrato das suas respostas.</h2>
          </div>
          <div className="pillar-results">
            {diagnosis.scores.map((p) => (
              <article
                key={p.id}
                className={p.percent < 45 ? "needs-attention" : ""}
              >
                <div className="pillar-result-top">
                  <b>{p.letter}</b>
                  <span>
                    <strong>{p.name}</strong>
                    <small>{p.blurb}</small>
                  </span>
                  <em>{p.percent}%</em>
                </div>
                <div className="result-bar">
                  <i style={{ width: `${p.percent}%` }} />
                </div>
              </article>
            ))}
          </div>
          <RadarChart scores={diagnosis.scores} />
          <section className="final-cta">
            <div className="cta-copy">
              <span>Seu Mapa de Crescimento</span>
              <h2>
                Clareza sobre <em>o que fazer primeiro.</em>
              </h2>
              <p>
                Na análise, partimos das suas respostas para validar o gargalo e
                construir um plano inicial aplicável à sua empresa. Se a
                assessoria fizer sentido, apresentamos uma proposta de execução.
              </p>
              <ul>
                <li>Três ações prioritárias para o seu cenário</li>
                <li>Sequência de execução para os próximos 90 dias</li>
                <li>Indicadores para acompanhar o avanço</li>
              </ul>
              <button
                className="primary-button green-button cta-copy-button"
                onClick={beginQualification}
              >
                Agendar reunião com a Elite <span>→</span>
              </button>
              <details className="bonus-secondary">
                <summary>
                  Bônus para quem participa: Desafio Perfil que Vende
                </summary>
                <div className="meeting-bonus">
                  <div className="bonus-gift">
                    <img
                      src="/images/presente-bonus.png"
                      alt="Presente do Desafio Perfil que Vende"
                    />
                  </div>
                  <div className="bonus-content">
                    <strong>Um complemento para sua comunicação.</strong>
                    <p>
                      <b>Você recebe</b> acesso ao desafio de 10 dias e 5
                      missões para organizar posicionamento, bio, destaques e
                      conteúdo do Instagram.
                    </p>
                  </div>
                </div>
              </details>
            </div>
            <div className="cta-card">
              <div className="ticket-visual">
                <img
                  src="/images/passe-crescimento.png"
                  alt="Passe gratuito para uma análise com a Elite Mídias"
                />
                <span>Análise gratuita</span>
              </div>
              <h3>Uma conversa com direção.</h3>
              <p>
                O seu relatório é o ponto de partida. A análise ajuda a escolher
                a prioridade e organizar a execução.
              </p>
              <button
                className="primary-button green-button"
                onClick={beginQualification}
              >
                Agendar e construir meu mapa <span>→</span>
              </button>
              <button className="pdf-button report-download" onClick={savePdf}>
                Salvar meu relatório em PDF
              </button>
            </div>
          </section>
          <section className="closing-cta">
            <span>Seu próximo passo</span>
            <h2>Leve seu diagnóstico para uma conversa sobre o seu negócio.</h2>
            <p>
              Antes da agenda, vamos alinhar decisão, momento e investimento. O
              relatório continua disponível para você.
            </p>
            <button
              className="primary-button green-button"
              onClick={beginQualification}
            >
              Quero agendar minha reunião <span>→</span>
            </button>
          </section>
          <p className="result-disclaimer">
            Esta avaliação indica hipóteses a partir das suas respostas.
            Resultados dependem de contexto, investimento e execução. Não
            representa garantia de faturamento.
          </p>
          <p className="print-contacts">
            Elite Mídias ·{" "}
            <a href="https://instagram.com/nandoborbaaa">
              instagram.com/nandoborbaaa
            </a>{" "}
            · <a href={`https://wa.me/${WHATSAPP}`}>WhatsApp (21) 96655-9243</a>
          </p>
        </section>
        <Footer />
      </main>
    );

  if (view === "calendar")
    return (
      <main className="result-page">
        <header className="quiz-header">
          <img
            src="/images/logo-elite.png"
            alt="Elite Mídias"
            className="brand-logo"
          />
          <button className="pdf-button" onClick={() => setView("result")}>
            Voltar ao relatório
          </button>
        </header>
        <section className="booking-section">
          <span className="section-kicker">Seu próximo passo com a Elite</span>
          <h1 ref={headingRef} tabIndex={-1}>
            {bookingAt
              ? "Sua reunião está agendada."
              : "Escolha o horário da sua reunião."}
          </h1>
          {bookingAt ? (
            <div className="booking-success" role="status">
              <strong>
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: "America/Sao_Paulo",
                }).format(new Date(bookingAt))}
              </strong>
              <p>
                Confira a confirmação enviada pela agenda. Separe o site ou
                Instagram da empresa e, se tiver, os números de captação e
                vendas. Vamos partir do seu diagnóstico.
              </p>
              {bookingSyncError && (
                <p>
                  Seu horário foi reservado, mas o resumo não foi sincronizado.
                  Avise nossa equipe pelo WhatsApp para anexar seu diagnóstico.
                </p>
              )}
              <button
                className="primary-button green-button"
                onClick={() => setView("result")}
              >
                Rever meu relatório <span>→</span>
              </button>
            </div>
          ) : (
            <>
              <p>
                Conversa de 30 minutos para validar seu diagnóstico e organizar
                três prioridades. O investimento em uma eventual contratação foi
                alinhado como referência total a partir de R$ 2.000 por mês,
                incluindo assessoria e anúncios.
              </p>
              <BookingCalendar
                name={lead.name}
                email={lead.email}
                onBooked={booked}
              />
              <p className="calendar-fallback">
                A agenda não abriu?{" "}
                <a
                  href={`https://cal.com/${CAL_LINK}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir horários em outra aba
                </a>{" "}
                ou{" "}
                <a
                  href={whatsappHref}
                  onClick={() => trackMetaEvent("Contact")}
                  target="_blank"
                  rel="noreferrer"
                >
                  falar com a equipe pelo WhatsApp
                </a>
                .
              </p>
            </>
          )}
        </section>
        <Footer />
      </main>
    );

  if (view === "followup")
    return (
      <main className="quiz-page">
        <header className="quiz-header">
          <img
            src="/images/logo-elite.png"
            alt="Elite Mídias"
            className="brand-logo"
          />
          <button className="pdf-button" onClick={() => setView("result")}>
            Rever relatório
          </button>
        </header>
        <section className="followup-section">
          <span className="section-kicker">
            Seu relatório continua com você
          </span>
          <h1 ref={headingRef} tabIndex={-1}>
            {qStatus === "nurture"
              ? "Comece pelas prioridades que cabem no seu momento."
              : "Vamos respeitar o momento da sua empresa."}
          </h1>
          <p>
            {qStatus === "nurture"
              ? "Você informou que o investimento de referência ainda não cabe no orçamento. Use o diagnóstico para organizar os primeiros ajustes e retome a conversa quando fizer sentido."
              : "Guarde as três prioridades e envolva quem decide junto com você. Quando houver um momento de execução, podemos retomar a análise."}
          </p>
          <div className="first-action">
            <span>Primeiro movimento sugerido</span>
            <p>{primary.action}</p>
          </div>
          <button
            className="primary-button green-button"
            onClick={() => setView("result")}
          >
            Voltar ao meu relatório <span>→</span>
          </button>
          <button className="text-button" onClick={beginQualification}>
            Revisar minhas respostas de qualificação
          </button>
          <a
            className="support-link"
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackMetaEvent("Contact")}
          >
            Quero tirar uma dúvida com a equipe ↗
          </a>
        </section>
        <Footer />
      </main>
    );

  if (view === "qualify") {
    const step = qualificationSteps[qualificationIndex],
      selected = qualification[step.id];
    return (
      <main className="quiz-page">
        <header className="quiz-header">
          <img
            src="/images/logo-elite.png"
            alt="Elite Mídias"
            className="brand-logo"
          />
          <div className="quiz-progress-meta">
            <span>Preparação da análise</span>
            <strong>{qualificationIndex + 1} de 3</strong>
          </div>
        </header>
        <div className="progress-track">
          <i style={{ width: `${((qualificationIndex + 1) / 3) * 100}%` }} />
        </div>
        <section className="question-stage">
          <div className="question-card">
            <button
              className="back-button"
              onClick={() => {
                setError("");
                if (qualificationIndex > 0) setQualificationIndex((i) => i - 1);
                else setView("result");
              }}
              disabled={submitting}
            >
              ← Voltar
            </button>
            <span className="question-eyebrow">{step.eyebrow}</span>
            <h1 ref={headingRef} tabIndex={-1}>
              {step.question}
            </h1>
            <p>{step.support}</p>
            <div
              className="options-list"
              role="radiogroup"
              aria-label={step.question}
            >
              {step.options.map((o, i) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected === o.value}
                  className={
                    selected === o.value ? "option selected" : "option"
                  }
                  onClick={() =>
                    setQualification((q) => ({
                      ...q,
                      [step.id]: String(o.value),
                    }))
                  }
                  disabled={submitting}
                  key={o.value}
                >
                  <OptionIcon index={i} />
                  <span>
                    <strong>{o.label}</strong>
                  </span>
                  <i>{selected === o.value ? "✓" : "→"}</i>
                </button>
              ))}
            </div>
            {error && (
              <p className="inline-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="primary-button green-button qualification-next"
              disabled={!selected || submitting}
              onClick={() => {
                if (qualificationIndex < 2) setQualificationIndex((i) => i + 1);
                else void finishQualification();
              }}
            >
              {submitting
                ? "Enviando suas respostas..."
                : qualificationIndex === 2
                  ? "Ver meu próximo passo"
                  : "Continuar"}
              <span>→</span>
            </button>
            <p className="entry-note">
              Seu relatório permanece disponível, independentemente destas
              respostas.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <img
          src="/images/logo-elite.png"
          alt="Elite Mídias"
          className="brand-logo"
        />
        <div className="quiz-header-tools">
          {view === "quiz" && (
            <button
              className="sound-toggle"
              onClick={() => setSoundOn((s) => !s)}
              aria-pressed={soundOn}
              aria-label={
                soundOn ? "Desativar sons do quiz" : "Ativar sons do quiz"
              }
            >
              {soundOn ? "◉ Som" : "○ Som"}
            </button>
          )}
          <div className="quiz-progress-meta">
            <span>
              {view === "gate"
                ? "Seu Raio X está pronto"
                : `Pergunta ${stepIndex + 1} de 8`}
            </span>
            <strong>
              {view === "gate" ? 100 : Math.round((stepIndex / 8) * 100)}%
            </strong>
          </div>
        </div>
      </header>
      <div className="progress-track">
        <i
          style={{ width: `${view === "gate" ? 100 : (stepIndex / 8) * 100}%` }}
        />
      </div>
      {view === "quiz" ? (
        <section className="question-stage" key={current.id}>
          <div className="question-card">
            <button
              className="back-button"
              onClick={() => {
                if (stepIndex > 0) setStepIndex((i) => i - 1);
                else setView("landing");
              }}
              disabled={transitioning}
            >
              ← Voltar
            </button>
            <span className="question-eyebrow">{current.eyebrow}</span>
            <h1 ref={headingRef} tabIndex={-1}>
              {current.question}
            </h1>
            <p>{current.support}</p>
            <div
              className="options-list"
              role="radiogroup"
              aria-label={current.question}
            >
              {current.options.map((o, i) => (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={answers[current.id] === o.value}
                  className={
                    answers[current.id] === o.value
                      ? "option selected"
                      : "option"
                  }
                  disabled={transitioning}
                  onClick={() => answer(o.value, i)}
                >
                  <b>{String.fromCharCode(65 + i)}</b>
                  <OptionIcon index={i} />
                  <span>
                    <strong>{o.label}</strong>
                  </span>
                  <i>{answers[current.id] === o.value ? "✓" : "→"}</i>
                </button>
              ))}
            </div>
            <div className="honesty-note">
              <span>●</span> Não precisa consultar planilhas. Responda pelo que
              acontece hoje.
            </div>
          </div>
        </section>
      ) : (
        <section className="gate-stage">
          <div className="gate-card">
            <button
              className="back-button"
              onClick={() => {
                setView("quiz");
                setStepIndex(7);
                setError("");
              }}
              disabled={submitting}
            >
              ← Revisar última resposta
            </button>
            <div className="gate-badge">Seu Raio X está pronto</div>
            <div className="report-teaser">
              <span>Seu primeiro ponto de atenção</span>
              <strong>{primary.name}</strong>
              <p>
                Identificamos três prioridades a partir das suas respostas. Abra
                o relatório para ver a justificativa e a primeira ação
                recomendada.
              </p>
            </div>
            <h1 ref={headingRef} tabIndex={-1}>
              Para quem devemos abrir o relatório?
            </h1>
            <p>
              Informe seus dados para visualizar o diagnóstico completo. Você
              poderá salvar em PDF e decidir se quer solicitar uma análise.
            </p>
            <form onSubmit={submit} className="lead-form">
              <label>
                <span>Seu nome</span>
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  value={lead.name}
                  onChange={(e) => setLead({ ...lead, name: e.target.value })}
                  placeholder="Como podemos chamar você?"
                />
              </label>
              <label>
                <span>Empresa</span>
                <input
                  required
                  minLength={2}
                  maxLength={180}
                  autoComplete="organization"
                  value={lead.company}
                  onChange={(e) =>
                    setLead({ ...lead, company: e.target.value })
                  }
                  placeholder="Nome do negócio"
                />
              </label>
              <label>
                <span>WhatsApp com DDD</span>
                <input
                  required
                  type="tel"
                  maxLength={25}
                  autoComplete="tel"
                  inputMode="tel"
                  value={lead.whatsapp}
                  onChange={(e) =>
                    setLead({ ...lead, whatsapp: e.target.value })
                  }
                  placeholder="(21) 99999-9999"
                />
              </label>
              <label>
                <span>Email · opcional</span>
                <input
                  type="email"
                  maxLength={180}
                  autoComplete="email"
                  value={lead.email}
                  onChange={(e) => setLead({ ...lead, email: e.target.value })}
                  placeholder="Se preferir contato por email"
                />
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button
                className="primary-button green-button"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Abrindo seu relatório..."
                  : "Abrir meu relatório gratuito"}
                <span>→</span>
              </button>
              <small>
                Ao continuar, você autoriza a Elite Mídias a usar esses dados
                para o diagnóstico e o contato sobre seu resultado.{" "}
                <a href="/privacidade" target="_blank">
                  Veja como usamos os dados.
                </a>
              </small>
            </form>
          </div>
          <aside className="gate-summary">
            <span>O que você vai encontrar</span>
            <h2>Uma direção clara para o próximo passo.</h2>
            <div>
              <b>01</b>
              <p>
                <strong>O gargalo provável</strong>Com a resposta que levou a
                essa hipótese.
              </p>
            </div>
            <div>
              <b>02</b>
              <p>
                <strong>Três prioridades</strong>Ações iniciais no contexto do
                seu segmento.
              </p>
            </div>
            <div>
              <b>03</b>
              <p>
                <strong>Seu mapa dos pilares</strong>O retrato da estrutura que
                você descreveu.
              </p>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}
