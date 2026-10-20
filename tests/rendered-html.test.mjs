import assert from "node:assert/strict";
import test from "node:test";

const { default: worker } = await import("../dist/server/index.js");
function request(path = "/", init = {}) {
  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
      ...init,
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("public landing has real content and canonical metadata in server rendered HTML", async () => {
  const response = await request();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<html[^>]+lang="pt-BR"/);
  assert.match(html, /<title>Raio X Elite Mídias/);
  assert.match(
    html,
    /<link[^>]+rel="canonical"[^>]+href="https:\/\/raiox\.elitemidias\.com\/?"/,
  );
  assert.match(html, /Descubra o que está travando suas vendas/);
  assert.match(html, /8 perguntas/);
  assert.match(html, /assessoria e verba para anúncios/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /https:\/\/wa\.me\/5521966559243/);
  assert.doesNotMatch(html, /taking shape|Codex is working|codex-preview/);
});

test("privacy page is reachable with privacy specific metadata and contact", async () => {
  const response = await request("/privacidade");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /noindex/);
  assert.match(html, /5521966559243/);
  assert.match(html, /Cal\.com/);
});

test("landing presents the founder and a readable comparison before asking for the diagnosis", async () => {
  const html = await (await request()).text();
  assert.match(html, /alt="Nando Borba, fundador da Elite Mídias"/);
  const comparison =
    html.match(/<section[^>]*id="diferenca-elite"[\s\S]*?<\/section>/)?.[0] ??
    "";
  assert.match(comparison, /<table/);
  assert.match(comparison, /Agência genérica/);
  assert.match(comparison, /Com a Elite Mídias/);
  assert.match(comparison, /<th[^>]*scope="row"/);
});

test("Leandro testimonial is a real video with user initiated playback and a poster", async () => {
  const html = await (await request()).text();
  const video =
    html.match(
      /<video[^>]*aria-label="Depoimento de Leandro[^"]*"[^>]*>/,
    )?.[0] ?? "";
  assert.match(video, /controls/);
  assert.match(video, /playsInline|playsinline/);
  assert.match(video, /preload="none"/);
  assert.match(video, /poster="\/images\/leandro-depoimento.jpg"/);
  assert.doesNotMatch(video, /autoplay|autoPlay/);
  assert.match(html, /src="\/media\/depoimento-leandro.mp4"/);
});

test("lead endpoint rejects incomplete requests without contacting the CRM", async () => {
  const response = await request("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).ok, false);
});
