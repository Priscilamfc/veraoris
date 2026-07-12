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
7. **[ambos] Definir a "identidade fiscal" do projeto no Brasil** (CORRIGIDO em 12/07: a Priscila mora em Portugal e **não-residente não pode abrir MEI** — o MEI/Simples exige residência fiscal no Brasil). As opções reais:
   - **(a) Recomendada — usar um CNPJ do Luciano** para os programas que exigem PJ/NF brasileira (Boticário, Natura, Época, Minha BLZ) e para uma conta de publisher Awin BRASIL. Além de destravar tudo, evita a mordida de publisher estrangeiro da Awin (ver Etapa 2).
   - (b) Priscila operar tudo de Portugal como publisher internacional: funciona na Awin (conta é global), MAS comissões de programas brasileiros pagam **25% de taxa operacional + 5% de desconto cambial e são pagas em EUR** (~30% de perda), e Natura/Minha BLZ ficam inviáveis (exigem CNPJ + emissão de NF no Brasil).
   - (c) Abrir empresa no Brasil sendo não-residente: possível, mas sem Simples/MEI (só Lucro Presumido/Real, com procurador) — caro e desproporcional para o estágio atual.
   - Bônus da opção (a)+(b) combinadas: a conta PT da Priscila fica PERFEITA para o lado Portugal/Europa do site (o Veraoris já é bi-regional) — Awin/Rakuten têm os anunciantes europeus (Sephora ES/PT, Sweetcare etc.).

**Resultado da Etapa 1**: preço confiável, foto confiável, clique honesto. O site para de gerar desconfiança enquanto construímos o resto.

## ETAPA 2 — Religar o Mercado Livre + abrir as portas das lojas (semana que vem)

8. **[código] Consertar o Apify** conforme o diagnóstico do passo 6 (crédito/memória/timeout) e subir o cache para reduzir custo. → Mercado Livre volta aos cards com link direto de produto.
9. **[Pri] Cadastro de publisher na Awin** (pode iniciar antes do CNPJ sair, mas as âncoras exigem PJ): candidatar na ordem — **Beleza na Web** (prioridade nº 1: multimarca, 250+ marcas num feed só), O Boticário, Vult, Época, Pague Menos.
10. **[Pri] Cadastro na Rakuten**: candidatar **Sephora** e **Drogasil/Droga Raia**.
11. **[Pri] Cadastro no Mercado Livre Afiliados** (aprovação ~2 dias, aceita CPF) e no **Shopee Affiliate** (aceita site). → Comissões de ~16% (ML beleza) ficam disponíveis para os links que já vamos gerar na Etapa 3.

**Resultado da Etapa 2**: ML de volta + candidaturas andando (aprovação de anunciante leva dias/semanas — por isso começa agora).

## ETAPA 3 — Identidade canônica: a solução definitiva (2 semanas de trabalho)

Pré-requisito técnico: passos 1-5 no ar. Pré-requisito de decisão: D2 abaixo.

12. **[código] Migrar o catálogo para o Supabase**: os ~1.470 produtos saem do código e viram tabela editável pelo painel admin. É a fundação de tudo que segue.
13. **[código+Pri] Enriquecer os top 100-200 produtos** (os mais clicados primeiro — o tracking de cliques já diz quais): para cada um, salvar ASIN da Amazon (link direto `/dp/ASIN?tag=pmfc-20`), ID do item no Mercado Livre + link afiliado ML gerado no painel, tamanho/apresentação e foto oficial. Testar se o endpoint `/items/{id}` da API oficial do ML responde (se sim, preço em tempo real sem scraper).
14. **[código] Validador de identidade**: toda fonte passa a ser conferida contra o produto canônico (marca + tipo + tamanho) antes de virar linha de preço.
15. **[código] Plugar o feed da Beleza na Web** assim que a Awin aprovar (passo 9) — mesmo pipeline da Eudora, catálogo gigante com nome+preço+foto+deep link fiéis.
16. **[código] Integrar a Shopee Open API** (busca + geração de link programática).

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
- **D4 (trava o passo 7→9)**: definir a identidade fiscal BR do projeto — recomendação: CNPJ do Luciano para os programas brasileiros + conta PT da Priscila para os programas europeus. Validar o arranjo (repasse entre os dois, CNAE da empresa do Luciano) com o contador do Luciano antes dos cadastros.

## Regra de ouro da execução

Uma mudança por vez, commit pequeno, `git pull` antes, push depois, e este repositório sempre atualizado (CLAUDE.md + este plano) para os dois lados saberem o que já foi feito. Push no `main` publica o site na hora — mudanças das Etapas 1 e 3 serão avisadas antes de subir.
