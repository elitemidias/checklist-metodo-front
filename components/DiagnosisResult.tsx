"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties, type Ref } from "react";
import { getDiagnosis, WHATSAPP, type Answers } from "@/lib/funnel";
import {
  getExecutionRecommendation,
  getResultHeadline,
} from "@/lib/result-presentation";
import "./result-summary.css";

type Diagnosis = ReturnType<typeof getDiagnosis>;
type ResultProps = {
  company: string;
  segment: string;
  answers: Answers;
  diagnosis: Diagnosis;
  headingRef?: Ref<HTMLHeadingElement>;
  onSchedule: () => void;
};

function AnimatedScore({ score, label }: { score: number; label: string }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(score);
      return;
    }
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
      role="img"
      aria-label={`${score} de 100. ${label}`}
      style={{ "--score": `${displayed * 3.6}deg` } as CSSProperties}
    >
      <div>
        <div className="score-value">
          <strong>{displayed}</strong>
          <span>/ 100</span>
        </div>
      </div>
    </div>
  );
}

function RadarChart({
  scores,
  idPrefix,
}: {
  scores: ReturnType<typeof getDiagnosis>["scores"];
  idPrefix: string;
}) {
  const c = 180,
    r = 112;
  const point = (i: number, s: number) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return `${c + Math.cos(a) * r * s},${c + Math.sin(a) * r * s}`;
  };
  return (
    <section
      className="radar-section"
      aria-labelledby={`${idPrefix}-radar-title`}
    >
      <div className="radar-copy">
        <span>Seu perfil em uma visão</span>
        <h2 id={`${idPrefix}-radar-title`}>
          Forças atuais e pontos de atenção.
        </h2>
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

function DetailedAnalysis({
  diagnosis,
  idPrefix,
}: {
  diagnosis: Diagnosis;
  idPrefix: string;
}) {
  return (
    <div className="detailed-analysis">
      <div className="detailed-pillar-list">
        {diagnosis.scores.map((pillar) => (
          <article className="print-pillar" key={pillar.id}>
            <h3>
              {pillar.name} <span>{pillar.percent}%</span>
            </h3>
            <p>{pillar.blurb}</p>
            <small>Você respondeu: {pillar.answer}</small>
          </article>
        ))}
      </div>
      <RadarChart scores={diagnosis.scores} idPrefix={idPrefix} />
      <p className="report-method-note">
        Autoavaliação baseada nas suas respostas, não uma auditoria. Os cinco
        pilares têm o mesmo peso. Cada resposta vale de zero a três pontos. A
        soma é convertida para uma nota de zero a cem. O faturamento dá contexto
        e não altera a nota.
      </p>
    </div>
  );
}

export function DiagnosisResult({
  company,
  segment,
  answers,
  diagnosis,
  headingRef,
  onSchedule,
}: ResultProps) {
  const primary = diagnosis.priorities[0];
  const executionPriorities = diagnosis.priorities.map((pillar) => ({
    ...pillar,
    execution: getExecutionRecommendation(segment, pillar),
  }));
  return (
    <>
      <div className="result-screen">
        <section
          className="report-band result-overview"
          aria-labelledby="result-title"
        >
          <div className="report-meta">
            <span>Seu Raio X está pronto</span>
            <strong>{company}</strong>
          </div>
          <div className="overview-dashboard">
            <div className="overview-conclusion">
              <AnimatedScore score={diagnosis.score} label={diagnosis.band} />
              <div>
                <span className="score-band">{diagnosis.band}</span>
                <h1 id="result-title" ref={headingRef} tabIndex={-1}>
                  {getResultHeadline(segment, primary.id, primary.points)}
                </h1>
                <p>
                  {segment} · {String(answers.goal)}
                </p>
              </div>
            </div>
            <div
              className="compact-pillars"
              aria-label="Sua maturidade nos cinco pilares"
            >
              {diagnosis.scores.map((pillar) => (
                <div
                  key={pillar.id}
                  className={pillar.id === primary.id ? "is-priority" : ""}
                >
                  <span>{pillar.name}</span>
                  <div
                    className="compact-pillar-track"
                    role="meter"
                    aria-label={pillar.name}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pillar.percent}
                  >
                    <i style={{ width: `${pillar.percent}%` }} />
                  </div>
                  <strong>{pillar.percent}%</strong>
                </div>
              ))}
            </div>
          </div>
          <p className="overview-note">
            Suas respostas indicam por onde começar. Na reunião, validamos o
            cenário e montamos seu plano.
          </p>
          <button className="primary-button green-button" onClick={onSchedule}>
            Agendar minha análise gratuita <span aria-hidden="true">→</span>
          </button>
          <small className="schedule-note">
            30 minutos. Antes da agenda, três perguntas rápidas.
          </small>
        </section>

        <section
          className="report-band result-priorities"
          aria-labelledby="result-priorities-title"
        >
          <div className="report-band-heading">
            <span>Seu plano inicial</span>
            <h2 id="result-priorities-title">Três ações para começar.</h2>
            <p>Ações e serviços que a Elite pode executar com você.</p>
          </div>
          <ol className="result-actions">
            {executionPriorities.map((pillar, index) => (
              <li key={pillar.id}>
                <span className="action-position">0{index + 1}</span>
                <div>
                  <strong>{pillar.name}</strong>
                  <p>{pillar.execution.action}</p>
                  <ul
                    className="execution-services"
                    aria-label={`Serviços da Elite para ${pillar.name}`}
                  >
                    {pillar.execution.services.map((service) => (
                      <li key={service}>
                        <span aria-hidden="true">✓</span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
          <details className="result-details">
            <summary>
              Ver análise completa e gráfico dos pilares{" "}
              <span aria-hidden="true">+</span>
            </summary>
            <DetailedAnalysis diagnosis={diagnosis} idPrefix="screen" />
          </details>
        </section>

        <section
          className="report-band result-invitation"
          aria-labelledby="result-invitation-title"
        >
          <div className="invitation-top">
            <div>
              <span className="invitation-kicker">
                Seu próximo passo com a Elite
              </span>
              <h2 id="result-invitation-title">
                Do diagnóstico ao plano para crescer.
              </h2>
            </div>
            <figure className="compact-ticket">
              <Image
                src="/images/passe-crescimento.png"
                alt="Passe para a análise estratégica gratuita"
                width={210}
                height={210}
                sizes="(max-width: 600px) 96px, 180px"
              />
            </figure>
          </div>
          <p className="invitation-description">
            Na reunião gratuita, você <b>recebe seu Mapa de Crescimento</b>, com
            estratégias específicas para o seu negócio.
          </p>
          <ul className="meeting-deliverables">
            <li>
              <span aria-hidden="true">✓</span> Três ações prioritárias
            </li>
            <li>
              <span aria-hidden="true">✓</span> Plano para os próximos 90 dias
            </li>
            <li>
              <span aria-hidden="true">✓</span> Indicadores para acompanhar
            </li>
          </ul>
          <div className="compact-meeting-bonus">
            <Image
              src="/images/presente-bonus.png"
              alt=""
              width={56}
              height={56}
            />
            <p>
              Participando da reunião, você também{" "}
              <b>recebe o Desafio Perfil que Vende.</b>
            </p>
          </div>
          <button className="primary-button green-button" onClick={onSchedule}>
            Agendar minha análise gratuita <span aria-hidden="true">→</span>
          </button>
          <p className="compact-disclaimer">
            Avaliação inicial baseada nas suas respostas. Não representa
            garantia de faturamento.
          </p>
        </section>
      </div>

      <article className="print-only-report">
        <header>
          <span>ELITE MÍDIAS · RAIO X</span>
          <h1>Seu relatório de oportunidades.</h1>
          <h2>{company}</h2>
          <p>
            {segment} · {String(answers.revenue)} · {String(answers.goal)}
          </p>
        </header>
        <div className="print-score-summary">
          <strong>
            {diagnosis.score}
            <small>/100</small>
          </strong>
          <div>
            <span>{diagnosis.band}</span>
            <h2>Sua primeira prioridade: {primary.name}.</h2>
          </div>
        </div>
        <section className="print-priorities">
          <h2>Suas três prioridades</h2>
          {executionPriorities.map((pillar, index) => (
            <article key={pillar.id} className="print-priority">
              <h3>
                {index + 1}. {pillar.name}
              </h3>
              <p>{pillar.action}</p>
              <p className="print-service-recommendation">
                <b>Como a Elite pode executar:</b>{" "}
                {pillar.execution.services.join(" · ")}
              </p>
              <small>Você respondeu: {pillar.answer}</small>
            </article>
          ))}
        </section>
        <section className="print-diagnosis">
          <h2>Visão completa dos cinco pilares</h2>
          <DetailedAnalysis diagnosis={diagnosis} idPrefix="print" />
        </section>
        <p className="print-report-disclaimer">
          Esta avaliação indica hipóteses a partir das suas respostas.
          Resultados dependem de contexto, investimento e execução. Não
          representa garantia de faturamento.
        </p>
        <footer className="print-report-contacts">
          <strong>Elite Mídias</strong>
          <a href="https://raiox.elitemidias.com">raiox.elitemidias.com</a>
          <a href="https://instagram.com/nandoborbaaa">
            instagram.com/nandoborbaaa
          </a>
          <a href={`https://wa.me/${WHATSAPP}`}>WhatsApp (21) 96655-9243</a>
        </footer>
      </article>
    </>
  );
}
