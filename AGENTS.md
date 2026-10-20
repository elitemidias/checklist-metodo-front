# Raio X Elite Mídias

## Fonte oficial de produção

- Domínio oficial: https://raiox.elitemidias.com
- Rota principal: `/`.
- Hospedagem: Vercel.
- Projeto: `checklist-metodo-front` (`prj_r6bhb44jfskw5txNGCmvUjcZdRuc`).
- Equipe: `fernandos-projects-ebb7c946` (`team_gzdEY4Lg9MdMyqY17ViCzS08`).
- Pasta de produção: `/Users/fernandogoncalves/Documents/Projetos/elite-midias/Elite Midias/Raio-X Elite Midias`.
- Remoto Git configurado: `https://github.com/elitemidias/checklist-metodo-front.git`. As publicações têm sido realizadas pela CLI da Vercel a partir desta pasta; não assumir que o remoto está atualizado sem verificar.
- Em 19/10/2026, a leitura autenticada da Vercel confirmou o domínio e a publicação `dpl_78RiDL9xWtaah4hwatnj8UjpMeUv`, commit `b29a5e8085aa0eba8de5380a990356b4f98a2e92`, correspondente ao HEAD local.
- A cópia no Sites é apoio privado, não o domínio comercial oficial. Não substituir o destino de produção por essa cópia.
- Em 20/10/2026, antes da revisão visual, a Vercel confirmou como produção `dpl_9ZKSLy6p9eXuZZ6nTwFCCr1MMadS`, commit `3cf26e903cd605355818c8916d11b97e8422b7e9`, correspondente à fonte local e ao GitHub.

## Posicionamento e objetivo

O Raio X é um funil da Elite Mídias para donos e responsáveis por empresas em operação. A autoavaliação aborda marketing, aquisição, conversão comercial e capacidade de crescimento, e conduz a uma análise estratégica com a agência. A meta comercial é gerar reuniões qualificadas e contratos com boa margem e retenção.

Contexto comercial confirmado pelo usuário em 19/10/2026:

- Mensalidade mínima: R$ 1.000 por mês.
- Segmentos citados como bons clientes: estética, cirurgião plástico, distribuidoras, serviços em geral e fábricas.
- Capacidade de absorção: quatro novas empresas por mês.
- Qualificação de investimento aprovada: a partir de R$ 2.000 por mês no total, somando assessoria de marketing e verba para anúncios. Não apresentar esse total como honorários da agência. Escopo e divisão são definidos na proposta.
- Faturamento sozinho não define qualificação. Combinar aderência do problema, papel na decisão, prazo e capacidade de investimento. Usar disponibilidade real ao comunicar vagas.

## Decisões técnicas e comerciais

- Aplicação React/Next.js; página em `app/page.tsx`, banco de perguntas e score em `lib/funnel.ts`, validação de payload em `lib/lead.ts`, estilos em `app/globals.css`, metadados em `app/layout.tsx` e Pixel em `components/MetaPixel.tsx`.
- Preservar o fluxo de build vinext de apoio e a configuração Next.js da produção Vercel. Verificar o destino antes de compilar e publicar.
- A produção Next.js verifica os tipos com `tsconfig.next.json`, separado dos adaptadores legados Cloudflare do apoio privado. Não ignorar erros de tipos da aplicação de produção.
- O formulário envia JSON para `/api/leads`, que valida no servidor e encaminha ao CRM. Mantém uma cópia adicional do diagnóstico no Formspree. O campo `faturamento` deve continuar enviando o texto exato da faixa escolhida. Cada etapa tem `external_id` estável para deduplicação de tentativas na mesma sessão.
- Jornada: oito perguntas de diagnóstico (três de contexto e cinco pilares), formulário com nome/empresa/WhatsApp obrigatórios e email opcional, relatório, três perguntas comerciais e agenda. O relatório não é retido por falta de orçamento. A opção de considerar o investimento continua elegível para reunião.
- Agenda existente e verificada: `https://cal.com/nando-borba/30min`. Carregar o embed apenas na etapa da agenda. Disparar `Schedule` somente após `bookingSuccessfulV2`, nunca por clique no WhatsApp. Não criar reservas fictícias nos testes.
- Retomada do quiz usa apenas respostas e atribuição de campanha em `sessionStorage`, sem persistir os dados pessoais de contato. Score de maturidade e classificação comercial são separados.
- WhatsApp oficial: `5521966559243`, exibido como `(21) 96655-9243`. Não restaurar o número antigo.
- O score atual é uma autoavaliação de maturidade, não auditoria de dados financeiros ou de contas de anúncios. Faturamento e objetivo são contexto; na versão auditada, não alteram a fórmula.
- Separar score de maturidade e aderência comercial em futuras mudanças. Não presumir que uma nota baixa representa um lead mais qualificado.
- Não prometer faturamento, retorno ou prazo de crescimento sem evidência e escopo verificáveis.
- Antes de alterações em produção, explicar brevemente o destino confirmado e o que será modificado; preservar mudanças preexistentes e sincronizar fonte e publicação.

## SEO e validação

Aplicar o padrão global solicitado pelo usuário: título e descrição específicos, canônica, idioma e indexabilidade, conteúdo semântico, dados estruturados coerentes, compartilhamento social, sitemap.xml, robots.txt, llms.txt factual e Search Console verificado com a conta autorizada, com envio e processamento do sitemap quando o acesso permitir. Auditar antes de criar ou duplicar. Não usar meta keywords nem prometer rankings ou recomendação por IA.

Na reestruturação de 19/10/2026 foram implementados canônica, JSON-LD, sitemap.xml, robots.txt, llms.txt e página de uso dos dados. Search Console depende de acesso à propriedade autorizada e não deve ser anunciado como configurado sem verificação efetiva. O sitemap contém somente a página principal; a página de privacidade tem noindex.

Após uma publicação, verificar no domínio oficial ao menos a página principal, redirecionamentos, metadados, sitemap.xml, robots.txt e llms.txt. Registrar somente o que foi realmente testado.

## Direção visual aprovada em 20/10/2026

- Imagem do Nando na abertura, comparação visual de abordagens Agência genérica × Elite Mídias, depoimento real do Leandro e prévia ilustrada do Mapa de Crescimento. Preservar quiz, orçamento, CRM, agenda e eventos de conversão.
- Blocos novos isolados em `components/LandingPresentation.tsx`; estilos desta revisão restritos aos componentes da apresentação.
- Retrato de camisa preta reutilizado do site oficial em `site/public/brand/nando-maquina-elite-v1.png`. Foto de bastidores obtida em `Downloads/Arquivo/Imagens/nando mao 2.jpg`. Não gerar um rosto substituto nem cortar a cabeça nos enquadramentos.
- Depoimento reutilizado do vídeo original de 38,477 segundos, publicado em `https://elitemidias.com/media/depoimento-leandro-v1.mp4`. Citação já publicada: “Ele pegou a minha empresa numa baixa.” Identificar Leandro como empresário do setor de serviços, sem inventar empresa, números ou promessas.
- Vídeo com controles, playsInline, capa e preload none, sem reprodução automática. Há legendas visuais no próprio vídeo e um resumo textual identificado como resumo.
- A comparação descreve uma abordagem genérica centrada em tarefas, não uma alegação sobre todas as agências. O mapa é identificado como prévia ilustrativa e não representa projeção de faturamento.
