import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const ogImage = `${protocol}://${host}/og.png`;

  return {
    title: "Diagnóstico E.L.I.T.E. | Descubra o gargalo do seu crescimento",
    description: "Em menos de 3 minutos, identifique os gargalos entre marketing, vendas e escala e receba as três prioridades do seu negócio.",
    applicationName: "Diagnóstico E.L.I.T.E.",
    icons: { icon: "/images/logo-elite.png", apple: "/images/logo-elite.png" },
    openGraph: {
      title: "Diagnóstico E.L.I.T.E. | Elite Mídias",
      description: "Descubra o que impede sua empresa de crescer com previsibilidade.",
      type: "website",
      locale: "pt_BR",
      images: [{ url: ogImage, width: 1536, height: 1024, alt: "Diagnóstico E.L.I.T.E. da Elite Mídias" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Diagnóstico E.L.I.T.E. | Elite Mídias",
      description: "Descubra o que impede sua empresa de crescer com previsibilidade.",
      images: [ogImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
