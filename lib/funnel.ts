export type Answers = Record<string, string | number>;
export type Option = { label: string; value: string | number; detail?: string };
export type Step = {
  id: string;
  eyebrow: string;
  question: string;
  support: string;
  options: Option[];
  pillar?: string;
  action?: string;
  advanced?: string;
};
export const FUNNEL_VERSION = "raiox-v2";
export const OFFICIAL_URL = "https://raiox.elitemidias.com";
export const WHATSAPP = "5521966559243";
export const CAL_LINK = "nando-borba/30min";
export const segments = [
  "Estética e clínica",
  "Cirurgia plástica",
  "Distribuidora",
  "Indústria e fábrica",
  "Serviços profissionais",
  "Comércio e loja virtual",
  "Educação",
  "Outro modelo",
];
export const revenues = [
  "Até R$ 20 mil",
  "R$ 20 mil a R$ 30 mil",
  "R$ 30 mil a R$ 60 mil",
  "R$ 60 mil a R$ 100 mil",
  "R$ 100 mil a R$ 300 mil",
  "Acima de R$ 300 mil",
];
export const pillars = [
  {
    id: "strategy",
    letter: "E",
    name: "Estratégia",
    blurb: "Uma meta que orienta as próximas decisões.",
  },
  {
    id: "leads",
    letter: "L",
    name: "Leads",
    blurb: "Demanda com perfil e continuidade.",
  },
  {
    id: "image",
    letter: "I",
    name: "Imagem & Oferta",
    blurb: "Uma razão clara para escolher sua empresa.",
  },
  {
    id: "transformation",
    letter: "T",
    name: "Transformação",
    blurb: "Interesse que avança para uma venda.",
  },
  {
    id: "evolution",
    letter: "E",
    name: "Evolução & Escala",
    blurb: "Números para acompanhar e melhorar.",
  },
];

