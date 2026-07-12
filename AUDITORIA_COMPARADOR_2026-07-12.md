# AUDITORIA DE PONTA A PONTA — Comparador de preços VERAORIS

Data: 12/07/2026
Feita por: Claude do Luciano (`luciano-lcn`), a pedido do Luciano, com testes reais nas funções de produção do site (veraoris.com).

Objetivo: entender por que o site às vezes mostra imagem que não é do produto, preço que não bate com a loja, e link que cai numa página cheia de produtos em vez do produto exato. E propor o caminho para resolver de vez.

---

## 1. Como o site funciona hoje (a jornada de um card de produto)

1. O catálogo (~1000 produtos BR + ~470 PT/ES) vive dentro do `index.html` e cada produto só tem: categoria, subcategoria, marca, nome e um termo de busca (`srch`). **Não tem** código de barras (EAN), ASIN da Amazon, ID do Mercado Livre, tamanho/volume nem foto própria.
2. Quando um card aparece na tela, `loadComparison()` (`index.html:7142`) dispara até 3 buscas **por texto**: Scrappa (Google Shopping), Awin (feed da Eudora) e Mercado Livre (via Apify).
3. Tudo que volta é juntado, filtrado por região, deduplicado por loja, ordenado por preço, e os 3 mais baratos viram as linhas do card.
4. A foto vem de um produto Eudora "do mesmo tipo" (não do mesmo produto).
5. O botão "Ir →" usa o link do resultado se existir; senão, cai numa **busca do Google** restrita ao domínio da loja (`storeGoLink`, `index.html:7117`).
6. O botão Amazon garantido é um link de **busca** na Amazon (`amzLink`, `index.html:6922`), não de produto.

O problema de fundo, numa frase: **o site promete comparação por PRODUTO, mas toda a cadeia trabalha por PALAVRA-CHAVE.** Sem identidade única do produto, qualquer fonte pode responder qualquer coisa, e o clique final não tem para onde apontar com precisão.

---

## 2. O que está funcionando bem ✅

- **Segurança**: chaves de API (Scrappa, Apify, Awin, senha admin) só no servidor. Correto.
- **Feed Eudora (Awin)**: para produtos que SÃO da Eudora, entrega nome + preço + foto + deep link de afiliado fiéis. É o formato ideal de fonte.
- **Filtro de região** (`isWrongRegionStore`): funciona, embora com listas manuais (frágil a lojas novas).
- **Diversificação por loja**: evita a mesma loja 3x no card. Boa decisão.
- **Cache de 30 min** nas funções: reduz custo (mas ver limitação em 3.8).
- **Rastreamento de cliques** no Supabase: base boa para saber o que converte.
- **Fila de concorrência do ML** (máx. 2 simultâneas): decisão certa para o plano da Apify.

---

## 3. Onde está quebrando (com evidência de teste real)

### F1 — CRÍTICO: o Scrappa mistura produto, loja e preço (pareamento por índice)
`netlify/functions/scrappa-search.js:32-43` pareia `immersive_products[i]` com `popular_products[i]` **por posição**. São duas listas diferentes do Google Shopping, sem relação índice a índice.

Teste real (busca "CeraVe Creme Hidratante Facial", gl=br) retornou:
- Títulos que não são produtos: **"PROMOÇÃO"**, **"PREÇO BAIXO"**
- O MESMO preço R$ 83,29 atribuído a Drogasil, Ultrafarma E Amazon
- Preço de um produto atribuído à loja de outro

**Consequência direta**: o usuário clica, entra na loja e o preço "está diferente". Não é a loja que mudou o preço, é o site que mostrou o preço de outro item/loja.

### F2 — CRÍTICO: 0 de 12 resultados do Scrappa vieram com link direto
No teste real, `merged.filter(m => m.link)` = **0/12**. Ou seja: praticamente todo "Ir →" cai no fallback `storeGoLink` = busca do Google (`site:loja.com.br + termo`) → **página de listagem, nunca o produto**. É exatamente a reclamação central. O botão Amazon também leva a uma busca, não a um produto.

