# VERAORIS — Histórico do Projeto

Este arquivo é lido automaticamente pelo Claude Code toda vez que uma sessão começa
dentro deste repositório. Serve como memória entre sessões: se você (Priscila) abrir
uma conversa nova, o Claude já vai ter lido isto antes de você dizer qualquer coisa.
Se quiser garantir que ele leu, pode simplesmente pedir: **"lê o CLAUDE.md e me
resume o que já foi feito"**.

Sempre que fizermos algo importante numa sessão nova, esse arquivo deve ser
atualizado no final (seção "Histórico cronológico") para continuar servindo de
memória viva do projeto.

## O que é o VERAORIS

Site de comparação de preços de produtos de beleza (skincare, maquiagem, cabelo)
para Brasil e Portugal. veraoris.com. Dono: Priscila (leiga em programação —
sempre explicar passo a passo, sem jargão técnico sem explicação).

- **Hospedagem**: Netlify (publica automaticamente a partir do branch `main` do
  GitHub — confirmado porque o histórico de commits do `main` mostra "Add files
  via upload", que é exatamente o rastro que o GitHub deixa quando alguém edita/
  cola arquivo pela interface web, do jeito que a Priscila vem fazendo).
- **Repositório**: `Priscilamfc/veraoris` no GitHub.
- **Backend**: Supabase (mensagens de contacto, cliques, quiz, dicas, promoções).
- **Arquivo principal**: `index.html` — site inteiro num arquivo só (HTML+CSS+JS
  inline), bem grande.
- **Funções serverless** (`netlify/functions/`): mantêm segredos fora do browser.
  - `admin.js` — valida senha do admin no servidor.
  - `awin-search.js` — busca no feed da Awin (afiliado Eudora), com cache de 30min.
  - `scrappa-search.js` — busca de preços via Scrappa (API paga, usa créditos).
- **Afiliados**: tag Amazon BR = `pmfc-20`, tag Amazon PT/ES = `pmfc77-21`.
  Eudora via Awin (feed próprio, imagens incluídas). Beleza na Web **não** tem
  afiliação real ainda — só aparece via busca no Google, sem comissão.

## Colaboração: Luciano (irmão da Priscila) também trabalha neste repositório

Desde 12/07/2026 o Luciano (usuário GitHub `luciano-lcn`) é colaborador com
permissão de escrita, trabalhando com o Claude dele a partir da máquina dele.
Ou seja: **duas pessoas (cada uma com seu Claude) podem mexer neste código**.
Para nunca dar conflito, as regras são:

1. **Antes de editar qualquer coisa**: `git pull origin main` (trazer o que o
   outro lado já enviou). Sempre. Sem exceção.
2. **Depois de terminar um bloco de trabalho**: commit + `git push` logo em
   seguida — não deixar mudança pronta parada na máquina, porque o outro lado
   pode começar a mexer sem ver.
3. **Commits pequenos e descritivos**, um assunto por commit.
4. **Os dois lados atualizam este CLAUDE.md** ao final de cada sessão de
   trabalho (seção "Histórico cronológico"), dizendo o que foi feito. É assim
   que o Claude da Priscila e o Claude do Luciano ficam sabendo um do outro.
5. **Lembrete importante**: push no `main` publica o site na hora (Netlify).
   Mudança grande ou arriscada → avisar o outro lado antes (Priscila ↔ Luciano
   por WhatsApp) ou usar um branch.

## Fluxo de trabalho com o GitHub

**Histórico do problema**: `git push` falhava sempre com erro 403 nesta sessão,
mesmo sendo o repositório dela. Descobri que o app "Claude" no GitHub da Priscila
estava **autorizado** (identidade confirmada) mas **não instalado** em nenhuma
conta/repositório — são duas etapas diferentes no GitHub. Ela instalou o app em
`https://github.com/apps/claude`, escolhendo "Only select repositories" → `veraoris`,
e a partir daí o `git push` passou a funcionar normalmente.

