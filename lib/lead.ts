import {
  FUNNEL_VERSION,
  getDiagnosis,
  getQualification,
  getSteps,
  isComplete,
  qualificationSteps,
  restoreAnswers,
} from "./funnel.ts";

export function buildCrmPayload(input: unknown) {
  if (!input || typeof input !== "object") throw new Error("Dados inválidos.");
  const body = input as Record<string, unknown>;
  const lead = body.lead as Record<string, unknown> | undefined;
  const text = (value: unknown, max = 250) =>
    typeof value === "string" ? value.trim().slice(0, max) : "";
  const name = text(lead?.name, 120),
    company = text(lead?.company, 180),
    phone = text(lead?.whatsapp, 40).replace(/\D/g, ""),
    email = text(lead?.email, 180);
  if (name.length < 2 || company.length < 2)
    throw new Error("Informe seu nome e o nome da empresa.");
  if (!/^\d{10,11}$/.test(phone) && !/^55\d{10,11}$/.test(phone))
    throw new Error("Confira o WhatsApp e inclua o DDD.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Confira o email informado.");
  const answers = restoreAnswers(body.answers);
  const segment = String(answers.segment ?? "");
  if (!isComplete(segment, answers))
    throw new Error("Revise as respostas do diagnóstico.");
  const session = text(body.sessionId, 80);
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(session))
    throw new Error("Reabra o diagnóstico e tente novamente.");
  const phase = text(body.phase, 30);
  if (!["diagnostic", "qualification", "booking"].includes(phase))
    throw new Error("Etapa inválida.");
  const diagnosis = getDiagnosis(segment, answers);
  const payload: Record<string, string> = {
    nome: name,
    empresa: company,
    whatsapp: phone,
    email,
    faturamento: String(answers.revenue),
    segmento: segment,
    objetivo: String(answers.goal),
    score: `${diagnosis.score}/100`,
    gargalo: diagnosis.priorities[0].name,
    faixa_score: diagnosis.band,
    origem: "Raio X Elite Mídias",
    versao_funil: FUNNEL_VERSION,
    etapa: phase,
    external_id: `${session}:${phase}`,
    prioridades: diagnosis.priorities
      .map((p) => `${p.name}: ${p.percent}%`)
      .join(" | "),
    respostas: getSteps(segment)
      .filter((s) => s.pillar)
      .map(
        (s) =>
          `${s.question}: ${s.options.find((o) => o.value === answers[s.id])?.label}`,
      )
      .join(" | "),
  };
  if (phase !== "diagnostic") {
    const qualification = body.qualification as
      | Record<string, string>
      | undefined;
    if (
      !qualification ||
      !qualificationSteps.every((s) =>
        s.options.some((o) => o.value === qualification[s.id]),
      )
    )
      throw new Error("Responda às três perguntas para preparar sua análise.");
    for (const step of qualificationSteps)
      payload[
        step.id === "role"
          ? "papel_decisao"
          : step.id === "timing"
            ? "prazo_inicio"
            : "investimento_disponivel"
      ] = step.options.find((o) => o.value === qualification[step.id])!.label;
    payload.qualificacao = getQualification(qualification);
    payload.investimento_referencia =
      "A partir de R$ 2.000 por mês, somando assessoria de marketing e verba para anúncios";
  }
  if (phase === "booking") {
    const date = text(body.bookingAt, 60);
    if (!date || Number.isNaN(new Date(date).getTime()))
      throw new Error("Horário da reunião inválido.");
    payload.meeting_at = new Date(date).toISOString();
    payload.external_id = `${session}:booking:${text(body.bookingUid, 100) || payload.meeting_at}`;
    payload.etapa = "reuniao_confirmada";
  }
  const attribution = body.attribution as Record<string, unknown> | undefined;
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
    "landing_variant",
  ]) {
    const value = text(attribution?.[key], 300);
    if (value) payload[key] = value;
  }
  return payload;
}