type Question = {
  question: string;
  options: string[];
  action: string;
  advanced: string;
};
const base: Question[] = [
  {
    question: "Existe uma meta de vendas para os próximos 90 dias?",
    options: [
      "Ainda não definimos uma meta",
      "Temos uma intenção, sem um número definido",
      "Temos uma meta, mas revisamos pouco",
      "Temos meta e revisamos o avanço toda semana",
    ],
    action:
      "Defina uma meta de vendas e transforme esse número em oportunidades comerciais por semana.",
    advanced:
      "Revise a meta a partir da capacidade de entrega e acompanhe o avanço semanal.",
  },
  {
    question: "Como novas oportunidades comerciais chegam hoje?",
    options: [
      "Dependemos de indicação ou contatos espontâneos",
      "Fazemos ações isoladas quando falta demanda",
      "Um canal traz oportunidades com frequência",
      "Temos canais previsíveis e conhecemos seus custos",
    ],
    action:
      "Escolha um canal para captar oportunidades com perfil e acompanhe custo e qualidade antes de ampliar a verba.",
    advanced:
      "Compare a qualidade e o custo das oportunidades de cada canal para direcionar o próximo investimento.",
  },
  {
    question: "Seu potencial cliente entende por que escolher sua empresa?",
    options: [
      "Nossa comunicação parece igual à dos concorrentes",
      "O diferencial só fica claro na conversa",
      "O diferencial aparece nos principais canais",
      "O diferencial é claro e acompanhado de provas reais",
    ],
    action:
      "Torne seu diferencial visível na oferta, com um caso real que ajude o cliente a decidir.",
    advanced:
      "Teste uma mensagem específica por perfil de cliente usando seus casos mais relevantes.",
  },
  {
    question: "O que acontece com quem pede orçamento e não fecha?",
    options: [
      "Muitos contatos se perdem sem retorno",
      "Alguém retoma quando consegue",
      "Temos uma rotina de acompanhamento",
      "Cada oportunidade tem responsável e próximo passo",
    ],
    action:
      "Organize uma rotina de acompanhamento de orçamentos com responsável e próximo contato definido.",
    advanced:
      "Meça quais motivos impedem o fechamento e ajuste a sequência de acompanhamento.",
  },
  {
    question: "Você sabe quantas oportunidades viram vendas?",
    options: [
      "Não acompanhamos essa taxa",
      "Temos apenas uma percepção aproximada",
      "Calculamos a conversão em alguns períodos",
      "Acompanhamos a conversão e agimos sobre ela",
    ],
    action:
      "Registre oportunidades e vendas no mesmo lugar para descobrir em qual etapa os contatos param.",
    advanced:
      "Compare conversão por canal e perfil de cliente para corrigir a etapa de maior perda.",
  },
];
const clinical: Question[] = [
  {
    question: "Existe uma meta de novos pacientes para os próximos 90 dias?",
    options: base[0].options,
    action:
      "Defina a meta de novos pacientes considerando agenda, procedimentos e capacidade real de atendimento.",
    advanced:
      "Revise a meta por profissional ou procedimento e acompanhe a ocupação semanal.",
  },
  {
    question: "De onde vêm os novos pacientes que agendam?",
    options: [
      "Quase só de indicação",
      "De ações pontuais e redes sociais",
      "Um canal gera agendamentos com frequência",
      "Temos canais previsíveis e custo conhecido",
    ],
    action:
      "Escolha uma frente de captação para o perfil de paciente desejado e acompanhe o custo por agendamento.",
    advanced:
      "Compare custo, comparecimento e perfil dos pacientes por origem antes de ampliar campanhas.",
  },
  {
    question: "O paciente entende por que escolher sua clínica?",
    options: base[2].options,
    action:
      "Apresente especialidade, experiência e diferenciais reais para reduzir dúvidas antes do contato.",
    advanced:
      "Adapte a apresentação ao procedimento e às dúvidas que mais aparecem na recepção.",
  },
  {
    question:
      "Quando um paciente pede informações e não agenda, o que acontece?",
    options: [
      "Muitos contatos se perdem sem retorno",
      "A recepção responde e retoma quando consegue",
      "Temos uma rotina para retomar os interessados",
      "Cada contato tem responsável e próximo passo",
    ],
    action:
      "Organize o retorno aos pacientes interessados com uma próxima ação clara para a recepção.",
    advanced:
      "Acompanhe por que os pacientes não agendam e teste melhorias na abordagem da recepção.",
  },
  {
    question: "Você acompanha o caminho do contato ao paciente atendido?",
    options: [
      "Não temos esses números",
      "Sabemos quantos agendam, mas não a jornada",
      "Medimos agendamentos e comparecimentos",
      "Medimos contato, agenda e comparecimento por origem",
    ],
    action:
      "Registre contatos, agendamentos e comparecimentos para localizar a principal perda da jornada.",
    advanced:
      "Use a conversão e o comparecimento por origem para ajustar captação e confirmação.",
  },
];
const surgery: Question[] = [
  {
    ...clinical[0],
    question:
      "Existe uma meta de consultas de avaliação para os próximos 90 dias?",
    action:
      "Planeje as consultas de avaliação considerando perfil desejado, agenda e capacidade de acompanhamento.",
  },
  {
    ...clinical[1],
    question: "Como chegam os interessados em uma avaliação cirúrgica?",
    action:
      "Acompanhe a origem dos interessados e a proporção que avança para consulta de avaliação.",
  },
  {
    ...clinical[2],
    question:
      "O interessado encontra informações que geram confiança no seu trabalho?",
    action:
      "Organize informações sobre formação, processo de avaliação e dúvidas frequentes com comunicação responsável.",
  },
  {
    ...clinical[3],
    question:
      "O que acontece com quem pede informações sobre a consulta e não agenda?",
    action:
      "Defina uma rotina de retorno da equipe para interessados na consulta, respeitando o momento de decisão.",
  },
  {
    ...clinical[4],
    question: "Você acompanha o avanço entre contato, consulta e decisão?",
    action:
      "Mapeie contato, agendamento, comparecimento e decisão para identificar onde o atendimento precisa melhorar.",
  },
];
const distribution: Question[] = [
  {
    ...base[0],
    question:
      "Existe uma meta de novos compradores ativos para os próximos 90 dias?",
    action:
      "Defina quantos novos compradores ativos sua distribuição precisa e quais perfis têm melhor margem.",
  },
  {
    ...base[1],
    question: "Como novos compradores chegam à distribuidora?",
    action:
      "Escolha um perfil de comprador e um canal de prospecção para gerar pedidos de orçamento com consistência.",
  },
  {
    ...base[2],
    question:
      "O comprador entende as vantagens de comprar da sua distribuidora?",
    action:
      "Deixe claros mix, atendimento, condições e diferenciais reais para o comprador que você quer atrair.",
  },
  {
    ...base[3],
    question: "O que acontece com os orçamentos que não viram pedidos?",
    action:
      "Crie acompanhamento dos orçamentos por vendedor, com motivo de perda e data do próximo contato.",
  },
  {
    ...base[4],
    question: "Você sabe quais orçamentos viram pedidos e recompra?",
    action:
      "Registre orçamento, pedido e recompra por origem para encontrar as melhores oportunidades comerciais.",
  },
];
const industry: Question[] = [
  {
    ...base[0],
    question:
      "Existe uma meta de novos contratos ou pedidos para os próximos 90 dias?",
    action:
      "Conecte a meta comercial à capacidade de produção e aos produtos com melhor margem.",
  },
  {
    ...base[1],
    question: "Como chegam novos pedidos de cotação para a fábrica?",
    action:
      "Defina o perfil de comprador industrial e teste uma frente de aquisição de pedidos de cotação.",
  },
  {
    ...base[2],
    question: "O comprador entende por que cotar com a sua fábrica?",
    action:
      "Apresente capacidade, especificações e diferenciais reais com exemplos adequados ao comprador.",
  },
  {
    ...base[3],
    question: "Como sua equipe acompanha as cotações enviadas?",
    action:
      "Organize as cotações por responsável, prazo de decisão e próxima ação comercial.",
  },
  {
    ...base[4],
    question: "Você acompanha a conversão das cotações em pedidos?",
    action:
      "Meça cotação, proposta e pedido por origem para identificar as perdas do ciclo comercial.",
  },
];
const commerce: Question[] = [
  {
    ...base[0],
    question: "Existe uma meta de pedidos para os próximos 90 dias?",
    action:
      "Conecte pedidos, ticket e margem a uma meta compatível com estoque e entrega.",
  },
  {
    ...base[1],
    question: "De onde vêm os clientes que realmente compram?",
    action:
      "Compare origem dos compradores e margem das vendas antes de concentrar investimento em um canal.",
  },
  {
    ...base[2],
    question: "O cliente entende por que comprar da sua loja?",
    action:
      "Apresente produto, condição e prova de forma clara nos pontos que levam à compra.",
  },
  {
    ...base[3],
    question: "O que acontece com quem abandona o carrinho ou o orçamento?",
    action:
      "Organize uma rotina de recuperação de carrinhos ou orçamentos que ficaram sem conclusão.",
  },
  {
    ...base[4],
    question: "Você acompanha quantas visitas ou contatos viram compras?",
    action:
      "Meça visita ou contato, compra e recompra para encontrar o principal ponto de perda.",
  },
];
const education: Question[] = [
  {
    ...base[0],
    question: "Existe uma meta de matrículas para os próximos 90 dias?",
    action:
      "Defina uma meta de matrículas compatível com ticket, margem e capacidade de entrega.",
  },
  {
    ...base[1],
    question: "Como novos interessados entram no seu funil?",
    action:
      "Escolha um canal de captação contínua para o perfil de aluno desejado.",
  },
  {
    ...base[2],
    question: "O interessado entende o resultado e para quem sua oferta serve?",
    action:
      "Explique com clareza o público, a entrega e a transformação proposta, com provas reais.",
  },
  {
    ...base[3],
    question: "O que acontece com quem demonstra interesse e não se matricula?",
    action:
      "Organize o acompanhamento dos interessados com a próxima ação e o responsável definidos.",
  },
  {
    ...base[4],
    question: "Você acompanha a conversão entre interessado e matrícula?",
    action:
      "Meça captação e matrícula por origem para identificar onde a decisão perde força.",
  },
];
const banks: Record<string, Question[]> = {
  "Estética e clínica": clinical,
  "Cirurgia plástica": surgery,
  Distribuidora: distribution,
  "Indústria e fábrica": industry,
  "Comércio e loja virtual": commerce,
  Educação: education,
};

