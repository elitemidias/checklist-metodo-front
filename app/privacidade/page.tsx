import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Como usamos seus dados | Raio X Elite Mídias",
  description:
    "Conheça os dados usados para preparar o diagnóstico e a análise da Elite Mídias.",
  alternates: { canonical: "https://raiox.elitemidias.com/privacidade" },
  robots: { index: false, follow: true },
};
export default function Privacy() {
  return (
    <main className="privacy-page">
      <Link href="/">← Voltar ao Raio X</Link>
      <h1>Como usamos os dados do Raio X.</h1>
      <p>
        Usamos suas respostas para preparar o diagnóstico inicial e seu contato
        para conversar sobre o resultado e uma possível análise com a Elite
        Mídias.
      </p>
      <h2>O que é coletado</h2>
      <p>
        Segmento, faixa de faturamento, objetivo e respostas sobre a estrutura
        comercial. No formulário, nome, empresa, WhatsApp e email opcional. Se
        você solicitar uma análise, também coletamos participação na decisão,
        prazo e disponibilidade de investimento. Podemos registrar a campanha de
        origem para avaliar a qualidade da captação.
      </p>
      <h2>Onde os dados são usados</h2>
      <p>
        O contato e o resumo são enviados ao CRM da Elite Mídias. O Formspree
        recebe uma cópia de apoio do diagnóstico. A agenda Cal.com processa os
        dados necessários para reservar e confirmar sua reunião. O Pixel Meta
        registra eventos da jornada; o código do funil não envia nome, telefone
        ou email como parâmetros desses eventos.
      </p>
      <h2>Retomada no seu navegador</h2>
      <p>
        As respostas do diagnóstico podem ser mantidas na sessão do navegador
        por até 24 horas para permitir retomada. Nome, telefone e email não
        fazem parte desse rascunho. A origem da campanha também pode ser mantida
        durante a sessão.
      </p>
      <h2>Contato e solicitações</h2>
      <p>
        Para pedir esclarecimentos, correção ou exclusão dos dados enviados, ou
        informar que não deseja mais contato, fale com a equipe pelo{" "}
        <a href="https://wa.me/5521966559243" target="_blank" rel="noreferrer">
          WhatsApp oficial: (21) 96655-9243
        </a>
        .
      </p>
      <p>Atualizado em 19 de outubro de 2026.</p>
    </main>
  );
}
