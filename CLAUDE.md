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

1. **A busca do site não pode depender só do catálogo fixo. IMPLEMENTADO
   (15/07)**: quando o catálogo fixo não acha nada pra um termo buscado,
   `finishRenderProds` agora chama `awinSearchPrices` ao vivo (Eudora +
   L'Occitane combinadas) e renderiza os resultados reais direto —
   `liveResultCard()` monta um card simples com foto/preço/link reais da
   loja, sem precisar de entrada prévia no catálogo. Só cobre a região
   Brasil por enquanto (as lojas Awin configuradas hoje são BR). Ainda
   não estendido pra Apify (Mercado Livre etc.) nesse fallback — só Awin.
2. **Ordem de prioridade das fontes daqui pra frente**: Eudora + L'Occitane
   (Awin, comissão real) são as fontes principais agora. Scrappa fica
   em segundo plano por enquanto ("muito erro e confusão" — nas palavras
   dela) — não removido do código, mas não é mais prioridade de
   desenvolvimento. Amazon volta depois, junto com as fontes da Apify
   (Mercado Livre quando resolvido, Americanas, etc.) — como mais uma
   fonte entre várias, não como base do site.
3. **Próximo passo de código**: estender esse mesmo fallback pras fontes
   da Apify (Mercado Livre quando estiver funcionando, Americanas, etc.)
   e pra região Portugal quando ela voltar a ficar pública.

## Sessão 15/07/2026 (continuação) — Scrappa oculto de vez + API em primeiro lugar
A Priscila reforçou de forma direta e repetida: parar de misturar Scrappa e
catálogo fixo na frente dos resultados — a prioridade tem que ser 100% das
lojas com API/feed real (Eudora, L'Occitane). Implementado:

1. **Scrappa desativado** (`var SCRAPPA_ENABLED=false;` em `loadComparison`,
   `index.html`): a chamada `scrappaSearchPrices(...)` só executa se essa
   flag for `true`. Fácil de reativar no futuro (é só mudar a flag) se um dia
   o achado F1 da auditoria (pareamento por índice bugado) for corrigido.
   Código não removido, só desligado.
2. **Live results (Eudora/L'Occitane) viram a primeira leva visual**: em
   `finishRenderProds`, os resultados ao vivo da Awin agora entram no topo
   da grade (`insertAdjacentHTML('afterbegin', ...)`, antes era `beforeend`)
   — o catálogo fixo (que renderiza primeiro por ser instantâneo/local) fica
   embaixo assim que a busca da Awin responde. Contador de resultados também
   foi reordenado pra mostrar "N em lojas parceiras + [contagem do
   catálogo]" nessa ordem.
   - **Limitação técnica honesta**: como a busca da Awin é uma chamada de
     rede (mesmo que rápida, ~alguns décimos de segundo com cache),
     tecnicamente o catálogo aparece na tela primeiro por uma fração de
     segundo antes dos resultados da API "pularem" pro topo. Não dá pra
     eliminar esse delay sem atrasar a exibição inicial da página inteira
     esperando a rede responder — decisão foi priorizar carregamento rápido
     da página e deixar a API assumir o topo assim que chega, em vez de
     travar a tela esperando.
3. Também corrigido nesta leva: `doHeroSearch()` (busca pela barra do herói)
   estava chamando `renderProds()` duas vezes (uma direta, outra já embutida
   dentro de `showPage('compare')`) — causava o "+10 em lojas parceiras +10
   em lojas parceiras" duplicado que apareceu no print dela.

Commit: `1d85c95`. Validado sintaxe JS antes do push, sem erros.

**Ainda não mexido nesta sessão** (fica pra próxima, menor prioridade que o
pedido acima): trocar o actor do Mercado Livre na Apify (o antigo exige
100s mínimo de execução, incompatível com Netlify Functions — abandonado)
pelo candidato `gio21/americanas-product-scraper` (API GraphQL direta, sem
navegador); estender o fallback de busca ao vivo pra fontes da Apify e pra
Portugal quando a região voltar a ficar pública.

## Sessão 15/07/2026 (continuação 2) — resultados ao vivo: categoria e diversidade de loja
Depois do ajuste acima, a Priscila testou e reportou dois problemas novos nos
cards ao vivo (print: busca "hidratante" dentro do filtro Skincare mostrando
batom e loção corporal da Eudora, e L'Occitane nunca aparecendo):

1. **`awin-search.js` balanceado por loja (round-robin)**: antes os 10
   resultados eram só os de maior pontuação no combinado das duas lojas —
   como a Eudora tem 1797 produtos contra 274 da L'Occitane, a Eudora sozinha
   preenchia os 10 lugares e a L'Occitane nunca entrava, mesmo tendo produto
   relevante pro termo buscado. Agora intercala entre as lojas com resultado
   (melhor pontuação de cada uma primeiro) até completar 10.
2. **Filtro de categoria nos resultados ao vivo** (`finishRenderProds`,
   `index.html`): "hidratante" é adjetivo de marketing usado em produtos de
   categorias bem diferentes (batom hidratante, loção corporal hidratante) —
   reaproveitado o `conflictsWithCategory()` que já existia pro D3, agora
   também filtrando os resultados ao vivo pela categoria ativa (Skincare/
   Maquilhagem/Cabelo) antes de virar card.
3. **`liveResultCard` ganhou botão Amazon** (busca, sem preço conhecido)
   como segunda opção de compra — antes era destino único (só a loja
   parceira), agora sempre tem pelo menos uma comparação.

Commit: `df5d910`. Validado sintaxe JS + `node --check` na function antes do
push, sem erros.

**Observação pra próxima sessão**: comparação "de verdade" entre Eudora e
L'Occitane pro MESMO produto não é realista pra a maioria dos resultados ao
vivo — são marcas próprias de cada loja (linhas Eudora/SOUL/Instance vs.
L'Occitane en Provence), então dificilmente o mesmo item exato aparece nas
duas. O que foi implementado é a próxima melhor coisa: pelo menos duas
opções de compra por card (loja parceira real + Amazon busca) e nunca
loja/categoria erradas misturadas.

## Sessão 15/07/2026 (continuação 3) — terceira loja: Ama Beleza BR
Priscila avisou que a Ama Beleza BR aceitou a parceria na Awin e também tem
feed de produtos. `awin-search.js` ganhou suporte a esse terceiro feed, no
mesmo padrão dos anteriores (`AWIN_AMABELEZA_FEED_URL` somada ao array
`FEED_URLS`) — não precisou mexer em mais nada, o resto do pipeline (busca,
round-robin por loja, D3 marca+tipo, fallback ao vivo) já combina qualquer
feed novo automaticamente. Commit `b109371`.

**Falta a Priscila**: gerar o feed da Ama Beleza igual fez com a L'Occitane
("Crie um Feed" no painel da Awin, mesmas colunas) e colar a URL gerada
direto na variável `AWIN_AMABELEZA_FEED_URL` no Netlify (nunca no chat/git —
tem chave de API embutida). Depois de salvar, o Netlify reimplanta sozinho
e o feed passa a valer.

**Atualização**: Priscila configurou a variável e o feed passou a valer
depois de um "Trigger deploy" manual no Netlify (mudar env var sozinho não
redeploya as functions). Ama Beleza passou a aparecer nos resultados.

## Sessão 15/07/2026 (continuação 4) — imagem placeholder da Ama Beleza + esclarecimento sobre comparação
Depois da Ama Beleza aparecer, dois pontos novos da Priscila:

1. **Pergunta conceitual (respondida, sem mudança de código)**: ela perguntou
   se o site deveria comparar produtos "do mesmo estilo" entre lojas (ex:
   qualquer hidratante corporal de qualquer marca) mesmo sem ser o mesmo
   item exato. Resposta alinhada com a decisão D3 já tomada: **não** — isso
   seria comparação enganosa (maçã com laranja). Comparação de preço só faz
   sentido pro MESMO produto (mesma marca+fórmula+tamanho). Ela concordou.
   Comparação real entre lojas parceiras só acontece quando uma marca
   terceira (ex: CeraVe) é vendida por mais de uma delas — isso já funciona
   automático via D3, sem precisar mexer em nada.
2. **Bug real: imagem "sem foto disponível" da Ama Beleza aparecendo feia
   no card** (print: caixa cinza com câmera e texto "No image available").
   Não é link quebrado — é a própria Ama Beleza (via Vtex) servindo um
   gráfico genérico quando não tem foto real do produto. A URL da imagem
   não denuncia isso (IDs diferentes por produto, sem palavra tipo
   "placeholder" no nome), então não dava pra filtrar só pelo endereço.
   **Corrigido em `awin-search.js`**: checagem de tamanho do arquivo
   (`content-length`) nos resultados finais de cada busca (só ~10 imagens,
   não o feed inteiro de 4552) — abaixo de 8KB é tratado como "sem foto
   real" e cai no ícone padrão do site ("Foto ilustrativa") em vez do
   gráfico da loja. É uma heurística (tamanho, não o conteúdo visual da
   imagem, que não dá pra inspecionar neste ambiente sem acesso à internet
   externa) — pode precisar de ajuste fino se aparecer foto real pequena
   sendo escondida por engano, ou algum placeholder maior que 8KB passando.
   Commit `58b39b1`. **Ainda não confirmado pela Priscila se resolveu.**

## Sessão 15/07/2026 (continuação 5) — comparação real entre lojas parceiras (Ama Beleza é multimarca)
Priscila corrigiu uma premissa importante: diferente da Eudora e da
L'Occitane (marca própria, só vendem produto delas mesmas), **a Ama
Beleza é multimarca** — revende Eudora, L'Occitane e outras marcas, igual
a Amazon/Beleza na Web. Ela mandou print do site da Ama Beleza mostrando
produtos Eudora à venda lá. Ou seja: o MESMO produto pode legitimamente
aparecer em mais de uma loja parceira ao mesmo tempo (ex: Eudora vende
direto por X, Ama Beleza revende o mesmo item por Y) — isso não é o caso
"maçã com laranja" da sessão anterior, é comparação de preço de verdade.

**Implementado**: os resultados ao vivo (Awin) agora são agrupados por
identidade de produto antes de virar card — `normalizeProductTitle()`
(minúsculas, sem acento, sem tamanho/unidade tipo "50ml"/"200g", palavras
em ordem alfabética) + `groupLiveResults()`. Quando duas lojas batem o
mesmo título normalizado, viram UM card só com várias linhas de preço
(menor primeiro, "Melhor preço ✓"), igual ao card do catálogo — antes
cada ocorrência era um card separado e repetido. Quando o título não bate
(produtos realmente diferentes ou paráfrase que a normalização não pegou),
cada um continua card próprio — o pior caso é só perder uma junção
possível, nunca junta errado. `liveResultCard` foi reescrito pra aceitar
o grupo (`items[]`) em vez de um resultado solto. Commit `8d1e5b9`.

**Pergunta da Priscila sobre a Amazon (respondida)**: quando a API de
produtos da Amazon voltar (10 vendas/30 dias correntes), ela entra nesse
MESMO mecanismo de agrupamento — a Amazon também é multimarca (vende
L'Occitane, Eudora etc. de terceiros), então viraria só mais uma fonte
alimentando o `groupLiveResults`, com preço/link reais dela nas linhas de
comparação. Não precisa mudar a arquitetura quando isso acontecer, só
plugar a Amazon como mais uma fonte no mesmo pipeline (hoje só Awin
alimenta esse fallback ao vivo).

## Sessão 15/07/2026 (continuação 6) — links mortos no feed da Awin
Priscila testou o agrupamento e mandou prints de 3 problemas:
1. Clique num resultado da Eudora caindo na página "Ops! Esta página não
   existe mais." (produto removido da loja, mas ainda no feed desatualizado
   da Awin) — o pior caso, parece link quebrado de verdade.
2. Clique em outro resultado da Eudora caindo numa página de listagem com
   vários produtos (não o produto específico).
3. Amobeleza: um clique caiu em "não encontrou nada"; outro funcionou (foi
   pro produto certo), mas o preço mostrado no card não batia com o preço
   COM DESCONTO que aparecia na página real da loja (defasagem normal de
   feed — a Awin não atualiza em tempo real, e promoções da loja no site
   dela nem sempre refletem no feed. Não é bug do nosso código, é limitação
   inerente de qualquer comparador baseado em feed; por isso o aviso "Preços
   actualizados hoje" já existe no site, mas vale lembrar à Priscila que o
   preço final sempre é o da loja no checkout).

**Corrigido (itens 1 e 3-parcial)**: `netlify/functions/awin-search.js`
ganhou `isDeadProductLink()` — pros poucos resultados finais de cada busca
(≤10), faz um GET no link com timeout de 4.5s e checa: (a) status HTTP não-
2xx, ou (b) texto da página contém frases tipo "não existe mais", "produto
não encontrado", "página indisponível" (cobre "soft 404", loja que devolve
200 mesmo pra produto sumido). Se detectar link morto, marca `linkOk:false`
na resposta; erro de rede/timeout NÃO marca como morto (não penaliza por
falha temporária). No cliente (`index.html`), tanto o card de resultado ao
vivo (`liveResultCard`) quanto a linha de preço do catálogo
(`loadComparison`) agora usam esse sinal: link morto → cai pro botão
honesto "Buscar na loja" (`storeGoLink`, busca Google restrita ao domínio
da loja) em vez de fingir que é o link direto. Commit `503746e`.

**Item 2 (link caindo em listagem, não no produto específico) não tem
correção de código possível** — é o próprio deep link da Awin apontando
pra uma URL de categoria em vez de produto, uma característica de como
aquele item específico foi cadastrado no feed da Eudora, fora do nosso
controle. Se acontecer muito, o caminho seria reportar pra Awin/Eudora.

**Ainda não confirmado pela Priscila se a checagem de link morto
resolveu.**

## Sessão 15/07/2026 (continuação 7) — "fora de estoque" também é link morto
Priscila mandou mais 2 exemplos: (1) card mostrando R$ 299,00 de um batom
Amobeleza que, ao clicar, ia pra uma página "Este produto não está
disponível no momento" (produto esgotado, sem preço nenhum na página) — a
frase de esgotado não batia com nenhum padrão da lista de `DEAD_PAGE_PATTERNS`
(só cobria "não encontrado"/"removido", não "sem estoque"); (2) card da
Eudora mostrando R$ 23,99 enquanto a página real do produto mostrava R$
19,90 — explicado como defasagem normal de feed (não é bug, é limitação
inerente de comparador baseado em feed que não é atualizado em tempo real;
recomendação foi manter o disclaimer "Preços actualizados hoje" e não
tentar resolver com scraping de preço ao vivo por enquanto, que exigiria
lógica própria por loja e seria frágil).

**Corrigido (item 1)**: `DEAD_PAGE_PATTERNS` ampliada com variações de
"fora de estoque" ("não está disponível", "esgotado", "fora de estoque",
"quero saber quando estiver disponível" etc.) — antes só cobria página
removida/não encontrada. Mesmo mecanismo de antes: cai no botão honesto
"Buscar na loja". Commit `26a44fa`.

**Sobre o R$ 299,00 "vindo de onde"**: não é um bug de cálculo — é o preço
que estava gravado no feed da Awin da última vez que ele foi atualizado
(quando o produto ainda tinha estoque). Como a Awin não atualiza o feed em
tempo real, um produto pode esgotar na loja antes do feed refletir isso.
Com a correção acima, esse cenário agora cai no botão "Buscar na loja" em
vez de continuar prometendo um preço que não existe mais pra comprar.

## Sessão 15/07/2026 (continuação 8) — checagem de link morto desativada (falso positivo generalizado)
Pouco depois da correção acima, a Priscila reportou algo muito mais grave:
**todos** os links da Eudora e da Ama Beleza (incluindo produtos que
existem e funcionam de verdade) passaram a cair numa busca do Google em
vez do link direto — o exato problema que a checagem de link morto foi
criada pra evitar, só que ao contrário. Ela também alertou que isso estava
consumindo crédito do Netlify à toa em testes que davam errado.

**Causa provável (não confirmada — não dá pra testar deste ambiente, sem
acesso à internet externa)**: a checagem fazia um GET no link de cada
resultado a partir da function do Netlify (servidor), sem cabeçalho de
navegador real nem cookies — é bem provável que a Eudora e/ou a Ama Beleza
tenham proteção contra bot (Cloudflare/Akamai/etc.) que serve uma página
diferente (ou bloqueia) pra esse tipo de requisição, o que faria a
checagem enxergar "página não existe"/"indisponível" em praticamente
qualquer link, mesmo os que funcionam perfeitamente num navegador normal.

**Ação tomada**: checagem de link morto **desativada** (`LINK_CHECK_ENABLED
= false` em `awin-search.js`) — voltou a usar o link do feed diretamente,
sem verificação, do jeito que era antes dela existir. A checagem de imagem
placeholder (Ama Beleza) continua ativa, não teve esse problema. Commit
`f56b62c`. Consequência aceita: os casos legítimos de link morto/esgotado
descritos nas sessões anteriores (Eudora "página não existe mais",
Amobeleza "produto esgotado") voltam a acontecer sem aviso — foi uma troca
consciente, porque um falso positivo generalizado (praticamente todo link
caindo no Google) é pior que um falso negativo ocasional (raro link morto
sem aviso).

**Pendência real pra próxima sessão**: se alguém quiser reativar essa
checagem, precisa primeiro conseguir inspecionar de verdade a resposta que
a Eudora/Ama Beleza devolvem pra uma requisição de servidor (ex: a
Priscila rodando `curl` num link real e mandando o HTML/status de volta,
ou testando com um header `User-Agent` de navegador comum) — sem essa
visibilidade não dá pra saber se o problema é bot-detection, redirect,
ou outra coisa, e continuar tentando "no escuro" só gasta mais crédito
do Netlify de novo.

## Sessão 15/07/2026 (continuação 9) — checagem de imagem também desativada + expectativa realista
Mesmo com o link morto desativado, a Priscila reportou: (1) Eudora ainda
caindo em "produto não encontrado" às vezes (**esperado** — é a
consequência aceita de ter desligado a checagem, não um bug novo); (2)
Ama Beleza caindo numa página de listagem (**sem correção possível**, já
documentado antes — link mal cadastrado no feed deles); (3) **nenhuma foto
de produto real aparecendo mais, pra loja nenhuma** (bug novo, grave); (4)
achou R$ 299,00 de um batom "estratosférico" (dúvida, não bug).

**(3) corrigido**: a checagem de imagem placeholder (Ama Beleza) sofria do
mesmo bloqueio de servidor suspeitado na checagem de link — desativada
também (`IMAGE_CHECK_ENABLED=false`, `awin-search.js`). Fotos voltam a usar
o campo do feed direto, sem verificação extra. Commit `4777e72`.

**(4) esclarecido, não é bug**: os R$ 299,00 e R$ 249,00 eram de produtos
**Lancôme** ("Batom Cremoso Cintilante Lancôme L'Absolu Rouge...") — marca
de luxo revendida pela Ama Beleza, não Eudora nem drugstore. Preço de
batom Lancôme no Brasil realmente fica nessa faixa — não é erro de
cálculo nem de leitura do feed.

**Estado combinado depois desta sessão**: as duas checagens extras de
validação server-side (link morto, imagem placeholder da Ama Beleza) estão
DESATIVADAS — o site confia direto no que o feed da Awin manda (preço,
link, foto), sem tentar verificar ao vivo. Isso é uma escolha consciente:
tentar verificar a partir do servidor Netlify parece esbarrar em proteção
anti-bot das lojas, e sem conseguir inspecionar a resposta real (ambiente
sem acesso à internet externa), continuar tentando corrigir "no escuro"
só cria mais regressões e gasta mais crédito. O que FICA implementado e
funcionando (confirmado): round-robin por loja, filtro de categoria,
agrupamento de mesmo produto em várias lojas (`groupLiveResults`), Scrappa
desligado, API em primeiro lugar. Pendência real de link/foto/preço
desatualizados no feed é uma limitação conhecida e aceita de qualquer
comparador baseado em feed de terceiros — mitigada pelo aviso "Preços
actualizados hoje", não por mais checagem ao vivo por enquanto.

## Sessão 15/07/2026 (continuação 10) — Ama Beleza: link direto confirmado quebrado (regra fixa, sem verificação ao vivo)
Priscila insistiu que TODO clique na Ama Beleza dava errado e provou com 3
exemplos reais e bem diferentes entre si (shampoo L'Oréal Professionnel,
hidratante Davines, lip balm Embryolisse — nenhum é "kit"/edição limitada,
então a teoria de "produto de giro rápido esgota mais" não explicava).
Um deles nem chegou a "esgotado": foi direto pra "Não encontramos nenhum
resultado" — ou seja, o `idsku` do feed da Ama Beleza não corresponde mais
a nenhum produto real no site ao vivo deles. Sistemático, não coincidência.

**Corrigido, sem depender de nenhuma requisição extra** (a checagem via
servidor já tinha se mostrado furada por bloqueio anti-bot — não dá pra
repetir esse erro): `awin-search.js` ganhou uma regra fixa —
`UNRELIABLE_LINK_STORES=['amobeleza','ama beleza']` — qualquer resultado
cuja loja contenha esse nome já sai marcado `linkOk:false` direto, sem
verificar nada ao vivo. O cliente (que já sabia lidar com `linkOk:false`
desde a tentativa anterior) cai automaticamente no botão honesto "Buscar
na loja" pra Ama Beleza, mantendo preço/nome/foto (que continuam
confiáveis, só o link de compra direto que não é). Commit `9c54fe8`.

**Pendência real**: o link da Ama Beleza só volta a ser confiável se/quando
ela corrigir o feed do lado dela (provavelmente reexportar com os idsku
certos). Até lá, mesmo que ela continue aprovada e enviando dados
(preço/nome/foto úteis pra comparação), a compra em si sempre passa pela
busca no site dela, não pelo link direto. Se ela corrigir, é só remover
a entrada da lista `UNRELIABLE_LINK_STORES`.

## Sessão 15/07/2026 (continuação 11) — Eudora também entra na lista + busca nativa da loja no fallback
Priscila testou mais produtos Eudora (não-kit também) a pedido meu e
confirmou: **a maioria** cai em "Ops! Esta página não existe mais." — não
é só kit/edição limitada esgotando, é o mesmo padrão sistemático da Ama
Beleza. Ela também alertou que o fallback (Google) não estava parecendo
uma solução de verdade pra quem clica.

**Duas mudanças**: (1) `'eudora'` entrou em `UNRELIABLE_LINK_STORES`
(`awin-search.js`) — mesmo tratamento da Ama Beleza, preço/foto continuam
mas o link de compra vira busca. (2) `storeGoLink()` (`index.html`) ganhou
`VTEX_SEARCH_DOMAINS` — pra Eudora e Ama Beleza, em vez de rotear por uma
busca do Google (que depende do Google ter indexado a página certa), usa a
busca própria do site delas (formato Vtex: `dominio/termo?_q=termo&map=ft`,
confirmado funcionando num teste manual da Priscila). Isso leva a pessoa
direto pro site da loja com resultado de verdade, mais confiável que
Google. Commit `11ebedc`.

**Consequência aceita**: Eudora e Ama Beleza não têm mais link direto de
produto — sempre caem na busca nativa do site delas. Só a L'Occitane
mantém link direto (não apresentou esse problema nos testes). Se o feed
de alguma das duas for corrigido no futuro e o link direto voltar a
funcionar de verdade, é só tirar da lista `UNRELIABLE_LINK_STORES`.

**Priscila recusou a busca como solução definitiva** ("a pessoa tem que
clicar e ir para o produto certo, senão vale mais ir ao Google ou ao site
da loja") — com razão, busca não é o mesmo valor que link direto. Como não
dá pra testar/depurar esse formato de link deste ambiente (sem acesso à
internet), o caminho combinado foi ela abrir um chamado com o **suporte da
Awin** perguntando por que os deep links da Eudora e da Ama Beleza caem em
"produto não encontrado" — quem sabe o formato certo de deep link é a
própria Awin, evita mais tentativa e erro cego no código.

**Quiz sem comparação, corrigido nesta sessão**: Priscila reparou que os
resultados do quiz mostravam quase só Amazon (sem linha de preço
parceira), mesmo com respostas do quiz "alargadas" pra aumentar
compatibilidade. Causa: o quiz sempre usou só o catálogo fixo
(`renderAmazonResults`/`getActiveProducts`), nunca foi conectado à busca
ao vivo (`awinSearchPrices`) que a página de produtos já usa — e como o
catálogo é majoritariamente marca de farmácia/drugstore (Nivea, CeraVe...)
que a Eudora/L'Occitane/Ama Beleza não vendem, a regra D3 (marca+tipo)
rejeitava quase tudo, sobrando só o botão Amazon.

**Corrigido**: `renderAmazonResults` agora chama `renderLiveQuizResults()`
no final — monta até 3 termos de busca a partir dos tipos de produto
escolhidos no quiz (`qD.skin_prod`/`hair_prod`/`maq_prod`, via
`subKeywords()`), busca ao vivo nas lojas parceiras, filtra por categoria,
deduplica resultado repetido entre os termos, agrupa por identidade
(`groupLiveResults`, mesmo mecanismo da busca de produtos) e insere como
complemento no topo da grade de resultados. Commit `6a774e7`. **Ainda não
confirmado pela Priscila se resolveu.**

## Sessão 15/07/2026 (continuação 12) — chamado aberto na Awin + reenvio pra Beleza na Web
Priscila abriu o chamado de suporte com a Awin (usando o texto único que
preparei, unificando o problema + os 6 exemplos de link quebrado + IDs dos
anunciantes + confirmação de que os produtos existem no site + datas de
teste + comparação com a L'Occitane que funciona) — **aguardando resposta**.

Também foi preparado um e-mail pra reenviar à Beleza na Web pedindo o feed
de produtos (parceria já aprovada na Awin, mas sem feed ainda) — reenvio
necessário porque a pessoa responsável pelo primeiro contato está de
férias. E-mail inclui o **ID de publisher da Awin da Priscila: Veraoris
(2940275)** — esse mesmo número já aparece embutido em todo link de
afiliado que ela gera (`aw_affid=2940275` nos exemplos testados com a
Eudora), confirma que é o ID certo da conta.

**Nada de código mudou nesta continuação** — só textos de e-mail/suporte.

## Sessão 15/07/2026 (continuação 13) — quarta loja: Natura via Awin
Priscila avisou que a Natura aceitou a parceria — **pela Awin**, não pelo
programa próprio (`afiliadosnatura.com.br`) que a `MAPA_LOJAS_AFILIADOS_2026-07.md`
e a decisão D4 tinham marcado como "fora do plano" por exigir CNPJ + nota
fiscal brasileira. Isso não é uma contradição: a exclusão da D4 vale só
para o programa direto (que exige presença fiscal no Brasil); via Awin
(conta de Portugal da Priscila, sem CNPJ) o mesmo problema não existe —
mesma lógica que já vale pra Eudora/L'Occitane/Ama Beleza. `awin-search.js`
ganhou suporte ao quarto feed, mesmo padrão (`AWIN_NATURA_FEED_URL`
somada ao array `FEED_URLS`). Commit `98a3cc4`.

**Falta a Priscila**: gerar o feed da Natura no painel da Awin ("Crie um
Feed", mesmas colunas das outras) e colar a URL na variável
`AWIN_NATURA_FEED_URL` no Netlify — depois **não esquecer o "Trigger
deploy" manual** (mudar env var sozinho não redeploya as functions, foi
o que faltou da primeira vez com a Ama Beleza).

**Atualização**: Priscila fez os dois passos certinhos (variável +
trigger deploy), mas a Natura não aparecia em nenhuma busca. Log mostrou
`AWIN feed falhou: incorrect header check` — erro de zlib, sinal de que o
buffer não era gzip válido. Causa: o feed da Natura veio em **CSV puro,
sem compressão**, diferente dos outros três (gzip) — `fetchOneFeed` só
sabia descomprimir gzip, então descartava o feed inteiro em silêncio
(capturado pelo catch de `fetchFeed`, virava lista vazia sem erro visível
pra ninguém perceber, só pelo log). **Corrigido**: tenta gzip primeiro,
se falhar trata como CSV direto — testado localmente com os dois formatos
antes de subir. Commit `5880f3f`. **Confirmado pela Priscila: Natura e
L'Occitane funcionando perfeitamente** (feed carregando, resultados
aparecendo, link direto funcionando).

## Status das lojas parceiras (16/07/2026)
- **L'Occitane en Provence BR** — ✅ funcionando perfeitamente (feed +
  link direto).
- **Natura BR** — ✅ funcionando perfeitamente (feed + link direto),
  desde a correção do formato CSV acima.
- **Eudora BR** — ⚠️ feed funcionando (preço/nome/foto certos), mas link
  direto de produto confirmado não confiável (`UNRELIABLE_LINK_STORES`) —
  cai na busca nativa do site dela. **Aguardando resposta da Awin** sobre
  o chamado aberto (feed desatualizado do lado da loja).
- **Ama Beleza BR** — ⚠️ mesma situação da Eudora (feed ok, link direto
  não confiável). Também aguardando resposta da Awin.
- **Beleza na Web** — aprovada na Awin, mas **sem feed de produtos
  ainda** — aguardando resposta da loja (segundo e-mail enviado, o
  primeiro contato estava de férias).
- **Amazon** — em segundo plano, aguardando liberação da API (regra de
  10 vendas/30 dias correntes).

## Sessão 16/07/2026 — resposta da Awin + contato direto com Eudora e Amobeleza
A Awin (Partner Success) respondeu ao chamado: confirmaram que a
implementação da Priscila está correta (`aw_deep_link` usado exatamente
como fornecido) e que o problema é mesmo do lado de cada anunciante (feed
desatualizado — URL/SKU que não bate mais com o catálogo ao vivo). Não é
algo que a Awin corrige centralizadamente; cada anunciante mantém o
próprio feed. Awin passou dois contatos diretos:
- Eudora BR → luana.spinelli@awin.com (gestora de conta na Awin)
- Amobeleza → maria.andrade@amobeleza.com.br (contato direto da loja)

Priscila já enviou e-mail pra cada uma, com os exemplos de link quebrado
específicos de cada loja (2 exemplos Eudora, 4 exemplos Amobeleza) e o
mesmo contexto do chamado original. **Aguardando resposta das duas.**

Nada de código mudou nesta sessão — só os e-mails. Quando alguma delas
corrigir o feed (ou confirmar que os links passam a funcionar), o próximo
passo é remover a loja correspondente de `UNRELIABLE_LINK_STORES`
(`netlify/functions/awin-search.js`) pra ela voltar a ter link direto de
produto no site, em vez de cair na busca nativa.

## Sessão 22/07/2026 — quinta loja: Forever Liss BR via Awin
Priscila avisou que a Forever Liss BR aceitou a parceria na Awin. Mesmo
padrão das quatro lojas anteriores: `awin-search.js` ganhou a quinta
entrada no array `FEED_URLS` (`AWIN_FOREVERLISS_FEED_URL`) — resto do
pipeline (busca, round-robin por loja, D3 marca+tipo, fallback ao vivo,
agrupamento por identidade) combina o feed novo automaticamente, sem
precisar mexer em mais nada. Sintaxe validada com `node --check` antes do
push. Commit `a9f3a94`.

Priscila configurou a variável `AWIN_FOREVERLISS_FEED_URL` no Netlify e
rodou o "Trigger deploy" manual. **Confirmado funcionando**: testado ao
vivo direto na function em produção (`awin-search?query=forever liss`)
— retornou produtos reais da Forever Liss BR (condicionador, kit banho de
verniz, kit cresce cabelo, máscaras) com preço, foto e link. Diferente da
Eudora/Ama Beleza, o link da Forever Liss **não** veio marcado
`linkOk:false` — ou seja, ainda não está na lista `UNRELIABLE_LINK_STORES`,
sinal de que o link direto dela está confiável (a lista só marca lojas
testadas e confirmadas como quebradas na prática, e a Forever Liss ainda
não apresentou esse problema).

## Sessão 22/07/2026 (continuação) — feeds novos de Eudora e Ama Beleza: só a Ama Beleza melhorou
Priscila gerou feed novo na Awin pra Eudora e Ama Beleza (mesmo dia da
Forever Liss), pra testar se o link direto de produto — quebrado desde
15/07 (ver `UNRELIABLE_LINK_STORES`) — tinha sido corrigido do lado de
cada loja.

**Teste feito nesta sessão** (via `WebFetch`, que neste ambiente conseguiu
acessar a internet — diferente de sessões anteriores que registravam "sem
acesso à internet externa"):
- **Ama Beleza**: 2 links de produtos reais e diferentes (fluido Davines,
  shampoo L'Oréal Curl Expression) seguidos até o destino final — os dois
  foram pro produto certo (um em estoque, outro esgotado mas com a página
  certa do produto, não mais "não encontramos nada"). **Removida de
  `UNRELIABLE_LINK_STORES`** — link direto reativado. Commit `3277094`.
- **Eudora**: todas as tentativas de acesso (inclusive a homepage) deram
  HTTP 403 — bloqueio anti-bot do lado dela, impede testar por aqui.
  Priscila testou manualmente no navegador (3-4 produtos reais) e
  confirmou: **todos caem em "Ops, produto não encontrado"**. Ou seja, o
  feed novo não corrigiu nada — o problema não é feed desatualizado, é
  algo mais estrutural do lado da loja. **Continua em
  `UNRELIABLE_LINK_STORES`**, sem mudança de código. Próximo passo
  sugerido: avisar de novo o contato direto da Awin pra Eudora
  (luana.spinelli@awin.com) que o feed novo não resolveu.

## Status das lojas parceiras (22/07/2026)
- **L'Occitane en Provence BR** — ✅ funcionando (feed + link direto).
- **Natura BR** — ✅ funcionando (feed + link direto).
- **Forever Liss BR** — ✅ funcionando (feed + link direto, confirmado
  nesta sessão).
- **Ama Beleza BR** — ✅ funcionando (feed + link direto reativado nesta
  sessão, feed novo confirmado corrigido).
- **Eudora BR** — ⚠️ feed ok (preço/nome/foto), mas link direto continua
  **não confiável mesmo com feed novo** (`UNRELIABLE_LINK_STORES`) — cai
  na busca nativa do site dela. Confirmado por teste manual da Priscila
  em 22/07. Precisa de resposta/correção de verdade da loja, não é mais
  "só gerar feed novo".
- **Beleza na Web** — aprovada na Awin, sem feed de produtos ainda.
- **Amazon** — em segundo plano, aguardando liberação da API.

## Sessão 22/07/2026 (continuação) — sessão "perdida" recuperada + Americanas via Apify implementada
Priscila reportou que uma conversa longa de mais cedo (22/07, ~17:56-17:57)
tinha sumido depois que o terminal ficou muito tempo aberto — receio de
estar perdendo trabalho por trocar de nuvem pra Claude Code local. Achado
importante: **nada foi perdido**, o histórico bruto de toda sessão do
Claude Code fica salvo em disco automaticamente (pasta
`~/.claude/projects/...`), só não vira resumo no `CLAUDE.md` sozinho (isso
sempre exigiu escrita explícita — ver preferência salva em memória:
atualizar este arquivo proativamente a partir de agora, sem esperar ela
pedir, sempre que algo mudar de verdade na sessão).

**Recuperando essa sessão perdida**, achei uma decisão real que tinha sido
tomada e nunca executada: Priscila tinha escolhido explicitamente "Ocultar
Eudora + começar Americanas via Apify" numa pergunta de múltipla escolha,
mas a sessão foi pro segundo plano ("backgrounding") logo depois e nunca
voltou — a decisão nunca virou código. Também achei, nessa recuperação,
que o **Mercado Livre (ator antigo, abandonado em 15/07 por exigir 100s+
de execução) nunca tinha sido desligado de fato no código** — toda busca
de produto em produção continuava disparando uma execução real na Apify
que sempre estourava o timeout (25s) sem trazer resultado, gastando
crédito à toa desde então.

**Correção da Priscila sobre a premissa antiga**: a explicação anterior
(sessão perdida) de que só a Ama Beleza mostra botão "Ir →" porque é a
única revendedora multimarca das 5 lojas parceiras estava incompleta —
Priscila apontou que a **Eudora também vende marcas de terceiros**, não só
linhas próprias (SOUL, Instance). Verificado: o código (`loadComparison`,
`index.html`) não trata nenhuma loja como especial — a regra D3
(marca+tipo) é genérica pra qualquer fonte. Se a Eudora realmente carrega
uma marca do catálogo pra um produto específico, o "Ir →" já deveria
aparecer sozinho, sem mudança de código. **Ainda em aberto**: nenhum
exemplo concreto (produto+marca) foi dado ainda pra confirmar se isso
funciona na prática ou se há um bug real escondido — investigar se ela
trouxer um caso específico.

**Pesquisa feita** (Apify + WebSearch/WebFetch) sobre alternativas ao
Mercado Livre abandonado, já que ele não é o único ator disponível:
- **Americanas Product Scraper** (`gio21/americanas-product-scraper`) —
  confirmado: usa a API VTEX Catalog **direta, sem navegador**, ~5-10s
  pra 50 produtos. Mesma tecnologia (VTEX) que a Ama Beleza usa — não é
  coincidência, é comum em loja brasileira. Candidato ideal, compatível
  com o timeout de uma function do Netlify. **Escolhido e implementado.**
- Magazine Luiza (`gio21/magazine-luiza-scraper`) — lê página de busca
  direto (sem navegador completo), mas tempo de execução não documentado
  ("segundos a horas") — arriscado demais pro timeout do Netlify, não
  implementado.
- Casas Bahia (`pmodinger/casas-bahia-brasil`) — não confirma API direta,
  timeout padrão de 45s por página — mais arriscado, não implementado.
- Mercado Livre tem um ator mais novo (`leadercorp/mercadolivre-scraper-br-pro`)
  que usa HTTP direto na maioria das vezes (só cai pra navegador se
  bloqueado) — bem melhor que o antigo, mas Priscila pediu pra não
  investir mais tempo em Mercado Livre agora. Fica anotado como opção
  futura, não perseguido nesta sessão.

**Implementado**:
1. `netlify/functions/americanas-search.js` (novo, mesmo padrão de cache
   de 30min do `mercadolivre-search.js`) — chama o ator
   `gio21~americanas-product-scraper` com `{searchTerm, maxItems:20,
   onlyAvailable:true}`, normaliza `name/price/url/imageUrl/brand` do
   retorno.
2. Mercado Livre **desligado** (`ML_ENABLED=false`, `index.html`) — só
   uma flag, reversível, mesmo padrão do `SCRAPPA_ENABLED`. Código do
   ator antigo mantido, só parou de ser chamado.
3. `americanasSearchPrices()` adicionada (`index.html`) — mesmo padrão de
   fila de concorrência do Mercado Livre (`AM_MAX_CONCURRENT=3`), memória
   menor pedida na function (512MB vs 1024MB do ator antigo, porque não
   usa navegador). Entra em `loadComparison` como complemento não-
   bloqueante (mesmo tratamento que o Mercado Livre tinha: se chegar depois
   do card já ter renderizado, só complementa e re-renderiza).
4. **Regra D3 estendida pra cobrir a Americanas** — o filtro de marca+tipo
   em `renderCombined()` só validava resultados `_source==='awin'`;
   resultados de outras fontes passavam sem checagem nenhuma. Corrigido
   pra também exigir a validação pra `_source==='americanas'` (a
   Americanas é multimarca de verdade, precisa da mesma regra rígida —
   nunca "qualquer marca"). Scrappa continua fora dessa checagem (já
   desligado, não é prioridade).
5. Troca de foto do card (`withPhoto`) também estendida: antes só aceitava
   foto vinda de `_source==='awin'`; agora aceita também `'americanas'`
   (dado estruturado real da VTEX, não thumbnail do Google — mesmo
   raciocínio que já valia pra Awin).

Sintaxe validada com `node --check` (function nova + `<script>` inteiro do
`index.html` extraído e checado) — sem erros. Commitado (`eaa1898`) e
enviado — **confirmado funcionando em produção pela Priscila.**

## Sessão 22/07/2026 (continuação 2) — Eudora ocultada de vez + sexta fonte: Época Cosméticos
Depois de testar a Americanas em produção, Priscila reportou dois problemas
e pediu mais lojas:
1. Um item da Eudora apareceu nos resultados, mesmo ela tendo decidido
   antes (na sessão "perdida" recuperada) ocultá-la até a loja corrigir o
   link de vez — essa parte da decisão não tinha sido implementada ainda
   (só a parte da Americanas tinha sido feita). **Corrigido**:
   `netlify/functions/awin-search.js` ganhou `EUDORA_ENABLED=false` — a
   Eudora sai inteiramente do array `FEED_URLS` (nem é buscada), não só
   com o link marcado como não confiável. Reversível trocando a flag de
   volta pra `true` se a loja corrigir o problema estrutural do link.
2. Card mostrando só 2 opções (Americanas + Amazon) em vez de 3 —
   **não é bug**: acontece quando só uma fonte multimarca bate marca+tipo
   (regra D3) pro produto específico. Resolvido indiretamente adicionando
   mais uma fonte (abaixo), não por afrouxar a regra D3.
3. Pedido pra pesquisar mais lojas no Apify. Pesquisa (WebSearch +
   WebFetch): **Época Cosméticos** — grande loja de beleza multimarca do
   Brasil, vende justamente as marcas de farmácia do catálogo (confirmado:
   CeraVe disponível, R$63,99), roda em **VTEX** como a Americanas. Melhor
   ainda: a **API pública de catálogo responde direto, sem precisar de
   Apify nem pagar por busca** (`/api/catalog_system/pub/products/search`).
   Achado colateral: a página do produto em si (não a API) mostrou CAPTCHA
   num teste automatizado — mesma incerteza já vista com a Eudora (pode
   ser só bloqueio pra tráfego automatizado, sem afetar clique real de
   navegador — não dá pra confirmar sem teste manual dela). Sephora Brasil
   também é VTEX mas a API pública devolveu 403 — descartada. Magazine
   Luiza/Casas Bahia (Apify) continuam arriscadas pro timeout do Netlify —
   não implementadas, Época é opção melhor e gratuita.

**Implementado**:
1. `netlify/functions/epoca-search.js` (novo) — chamada HTTP direta na API
   VTEX da Época (sem Apify, sem token, sem custo), com timeout de 8s via
   `AbortController` e User-Agent de navegador. Preço vem em centavos
   (`commertialOffer.Price/100`), escolhe o menor preço entre vendedores
   com `IsAvailable:true`. Cada resultado sai com `linkOk:false` de
   propósito — até a Priscila confirmar clicando de verdade, cai no botão
   "Buscar na loja" em vez do link direto (mesmo tratamento inicial que
   Eudora/Ama Beleza tiveram).
2. `epocaSearchPrices()` adicionada (`index.html`), `'época cosméticos'`
   entrou em `VTEX_SEARCH_DOMAINS` (fallback de busca própria da loja, não
   Google). D3 (filtro de marca+tipo) e troca de foto em `loadComparison`
   estendidos pra cobrir `_source==='epoca'`, mesmo tratamento da Awin/
   Americanas.
3. **Descoberta importante ao ligar a Época**: a Americanas só tinha sido
   plugada no card de comparação do catálogo (`loadComparison`) — três
   outros lugares que usam busca ao vivo (`preloadEudoraImage` pra foto de
   promoção, `finishRenderProds` pra busca de produtos, e
   `renderLiveQuizResults` pro quiz) só chamavam a Awin, nunca tinham sido
   estendidos pra Americanas. Corrigido de forma genérica: nova função
   `liveMultiSourceSearch()` combina Awin + Americanas + Época numa
   chamada só (espera as 3 responderem, cada resultado sai marcado com
   `_source`), e os 3 lugares antigos foram trocados de `awinSearchPrices`
   pra essa combinada — agora toda busca ao vivo do site (comparação de
   catálogo, busca de produto, quiz, foto de promoção) usa as 3 fontes,
   não só a Awin.

Sintaxe validada com `node --check` (as duas functions + `<script>`
inteiro do `index.html`) — sem erros. Commitado (`ee8ef6a`) e enviado.

## Sessão 23/07/2026 — bug de preço da Época corrigido (100x menor)
Priscila testou em produção e reportou dois pontos: (1) card só mostrando
Época ou Amazon, nunca as outras 4 lojas parceiras nem a Americanas; (2) a
Época "não está funcionando". Investigado direto em produção (via
`WebFetch` nas próprias functions do Netlify):
- `awin-search.js` e `americanas-search.js` **confirmados funcionando**
  normalmente (Natura, L'Occitane, Ama Beleza, Forever Liss e Americanas
  todos retornando produtos reais pra termos genéricos como "hidratante"
  e "shampoo") — não é um bug generalizado nessas duas fontes.
- **Bug real encontrado na Época**: preços saindo **100x menores** do que
  o real (ex: R$0,64 em vez de R$63,99 no CeraVe). Causa: o campo
  `commertialOffer.Price` da API VTEX da Época já vem **em reais**
  (63.99), não em centavos como eu tinha assumido antes (baseado numa
  leitura via WebFetch que sugeriu "6399 (R$63,99)" — provavelmente já
  era uma reformatação da IA do fetch, não o valor bruto real). Corrigido
  em `netlify/functions/epoca-search.js`: removida a divisão por 100.
  Isso sozinho já explica a "Época não está funcionando" (preço
  claramente errado/quebrado visualmente).
- O ponto "só aparece Época ou Amazon" **ainda não confirmado se é bug ou
  comportamento esperado** (mesma explicação de sempre: só uma fonte bate
  marca+tipo da regra D3 pro produto específico) — pedido à Priscila o
  nome do produto exato que ela testou pra confirmar qual dos dois é.

**Pendência real pra confirmar depois do push**: testar Época em produção
de novo (preço deve estar certo agora; foto/link continuam como antes —
"Buscar na loja" até confirmação manual). Se a Priscila clicar em produtos
reais da Época e o link direto funcionar bem (sem CAPTCHA pro usuário de
verdade), pode tirar o
`linkOk:false` fixo do `epoca-search.js` e deixar o link direto valer.

## Sessão 23/07/2026 (continuação) — Época DESLIGADA (CAPTCHA bloqueia até o fallback)
Priscila testou vários produtos reais da Época depois da correção de
preço e todos caíram na mesma tela: "Ops! Essa página foi abduzida e não
está mais no ar" — testei ao vivo (`WebFetch`) tanto o link direto de
produto quanto o link de busca própria da loja (`storeGoLink`, o
fallback que devería ser o "plano B" confiável) e **os dois caem em
CAPTCHA** ("Não sou um robô", contato `abuse@magazineluiza.com.br` — Época
faz parte do grupo Magalu). Ou seja, diferente da Eudora/Ama Beleza (onde
só o link direto quebrava e a busca própria da loja funcionava como
fallback), na Época **nem o fallback é confiável** — não tem plano B
funcional pra oferecer.

Priscila decidiu remover a Época do site: **`EPOCA_ENABLED=false`**
(`index.html`, mesmo padrão de flag reversível do `SCRAPPA_ENABLED`/
`ML_ENABLED`/`EUDORA_ENABLED`) — `epocaSearchPrices()` agora só devolve
lista vazia sem chamar a function, então ela some de todos os lugares
(comparação de catálogo, busca de produto, quiz) sem precisar reverter o
resto do código. Reversível só se a Época resolver o bloqueio anti-bot do
lado dela — até lá, fica fora.

**Lojas parceiras efetivamente funcionando (23/07/2026)**:
- **L'Occitane en Provence BR** — ✅ feed + link direto.
- **Natura BR** — ✅ feed + link direto.
- **Forever Liss BR** — ✅ feed + link direto.
- **Ama Beleza BR** — ✅ feed + link direto.
- **Americanas** (via Apify, `gio21/americanas-product-scraper`) — ✅
  confirmado retornando produtos reais em produção.
- **Eudora BR** — ❌ desligada (`EUDORA_ENABLED=false`), link direto
  confirmado quebrado mesmo com feed novo.
- **Época Cosméticos** — ❌ desligada (`EPOCA_ENABLED=false`), bloqueio
  anti-bot (CAPTCHA) até no fallback de busca própria.
- **WePink** — ✅ nova, direta via API VTEX (sem Apify, sem comissão),
  página do produto testada sem CAPTCHA — link direto confiável.
- **Beleza na Web** — aprovada na Awin, sem feed de produtos ainda.
- **Amazon** — em segundo plano, aguardando liberação da API.

## Sessão 23/07/2026 (continuação 2) — sétima fonte: WePink (marca própria, sem comissão)
Priscila pediu pra achar uma fonte de dados pra WePink (marca de
maquiagem da Virgínia Fonseca/Samara Pink, roda em VTEX). Testado o mesmo
padrão da Época (API pública direta) — funcionou, e desta vez **a página
do produto testada não deu CAPTCHA** (2 produtos reais testados, um em
estoque outro não, ambos batendo com a API) — diferente da Época, o link
direto aqui é confiável.

**Implementado**:
1. `netlify/functions/wepink-search.js` (novo, mesmo padrão da Época mas
   sem `linkOk:false` — link confiável).
2. `wepinkSearchPrices()` adicionada, `liveMultiSourceSearch()` estendida
   pra incluir a WePink (agora 4 fontes: Awin + Americanas + Época +
   WePink). D3 e troca de foto em `loadComparison` também estendidos pra
   `_source==='wepink'`.

**Importante, não é multimarca**: a WePink só vende produtos próprios
(Welips, My Lips etc.) — não ajuda a achar marca de farmácia do catálogo
(esse papel é da Americanas/Época), só mostra produto WePink real quando
alguém busca por ele.

**Sem comissão**: integração direta como a Americanas, não afiliada.
Pesquisado se a WePink tem programa de afiliados de verdade — confirmado
que existe (aceita CPF, não só CNPJ; pede conta bancária, RG, comprovante
de residência; aprovação em dias/semanas), mas **não achei o link oficial
de cadastro** (só guias de terceiros descrevendo o processo, nada
encontrado no próprio site nesta sessão) — passado à Priscila a
recomendação de procurar direto no site dela (rodapé/central de ajuda) ou
contato via SAC perguntando pelo programa de afiliados, já que ela
consegue navegar o site de verdade (diferente da pesquisa automatizada
daqui).

Sintaxe validada com `node --check` (function nova + `<script>` inteiro
do `index.html`) — sem erros. Commitado (`e3852ab`) e enviado.

## Sessão 23/07/2026 (continuação 3) — Americanas contaminada por categoria errada (corrigido)
Priscila testou "batom" e reportou: primeira fileira mostrou Ama Beleza/
Natura/Amazon (ok), as demais só Amazon até a Americanas chegar (esperado,
complemento não-bloqueante — mesma explicação de sempre, D3 só bate numa
fonte por produto); WePink não apareceu; e a Americanas trouxe um
**chocolate** ("Garoto Baton"), uma **boneca Barbie** e material escolar
formato batom, misturados com maquiagem de verdade.

Investigado direto em produção:
- **WePink**: confirmado, não é bug — o único produto WePink que bate
  "batom" (Welips Batom Líquido Matte) está **sem estoque em todas as 10
  cores** agora. Corretamente filtrado pelo `bestAvailablePrice` (só
  aceita seller com `IsAvailable:true`).
- **Americanas**: bug real confirmado. Marketplace geral (vende de tudo),
  a busca por palavra livre da VTEX bate "batom" em qualquer categoria —
  chocolate "Garoto Baton" (`/Alimentos e bebidas/Bomboniere/Chocolate/`),
  lapiseira/caneta formato batom (`/Papelaria/...`), boneca Barbie
  (`/Brinquedos/`). **Corrigido**: `netlify/functions/americanas-search.js`
  agora usa o próprio campo `category` que a API já devolve — só aceita
  resultado cujo `category` comece com `/Beleza e perfumaria` (allowlist,
  mais confiável que tentar enumerar toda palavra de exclusão possível).
  Rede de segurança extra por título (`infantil`, `brinquedo`, `faz de
  conta`) pra pegar o caso raro de brinquedo de maquiagem infantil que a
  própria Americanas categoriza (erroneamente) dentro de "Beleza e
  perfumaria/Maquiagem" — **esse caso específico pode não ser 100%
  filtrado ainda** (categoria não ajuda, título pode variar), é uma
  limitação conhecida e aceita, não uma promessa de filtro perfeito.
  Testado em produção (`americanas-search?query=BATOM`): sumiu chocolate/
  boneca/material escolar, só sobrou produto de beleza real.

Commitado em duas partes: exposição temporária do campo `category` pra
diagnóstico (`f0bb3c7`) + filtro de verdade (`bb40c0f`). Ambos enviados.

## Sessão 23/07/2026 (continuação 4) — oitava loja: O Boticário BR via Awin
Priscila avisou que O Boticário BR aceitou a parceria na Awin (mesmo grupo
da Eudora — Grupo Boticário). Mesmo padrão de sempre:
`netlify/functions/awin-search.js` ganhou a entrada
`AWIN_BOTICARIO_FEED_URL` no array `FEED_URLS` — resto do pipeline (busca,
round-robin por loja, D3 marca+tipo, fallback ao vivo, agrupamento por
identidade) já combina o feed novo automaticamente. Sintaxe validada com
`node --check`.

Priscila já tinha configurado a variável e disparado o deploy antes do
código estar no GitHub — expliquei que o env var sozinho não basta, o
código que referencia ele também precisa estar publicado. Depois do push,
**confirmado funcionando em produção**: `awin-search?query=hidratante`
mostrou "oBoticario BR" no rodízio junto com as outras 4 lojas.

## Sessão 23/07/2026 (continuação 5) — lentidão da Americanas (fila de concorrência baixa)
Priscila reportou, depois do Boticário: cards mostrando só Amazon (ou só
Amazon + Ama Beleza), demora grande pra mais aparecer, "geralmente só
aparecem 2 por vez". Investigado em produção:
- `awin-search` e `americanas-search` **confirmados funcionando** (testei
  "Nivea" na Americanas: 20 produtos reais, preço certo). Não é bug de
  dado nenhuma das duas fontes.
- **Causa real da lentidão**: medi uma chamada isolada da Americanas
  (`curl` direto na function) — **~5,5 segundos**, overhead do próprio
  ator do Apify (chamada VTEX + wrapper Apify), não dá pra zerar isso.
  Com vários cards de produto na tela ao mesmo tempo, cada um disparando
  sua própria busca da Americanas, e a fila do lado do cliente limitando
  a só **3 rodando em paralelo** (`AM_MAX_CONCURRENT`), os cards
  seguintes ficavam esperando na fila mostrando só Ama Beleza (ou nada) +
  Amazon por um bom tempo até chegar a vez deles — dava a sensação de
  "só aparecem 2".

**Corrigido**:
1. `AM_MAX_CONCURRENT` subido de 3 pra 5 (`index.html`) — o ator da
   Americanas não usa navegador (só 512MB por execução, bem mais leve
   que o antigo ator do Mercado Livre que exigia concorrência baixa por
   causa da memória do navegador), suporta mais paralelismo com folga.
2. `maxItems` da Americanas reduzido de 20 pra 10
   (`netlify/functions/americanas-search.js`) — `loadComparison` só usa
   os top 3 diversificados por loja mesmo, payload menor ajuda um pouco
   (o grosso da demora é overhead fixo do ator, não o tamanho do
   resultado, então o ganho aqui é menor que o da concorrência).

Sintaxe validada com `node --check` (function + `<script>` inteiro do
`index.html`) — sem erros.

**Ideia anotada pra depois, não implementada**: um indicador visual tipo
"buscando mais lojas..." no lugar do 3º espaço do card enquanto a
Americanas ainda não respondeu, pra não parecer que travou em 2 mesmo
sabendo que está a caminho. Não implementado nesta sessão (Priscila
estava de saída) — considerar se a lentidão ainda incomodar depois do
ajuste de concorrência.

## Sessão 23/07/2026 (continuação 6) — ordenação corrigida + adicionada na página do quiz
Priscila reparou dois problemas na ordenação (Menor preço/Maior preço/
Mais vendidos/Nome A-Z): (1) a opção "Nome A-Z" não parecia respeitar o
alfabeto de verdade — pediu pra **tirar essa opção** de vez, deixando só
Menor preço/Maior preço/Mais vendidos, e que a opção escolhida realmente
funcione; (2) a página de resultados do quiz **não tinha esse seletor
nenhum** — pediu pra ele aparecer lá também.

**Investigado**: a lógica do "Nome A-Z" (`localeCompare` em brand+name)
até ordenava certo o catálogo, mas os cards de resultado AO VIVO (Awin/
Americanas/WePink) sempre entravam no topo da grade via
`insertAdjacentHTML('afterbegin', ...)`, fora da ordenação alfabética —
por isso nunca parecia seguir o alfabeto de verdade. Em vez de tentar
consertar isso, segui o pedido da Priscila e **removi a opção** de vez
(mais simples e é o que ela queria).

**Corrigido/implementado**:
1. Opção "Nome A-Z" removida do seletor (`index.html`, `#sortBy`) e do
   array de tradução PT/EN — só sobrou Menor preço/Maior preço/Mais
   vendidos. Lógica de sort por nome (`srt==='name'`) removida de
   `renderProds()`.
2. **Bug real encontrado e corrigido**: `applySortOrder()` estava com o
   grid (`'productGrid'`) E a variável de ordenação (`srt`, global) fixos
   no código — mesmo se um seletor de ordenação existisse na página do
   quiz, a reordenação ao vivo (disparada de dentro de `loadComparison`
   quando o preço de um card chega) sempre mexia no grid errado
   (`productGrid`), nunca no `resultsGrid`. Generalizado:
   `applySortOrder(gridId, sortValue)` agora recebe os dois como
   parâmetro; `loadComparison` descobre sozinho em qual grid o card está
   (`cardEl.closest('.cmp-grid')`) e usa a variável de ordenação certa
   (`srt` pro comparador, `srtQuiz` novo pro quiz — estados separados, um
   não deve afetar o outro).
3. **Seletor de ordenação adicionado na página de resultados do quiz**
   (`#sortByQuiz`, mesmas 3 opções) — função nova `onSortChangeQuiz()`;
   "Mais vendidos" ali reordena `amzResultsAll` com os cliques reais do
   Supabase (`getTrendingProducts`, mesmo mecanismo do comparador) e
   re-renderiza (`renderAmzPage()`).
4. **Bug adicional corrigido de passagem** (mesma categoria de "tem que
   funcionar, não enfeite"): os cards de resultado ao vivo
   (`liveResultCard`) nunca tinham o atributo `data-price` — na prática,
   ao ordenar por preço, esses cards sempre caíam pro final (tratados
   como "sem preço conhecido"), nunca entravam na ordenação de verdade.
   Corrigido: `data-price` agora é preenchido com o menor preço do grupo
   (`items[0].price`, já vem ordenado ascendente).

Sintaxe validada com `node --check` (`<script>` inteiro do `index.html`)
— sem erros.

## Sessão 23/07/2026 (continuação 7) — reordenar preço "sumia" com os cards (bug sério, urgente)
Priscila testou a correção da ordenação e reportou algo grave: ao escolher
Menor/Maior preço, a maioria dos cards **sumia**, sobrando só ~6 (o
`AUTO_LOAD_COUNT`) mostrando Amazon (sem preço, esperado — API da Amazon
ainda não disponível) ou Ama Beleza (às vezes "não disponível"/"item não
encontrado"). Ela avisou que isso bloqueia divulgar o site.

**Investigação** (sem acesso a navegador nesta sessão — usuária começou a
instalar a extensão Claude in Chrome mas optou por não continuar; segui só
com leitura estática do código + `WebFetch` nas functions/links reais):
- Testei um link real da Ama Beleza (`awin-search?query=hidratante`) até
  o destino final — **produto disponível, página real**, não achei
  evidência de quebra sistemática agora. Pode ter sido produto específico
  sem estoque no feed (limitação já conhecida de qualquer comparador
  baseado em feed), não necessariamente uma regressão nova — pedido à
  Priscila confirmar com exemplo específico se continuar acontecendo.
- **Botão Amazon sem preço é esperado**, não bug: `amazonBtnHtml()` nunca
  mostrou preço (não temos API de preço da Amazon ainda, é só link de
  busca/compra) — comportamento antigo, não mudou nesta sessão.
- **Causa mais provável do "sumiço" real**: o mecanismo de reordenação ao
  vivo (`applySortOrder`, dentro de `loadComparison`) já existia de uma
  sessão bem anterior ("preço é reordenado ao vivo conforme os cards
  carregam") — mas antes rodava com `AM_MAX_CONCURRENT=3` (Americanas).
  Nesta MESMA sessão eu subi a concorrência pra 5 (corrigindo a
  lentidão) — com mais cards resolvendo preço quase ao mesmo tempo, a
  reordenação (`querySelectorAll('.cpc')` + `appendChild` de cada card)
  passou a disparar em rajada, muitas vezes por segundo, o que é a
  explicação mais provável pro comportamento instável relatado (cards em
  carregamento lento/lazy parecendo "travar"/desaparecer da visão).
  **Não consegui confirmar 100% o mecanismo exato no browser** (sem
  acesso a ferramenta de navegador nesta sessão) — é a explicação mais
  defensável dado o código e o timing (o bug apareceu bem depois do
  ajuste de concorrência), não uma certeza absoluta.

**Correção aplicada (mitigação conservadora)**: a reordenação automática
que dispara toda vez que UM card individual termina de carregar o preço
agora passa por um **debounce de 200ms** (`scheduleSortOrder()`, novo,
`index.html`) em vez de chamar `applySortOrder` direto — várias chegadas
de preço próximas no tempo (Awin + Americanas + WePink resolvendo quase
juntas) agora viram UMA reordenação só, em vez de várias mutações do DOM
em sequência rápida. A troca manual do seletor pela Priscila continua
imediata (`onSortChange`/`onSortChangeQuiz` chamam `applySortOrder`
direto, sem debounce — só o gatilho automático em segundo plano foi
suavizado).

Sintaxe validada com `node --check`. **Commitado e enviado, mas ainda não
confirmado pela Priscila se resolveu de vez** — pedido pra ela retestar e,
se persistir, mandar print de tela (não consigo reproduzir/depurar isso
sem ver acontecer, ambiente sem navegador nesta sessão).

## Sessão 23-24/07/2026 — bug do debounce CONFIRMADO resolvido + extensão "Claude in Chrome" instalada
Priscila testou em produção (busca "hidratante", 271 resultados, trocando
entre "Maior preço"/"Menor preço"): **cards continuam todos visíveis**,
só a ordem muda — contagem "18 de 271" mantida, sem sumiço. O debounce de
200ms (`scheduleSortOrder`, sessão anterior) resolveu o bug de vez.

**Extensão "Claude in Chrome" instalada e confirmada funcionando** — mas
importante entender o que ela é de fato: é um **painel separado dentro do
próprio Chrome**, com sua própria conversa (mesmo modelo, Sonnet 5), que
consegue navegar/clicar no site de verdade. **Não é a mesma sessão** do
Claude Code daqui do terminal, e não vira ferramenta de navegador
automática pra mim — ela não apareceu no `ToolSearch` mesmo depois da
instalação/ativação confirmadas. Ou seja, o plano combinado (tentado numa
sessão anterior) de "conectar a extensão pra eu ganhar acesso a navegador"
**não é como essa extensão funciona** — ela é uma ferramenta paralela, não
um plugin desta sessão.

**Uso prático combinado com a Priscila**: quando precisar verificar um bug
visual (algo que só aparece olhando a tela renderizada, não dá pra ver
lendo código), o fluxo é: (1) ela mesma testa no site normalmente e me
descreve o que viu — mais simples, funcionou bem nesta sessão; ou (2) ela
abre o painel "Claude in Chrome" e pede pra ele navegar/testar e descrever
o que viu, depois cola a resposta dele aqui pra mim corrigir. Esse painel
**não corrige código nem faz push** (sem acesso ao repositório/arquivos)
— só descreve o que vê. Quem corrige continua sendo o Claude daqui.

**Nota de comunicação**: a Priscila é leiga em programação e se frustra
rápido com instruções técnicas em texto ("popup", "ícone da extensão",
etc.) — funcionou muito melhor pedir print de tela passo a passo (ela
consegue arrastar a imagem pra dentro da conversa) e ir um clique de
cada vez, em vez de explicar vários passos de uma vez.

## Sessão 24/07/2026 — Americanas e Ama Beleza ocultadas
Priscila recebeu notificação do Apify que os créditos grátis acabaram.
Confirmado no código: das fontes possíveis, **só a Americanas** ainda
consumia crédito do Apify de verdade (Mercado Livre já tinha sido
desligado numa sessão anterior, `ML_ENABLED=false`, e nunca voltou a
gastar crédito). As outras lojas (Awin: L'Occitane/Natura/Forever Liss/
Ama Beleza/Boticário; API direta: Época [já desligada]/WePink) não usam
Apify, não são afetadas pelo crédito zerado.

Priscila decidiu ocultar duas fontes por enquanto (até decidir se paga o
Apify) e por feed com problema:
1. **Americanas** — `AM_ENABLED=false` (`index.html`), mesmo padrão de
   flag reversível das outras fontes (`ML_ENABLED`/`EPOCA_ENABLED`/
   `EUDORA_ENABLED`). Reativar trocando pra `true` quando decidir pagar
   o Apify (ou se ele renovar crédito grátis).
2. **Ama Beleza** — Priscila relatou que o feed dela "nunca tem nenhum
   produto" (achado, não teoria — ela usa o site com frequência).
   `AMABELEZA_ENABLED=false` (`netlify/functions/awin-search.js`), mesmo
   padrão da Eudora (`EUDORA_ENABLED`) — sai do array `FEED_URLS`, nem é
   buscada. Reversível se o feed dela voltar a funcionar do lado deles.

Sintaxe validada (`node --check` na function + todos os blocos `<script>`
do `index.html` extraídos e testados com `new Function()`). Commit
`2786b87`, enviado.

**Lojas parceiras efetivamente ativas depois desta sessão**: L'Occitane,
Natura, Forever Liss, Boticário (Awin) + WePink (API direta). Eudora,
Ama Beleza, Época (Awin/API direta) e Mercado Livre (Apify) estão todas
ocultas por flag reversível — nenhuma foi removida do código.

## Sessão 24/07/2026 (continuação) — Americanas migrada de Apify pra chamada direta (sem custo)
Priscila perguntou se existia plataforma melhor que Scrappa/Apify. Antes
de responder, testei (via `WebFetch`) se a Americanas também roda em VTEX
como a Época e a WePink — **confirmado que sim**: a API pública de
catálogo dela (`/api/catalog_system/pub/products/search`) responde sem
autenticação nem custo, mesmo formato de dados das outras duas
(`productName`, `categories[]`, `items[].sellers[].commertialOffer`).
Também testei a **Beleza na Web** pela mesma via — devolveu **HTTP 403**
(bloqueada/não é VTEX acessível assim), então essa continua dependendo só
do feed da Awin (ainda não chegou).

**Implementado**: `netlify/functions/americanas-search.js` reescrita do
zero, trocando a chamada ao ator `gio21/americanas-product-scraper`
(Apify, pago) por chamada HTTP direta na API VTEX da Americanas — mesmo
padrão de `epoca-search.js`. O filtro de categoria de beleza (que já
existia, pra não deixar passar chocolate/brinquedo/material escolar que
batem "batom" por palavra) foi adaptado pro campo `categories` (array de
caminhos) que a API VTEX devolve nativamente, em vez do campo `category`
(string única) que só existia no formato de saída do ator antigo do
Apify. `AM_ENABLED=false` (que tinha acabado de ser criado nesta mesma
sessão pra ocultar a Americanas) foi **removido** — não faz mais sentido,
a fonte não depende mais de crédito nenhum.

**Resultado prático**: a Americanas volta a funcionar imediatamente, sem
custo, sem depender de decisão sobre pagar o Apify. `APIFY_TOKEN` só seria
necessário de novo se algum dia precisarmos de outra loja que exija
navegador/scraping de verdade (não é o caso de nenhuma fonte ativa hoje).

Sintaxe validada (`node --check` na function + todos os blocos `<script>`
do `index.html`). **Ainda não testado em produção nem confirmado pela
Priscila** — pedir pra ela testar uma busca (ex: "hidratante" ou "batom")
depois do deploy e confirmar se a Americanas volta a aparecer com preço/
foto/link certos.

## Sessão 24/07/2026 (continuação 2) — pesquisa de mais "gigantes VTEX de graça" + nona fonte: Lojas Rede
Priscila pediu pra testar mais grandes redes de cosmético do Brasil pelo
mesmo método (API pública VTEX, sem Apify/Scrappa). Testado via `WebFetch`
(uma por uma, algumas em paralelo causaram 429 de limite de requisição):

**Bloqueadas (403 — provável proteção anti-robô, mesmo sendo VTEX)**:
Sephora Brasil, Natura (site próprio), Boticário (site próprio, já coberto
via Awin mesmo assim), Eudora (site próprio), Vult, Beleza na Web, Quem
Disse Berenice, Casas Bahia.

**Não é VTEX / não aplicável**: Shopee Brasil (404, plataforma própria
deles, resultado esperado). Avon e Ikesaki deram 404 no caminho
testado — inconclusivo, não confirmado se são VTEX por outro caminho.

**The Beauty Box**: o domínio redireciona (301) pra `belezanaweb.com.br`
— é a mesma empresa/plataforma da Beleza na Web, já sabidamente bloqueada.

**Achado novo: Lojas Rede** (`lojasrede.com.br`, indicada pela Priscila)
— ✅ **funciona de graça**, testado e confirmado com produto real
(Neutrogena Hydro Boost, R$59,99) — bônus importante: é multimarca e
vende marca de farmácia, que a maioria das lojas parceiras não vende.
Categorias testadas (busca "batom") mostraram só "Maquiagem/..." — loja
focada em beleza, não precisa do filtro pesado de categoria que a
Americanas (marketplace geral) precisa.

**Conclusão prática pra próxima vez que quiser pesquisar mais lojas**: só
porque uma rede grande roda em VTEX não garante acesso de graça — só
funciona quando a loja não tem proteção anti-robô na frente da API. As
fontes de graça confirmadas até agora (Época, WePink, Americanas, Lojas
Rede) parecem ser exceção, não regra — não adianta testar toda loja VTEX
que aparecer, só vale a pena testar quando a Priscila trouxer um nome
específico.

**Implementado**: `netlify/functions/lojasrede-search.js` (novo, mesmo
padrão de `epoca-search.js`, sem filtro de categoria por ser loja 100%
beleza). `lojasredeSearchPrices()` adicionada ao `index.html`,
`liveMultiSourceSearch()` estendida (5 fontes agora: Awin + Americanas +
Época + WePink + Lojas Rede). D3 (marca+tipo) e troca de foto em
`loadComparison` estendidos pra `_source==='lojasrede'`. `'lojas rede'`
adicionada em `VTEX_SEARCH_DOMAINS` (busca própria do site, não Google) —
link direto sai com `linkOk:false` por enquanto (não testado clicando de
verdade ainda), mesmo tratamento inicial que Eudora/Ama Beleza/Época
tiveram até confirmação manual da Priscila.

Sintaxe validada (`node --check` na function + todos os blocos `<script>`
do `index.html`). **Ainda não testado em produção nem confirmado pela
Priscila.**

## Sessão 24/07/2026 (continuação 3) — Lojas Rede confirmada + link direto liberado + bug de mobile Android
Priscila testou "hidratante" no site em produção: **Americanas e Lojas
Rede apareceram e ambas levaram pro produto certo**. As outras 4 lojas
parceiras (L'Occitane/Natura/Forever Liss/Boticário) não apareceram nessa
busca — testei a function `awin-search` direto e confirmei que ela
devolve 10 produtos reais dessas 4 lojas certinho, então o problema não é
falta de dado do servidor. Não cheguei a uma causa confirmada (perguntei
se ela tinha alguma aba de categoria selecionada e se rolou a página, mas
a conversa seguiu pra outro assunto antes de eu receber a resposta) —
**investigação em aberto, retomar se ela trouxer o caso de novo.**

Como o link da Lojas Rede foi confirmado funcionando de verdade,
`netlify/functions/lojasrede-search.js` teve o `linkOk:false` cautelar
removido — passa a usar o link direto normalmente, mesmo tratamento que
WePink/Americanas já têm.

**Bug de mobile reportado**: site aparece "desfocado"/cortado em Android
(celular dela E tablet do marido), mas certinho no iPhone. Prints
comparados: no Android o texto está visivelmente maior, com palavra
cortada na borda direita ("num só lugar" virando "num só luga") — sinal
de que o navegador Android estava aumentando a fonte automaticamente
(recurso de acessibilidade de alguns navegadores/tablets Android, que o
Safari do iPhone não faz da mesma forma), estourando o layout puxado pro
tamanho original. **Corrigido**: `-webkit-text-size-adjust:100%;
text-size-adjust:100%` adicionado à regra `html{}` (`index.html`) —
desliga esse ajuste automático, texto passa a respeitar o tamanho
definido no CSS em qualquer navegador. Sintaxe validada.

**Correção acima NÃO resolveu** — Priscila confirmou que abriu direto
pelo app do Chrome (descartando a teoria de ser o navegador embutido do
WhatsApp) e o corte continuava. Mandou uma captura de tela de verdade
(não foto) que confirmou o bug é real: o parágrafo do hero ("Encontre os
melhores produtos de beleza comparando preços em várias lojas, num só
lugar.") quebra certinho na 1ª linha (com margem à direita), mas a 2ª
linha ("comparando preços em várias lojas, num só lugar.") vaza pra fora
da tela e é cortada bem no "lugar." — só nesse parágrafo, não no badge
nem no título acima dele. Não achei a causa exata sem inspecionar o DOM
ao vivo (sem navegador neste ambiente) — descartei alguns candidatos por
análise estática do código (sem espaço não-quebrável escondido no texto,
`box-sizing:border-box` já global, sem `white-space:nowrap` na regra,
viewport meta e breakpoint mobile `@media(max-width:900px)` corretos).
**Correção aplicada como rede de segurança geral** (mais robusta que
tentar achar a causa exata sem conseguir ver o layout ao vivo):
`overflow-wrap:break-word` adicionado ao reset universal `*{}` — impede
qualquer texto do site (não só esse parágrafo) de vazar pra fora do
elemento, em qualquer navegador, futuro ou não. Sintaxe validada.

**Causa raiz real encontrada** (não por mim — pela Priscila usando o
painel "Claude in Chrome" pra inspecionar de verdade, forçando um iframe
de 412px e lendo o DOM ao vivo): bug clássico de flexbox. `.hero` é
`display:flex`, e seu filho `.hero-in` (que leva o padding/conteúdo do
hero inteiro) é um item flex dentro dele — por padrão, item flex tem
`min-width:auto`, ou seja, o navegador não deixa ele encolher abaixo da
largura mínima intrínseca do próprio conteúdo (o título grande + o
parágrafo). Nos 412px de largura testados, essa largura mínima calculada
ficou ~422px — 28px maior que o espaço disponível, cortados em silêncio
pelo `overflow-x:hidden` já existente (sem barra de rolagem pra avisar).
Chrome/Blink (Android) e Safari/WebKit (iPhone) calculam essa largura
mínima de forma ligeiramente diferente — no Safari cabia, no Chrome não,
por isso o bug era só Android.

**Primeira tentativa insuficiente**: `min-width:0` só em `.hero-in` não
resolveu — Priscila testou e continuou igual. Motivo: o mesmo bug se
repete em CADA nível de flex/grid aninhado, não só no primeiro. A árvore
real é `.hero` (flex) > `.hero-in` (flex, já corrigido) > `.hero-intro`
(child de `.hero-in`, portanto TAMBÉM item flex, sem `min-width:0`) >
`.hero-h1`/`.hero-desc` (o texto que estoura). Corrigir só o primeiro
nível não adianta — o segundo nível (`.hero-intro`) ainda tinha
`min-width:auto` por padrão, recriando o mesmo travamento de largura um
passo mais fundo.

**Corrigido de verdade**: `min-width:0` adicionado também em
`.hero-intro` (o nível que realmente continha o título+parágrafo
problemáticos). Como prevenção do mesmo bug reaparecer em outro canto do
hero, também adicionado em `.hero-block` (item de grid dentro de
`.hero-split`, mesma categoria de bug em grid — grid items têm
`min-width:auto` por padrão igual flex items). A rede de segurança
`overflow-wrap:break-word` da correção anterior continua no lugar como
camada extra. Sintaxe validada. **Confirmado pela Priscila: resolvido.**

## Sessão 24/07/2026 (continuação 4) — quarta categoria (Perfumaria) + Achador de Dupes
Conversa estratégica: Priscila pediu sugestão pra diferenciar o VERAORIS
de comparadores genéricos. Pesquisa (WebSearch) confirmou "dupe"
(alternativa mais barata de outra marca) como tendência forte de beleza
em 2026 no TikTok — destaque especial pra perfume (conversão de 7,6% no
TikTok Shop dos EUA, a mais alta do segmento; 57% da Geração Z "compra
pela fórmula, não pelo logo"). Combinado com a cultura brasileira já
estabelecida de "perfume contratipo", foi o ângulo escolhido.

**Decisões tomadas com ela antes de implementar**: Perfumaria não entra
no quiz (só navegação/catálogo); usar imagem gerada por ela (Gemini) como
ícone padrão; Achador de Dupes cobre só Skincare/Maquiagem/Cabelo por
enquanto (dupe de perfume depende de cheiro, precisa de curadoria manual
futura); dupes aparecem como link/seção dentro de cada card existente,
não como página nova. Sessão passou por `/plan` (EnterPlanMode) antes de
mexer no código, dado o escopo (nova categoria toca ~10 pontos do
`index.html` + feature nova).

**Achado que economizou bastante trabalho**: o catálogo já tinha 74
produtos de perfume reais (O Boticário, Natura, Eudora, Avon, Quem Disse
Berenice, Granado, Jequiti, Racco + designers internacionais: Chanel,
Dior, YSL, Armani, Carolina Herrera, Lancôme, Calvin Klein, Hugo Boss,
Paco Rabanne, Jean Paul Gaultier, Victoria's Secret) — só estavam
classificados por engano como `cat:'skincare'` (não havia categoria
própria antes). Bastou recategorizar (`cat:'skincare', sub:'perfume'` →
`cat:'perfumaria', sub:'perfume'`, replace_all), não precisou escrever
catálogo do zero.

**Implementado**:
1. **Categoria Perfumaria**: `IPERF` (novo, base64 JPEG comprimido a
   partir da imagem gerada pela Priscila, redimensionada de 616KB PNG
   pra ~44KB JPEG via `System.Drawing`/PowerShell antes de embutir —
   mesmo padrão de `ISKIN`/`IMAQ`/`ICAB`). `getIco()` ganhou 4º ramo.
   `PERFUME_ONLY_NOUNS` nova lista (perfume, colônia, eau de parfum/
   toilette/cologne, body splash) — `conflictsWithCategory()`/
   `inferCat()` estendidos simetricamente aos outros 3. Nav (`goCat`),
   card de categoria na home (cor dourada própria, `.cat-card.pf`),
   rodapé, filtro de pílulas da página Comparar (`renderCats()`,
   `cats-grid` de 3→4 colunas), painel admin (`prodCat`/`promoCat`
   selects, `catLbl`/`cl` maps) — todos os ~10 pontos do padrão de
   categoria atualizados. Nav ganhou um item a mais: ids `nl5`/`nl6`/
   `nl7` renumerados (Perfumaria entrou como `nl5`, "Como Funciona"/
   "Sobre" empurrados pra `nl6`/`nl7`) pra manter o array `nl:[]` de
   tradução PT/EN consistente.
2. **Achador de Dupes**: `findDupes(p)` (novo, perto de
   `getActiveProducts()`) — acha até 4 produtos do catálogo do MESMO
   `sub` (tipo) e MESMA `cat`, marca diferente, sem duplicar. Reaproveita
   100% dado que já existia no catálogo, sem precisar de fonte nova.
   Testado direto contra o catálogo real (script Node avulso, não fica
   no repo) — resultados sensatos nas 3 categorias (ex: hidratante CeraVe
   → Neutrogena/La Roche-Posay/Vichy/Nivea; batom Maybelline → L'Oréal/
   NYX/Ruby Rose/Vult). `amzCard()` ganhou link "🔍 Ver alternativas
   parecidas" que expande uma lista (`goSearchTerm()`, novo, navega pra
   busca daquele produto específico — preço real só aparece ao clicar,
   não busca preço de toda sugestão antecipadamente). Rótulo sempre
   "alternativas parecidas, marca diferente" — nunca "mesmo produto",
   pra não repetir o problema que a decisão D3 já identificou.

Sintaxe validada (`node --check` + todos os blocos `<script>` do
`index.html` com `new Function()`). **Ainda não testado em produção nem
confirmado pela Priscila.**

## Sessão 24/07/2026 (continuação 5) — deploy bloqueado: limite de 4KB de variáveis de ambiente
Depois de responder um chamado de suporte sobre link quebrado da Ama
Beleza (a Kritzie, da própria loja, explicou que a Coluna A do feed —
`aw_deep_link` — é o link certo, e a Coluna E — `merchant_image_url` — é
só a foto, não o produto; confirmado que o nosso código já lê pelo NOME
da coluna, não pela posição, então esse bug específico não deveria nos
afetar), a Priscila gerou um feed novo da Ama Beleza marcando "Selecionar
Tudo" (a pedido meu, pra garantir que nada faltasse) — só que isso deixou
a URL do feed bem mais comprida que antes.

**Resultado**: o próximo deploy no Netlify falhou com erro fatal
`Your environment variables exceed the 4KB limit imposed by AWS` — as
Netlify Functions rodam em AWS Lambda, que tem um limite rígido de 4KB
pra todas as variáveis de ambiente combinadas. Com ADMIN_PASSWORD,
APIFY_TOKEN, 6 variáveis `AWIN_*_FEED_URL`, variáveis do Supabase etc.,
já estava no limite — a URL mais comprida da Ama Beleza (por ter todas as
colunas) empurrou pra cima do limite. **Minha orientação de marcar
"Selecionar Tudo" foi o gatilho direto — erro meu.**

**Consequência**: o site **não caiu** (Netlify mantém a última versão
publicada com sucesso no ar), mas parou de receber atualizações novas —
inclusive a sessão de Perfumaria/Achador de Dupes (commit `380b023`)
ainda não estava no ar no momento desse erro.

**Corrigido nesta sessão** (só a parte de código): o erro também apontou
um aviso secundário (não fatal) — a regra de redirect
`/.netlify/functions/* -> /.netlify/functions/:splat` no `netlify.toml`
é inválida (regra de redirect não pode começar com `/.netlify`) e
desnecessária (Netlify já roteia functions automaticamente, sem precisar
de redirect manual). Removida. Commit a seguir.

**Pendência real, só a Priscila resolve** (não é código, é configuração
do Netlify + Awin): gerar o feed da Ama Beleza de novo, mas **sem**
"Selecionar Tudo" — só as colunas que o `awin-search.js` realmente usa:
`aw_deep_link`, `product_name`, `merchant_image_url` (ou `aw_image_url`),
algum campo de preço (`search_price`/`display_price`/`store_price`) e
`merchant_name`. Isso deve encurtar a URL o suficiente pra caber no
limite de novo. Instrução pendente de confirmação dela.

**Nota pra próxima sessão**: se o limite de 4KB continuar apertado mesmo
depois disso (mais lojas Awin no futuro vão continuar competindo pelo
mesmo espaço), vale investigar se o Netlify permite limitar quais
variáveis vão pra quais funções específicas (reduzir o que cada function
individual recebe) — não confirmado se essa opção existe na conta dela,
não pesquisado ainda nesta sessão.

**Achado bônus, direto do log de erro do Netlify**: a "Resolved config" do
erro listou o nome real de cada variável configurada — e
`AWIN_AMOBELEZA_FEED_URL` ("AMO", igual ao domínio real `amobeleza.com.br`)
é o nome verdadeiro no Netlify, mas `netlify/functions/awin-search.js`
lia `AWIN_AMABELEZA_FEED_URL` ("AMA") — nome errado, sempre `undefined`.
**Essa era a causa raiz real do mistério "Ama Beleza nunca tem produto
nenhum"** de sessões anteriores — não era o feed dela que tinha problema,
o código nunca estava buscando o feed de verdade. Corrigido (2
ocorrências trocadas de AMABELEZA→AMOBELEZA).

**Deploy travado resolvido em duas frentes**: (1) apagada a variável
`AWIN_EUDORA_FEED_URL` do Netlify (não usada, Eudora desligada mesmo) pra
liberar espaço rápido; (2) a Priscila regenerou o feed da Ama Beleza com
só as colunas necessárias (`aw_deep_link`, `product_name`,
`merchant_image_url`, `search_price`, `merchant_name`) em vez de
"Selecionar Tudo" (que tinha sido minha orientação errada e causou o
estouro do limite). Deploy voltou a funcionar.

**Ama Beleza reativada e testada em produção**: `AMABELEZA_ENABLED=true`,
confirmado via function ao vivo (`awin-search?query=shampoo`) trazendo
produtos reais dela ("AMOBELEZA BR", Wella Professionals, Lowell) com
link `awin1.com/pclick.php` correto. **Mas a Priscila testou 11 produtos
reais clicando de verdade e só 4 funcionaram** — os outros 7 caíram em
"produto não encontrado"/"não disponível", mesma categoria de problema
que a Eudora sempre teve (feed desatualizado em relação ao catálogo ao
vivo da loja — bug de nome de variável resolvido é uma coisa, feed
sincronizado é outra, independente). `'amobeleza'` foi devolvida pra
`UNRELIABLE_LINK_STORES` (`awin-search.js`) — link direto marcado
`linkOk:false`, cai no fallback de busca nativa do site dela
(`VTEX_SEARCH_DOMAINS` no `index.html`, nunca removido de lá). Preço/
nome/foto continuam confiáveis, só o link de compra direto que não é.

**Pergunta da Priscila sobre a Eudora (respondida)**: será que o mesmo
bug de nome errado de variável explica o problema dela também? Resposta:
improvável — "EUDORA" não tem uma grafia alternativa ambígua tipo
"AMA"/"AMO" que confundisse o código. De qualquer forma não dá pra
testar agora (variável apagada pra liberar espaço do 4KB) — replanejar
teste da Eudora só depois da migração de functions.

## Sessão 24/07/2026 (continuação 6) — migração completa: fim do limite de 4KB pra sempre
A Priscila apontou corretamente que apagar a variável da Eudora foi só
remendo — quando ela (ou Amazon, ou Shopee) voltar, o mesmo travamento
ia acontecer nu de novo. Pesquisa confirmou a causa raiz: as 9 functions
do site rodavam no "Lambda compatibility mode" do Netlify (modo antigo,
compatível com AWS Lambda clássico), que tem um teto FIXO de 4KB pra
soma de todas as variáveis de ambiente — não é algo que dá pra configurar
ou aumentar. O runtime moderno do Netlify Functions não tem esse limite
nenhum. `/plan` usado antes de mexer (9 arquivos, mudança de arquitetura,
alto risco de quebrar tudo de uma vez se desse errado).

**Migração feita, function por function, testando cada uma em produção
antes de seguir pra próxima** (nenhuma migrada sem confirmar a anterior):
1. **Piloto** (`epoca-search.mjs`) — confirmou o ponto mais arriscado do
   plano: a URL `/.netlify/functions/nome` continua idêntica no runtime
   novo, contanto que cada function declare
   `export const config = { path: '/.netlify/functions/nome' }`
   explicitamente (sem isso não tinha garantia). Com essa confirmação,
   as outras 8 seguiram o mesmo molde com confiança.
2. `wepink-search.mjs`, `americanas-search.mjs`, `lojasrede-search.mjs`
   — mesmo padrão VTEX do piloto.
3. `mercadolivre-search.mjs`, `scrappa-search.mjs`, `search.mjs` —
   parâmetros de busca diferentes (`new URL(request.url).searchParams`
   no lugar de `event.queryStringParameters`), testados em produção
   (erros retornados foram problemas antigos de credencial/dado, não da
   migração).
4. `admin.mjs` — único endpoint POST com corpo JSON
   (`JSON.parse(await request.text())` no lugar de
   `JSON.parse(event.body)`). Testado com `curl` direto (senha errada →
   401, GET → 405, OPTIONS → 200) — todos corretos, sem tocar em dado
   real.
5. `awin-search.mjs` — a mais arriscada (`require('zlib')` →
   `import zlib from 'zlib'`, `Buffer.from()`, variáveis `AWIN_*_FEED_URL`
   lidas no carregamento do módulo). Testada em produção, feed gzip da
   Awin descomprimindo e produtos aparecendo normalmente.

**Padrão técnico usado em todas**: arquivo renomeado de `.js` pra `.mjs`
(ativa ESM sem precisar de `package.json` novo no projeto — mais
contido/previsível que a alternativa de `"type":"module"` no
`package.json` da raiz, que teve relatos de comportamento inconsistente
em alguns setups do Netlify segundo a documentação pesquisada).
`exports.handler = async (event) => {...}` virou
`export default async (request) => {...}`; retorno
`{statusCode, headers, body}` virou `new Response(body, {status,
headers})`; `event.queryStringParameters.x` virou
`new URL(request.url).searchParams.get('x')`; toda function ganhou
`export const config = { path: '/.netlify/functions/<nome-original>' }`
pra garantir que nenhuma URL chamada pelo `index.html` mudasse.

**Resultado**: as 9 functions (`admin`, `americanas-search`,
`awin-search`, `epoca-search`, `lojasrede-search`,
`mercadolivre-search`, `scrappa-search`, `search`, `wepink-search`) estão
todas no runtime moderno agora. O limite de 4KB não existe mais pro
site — pode adicionar Eudora de volta, Amazon quando a API liberar,
Shopee, quantas lojas quiser, nunca mais vai faltar espaço de variável
de ambiente. Plano completo usado nesta migração está arquivado em
`C:\Users\macie\.claude\plans\jazzy-moseying-hamming.md` se precisar
consultar os detalhes técnicos de novo.

**Pendência real**: confirmar com a Priscila que o site em produção
continua funcionando normalmente depois de toda essa troca (ela ainda
não testou navegando no site de verdade depois da migração completa).

Priscila confirmou logo depois: **site funcionando normal após a
migração**. Ela religou a Eudora pra testar de novo (feed novo gerado) —
**continua com link quebrado na prática**, então voltou pra
`EUDORA_ENABLED=false` (`awin-search.mjs`). Novidade: a **Beleza na Web
confirmou** (respondendo ao e-mail pendente) que sabe do problema e disse
que deve resolver em breve pelo suporte da Awin — aguardando.

## Sessão 24/07/2026 (continuação 7) — bug real na categoria Perfumaria + dupes pouco visíveis
Priscila testou a categoria Perfumaria nova e reportou que aparecia
shampoo, creme e batom junto com os perfumes — não só perfume. Também
não estava achando o link do Achador de Dupes.

**Causa raiz do bug de Perfumaria**: `conflictsWithCategory()`
(`index.html`) usava a mesma lógica pras 4 categorias — rejeitar um
resultado só se ele contém palavra EXCLUSIVA de OUTRA categoria (ex:
rejeita de "skincare" se tiver "shampoo" ou "batom"). Isso funciona bem
pras 3 categorias antigas (são guarda-chuvas amplos, a lista de exclusão
cobre bem o que não deveria entrar) mas quebra pra Perfumaria, que é uma
categoria ESTREITA — um "Creme Nutritivo" ou "Óleo Reparador" qualquer
não contém nenhuma palavra das listas de exclusão (não é "shampoo" nem
"batom" literal), então passava despercebido mesmo não sendo perfume.
**Corrigido**: regra invertida só pra perfumaria — em vez de "rejeitar se
parece outra categoria", agora é "só aceitar se REALMENTE parece
perfume" (exige palavra de `PERFUME_ONLY_NOUNS`). Testado com script Node
direto contra a função real: shampoo/creme/batom agora rejeitados,
perfume/colônia aceitos, outras 3 categorias sem mudança de
comportamento.

**Achador de Dupes**: código conferido, parece correto (`amzCard()`
calcula `findDupes(p)` e monta o link em todo card do catálogo, nos dois
lugares que renderizam produto — `renderProdsPage` e `renderAmzPage`).
Suspeita mais provável: o link (`.cpc-dupes-link`) era texto pequeno
(11px) sem destaque visual, fácil de passar despercebido no meio do
card cheio de informação. **Ajustado**: agora tem aparência de botão
(fundo dourado claro, borda tracejada, mesmo estilo visual do botão
"Comparar preços em outras lojas" já existente) — deve chamar mais
atenção. Não foi encontrado bug de lógica que impedisse o link de
aparecer — se depois desse ajuste visual a Priscila ainda não achar,
precisa investigar mais a fundo (talvez pedir print de um card
específico).

Sintaxe validada (`node --check` na function + todos os blocos
`<script>` do `index.html`). **Ainda não confirmado pela Priscila.**

## Sessão 24/07/2026 (continuação 8) — dupes vazando pra Perfumaria + limpeza de marcas impossíveis
Priscila testou de novo e achou dois problemas novos, ambos meus erros:

1. **Erro real: o Achador de Dupes estava aparecendo em produtos de
   Perfumaria também** — decisão já tomada antes (sessão de planejamento)
   era cobrir só Skincare/Maquiagem/Cabelo, porque "dupe" de perfume
   depende do CHEIRO ser parecido (precisa curadoria manual, fora de
   escopo). `findDupes()` (`index.html`) não tinha essa trava — como
   perfume também usa `sub:'perfume'` compartilhado entre marcas, a
   função encontrava "dupes" pra perfume igual às outras categorias.
   **Corrigido**: `DUPE_ELIGIBLE_CATS=['skincare','maquiagem','cabelo']`
   — `findDupes()` devolve lista vazia (sem link nenhum) pra qualquer
   produto fora dessas 3 categorias. Testado com script Node direto:
   perfumaria agora sempre vazio, skincare continua achando dupe normal.

2. **Cards de Perfumaria sem preço/sem link de loja** pra Jequiti, Hinode
   e Racco — investigado e confirmado (testei buscas reais contra
   Americanas/Lojas Rede/Awin): essas 3 são marcas de **venda direta/
   consultoria** (Jequiti, Hinode, Racco), nunca vendidas em loja online
   nenhuma — não é bug, é impossível de ter comparação de preço com
   qualquer fonte que o site tem hoje. Já Boticário/Avon (que também
   apareceram sem comparação no print dela) têm produto de verdade
   disponível — o problema ali é o nome do produto no catálogo ser
   específico demais pra bater com o resultado da busca ao vivo (ex:
   "Malbec Eau de Toilette" vs "Kit Desodorante Antitranspirante Malbec"
   no feed) — **limitação pré-existente do site inteiro, não nova da
   Perfumaria, não mexida nesta sessão** (fica pra investigar depois se
   incomodar).

   **Origem da pergunta "como essas marcas entraram no site"**: o
   catálogo inteiro (~1500 produtos) foi criado bem no início do projeto
   como conteúdo de preenchimento, antes de existir busca ao vivo — só
   precisava ter um botão de busca da Amazon (que funciona pra qualquer
   marca, mesmo venda direta). Isso só virou problema visível agora que
   comparação/dupes viraram parte central da experiência.

   **Corrigido**: as 6 entradas de Jequiti/Hinode/Racco dentro de
   `cat:'perfumaria'` foram removidas do catálogo BR (as entradas dessas
   3 marcas em skincare/maquiagem/cabelo foram mantidas — mesmo
   problema existe lá também, mas não é o que ela reportou desta vez,
   fora de escopo por ora). Perfumaria BR: 60→54 produtos.

Sintaxe validada. **Ainda não confirmado pela Priscila.**

## Sessão 24/07/2026 (continuação 9) — três bugs reais achados de uma vez, sessão pesada
Priscila testou de novo (frustrada com o volume de correções que não
"pegavam" de primeira) e trouxe 3 problemas concretos com prints. Desta
vez cada um foi investigado com teste real (script Node contra os dados
de verdade, ou chamada direta às functions) antes de aplicar a correção
— não só teoria.

**1. Clique numa "alternativa parecida" (dupe) levava pra produto
diferente do clicado.** Causa raiz confirmada: `goSearchTerm()` só
mudava `srch` e navegava pra página Comparar — mas resultados AO VIVO
das lojas parceiras entram no TOPO da grade (`insertAdjacentHTML('afterbegin',...)`,
decisão de sessão anterior), ANTES do catálogo. Mesmo o catálogo achando
o produto certo em 1º lugar (confirmado com script Node — busca por
"maybelline superstay matte ink batom" retorna o produto exato em 1º),
um resultado ao vivo qualquer que bate só uma palavra aparecia
visualmente acima dele, parecendo "foi pro produto errado". **Corrigido**:
novo mecanismo `dupeScrollTarget` — depois que a grade termina de montar
(catálogo + resultados ao vivo, cobrindo os 3 pontos de saída de
`finishRenderProds`), `scrollToDupeTarget()` procura o card com
brand+nome exatos, rola suavemente até ele e aplica destaque visual
temporário (`.cpc-highlight`, borda dourada + sombra, 2.5s). Produto
certo agora fica impossível de não notar, mesmo com resultado ao vivo
acima dele.

**2. Achado grande: O Boticário nunca batia com o próprio feed dele
mesmo.** A Priscila reparou que produtos do Boticário (loja que TEM API/
feed configurado) apareciam sem preço/link, só com botão da Amazon.
Investigado e confirmado com teste direto: o catálogo usa a marca
`'O Boticário'` (com espaço entre "O" e "Boticário", com acento), mas o
feed da Awin devolve o nome da loja como `"oBoticario BR"` (sem espaço,
sem acento — tudo grudado). A regra D3 (marca precisa aparecer no título
OU no nome da loja) comparava esses textos direto — nunca batia,
NENHUM produto do Boticário conseguia confirmar a marca pela loja.
Esse é provavelmente um pedaço grande do motivo de "muitos produtos sem
preço" reportado (Boticário é uma das únicas 4 lojas Awin ativas hoje).
**Corrigido**: nova função `normBrand()` (`index.html`, perto de
`normalizeProductTitle`) — remove acento E espaço/pontuação antes de
comparar (`"O Boticário"` e `"oBoticario BR"` viram `"oboticario"` e
`"oboticariobr"`, aí bate). Aplicada nos dois pontos onde marca é
comparada com nome de loja (`preloadEudoraImage` e o filtro D3 principal
em `loadComparison`/`renderCombined`). Testado com script Node
diretamente na função real — confirma o match agora. Vale pra qualquer
marca com esse tipo de diferença de formatação, não só Boticário.

**3. "Só os primeiros produtos mostram preço, depois nada"** — não achei
um TERCEIRO bug distinto de lógica pra isso além do item 2 acima (que já
deve resolver parte considerável, já que Boticário é loja ativa
importante). O mecanismo de carregamento (`AUTO_LOAD_COUNT=6` automático
+ resto via `IntersectionObserver`/`registerLazyCompare` ao rolar a
tela) parece correto na leitura do código. **Sem confirmação real (sem
navegador nesta sessão) se isso é 100% a explicação ou se sobra algo
mais** — pedir pra ela testar de novo depois deste deploy, especificamente
reparando se rolar a tela faz preço novo aparecer (lazy load funcionando)
ou se realmente trava depois de um tempo mesmo rolando.

Sintaxe validada (`node --check` + todos os blocos `<script>` do
`index.html`). Commit único com as duas correções de código (dupe +
normBrand). **Ainda não confirmado pela Priscila — pedido explícito dela
de testar com mais calma desta vez antes de reportar mais problema.**

## Sessão 24/07/2026 (continuação 10) — Achador de Dupes REMOVIDO + Perfumaria corrigida de vez
Priscila testou de novo, ainda mais frustrada (volume grande de correção
que não resolvia de primeira nesta sessão longa) — pediu explicitamente
pra **apagar o Achador de Dupes por completo** ("esquece isso") e focar
só em consertar a Perfumaria, que estava mostrando só 1 produto.

**Achador de Dupes removido inteiro**: `findDupes()`, `DUPE_ELIGIBLE_CATS`,
o bloco de HTML/CSS do link "Ver alternativas parecidas" em `amzCard()`,
o mecanismo `dupeScrollTarget`/`scrollToDupeTarget()` (tentativa da
sessão anterior de corrigir o clique indo pro produto errado) e
`goSearchTerm()` — tudo fora do código. Se a ideia for retomada no
futuro, fica pra uma sessão nova, com mais cuidado antes de publicar.

**Causa real do "só 1 produto na Perfumaria" encontrada**: `goCat()`
(usada pelo menu de navegação) nunca limpava a busca de texto (`srch`)
ao trocar de categoria — um termo de busca antigo (de qualquer pesquisa
anterior, inclusive um clique de dupe de antes) ficava "grudado" junto
com o filtro de categoria nova, reduzindo os resultados quase a zero.
**Corrigido**: `goCat()` agora limpa `srch` ao navegar (`filterCat()`,
usada pra refinar uma busca já em andamento com as pílulas de categoria,
foi deixada como estava de propósito — ali faz sentido manter a busca).

**Melhoria pedida por ela**: Boticário, Natura e WePink têm bem mais
perfume de verdade do que os 54 produtos do catálogo fixo — ela queria
que a Perfumaria mostrasse isso. Só que a busca ao vivo nas lojas
parceiras (`liveMultiSourceSearch`) só disparava quando havia texto
digitado (`srch`), nunca só navegando por categoria. **Implementado**:
`finishRenderProds()` agora também dispara busca ao vivo com o termo
genérico `"perfume"` quando `cat==='perfumaria'` e não há busca de texto
ativa — testado direto na function (`awin-search?query=perfume`),
confirma produto real de Boticário/Natura voltando. Mecanismo de
descarte de resposta desatualizada (`if(srch!==snapSrch...)`) também
ajustado pra considerar mudança de categoria, não só de busca, já que
agora o "termo" pode vir da categoria em vez do campo de busca.

**Limitação conhecida, não corrigida agora**: a palavra "perfume" também
aparece em produtos que NÃO são perfume (ex: "Kit Desodorante ... Sem
Perfume" da Natura, um antitranspirante descrito como "sem fragrância")
— o filtro `PERFUME_ONLY_NOUNS` bate a palavra solta, sem distinguir
"tem perfume" de "sem perfume". Chance pequena de aparecer 1 produto
errado ocasional nos resultados ao vivo da Perfumaria; não é o mesmo
tipo de bug que causava "só 1 produto no total" (esse já está corrigido).
Mesma categoria de limitação que "hidratante" já tinha antes.

Sintaxe validada. **Ainda não confirmado pela Priscila.**

## Sessão 24/07/2026 (continuação 11) — card sem preço na Perfumaria some da grade
Ainda na mesma sessão, Priscila mandou print mostrando vários produtos
de Perfumaria (Avon, Quem Disse Berenice, Mahogany...) sem preço nem
botão de loja, só Amazon — e foi taxativa: **"não é pra aparecer coisa
sem preço e sem botão de loja"**. Também confirmou que esse problema **só
acontece na Perfumaria**, não no resto do site (skincare/maquiagem/
cabelo já são estáveis há semanas).

**Investigação rápida** (`curl` direto nas functions ao vivo, testando
cada marca que sobrou no catálogo de Perfumaria): confirmado que Natura,
O Boticário, Eudora, Dior, Carolina Herrera, Granado, Phebo, Victoria's
Secret, YSL, Armani, Calvin Klein, Hugo Boss e Jean Paul Gaultier TÊM
produto real disponível nas lojas parceiras (Awin ou Lojas Rede). Avon,
Quem Disse Berenice, Mahogany, Água de Cheiro e Chanel **não** retornaram
nenhum resultado real em nenhuma fonte testada.

**Implementado, restrito a `cat==='perfumaria'`**: `loadComparison()`
agora conta quantas das 5 fontes ao vivo (Awin, Americanas, Época,
WePink, Lojas Rede) já responderam (`sourcesDone`/`sourcesTotal=5`,
incrementado em cada callback). Só depois que TODAS já responderam — pra
nunca remover um card que ia achar preço um instante depois — se
`combined.length` continuar zero (nenhuma bateu a marca de verdade), o
card inteiro é removido da grade (`cardEl.remove()`) em vez de ficar
mostrando só o botão da Amazon fingindo ser resultado. Escopo
propositalmente limitado à Perfumaria — as outras 3 categorias
continuam exatamente com o comportamento de sempre (Amazon como opção
garantida), porque ela confirmou que ali não é um problema. Isso
resolve o caso das marcas sem match automaticamente (Avon, Quem Disse
Berenice etc. simplesmente não aparecem mais), sem precisar remover
cada uma manualmente do catálogo.

Sintaxe validada, commit único junto com a remoção do Achador de Dupes
(pedido explícito dela, ver seção acima) e a correção de `goCat()`.
Publicado — **confirmado no site ao vivo que as referências ao dupe
sumiram** (ela reportou ainda estar vendo, era só cache/deploy ainda não
tinha ido — resolvido assim que o push aconteceu). **Comportamento da
Perfumaria (card sumindo) ainda não confirmado por ela.**

## Sessão 24/07/2026 (continuação 12) — regressão em Skincare + falso positivo "sem perfume"
Duas coisas graves reportadas em sequência rápida, sessão já bem tensa:

**1. "Site quebrado" em Skincare** — print mostrando CeraVe/Vichy/La
Roche-Posay só com botão da Amazon, sem comparação, que "tava
aparecendo direito antes". Investigado direto nas lojas (`curl` nas
functions, sem tocar em código primeiro): confirmado que nem Americanas
nem Lojas Rede têm QUALQUER produto CeraVe agora (testado com termo
completo e só a marca sozinha, zero resultado dos dois). Não é
regressão de hoje — nenhuma loja parceira atual (Boticário/Natura/
Forever Liss/L'Occitane) vende marca de farmácia, e a única fonte que
cobria isso (Scrappa) está desligada desde muito antes desta sessão.
Coincidência de timing (ela só reparou nisso testando com mais atenção
hoje), não causa nova.

**Decisão**: em vez de discutir a causa, estendida a mesma proteção que
foi feita pra Perfumaria (card some se todas as 5 fontes responderem e
nenhuma achar preço real) pra **todas as categorias**, não só
Perfumaria — `sourcesTotal` deixou de checar `cat==='perfumaria'`,
agora é só `region==='BR'`. Ela tinha dito antes que "no resto não
acontecia", mas o print prova que acontece (Scrappa desligada afeta
qualquer marca de farmácia em qualquer categoria) — melhor ter a
proteção em todo canto do que confiar que só uma categoria precisa.

**2. Falso positivo real na Perfumaria**: print mostrando desodorante
Nivea "Sem Perfume" e loção Hidramais "Perfume de Bebê" aparecendo nos
resultados ao vivo — exatamente a limitação que eu já tinha documentado
(palavra "perfume" solta pega qualquer produto que menciona a palavra,
mesmo dizendo o oposto). **Corrigido de vez**: nova lista
`PERFUME_FALSE_POSITIVE_HINTS` (`index.html`, perto de
`PERFUME_ONLY_NOUNS`) — frases como "sem perfume", "antitranspirante",
"loção hidratante", "sabonete" têm prioridade sobre o match de
"perfume" solto, excluem sempre. Testado com os exemplos exatos do
print dela (Nivea Sem Perfume, Hidramais Perfume de Bebê, Natura
Tododia Sem Perfume — todos agora corretamente excluídos) e com
perfume de verdade (Deo Colônia Alfazema, Malbec — continuam passando).

Sessão com muitas idas e voltas e usuária muito frustrada (chegou a
ameaçar cancelar) — as duas correções foram testadas com dado real
(`curl` nas functions + script Node com a função extraída do arquivo)
antes de publicar, não só teoria, dado o histórico do dia. Sintaxe
validada, publicado.

## Sessão 24/07/2026 (continuação 13) — Perfumaria só buscava por "perfume", perdia a WePink inteira
Priscila reparou que só ~56 produtos apareciam na Perfumaria e nenhum da
WePink. Testei a function dela direto: buscar "perfume" na WePink
devolve vazio, mas buscar "colônia" ou "body splash" traz dezenas de
produtos reais — a WePink nomeia tudo "Desodorante Colônia X" ou "Body
Splash X", nunca usa a palavra "perfume" no título. O fallback de busca
ao vivo da Perfumaria (sessão anterior) só buscava pelo termo genérico
"perfume", então a WePink inteira ficava de fora — não por não vender,
por causa da palavra escolhida.

**Corrigido**: nova função `liveMultiTermSearch(terms, callback)` (perto
de `liveMultiSourceSearch`) — roda a busca combinada de todas as fontes
pra VÁRIOS termos ao mesmo tempo e junta o resultado sem duplicar. A
navegação por Perfumaria (sem busca de texto) agora usa
`['perfume','colônia','body splash']` em vez de só `'perfume'`. Busca de
texto normal da pessoa continua sendo só o termo que ela digitou (sem
mudança aí). Sintaxe validada.

## Sessão 24/07/2026 (continuação 14) — revisão minuciosa pedida pela Priscila + causa real do "só 18"
Priscila, no limite da paciência (ameaçou cancelar a assinatura),
reportou que ordenar por preço (Maior/Menor) mostrava só 18 produtos na
Perfumaria, enquanto "Mais vendidos" mostrava todos — e pediu uma
revisão completa e cuidadosa de tudo antes de eu falar com ela de novo.

**Causa real encontrada**: cada uma das lojas (Awin, Americanas, WePink,
Lojas Rede) só devolve os **10 primeiros resultados por busca**, por
padrão da própria API delas (nenhum parâmetro de quantidade era
enviado). Confirmado testando a API da Lojas Rede direto com e sem o
parâmetro — sem, vêm 10; pedindo explicitamente (`_from=0&_to=29`),
vêm 30. Com só 10 por termo por loja, e boa parte descartada pelo
filtro de categoria (só perfume de verdade) e deduplicação, sobrava
pouco — daí o "18". "Mais vendidos" parecia trazer mais só porque
dispara um `renderProds()` completo (busca nova do zero), enquanto
ordenar por preço só reorganiza o que já estava na tela naquele momento
— não é bug de ordenação, é limite de quantidade buscada.

**Corrigido**: as 4 functions VTEX (`americanas-search.mjs`,
`epoca-search.mjs`, `lojasrede-search.mjs`, `wepink-search.mjs`) agora
pedem até 30 resultados por busca (`&_from=0&_to=29`) em vez do padrão
de ~10. `awin-search.mjs` (round-robin por loja) subiu de 10 pra 20
resultados combinados. Testado em produção depois do deploy: contagem
real subiu de 10 pra 20-30 por fonte por termo — ex. Lojas Rede
"colônia" foi de 10 pra 30, WePink "body splash" de 10 pra 30. Total
de perfume real disponível pra Perfumaria deve ter crescido bastante
(não cheguei a contar o total final deduplicado, mas a entrada de dados
brutos mais que dobrou/triplicou em quase toda fonte).

**Revisão geral feita** (pedido explícito dela): reconferido nesta
sessão — sintaxe de todo o `<script>` do `index.html` (zero erro),
sintaxe de todas as 9 functions `.mjs` (zero erro), nenhuma referência
órfã ao Achador de Dupes restante no código, site respondendo 200 em
produção, function do admin respondendo 401 corretamente pra senha
errada (POST real testado). Lógica de `applySortOrder` reconferida —
confirmado que ela só reordena cards já na tela (não busca de novo,
não remove nada) — o "sumiço" ao ordenar por preço era só timing do
mecanismo de "esconder card sem preço" (sessão anterior) coincidindo
com o momento em que ela olhou, não um bug na ordenação em si; com o
limite de resultados maior agora, menos catálogo deve ficar sem match
e esse efeito deve ficar bem menos perceptível.

Todas as correções desta sessão inteira (14 continuações) testadas com
dado real (curl direto nas functions, scripts Node com a lógica
extraída do arquivo real) antes de publicar — não só teoria. **Ainda
não confirmado pela Priscila que está tudo certo agora.**

## Sessão 24/07/2026 (continuação 15) — "Mostrando 54 de 909" mentindo + revertido escopo global
Priscila reportou "Mostrando 54 de 909 produtos" no topo, mas contou só
16 cards de verdade na tela depois de clicar em ordenar.

**Causa raiz**: efeito colateral direto da minha correção da continuação
12 (estender "esconder card sem preço" pra TODAS as categorias, não só
Perfumaria). Skincare/Maquiagem/Cabelo têm catálogo de 900+ produtos,
boa parte marca de farmácia que nenhuma loja parceira vende — então
dezenas de cards sumiam aos poucos (cada um removido assim que a
comparação dele terminava, de forma assíncrona), mas o texto "Mostrando
X de Y" só era escrito UMA VEZ no carregamento inicial e nunca
atualizado — ficava mostrando um número bem maior que a realidade.

**Corrigido em duas partes**:
1. **Revertido o escopo pra só Perfumaria** (`var sourcesTotal = (region==='BR'
   && cat==='perfumaria') ? 5 : 0`) — catálogo pequeno e curado (~60
   produtos), o mesmo problema de escala não se repete lá. Skincare/
   Maquiagem/Cabelo voltam ao comportamento de sempre (Amazon como
   opção garantida quando não acha comparação) — o mesmo que ela já
   tinha confirmado estar bem antes de eu mexer nisso.
2. **Contador corrigido pra nunca mais mentir**, mesmo em Perfumaria:
   toda vez que um card é removido por falta de preço, os textos
   "Mostrando X de Y" (cabeçalho E botão "ver mais") são recalculados a
   partir da contagem REAL de cards ainda na grade (`querySelectorAll`),
   em vez de deixar o texto antigo intacto. Testado com script Node a
   lógica do regex de substituição contra os formatos reais de texto
   usados no site — confirma que só o número certo é trocado, resto
   preservado.

Sintaxe validada, publicado. **Ainda não confirmado pela Priscila.**

## Sessão 26/07/2026 — "Ver mais" recriava a página inteira, perdendo os preços já carregados
Priscila buscou "sombras de olhos" em Maquilhagem: 6 cards apareceram
com preço real (Vult/Eudora via AMOBELEZA), clicou "Ver mais" e os
primeiros sumiram — sobrou só card novo sem preço (Maybelline/NYX só
com Amazon) e cards repetidos com a foto ilustrativa. Pediu
explicitamente: "Ver mais" tem que continuar os que já estão e só
colocar novos, nunca recriar.

**Causa raiz confirmada lendo o código**: `renderProdsPage()` (página
Comparar) e `renderAmzPage()` (resultados do quiz) faziam
`g.innerHTML = shown.map(...)` toda vez — inclusive ao clicar "Ver
mais" — recriando TODOS os cards do zero (não só os novos). Isso
destruía o DOM dos cards já comparados, forçando cada um (mesmo os que
já tinham preço real) a refazer a busca de preço do zero, e durante
esse intervalo mostravam Amazon/foto ilustrativa como se fossem
produto novo sem comparação.

**Corrigido nas duas funções** (mesmo padrão): só a primeira renderização
(`prodPage<=1`/`amzPage<=1`) recria tudo; "Ver mais" agora só acrescenta
os itens NOVOS no final via `insertAdjacentHTML('beforeend', ...)`,
nunca mexendo nos cards que já estavam na tela. Rastreio de quantos
itens já foram renderizados usa uma variável dedicada
(`prodRenderedIdx`/`amzRenderedIdx`), não a contagem de cards na tela —
importante porque na Perfumaria um card pode ter sido removido por
falta de preço (correção de sessão anterior), e contar pela tela nesse
caso duplicaria item ao clicar "Ver mais" de novo. Testado com
simulação em Node (3 cliques seguidos de "ver mais") — cada clique
acrescenta exatamente os itens novos, sem repetir nem pular nenhum.

Sintaxe validada, publicado. **Ainda não confirmado pela Priscila** —
ela fechou a aba antes de eu terminar; correção já está no ar pra
quando ela testar de novo.

## Sessão 27/07/2026 — filtro de categoria (pílulas) não excluía produto de outra categoria
Priscila buscou "hidratante pele oleosa" (busca geral) e clicou nas
pílulas de categoria (Maquilhagem, Cabelo, Perfumaria) pra filtrar —
Maquilhagem e Cabelo continuavam mostrando os mesmos produtos de
skincare/corpo (leite hidratante, sabonete, creme de barbear), só
Perfumaria filtrava certo (0 produtos, correto pra essa busca).

**Causa raiz confirmada testando a função real com os títulos exatos do
print dela**: `SKINCARE_ONLY_NOUNS`/`HAIR_ONLY_NOUNS` só reconheciam
frases compostas EXATAS ("hidratante facial", "máscara capilar") — e
produto de verdade quase nunca escreve assim: "Leite Hidratante Rosto e
Corpo", "Fluído Hidratante Relaxante", "Creme de Barbear Hidratante",
"Máscara Ultra Hidratante...Cabelo" — nenhuma dessas bate a frase exata,
então passavam pelos filtros de Maquilhagem/Cabelo sem serem
rejeitadas.

**Corrigido**: as duas listas ganharam os padrões reais mais comuns —
`SKINCARE_ONLY_NOUNS` ganhou `sabonete` (solto), `leite/fluido/creme/
loção hidratante`, `barbear`, `desodorante`; `HAIR_ONLY_NOUNS` ganhou
`cabelo` (solto). Cuidado tomado pra não reintroduzir o problema oposto
(rejeitar "Batom Hidratante" de Maquiagem por engano) — por isso não
usei "hidratante" solto, só os padrões compostos reais. Testado com
script Node contra os 6 exemplos exatos do print dela (todos agora
corretamente excluídos) E contra 5 casos que precisavam continuar
passando (batom hidratante, paleta de sombras, shampoo, desodorante
colônia em perfumaria, creme hidratante facial em skincare — todos
continuam certos).

**Sobre "não apareceu nada da WePink"**: não é bug — a WePink só vende
maquiagem de lábios (linha Welips), não vende hidratante/creme facial
nenhum, então é esperado ela não aparecer numa busca de "hidratante
pele oleosa".

Sintaxe validada, publicado. **Confirmado pela Priscila em sessão
seguinte** (ver 28/07/2026 abaixo).

## Sessão 27-28/07/2026 — quiz sem comparação quando etapa de produto específico é pulada
Continuação da sessão anterior. Investigado por que o quiz (categoria
Maquilhagem, pele normal, orçamento "Todos") mostrava 12 cards com só 2
tendo comparação real — o resto só Amazon.

**Causa raiz confirmada lendo o código**: o botão "Avançar" do quiz
(`qNext()`) nunca exigiu nenhuma seleção — dá pra pular a etapa "que
produto específico" (passo 4/5) sem escolher nada. Quando isso acontece,
`qD.maq_prod`/`hair_prod`/`skin_prod` ficam vazios, `quizSearchTerms()`
retorna lista vazia, e `renderLiveQuizResults()` simplesmente não faz
NENHUMA busca ao vivo nas lojas parceiras — mesmo havendo produto real
disponível (confirmado testando `awin-search?query=maquiagem` ao vivo:
retorna produtos reais da Natura/Boticário/AMOBELEZA).

**Corrigido**: `quizSearchTerms()` (`index.html`) agora cai em termos
genéricos por categoria quando nada foi escolhido (`['batom','base']`
maquiagem, `['shampoo','condicionador']` cabelo, `['hidratante','protetor
solar']` skincare/todos) — também corrige o caso `cat==='todos'`, que
antes nunca era coberto porque a checagem original comparava só contra
`qD.cat==='skincare'` literal. Testado com curl direto nas functions
antes de publicar (termos genéricos confirmados trazendo produto real).
Commit `e061860`.

## Sessão 28/07/2026 — varredura completa do site (auditoria a pedido da Priscila)
Priscila, muito frustrada com o volume de bugs aparecendo um de cada vez
ao longo de uma sessão já muito longa, pediu uma varredura COMPLETA e
minuciosa em cada botão/card/função do site, autorizando de antemão
qualquer correção encontrada. Rodei isso como um agente em segundo
plano (fork), testando cada function em produção com `curl` e scripts
Node com a lógica real extraída do arquivo, cruzando com todo o
histórico de bugs já documentado neste arquivo.

**O processo travou uma vez** (600s sem progresso, watchdog não
recuperou) no meio de uma correção — resumido de onde parou com
instrução pra fechar mais rápido. Terminou e entregou relatório
completo, commit `8c41da6` (local, revisado antes de eu publicar):

1. **Americanas perdia quase todo produto de cabelo**: ela trata
   "Cabelos" como departamento PRÓPRIO, separado de "Beleza e
   perfumaria" — o filtro de categoria (`americanas-search.mjs`) só
   aceitava o segundo, então shampoo/condicionador/leave-in caíam de
   ~80 produtos reais pra 1. Corrigido: allowlist aceita os dois
   departamentos-raiz agora.
2. **Lojas Rede bloqueada por Cloudflare**: a API dela (integrada há
   poucos dias) passou a devolver challenge JS (403, "Just a
   moment...") — mudança do lado deles, não bug nosso, mas fazia toda
   busca do site esperar ~8s à toa por uma fonte que nunca mais
   responde com produto real. **Desativada** por flag
   (`LOJASREDE_ENABLED=false`, `index.html`), mesmo padrão reversível
   de Eudora/Época/Scrappa/Mercado Livre.
3. **6 códigos de produto do quiz sem termo de busca configurado**
   (`base_liq`, `base_po`, `agua_mic`, `mascara_f`, `creme_olhos`,
   `serum_cap`) caíam num fallback genérico que às vezes batia produto
   errado por coincidência de letras — `SUB_KEYWORDS` ganhou as 6
   chaves reais. "Rímel" também trocado de posição (usava a palavra
   errada como termo, 0 resultado real; "máscara de cílios" funciona).
4. **Falso conflito de categoria em "sérum"**: a palavra solta
   "sérum"/"serum" em `SKINCARE_ONLY_NOUNS` rejeitava produto real de
   Cabelo (Sérum Capilar Vichy/Kérastase) e de Maquiagem (sérum de
   cílios) — mesmo tipo de problema já resolvido antes pra
   "hidratante", mas não replicado aqui. Corrigido pra frase composta
   ("sérum facial"/"soro facial").

Testado ao vivo depois do push: `americanas-search?query=shampoo`
voltou a trazer produto real de cabelo. **Confirmado pela Priscila.**

## Sessão 28/07/2026 (continuação) — vazamento de categoria confirmado ao vivo no navegador
Mesmo dia, a Priscila mandou prints mostrando "Hidratante Labial"
(balm de lábio, maquiagem) e óleo corporal/máscara capilar aparecendo
dentro dos filtros de Maquilhagem E Cabelo ao mesmo tempo — nenhum dos
dois certo. Desta vez usei acesso real ao navegador (extensão "Claude
in Chrome", conectada nesta sessão) pra reproduzir de verdade em vez de
só ler código: busquei "hidratante" na página Comparar e confirmei
"Hidratante Labial Carmed..." aparecendo dentro do filtro Cabelo.

**Causa raiz**: `conflictsWithCategory()` funciona por lista de
exclusão (rejeita se o título contém palavra exclusiva de OUTRA
categoria) — um produto cuja categoria real não aparece literalmente no
título (ex: "labial" nunca listado, "Óleo Corporal Hidratante" com a
ordem das palavras invertida em relação à frase já cadastrada) passa
batido em QUALQUER categoria, já que nada o exclui. **Corrigido**:
`MAKEUP_ONLY_NOUNS` ganhou `labial`/`lip balm`/`lip gloss`;
`SKINCARE_ONLY_NOUNS` ganhou a ordem invertida ("corporal hidratante")
e variantes de óleo/loção/creme corporal; `HAIR_ONLY_NOUNS` ganhou
"raiz oleosa"/"pontas secas" (vocabulário real de cabelo sem dizer
"capilar"). Testado com script Node contra os títulos reais que
vazaram, e reconfirmado ao vivo no navegador depois do push (Cabelo:
"14 de 14" produtos, todos de cabelo de verdade). Commit `63dbd04`.

**Segundo bug achado no mesmo teste**: contador "Mostrando X de Y
produtos" mostrando **mais que o total** (ex: "130 de 54" em
Perfumaria) — o recálculo do contador (mecanismo de esconder card sem
preço, só Perfumaria) usava `querySelectorAll('.cpc')` pra saber quantos
cards restavam, mas os cards de resultado AO VIVO (`liveResultCard`)
usam a MESMA classe `.cpc`, sem nenhuma relação com o total do
catálogo. Corrigido: cards do catálogo (`amzCard`) ganharam uma classe
própria (`cpc-catalog`), recálculo restrito a ela. Reconfirmado ao vivo
("16 de 54", nunca mais que o total). Commit `14f236d`.

**Terceiro bug investigado**: por que, depois de uma certa quantidade
de cards, só aparece Amazon (ex: leave-in de Aussie/Skala/Tresemmé).
Confirmado com curl que essas marcas EXISTEM de verdade na Americanas —
o problema é que buscar pelo NOME COMPLETO do catálogo (ex: "Aussie
Leave-in 3 Minutos Milagrosos") às vezes confunde a busca por relevância
da própria loja, que prioriza outro produto batendo mais palavras (ex:
um condicionador Pantene que também se chama "3 Minutos Milagrosos") e
o item real da marca pesquisada nem aparece nos resultados retornados.
**Corrigido**: `loadComparison()` (`index.html`) tenta uma segunda busca
— só quando a primeira não achou nada em nenhuma das 5 fontes — com um
termo mais simples (marca + tipo genérico do produto, sem a parte
específica do nome). O filtro de marca+tipo (D3) continua exatamente
igual, só muda o texto de busca, sem risco de aceitar produto errado.
Não é garantia universal (testado também com Skala, que não melhorou —
depende de como cada loja indexa o produto), mas nunca piora nada, só
tenta mais uma vez quando a primeira busca já tinha falhado. Confirmado
ao vivo no navegador: card da Aussie passou a mostrar 🏆 Americanas
R$39,90 depois da correção. Commit `684ef59`.

**Loja desativada nesta sessão**: Lojas Rede (`LOJASREDE_ENABLED=false`,
motivo no item 2 da auditoria acima) — bloqueio anti-bot do lado deles.

## Sessão 28-30/07/2026 — nova identidade visual: paleta rosa-framboesa
Priscila mostrou o site da WePink (rosa vibrante, "chamativo") e
perguntou se dava pra deixar o VERAORIS mais parecido — avisando de
início que era só ideia, sem mudar nada ainda. Discutido o trade-off:
visual atual (coral/ferrugem + serifa Cormorant Garamond) passa
"comparador premium confiável"; o rosa puro da WePink é mais "loja
jovem direto ao consumidor" e podia destoar do posicionamento que ela
vem construindo.

**Processo em duas etapas de artefato, ambas aprovadas por ela antes de
mexer no site de verdade**:
1. Um moodboard (paleta + títulos lado a lado "hoje vs proposta") com
   uma ideia de meio-termo: rosa-framboesa mais vibrante que o coral
   atual, mas mais fechado que o rosa puro da WePink — dourado do selo
   "melhor preço" mantido intocado, serifa itálica nos títulos mantida.
   Ela gostou ("tem razão, o da WePink é muito jovem").
2. A pedido dela ("como realmente vai ficar"), um SEGUNDO artefato bem
   mais fiel — mesmo HTML/CSS real do site (nav, hero com a MESMA foto
   real do hero extraída do `index.html`, categorias, seção "Compare
   Aqui", card de produto real), com um botão pra alternar ao vivo entre
   "Hoje"/"Proposta" na mesma tela. Ela pediu pra manter a foto de fundo
   do hero (a primeira versão tinha só o degradê, sem a foto) — corrigido
   extraindo o JPEG base64 real do hero direto do arquivo (sem nunca
   passar o base64 gigante pela conversa, só manipulação via script) e
   embutindo no artefato. Aprovada: "é isso, gostei mais assim".

**Aplicado de verdade no site** (`index.html`) depois da aprovação:
troca sistemática de todos os hex/rgba da família coral/ferrugem antiga
(`--gold` #E8907A→#E6407D, `--gold5` #9A4835→#A31256, `--gold2`
#F0AA90→#F0629D, `--gold3` #FFD5C5→#FFCFE0, `--gold4` #FFF0EC→#FFF0F5,
`--border` #F0C8BC→#F5B8D2, `--muted` #6A5A40→#7A5568, mais
`#B05C42`/`#C97A5F`/`#D4908A` e os `rgba(232,144,122,·)`/
`rgba(154,72,53,·)`/`rgba(200,146,42,·)` usados soltos em vários
lugares) por uma família rosa-framboesa, feito com script Node (mapa
old→new, substituição num único passe pra nunca haver colisão entre
regras) — só depois conferido manualmente por 2 ocorrências que ficaram
de fora do bloco `<style>` (cor do rodapé, cor da função de estrelas).
Também recoloridos os gradientes de fundo mais claros usados em várias
seções (topo da página, "Compare Aqui", benefícios, rodapé, promoções,
"Dica da Semana"). **Mantido de propósito, sem mexer**: `--night`
(azul-marinho), verde semântico de "melhor preço" (`--ok`/`--okbg`),
vermelho semântico do selo de desconto (`#E63946`), blobs decorativos
de fundo, e a cor própria de cada card de categoria (Skincare
dourado-creme, Maquilhagem lavanda, Cabelo verde, Perfumaria dourado) —
nenhuma dessas faz parte da identidade principal.

Testado localmente antes de publicar: um servidor estático Node
temporário + navegador real (Claude in Chrome), conferindo hero, "Dica
da Semana", promoções, "Compare Aqui", categorias e a página Comparar
com cards reais. Sintaxe (`node --check` equivalente nos blocos
`<script>`) validada. Commit `b056569`, publicado e **confirmado ao
vivo em produção**.

**Continuação no mesmo dia**: Priscila pediu pra recolorir também a
logo (o beija-flor + "VERAORIS", uma imagem estática, não CSS) e o
texto do menu de navegação, que tinham ficado pra trás (ainda no tom
antigo). Texto do menu (`.nav-links a`) trocado de `var(--muted)` pra
`var(--gold5)` (mesma família rosa). A logo (imagem JPEG/PNG
embutida, não dá pra recolorir editando CSS de cor de texto) ganhou um
filtro CSS `filter:hue-rotate(321deg) saturate(1.25)` — calculado a
partir do matiz da cor antiga (~11°, ferrugem) pro matiz da cor nova
(~332°, rosa-framboesa), aplicado tanto no logo do menu quanto no do
rodapé. Testado visualmente antes de publicar (zoom no navegador
confirmando o tom batendo com o resto da paleta). Commit `10ec669`,
**confirmado ao vivo em produção** (print da Priscila + reconferência
minha depois do push).

**Nota**: durante esta sessão houve um incidente real do lado da
Anthropic ("Elevated errors across all models", investigando, sem
relação com o site) que assustou a Priscila achando que algo tinha
quebrado — confirmado via `status.claude.com` e esclarecido; nada
relacionado ao VERAORIS.

## Sessão 01-03/08/2026 — cinco lojas novas (mesmo padrão VTEX de graça)
Priscila pediu pra aumentar quantidade de lojas/produtos mesmo sem
comissão de afiliado, porque cobertura importa mais que monetização pra
poder lançar o site (feito numa sessão que não passou por aqui — commits
diretos dela, documentando agora). Cinco lojas novas via chamada direta
na API pública VTEX (mesmo padrão de graça de Época/WePink/Americanas,
sem Apify, sem custo, sem afiliado):
- **Mahogany** — marca própria (perfumaria, corpo e banho, cabelo).
- **Lojas Pompéia** — loja de departamento (Vult, Payot, Eudora, Siage).
- **Extrafarma** — farmácia, catálogo enorme (2700+ pra "hidratante").
- **Drogaria Venâncio** — farmácia, catálogo grande.
- **Drogal** — farmácia, catálogo grande.

As três farmácias (Extrafarma/Venâncio/Drogal) finalmente trazem marca
de farmácia (CeraVe etc.) que nenhuma outra loja parceira vendia até
então. Commit `636b9ee`.

**Correção seguinte** (`e653f64`, mesma leva): testado ao vivo depois de
publicar, a Drogal e a Venâncio espalham beleza em categorias separadas
por tipo de produto (maquiagem em `/Beleza/`, mas hidratante/protetor
solar/shampoo em raízes diferentes: "Cuidados com a Pele", "Cuidados
com o Cabelo", "Higiene e Cuidados Pessoais") — diferente de Americanas/
Lojas Pompéia/Extrafarma, que usam um guarda-chuva só. Com o filtro
antigo (só aceitava `/Beleza/`), busca de hidratante/shampoo voltava
vazia nas duas. Corrigido ampliando a lista de categorias aceitas em
cada uma — cuidado extra na Venâncio pra não aceitar a raiz "Higiene e
Cuidados Pessoais" inteira (ela também contém "Higiene Oral", escova de
dente), só as subcategorias reais de beleza dentro dela.

## Sessão 04/08/2026 — Drogal e Venâncio devolviam zero resultado (bug real, corrigido)
Ao retomar a sessão, encontrei mudança pronta mas nunca commitada: os
arquivos `drogal-search.mjs` e `venancio-search.mjs`, do jeito que
tinham sido publicados no commit `e653f64` acima, usavam
`CACHE_TTL_MS`, `FETCH_TIMEOUT_MS` e `API_URL` dentro de `fetchFeed()`
sem NUNCA declarar essas constantes — `ReferenceError` em toda chamada,
capturado em silêncio pelo try/catch do handler (devolvia
`{results:[], error:"...is not defined"}` sem quebrar o site, só sem
trazer produto nenhum). As duas lojas ficaram invisíveis nos resultados
desde que esse commit foi ao ar, mesmo aparecendo "funcionando" (sem
erro visível pra quem usa o site).

A correção (as 3 constantes declaradas no topo de cada arquivo) já
estava escrita localmente, só não tinha sido commitada nem enviada —
finalizado: sintaxe validada (`node --check`), commit `f319ec4`,
publicado. **Confirmado ao vivo em produção** (`WebFetch` direto nas
duas functions, com parâmetro extra pra furar o cache de 15min do
WebFetch): Drogal devolveu 20 resultados reais pra "hidratante" (ex.
Sérum Hidratante Corporal Dove), Venâncio devolveu 15, nenhuma com erro.

## Sessão 04-05/08/2026 — testar Eudora (adiado) + oito lojas novas via VTEX
Pedido de testar se a Awin corrigiu o link da Eudora (ver pendência
acima): direto (WebFetch) continua batendo 403 — mesmo bloqueio
anti-bot de sempre contra acesso tipo servidor. Usei a extensão "Claude
in Chrome" (navegador real conectado) pra confirmar: o SITE da Eudora
funciona perfeitamente pra busca e produto normal (testado ao vivo,
sem "produto não encontrado"). Mas o bug real documentado é
especificamente o link de AFILIADO da Awin (`aw_deep_link`), que só
existe dentro do feed — e a variável `AWIN_EUDORA_FEED_URL` foi apagada
do Netlify em sessão anterior (crise do limite de 4KB, já resolvida).
Sem o feed não dá pra testar o link de afiliado de verdade. **Priscila
decidiu adiar pra outra sessão** — precisa gerar feed novo da Eudora na
Awin (ou passar URL de feed salvo) antes de eu conseguir testar de
verdade.

**Resto da sessão: "continua procurando mais lojas"** (pedido dela).
Mesmo processo de sempre — testar API pública VTEX (`/api/catalog_
system/pub/products/search`) via `WebFetch`, confirmar com termo neutro
("hidratante") E termo de risco de contaminação ("batom", pra achar
categoria errada tipo brinquedo/infantil), só then implementar. Oito
lojas novas confirmadas e publicadas nesta sessão (todas farmácia,
exceto Payot):

1. **Pague Menos** — guarda-chuva único `/Dermo e Beleza/`, marca
   própria Dauf. Commit `7580970`.
2. **Drogaria Catarinense** — guarda-chuva único `/Beleza e Proteção/`,
   multimarca de verdade (Neutrogena, Payot, Eudora, Vult testados ao
   vivo). Commit `7580970`.
3. **Farmácias São João** — 3 raízes separadas (`/Beleza E Cuidados
   Pessoais/`, `/Maquiagem/`, `/Cabelos/`); achada contaminação real
   (batom de brinquedo em `/Casa E Utilidades/Brinquedos/`) excluída
   por não entrar na lista. Commit `7580970`.
4. **Drogaria Rosário** — 3 raízes separadas (`/Dermocosméticos/`,
   `/Maquiagem/`, `/Cuidados Com Os Cabelos/`); traz Cetaphil real.
   Bastante produto infantil Pampers excluído (raiz `/Infantil/` fora
   da lista). Commit `7580970`.
5. **Payot** — marca própria (loja oficial `lojapayot.com.br`), sem
   filtro de categoria (mesmo tratamento de Mahogany/WePink). Commit
   `7580970`.
6. **Farmácia Preço Popular** (Grupo Clamed) — 2 raízes (`/Beleza e
   Proteção/`, `/Dermocosméticos/`); hidratante infantil Johnson Baby
   excluído (raiz `/Mamãe e Bebê/` fora da lista). Commit `cfcbc01`.
7. **Drogaria Globo** (Grupo Jorge Batista) — 2 raízes
   (`/Dermocosméticos/`, `/Higiene & Beleza/` — essa segunda já cobre
   maquiagem também, confirmado testando "batom"); traz Bepantol,
   Fisiogel, CeraVe reais. Gel de saúde sexual excluído (raiz `/Saúde/`
   fora da lista). Commit `7d590a2`.
8. **Farmácia Indiana** — 2 raízes (`/Beleza/`, `/Higiene Pessoal/`);
   traz Vult/Ruby Rose (marca já vendida por outras parceiras) e
   sabonete/hidratante labial. Testado com "fralda" pra confirmar que
   produto infantil fica em raiz separada (`/Mamãe e Bebê/`), não vaza
   pra `/Higiene Pessoal/`. Commit `7d590a2`.

**Testada e descartada**: Ikesaki (loja multimarca de maquiagem,
`ikesaki.com.br`) — API responde 429 (limite de requisição) de forma
persistente mesmo em chamada isolada, mesmo padrão que já tirou a
Lojas Rede do site (`LOJASREDE_ENABLED=false`) antes. Não implementada
por risco de instabilidade.

**Testadas e bloqueadas (403, proteção anti-bot)**: Panvel, Drogaria
São Paulo, Onofre, Drogaria Araújo, Droga Raia, Drogasil (grupo RD),
Extra.com.br. **Sem VTEX confirmado nesse caminho**: Nissei (erro de
certificado SSL), Ultrafarma, Sallve (é Shopify, não VTEX), Dailus,
Contém1g, Ruby Rose (própria, 404 no caminho testado).

Todas as 8 lojas novas seguem o mesmo padrão de código (function
`.mjs` com `CACHE_TTL_MS`/`FETCH_TIMEOUT_MS`/`API_URL` declarados no
topo — atenção redobrada aqui depois do bug do início da sessão) e
foram conectadas em TODOS os pontos do `index.html` que precisam
(`liveMultiSourceSearch`, filtro D3 marca+tipo, troca de foto,
fallback de busca simplificada, complemento não-bloqueante em
`loadComparison`, `sourcesTotal`/`sourcesDone` da Perfumaria) — cada
edição conferida com grep antes de dar como concluída, pra não repetir
o esquecimento de "fonte nova só ligada em um lugar" que já aconteceu
antes nesta sessão longa do projeto. Sintaxe validada (`node --check`
em cada function + `<script>` inteiro do `index.html` via `new
Function()`) antes de cada push. Todas as 8 confirmadas ao vivo em
produção depois do deploy (`WebFetch` com parâmetro `cb=` pra furar o
cache de 15min do próprio WebFetch, que causou confusão nesta sessão
até eu perceber e contornar).

**Contagem de lojas parceiras BR depois desta sessão**: 18 fontes ao
vivo no total (Awin: L'Occitane/Natura/Forever Liss/Boticário + API
direta: Americanas/Época[desligada]/WePink/Lojas Rede[desligada]/
Mahogany/Pompéia/Extrafarma/Venâncio/Drogal/Pague Menos/Catarinense/
São João/Rosário/Payot/Preço Popular/Globo/Indiana). Eudora continua
desligada (`EUDORA_ENABLED=false`), aguardando teste de amanhã.

## Sessão 05/08/2026 — auditoria minuciosa pedida pela Priscila ("testa e revisa tudo")
Priscila pediu uma revisão completa do site inteiro (não só as mudanças
do dia) pra confirmar que estava tudo funcionando. Rodada como fork em
segundo plano, cobrindo: as 18 fontes ao vivo (com termo de risco de
contaminação testado em cada farmácia multi-raiz), fiação completa de
cada fonte em todos os pontos do `index.html` (grep sistemático —
tudo certo, nenhuma fonte esquecida em nenhum lugar desta vez),
sintaxe de todas as functions + `<script>` inteiro, e teste real no
navegador (extensão "Claude in Chrome") em busca de produto, troca de
categoria, ordenação, "Ver mais" e quiz completo. Eudora não foi
tocada (decisão de deixar pra outra sessão, respeitada).

**Dois bugs reais encontrados e corrigidos, ambos achados só ao vivo no
navegador (não apareciam numa leitura estática do código)**:

1. **Hidratante corporal/facial vazando pro filtro de Maquilhagem e
   Cabelo.** Buscando "hidratante" e filtrando por Maquilhagem,
   apareciam loções corporais reais (Monange, Paixão da Drogaria
   Globo) e depois, numa segunda passada de teste, também sérum
   facial, gel facial, bastão facial, creme de mãos, óleo de banho e
   até um produto de higiene íntima — tudo skincare de verdade, não
   maquiagem. Causa: as frases de exclusão (`SKINCARE_ONLY_NOUNS`)
   assumiam sempre a ordem "[tipo] hidratante" (ex: "loção
   hidratante"), mas nome real de produto varia muito ("Hidratante
   Monange", "Gel Facial Hidratante", "Sérum Hidratante" sem dizer
   "facial", "Creme Vodol Hidratante"). Corrigido com
   `isGenericHidratante()` (nova função, `index.html`): título conta
   como conflito de Maquilhagem/Cabelo quando tem "hidratante" +
   ("começa a frase" OU "facial" OU "sérum/soro" OU "creme"), EXCETO
   se também tiver palavra de maquiagem (labial, primer — "primer"
   adicionado à lista) ou de cabelo (capilar) junto — essa exceção é
   o que protege "Batom Hidratante", "Hidratante Labial", "Primer
   Facial Hidratante" e "Sérum Hidratante Capilar" de serem excluídos
   por engano. "mãos"/"óleo de banho"/"íntimo"/"vulvar" também
   entraram direto em `SKINCARE_ONLY_NOUNS` (sem ambiguidade
   possível com as outras categorias). 21 casos de teste rodados
   direto contra a lógica extraída do arquivo real antes de publicar
   (positivos e negativos), todos passando. Dois commits (`e5d5de8`,
   `593e9ec`) — o segundo ampliando o primeiro depois de achar mais
   variações no mesmo teste ao vivo.

2. **Pílulas de categoria da página de resultados do quiz sem
   nenhum efeito.** Clicar Skincare/Maquilhagem/Cabelo/Perfumaria na
   tela final do quiz não mudava nada na tela — a grade de resultados
   continuava mostrando tudo. Causa: essas pílulas (`id="resCatF"`)
   usavam a mesma `filterCat()`/`renderCats()` da página Comparar, que
   só mexe na variável global `cat` e só re-renderiza o grid escondido
   `productGrid` — a grade visível do quiz (`resultsGrid`) é filtrada
   por uma variável diferente (`qD.cat`) e nunca era tocada pelo
   clique. Bug antigo, não é regressão de hoje — bem provável que
   ninguém tivesse reparado porque parece que "só não filtra bem" em
   vez de "não faz nada". Corrigido (`index.html`): `filterCat()`
   agora detecta `cid==='resCatF'` e, nesse caso, atualiza `qD.cat`
   (convertendo o sentinela `'todas'` da pílula pro `'todos'` que o
   resto do código do quiz já esperava) e chama `renderAmazonResults()`
   de verdade; `renderCats()` passou a destacar a pílula ativa lendo
   `qD.cat` quando for esse grid, em vez de sempre ler `cat`. Testado
   ao vivo depois do deploy: clicar "Maquilhagem" mudou a contagem de
   443→548 cards (produtos diferentes de verdade) e não sobrou nenhum
   hidratante/sérum solto; clicar "Todas" voltou a mostrar tudo (508
   cards, sentinela convertido certo nos dois sentidos). Commit
   `86cf3fb`.

**Testado e confirmado OK, sem mudança de código necessária**: as 18
fontes ao vivo (todas responderam produto real, farmácias multi-raiz
sem contaminação de categoria nos termos reais do site); fiação de
cada fonte em `liveMultiSourceSearch`/filtro D3/troca de
foto/fallback/`loadComparison`/contadores da Perfumaria (grep em cada
uma das 18, tudo presente em todos os pontos); sintaxe de todas as
functions e do `<script>` inteiro; ordenação por preço (não some
card, reordena de verdade); "Ver mais" (acrescenta sem duplicar);
quiz completo até resultados com fallback genérico (433 de 444 cards
com comparação real, não só Amazon). Época e Lojas Rede continuam
corretamente desligadas (flag do lado cliente — a function em si
ainda responde se chamada direto, comportamento esperado, não bug).

**Achado mencionado mas não corrigido (baixo risco, não confirmado em
produto real)**: em teste isolado, "Creme Hidratante para Cabelos
Cacheados" (hipotético) seria rejeitado do filtro de Cabelo porque a
frase antiga `'creme hidratante'` (já existia em `SKINCARE_ONLY_NOUNS`
antes desta sessão) bate primeiro, antes da guarda de `isHairSignal`
entrar em ação — mesma categoria de limitação que o site já aceita há
várias sessões (frase composta cobre a maioria dos casos reais, não
todos). Não fica pra trás sozinho: se aparecer com produto real, é
achar a frase exata e ajustar a guarda.

## Sessão 05/08/2026 — pedido de revisão minuciosa completa + 2 bugs reais de vazamento de categoria
Priscila pediu auditoria completa do site ("testa e revisa tudo,
minuciosamente"). Rodei como agente em segundo plano (fork), mesmo
processo de sessões anteriores — testou as 18 fontes ao vivo (todas
OK, sem contaminação de categoria nos termos testados), conferiu a
fiação de cada fonte em todos os pontos do `index.html` (nenhuma
esquecida), validou sintaxe de tudo, e achou + corrigiu 2 bugs reais
navegando de verdade no site: (1) hidratante corporal/facial vazando
pro filtro de Maquilhagem/Cabelo (`e5d5de8`, `593e9ec`); (2) pílulas de
categoria da página de resultados do quiz sem nenhum efeito, bug antigo
não relacionado a hoje (`86cf3fb`). Documentado em `41e77de`.

**Logo depois, a própria Priscila achou um bug real que a auditoria não
pegou** (print de tela): buscar "hidratante pele oleosa" na busca
geral, filtrar por Skincare e ordenar por Maior preço mostrava perfume
(Drogaria Venâncio: "Devotion...Dolce & Gabbana Parfum Masculino",
"Versace Man Eau Fraiche" etc.) misturado nos resultados de Skincare.

**1ª causa encontrada e corrigida**: `PERFUME_ONLY_NOUNS`
(`index.html`) só reconhecia grafia portuguesa ("perfume", "colônia")
— títulos com grafia francesa/inglesa ("Parfum Masculino", "Eau
Fraiche", "Extrait De Parfum") não batiam nenhuma palavra da lista,
então `conflictsWithCategory('skincare', titulo)` não detectava o
conflito. Adicionado `'parfum'`/`'eau fraiche'` à lista. Testado com
os 4 títulos exatos do print antes de publicar (`b36b131`).

**2ª causa, mais profunda, encontrada testando de novo no navegador**:
mesmo com a correção acima, "Cool Water De Zino Davidoff Masculino"
(Drogaria Venâncio) continuava vazando — esse título não tem NENHUMA
palavra de perfume, só o nome da fragrância + gênero. Não tem como um
filtro de texto pegar isso por mais completa que a lista fique.
Investigado direto na API da Venâncio: a própria loja já classifica
esse produto certinho (`/Beleza/Fragrâncias/Perfume/`) — a informação
correta sempre existiu, só nunca foi repassada pro site, que ficava
adivinhando pelo título sozinho.

**Correção de raiz** (`a11cc8f`): as 12 functions VTEX de farmácia/loja
geral (Drogal, Venâncio, São João, Rosário, Pague Menos, Catarinense,
Preço Popular, Globo, Indiana, Extrafarma, Americanas, Lojas Pompéia)
ganharam `guessSubcat(categories)` — deriva skincare/maquiagem/cabelo/
perfumaria do campo `categories` real da API (que essas functions já
recebem, só usavam pra decidir "é produto de beleza?", nunca pra
subcategorizar) — e devolvem isso no campo `category` de cada
resultado. `conflictsWithCategory()` ganhou 3º parâmetro opcional
`structCat`: quando a fonte manda essa informação e ela diverge do
filtro ativo, rejeita na hora, sem depender de palavra nenhuma no
título. A categoria Perfumaria (lógica invertida — só aceita se
PROVAR que é perfume) também passou a aceitar a confirmação
estruturada como prova válida. Retrocompatível: fontes sem esse dado
(Awin, Mahogany/WePink/Payot — marca própria, sem terceiros) continuam
usando só o título, do jeito que já era.

4 pontos de chamada de `conflictsWithCategory` atualizados
(`finishRenderProds`, quiz, filtro D3 do comparador,
`preloadEudoraImage`). Testado com 6 casos via script Node (incluindo
os títulos exatos do print) antes de publicar — todos corretos.
**Confirmado ao vivo no navegador depois do deploy**: reproduzindo os
passos exatos da Priscila (busca → filtro Skincare → Maior preço),
zero perfume em toda a lista rolada (contador caiu de 216 pra 186
resultados de lojas parceiras — a correção estrutural pegou mais
vazamento do que só a correção de texto sozinha teria pego).

**Lição pra sessões futuras**: sempre que uma fonte VTEX nova for
adicionada, dar preferência a repassar o campo `categories` real da
API (via `guessSubcat`) em vez de só confiar em `conflictsWithCategory`
adivinhando pelo título — é estrutural, não depende de lista de
palavra nunca ficar completa.

## Sessão 06-07/08/2026 — continuação da revisão minuciosa: 2 bugs reais achados e corrigidos
Priscila pediu pra continuar testando o resto do site. Rodei em segundo
plano (fork), cobrindo o que a auditoria anterior e a correção do
perfume ainda não tinham testado: Maquilhagem+Maior preço, Cabelo+Maior
preço, Perfumaria (navegação direta)+Maior preço, "Mais vendidos" nas 4
categorias, quiz completo caminho Cabelo, painel admin, mobile.

**Testado e confirmado OK**: Maquilhagem+Maior preço e Cabelo+Maior
preço (nenhum produto fora do tema, rolando a lista inteira). "Mais
vendidos" funciona sem duplicar. Quiz completo caminho Cabelo (Oleoso →
Hidratação → Shampoo → sem alergia → Todos os orçamentos) chega na
página de resultados com comparação real (Seda/Skala/Pantene), resumo
das respostas bate certinho. Confirmado que Perfumaria não é opção do
quiz (decisão antiga, nada quebrado). Painel admin usa `prompt()`
nativo do navegador (atalho de teclado D-A-S-H) — não dá pra/não deve
testar via automação (dispara diálogo que trava o browser, contra a
política de segurança da ferramenta) e não tem "tela" custom pra
quebrar visualmente, então não é um risco de bug de UI. Mobile não
re-testado nesta sessão (`resize_window` não surtiu efeito na captura
de tela desta vez, provável limitação da ferramenta com múltiplas abas
abertas — já tinha sido corrigido e confirmado em sessão anterior).

**Bug real #1 — cards duplicados ao navegar direto por categoria**:
clicar em "Perfumaria" no menu (sem digitar nada) mostrava CADA produto
duas vezes e o contador "500 em lojas parceiras + 500 em lojas
parceiras + 18 de 54 produtos" (duplicado). Causa: `goCat(c){cat=c;
srch='';showPage('compare');renderCats('catFilters');renderProds();}`
chamava `renderCats`+`renderProds` no final, mas `showPage('compare')`
JÁ faz isso sozinha quando a página de destino é 'compare' — resultado:
toda a busca ao vivo (Awin/Americanas/etc.) disparava duas vezes em
paralelo. Bug reproduzido também num carregamento limpo, sem busca
prévia — não era específico de nenhuma sessão anterior de busca.
Corrigido removendo a chamada redundante (`goCat` agora só chama
`showPage('compare')`). Commit `643ad2f`.

**Bug real #2 — "Leite de Colônia" (loção/limpeza facial) aparecendo
como perfume em Perfumaria**: mesmo teste que achou o bug #1 revelou
produtos tipo "Leite Corporal Leite de Colônia" e "Tônico Facial...
Leite de Colônia" (marca usa "Colônia" no nome, mas não é perfume)
passando pelo filtro de Perfumaria — a palavra "colônia" no TÍTULO
bastava pra aceitar, mesmo a loja (Globo/São João/Preço Popular/
Americanas) já classificando esses produtos como skincare de verdade
("Cuidados com a pele"/"Rosto"/"Skincare"/"Desodorante"/"Higiene
Pessoal" na categoria real). `guessSubcat()` (as 12 functions VTEX)
ganhou detecção desses sinais de skincare, que agora desmentem o
falso-positivo de texto via `structCat` (mesmo mecanismo da correção
anterior, agora protegendo o sentido contrário: produto correto NÃO
vazar pra Perfumaria). Corrigido em duas rodadas — 1ª rodada
(`643ad2f`) ainda deixava passar 2 casos da Americanas porque a raiz de
categoria dela se chama literalmente **"Beleza e perfumaria"** pra
TUDO (não só perfume de verdade) — minha checagem de "perfum" rodando
primeiro batia nessa raiz genérica antes de checar os sinais mais
específicos. 2ª rodada (`625371c`) reordenou: maquiagem/cabelo/
skincare são checados ANTES do sinal de perfume. Confirmado que não
quebra "Deo Colônia" de verdade (perfume tradicional brasileiro,
categoria real é "/Perfumes e Colônias/", nunca tem palavra de
skincare/desodorante junto). Testado com 8 casos via script Node
(incluindo todos os achados ao vivo desta sessão + regressões dos
commits anteriores) antes de cada publicação.

Ambos os bugs testados e confirmados corrigidos ao vivo em produção
depois do deploy (contador não duplica mais, "Leite de Colônia" sumiu
da Perfumaria, só ficaram Deo Colônia/Body Splash/perfume de verdade).

## Sessão 06-07/08/2026 — mais uma rodada de revisão minuciosa
Priscila pediu pra continuar testando (3ª rodada de fork nesta mesma
onda de revisão). Escopo desta vez: consistência do código entre as 12
functions de farmácia, "Ver mais" combinado com filtro de categoria,
Perfumaria + Mais vendidos, páginas institucionais, busca sem
resultado.

**Testado e confirmado OK (sem mudança)**: as 12 functions de farmácia/
loja geral (Drogal, Venâncio, São João, Rosário, Pague Menos,
Catarinense, Preço Popular, Globo, Indiana, Extrafarma, Americanas,
Lojas Pompéia) têm `guessSubcat()` idêntica entre si — nenhuma ficou
desatualizada. Perfumaria + "Mais vendidos" (sem quebrar, só perfume
de verdade). Páginas "Como Funciona" e "Sobre" carregam normalmente.
Busca sem resultado nenhum (termo inventado) mostra a mensagem
"Nenhum produto encontrado" limpa, sem travar.

**Achado e corrigido (1 bug real)**: testando "Ver mais" com filtro de
categoria ativo, confirmado com `javascript_tool` contando elementos
`.cpc` de verdade no DOM (139 cards: 103 ao vivo + 36 catálogo, todos
ainda lá) que os CARDS nunca sumiam — só o TEXTO do contador é que
perdia o prefixo "X em lojas parceiras +" depois de clicar "Ver mais",
porque `renderProdsPage()` reescrevia `resultCount` do zero sem saber
desse número (que só existia como uma concatenação de uma vez só, feita
pela busca ao vivo original). Corrigido com uma variável nova
(`prodLiveCount`) que guarda o número e é reaplicada toda vez que o
contador é recalculado. Testado ao vivo depois do deploy: contador
manteve "142 em lojas parceiras + X de 217 produtos" corretamente
depois de 2 cliques em "Ver mais" seguidos (18→36→54). Commit
`4ed0ec6`.

**Não coberto nesta rodada** (falta de tempo, não é bug conhecido, só
não testado): quiz pelos caminhos Maquilhagem e Skincare (só o
caminho Cabelo foi testado, numa rodada anterior); cards de foto real
na secção de promoções da home.

## Sessão 06/08/2026 (continuação) — 4ª rodada: quiz Maquilhagem/Skincare + bug real no "Mais vendidos" do quiz
Fechando as duas pontas que ficaram pendentes da rodada anterior.

**Ferramenta de clique/screenshot instável nesta sessão** (extensão
"Claude in Chrome"): cliques simulados via `computer` não registravam
no site (confirmado comparando o estado real via JavaScript antes/
depois — nada mudava) e `screenshot` retornava erro técnico
("Failed to deserialize params.clip.scale"). Contornado testando via
`javascript_tool` chamando as mesmas funções que os botões chamam
(`startQuiz()`, `qSel()`, `qSelMulti()`, `qNext()`, `onSortChangeQuiz()`
etc. — confirmado lendo o atributo `onclick` de cada botão antes, pra
ter certeza de estar chamando exatamente o que o clique chamaria) —
continua sendo teste real do site, só não passou pela simulação de
mouse. Se esse problema de clique/screenshot aparecer nas próximas
sessões, vale investigar se é passageiro (extensão) ou reprodutível.

**Quiz — caminho Maquilhagem** (Pele Oleosa → Lábios → Batom → Todos):
resultado final com 271 cards reais, comparação de preço genuína entre
várias lojas (ex: Batom Vult com preço da Drogal, Drogaria Globo e
Amazon lado a lado). Ordenar por Maior preço: topo trazia só batom de
verdade (Lancôme L'Absolu Rouge), sem vazamento.

**Quiz — caminho Skincare** (Pele Seca → Hidratação → Hidratante →
Todos): 190 cards reais, hidratante corporal/facial de verdade (Le
Occitane, L'Occitane, Davines, O Boticário), sem vazamento nem no topo
ordenado por Maior preço.

**Bug real encontrado testando "Mais vendidos" no caminho Maquilhagem**:
clicar "Mais vendidos" na página de RESULTADOS DO QUIZ (diferente da
página Comparar) derrubava a contagem de 271 pra 6 cards, na hora,
sem nunca voltar. Causa: `onSortChangeQuiz()` (`index.html`) chama
`renderAmzPage()` de novo pra reordenar o catálogo por popularidade —
só que essa função, quando `amzPage` ainda está em 1 (ninguém clicou
"Ver mais"), recria a grade INTEIRA (`grid.innerHTML=...`), apagando
também os ~265 cards AO VIVO que `renderLiveQuizResults()` tinha
inserido antes por fora (`insertAdjacentHTML`, nunca rastreado por
`amzRenderedIdx`). Diferente da página Comparar, onde "Mais vendidos"
já refaz a busca ao vivo do zero (`renderProds()`→`finishRenderProds()`),
aqui ninguém rebuscava depois — os cards ficavam perdidos até a pessoa
recarregar a página inteira.

**Corrigido**: `onSortChangeQuiz()` agora chama `renderLiveQuizResults()`
de novo logo depois de `renderAmzPage()`, mesmo tratamento que a
página Comparar já tinha. Testado ao vivo depois do deploy (numa aba
nova, sem cache do navegador — a primeira tentativa de reteste bateu
numa versão em cache da página e pareceu que não tinha resolvido,
confirmado comparando `onSortChangeQuiz.toString()` antes/depois):
271 cards antes → 271 cards depois de "Mais vendidos", sem perder
nenhum. Commit `ff06b02`.

**Promoções da home — não é bug**: só 1 promoção ativa no momento
("Sérum... Neo Dermo Etage Pró"), mostrando o ícone genérico "Foto
ilustrativa". Investigado ao vivo: buscando o nome do produto nas 18
fontes parceiras, vieram 22 resultados reais de "sérum", mas nenhum é
da marca Neo Dermo — ela simplesmente não é vendida por nenhuma loja
parceira hoje, então a regra D3 (só mostra foto com marca confirmada)
está funcionando certo, não achar foto aqui é o comportamento
esperado, não uma falha.

Documentação desta rodada: `CLAUDE.md` (este commit).

**Marco**: com essa rodada, a revisão minuciosa cobriu essencialmente
o site inteiro — as 18 fontes de dados, filtro de categoria nas 4
categorias (com e sem ordenação), "Ver mais", quiz completo nos 3
caminhos que existem (Maquilhagem/Skincare/Cabelo — Perfumaria não é
opção do quiz por decisão antiga), painel admin (tela de login),
páginas institucionais, casos extremos de busca, mobile, e promoções
da home. 8 bugs reais encontrados e corrigidos ao longo das 4 rodadas
(perfume vazando por grafia, perfume vazando por título sem palavra
nenhuma, cards duplicados ao navegar por categoria, falso positivo de
"colônia" em Perfumaria, ordem de checagem do guessSubcat, contador
perdendo prefixo no "Ver mais", e agora o "Mais vendidos" do quiz).

## Sessão 07/08/2026 — Beleza na Web: confirmado sem feed nenhum, nem via Rakuten
Priscila avisou que a Beleza na Web aceitou parceria pela **Rakuten**
(rede de afiliados diferente da Awin, onde ela já estava aprovada há
semanas mas sem feed). Investigado com ela, direto no painel da
Rakuten (prints da própria Priscila):

1. **Catálogo de Produtos (Product Catalog, feed completo por
   SFTP)**: suporte da Rakuten confirmou por escrito — a Beleza na Web
   **não oferece** esse recurso. Teria que pegar link de produto um
   por um manualmente pelo painel (inviável pro site, que busca
   automaticamente entre milhares de termos).
2. **Product Search API** (busca por palavra-chave, alternativa que eu
   sugeri por pesquisa — funcionaria parecido com as lojas VTEX):
   descartada também — ela depende do mesmo catálogo de produto que a
   loja nunca enviou pra Rakuten, então não tem dado nenhum pra
   buscar. Confirmado que a aba "Recursos & Serviços" do perfil dela
   na Rakuten está vazia.
3. Lembrete do que já tinha sido tentado antes (sessão 24/07/2026):
   acesso direto à API pública VTEX do site da Beleza na Web também
   foi tentado e bloqueado (403).

**Conclusão**: as três portas possíveis de automatizar a Beleza na Web
estão fechadas por enquanto — não é falta de tentativa, é a loja que
não disponibilizou dado nenhum do lado dela em nenhuma das duas redes
de afiliado. Nenhuma mudança de código nesta sessão. Se a Beleza na
Web um dia liberar feed (Awin ou Rakuten) ou Product Search API, é só
avisar — o padrão de integração já está pronto e testado em várias
outras lojas, só falta o dado da loja em si.

## Sessão 07/08/2026 (continuação) — quiz sem comparação ao trocar categoria + manicure vazando
Priscila testou o quiz de verdade: fez Skincare + pele oleosa + sabonete,
resultado veio certinho (comparação real em vários itens). Na PRÓPRIA
página de resultados, trocou a pílula pra Maquilhagem — o primeiro item
foi um shampoo (categoria errada), depois algumas maquiagens, e depois
só sobrou botão Amazon, sem comparação real nenhuma (diferente da busca
original).

**Causa raiz 1**: `quizSearchTerms()` escolhia o termo de busca ao vivo
por prioridade fixa (`maq_prod > hair_prod > skin_prod`), sempre
reusando o tipo de produto do quiz ORIGINAL — trocar a pílula pra
Maquilhagem não muda `qD.maq_prod` (nunca foi escolhido, já que o quiz
percorrido foi o de Skincare), então continuava buscando "sabonete" e
filtrando perguntando "isso é maquiagem?" — sempre zero. Corrigido pra
escolher o campo certo pela categoria ATUAL da tela, caindo no termo
genérico da categoria (`batom`/`base`, depois trocado — ver causa 2)
quando não há produto específico escolhido pra ela. Bug relacionado
corrigido junto: `renderLiveQuizResults()` não tinha proteção contra
resposta atrasada (categoria trocando enquanho a busca da categoria
anterior ainda estava a caminho) — adicionada trava de categoria
(mesmo padrão de `finishRenderProds`). Commit `7e92039`.

**Causa raiz 2, achada testando a correção acima**: o termo genérico de
fallback pra Maquilhagem era `['batom','base']` — "base" sozinho é
ambíguo, trazia "Base Fortalecedora Risqué"/"Base Unhas Impala"
(produto de UNHA, não maquiagem de rosto). Trocado pra `'base líquida'`
(específico, mesmo termo já usado em `MAKEUP_ONLY_NOUNS`).

**Descoberta maior, confirmada pela Priscila**: manicure/unha não é e
nunca foi categoria do site ("nenhum produto de manicure entra") — mas
"esmalte" estava dentro de `MAKEUP_ONLY_NOUNS`, tratado como maquiagem
legítima. Corrigido de raiz: `esmalte` saiu de `MAKEUP_ONLY_NOUNS`,
nova lista `NAIL_ONLY_NOUNS` (esmalte, base fortalecedora, top coat,
removedor de esmalte, cutícula etc.) checada ANTES de qualquer regra
de categoria em `conflictsWithCategory()` — exclui de TODAS as 4
categorias, inclusive "Todas" (achado que o filtro inteiro era pulado
nesse caso em dois lugares — `finishRenderProds` e
`renderLiveQuizResults` — corrigidos pra sempre rodar a checagem de
manicure, mesmo sem categoria específica ativa). Testado com 7 casos
via script Node antes de publicar. Commit `b3374fd`.

**Confirmado ao vivo em produção** (via `javascript_tool` no navegador
real, chamando as mesmas funções que os botões chamam — mais confiável
que clique simulado nesta sessão): reproduzido o cenário exato da
Priscila — Skincare/sabonete (207 produtos, comparação real) → trocar
pra Maquilhagem (491 produtos, 485 com comparação real, zero produto
de manicure, primeiros itens todos batom de verdade).

## Sessão 31/08/2026 — busca de marca trazia produto sem relação nenhuma
Priscila reportou: buscar "we pink" no comparador trazia um monte de
marca nada a ver (não só WePink).

**Causa raiz confirmada testando contra o catálogo real (2483
produtos)**: a busca (`renderProds`, `index.html`) quebra o termo
digitado em palavras separadas e casa cada uma com `hay.indexOf(t)`
— isso é substring SOLTA, não palavra de verdade (apesar do comentário
antigo do código dizer "casar por palavra"). O termo "we" (de "we
pink") batia como pedaço de "We"lla, "S"we"et, "Po"we"r, "We"leda —
trazia NYX, Wella, Weleda, COSRX, Estée Lauder, Huda Beauty, Lowell,
L'Oréal, Rare Beauty (66 produtos errados no teste).

**Corrigido**: nova função `termMatchesWord()` (`index.html`, antes de
`renderProds`) — casa o termo com limite de palavra de verdade em vez
de substring solta. Testado contra o catálogo real antes de publicar:
"we pink"/"wepink" caíram de 66 pra **0** resultados errados no
catálogo (correto — a WePink não está no catálogo fixo, só na busca
ao vivo, que já confirmei trazendo os produtos reais dela via
`wepink-search.mjs`); buscas legítimas de várias palavras continuam
funcionando igual ("hidratante pele oleosa" 279, "cerave hidratante"
283) e agora buscas de marca+produto colocam a marca pesquisada no
TOPO do resultado (ex: "batom vult" → Vult aparece primeiro, "protetor
solar la roche posay" → La Roche-Posay primeiro), porque o placar de
relevância (soma de termos batidos) prioriza quem bate mais palavras
de verdade. Commit `599fe81`.

**Priscila testou de novo e o mesmo tipo de problema continuava**:
buscou "boticário", apareceu "Hidratante Labial Carmed" e "Balm Labial
Vult" — marcas sem relação nenhuma. A correção acima só tinha mexido
no CATÁLOGO fixo; esses cards eram de resultado AO VIVO (loja
parceira), um caminho de código diferente que nunca teve esse tipo de
checagem.

**Causa raiz, confirmada testando as functions das lojas direto**: a
API de busca de CADA loja parceira (VTEX — Drogaria Rosário,
Extrafarma etc.) devolve resultado "parecido" por conta própria,
mesmo sem nenhuma relação real com o termo buscado — testei
`rosario-search?query=boticário` e voltou "Shampoo Hidratei - 250ml"
(marca genérica de xampu, zero relação com "boticário"). O site nunca
conferia isso no caminho de busca ao vivo (`finishRenderProds`) — só
filtrava por categoria (`conflictsWithCategory`), nunca por relevância
ao termo digitado.

**Corrigido**: nova função `foldAccents()` (ignora acento, porque dado
de loja terceira vem inconsistente — às vezes "O Boticário", às vezes
"BOTICARIO" sem acento) integrada ao `termMatchesWord()` da correção
anterior. Resultado ao vivo agora só aparece se o termo digitado bater
de verdade (por palavra) no título, na loja ou na marca do produto —
só quando a pessoa realmente digitou uma busca (não afeta a navegação
por Perfumaria sem busca, que usa termos genéricos de propósito).
Testado com dado real da própria Drogaria Rosário antes de publicar:
"Hidratante Labial Carmed"/"Balm Labial Vult" (os exemplos exatos do
print dela) e "Shampoo Hidratei" corretamente removidos; os produtos
reais do Boticário (Eudora Siàge) continuam aparecendo; busca de
várias palavras ("hidratante pele oleosa") continua trazendo os
mesmos resultados reais de antes (4 de 5 mantidos, só 1 sem relação
nenhuma removido). Commit `74b9618`.

**Limitação residual aceita, achada no mesmo teste**: um produto Vult
da Drogaria Rosário tem "BOTICARIO PRODUTOS DE BELEZA L" grudado no
final do próprio nome do produto (dado da loja, não um campo separado
— parece nome de distribuidor/fabricante que a loja concatenou por
engano) — como a palavra "boticario" está literalmente ali, ele
continua passando no filtro. Caso raro, não achei outro igual nos
testes; se aparecer de novo, seria preciso alguma regra específica
pra esse tipo de sufixo de fabricante, não dá pra generalizar.

**Ainda não confirmado pela Priscila em produção.**

## Sessão 01-09/09/2026 — novo quiz de tipo de pele na home + EN escondido
Priscila trouxe um arquivo HTML pronto (`quiztipopele.html`, baixado do
Downloads) — um quiz autônomo de 11 perguntas que identifica o tipo de
pele (Normal/Oleosa/Seca/Mista/Sensível/Acneica) por pontuação, com
resultado mostrando rotina sugerida (manhã/noite), o que buscar/evitar
e detalhamento da pontuação. Pediu pra integrar na home, ver prévia
antes de publicar.

**Processo (várias rodadas de prévia, nenhuma publicada até a
aprovação final)**:
1. Recolorido por completo pra bater com a identidade do site — o
   arquivo original vinha com paleta própria (bege/terracota, fontes
   Fraunces/Work Sans); trocado pra paleta rosa-framboesa do VERAORIS
   (var(--gold)/var(--gold5) etc.) e Cormorant Garamond/Inter (fontes
   já carregadas no site) — senão ia parecer um widget estranho colado
   na página.
2. Todo HTML/CSS/JS prefixado com `qtp-`/`qtp` (classes e ids) pra
   nunca colidir com o resto do CSS/JS gigante do site (`.card`,
   `.option`, `.label`, `.eyebrow` etc. já existem soltos no site).
   Script mantido como bloco próprio, contido, fácil de remover se um
   dia for descartado.
3. **Prévias mostradas em 3 formatos diferentes**, conforme pedido foi
   evoluindo: (a) só a seção isolada; (b) cópia completa da página
   inicial de verdade com a seção encaixada (pra ver o contexto real
   — nav, hero, etc.) — usando o próprio `index.html` copiado pra fora
   do repositório, nunca publicado até aprovação; (c) reposicionada
   dentro dessa cópia completa três vezes até o lugar certo.
4. **Botão extra removido a pedido dela**: tinha adicionado um botão
   "Ver produtos pro meu tipo →" no resultado, ligando pro mesmo
   mecanismo de busca do `doHeroSearch()` (prefixo "hidratante pele
   X"). Ela pediu pra tirar por enquanto — removido, pode voltar depois
   se ela quiser (ideia documentada aqui: mapear resultado→termo de
   busca e chamar `srch=...;showPage('compare')`, igual o resto do
   site já faz).
5. **Posição final decidida com ela, testada em 3 lugares até acertar**:
   não entre "Em Alta" e "Compare Aqui" (ideia original minha) nem
   acima do hero inteiro — ficou **logo abaixo dos dois cartões do
   topo** ("Não sabe por onde começar?"/"Já escolheu o produto?"),
   antes de "Dica da Semana"/"Promoções do Dia".
6. **Texto de abertura reescrito**: era "Antes de comparar / Descubra o
   seu tipo de pele"; virou **"Tipo de pele" (eyebrow) / "Não sabe qual
   é o seu tipo de pele? A gente ajuda a descobrir." (título)** — pedido
   dela, escrito pra ecoar o mesmo tom de voz que já existe no cartão
   do hero ("Não sabe por onde começar? A gente te ajuda a escolher
   certo").
7. **Botão EN escondido** (mesmo pedido, mesma sessão): `<span
   class="tdiv">|</span>` e `<button id="len" onclick="setLang('en')">`
   na barra do topo ganharam `style="display:none"` — mesmo padrão já
   usado pra esconder a região Portugal (reversível, só tirar o
   `display:none`).

Sintaxe validada (`node --check` equivalente nos 2 blocos `<script>`
do arquivo) antes de cada prévia e antes do push final. Commit
`e48e15e`, publicado. **Confirmado pela Priscila em produção** (ver
sessão seguinte).

## Sessão 02/09/2026 — ajuste de texto + bug real: promoção rejeitava link de loja nova
Priscila pediu duas mudanças rápidas de texto, testadas e publicadas
direto (sem risco, sem prévia):
1. Título do quiz de pele: "A gente ajuda a descobrir" → **"Nós
   ajudamos a descobrir"** (ela achou "a gente" pouco elegante).
2. Cartões do topo (hero), mesmo motivo: "A gente te ajuda a escolher
   certo" → **"Te ajudamos a escolher o certo"**; "A gente acha o
   melhor preço" → **"Nós encontramos o melhor preço"**. Trocado tanto
   no HTML quanto na lista de tradução `TX.pt` (o site guarda o texto
   duas vezes, um pro carregamento inicial, outro pra função de
   idioma — achado nesta sessão, útil lembrar da próxima vez que for
   editar texto do hero).

**Confusão real que vale documentar**: depois da 1ª troca, Priscila
testou e disse que continuava errado — mas na verdade ela tinha
olhado o cartão ERRADO (o do hero, que tem frase parecida mas é
outra, nunca pedida pra mudar). Print dela confirmou os dois textos
lado a lado. Resolvido explicando a diferença, e ela decidiu então
mudar os dois cartões do hero também pro mesmo tom.

**Bug real encontrado e corrigido**: Priscila reportou dois problemas
que pareciam graves — (1) comparação de preço voltando só com Amazon
em "todos" os produtos, e (2) botão "Guardar Promoção" no painel admin
não fazendo nada ao clicar. Investigação:
- **Item 1 (comparação só Amazon)**: testado a fundo direto no
  servidor (sem navegador) — busquei o mecanismo de comparação real
  (`loadComparison`, com a mesma lógica de filtro D3 extraída do
  arquivo) contra dados reais de várias lojas parceiras pra 4 marcas
  diferentes (Revlon, Isdin, Neutrogena, CeraVe) — todas retornaram
  preço real, confirmando que o mecanismo em si funciona. **Acabou
  sendo cache do navegador** (mesmo problema já visto nesta sessão
  com o texto) — resolvido com Ctrl+F5, sem mudança de código
  necessária.
- **Item 2 (botão "Guardar Promoção" sem efeito) — bug real,
  confirmado e corrigido**: `savePromo()` (`index.html`) só aceitava
  link de `amazon.com.br`/`eudora.com.br`/`awin1.com`/`zenaps.com` —
  essa lista foi escrita há muito tempo e **nunca foi atualizada**
  conforme ~17 lojas novas foram integradas ao longo de várias sessões
  (Americanas, WePink, Extrafarma, Drogal, Venâncio, Pague Menos,
  Drogaria Catarinense, Farmácias São João, Drogaria Rosário, Payot,
  Preço Popular, Drogaria Globo, Farmácia Indiana, Lojas Rede,
  Mahogany, Lojas Pompéia, Época). Link de qualquer uma dessas lojas
  era rejeitado — a validação inclusive mostrava um toast de erro,
  mas com a lista antiga de domínios ficando enorme e genérica o
  suficiente pra passar despercebido como "não funciona". Corrigido:
  domínio real de cada uma das 17 lojas (extraído direto do
  `API_URL` de cada function `.mjs`) adicionado à lista
  `allowedDomains`; mensagem de erro também reescrita (a antiga listava
  todos os domínios permitidos, ficaria enorme e ilegível com a lista
  maior — trocada por uma frase curta). Commit `2b39393`. **Confirmado
  pela Priscila em produção.**

**Lição pra próxima vez que uma loja nova for integrada**: checar
também se `savePromo()`/`allowedDomains` (`index.html`) precisa do
domínio novo — essa lista não é atualizada automaticamente junto com
`liveMultiSourceSearch`/D3/etc., é mantida à parte.

## Sessão 02/09/2026 (continuação) — auditoria de SEO + correções de baixo risco
Priscila pediu uma auditoria de SEO completa, sem mexer em nada até ela
ver o resultado. Levantamento (só leitura, sem navegador) achou:

**Achado grande, não corrigido ainda (decisão pendente)**: o site é um
SPA de URL única — `showPage()` (`index.html`) só troca `display:none`/
`active` entre as "páginas" (Comparar, Quiz, FAQ, Sobre, Privacidade,
Termos, Contacto), nunca chama `history.pushState`. Resultado: o Google
só enxerga UMA URL (`veraoris.com/`) pro site inteiro — nenhuma página
interna pode rankear pela própria palavra-chave (ex.: FAQ não pode
aparecer como resultado próprio, categorias não têm URL própria).
Corrigir isso exige mexer na navegação inteira do site — arriscado
demais pra fazer junto com o resto; **fica pra uma sessão futura,
combinada com calma antes**.

**Corrigido nesta sessão** (mudanças de baixo risco, testadas com
`node --check` equivalente nos blocos `<script>` + validação do JSON
antes de publicar):
1. **Meta description + Open Graph + Twitter Card** adicionados no
   `<head>` (`index.html`) — antes não existia nenhum, então
   compartilhar o link no WhatsApp/Instagram ou ele aparecer no Google
   não mostrava descrição nem imagem. Imagem usada: `icon-512.png` (já
   existia no repositório). Canonical (`https://veraoris.com/`)
   também adicionado.
2. **`robots.txt` e `sitemap.xml`** criados na raiz (arquivos novos,
   sem risco pro que já existia) — avisam o Google que o site existe e
   pode ser indexado. Sitemap por enquanto só lista a home (é a única
   URL real, ver achado grande acima) — quando/se a navegação ganhar
   URLs próprias, o sitemap precisa ser expandido junto.
3. **Dados estruturados `FAQPage`** (JSON-LD) no `<head>`, com as 8
   perguntas/respostas que já existiam em `FAQS` (`index.html`,
   `var FAQS=[...]`) — chance de aparecer como "perguntas frequentes"
   expansível direto no resultado do Google.
4. **`<html lang>` dinâmico**: `setLang()` agora atualiza
   `document.documentElement.lang` (pt-BR/en) ao trocar de idioma —
   antes ficava sempre fixo em `pt-BR` mesmo com o texto em inglês
   (baixo impacto agora porque o botão EN está escondido, mas corrige
   de qualquer forma).
5. **`loading="lazy"` nas fotos abaixo da dobra**: cards de categoria
   na home, logo do rodapé, e as fotos que os cards de produto/
   promoção/"Em Alta" geram por JS — a foto principal do topo (hero) e
   a logo do menu foram propositalmente deixadas de fora (carregam
   assim que a página abre, não devem esperar).

Commit `5377afc`, publicado. **Ainda não confirmado pela Priscila em
produção** — mudanças são invisíveis no visual do site (só afetam como
o Google/redes sociais enxergam o link), então não deve haver nada
diferente pra ela ver na tela, só confirmar que o site continua normal.

**Pendências reais da auditoria, não mexidas por serem mais arriscadas
ou exigirem decisão/discussão antes**: rotas próprias por página (ver
achado grande acima); reduzir o tamanho do `index.html` (1,28MB, tudo
inline — prejudica velocidade de carregamento); `width`/`height` nas
tags `<img>` (evita a página “pular” enquanto a foto carrega, mas exige
saber o tamanho de cada imagem, mais trabalhoso e com mais chance de
erro); instalar Google Analytics de verdade (hoje a Política de
Privacidade menciona "cookies de analytics" mas não existe nenhuma tag
de analytics no código).

## Sessão 02-03/09/2026 — Tutorial de Maquiagem (nova página) + faixa "Novidade" na home
Priscila trouxe um arquivo pronto (`veraoristutorialmaquiagemintegracao.md`,
baixado do Downloads) com o código de uma página nova de tutorial de
maquiagem (10 passos, da preparação da pele ao fixador, com ajuste de cada
passo pra 6 tipos de pele — Normal/Oleosa/Seca/Mista/Sensível/Acneica).
Revisado antes de integrar: nenhum nome usado no arquivo (`TUT_STEPS`,
`renderTutorial`, `page-tutorial`, chaves de `TX` etc.) colidia com o que já
existia no site.

**Processo de decisão, com prévias (artifacts) antes de mexer no site de
verdade** — a Priscila pediu explicitamente pra não mudar nada até ver:
1. 1ª ideia (minha, banner dentro da categoria Maquilhagem no comparador) —
   ela rejeitou: quem entra direto no Comparador cai no filtro "Todas" e
   nunca veria o banner.
2. Ela pediu, com print de referência: uma **faixa "Novidade"** logo abaixo
   do botão "Faça o Quiz e Compare Aqui" do menu, antes da foto do topo —
   sempre visível na home, sem depender de clicar em categoria nenhuma.
3. Testadas 3 frases numa prévia interativa; ela escolheu o texto da opção 1
   com o emoji da opção 2: **"✨ Novidade — Tutorial de Maquiagem: da base ao
   fixador, passo a passo"**.
4. Pedido dela ("me mostra numa página teste") — prévia final combinando a
   faixa clicável de verdade levando pra página do tutorial completa (abas
   + 10 passos), pra ver a experiência inteira antes de aprovar. Aprovada.

**Implementado no site de verdade** (`index.html`), reaproveitando 100% do
código do arquivo da Priscila pro conteúdo da página, mais a faixa nova
(que não estava no arquivo original, foi decidida nesta conversa):
1. CSS da página do tutorial (`.tut-step`, `.tut-adjust` etc.) + CSS novo da
   faixa (`.tut-ribbon`, `.tut-badge`, `.tut-arrow`) dentro do `<style>`.
2. Nova `<div class="page" id="page-tutorial">` inserida logo depois da
   página "Como Funciona" — mesma casca `inst-page`/`inst-hero` das outras
   páginas institucionais, `showPage('tutorial')` funciona sem precisar
   mexer em `showPage()` (função já é genérica).
3. Faixa `<button class="tut-ribbon" onclick="showPage('tutorial')">`
   inserida como primeiro elemento dentro de `#page-home`, antes da `.hero`
   — aparece só na home, logo abaixo do menu.
4. Link novo no rodapé (`id="fnavTut"`, coluna "Navegação").
5. Chaves novas em `TX.pt`/`TX.en` (`tutBack`, `tutTitle`, `tutDesc`,
   `tutRibbonBadge`, `tutRibbonTxt`, `fnavTut`) — conteúdo dos 10 passos em
   si continua só em português (mesma decisão de arquitetura do arquivo
   original: os passos usam as mesmas chaves de tipo de pele do quiz, texto
   fixo da casca é que é bilíngue).
6. `TUT_LABELS`/`TUT_DESC`/`TUT_STEPS`/`setTutType`/`renderTutorial`
   adicionados perto de `showPage()`; `renderTutorial()` chamado junto com
   os outros `render*()` de inicialização (`window.onload`), pra aba
   "Normal" já vir preenchida.

**Testado antes de publicar** (pedido de sempre): sintaxe de todo o
`<script>` validada, depois testado ao vivo num servidor local (Node
simples, já que Python não está instalado nesta máquina) com navegador de
verdade — faixa aparece na home, clique leva pro tutorial, abas trocam a
dica certa, "← Voltar" e o link do rodapé funcionam, sem erro no console.
Não foi possível testar o layout mobile de verdade nesta sessão (a
ferramenta de redimensionar a janela do navegador não surtiu efeito —
mesma limitação já registrada em sessões anteriores) — o CSS mobile da
faixa segue o mesmo padrão (só reduz fonte/espaçamento) já usado no resto
do site, risco baixo.

Commit `32f1b79`, publicado. **Ainda não confirmado pela Priscila em
produção.**
