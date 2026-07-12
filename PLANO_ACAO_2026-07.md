# PLANO DE AÇÃO — Consertar o comparador e multiplicar as lojas

Data: 12/07/2026. Ordena tudo que saiu da `AUDITORIA_COMPARADOR_2026-07-12.md` e do `MAPA_LOJAS_AFILIADOS_2026-07.md` em uma sequência executável: primeiro o que é rápido e já melhora o site no ar, depois o que dá o resultado grande, respeitando as dependências (o que precisa vir antes do quê).

Legenda de responsável: **[código]** = Luciano/Claude no repo · **[Pri]** = ação da Priscila (cadastros, contas, decisões) · **[ambos]** = decisão conjunta

---

## ETAPA 1 — Estancar o sangramento (esta semana, 1-2 dias de código)

Correções no site que não dependem de cadastro, CNPJ nem decisão externa. O site fica honesto e os erros visíveis somem.

1. **[código] Consertar o pareamento do Scrappa** (`scrappa-search.js`): parar de casar listas por posição; usar os campos do próprio item; descartar "títulos" que não são produto (PROMOÇÃO, PREÇO BAIXO); deduplicar loja de verdade. → Mata o preço trocado de loja.
2. **[código] Eudora só compara Eudora**: resultado do feed Awin só entra como linha de preço se o título contiver a marca pesquisada. → Mata o "creme de mãos R$ 19,99 como melhor preço do CeraVe".
3. **[código] Foto só do próprio produto**: exigir marca + tipo no título para trocar a foto; sem correspondência fiel, mantém o ícone com "Foto ilustrativa". → Mata a imagem errada.
4. **[código] Nunca cachear resposta vazia** (ML e Scrappa) e registrar no log quando uma fonte devolver zero. → Fonte morta deixa de ficar invisível por 30 min.
5. **[código] Botão honesto**: onde não há link direto do produto, trocar "Ir →" por "Buscar na loja" (ou exibir como preço de referência — ver decisão D1 abaixo). → Ninguém mais clica esperando o produto e cai numa listagem.
6. **[Pri] Diagnóstico do Apify**: entrar em console.apify.com e ver o erro real das últimas execuções (crédito? memória? timeout?) — ou passar o token pro Luciano diagnosticar. Sem isso o Mercado Livre segue fora do ar.
7. **[DECIDIDO em 12/07 pelo Luciano e pela Priscila] Identidade fiscal: TUDO por Portugal, pela conta Awin existente da Priscila.** Sem CNPJ brasileiro, sem misturar com as empresas do Luciano. A taxa de publisher internacional em programas do Brasil (25% operacional + 5% câmbio, pagamento em EUR) é aceita como custo de operação. Consequências assumidas:
   - Programas que exigem CNPJ + nota fiscal brasileira ficam FORA: **Natura/Avon, Minha BLZ**. Programas que exigem CPF/conta bancária no Brasil ficam fora: **Mercado Livre Afiliados, Shopee BR** (o ML continua no site como fonte de COMPARAÇÃO de preço, só não gera comissão).
   - Boticário e Época exigem PJ: candidatar com o registro fiscal português dela — a aceitação é decisão de cada anunciante; tentar custa zero.
   - Comissão líquida dos programas BR ≈ 70% do valor nominal (ex.: Boticário 10% → ~7% líquido). Continua valendo a pena.
   - O lado Portugal/Europa do site vira prioridade estratégica natural: nos anunciantes europeus a conta dela opera SEM taxa internacional.

**Resultado da Etapa 1**: preço confiável, foto confiável, clique honesto. O site para de gerar desconfiança enquanto construímos o resto.

## ETAPA 2 — Religar o Mercado Livre + abrir as portas das lojas (semana que vem)

