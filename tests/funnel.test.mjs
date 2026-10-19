import test from "node:test";
import assert from "node:assert/strict";

const funnel = await import("../lib/funnel.ts").catch(() => ({}));

test("cada segmento tem oito perguntas e cinco pilares sem repetição", () => {
  assert.equal(typeof funnel.getSteps, "function");
  for (const segment of funnel.segments) {
    const steps = funnel.getSteps(segment);
    assert.equal(steps.length, 8);
    assert.equal(new Set(steps.map((step) => step.id)).size, 8);
    assert.equal(
      new Set(steps.filter((step) => step.pillar).map((step) => step.pillar))
        .size,
      5,
    );
  }
});

test("pontuação usa respostas válidas e vai de zero a cem", () => {
  assert.equal(typeof funnel.getDiagnosis, "function");
  const steps = funnel.getSteps("Estética e clínica");
  const low = Object.fromEntries(
    steps.filter((s) => s.pillar).map((s) => [s.id, 0]),
  );
  const high = Object.fromEntries(
    steps.filter((s) => s.pillar).map((s) => [s.id, 3]),
  );
  assert.equal(funnel.getDiagnosis("Estética e clínica", low).score, 0);
  assert.equal(funnel.getDiagnosis("Estética e clínica", high).score, 100);
  assert.equal(
    funnel.isComplete("Estética e clínica", {
      ...high,
      segment: "Estética e clínica",
      revenue: "Até R$ 20 mil",
      goal: "Mais oportunidades",
    }),
    true,
  );
  assert.equal(
    funnel.isComplete("Estética e clínica", { ...low, strategy: 99 }),
    false,
  );
});

test("recomendação usa resposta e linguagem do segmento", () => {
  assert.equal(typeof funnel.getDiagnosis, "function");
  const answers = {
    strategy: 3,
    leads: 3,
    image: 3,
    transformation: 0,
    evolution: 3,
  };
  const clinical = funnel.getDiagnosis("Estética e clínica", answers);
  const industry = funnel.getDiagnosis("Indústria e fábrica", answers);
  assert.equal(clinical.priorities[0].id, "transformation");
  assert.notEqual(clinical.priorities[0].action, industry.priorities[0].action);
  assert.match(clinical.priorities[0].answer, /perdem|responde/i);
});

test("qualificação separa orçamento, decisão e prazo da nota de maturidade", () => {
  assert.equal(typeof funnel.getQualification, "function");
  assert.equal(
    funnel.getQualification({
      budget: "not_now",
      role: "decision",
      timing: "now",
    }),
    "nurture",
  );
  assert.equal(
    funnel.getQualification({ budget: "yes", role: "decision", timing: "now" }),
    "ready",
  );
  assert.equal(
    funnel.getQualification({
      budget: "consider",
      role: "decision",
      timing: "now",
    }),
    "review",
  );
  assert.equal(
    funnel.getQualification({
      budget: "yes",
      role: "research",
      timing: "later",
    }),
    "later",
  );
});

test("retomada descarta perguntas antigas, inválidas e dados pessoais", () => {
  assert.equal(typeof funnel.restoreAnswers, "function");
  const restored = funnel.restoreAnswers({
    segment: "Estética e clínica",
    revenue: "Até R$ 20 mil",
    goal: "Mais oportunidades",
    strategy: 2,
    leads: 99,
    nome: "Não persistir",
  });
  assert.equal(restored.revenue, "Até R$ 20 mil");
  assert.equal(restored.strategy, 2);
  assert.equal(restored.leads, undefined);
  assert.equal(restored.nome, undefined);
});
