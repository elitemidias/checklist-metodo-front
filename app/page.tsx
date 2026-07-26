"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { trackMetaEvent } from "@/components/MetaPixel";

type Option = { label: string; value: string | number; detail?: string };
const CRM_INGEST_URL = "https://elite-midias-crm.vercel.app/api/ingest/8641bbc01861d75ff8475f754a7c5cbc";

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
      { label: "Até R$ 20 mil", value: "Até R$ 20 mil", detail: "Validando a máquina comercial" },
      { label: "R$ 20 mil a R$ 30 mil", value: "R$ 20 mil a R$ 30 mil", detail: "Estruturando a base comercial" },
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
      { label: "Comércio ou loja virtual", value: "Comércio ou loja virtual" },
      { label: "Educação ou infoproduto", value: "Educação ou infoproduto" },
      { label: "Outro modelo", value: "Outro" },
    ],
  },
  {
    id: "goal",
    eyebrow: "Objetivo prioritário",
    question: "Qual resultado mais faria diferença nos próximos 90 dias?",
    support: "Escolha o que é prioridade agora. Pense no que mais faria diferença nos próximos 90 dias.",
    options: [
      { label: "Gerar mais oportunidades qualificadas", value: "Mais oportunidades qualificadas" },
      { label: "Vender com mais previsibilidade", value: "Mais previsibilidade" },
      { label: "Aumentar ticket e margem", value: "Aumentar ticket e margem" },
      { label: "Escalar sem depender do dono", value: "Escalar sem depender do dono" },
    ],
  },
];

function scored(id: string, pillar: string, eyebrow: string, question: string, support: string, labels: string[]): QuizStep {
  return { id, pillar, eyebrow, question, support, options: labels.map((label, value) => ({ label, value })) };
}