**Situação atual**: o branch de trabalho desta sessão (`claude/website-review-ctpqt1`)
estava **desatualizado** em relação ao `main` (que é o branch real publicado no
Netlify e onde a Priscila colava os arquivos manualmente). Antes de sincronizar
os dois, é preciso confirmar com ela e comparar com cuidado para não sobrescrever
nada que ela tenha colado manualmente e que ainda não esteja neste branch.

**Regra daqui pra frente**: sempre trabalhar a partir do `main` atualizado (dar
`git fetch origin main` antes de editar), avisar a Priscila do que vai mudar,
e só então enviar (`git push`) — sem precisar mais mandar arquivo pra ela colar
manualmente, a não ser que a escrita volte a falhar por algum motivo.

## Histórico cronológico (resumo)

### Sessões anteriores a esta (via resumo herdado)
- Expansão do catálogo: ~1000 produtos BR + ~470 PT/ES gerados.
- Segurança: senha do admin, leitura/exclusão de dados sensíveis e chave da
  Scrappa movidas para funções serverless (antes expostas no código do cliente).
- Fotos automáticas de produtos Eudora (BR) sem gastar crédito Scrappa.
- Logo novo (beija-flor, gerado no Gemini) aplicado em nav/rodapé/PWA/favicon.
- Links de Instagram (@veraoris.oficial) e TikTok (@veraoris.oficial) no rodapé.
- Perfil do TikTok configurado (nome, bio, foto, link).
- Post de Instagram criado (foto lifestyle + print do site composto).
- Bug corrigido: botão "Adicionar Promoção" só aceitava link Amazon, agora aceita
  também Eudora (BR), sem forçar tag de afiliado em link que não é da Amazon.
- Bug corrigido: cards de promoção não carregavam foto real (faltava chamar
  `preloadEudoraImage`).

### Sessão atual
- Feedback sobre 3 vídeos do TikTok + roteiro de vídeo novo (formato vertical,
  gravação de tela + texto, sem aparecer/sem voz por pedido dela).
- Ajuda com afiliados: explicado delay do relatório de comissões da Amazon,
  confirmado que clique estava registrando; depois descoberto que a API de
  produtos da Amazon (Creators API) exige 10 vendas em 30 dias — ela ainda não
  bateu esse número.
- **Correções grandes no site** (todas já commitadas):
  1. Resultados do quiz voltaram a comparar automaticamente 3 preços ao vivo
     (antes exigia clique, pra economizar crédito Scrappa — ela pediu pra
     voltar ao automático mesmo gastando).
  2. Botão "Compare Aqui" renomeado para "Faça o Quiz e Compare Aqui" em todos
     os botões (nav, hero, secção CAQ), PT e EN.
  3. Busca de produtos (`renderProds`) reescrita para casar por palavra
     (qualquer termo bate, ordenado por relevância) em vez de exigir a frase
     exata — resolvia "produto não encontrado" para buscas legítimas.
  4. Comparação de preços passou a diversificar por loja (não repete a mesma
     loja 3x nos resultados).
  5. Filtro de região: bloqueia lojas de Portugal/Espanha (Sweetcare, Soin et
     Nature, Pharmoperation, "LDA", ".pt") aparecendo em resultados do Brasil,
     e o inverso para Portugal.
  6. **Fotos erradas em produtos** (bug relatado várias vezes, corrigido em
     camadas até resolver de vez):
     - 1ª tentativa: restringir a foto trocada ao resultado realmente exibido
       (não pegar de qualquer lugar do array combinado). Insuficiente.
     - 2ª tentativa: usar só imagem da Eudora (nunca thumbnail do Google/
       Scrappa). Insuficiente sozinho.
     - 3ª tentativa: exigir que o nome do produto da Eudora contenha a marca
       pesquisada. Resultado colateral: quase nenhuma foto real aparecia (Eudora
       não vende marcas de farmácia como CeraVe/La Roche-Posay), e virou muita
       repetição do ícone genérico.
     - 4ª tentativa (decisão da Priscila): trocar validação de MARCA por
       validação de TIPO de produto (`SUB_KEYWORDS`, baseado no campo `sub` do
       catálogo) — qualquer marca serve, desde que seja o mesmo tipo de item.
     - Bug remanescente: "hidratante" é usada como adjetivo de marketing em
       produtos de categorias diferentes (ex: "batom hidratante"), então batia
       a palavra-chave errado. **Correção final**: listas de substantivos
       exclusivos por categoria (`MAKEUP_ONLY_NOUNS`, `SKINCARE_ONLY_NOUNS`,
       `HAIR_ONLY_NOUNS`) que rejeitam o match se o produto encontrado tiver
       palavra de categoria diferente da pesquisada, mesmo que a palavra-chave
       também bata.
  7. Etiqueta "Foto ilustrativa" adicionada sobre o ícone genérico (o que ela
     criou), escondida automaticamente quando uma foto real é carregada — tanto
     nos cards de produto quanto nos de promoção.
  8. Passo "Qual é o seu orçamento?" do quiz ganhou opção "🌟 Todos".
