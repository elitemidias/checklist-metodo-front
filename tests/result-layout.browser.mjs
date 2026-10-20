import assert from "node:assert/strict";

const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE_PATH ?? "playwright"
);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? undefined,
  headless: true,
});
const base = process.argv[2] ?? "http://localhost:3006";
const results = [];
try {
  for (const viewport of [
    { width: 320, height: 667 },
    { width: 360, height: 640 },
    { width: 375, height: 667 },
    { width: 390, height: 844 },
    { width: 414, height: 896 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    const { width, height } = viewport;
    const page = await browser.newPage({
      viewport,
      isMobile: width < 600,
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/connect.facebook.net/**", (route) => route.abort());
    await page.route("**/www.facebook.com/tr/**", (route) => route.abort());
    await page.route("**/api/leads", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: '{"ok":true}',
      }),
    );
    await page.goto(base, { waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: "Descobrir meu principal gargalo" })
      .click();
    await page
      .getByRole("radio", { name: "Estética e clínica", exact: false })
      .click();
    await page
      .getByRole("heading", {
        name: "Qual é o faturamento médio mensal da empresa?",
      })
      .waitFor();
    await page
      .getByRole("radio", { name: "R$ 20 mil a R$ 30 mil", exact: false })
      .click();
    await page
      .getByRole("heading", {
        name: "Qual resultado é prioridade nos próximos 90 dias?",
      })
      .waitFor();
    await page.getByRole("radio").nth(1).click();
    for (const point of [2, 1, 1, 0, 2]) {
      await page.waitForTimeout(240);
      await page.getByRole("radio").nth(point).click();
    }
    await page
      .getByRole("heading", { name: "Para quem devemos abrir o relatório?" })
      .waitFor();
    await page.getByLabel("Seu nome", { exact: true }).fill("Teste visual");
    await page.getByLabel("Empresa", { exact: true }).fill("Clínica exemplo");
    await page.getByLabel("WhatsApp com DDD").fill("21900000003");
    await page
      .getByRole("button", { name: "Abrir meu relatório gratuito" })
      .click();
    await page.locator(".result-page").waitFor();
    await page.waitForTimeout(1000);
    assert.equal(
      await page.locator(".report-band").count(),
      3,
      "Result must have only three content bands",
    );
    const firstButton = page.locator(".result-overview button.green-button");
    const firstBox = await firstButton.boundingBox();
    assert.ok(
      firstBox.y + firstBox.height <= height,
      `First meeting CTA is below the first screen at ${width}`,
    );
    assert.equal(await page.locator(".compact-pillars > div").count(), 5);
    assert.equal(await page.locator(".result-actions > li").count(), 3);
    const recommended = page
      .locator(".result-actions > li")
      .first()
      .getByRole("list", { name: "Serviços da Elite para Transformação" });
    assert.equal(await recommended.getByRole("listitem").count(), 2);
    assert.ok(
      await recommended
        .getByRole("listitem")
        .filter({ hasText: "CRM e funil comercial" })
        .isVisible(),
    );
    assert.ok(
      await recommended
        .getByRole("listitem")
        .filter({ hasText: "IA de atendimento" })
        .isVisible(),
    );
    assert.equal(
      await page.locator(".result-screen .score-value strong").textContent(),
      "40",
    );
    const size = await page.locator(".result-screen .score-ring").boundingBox();
    assert.ok(size.width <= 120, "Score must leave space for the conclusion");
    const details = page.locator(".result-details");
    assert.equal(await details.getAttribute("open"), null);
    await details.locator("summary").click();
    assert.ok(
      await details.locator("svg").isVisible(),
      "Radar remains available on demand",
    );
    await details.locator("summary").click();
    const dimensions = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      width: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    assert.ok(
      dimensions.width <= dimensions.clientWidth + 1,
      `Overflow at ${width}`,
    );
    assert.ok(dimensions.height < 2600, `Result is still too long at ${width}`);
    await page.screenshot({
      path: `/private/tmp/raiox-result-compact-${width}.png`,
      fullPage: true,
    });
    await page.emulateMedia({ media: "print" });
    const print = page.locator(".print-only-report");
    assert.ok(
      await print.isVisible(),
      "Full report must print with details closed",
    );
    assert.equal(await print.locator(".print-priority").count(), 3);
    assert.equal(await print.locator(".print-pillar").count(), 5);
    assert.ok(
      await print
        .locator(".print-priority")
        .first()
        .getByText(/CRM e funil comercial/)
        .isVisible(),
    );
    assert.ok(
      await print
        .locator(".print-priority")
        .first()
        .getByText("Muitos contatos se perdem sem retorno", { exact: false })
        .isVisible(),
    );
    assert.ok(
      !(await firstButton.isVisible()),
      "Meeting controls must not appear in PDF",
    );
    if (width === 1440)
      await page.pdf({
        path: "/private/tmp/raiox-result-compact-report.pdf",
        format: "A4",
        printBackground: true,
        margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
      });
    await page.emulateMedia({ media: "screen" });
    await firstButton.click();
    await page
      .getByRole("radio", { name: "Sim, eu decido pela empresa", exact: false })
      .waitFor();
    assert.deepEqual(errors, []);
    results.push({
      width,
      viewportHeight: height,
      height: dimensions.height,
      firstCTAEnd: Math.round(firstBox.y + firstBox.height),
      threeBands: true,
      fullPrint: true,
      qualification: true,
      errors,
    });
    await page.close();
  }
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