8. **[código] Consertar o Apify** conforme o diagnóstico do passo 6 (crédito/memória/timeout) e subir o cache para reduzir custo. → Mercado Livre volta aos cards com link direto de produto.
9. **[Pri] Na conta Awin dela (Portugal), candidatar-se aos anunciantes brasileiros**, na ordem: **Beleza na Web** (prioridade nº 1: multimarca, 250+ marcas num feed só — mesmo com a taxa internacional, é o maior salto de fidelidade e cobertura), Vult, Pague Menos, Época e Boticário (estes dois exigem PJ — tentar com o registro fiscal PT dela; a decisão é do anunciante).
10. **[Pri] Na mesma leva, candidatar-se aos anunciantes EUROPEUS na Awin** para o lado Portugal do site (Sephora ES, Douglas, Sweetcare e afins — sem taxa internacional; a residência dela é vantagem aqui).
11. **[Pri] Cadastro na Rakuten Advertising** (rede global, aceita publisher internacional): candidatar **Sephora Brasil** e **Drogasil/Droga Raia**. Complemento opcional: **AliExpress Portals** (internacional, beleza 7-9%). Mercado Livre Afiliados e Shopee BR ficam de fora (exigem CPF/conta no Brasil — decisão do passo 7).

**Resultado da Etapa 2**: ML de volta + candidaturas andando (aprovação de anunciante leva dias/semanas — por isso começa agora).

## ETAPA 3 — Identidade canônica: a solução definitiva (2 semanas de trabalho)

Pré-requisito técnico: passos 1-5 no ar. Pré-requisito de decisão: D2 abaixo.

12. **[código] Migrar o catálogo para o Supabase**: os ~1.470 produtos saem do código e viram tabela editável pelo painel admin. É a fundação de tudo que segue.
13. **[código+Pri] Enriquecer os top 100-200 produtos** (os mais clicados primeiro — o tracking de cliques já diz quais): para cada um, salvar ASIN da Amazon (link direto `/dp/ASIN?tag=pmfc-20`), ID do item no Mercado Livre (para link direto de produto — sem comissão, só comparação, conforme decisão do passo 7), tamanho/apresentação e foto oficial. Testar se o endpoint `/items/{id}` da API oficial do ML responde (se sim, preço em tempo real sem scraper).
14. **[código] Validador de identidade**: toda fonte passa a ser conferida contra o produto canônico (marca + tipo + tamanho) antes de virar linha de preço.
15. **[código] Plugar o feed da Beleza na Web** assim que a Awin aprovar (passo 9) — mesmo pipeline da Eudora, catálogo gigante com nome+preço+foto+deep link fiéis.
16. **[código] Plugar os feeds europeus aprovados** (Sephora ES, Douglas, Sweetcare...) no lado Portugal do site — mesmo pipeline, sem taxa internacional. (A Shopee Open API sai do plano enquanto valer a decisão do passo 7.)

**Resultado da Etapa 3**: comparação por produto de verdade — nome, preço, foto e clique caem no item exato. É o "resolver de uma vez por todas".

## ETAPA 4 — Deixar redondo e escalável (mês seguinte)

17. **[código] Cache de preços no Supabase com carimbo de hora**: refresh agendado, card mostra "atualizado há X min", custo de Scrappa/Apify controlado.
18. **[código] Feeds adicionais** conforme as aprovações chegarem: Sephora, Drogasil/Raia, Época, Boticário, Natura...
19. **[código] Monitoramento**: alerta automático (e-mail) quando qualquer fonte passar 24h retornando vazio.
20. **[código] Limpeza**: remover o código morto (catálogo antigo com preços congelados, modal de comparação inalcançável).

---

## Decisões da Priscila que travam passos específicos

- **D1 (trava o passo 5)**: preços sem link direto (Scrappa) viram "preço de referência" sem botão, ou botão sincero "Buscar na loja"? Recomendação: referência com botão sincero.
- **D2 (trava o passo 12)**: autorizar a migração do catálogo para o Supabase (muda o fluxo dela: de colar no código para editar no painel admin).
- **D3 (já embutida nos passos 2-3)**: confirmar que foto e preço só aparecem quando são do próprio produto (reverte a regra "qualquer marca do mesmo tipo").
- **D4 — DECIDIDA (12/07)**: tudo pela conta Awin de Portugal da Priscila, aceitando a taxa internacional (~30%) nos programas BR. Sem CNPJ brasileiro, sem usar empresa do Luciano. Natura, Minha BLZ, ML Afiliados e Shopee BR ficam fora do plano enquanto essa decisão valer.

## Regra de ouro da execução

Uma mudança por vez, commit pequeno, `git pull` antes, push depois, e este repositório sempre atualizado (CLAUDE.md + este plano) para os dois lados saberem o que já foi feito. Push no `main` publica o site na hora — mudanças das Etapas 1 e 3 serão avisadas antes de subir.