const segmentQuestionBanks: Record<string, QuizStep[]> = {
  "Serviços profissionais": [
    scored("strategy-goal","strategy","Seu próximo nível","Existe uma meta clara de contratos ou receita para os próximos 90 dias?","Uma meta comercial precisa conectar quantidade de oportunidades, propostas e fechamentos.",["Não existe uma meta definida","Existe uma intenção, mas sem conta reversa","Temos meta e plano, com acompanhamento irregular","A meta orienta pipeline, agenda e decisões semanais"]),
    scored("image-offer","image","Valor percebido","Antes da reunião, o potencial cliente entende por que deveria contratar você?","Quando o valor só aparece na conversa, a venda depende demais do vendedor.",["Parecemos iguais aos concorrentes","O diferencial exige muita explicação","A proposta é clara na maioria dos canais","O posicionamento gera desejo e sustenta nosso preço"]),
    scored("leads-channel","leads","Origem das oportunidades","Como novas oportunidades comerciais chegam até você hoje?","Considere oportunidades com perfil e intenção, não apenas seguidores ou contatos.",["Quase exclusivamente por indicação","Por ações isoladas e imprevisíveis","Um canal principal alimenta a agenda","Temos canais previsíveis com custo conhecido"]),
    scored("leads-demand","leads","Previsibilidade","Se as indicações parassem por 60 dias, sua agenda comercial continuaria cheia?","Essa resposta revela se existe uma máquina de aquisição ou apenas reputação acumulada.",["A agenda praticamente pararia","Teríamos uma queda forte","Manteríamos parte do volume","A demanda continuaria previsível"]),
    scored("transformation-speed","transformation","Momento da verdade","O que acontece quando alguém pede informações ou solicita uma proposta?","Velocidade e qualificação determinam quanto interesse vira reunião.",["Cada pessoa responde de um jeito","Respondemos, mas sem padrão ou velocidade","Temos roteiro, responsável e algum controle","Resposta, qualificação e agendamento são rápidos e medidos"]),
    scored("transformation-close","transformation","Da reunião ao contrato","Você conhece a conversão entre reunião, proposta e contrato fechado?","Sem essas taxas, fica difícil saber onde o dinheiro está escapando.",["Não conhecemos as taxas","Temos uma percepção aproximada","Acompanhamos parte do pipeline","Medimos cada etapa e fazemos acompanhamento estruturado"]),
    scored("image-proof","image","Redução de risco","Sua comunicação mostra casos que provam a transformação entregue?","Casos específicos antecipam confiança e encurtam a decisão.",["Quase não mostramos provas","Temos depoimentos dispersos ou antigos","Usamos bons casos em marketing e vendas","Temos um sistema contínuo de casos, provas e autoridade"]),
    scored("strategy-economics","strategy","Crescimento rentável","Você sabe quais serviços, perfis de cliente e contratos geram mais margem?","Escalar a oferta errada pode aumentar trabalho sem aumentar lucro.",["Não temos essa visão","Sabemos por sensação","Conhecemos margem e ticket das principais ofertas","Margem, capacidade e LTV orientam o que vendemos"]),
    scored("evolution-data","evolution","Visão do funil","Marketing e comercial enxergam os mesmos números do primeiro contato ao contrato?","Uma única visão evita que cada área culpe a outra.",["Os dados são fragmentados","Existem relatórios, mas pouca ação","Temos uma visão comum dos principais indicadores","Os dados orientam verba, mensagem e processo comercial"]),
    scored("evolution-scale","evolution","Capacidade de escala","Se o número de clientes dobrasse, a entrega manteria qualidade e margem?","Crescimento saudável precisa caber na operação.",["A operação entraria em colapso","Cresceríamos com muito improviso","Sustentaríamos com alguns ajustes","Temos processos, time e capacidade planejada"]),
  ],
  "Clínica, saúde ou estética": [
    scored("strategy-goal","strategy","Agenda desejada","Existe uma meta clara de novos pacientes, procedimentos ou ocupação para os próximos 90 dias?","A meta precisa conectar agenda, ticket e capacidade real de atendimento.",["Não existe uma meta definida","Queremos encher a agenda, mas sem números","Temos meta por período, com acompanhamento irregular","Meta de agenda, receita e capacidade orienta a operação"]),
    scored("image-offer","image","Escolha do paciente","O paciente entende por que deveria escolher sua clínica antes de chamar no WhatsApp?","Especialidade, experiência e segurança precisam ser percebidas rapidamente.",["Parecemos iguais a outras clínicas","O diferencial depende da explicação da recepção","A proposta é clara na maioria dos canais","A marca gera confiança e preferência antes do contato"]),
    scored("leads-channel","leads","Entrada de pacientes","De onde vêm os novos agendamentos hoje?","Considere pacientes que realmente têm perfil e comparecem.",["Quase só indicação","Ações pontuais e redes sociais sem previsibilidade","Um canal gera agendamentos com frequência","Temos canais previsíveis e custo por agendamento conhecido"]),
    scored("leads-demand","leads","Ocupação da agenda","Você consegue gerar demanda para horários, profissionais ou procedimentos específicos?","Não basta ter leads; é preciso preencher a capacidade certa.",["Não controlamos a demanda","Fazemos campanhas quando a agenda esvazia","Conseguimos direcionar parte dos agendamentos","Distribuímos demanda por unidade, agenda e procedimento"]),
    scored("transformation-speed","transformation","Do interesse ao agendamento","Quanto tempo o paciente espera para ser atendido e receber uma opção de horário?","Em saúde e estética, demora e fricção fazem o paciente procurar outra clínica.",["Não existe padrão e muitos contatos se perdem","Respondemos quando a equipe consegue","Temos roteiro e resposta razoavelmente rápida","Atendimento, qualificação e agendamento são rápidos e medidos"]),
    scored("transformation-show","transformation","Agendamento que vira receita","Você acompanha confirmação, comparecimento e retorno do paciente?","Agenda cheia não significa faturamento se houver faltas e pouco retorno.",["Não acompanhamos essas taxas","Confirmamos manualmente, sem visão do funil","Medimos agendamento e comparecimento","Temos confirmação, recuperação de faltas e reativação estruturadas"]),
    scored("image-proof","image","Confiança clínica","Sua comunicação usa provas e autoridade de forma ética e convincente?","Depoimentos, bastidores, credenciais e educação reduzem insegurança.",["Quase não mostramos provas","Temos conteúdos e provas dispersos","Usamos provas com consistência e cuidado","Autoridade e confiança são construídas continuamente"]),
    scored("strategy-economics","strategy","Receita saudável","Você sabe quais procedimentos, agendas e origens de paciente geram mais margem e recorrência?","Crescer ocupando a agenda errada pode reduzir o lucro.",["Não temos essa visão","Sabemos por percepção","Conhecemos ticket e margem dos principais procedimentos","Margem, retorno e recorrência orientam campanhas e agenda"]),
    scored("evolution-data","evolution","Raio X da jornada","Você conhece as taxas entre contato, agendamento, comparecimento e fechamento?","Esse funil mostra exatamente onde pacientes e receita estão escapando.",["Não conhecemos as taxas","Temos números separados e pouco confiáveis","Acompanhamos as principais etapas","Dados orientam recepção, mídia e oferta semanalmente"]),
    scored("evolution-scale","evolution","Capacidade de atendimento","Se os agendamentos dobrassem, equipe e agenda sustentariam a experiência?","Escala sem capacidade gera espera, falhas e perda de reputação.",["A operação entraria em colapso","Atenderíamos com muito improviso","Sustentaríamos com alguns ajustes","Temos capacidade, processos e experiência padronizada"]),
  ],
  "Comércio ou loja virtual": [
    scored("strategy-goal","strategy","Meta de crescimento","Existe uma meta clara de faturamento, pedidos e margem para os próximos 90 dias?","Crescer vendas sem proteger margem pode piorar o caixa.",["Não existe uma meta definida","Existe meta de faturamento, sem conta de pedidos e margem","Temos metas, com acompanhamento irregular","Pedidos, ticket, margem e verba orientam a operação"]),
    scored("image-offer","image","Desejo pelo produto","O cliente entende rapidamente por que comprar de você e não do concorrente?","Produto, oferta, experiência e confiança precisam vencer a comparação.",["Competimos quase só por preço","O diferencial exige muita explicação","A proposta de valor é clara na maioria dos canais","Marca e oferta geram preferência e sustentam margem"]),
    scored("leads-channel","leads","Tráfego que compra","De onde vêm os clientes que realmente fazem pedidos?","Alcance sem compra não sustenta varejo.",["Dependemos de movimento orgânico ou indicação","Temos ações pontuais sem previsibilidade","Um canal principal gera vendas com frequência","Temos canais previsíveis e custo por compra conhecido"]),
    scored("leads-demand","leads","Eficiência da mídia","Você sabe quanto pode investir para vender um produto sem destruir a margem?","CAC, ROAS e margem precisam ser lidos juntos.",["Não investimos ou não conhecemos o retorno","Olhamos faturamento ou ROAS isoladamente","Medimos mídia e margem dos principais produtos","Orçamento muda conforme CAC, margem, estoque e recompra"]),
    scored("transformation-product","transformation","Da visita ao carrinho","A página, vitrine ou atendimento remove as dúvidas que impedem a compra?","Informação, oferta e prova precisam conduzir a decisão.",["Muitos clientes perguntam o básico ou abandonam","A experiência funciona, mas tem atritos claros","Temos boa apresentação e processo de compra","Testamos continuamente página, oferta e conversão"]),
    scored("transformation-recovery","transformation","Venda recuperada","Existe recuperação de carrinho, orçamento ou cliente que não concluiu?","Parte da receita já demonstrou interesse e só precisa do estímulo certo.",["Não recuperamos oportunidades","Fazemos contatos manuais e esporádicos","Temos automações e algum acompanhamento","Recuperação, remarketing e atendimento são integrados e medidos"]),
    scored("image-proof","image","Confiança para comprar","Sua comunicação mostra avaliações, demonstrações e provas do produto?","Prova reduz risco, principalmente quando o cliente não pode tocar no produto.",["Quase não mostramos provas","As provas são dispersas ou pouco visíveis","Usamos boas avaliações e demonstrações","Prova, conteúdo e comunidade alimentam vendas continuamente"]),
    scored("strategy-economics","strategy","Mix lucrativo","Você sabe quais produtos, categorias e clientes geram mais margem e recompra?","Escalar campeões de faturamento que não dão lucro é uma armadilha.",["Não temos essa visão","Sabemos por sensação","Conhecemos margem e giro dos principais produtos","Margem, giro, estoque e LTV orientam campanhas"]),
    scored("evolution-data","evolution","Jornada completa","Você acompanha visita, carrinho, compra, recompra e receita por canal?","O mapa completo mostra onde otimizar antes de aumentar verba.",["Os dados são fragmentados","Acompanhamos vendas, mas não a jornada","Temos uma visão dos principais indicadores","Dados orientam mídia, oferta, estoque e retenção"]),
    scored("evolution-scale","evolution","Operação de escala","Se os pedidos dobrassem, estoque, atendimento e entrega sustentariam a promessa?","A experiência após a compra define reputação e recompra.",["A operação entraria em colapso","Cresceríamos com muito improviso","Sustentaríamos com alguns ajustes","Temos estoque, processos e logística preparados"]),
  ],
  "Educação ou infoproduto": [
    scored("strategy-goal","strategy","Meta de matrículas","Existe uma meta clara de matrículas, receita e margem para os próximos 90 dias?","A meta precisa conectar audiência, leads, conversão e capacidade de entrega.",["Não existe uma meta definida","Existe desejo de vender mais, sem conta reversa","Temos meta e calendário, com acompanhamento irregular","Meta, funil e calendário orientam cada campanha"]),
    scored("image-offer","image","Transformação prometida","O aluno entende claramente a transformação e para quem a oferta é indicada?","Promessas amplas geram curiosidade, mas pouca decisão.",["A oferta parece genérica","A transformação exige muita explicação","A promessa e o público são claros","A oferta gera desejo, identificação e sustenta o preço"]),
    scored("leads-channel","leads","Audiência que avança","Como novos leads qualificados entram no seu funil?","Seguidores só viram ativo quando avançam para uma próxima etapa.",["Dependemos da audiência atual ou de indicação","Fazemos captações pontuais","Um canal alimenta o funil com frequência","Temos canais previsíveis e custo por lead qualificado"]),
    scored("leads-demand","leads","Demanda previsível","Você consegue gerar leads fora de lançamentos ou picos de conteúdo?","Uma operação madura não recomeça do zero em cada campanha.",["A demanda desaparece fora dos lançamentos","Dependemos muito do orgânico","Mantemos captação em alguns períodos","Temos aquisição contínua e previsível"]),
    scored("transformation-funnel","transformation","Do lead à matrícula","Existe uma sequência clara entre captura, conteúdo, oferta e matrícula?","Cada transição precisa elevar consciência e reduzir objeções.",["O lead recebe ações desconectadas","Existe uma sequência informal","Temos funil e automações principais","O funil é medido e otimizado em cada etapa"]),
    scored("transformation-followup","transformation","Decisão recuperada","O que acontece com quem demonstrou interesse e não comprou?","Acompanhamento e recuperação evitam perder uma audiência já aquecida.",["Nada estruturado acontece","Fazemos contatos pontuais","Temos remarketing e sequências básicas","Recuperação, vendas e nutrição são integradas e medidas"]),
    scored("image-proof","image","Prova de transformação","Sua comunicação mostra alunos reais, progresso e aplicação prática?","Prova específica torna a promessa concreta.",["Quase não mostramos provas","Temos depoimentos dispersos","Usamos bons casos em campanhas e páginas","Prova e comunidade alimentam autoridade continuamente"]),
    scored("strategy-economics","strategy","Economia da oferta","Você conhece CAC, conversão, reembolso, ticket e LTV por oferta?","Faturamento de lançamento pode esconder uma operação pouco saudável.",["Não conhecemos esses números","Acompanhamos apenas faturamento e ROAS","Conhecemos os principais indicadores","Economia da oferta orienta verba, preço e calendário"]),
    scored("evolution-data","evolution","Visão de jornada","Marketing, vendas e entrega enxergam a mesma jornada do lead ao aluno ativo?","A experiência após a venda também influencia prova, retenção e escala.",["Os dados são fragmentados","Existem relatórios separados","Temos uma visão comum dos indicadores principais","Dados orientam aquisição, produto e retenção"]),
    scored("evolution-scale","evolution","Entrega em escala","Se as matrículas dobrassem, suporte e experiência manteriam a qualidade?","Escalar aquisição sem escalar entrega aumenta cancelamento e destrói prova.",["A entrega entraria em colapso","Cresceríamos com muito improviso","Sustentaríamos com alguns ajustes","Temos produto, suporte e comunidade preparados"]),
  ],
  "Outro": [
    scored("strategy-goal","strategy","Objetivo real","Existe uma meta clara de receita e clientes para os próximos 90 dias?","A meta precisa virar uma conta de oportunidades e vendas.",["Não existe uma meta definida","Existe uma intenção, mas sem plano","Temos meta e plano, com acompanhamento irregular","A meta orienta prioridades e decisões semanais"]),
    scored("image-offer","image","Valor percebido","O cliente entende rapidamente por que escolher sua empresa?","O diferencial precisa aparecer antes da explicação comercial.",["Parecemos iguais aos concorrentes","O diferencial exige muita explicação","A proposta é clara na maioria dos canais","A marca gera preferência e sustenta nosso preço"]),
    scored("leads-channel","leads","Entrada de clientes","De onde vêm os clientes com maior chance de comprar?","Considere origem, qualidade e intenção.",["Quase só indicação ou oportunidade espontânea","Ações isoladas e imprevisíveis","Um canal principal gera oportunidades","Temos canais previsíveis e custo conhecido"]),
    scored("leads-demand","leads","Previsibilidade","Se o melhor canal parasse hoje, existiria outra fonte de demanda?","Dependência de um único canal limita crescimento e aumenta risco.",["A demanda praticamente pararia","Teríamos uma queda forte","Temos uma segunda fonte em desenvolvimento","A aquisição é diversificada e previsível"]),
    scored("transformation-speed","transformation","Interesse que vira venda","O que acontece depois que alguém demonstra interesse?","Velocidade, clareza e acompanhamento definem conversão.",["Cada pessoa atende de um jeito","Existe um processo informal","Temos etapas e algum acompanhamento","O processo é rápido, padronizado e medido"]),
    scored("transformation-close","transformation","Conversão real","Você conhece as taxas entre interesse, oportunidade e venda?","Sem essas taxas, o gargalo fica invisível.",["Não conhecemos as taxas","Temos uma percepção aproximada","Acompanhamos parte do funil","Medimos cada etapa e agimos sobre os dados"]),
    scored("image-proof","image","Confiança","Sua comunicação mostra provas que reduzem o risco da compra?","Casos e demonstrações tornam o valor concreto.",["Quase não mostramos provas","Temos provas dispersas","Usamos boas provas em campanhas e vendas","Temos um sistema contínuo de prova e autoridade"]),
    scored("strategy-economics","strategy","Crescimento rentável","Você sabe quais produtos, clientes e canais geram mais margem?","Nem todo faturamento merece ser escalado.",["Não temos essa visão","Sabemos por sensação","Conhecemos margem das principais linhas","Margem, CAC e LTV orientam decisões"]),
    scored("evolution-data","evolution","Visão única","As áreas tomam decisões olhando para os mesmos números?","Uma fonte comum transforma opinião em prioridade.",["Os dados são inexistentes ou fragmentados","Existem relatórios, mas pouca ação","Temos uma visão comum dos indicadores","Dados orientam orçamento, oferta e processo"]),
    scored("evolution-scale","evolution","Pronto para crescer","Se a demanda dobrasse, sua operação sustentaria a promessa?","Escala saudável precisa manter experiência e margem.",["A operação entraria em colapso","Cresceríamos com muito improviso","Sustentaríamos com alguns ajustes","Temos capacidade, processos e time preparados"]),
  ],
};

