"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import "./landing-presentation.css";

type StartProps = { onStart: () => void };

function SparkIcon({
  kind = "route",
}: {
  kind?: "route" | "target" | "check";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "target" ? (
        <>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="m14 10 6-6m-4 0h4v4" />
        </>
      ) : kind === "check" ? (
        <>
          <path d="m8 12 3 3 6-7" />
          <path d="M12 3 3 7v6c0 4 9 8 9 8s9-4 9-8V7l-9-4Z" />
        </>
      ) : (
        <>
          <circle cx="5" cy="5" r="2" />
          <circle cx="19" cy="19" r="2" />
          <path d="M7 5h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h8" />
        </>
      )}
    </svg>
  );
}

export function FounderHero() {
  return (
    <figure
      className="founder-hero"
      aria-label="Nando Borba e o diagnóstico Elite Mídias"
    >
      <div className="founder-halo" aria-hidden="true" />
      <div className="founder-scan" aria-hidden="true" />
      <Image
        src="/images/nando-borba.png"
        alt="Nando Borba, fundador da Elite Mídias"
        width={1536}
        height={1536}
        priority
        sizes="(max-width: 700px) 94vw, (max-width: 1100px) 46vw, 560px"
        className="founder-hero-photo"
      />
      <div className="founder-insight">
        <span className="insight-icon">
          <SparkIcon kind="target" />
        </span>
        <div>
          <small>Antes de investir mais</small>
          <strong>Encontre a prioridade certa.</strong>
        </div>
        <span className="insight-status" aria-hidden="true" />
      </div>
      <div className="founder-orbit-label orbit-strategy">
        <i /> Estratégia
      </div>
      <div className="founder-orbit-label orbit-conversion">
        <i /> Conversão
      </div>
      <figcaption>
        <span className="founder-signature">Nando Borba</span>
        <span>Fundador da Elite Mídias</span>
      </figcaption>
    </figure>
  );
}

function SignalDiagram({ connected }: { connected: boolean }) {
  return (
    <svg
      viewBox="0 0 400 156"
      aria-hidden="true"
      className={
        connected ? "signal-diagram connected" : "signal-diagram fragmented"
      }
    >
      <path
        className="diagram-grid"
        d="M0 39h400M0 78h400M0 117h400M50 0v156M100 0v156M150 0v156M200 0v156M250 0v156M300 0v156M350 0v156"
      />
      {connected ? (
        <>
          <path className="signal-path" d="M78 78h75m68 0h90" />
          <path className="signal-pulse" d="M78 78h75m68 0h90" />
          <circle className="signal-destination" cx="342" cy="78" r="25" />
        </>
      ) : (
        <>
          <path
            className="signal-path"
            d="m78 78 35-25 20 53 23-28m65 0 32 29 20-54 27 25"
          />
          <path
            className="signal-break"
            d="m116 121 8-8m-8 0 8 8m143-88 8-8m-8 0 8 8"
          />
        </>
      )}
      <g className="diagram-node">
        <rect x="27" y="51" width="56" height="54" rx="13" />
        <path d="m43 75 23-9v25l-23-8v-8Zm0 0v8m9 3 3 10" />
      </g>
      <g className="diagram-node">
        <rect x="164" y="51" width="56" height="54" rx="13" />
        <rect x="177" y="65" width="30" height="24" rx="3" />
        <path d="M177 72h30m-25 6h12m-12 5h18" />
      </g>
      <g className="diagram-node">
        <rect x="311" y="51" width="56" height="54" rx="13" />
        <path d="m326 79 9 8 17-19" />
      </g>
      {!connected && (
        <>
          <circle className="signal-lost" cx="115" cy="34" r="4" />
          <circle className="signal-lost" cx="262" cy="129" r="4" />
        </>
      )}
    </svg>
  );
}

const comparisons = [
  {
    title: "Ponto de partida",
    generic: "Um pacote de campanhas igual para negócios diferentes.",
    elite:
      "Diagnóstico do seu segmento, do seu momento e do que precisa mudar primeiro.",
  },
  {
    title: "O que recebe atenção",
    generic: "Anúncios e posts tratados como peças isoladas.",
    elite:
      "Oferta, anúncios, página e atendimento analisados como partes do mesmo caminho.",
  },
  {
    title: "O que orienta a conversa",
    generic: "Cliques, alcance e um relatório difícil de traduzir em decisão.",
    elite:
      "Qualidade das oportunidades, pontos de perda e próximos ajustes explicados com clareza.",
  },
  {
    title: "Depois que o contato chega",
    generic: "O anúncio termina o trabalho. O restante fica desconectado.",
    elite:
      "Ajustamos com você o que falta no seu atendimento para fechar mais vendas.",
  },
  {
    title: "Antes de aumentar a verba",
    generic: "Mais investimento vira a primeira resposta.",
    elite:
      "Primeiro, entender o gargalo. Depois, decidir onde faz sentido investir.",
  },
];