- Descoberta e resolução do bloqueio de escrita no GitHub (ver secção acima).

### Sessão 12/07/2026 — lado do Luciano (Claude do Luciano)
- Luciano entrou como colaborador (`luciano-lcn`, permissão Write) e clonou o repo.
- **Auditoria de ponta a ponta do comparador de preços** feita a pedido do
  Luciano, com testes reais nas funções de produção. Resultado completo em
  `AUDITORIA_COMPARADOR_2026-07-12.md` (na raiz do repo). Resumo dos achados:
  1. `scrappa-search.js` pareia `immersive_products` com `popular_products`
     por índice — mistura produto, loja e preço (explica preço "diferente na loja").
  2. Nos testes, 0 de 12 resultados Scrappa tinham link direto → todo "Ir →"
     cai em busca do Google (explica cair em página cheia de produtos).
  3. Resultados Eudora entram como preço de QUALQUER produto pesquisado
     (creme de mãos Eudora aparecendo como melhor preço de CeraVe facial).
  4. Foto valida "mesmo tipo", não "mesmo produto" → foto errada nos cards.
  5. Mercado Livre via Apify está retornando vazio em produção; a API oficial
     do ML (`search.js`, com link direto de produto) existe no repo mas não é
     chamada por ninguém.
- Nada de código do site foi alterado nesta sessão — só documentação
  (este arquivo + o relatório de auditoria). Correções começam depois que a
  Priscila e o Luciano combinarem as prioridades (seção 5 do relatório).
- **Pesquisa de lojas parceiras** feita na sequência (pedido do Luciano):
  mapa completo de programas de afiliados de beleza que entregam no Brasil em
  `MAPA_LOJAS_AFILIADOS_2026-07.md`. Destaques: Sephora dá (via Rakuten);
  Beleza na Web tem afiliação via Awin (resolve pendência antiga); a Natura
  ABRIU programa de afiliados (afiliadosnatura.com.br); Shopee tem a melhor
  API de afiliados do mercado; a maioria das lojas âncora exige CNPJ; e a
  PA-API da Amazon agora exige 10 vendas/30 dias CORRENTES (regra nov/2025).

### Sessão 12/07/2026 — lado da Priscila (meu Claude)
- **Ajustes de mobile/UX**: layout Android estourava a tela (nav não cabia
  com o botão novo "Faça o Quiz e Compare Aqui") — corrigido com
  `overflow-x:hidden` global, nav com altura flexível, botão menor no mobile
  e logo maior no mobile. Confirmado resolvido pela Priscila.
- **Região Portugal escondida do público** (site fica só Brasil por
  enquanto): botão 🇵🇹 oculto, aviso de geo-detecção desativado, secção
  Portugal da página "Sobre" removida, FAQ ajustado. Painel admin continua
  com as opções de Portugal (uso interno).