const pillars = [
  { id: "strategy", letter: "E", name: "Estratégia", blurb: "Direção comercial, cliente ideal e prioridades.", action: "Definir uma meta de 90 dias e alinhar oferta, público e canal a um único objetivo de receita." },
  { id: "leads", letter: "L", name: "Leads", blurb: "Aquisição previsível e eficiência de mídia.", action: "Concentrar investimento no canal com melhor sinal de compra e medir custo por oportunidade, não só por lead." },
  { id: "image", letter: "I", name: "Imagem & Oferta", blurb: "Posicionamento, valor percebido e prova.", action: "Reformular a mensagem central com diferencial claro, prova específica e uma oferta difícil de comparar por preço." },
  { id: "transformation", letter: "T", name: "Transformação", blurb: "Processo comercial e conversão em receita.", action: "Criar velocidade de resposta, roteiro de qualificação e acompanhamento com taxas visíveis em cada etapa do funil." },
  { id: "evolution", letter: "E", name: "Evolução & Escala", blurb: "Dados, capacidade e otimização contínua.", action: "Unificar os números de marketing e vendas em um painel simples para decidir onde investir e o que corrigir." },
];

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

function AnimatedScore({ score, label }: { score: number; label: string }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / 1000, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(score * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="score-ring score-ring-animated" style={{ "--score": `${displayed * 3.6}deg` } as React.CSSProperties}>
      <div>
        <div className="score-value"><strong>{displayed}</strong><span>/ 100</span></div>
        <small>{label}</small>
      </div>
    </div>
  );
}