export function getSteps(segment: string): Step[] {
  const questions = banks[segment] ?? base;
  return [
    {
      id: "segment",
      eyebrow: "Vamos conhecer seu negócio",
      question: "Qual é o modelo da sua empresa?",
      support:
        "As próximas perguntas vão acompanhar a realidade do seu segmento.",
      options: segments.map((label) => ({ label, value: label })),
    },
    {
      id: "revenue",
      eyebrow: "Seu momento atual",
      question: "Qual é o faturamento médio mensal da empresa?",
      support:
        "Essa faixa dá contexto para a análise. Ela não define sozinha sua nota ou seu potencial.",
      options: revenues.map((label) => ({ label, value: label })),
    },
    {
      id: "goal",
      eyebrow: "O que mais importa agora",
      question: "Qual resultado é prioridade nos próximos 90 dias?",
      support: "Escolha o que faria mais diferença para o seu negócio.",
      options: [
        {
          label: "Atrair mais oportunidades com perfil",
          value: "Mais oportunidades",
        },
        {
          label: "Converter mais interessados em clientes",
          value: "Mais conversão",
        },
        {
          label: "Vender com mais previsibilidade",
          value: "Mais previsibilidade",
        },
        { label: "Crescer com mais estrutura", value: "Crescer com estrutura" },
      ],
    },
    ...questions.map((q, index) => ({
      id: pillars[index].id,
      pillar: pillars[index].id,
      eyebrow: pillars[index].name,
      question: q.question,
      support:
        "Pense no que acontece hoje. A resposta mais útil é a mais próxima da sua realidade.",
      options: q.options.map((label, value) => ({ label, value })),
      action: q.action,
      advanced: q.advanced,
    })),
  ];
}

