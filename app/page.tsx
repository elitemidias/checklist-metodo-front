"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

type Option = { label: string; value: string | number; detail?: string };
type QuizStep = {
  id: string;
  eyebrow: string;
  question: string;
  support: string;
  options: Option[];
  pillar?: string;
};

const contextSteps: QuizStep[] = [
  {
    id: "revenue",
    eyebrow: "Para calibrar o diagnóstico",
    question: "Qual é o faturamento médio mensal da empresa hoje?",
    support: "A faixa é usada apenas para comparar sua estrutura com o estágio atual do negócio.",
    options: [
      { label: "Até R$ 30 mil", value: "Até R$ 30 mil", detail: "Validando a máquina comercial" },
      { label: "R$ 30 mil a R$ 60 mil", value: "R$ 30 mil a R$ 60 mil", detail: "Buscando previsibilidade" },
      { label: "R$ 60 mil a R$ 100 mil", value: "R$ 60 mil a R$ 100 mil", detail: "Pronto para ganhar escala" },
      { label: "R$ 100 mil a R$ 300 mil", value: "R$ 100 mil a R$ 300 mil", detail: "Estruturando o próximo nível" },
      { label: "Acima de R$ 300 mil", value: "Acima de R$ 300 mil", detail: "Otimizando eficiência e expansão" },
    ],
  },
  {
    id: "segment",
    eyebrow: "Contexto do negócio",
    question: "Qual modelo descreve melhor sua empresa?",
    support: "Isso muda a forma como avaliamos aquisição, conversão e recorrência.",
    options: [
      { label: "Serviços profissionais", value: "Serviços profissionais" },
      { label: "Clínica, saúde ou estética", value: "Clínica, saúde ou estética" },
      { label: "Comércio ou e-commerce", value: "Comércio ou e-commerce" },
      { label: "Educação ou infoproduto", value: "Educação ou infoproduto" },
      { label: "Outro modelo", value: "Outro" },
    ],
  },
  {
    id: "goal",
    eyebrow: "Objetivo prioritário",
    question: "Qual resultado mais faria diferença nos próximos 90 dias?",
    support: "Escolha o que é prioridade agora — não o que seria bom ter um dia.",
    options: [
      { label: "Gerar mais oportunidades qualificadas", value: "Mais oportunidades qualificadas" },
      { label: "Vender com mais previsibilidade", value: "Mais previsibilidade" },
      { label: "Aumentar ticket e margem", value: "Aumentar ticket e margem" },
      { label: "Escalar sem depender do dono", value: "Escalar sem depender do dono" },
    ],
  },
];

