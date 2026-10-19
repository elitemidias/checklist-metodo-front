import type { Metadata } from "next";
import { MetaPixel } from "@/components/MetaPixel";
import { OFFICIAL_URL } from "@/lib/funnel";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(OFFICIAL_URL),
  title: "Raio X Elite Mídias | Diagnóstico de marketing e vendas",
  description:
    "Descubra seu principal gargalo de marketing e vendas em oito perguntas. Receba três prioridades e prepare seu Mapa de Crescimento com a Elite Mídias.",
  applicationName: "Raio X Elite Mídias",
  alternates: { canonical: OFFICIAL_URL + "/" },
  robots: { index: true, follow: true },
  icons: { icon: "/images/logo-elite.png", apple: "/images/logo-elite.png" },
  openGraph: {
    title: "Raio X Elite Mídias | O que corrigir primeiro para vender melhor",
    description:
      "Oito perguntas. Três prioridades. Um próximo passo claro para o seu negócio.",
    url: OFFICIAL_URL,
    siteName: "Elite Mídias",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "Diagnóstico E.L.I.T.E. da Elite Mídias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raio X Elite Mídias",
    description:
      "Descubra o gargalo e suas três prioridades de marketing e vendas.",
    images: ["/og.png"],
  },
};
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": OFFICIAL_URL + "/#organization",
      name: "Elite Mídias",
      url: OFFICIAL_URL,
      logo: OFFICIAL_URL + "/images/logo-elite.png",
      sameAs: [
        "https://www.instagram.com/elitemidiasmkt",
        "https://instagram.com/nandoborbaaa",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+55-21-96655-9243",
        contactType: "sales",
        availableLanguage: "Portuguese",
      },
    },
    {
      "@type": "WebSite",
      "@id": OFFICIAL_URL + "/#website",
      name: "Raio X Elite Mídias",
      url: OFFICIAL_URL,
      inLanguage: "pt-BR",
      publisher: { "@id": OFFICIAL_URL + "/#organization" },
    },
    {
      "@type": "Service",
      name: "Diagnóstico inicial de marketing e vendas",
      description:
        "Autoavaliação gratuita por segmento com três prioridades e análise estratégica conforme perfil e disponibilidade.",
      url: OFFICIAL_URL,
      provider: { "@id": OFFICIAL_URL + "/#organization" },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BRL",
        url: OFFICIAL_URL,
      },
    },
  ],
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