export function getDiagnosis(segment: string, answers: Answers) {
  const steps = getSteps(segment).filter((step) => step.pillar);
  const scores = pillars.map((pillar, index) => {
    const raw = Number(answers[pillar.id]);
    const points = Number.isInteger(raw) && raw >= 0 && raw <= 3 ? raw : 0;
    return {
      ...pillar,
      points,
      percent: Math.round((points / 3) * 100),
      answer: steps[index].options[points].label,
      question: steps[index].question,
      action: (points === 3
        ? steps[index].advanced
        : steps[index].action) as string,
    };
  });
  const goalPillar: Record<string, string> = {
    "Mais oportunidades": "leads",
    "Mais conversão": "transformation",
    "Mais previsibilidade": "strategy",
    "Crescer com estrutura": "evolution",
  };
  const preferred = goalPillar[String(answers.goal)];
  const priorities = [...scores]
    .sort(
      (a, b) =>
        a.points - b.points ||
        Number(b.id === preferred) - Number(a.id === preferred),
    )
    .slice(0, 3);
  const score = Math.round(
    (scores.reduce((sum, p) => sum + p.points, 0) / 15) * 100,
  );
  return {
    score,
    scores,
    priorities,
    band:
      score < 40
        ? "Base em construção"
        : score < 75
          ? "Pontos de ajuste"
          : "Base estruturada",
  };
}

export function restoreAnswers(value: unknown): Answers {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Answers;
  const segment = segments.includes(String(source.segment))
    ? String(source.segment)
    : "";
  const clean: Answers = {};
  for (const step of getSteps(segment))
    if (step.options.some((option) => option.value === source[step.id]))
      clean[step.id] = source[step.id];
  return clean;
}
export function isComplete(segment: string, answers: Answers) {
  return getSteps(segment).every((step) =>
    step.options.some((option) => option.value === answers[step.id]),
  );
}

export const qualificationSteps: Step[] = [
  {
    id: "role",
    eyebrow: "Para preparar a conversa",
    question: "Você participa da decisão de contratar marketing?",
    support: "Assim podemos envolver as pessoas certas na análise.",
    options: [
      { label: "Sim, eu decido pela empresa", value: "decision" },
      { label: "Decido junto com outra pessoa", value: "shared" },
      {
        label: "Estou pesquisando para apresentar a alguém",
        value: "research",
      },
    ],
  },
  {
    id: "timing",
    eyebrow: "Seu momento de decisão",
    question: "Quando pretende colocar um plano em prática?",
    support: "Assim podemos alinhar as prioridades ao momento da sua empresa.",
    options: [
      { label: "Quero começar nos próximos 30 dias", value: "now" },
      { label: "Estou planejando para os próximos 90 dias", value: "soon" },
      { label: "Ainda estou pesquisando, sem prazo definido", value: "later" },
    ],
  },
  {
    id: "budget",
    eyebrow: "Alinhando o investimento",
    question:
      "Se o plano fizer sentido para o seu negócio, sua empresa pode investir a partir de R$ 2.000 por mês, somando assessoria de marketing e verba para anúncios?",
    support:
      "Esse é o investimento mensal total de referência. O escopo e a distribuição entre assessoria e anúncios são apresentados na proposta.",
    options: [
      { label: "Sim, tenho disponibilidade para investir.", value: "yes" },
      {
        label: "Posso considerar, mas preciso entender o plano.",
        value: "consider",
      },
      {
        label: "Neste momento, esse valor não cabe no orçamento.",
        value: "not_now",
      },
    ],
  },
];
export function getQualification(value: Record<string, string>) {
  if (
    !qualificationSteps.every((step) =>
      step.options.some((option) => option.value === value[step.id]),
    )
  )
    return "incomplete";
  if (value.budget === "not_now") return "nurture";
  if (value.timing === "later" || value.role === "research") return "later";
  return value.budget === "consider" ? "review" : "ready";
}