- **Ordenação de produtos** (Menor/Maior preço, Mais vendidos, Nome A-Z) —
  o selector existia mas não fazia nada; corrigido. Preço é reordenado ao
  vivo conforme os cards carregam (sem custo extra de busca), Mais Vendidos
  usa cliques reais do Supabase.
- **Tentativas de corrigir foto/link errados** (mesmo problema que a
  auditoria do Luciano descreve, atacado antes de ver o relatório dele):
  validação de marca → depois validação de tipo (`SUB_KEYWORDS`) → listas
  de exclusão por categoria (`MAKEUP_ONLY_NOUNS` etc). **A auditoria do
  Luciano recomenda reverter pra "só mesma marca" — decisão pendente da
  Priscila, ver secção de tensões abaixo.**
- **`scrappa-search.js`**: tentativa de capturar link direto do produto
  (campos `link`/`product_link`) — a auditoria do Luciano confirmou que
  isso não resolve de raiz porque o problema real é mais grave: o
  pareamento por índice entre `immersive_products` e `popular_products`
  (ver achado F1 da auditoria).
- **Mercado Livre via Apify**: criada a function `mercadolivre-search.js`
  do zero (actor `karamelo/mercadolivre-scraper-brasil-portugues`).
  Processo de depuração ao vivo com a Priscila:
  1. Input errado (`searchTerms`/`startUrls` chutados) → confirmado o
     formato certo (`keyword`) direto no console da Apify.
  2. Erro 402 `actor-memory-limit-exceeded` (2GB padrão × várias buscas
     simultâneas estourava a conta grátis) → memória reduzida e fila de
     concorrência (`ML_MAX_CONCURRENT`) implementada.
  3. Com memória baixa demais (512MB) o actor voltava a dar 0 resultados →
     ajustado pra 1024MB.
  4. Resultados passaram a aparecer, mas o dedupe por nome de loja estava
     escolhendo a versão do Scrappa (sem link, cai no Google) em vez da
     versão da Apify (com link) quando ambos se chamam "Mercado Livre" →
     corrigido priorizando resultado com link real no dedupe.
  5. **Ainda em aberto**: mesmo com link, o clique ainda cai numa página do
     Google Shopping — investigação não concluída (ver linha abaixo).
- **GitHub**: guiada a instalação do app "Claude" no GitHub da Priscila
  (estava autorizado mas não instalado — resolvido) e adicionado o Luciano
  (`luciano-lcn`) como colaborador com permissão de escrita.
- **Estratégia de afiliados**: pesquisadas redes alternativas (Lomadee,
  Rakuten, Admitad — mesma pesquisa que alimentou o mapa do Luciano depois).
  Descoberto que a Beleza na Web tem programa próprio "Minha BLZ" além da
  Awin. Redigidos textos de candidatura pra novas lojas (framing "quiz
  inteligente com IA", evitando a expressão "comparador de preços" a
  pedido da Priscila). Ajuda com formulário fiscal da Rakuten (W-8BEN,
  NIF/IVA de Portugal — ela é residente lá).

## Tensão em aberto entre as duas sessões (resolver antes de mexer de novo na foto/preço)
A Priscila pediu explicitamente (nesta sessão) pra foto aceitar **qualquer
marca, mesmo tipo de produto** (ex: qualquer hidratante, não só a marca
pesquisada) — implementado em camadas ao longo do dia. A auditoria do
Luciano recomenda o oposto: só mostrar foto/preço quando é **mesma marca E
mesmo tipo** (senão fica ícone genérico), porque "mesmo tipo" ainda deixa
passar produto errado (ex: creme de mão em vez de creme facial, mesma
categoria mas item diferente).

**D3 — DECIDIDA (12/07, Priscila + Luciano): revertido para "só mesma
marca E mesmo tipo".** Implementado: a validação de identidade (marca +
categoria/tipo) agora é aplicada ANTES de um resultado da Eudora virar
linha de preço — não só na foto (ataca também o achado F3 da auditoria,
onde a Eudora contaminava a comparação de qualquer produto). Quando não
há correspondência fiel, mantém o ícone genérico com "Foto ilustrativa" —
nunca mais mostra produto/preço errado.

