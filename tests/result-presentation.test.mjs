import test from "node:test";
import assert from "node:assert/strict";

const presentation = await import("../lib/result-presentation.ts").catch(
  () => ({}),
);

test("a conclusão traduz conversão para a jornada de cada segmento", () => {
  assert.equal(typeof presentation.getResultHeadline, "function");
  for (const [segment, expected] of [
    ["Estética e clínica", /agendamentos/],
    ["Cirurgia plástica", /agendamentos/],
    ["Comércio e loja virtual", /compras/],
    ["Distribuidora", /pedidos/],
    ["Indústria e fábrica", /pedidos/],
    ["Educação", /matrículas/],
    ["Serviços profissionais", /contratos/],
  ]) {
    assert.match(
      presentation.getResultHeadline(segment, "transformation", 0),
      expected,
    );
  }
});

test("uma base com nota máxima não é descrita como perda ou falha", () => {
  assert.equal(typeof presentation.getResultHeadline, "function");
  const headline = presentation.getResultHeadline(
    "Estética e clínica",
    "transformation",
    3,
  );
  assert.match(headline, /próximo avanço/);
  assert.doesNotMatch(headline, /perd|falha|gargalo/);
});

test("contatos sem acompanhamento recebem uma frente de CRM e IA ligada ao agendamento", () => {
  assert.equal(typeof presentation.getExecutionRecommendation, "function");
  const result = presentation.getExecutionRecommendation("Estética e clínica", {
    id: "transformation",
    points: 0,
    action: "Acompanhar os contatos.",
  });
  assert.deepEqual(result.services, [
    "CRM e funil comercial",
    "IA de atendimento",
  ]);
  assert.match(result.action, /etapas/);
  assert.match(result.action, /etiquetas/);
  assert.match(result.action, /agendamento/);
});

test("a falta de demanda recomenda captação, não um catálogo genérico de serviços", () => {
  assert.equal(typeof presentation.getExecutionRecommendation, "function");
  const result = presentation.getExecutionRecommendation(
    "Indústria e fábrica",
    { id: "leads", points: 0, action: "Captar oportunidades." },
  );
  assert.deepEqual(result.services, ["Tráfego pago", "Criação de criativos"]);
  assert.match(result.action, /cotações/);
  assert.ok(!result.services.some((service) => /CRM|IA/.test(service)));
});

test("o serviço de conversão usa o próximo passo comercial de cada segmento", () => {
  assert.equal(typeof presentation.getExecutionRecommendation, "function");
  for (const [segment, expected] of [
    ["Cirurgia plástica", /consulta de avaliação/],
    ["Distribuidora", /pedido/],
    ["Indústria e fábrica", /pedido/],
    ["Comércio e loja virtual", /compra/],
    ["Educação", /matrícula/],
    ["Serviços profissionais", /fechamento/],
  ]) {
    const result = presentation.getExecutionRecommendation(segment, {
      id: "transformation",
      points: 1,
      action: "Retomar contatos.",
    });
    assert.match(result.action, expected);
  }
});

test("uma rotina estruturada recebe otimização, sem presumir falta de CRM", () => {
  assert.equal(typeof presentation.getExecutionRecommendation, "function");
  const result = presentation.getExecutionRecommendation("Estética e clínica", {
    id: "transformation",
    points: 3,
    action: "Acompanhar motivos de perda.",
  });
  assert.deepEqual(result.services, [
    "Otimização do funil",
    "Automação de atendimento",
  ]);
  assert.doesNotMatch(result.action, /[Ii]mplemente um CRM/);
});

test("cada prioridade mantém uma recomendação curta e no máximo duas frentes de execução", () => {
  assert.equal(typeof presentation.getExecutionRecommendation, "function");
  for (const id of [
    "strategy",
    "leads",
    "image",
    "transformation",
    "evolution",
  ]) {
    for (const points of [0, 1, 2, 3]) {
      const result = presentation.getExecutionRecommendation(
        "Estética e clínica",
        { id, points, action: "Ação original." },
      );
      assert.ok(result.action.split(/\s+/).length <= 40);
      assert.ok(result.services.length > 0 && result.services.length <= 2);
      assert.equal(new Set(result.services).size, result.services.length);
    }
  }
});

test("uma área desconhecida preserva a ação existente e não inventa serviços", () => {
  assert.equal(typeof presentation.getExecutionRecommendation, "function");
  assert.deepEqual(
    presentation.getExecutionRecommendation("Outro modelo", {
      id: "unknown",
      points: 0,
      action: "Ação original.",
    }),
    { action: "Ação original.", services: [] },
  );
});