function RadarChart({ scores }: { scores: Array<(typeof pillars)[number] & { percent: number }> }) {
  const center = 180;
  const radius = 112;
  const point = (index: number, scale: number) => {
    const angle = (-90 + index * 72) * Math.PI / 180;
    return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`;
  };
  const polygon = (scale: number) => scores.map((_, index) => point(index, scale)).join(" ");
  const labelPoint = (index: number) => {
    const angle = (-90 + index * 72) * Math.PI / 180;
    return { x: center + Math.cos(angle) * 148, y: center + Math.sin(angle) * 140 };
  };

  return (
    <section className="radar-section" aria-labelledby="radar-title">
      <div className="radar-copy">
        <span>Mapa de performance</span>
        <h2 id="radar-title">Seu perfil de crescimento em uma única visão.</h2>
        <p>Quanto mais a forma se aproxima das bordas, mais forte está o pilar. As áreas retraídas mostram onde o próximo avanço pode destravar resultado.</p>
        <div className="radar-legend"><i /> Forças atuais <i /> Oportunidades</div>
      </div>
      <div className="radar-card">
        <svg viewBox="0 0 360 360" role="img" aria-label="Gráfico de forças e oportunidades nos cinco pilares E.L.I.T.E.">
          {[.25, .5, .75, 1].map((scale) => <polygon key={scale} points={polygon(scale)} className="radar-grid" />)}
          {scores.map((score, index) => <line key={score.id} x1={center} y1={center} x2={point(index, 1).split(",")[0]} y2={point(index, 1).split(",")[1]} className="radar-axis" />)}
          <polygon points={scores.map((score, index) => point(index, Math.max(score.percent, 8) / 100)).join(" ")} className="radar-shape" />
          {scores.map((score, index) => {
            const [cx, cy] = point(index, Math.max(score.percent, 8) / 100).split(",");
            return <circle key={score.id} cx={cx} cy={cy} r="4" className="radar-dot" />;
          })}
          {scores.map((score, index) => {
            const position = labelPoint(index);
            return <text key={score.id} x={position.x} y={position.y} textAnchor="middle" className="radar-label"><tspan x={position.x}>{score.name.replace(" & Oferta", "")}</tspan><tspan x={position.x} dy="15">{score.percent}%</tspan></text>;
          })}
        </svg>
      </div>
    </section>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [phase, setPhase] = useState<"quiz" | "gate" | "result">("quiz");
  const [lead, setLead] = useState({ name: "", company: "", whatsapp: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const activeScoredSteps = useMemo(
    () => segmentQuestionBanks[String(answers.segment)] ?? segmentQuestionBanks.Outro,
    [answers.segment],
  );
  const allSteps = useMemo(() => [...contextSteps, ...activeScoredSteps], [activeScoredSteps]);

  const pillarScores = useMemo(() => pillars.map((pillar) => {
    const related = activeScoredSteps.filter((step) => step.pillar === pillar.id);
    const points = related.reduce((sum, step) => sum + Number(answers[step.id] ?? 0), 0);
    return { ...pillar, points, percent: Math.round((points / (related.length * 3)) * 100) };
  }), [activeScoredSteps, answers]);

  const totalScore = useMemo(() => {
    const points = activeScoredSteps.reduce((sum, step) => sum + Number(answers[step.id] ?? 0), 0);
    return Math.round((points / (activeScoredSteps.length * 3)) * 100);
  }, [activeScoredSteps, answers]);

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
    setSubmitError("");

    const score = `${totalScore}/100`;
    const gargalo = priorities[0]?.name ?? band.name;
    const crmPayload = {
      nome: lead.name,
      empresa: lead.company,
      whatsapp: lead.whatsapp,
      email: lead.email,
      score,
      gargalo,
      faturamento: String(answers.revenue),
      segmento: String(answers.segment),
      objetivo: String(answers.goal),
      faixa_score: band.name,
      prioridades: priorities.map((item) => `${item.name}: ${item.percent}%`).join(" | "),
      respostas: activeScoredSteps.map((step) => `${step.question}: ${answers[step.id]}`).join(" | "),
    };

    const payload = new FormData();
    payload.append("nome", lead.name);
    payload.append("empresa", lead.company);
    payload.append("whatsapp", lead.whatsapp);
    payload.append("email", lead.email);
    payload.append("faturamento", String(answers.revenue));
    payload.append("segmento", String(answers.segment));
    payload.append("objetivo", String(answers.goal));
    payload.append("score_elite", `${totalScore}/100 | ${band.name}`);
    payload.append("prioridades", priorities.map((item) => `${item.name}: ${item.percent}%`).join(" | "));
    payload.append("respostas", activeScoredSteps.map((step) => `${step.question}: ${answers[step.id]}`).join(" | "));

    const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);

    if (!isLocalPreview) {
      try {
        const crmResponse = await fetch(CRM_INGEST_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(crmPayload),
        });
        const crmResult = await crmResponse.json().catch(() => null) as { ok?: boolean } | null;
        if (!crmResponse.ok || crmResult?.ok !== true) throw new Error("CRM não confirmou o recebimento");
      } catch {
        setSubmitting(false);
        setSubmitError("Não conseguimos liberar seu relatório agora. Verifique sua conexão e tente novamente.");
        return;
      }

      try {
        await fetch("https://formspree.io/f/xgodrpnk", { method: "POST", body: payload, headers: { Accept: "application/json" } });
      } catch {
        // O CRM já recebeu o lead. Esta cópia adicional não bloqueia o relatório.
      }
    }
    setSubmitting(false);
    trackMetaEvent("Lead");
    setPhase("result");
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }

  const whatsappText = encodeURIComponent(`Olá! Sou ${lead.name || "um empresário"}, da ${lead.company || "minha empresa"}. Fiz o Diagnóstico E.L.I.T.E., meu score foi ${totalScore}/100 (${band.name}) e meu principal gargalo foi ${priorities[0]?.name}. Faturamento: ${answers.revenue}. Quero agendar a reunião para receber meu Mapa de Crescimento, estratégias específicas e o Desafio Perfil que Vende.`);
  const whatsappHref = `https://wa.me/5521966559243?text=${whatsappText}`;

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
            <h2>Um raio X da sua máquina de crescimento.</h2>
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
            <AnimatedScore score={totalScore} label={band.name} />
          </div>
        </section>

        <section className="results-body">
          <div className="result-section-title"><span>Visão por pilar</span><h2>Onde sua máquina ganha força e onde perde.</h2></div>
          <div className="pillar-results">
            {pillarScores.map((pillar) => (
              <article key={pillar.id} className={pillar.percent < 45 ? "needs-attention" : ""}>
                <div className="pillar-result-top"><b>{pillar.letter}</b><span><strong>{pillar.name}</strong><small>{pillar.blurb}</small></span><em>{pillar.percent}%</em></div>
                <div className="result-bar"><i style={{ width: `${pillar.percent}%` }} /></div>
              </article>
            ))}
          </div>

          <RadarChart scores={pillarScores} />

          <section className="final-cta">
            <div className="cta-copy">
              <span>Reunião + entregável exclusivo</span>
              <h2>O relatório revela o gargalo. A reunião transforma isso em um <em>plano de crescimento executável.</em></h2>
              <p>Reserve uma Análise Estratégica de 45 minutos com a Elite Mídias. Na reunião, vamos abrir seu diagnóstico e construir o seu Mapa de Crescimento com estratégias específicas para o seu negócio e para o seu segmento.</p>
              <div className="meeting-bonus">
                <div className="bonus-gift"><img src="/images/presente-bonus.png" alt="Caixa de presente representando o bônus liberado na reunião" /></div>
                <div className="bonus-content">
                  <b>Bônus liberado para quem participa</b>
                  <strong>Desafio Perfil que Vende</strong>
                  <p><b>Você recebe</b> acesso a uma jornada prática de 10 dias e 5 missões para transformar o Instagram em uma vitrine comercial com posicionamento, bio, destaques, conteúdo, Stories e Reels.</p>
                </div>
              </div>
              <ul><li>Mapa de Crescimento para os próximos 90 dias</li><li>Estratégias específicas para o seu negócio</li><li>Acesso completo ao Desafio Perfil que Vende</li></ul>
              <a className="primary-button green-button cta-copy-button" href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackMetaEvent("Schedule")}>Agendar minha reunião <span>→</span></a>
            </div>
            <div className="cta-card">
              <div className="ticket-visual"><img src="/images/passe-crescimento.png" alt="Passe estratégico gratuito para uma reunião com a Elite Mídias"/><span>Passe gratuito</span></div>
              <div className="mini-score"><span>Seu ponto de partida</span><strong>{totalScore}/100</strong></div>
              <h3>Reserve seu Mapa de Crescimento E.L.I.T.E.</h3>
              <p>Uma conversa estratégica aplicada ao seu negócio. Sem apresentação genérica e sem compromisso de contratação.</p>
              <a className="primary-button green-button" href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackMetaEvent("Schedule")}>Quero meu plano + bônus <span>→</span></a>
              <button className="pdf-button report-download" onClick={() => window.print()}>Salvar meu relatório em PDF</button>
              <div className="contact-links"><a href="https://instagram.com/nandoborbaaa" target="_blank" rel="noreferrer">Instagram · @nandoborbaaa</a><a href="https://wa.me/5521966559243" target="_blank" rel="noreferrer">WhatsApp · (21) 96655-9243</a></div>
              <small>Sem custo. As agendas são liberadas conforme disponibilidade e aderência do negócio.</small>
            </div>
          </section>

          <div className="priority-section">
            <div className="result-section-title"><span>Resumo prioritário</span><h2>As 3 alavancas para atacar primeiro.</h2><p>A ordem considera os pontos de menor maturidade no seu diagnóstico.</p></div>
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

          <section className="closing-cta">
            <span>Seu próximo passo</span>
            <h2>Agende a reunião e receba um plano construído para o seu negócio.</h2>
            <p>Você sai da reunião com o seu Mapa de Crescimento, estratégias específicas para avançar nos próximos 90 dias e acesso ao Desafio Perfil que Vende.</p>
            <a className="primary-button green-button" href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackMetaEvent("Schedule")}>Quero agendar e receber meu mapa <span>→</span></a>
            <small>Reunião estratégica gratuita de 45 minutos com a Elite Mídias.</small>
          </section>

          <p className="result-disclaimer">O diagnóstico é orientativo e não representa garantia de faturamento ou resultado. Crescimento depende de execução, contexto, investimento e condições de mercado.</p>
        </section>
        <footer className="footer result-footer"><img src="/images/logo-elite.png" alt="" /><p>Elite Mídias · Estratégia, performance e crescimento.</p><a href="https://instagram.com/nandoborbaaa" target="_blank" rel="noreferrer">@nandoborbaaa</a><a href="https://wa.me/5521966559243" target="_blank" rel="noreferrer">(21) 96655-9243</a></footer>
      </main>
    );
  }

  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <img src="/images/logo-elite.png" alt="Elite Mídias" className="brand-logo" />
        <div className="quiz-header-tools"><button className="sound-toggle" onClick={() => setSoundOn((value) => !value)} aria-pressed={soundOn} aria-label={soundOn ? "Desativar sons do quiz" : "Ativar sons do quiz"}>{soundOn ? "◉ Som" : "○ Som"}</button><div className="quiz-progress-meta"><span>{phase === "gate" ? "Relatório pronto" : `Pergunta ${stepIndex + 1} de ${allSteps.length}`}</span><strong>{progress}%</strong></div></div>
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
            <div className="gate-badge">Seu relatório está pronto</div>
            <div className="locked-preview">
              <div className="blurred-score" aria-hidden="true">{totalScore}</div>
              <span>Mapeamos suas forças, seus vazamentos e as 3 oportunidades com maior potencial.</span>
            </div>
            <h1>Seu diagnóstico foi concluído. Para quem devemos liberar o relatório?</h1>
            <p>Informe seus dados para abrir sua nota, o mapa dos pilares e as prioridades recomendadas para o seu negócio.</p>
            <form onSubmit={submitLead} className="lead-form">
              <label><span>Seu nome</span><input required autoComplete="name" value={lead.name} onChange={(event) => setLead({ ...lead, name: event.target.value })} placeholder="Como podemos chamar você?" /></label>
              <label><span>Empresa</span><input required autoComplete="organization" value={lead.company} onChange={(event) => setLead({ ...lead, company: event.target.value })} placeholder="Nome do negócio" /></label>
              <label><span>WhatsApp</span><input required autoComplete="tel" inputMode="tel" value={lead.whatsapp} onChange={(event) => setLead({ ...lead, whatsapp: event.target.value })} placeholder="(21) 99999-9999" /></label>
              <label><span>Email profissional</span><input required type="email" autoComplete="email" value={lead.email} onChange={(event) => setLead({ ...lead, email: event.target.value })} placeholder="voce@empresa.com.br" /></label>
              {submitError && <p className="form-error" role="alert">{submitError}</p>}
              <button className="primary-button green-button" type="submit" disabled={submitting}>{submitting ? "Preparando seu relatório..." : "Ver meu Relatório de Oportunidades"}<span>→</span></button>
              <small>Ao continuar, você concorda em receber o diagnóstico e um contato da Elite Mídias sobre o resultado.</small>
            </form>
          </div>
          <aside className="gate-summary">
            <span>Ao abrir seu relatório</span>
            <h2>Você vai enxergar onde o crescimento está escapando.</h2>
            <div><b>01</b><p><strong>Sua nota geral</strong>O nível atual da sua máquina de crescimento.</p></div>
            <div><b>02</b><p><strong>Mapa de forças e vazamentos</strong>O que sustenta e o que limita seu negócio.</p></div>
            <div><b>03</b><p><strong>3 oportunidades prioritárias</strong>Por onde começar para ganhar tração.</p></div>
          </aside>
        </section>
      )}
    </main>
  );
}