### F3 — CRÍTICO: preços da Eudora contaminam a comparação de qualquer produto
O `awin-search.js` casa por sobreposição de palavras. Teste real: "CeraVe Creme Hidratante Facial" retornou 10 produtos Eudora, entre eles "Creme Hidratante para MÃOS FPS 15 Eudora Magnific" (R$ 29,99) e "Creme Desodorante Hidratante Mãos Instance Baunilha" (R$ 19,99).

Esses resultados entram como **linhas de preço** no card do CeraVe (`loadComparison` não valida título para as linhas de preço, só para a foto). Resultado: "🏆 Eudora R$ 19,99" como melhor preço de um produto que não é CeraVe, não é facial e não é o item. Comparação inválida na cara do usuário.

### F4 — GRAVE: a foto valida "mesmo tipo", não "mesmo produto"
A regra atual (validação por `SUB_KEYWORDS`, qualquer marca serve) aceita a foto do "Creme Hidratante para Mãos Eudora Magnific" no card do "CeraVe Creme Hidratante Facial" — contém "hidratante", não conflita com a categoria. **Foto de outro produto, de outra marca, aparece como se fosse o produto.** Para um comparador, foto tem que ser DO produto ou não aparece (o selo "Foto ilustrativa" existente é a saída honesta).

### F5 — GRAVE: Mercado Livre está morto em produção (e ninguém percebe)
Duas buscas reais testadas ("CeraVe Creme Hidratante Facial" e "shampoo pantene") → `{"results":[]}` sem mensagem de erro. O actor da Apify está devolvendo vazio sistematicamente, e o cache de 30 min ainda **guarda o vazio**. Os últimos 5 commits do repo são tentativas de ajustar memória/concorrência da Apify — sinal de fonte instável por natureza.

**Ironia importante**: existe `netlify/functions/search.js` usando a **API OFICIAL do Mercado Livre** (OAuth client-credentials), que devolve `permalink` (link direto pro produto!), `thumbnail` oficial, preço em tempo real e avaliações — e **nenhum lugar do `index.html` chama essa função hoje**. O melhor ativo de fidelidade do projeto é código morto.

### F6 — Tamanhos/apresentações diferentes competem como se fossem o mesmo produto
Teste real trouxe na mesma lista "Cerave Creme Hidratante 50g" (R$ 36,85) e "Cerave Loção Facial Hidratante FPS50 52ml" (R$ 95,12). Sem normalizar tamanho/versão, o "melhor preço" compara itens incomparáveis.

### F7 — Deduplicação de loja frágil
O dedupe usa o nome da loja em minúsculas ("drogasil.com.br" ≠ "drogasil" = duas entradas). O mapa `STORE_DOMAINS` cobre parte, mas nomes novos passam.

### F8 — Achados menores / dívida técnica
- **Código morto**: catálogo `P` (14 produtos com preços FIXOS de Mercado Livre), `cmpCard`, barra flutuante "A comparar" e modal de comparação nunca são alcançáveis hoje (nenhum card renderiza o botão `+ Comparar`). Se algum dia voltarem, mostrarão preços congelados de meses atrás.
- `amzCard` monta o termo de busca como `brand + ' ' + name` em vez do campo `srch` do catálogo (que foi curado sem acentos/símbolos) — inconsistência que muda o resultado das fontes.
- O cache das functions é por instância do Netlify (cold start = cache zerado; instâncias paralelas = caches separados). O custo real de Scrappa é maior do que aparenta.
- O preço no card não tem carimbo de hora nem aviso "confirme na loja" (o FAQ avisa, o card não).
- Estrelas e nº de avaliações do catálogo antigo `P` são fictícios (hardcoded).

---

