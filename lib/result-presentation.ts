export function getResultHeadline(
  segment: string,
  pillar: string,
  points: number,
): string {
  if (points === 3) return "Sua base está pronta para o próximo avanço.";
  if (pillar === "transformation") {
    if (segment === "Estética e clínica" || segment === "Cirurgia plástica")
      return "Transforme contatos em agendamentos.";
    if (segment === "Comércio e loja virtual")
      return "Transforme interesse em compras.";
    if (segment === "Distribuidora" || segment === "Indústria e fábrica")
      return "Transforme cotações em pedidos.";
    if (segment === "Educação") return "Transforme interesse em matrículas.";
    return "Transforme orçamentos em contratos.";
  }
  const headlines: Record<string, string> = {
    strategy: "Defina uma direção clara para crescer.",
    leads:
      segment === "Estética e clínica" || segment === "Cirurgia plástica"
        ? "Atraia pacientes com o perfil certo."
        : "Atraia oportunidades com o perfil certo.",
    image: "Mostre por que escolher sua empresa.",
    evolution: "Saiba o que funciona antes de investir mais.",
  };
  return headlines[pillar] ?? "Encontre o próximo passo para crescer.";
}

type ExecutionPriority = { id: string; points: number; action: string };
type ExecutionRecommendation = { action: string; services: string[] };

const journeys: Record<
  string,
  { audience: string; destination: string; metric: string }
> = {
  "Estética e clínica": {
    audience: "pacientes com o perfil certo",
    destination: "o agendamento",
    metric: "agendamento",
  },
  "Cirurgia plástica": {
    audience: "interessados com perfil para uma avaliação",
    destination: "a consulta de avaliação",
    metric: "consulta de avaliação",
  },
  Distribuidora: {
    audience: "novos compradores e pedidos de orçamento",
    destination: "o pedido",
    metric: "pedido de orçamento",
  },
  "Indústria e fábrica": {
    audience: "compradores e novas cotações",
    destination: "o pedido",
    metric: "cotação",
  },
  "Comércio e loja virtual": {
    audience: "clientes com intenção de compra",
    destination: "a compra",
    metric: "compra",
  },
  Educação: {
    audience: "alunos com o perfil certo",
    destination: "a matrícula",
    metric: "matrícula",
  },
};
const defaultJourney = {
  audience: "clientes com o perfil certo",
  destination: "o fechamento",
  metric: "oportunidade",
};

export function getExecutionRecommendation(
  segment: string,
  priority: ExecutionPriority,
): ExecutionRecommendation {
  const journey = journeys[segment] ?? defaultJourney;
  const structured = priority.points === 3;
  switch (priority.id) {
    case "strategy":
      return {
        action: structured
          ? "Revise metas e ofertas a partir da capacidade de entrega. Priorize as campanhas com maior potencial para o próximo ciclo."
          : "Construa um plano de marketing com meta, público e oferta definidos. Organize as campanhas por prioridade de crescimento.",
        services: ["Planejamento de marketing", "Construção de oferta"],
      };
    case "leads":
      return {
        action: structured
          ? `Teste campanhas e criativos para ampliar a captação de ${journey.audience}. Compare custo e qualidade antes de aumentar a verba.`
          : `Capte ${journey.audience} com tráfego pago, criativos e uma oferta clara. Acompanhe o custo por ${journey.metric}.`,
        services: structured
          ? ["Otimização de tráfego", "Testes de criativos"]
          : ["Tráfego pago", "Criação de criativos"],
      };
    case "image": {
      const clinical =
        segment === "Estética e clínica" || segment === "Cirurgia plástica";
      return {
        action: structured
          ? "Teste novas ofertas e mensagens a partir dos diferenciais e provas que já funcionam. Transforme os aprendizados em criativos."
          : clinical
            ? "Construa uma oferta clara e criativos que transmitam confiança, destaquem sua especialidade e mostrem diferenciais reais."
            : "Construa uma oferta clara e um posicionamento diferente da concorrência. Mostre seus diferenciais nos criativos que levam ao primeiro contato.",
        services: ["Construção de oferta", "Posicionamento"],
      };
    }
    case "transformation":
      return {
        action: structured
          ? `Meça as perdas por etapa e avalie automações para apoiar a equipe até ${journey.destination}.`
          : priority.points === 2
            ? `Conecte sua rotina a um CRM com etapas e etiquetas. Avalie IA para qualificar contatos e apoiar ${journey.destination}.`
            : `Organize contatos em um CRM com etapas, etiquetas e indicadores. Use IA para responder, qualificar e conduzir o contato até ${journey.destination}.`,
        services: structured
          ? ["Otimização do funil", "Automação de atendimento"]
          : ["CRM e funil comercial", "IA de atendimento"],
      };
    case "evolution":
      return {
        action: structured
          ? "Conecte dados de captação e vendas para orientar os próximos investimentos. Ajuste campanhas e funil pelos resultados de cada origem."
          : "Conecte o CRM à origem dos contatos e acompanhe o avanço até a venda. Use esses números para ajustar campanhas e atendimento.",
        services: ["CRM e mensuração", "Otimização de campanhas"],
      };
    default:
      return { action: priority.action, services: [] };
  }
}