const scoredSteps: QuizStep[] = [
  {
    id: "strategy-goal",
    pillar: "strategy",
    eyebrow: "E · Estratégia",
    question: "Existe uma meta comercial clara para os próximos 90 dias?",
    support: "Considere meta com número, prazo, responsável e acompanhamento.",
    options: [
      { label: "Não existe uma meta definida", value: 0 },
      { label: "Existe uma intenção, mas sem plano", value: 1 },
      { label: "Existe meta e plano, com acompanhamento irregular", value: 2 },
      { label: "Existe meta, plano e acompanhamento semanal", value: 3 },
    ],
  },
  {
    id: "strategy-icp",
    pillar: "strategy",
    eyebrow: "E · Estratégia",
    question: "Seu time sabe exatamente qual cliente deve atrair — e qual deve recusar?",
    support: "Um público amplo demais costuma aumentar custo e reduzir conversão.",
    options: [
      { label: "Tentamos vender para todo mundo", value: 0 },
      { label: "Temos uma ideia geral do perfil", value: 1 },
      { label: "O perfil ideal está definido, mas pouco usado", value: 2 },
      { label: "O perfil ideal orienta marketing, oferta e vendas", value: 3 },
    ],
  },
  {
    id: "leads-channel",
    pillar: "leads",
    eyebrow: "L · Leads",
    question: "De onde vêm os novos clientes do negócio hoje?",
    support: "Pense na origem que realmente gera receita, não apenas atenção.",
    options: [
      { label: "Quase só indicação e oportunidade espontânea", value: 0 },
      { label: "Alguns canais, mas sem consistência", value: 1 },
      { label: "Um canal principal gera oportunidades com frequência", value: 2 },
      { label: "Temos canais previsíveis e sabemos o custo de cada um", value: 3 },
    ],
  },
  {
    id: "leads-media",
    pillar: "leads",
    eyebrow: "L · Leads",
    question: "Como funciona o investimento em mídia paga?",
    support: "A maturidade está na leitura do retorno, não no valor investido.",
    options: [
      { label: "Não investimos ou paramos por falta de resultado", value: 0 },
      { label: "Investimos de forma pontual, sem leitura clara", value: 1 },
      { label: "Investimos continuamente e medimos leads", value: 2 },
      { label: "Medimos CAC, receita e retorno por campanha", value: 3 },
    ],
  },
  {
    id: "image-offer",
    pillar: "image",
    eyebrow: "I · Imagem & Oferta",
    question: "Um potencial cliente entende rapidamente por que deveria escolher sua empresa?",
    support: "Diferencial bom é percebido antes da conversa com o vendedor.",
    options: [
      { label: "Parecemos iguais aos concorrentes", value: 0 },
      { label: "O diferencial depende de muita explicação", value: 1 },
      { label: "A proposta de valor é clara na maior parte dos canais", value: 2 },
      { label: "A marca é reconhecida, desejada e sustenta o preço", value: 3 },
    ],
  },
  {
    id: "image-proof",
    pillar: "image",
    eyebrow: "I · Imagem & Oferta",
    question: "A comunicação usa provas que reduzem o risco percebido da compra?",
    support: "Casos, depoimentos, números e demonstrações tornam a decisão mais segura.",
    options: [
      { label: "Quase não mostramos provas", value: 0 },
      { label: "Temos provas dispersas ou antigas", value: 1 },
      { label: "Usamos boas provas em campanhas e vendas", value: 2 },
      { label: "Temos um sistema contínuo de prova e autoridade", value: 3 },
    ],
  },
  {
    id: "transformation-process",
    pillar: "transformation",
    eyebrow: "T · Transformação em Vendas",
    question: "O que acontece depois que um lead demonstra interesse?",
    support: "Velocidade, processo e acompanhamento definem quanto do marketing vira receita.",
    options: [
      { label: "Cada pessoa atende de um jeito", value: 0 },
      { label: "Existe um processo informal", value: 1 },
      { label: "Existe processo, CRM e algum acompanhamento", value: 2 },
      { label: "Existe processo medido, rápido e com follow-up", value: 3 },
    ],
  },
  {
    id: "transformation-conversion",
    pillar: "transformation",
    eyebrow: "T · Transformação em Vendas",
    question: "Você conhece a conversão entre lead, reunião e venda?",
    support: "Sem essas taxas, é difícil saber se o gargalo está no anúncio ou no atendimento.",
    options: [
      { label: "Não acompanhamos essas taxas", value: 0 },
      { label: "Temos uma percepção, sem dados confiáveis", value: 1 },
      { label: "Acompanhamos parte do funil", value: 2 },
      { label: "Acompanhamos o funil completo e agimos sobre os dados", value: 3 },
    ],
  },
  {
    id: "evolution-data",
    pillar: "evolution",
    eyebrow: "E · Evolução & Escala",
    question: "Marketing e vendas tomam decisões olhando para a mesma fonte de dados?",
    support: "Quando cada área tem uma versão dos números, a otimização vira opinião.",
    options: [
      { label: "Os dados são fragmentados ou inexistentes", value: 0 },
      { label: "Existem relatórios, mas geram pouca ação", value: 1 },
      { label: "Existe uma visão comum dos principais indicadores", value: 2 },
      { label: "Dados orientam orçamento, criativos e processo comercial", value: 3 },
    ],
  },
  {
    id: "evolution-scale",
    pillar: "evolution",
    eyebrow: "E · Evolução & Escala",
    question: "Se a demanda dobrasse no próximo mês, sua operação sustentaria o crescimento?",
    support: "Escala saudável exige capacidade de atender, vender e medir sem perder qualidade.",
    options: [
      { label: "Provavelmente entraria em colapso", value: 0 },
      { label: "Cresceria com bastante improviso", value: 1 },
      { label: "Sustentaria com alguns ajustes", value: 2 },
      { label: "Tem processo, time e números para absorver a demanda", value: 3 },
    ],
  },
];