## 4. Plano proposto — 3 ondas

### Onda 1 — Estancar o sangramento (1 a 2 dias de trabalho, sem mudar arquitetura)
1. **Scrappa**: eliminar o pareamento por índice. Usar apenas os campos do próprio `immersive_product`; descartar entradas sem título de produto real ("PROMOÇÃO" etc.). Investigar no retorno bruto se existe campo de link de produto; se o Scrappa realmente não entrega link direto, **rebaixar o Scrappa a "preço de referência"** (mostrar preço sem botão "Ir →" enganoso, ou botão sincero "buscar na loja").
2. **Eudora/Awin**: só entra na comparação de preços se o título contiver a MARCA pesquisada (na prática: só para produtos Eudora). Continua sendo ótima fonte para os produtos da Eudora.
3. **Foto**: exigir marca E tipo no título para trocar a foto (reverter a regra "qualquer marca do mesmo tipo"). Sem foto fiel → ícone + "Foto ilustrativa" (já existe e é honesto).
4. **Mercado Livre**: religar via **API oficial** (o `search.js` já está pronto; precisa de `ML_CLIENT_ID`/`ML_CLIENT_SECRET` no Netlify e de um endpoint que aceite `?query=` livre). Ganho imediato: link direto pro produto + preço em tempo real + foto oficial em uma loja inteira. Aposentar (ou deixar como fallback) o actor da Apify.
5. **Validação de identidade nas linhas de preço** (todas as fontes): título deve conter a marca + palavra de tipo; extrair tamanho (50g, 200ml…) quando presente e não misturar tamanhos diferentes.
6. **Nunca cachear resposta vazia** (ML e Scrappa) e logar/alertar quando uma fonte retornar 0.

### Onda 2 — Identidade canônica do produto (1 a 2 semanas)
7. **Enriquecer o catálogo uma única vez** (script semi-automático + curadoria): para cada produto, salvar ID do Mercado Livre + permalink, foto oficial, EAN quando existir, tamanho/apresentação. Migrar o catálogo do HTML para **Supabase** (o painel admin já existe para a Pri manter).
8. **Amazon**: curar o ASIN dos top ~100 produtos → link direto `amazon.com.br/dp/ASIN?tag=pmfc-20` (produto exato, não busca). O restante segue com link de busca até a Creators API liberar (10 vendas/30 dias).
9. A comparação passa a ser: fonte responde → validador confere contra a identidade canônica (marca + tipo + tamanho, ou EAN) → só então vira linha de preço. Fidelidade deixa de depender da sorte da busca.

### Onda 3 — Redondo de verdade (1 mês em diante)
10. **Cache de preços no Supabase com timestamp**: refresh agendado (Netlify Scheduled Function), card mostra "atualizado há X min". Site instantâneo, custo Scrappa controlado, preço com carimbo.
11. **Mais anunciantes via Awin/Rakuten** (o formato feed é o ideal: deep link + foto + preço fiéis) usando o mesmo pipeline da Eudora.
12. **Limpeza**: remover código morto (catálogo `P`, `cmpCard`, modal) ou religá-lo a dados reais.
13. **Monitoramento**: alerta simples (e-mail/Telegram) quando qualquer fonte ficar 24h retornando vazio.

---

## 5. Decisões que precisam da Priscila

1. **Scrappa sem link direto**: aceitar rebaixar para "preço de referência" (mais honesto) ou manter botão que cai em busca (mais lojas na aparência)?
2. **Foto**: confirmar a reversão da regra "qualquer marca do mesmo tipo" → foto só do próprio produto.
3. **Migrar o catálogo para Supabase** (Onda 2): muda o fluxo dela de edição (deixa de colar no HTML, passa a usar o painel admin).
4. **Mercado Livre**: autorizar a troca do actor Apify pela API oficial (precisa criar app em developers.mercadolivre.com.br e configurar as duas variáveis no Netlify).
