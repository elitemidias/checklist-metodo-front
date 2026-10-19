import { buildCrmPayload } from "@/lib/lead";

const CRM_URL =
  "https://elite-midias-crm.vercel.app/api/ingest/8641bbc01861d75ff8475f754a7c5cbc";

export async function POST(request: Request) {
  let payload: Record<string, string>;
  try {
    const raw = await request.text();
    if (raw.length > 24000)
      return Response.json(
        { ok: false, error: "Dados acima do limite permitido." },
        { status: 413 },
      );
    payload = buildCrmPayload(JSON.parse(raw));
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Confira os dados informados.",
      },
      { status: 400 },
    );
  }
  try {
    const requests = [
      fetch(CRM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000),
      }),
    ];
    if (payload.etapa === "diagnostic")
      requests.push(
        fetch("https://formspree.io/f/xgodrpnk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(1500),
        }),
      );
    const [crm] = await Promise.allSettled(requests);
    if (crm.status !== "fulfilled" || !crm.value.ok)
      throw new Error("crm_unavailable");
    const result = (await crm.value.json()) as {
      ok?: boolean;
      skipped?: boolean;
      reason?: string;
    };
    if (result.ok !== true || (result.skipped && result.reason !== "duplicate"))
      throw new Error("crm_not_received");
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      {
        ok: false,
        error:
          "Não conseguimos concluir o envio agora. Suas respostas continuam aqui. Tente novamente em instantes.",
      },
      { status: 502 },
    );
  }
}