export function AgencyComparison({ onStart }: StartProps) {
  return (
    <section
      className="agency-comparison"
      id="diferenca-elite"
      aria-labelledby="comparison-title"
    >
      <div className="comparison-heading">
        <span className="section-kicker">Agência genérica × Elite Mídias</span>
        <h2 id="comparison-title">
          Não basta colocar anúncios no ar.
          <br />
          <em>As peças precisam trabalhar juntas.</em>
        </h2>
        <p>
          A diferença está no que acontece entre o primeiro clique e a decisão
          do seu cliente.
        </p>
      </div>
      <div className="comparison-scenes">
        <div>
          <SignalDiagram connected={false} />
          <span>Peças soltas. Decisões no escuro.</span>
        </div>
        <div>
          <SignalDiagram connected />
          <span>Um caminho conectado ao seu negócio.</span>
        </div>
      </div>
      <div className="comparison-table-wrap">
        <div className="comparison-intro">
          Compare outras agências com a Elite Mídias aqui
        </div>
        <table className="comparison-table">
          <caption>
            Comparação de abordagens: uma operação genérica focada em tarefas e
            a forma de trabalhar da Elite Mídias.
          </caption>
          <thead>
            <tr>
              <th scope="col">Na prática</th>
              <th scope="col">Com uma agência genérica</th>
              <th scope="col">
                <span className="elite-table-symbol" aria-hidden="true">
                  E
                </span>{" "}
                Com a Elite Mídias
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row) => (
              <tr key={row.title}>
                <th scope="row">{row.title}</th>
                <td>
                  <span className="comparison-mobile-label">
                    Agência genérica
                  </span>
                  <span className="comparison-cell">
                    <i aria-hidden="true">×</i>
                    {row.generic}
                  </span>
                </td>
                <td>
                  <span className="comparison-mobile-label">Elite Mídias</span>
                  <span className="comparison-cell">
                    <i aria-hidden="true">✓</i>
                    {row.elite}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="comparison-bottom">
        <p>
          “Genérica” descreve a abordagem ilustrada acima, não todas as
          agências. O trabalho da Elite é definido conforme a necessidade e o
          escopo de cada projeto.
        </p>
        <button className="primary-button green-button" onClick={onStart}>
          Quero descobrir o que precisa mudar <span>→</span>
        </button>
      </div>
    </section>
  );
}

export function LeandroTestimonial({ onStart }: StartProps) {
  const player = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  async function play() {
    try {
      await player.current?.play();
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }
  return (
    <section
      className="leandro-story"
      id="historia-leandro"
      aria-labelledby="leandro-title"
    >
      <div className="testimonial-copy">
        <span className="section-kicker">
          Uma empresa real. Uma história real.
        </span>
        <h2 id="leandro-title">
          Por trás de cada negócio,
          <br />
          <em>existe a vida de alguém.</em>
        </h2>
        <p>
          O Leandro chegou em um momento difícil. No vídeo, ele conta o que a
          mudança de estratégia representou para a empresa dele.
        </p>
        <blockquote>
          <span aria-hidden="true">“</span>Ele pegou a minha empresa numa baixa.
        </blockquote>
        <div className="testimonial-author">
          <span className="author-mark" aria-hidden="true">
            L
          </span>
          <div>
            <strong>Leandro</strong>
            <span>Empresário do setor de serviços</span>
          </div>
          <span className="real-story-label">
            <SparkIcon kind="check" /> Relato em vídeo
          </span>
        </div>
        <button className="primary-button green-button" onClick={onStart}>
          Quero clareza para o meu negócio <span>→</span>
        </button>
        <small>
          A experiência é individual. O depoimento não representa garantia de
          resultado para outras empresas.
        </small>
      </div>
      <div className="testimonial-media">
        <div className="video-frame">
          <video
            ref={player}
            controls
            playsInline
            preload="none"
            poster="/images/leandro-depoimento.jpg"
            aria-label="Depoimento de Leandro, empresário do setor de serviços"
            onPlay={() => setStarted(true)}
            onError={() => setFailed(true)}
          >
            <source src="/media/depoimento-leandro.mp4" type="video/mp4" />
            Seu navegador não suporta a reprodução deste vídeo.
          </video>
          {!started && (
            <button
              className="video-play-button"
              onClick={() => void play()}
              aria-label="Assistir ao depoimento do Leandro"
            >
              <span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m9 5 11 7-11 7Z" />
                </svg>
              </span>
              <b>Ouça o Leandro</b>
              <small>38 segundos</small>
            </button>
          )}
          <div className="video-top-label" aria-hidden="true">
            <i /> Voz de quem confiou na Elite
          </div>
        </div>
        {failed && (
          <p className="video-error" role="status">
            Não conseguiu reproduzir?{" "}
            <a
              href="/media/depoimento-leandro.mp4"
              target="_blank"
              rel="noreferrer"
            >
              Abra o vídeo em outra aba.
            </a>
          </p>
        )}
        <details className="testimonial-summary">
          <summary>Ler o resumo do relato</summary>
          <p>
            Leandro relata que a empresa estava em um período de baixa. Ele fala
            sobre a reorganização da estratégia de divulgação para concentrar o
            investimento no canal com maior potencial para o negócio.
          </p>
        </details>
      </div>
    </section>
  );
}

const marketSegments = [
  {
    id: "estetica",
    name: "Estética e clínicas",
    description: "Mais contatos que viram agendamentos.",
    icon: (
      <>
        <path d="M12 3v18M3 12h18M7 7l10 10M7 17 17 7" />
        <circle cx="12" cy="12" r="5" />
      </>
    ),
  },
  {
    id: "cirurgia-plastica",
    name: "Cirurgia plástica",
    description: "Confiança do primeiro contato à avaliação.",
    icon: (
      <>
        <path d="M8 3v5a4 4 0 0 0 8 0V3M6 3h4m4 0h4M12 12v3a5 5 0 0 0 10 0v-2" />
        <circle cx="21" cy="10" r="2" />
      </>
    ),
  },
  {
    id: "distribuidora",
    name: "Distribuidoras",
    description: "Mais compradores, pedidos e recompra.",
    icon: (
      <>
        <path d="m3 7 9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7M12 11v10M7.5 5 17 9" />
      </>
    ),
  },
  {
    id: "industria",
    name: "Indústria e fábrica",
    description: "Da cotação ao pedido fechado.",
    icon: (
      <>
        <path d="M3 21V10l6 3V8l6 4V3h4l2 18H3ZM7 17h1m4 0h1m4 0h1" />
      </>
    ),
  },
  {
    id: "servicos",
    name: "Serviços",
    description: "Do orçamento à venda, sem perder o contato.",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V3h8v4M3 12a25 25 0 0 0 18 0M10 13h4v3h-4z" />
      </>
    ),
  },
  {
    id: "comercio",
    name: "Comércio",
    description: "Do interesse à compra e à próxima visita.",
    icon: (
      <>
        <path d="M4 10v11h16V10M3 3h18l1 7a3 3 0 0 1-5 2 3 3 0 0 1-5 0 3 3 0 0 1-5 0 3 3 0 0 1-5-2l1-7ZM9 21v-6h6v6M7 3l-1 7m6-7v7m5-7 1 7" />
      </>
    ),
  },
];

