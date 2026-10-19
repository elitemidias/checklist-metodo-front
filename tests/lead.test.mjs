import test from "node:test";
import assert from "node:assert/strict";
import { buildCrmPayload } from "../lib/lead.ts";
import { getSteps } from "../lib/funnel.ts";

function input(phase = "diagnostic") {
  const segment = "Estética e clínica";
  return {
    phase,
    sessionId: "test-session-raiox-v2",
    lead: {
      name: "Teste de validação",
      company: "Empresa de teste",
      whatsapp: "(21) 90000-0003",
      email: "",
    },
    answers: {
      segment,
      revenue: "Até R$ 20 mil",
      goal: "Mais oportunidades",
      ...Object.fromEntries(
        getSteps(segment)
          .filter((s) => s.pillar)
          .map((s) => [s.id, 1]),
      ),
    },
    qualification: { role: "decision", timing: "now", budget: "consider" },
    attribution: { utm_source: "teste", nome: "Não enviar como atribuição" },
  };
}
test("preserva o texto do faturamento e envia respostas legíveis ao CRM", () => {
  const payload = buildCrmPayload(input());
  assert.equal(payload.faturamento, "Até R$ 20 mil");
  assert.equal(payload.whatsapp, "21900000003");
  assert.equal(payload.score, "33/100");
  assert.match(payload.respostas, /A recepção responde/);
  assert.equal(payload.utm_source, "teste");
  assert.equal(payload.nome, "Teste de validação");
  assert.equal(payload.email, "");
});
test("qualificação indecisa fica disponível para conversa e tem orçamento total explícito", () => {
  const p = buildCrmPayload(input("qualification"));
  assert.equal(p.qualificacao, "review");
  assert.match(p.investimento_referencia, /R\$ 2.000/);
  assert.match(p.investimento_disponivel, /preciso entender o plano/);
});
test("rejeita telefone inválido e diagnóstico incompleto antes de qualquer envio", () => {
  const bad = input();
  bad.lead.whatsapp = "123";
  assert.throws(() => buildCrmPayload(bad), /WhatsApp/);
  const partial = input();
  delete partial.answers.strategy;
  assert.throws(() => buildCrmPayload(partial), /Revise/);
});
test("reenvios da mesma etapa têm chave estável e etapas diferentes não se confundem", () => {
  assert.equal(
    buildCrmPayload(input()).external_id,
    buildCrmPayload(input()).external_id,
  );
  assert.notEqual(
    buildCrmPayload(input()).external_id,
    buildCrmPayload(input("qualification")).external_id,
  );
});
test("agendamento exige horário real e só então envia meeting_at", () => {
  assert.throws(() => buildCrmPayload(input("booking")), /Horário/);
  const body = {
    ...input("booking"),
    bookingAt: "2026-10-22T14:00:00-03:00",
    bookingUid: "teste-calendar",
  };
  assert.equal(buildCrmPayload(body).meeting_at, "2026-10-22T17:00:00.000Z");
  assert.equal(buildCrmPayload(body).etapa, "reuniao_confirmada");
});