**Estratégia combinada de camadas (Priscila, mesma conversa)**: Camada 1
= fontes com afiliação de verdade (Eudora hoje; Beleza na Web/Sephora/etc.
quando aprovarem) — prioridade, geram comissão. Camada 2 = fontes via
Apify sem comissão (Mercado Livre já integrado; Magazine Luiza e
Americanas cotados como próximos) — servem de rede de segurança pra achar
foto/preço fiel de marcas que a Eudora não vende, sempre com a mesma
regra rígida de "mesma marca E mesmo tipo", nunca "any brand". Ordem de
implementação: primeiro estabilizar a Camada 1 (feito), Mercado Livre
(Camada 2) ainda com o link caindo no Google Shopping — resolver antes de
adicionar mais lojas na Camada 2.

## Pendências conhecidas
- **API de produtos da Amazon**: exige 10 vendas nos últimos 30 dias
  CORRENTES (regra de nov/2025, não é "uma vez só") — Priscila já bateu
  esse número uma vez, aguardando liberação da API.
- **Mercado Livre via Apify**: resultados aparecem mas o link ainda cai
  numa página do Google Shopping em vez do produto — depuração em
  andamento, ver log da sessão acima. Bloqueia expandir a Camada 2 pra
  outras lojas (Magazine Luiza, Americanas) até resolver.
- **Decisões D1 e D2 da Priscila** (ver `PLANO_ACAO_2026-07.md`, secção
  final, D3 já decidida acima): (D1) o que fazer com preços do Scrappa sem
  link direto — virar "preço de referência" sem botão, ou botão sincero
  "Buscar na loja"? (D2) autorizar migrar o catálogo de dentro do
  `index.html` pro Supabase (Onda 2 da auditoria)?
- **D4 já decidida**: toda a operação de afiliados pela conta Awin de
  Portugal da Priscila — Natura, Minha BLZ, Mercado Livre Afiliados e
  Shopee BR ficam fora do plano enquanto essa decisão valer.
- Beleza na Web: aprovada na Awin mas sem feed de produtos ainda — email
  de solicitação de feed redigido, aguardando resposta. Existe também o
  programa próprio "Minha BLZ" (exige CNPJ) como alternativa não explorada.
- **Achado F1 da auditoria (Scrappa mistura produto/loja/preço por
  pareamento de índice) ainda não corrigido** — Etapa 1 do
  `PLANO_ACAO_2026-07.md`, item 1, ainda em aberto.

### Sessão 15/07/2026 — lado da Priscila (meu Claude)
- **Site ficou fora do ar**: Netlify pausou por estourar o limite de uso
  (causa: comparação automática disparando em todo produto visível ×3
  fontes). Priscila resolveu do lado do Netlify. Correção no código:
  só os primeiros `AUTO_LOAD_COUNT=6` produtos de cada tela carregam
  sozinhos — o resto carrega via `IntersectionObserver` (lazy load) só
  quando o card entra na tela, sem precisar clicar.
- **D3 implementada de vez**: validação de marca+tipo aplicada às LINHAS
  de preço também (não só à foto) — ataca o achado F3 da auditoria.
  Correção em camadas até funcionar direito:
  1. 1ª versão exigia a marca aparecer literalmente no título — quebrou
     produtos da própria Eudora (linha SOUL/Instance não repete "Eudora"
     no título).
  2. Corrigido: marca pode bater no título OU no nome da loja/anunciante
     do resultado (não precisa de lista fixa de exceção por marca própria,
     escala sozinho pra qualquer feed novo).
  3. Prioridade de link também ajustada: só conta como "link confiável"
     pra ordenação se vier do Awin ou Apify — o campo `link` do Scrappa,
     mesmo quando existe, normalmente é uma página do Google Shopping,
     não da loja (não confiar nele pra prioridade).