export function MarketSegments() {
  return (
    <section className="market-strip" aria-labelledby="market-title">
      <div>
        <span className="section-kicker">
          Seu mercado tem uma jornada própria
        </span>
        <h2 id="market-title">
          Perguntas do seu negócio.
          <br />
          <em>Não de qualquer negócio.</em>
        </h2>
        <p>
          Do contato ao agendamento. Da cotação ao pedido. O Raio X acompanha a
          realidade do seu segmento.
        </p>
      </div>
      <ul>
        {marketSegments.map((segment) => (
          <li key={segment.id} className="sector-card">
            <Image
              src={`/images/segmentos/${segment.id}-v1.png`}
              alt=""
              fill
              sizes="(max-width: 760px) 50vw, (max-width: 1240px) 33vw, 390px"
              className="sector-card-image"
            />
            <div className="sector-card-content">
              <span className="sector-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {segment.icon}
                </svg>
              </span>
              <h3>{segment.name}</h3>
              <p>{segment.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <small className="market-image-note">
        Imagens ilustrativas dos segmentos.
      </small>
    </section>
  );
}

export function GrowthMapPreview() {
  return (
    <article className="growth-map-preview" aria-labelledby="growth-map-title">
      <div className="growth-map-cover">
        <div className="growth-map-top">
          <span>ELITE MÍDIAS</span>
          <b>90 DIAS</b>
        </div>
        <h3 id="growth-map-title">
          Seu Mapa
          <br />
          <em>de Crescimento.</em>
        </h3>
        <div className="growth-map-route" aria-hidden="true">
          <svg viewBox="0 0 430 195">
            <path
              className="map-route-shadow"
              d="M35 142C90 142 65 55 145 55S220 142 270 115 330 40 395 40"
            />
            <path
              className="map-route-line"
              d="M35 142C90 142 65 55 145 55S220 142 270 115 330 40 395 40"
            />
            {[
              [35, 142],
              [145, 55],
              [270, 115],
              [395, 40],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle
                  className="map-route-halo"
                  cx={x}
                  cy={y}
                  r={i === 3 ? 20 : 14}
                />
                <circle cx={x} cy={y} r="5" />
              </g>
            ))}
            <path className="map-destination" d="M395 16v-7l18 5-18 5" />
          </svg>
          <span className="map-label map-label-first">Seu cenário</span>
          <span className="map-label map-label-last">Próximos passos</span>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <strong>O que corrigir</strong>
              <small>Três prioridades do seu negócio.</small>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>Em qual ordem agir</strong>
              <small>Uma sequência de execução.</small>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>O que acompanhar</strong>
              <small>Indicadores para orientar ajustes.</small>
            </div>
          </li>
        </ol>
        <div className="map-meeting-stamp">
          <SparkIcon />
          <span>
            Construído na reunião.
            <br />
            <strong>Pensado para a sua empresa.</strong>
          </span>
        </div>
      </div>
      <p className="map-preview-note">
        Prévia ilustrativa do formato. O mapa será construído na reunião, a
        partir do seu diagnóstico e da conversa com a equipe.
      </p>
    </article>
  );
}