const pillars = [
  { id: "strategy", letter: "E", name: "Estratégia", blurb: "Direção comercial, cliente ideal e prioridades.", action: "Definir uma meta de 90 dias e alinhar oferta, público e canal a um único objetivo de receita." },
  { id: "leads", letter: "L", name: "Leads", blurb: "Aquisição previsível e eficiência de mídia.", action: "Concentrar investimento no canal com melhor sinal de compra e medir custo por oportunidade, não só por lead." },
  { id: "image", letter: "I", name: "Imagem & Oferta", blurb: "Posicionamento, valor percebido e prova.", action: "Reformular a mensagem central com diferencial claro, prova específica e uma oferta difícil de comparar por preço." },
  { id: "transformation", letter: "T", name: "Transformação", blurb: "Processo comercial e conversão em receita.", action: "Criar velocidade de resposta, roteiro de qualificação e follow-up com taxas visíveis em cada etapa do funil." },
  { id: "evolution", letter: "E", name: "Evolução & Escala", blurb: "Dados, capacidade e otimização contínua.", action: "Unificar os números de marketing e vendas em um painel simples para decidir onde investir e o que corrigir." },
];

const allSteps = [...contextSteps, ...scoredSteps];

function getBand(score: number) {
  if (score < 40) return { name: "Crescimento no esforço", title: "Sua empresa vende, mas o crescimento ainda depende demais de esforço e oportunidade.", copy: "Há vazamentos importantes entre estratégia, aquisição e vendas. Antes de colocar mais verba, o maior ganho tende a vir de organizar a máquina." };
  if (score < 70) return { name: "Tração sem previsibilidade", title: "Você já construiu tração. O próximo salto está em transformar ações isoladas em sistema.", copy: "A base existe, mas alguns pontos ainda limitam a previsibilidade. Corrigir os gargalos certos pode produzir mais resultado sem simplesmente aumentar o investimento." };
  return { name: "Pronto para escalar", title: "Sua empresa tem uma boa base. Agora o jogo é escalar com eficiência e controle.", copy: "Oportunidades de crescimento estão menos no básico e mais em otimização: mensagem, conversão, CAC e capacidade de repetir o que já funciona." };
}