- **Mercado Livre via Apify — causa raiz finalmente encontrada**: o actor
  `karamelo/mercadolivre-scraper-brasil-portugues` **exige tempo mínimo de
  execução de 100 segundos** (usa navegador completo via `xvfb-run`) — com
  menos que isso ele aborta sozinho em ~1s sem erro nem resultado. Isso é
  incompatível com uma function do Netlify chamada de forma síncrona (que
  tem limite de tempo bem menor). **Decisão: abandonar esse actor
  específico** — não dá pra simplesmente aumentar o timeout, o Netlify
  cortaria antes de qualquer forma. Candidato pra tentar no lugar:
  **Americanas Product Scraper** (`gio21/americanas-product-scraper`),
  que usa API GraphQL direto (sem navegador, rápido) — ainda não
  implementado.
- **L'Occitane en Provence BR aprovada na Awin** (Priscila conseguiu
  direto, sem precisar do email de solicitação). `awin-search.js`
  reescrito pra suportar **múltiplos feeds simultâneos** (variáveis
  `AWIN_EUDORA_FEED_URL` + `AWIN_LOCCITANE_FEED_URL`, mais fáceis de
  adicionar no futuro — só configurar a variável nova no Netlify).
  Feed configurado com sucesso, mas **Eudora parou de aparecer nos
  resultados depois dessa mudança** (mesmo pra "hidratante", que ela
  vende) — bug não identificado ainda, aguardando logs da function
  `awin-search` pra diagnosticar (não vistos ainda nesta sessão).
- **Aviso importante sobre a Awin**: gerar um deep link funciona mesmo
  pra anunciante ainda "Pendente" (não aprovado) — mas não rastreia
  comissão nesse estado. Não usar/publicar link de programa pendente até
  o status virar "Inscrito".

## DECISÃO ESTRATÉGICA GRANDE (15/07, Priscila): parar de depender do catálogo fixo
O catálogo `AMZ_PRODUCTS`/`AMZ_PRODUCTS_ES` dentro do `index.html` (~1500
produtos) foi criado só pra "esquentar" o site no início e gerar as
vendas iniciais que desbloqueariam a API da Amazon — **nunca foi pra ser
a espinha dorsal permanente do site**. Com Eudora e L'Occitane já
funcionando como fontes de dados reais (Awin), a Priscila decidiu:

1. **A busca do site não pode depender só do catálogo fixo.** Hoje, se a
   marca/produto não está pré-cadastrada em `AMZ_PRODUCTS`, a busca
   simplesmente não encontra nada — mesmo que uma loja parceira (Eudora,
   L'Occitane, ou no futuro Beleza na Web) realmente venda aquele
   produto. Exemplo dela: buscar "Redken" devia funcionar se a Beleza na
   Web vender Redken, mesmo sem Redken estar no catálogo fixo. **Ainda
   não implementado** — precisa que a busca também consulte as lojas
   conectadas ao vivo (Awin hoje; Apify depois) quando o catálogo fixo
   não achar nada, em vez de só mostrar "Nenhum produto encontrado".
2. **Ordem de prioridade das fontes daqui pra frente**: Eudora + L'Occitane
   (Awin, comissão real) são as fontes principais agora. Scrappa fica
   em segundo plano por enquanto ("muito erro e confusão" — nas palavras
   dela) — não removido do código, mas não é mais prioridade de
   desenvolvimento. Amazon volta depois, junto com as fontes da Apify
   (Mercado Livre quando resolvido, Americanas, etc.) — como mais uma
   fonte entre várias, não como base do site.
3. **Próximo passo de código** (ainda não feito): fazer a busca (`renderProds`
   / caixa "Pesquisar produto ou marca...") tentar uma busca ao vivo nos
   feeds da Awin quando o catálogo fixo não retornar nada, montando um
   card "virtual" a partir do resultado real da loja (nome, preço, foto,
   link — tudo já vem do feed, sem precisar de entrada prévia no catálogo).
