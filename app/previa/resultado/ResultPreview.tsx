"use client";
import { useState } from "react";
import { DiagnosisResult } from "@/components/DiagnosisResult";
import { getDiagnosis, type Answers } from "@/lib/funnel";
const answers: Answers = {
  segment: "Estética e clínica",
  revenue: "R$ 20 mil a R$ 30 mil",
  goal: "Mais conversão",
  strategy: 2,
  leads: 1,
  image: 1,
  transformation: 0,
  evolution: 2,
};
const diagnosis = getDiagnosis("Estética e clínica", answers);
export default function ResultPreview() {
  const [notice, setNotice] = useState(false);
  return (
    <main className="result-page compact-result-page">
      <div className="result-preview-toolbar">
        <strong>Prévia local · Dados ilustrativos</strong>
        <a href="/">Testar funil completo ↗</a>
      </div>
      <header className="quiz-header result-header">
        <img
          src="/images/logo-elite.png"
          alt="Elite Mídias"
          className="brand-logo"
        />
        <button className="pdf-button" onClick={() => window.print()}>
          Salvar relatório em PDF
        </button>
      </header>
      {notice ? (
        <p className="preview-notice" role="status">
          Este é um exemplo visual. No funil completo, o botão abre as três
          perguntas de qualificação e depois a agenda. Nenhum lead ou
          agendamento foi criado.
        </p>
      ) : null}
      <DiagnosisResult
        company="Clínica exemplo"
        segment="Estética e clínica"
        answers={answers}
        diagnosis={diagnosis}
        onSchedule={() => {
          setNotice(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </main>
  );
}