function OptionIcon({ index }: { index: number }) {
  const icon = index % 5;
  return (
    <svg className="option-icon" viewBox="0 0 24 24" aria-hidden="true">
      {icon === 0 && <><circle cx="12" cy="12" r="8"/><path d="M8 12h8"/></>}
      {icon === 1 && <><path d="M4 17c3-7 6 0 9-7s5-3 7-5"/><circle cx="5" cy="17" r="1.5"/><circle cx="13" cy="10" r="1.5"/></>}
      {icon === 2 && <><path d="M12 3l7 3v5c0 4.7-2.8 7.8-7 10-4.2-2.2-7-5.3-7-10V6l7-3z"/><path d="M8.5 12l2.2 2.2 4.8-5"/></>}
      {icon === 3 && <><path d="M4 18V6"/><path d="M4 18h16"/><path d="M7 15l4-4 3 2 5-7"/><path d="M15.5 6H19v3.5"/></>}
      {icon === 4 && <><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/><circle cx="12" cy="12" r="2.5"/></>}
    </svg>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [phase, setPhase] = useState<"quiz" | "gate" | "result">("quiz");
  const [lead, setLead] = useState({ name: "", company: "", whatsapp: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const pillarScores = useMemo(() => pillars.map((pillar) => {
    const related = scoredSteps.filter((step) => step.pillar === pillar.id);
    const points = related.reduce((sum, step) => sum + Number(answers[step.id] ?? 0), 0);
    return { ...pillar, points, percent: Math.round((points / (related.length * 3)) * 100) };
  }), [answers]);

  const totalScore = useMemo(() => {
    const points = scoredSteps.reduce((sum, step) => sum + Number(answers[step.id] ?? 0), 0);
    return Math.round((points / (scoredSteps.length * 3)) * 100);
  }, [answers]);

  const priorities = useMemo(() => [...pillarScores].sort((a, b) => a.percent - b.percent).slice(0, 3), [pillarScores]);
  const band = getBand(totalScore);
  const current = allSteps[stepIndex];
  const progress = phase === "quiz" ? Math.round(((stepIndex + 1) / allSteps.length) * 100) : 100;

  function playAnswerTone(index: number) {
    if (!soundOn || typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(360 + index * 70, context.currentTime);
    gain.gain.setValueAtTime(.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.07, context.currentTime + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .11);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + .12);
  }

  function answer(value: string | number, index: number) {
    playAnswerTone(index);
    setAnswers((previous) => ({ ...previous, [current.id]: value }));
    window.setTimeout(() => {
      if (stepIndex === allSteps.length - 1) setPhase("gate");
      else setStepIndex((index) => index + 1);
    }, 180);
  }

  function goBack() {
    if (phase === "gate") {
      setPhase("quiz");
      setStepIndex(allSteps.length - 1);
      return;
    }
    setStepIndex((index) => Math.max(0, index - 1));
  }

  async function submitLead(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    const payload = new FormData();
    payload.append("nome", lead.name);
    payload.append("empresa", lead.company);
    payload.append("whatsapp", lead.whatsapp);
    payload.append("email", lead.email);
    payload.append("faturamento", String(answers.revenue));
    payload.append("segmento", String(answers.segment));
    payload.append("objetivo", String(answers.goal));
    payload.append("score_elite", `${totalScore}/100 — ${band.name}`);
    payload.append("prioridades", priorities.map((item) => `${item.name}: ${item.percent}%`).join(" | "));
    payload.append("respostas", scoredSteps.map((step) => `${step.id}: ${answers[step.id]}`).join(" | "));

    try {
      const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
      if (!isLocalPreview) await fetch("https://formspree.io/f/xgodrpnk", { method: "POST", body: payload, headers: { Accept: "application/json" } });
    } catch {
      // O diagnóstico não fica bloqueado se o serviço de captura estiver indisponível.
    }
    setSubmitting(false);
    setPhase("result");
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }

  const whatsappText = encodeURIComponent(`Olá! Sou ${lead.name || "um empresário"}, da ${lead.company || "minha empresa"}. Fiz o Diagnóstico E.L.I.T.E., meu score foi ${totalScore}/100 (${band.name}) e meu principal gargalo foi ${priorities[0]?.name}. Faturamento: ${answers.revenue}. Quero agendar meu Mapa de Crescimento.`);
  const whatsappHref = `https://wa.me/5521999468989?text=${whatsappText}`;

  function startDiagnostic() {
    setStarted(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  if (!started) {
    return (
      <main className="site-shell">
        <header className="topbar">
          <img src="/images/logo-elite.png" alt="Elite Mídias" className="brand-logo" />
          <div className="topbar-actions"><span className="topbar-note"><i /> Diagnóstico estratégico gratuito</span><button className="header-cta" onClick={startDiagnostic}>Começar agora</button></div>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="kicker"><span>Diagnóstico E.L.I.T.E.</span> · Para empresas que já vendem</div>
            <h1>Descubra o que impede sua empresa de <em>crescer com previsibilidade.</em></h1>
            <p className="hero-lead">Em menos de 3 minutos, identifique onde sua empresa perde oportunidades entre marketing, vendas e escala. Ao final, receba seu <strong>Relatório de Oportunidades</strong> com as alavancas criadas para ajudar o seu negócio a aumentar o faturamento de forma exponencial.</p>
            <button className="primary-button green-button" onClick={startDiagnostic}>
              Fazer meu diagnóstico <span>→</span>
            </button>
            <div className="trust-row">
              <span>✓ Resultado personalizado</span>
              <span>✓ Sem respostas “certas”</span>
              <span>✓ Plano de prioridades</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Visualização dos cinco pilares do crescimento">
            <div className="visual-glow" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="score-preview">
              <div className="preview-label">Seu sistema de crescimento</div>
              <div className="preview-score">E.L.I.T.E.</div>
              <div className="preview-bars">
                {[82, 61, 74, 48, 67].map((value, index) => <span key={index} style={{ "--bar": `${value}%` } as React.CSSProperties} />)}
              </div>
              <div className="preview-caption">5 áreas analisadas · 3 prioridades reveladas</div>
            </div>
            <span className="floating-tag tag-one">Aquisição</span>
            <span className="floating-tag tag-two">Conversão</span>
            <span className="floating-tag tag-three">Escala</span>
          </div>
        </section>

        <section className="method-section" aria-label="Áreas analisadas pelo método E.L.I.T.E.">
          <div className="section-heading method-heading"><span>O sistema por trás do diagnóstico</span><h2>Cinco áreas conectadas. Um único objetivo: crescimento.</h2></div>
          <div className="method-system">
            <div className="method-core"><small>Diagnóstico</small><strong>E.L.I.T.E.</strong><i /></div>
            {pillars.map((pillar, index) => (
              <article key={pillar.id} className={`method-node node-${index + 1}`} style={{ "--delay": `${index * .16}s` } as React.CSSProperties}>
                <b>{pillar.letter}</b><span><strong>{pillar.name}</strong><small>{pillar.blurb}</small></span>
              </article>
            ))}
          </div>
          <button className="primary-button green-button method-cta" onClick={startDiagnostic}>Quero descobrir minhas oportunidades <span>→</span></button>
        </section>

        <section className="how-it-works">
          <div className="section-heading">
            <span>Não é mais um quiz genérico</span>
            <h2>Um raio-x da sua máquina de crescimento.</h2>
          </div>
          <div className="steps-grid">
            <article><b>01</b><h3>Você responde</h3><p>Perguntas objetivas sobre o que acontece hoje, sem exigir planilhas.</p></article>
            <article><b>02</b><h3>O sistema cruza</h3><p>Seu estágio de receita com cinco áreas que influenciam crescimento.</p></article>
            <article><b>03</b><h3>Você prioriza</h3><p>Recebe score, gargalos e próximos movimentos em ordem de impacto.</p></article>
          </div>
        </section>

        <footer className="footer"><img src="/images/logo-elite.png" alt="" /><p>Elite Mídias · Estratégia, performance e crescimento.</p><a href="https://www.instagram.com/elitemidiasmkt" target="_blank" rel="noreferrer">@elitemidiasmkt</a></footer>
      </main>
    );
  }

  if (phase === "result") {
    return (
      <main className="result-page">
        <header className="quiz-header result-header">
          <img src="/images/logo-elite.png" alt="Elite Mídias" className="brand-logo" />
          <div className="result-header-actions"><span>Diagnóstico concluído</span><button className="pdf-button" onClick={() => window.print()}>Salvar relatório em PDF</button></div>
        </header>

        <section className="result-hero">
          <div className="result-kicker">Seu diagnóstico E.L.I.T.E. · {lead.company || "Sua empresa"}</div>
          <div className="result-grid">
            <div>
              <h1>{band.title}</h1>
              <p>{band.copy}</p>
              <div className="result-context"><span>Estágio informado</span><strong>{String(answers.revenue)}</strong><i>·</i><strong>{String(answers.goal)}</strong></div>
            </div>
            <div className="score-ring" style={{ "--score": `${totalScore * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{totalScore}</strong><span>/100</span><small>{band.name}</small></div>
            </div>
          </div>
        </section>

        <section className="results-body">
          <div className="result-section-title"><span>Visão por pilar</span><h2>Onde sua máquina ganha — e perde — força.</h2></div>
          <div className="pillar-results">
            {pillarScores.map((pillar) => (
              <article key={pillar.id} className={pillar.percent < 45 ? "needs-attention" : ""}>
                <div className="pillar-result-top"><b>{pillar.letter}</b><span><strong>{pillar.name}</strong><small>{pillar.blurb}</small></span><em>{pillar.percent}%</em></div>
                <div className="result-bar"><i style={{ width: `${pillar.percent}%` }} /></div>
              </article>
            ))}
          </div>

          <div className="priority-section">
            <div className="result-section-title"><span>Seu plano prioritário</span><h2>As 3 alavancas para atacar primeiro.</h2><p>Mais ações não significam mais crescimento. A ordem abaixo considera os pontos de menor maturidade no seu diagnóstico.</p></div>
            <div className="priority-grid">
              {priorities.map((priority, index) => (
                <article key={priority.id}>
                  <div className="priority-number">0{index + 1}</div>
                  <span>{priority.letter} · {priority.name}</span>
                  <h3>{index === 0 ? "Gargalo principal" : index === 1 ? "Próxima alavanca" : "Base para sustentar"}</h3>
                  <p>{priority.action}</p>
                </article>
              ))}
            </div>
          </div>

          <section className="final-cta">
            <div className="cta-copy">
              <span>Seu passe estratégico gratuito</span>
              <h2>O relatório mostra o problema. A reunião transforma as oportunidades em um <em>plano executável.</em></h2>
              <p>Reserve uma Análise Estratégica de 45 minutos com a Elite Mídias. Vamos abrir o seu diagnóstico, identificar as decisões com maior potencial de impacto e desenhar o caminho dos próximos 90 dias. Não deixe esse relatório virar apenas mais uma informação salva.</p>
              <ul><li>Diagnóstico do funil com um especialista</li><li>Prioridades organizadas por impacto e esforço</li><li>Mapa de Crescimento para os próximos 90 dias</li></ul>
            </div>
            <div className="cta-card">
              <div className="ticket-visual"><img src="/images/passe-crescimento.png" alt="Passe estratégico gratuito para uma reunião com a Elite Mídias"/><span>Passe gratuito</span></div>
              <div className="mini-score"><span>Seu ponto de partida</span><strong>{totalScore}/100</strong></div>
              <h3>Reserve seu Mapa de Crescimento E.L.I.T.E.</h3>
              <p>Uma conversa estratégica aplicada ao seu negócio. Sem apresentação genérica e sem compromisso de contratação.</p>
              <a className="primary-button green-button" href={whatsappHref} target="_blank" rel="noreferrer">Quero reservar meu passe <span>→</span></a>
              <button className="pdf-button report-download" onClick={() => window.print()}>Salvar meu relatório em PDF</button>
              <small>Sem custo. As agendas são liberadas conforme disponibilidade e aderência do negócio.</small>
            </div>
          </section>

          <p className="result-disclaimer">O diagnóstico é orientativo e não representa garantia de faturamento ou resultado. Crescimento depende de execução, contexto, investimento e condições de mercado.</p>
        </section>
        <footer className="footer result-footer"><img src="/images/logo-elite.png" alt="" /><p>Elite Mídias · Estratégia, performance e crescimento.</p><a href="https://www.elitemidias.com.br" target="_blank" rel="noreferrer">elitemidias.com.br</a></footer>
      </main>
    );
  }

  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <img src="/images/logo-elite.png" alt="Elite Mídias" className="brand-logo" />
        <div className="quiz-header-tools"><button className="sound-toggle" onClick={() => setSoundOn((value) => !value)} aria-pressed={soundOn} aria-label={soundOn ? "Desativar sons do quiz" : "Ativar sons do quiz"}>{soundOn ? "◉ Som" : "○ Som"}</button><div className="quiz-progress-meta"><span>{phase === "gate" ? "Diagnóstico calculado" : `Pergunta ${stepIndex + 1} de ${allSteps.length}`}</span><strong>{progress}%</strong></div></div>
      </header>
      <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>

      {phase === "quiz" ? (
        <section className="question-stage" key={current.id}>
          <div className="question-card">
            <button className="back-button" onClick={goBack} disabled={stepIndex === 0} aria-label="Voltar para a pergunta anterior">← Voltar</button>
            <span className="question-eyebrow">{current.eyebrow}</span>
            <h1>{current.question}</h1>
            <p>{current.support}</p>
            <div className="options-list" role="radiogroup" aria-label={current.question}>
              {current.options.map((option, index) => {
                const selected = answers[current.id] === option.value;
                return (
                  <button key={`${current.id}-${index}`} className={selected ? "option selected" : "option"} onClick={() => answer(option.value, index)} role="radio" aria-checked={selected}>
                    <b>{String.fromCharCode(65 + index)}</b>
                    <OptionIcon index={index} />
                    <span><strong>{option.label}</strong>{option.detail && <small>{option.detail}</small>}</span>
                    <i>{selected ? "✓" : "→"}</i>
                  </button>
                );
              })}
            </div>
            <div className="honesty-note"><span>●</span> Responda pelo que acontece hoje. O diagnóstico fica melhor quando a resposta é realista.</div>
          </div>
        </section>
      ) : (
        <section className="gate-stage">
          <div className="gate-card">
            <button className="back-button" onClick={goBack}>← Revisar última resposta</button>
            <div className="gate-badge">Diagnóstico calculado</div>
            <div className="locked-preview">
              <div className="blurred-score" aria-hidden="true">{totalScore}</div>
              <span>Seu Relatório de Oportunidades, score e 3 prioridades estão prontos.</span>
            </div>
            <h1>Para quem devemos entregar o Relatório de Oportunidades?</h1>
            <p>Preencha seus dados profissionais para liberar o resultado completo. A Elite Mídias não envia spam.</p>
            <form onSubmit={submitLead} className="lead-form">
              <label><span>Seu nome</span><input required autoComplete="name" value={lead.name} onChange={(event) => setLead({ ...lead, name: event.target.value })} placeholder="Como podemos chamar você?" /></label>
              <label><span>Empresa</span><input required autoComplete="organization" value={lead.company} onChange={(event) => setLead({ ...lead, company: event.target.value })} placeholder="Nome do negócio" /></label>
              <label><span>WhatsApp</span><input required autoComplete="tel" inputMode="tel" value={lead.whatsapp} onChange={(event) => setLead({ ...lead, whatsapp: event.target.value })} placeholder="(21) 99999-9999" /></label>
              <label><span>E-mail profissional</span><input required type="email" autoComplete="email" value={lead.email} onChange={(event) => setLead({ ...lead, email: event.target.value })} placeholder="voce@empresa.com.br" /></label>
              <button className="primary-button green-button" type="submit" disabled={submitting}>{submitting ? "Preparando seu relatório..." : "Ver meu Relatório de Oportunidades"}<span>→</span></button>
              <small>Ao continuar, você concorda em receber o diagnóstico e um contato da Elite Mídias sobre o resultado.</small>
            </form>
          </div>
          <aside className="gate-summary">
            <span>Seu entregável</span>
            <h2>Um relatório para enxergar onde está o dinheiro escondido.</h2>
            <div><b>01</b><p><strong>Score de maturidade</strong>Visão simples do estágio atual.</p></div>
            <div><b>02</b><p><strong>Leitura por pilar</strong>Onde o funil perde mais força.</p></div>
            <div><b>03</b><p><strong>Plano prioritário</strong>As três alavancas para atacar primeiro.</p></div>
          </aside>
        </section>
      )}
    </main>
  );
}
