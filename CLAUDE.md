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

**Ainda não confirmado pela Priscila se resolveu de vez.** Se persistir,
o próximo passo é usar a extensão "Claude in Chrome" (já instalada dela,
ver sessão anterior) pra inspecionar o layout ao vivo e achar a causa
exata, já que análise estática do código sem ver o DOM renderizado tem
limite.
