# MAPA DE LOJAS PARA O COMPARADOR — Programas de afiliados que entregam no Brasil

Data da pesquisa: 12/07/2026 (feita pelo Claude do Luciano, com fontes citadas no fim).
Complementa a `AUDITORIA_COMPARADOR_2026-07-12.md`: aqui está DE ONDE podem vir as lojas; lá está COMO exibi-las com fidelidade.

⚠️ Comissões e regras mudam sem aviso e a aceitação de "site comparador" é decidida por cada anunciante dentro da rede. Tudo aqui precisa ser confirmado no painel após o cadastro. Valores citados vieram de páginas oficiais ou agregadores confiáveis na data acima.

---

## O recado mais importante primeiro

**DECISÃO TOMADA (12/07, Luciano + Priscila): toda a operação fica na conta Awin de PORTUGAL da Priscila.** Sem CNPJ brasileiro, sem envolver as empresas do Luciano. Custo aceito: programas brasileiros pagam a publisher internacional com **25% de taxa operacional + 5% de desconto cambial, em EUR** (comissão líquida ≈ 70% do nominal). Consequências: **Natura/Avon e Minha BLZ ficam FORA** (exigem CNPJ + NF brasileira); **Mercado Livre Afiliados e Shopee BR ficam FORA** (exigem CPF/conta no Brasil) — o ML segue no site apenas como fonte de comparação, sem comissão. Boticário e Época (exigem PJ): candidatar com o registro fiscal português — decisão do anunciante. Lado positivo: nos **anunciantes europeus** (lado PT do site) a conta dela opera sem nenhuma taxa internacional — prioridade estratégica.

E o segundo recado: **o formato ideal para o comparador é FEED DE PRODUTOS** (nome + preço + foto + link direto do produto, igual ao que já usamos da Eudora). As redes Awin e Rakuten entregam exatamente isso. Cada loja nova por feed resolve, de uma vez, os três problemas da auditoria (nome fiel, preço fiel, link direto).

---

## TIER 1 — Prioridade máxima (feed de produtos + alta afinidade com o público)

| Loja | Caminho | Por quê | Observações |
|---|---|---|---|
| **Beleza na Web** | Awin (merchant 29407) | Multimarca com 250+ marcas (L'Oréal, Kérastase, CeraVe, Vichy...). Um feed só cobre boa parte do catálogo do site. **Resolve a pendência antiga "BnW sem afiliação"** | É do Grupo Boticário (não da L'Oréal). Tem também o programa próprio "Minha BLZ" (até 18%, exige CNPJ + Instagram de beleza), mas para comparador o caminho é a Awin |
| **Sephora Brasil** | Rakuten Advertising | A loja que a Priscila pediu. Programa oficial via Rakuten, ~5% de comissão, cookie 30 dias | Regulamento fala em "influenciadores" — aprovação de comparador não é garantida; vale candidatar o site e explicar o modelo. Rakuten tem feed (SFTP) e até API de busca de produtos em tempo real |
| **O Boticário** | Rakuten (10%) e/ou Awin (merchant 17659) | Marca âncora nacional, 10% de comissão | Exige PJ/CNPJ. Mesmo grupo da Eudora que já usamos — a relação já existe |
| **Natura + Avon** | Programa próprio afiliadosnatura.com.br (e perfil na Awin, merchant 17658) | **MUDANÇA vs. diagnóstico de maio/2026: a Natura ABRIU programa de afiliados** (não estava mais fora do mapa) | Exige CNPJ + emissão de NF. Comissão por campanha. Deep link não documentado — testar no painel. Natura e Avon também abriram lojas oficiais na Shopee (jul/2026), rota alternativa |
| **Época Cosméticos** | Awin (merchant 17642) | Perfumaria/cosméticos do grupo Magalu, catálogo grande | Exige PJ. Comissão média citada ~5,7% |

## TIER 2 — Marketplaces (volume e cobertura de catálogo)

| Loja | Caminho | Por quê | Observações |
|---|---|---|---|
| **Shopee** | Programa próprio + **Open API oficial** | Melhor infraestrutura técnica de afiliado do Brasil hoje: API GraphQL para buscar produto, gerar link e baixar catálogo. Beleza ~3-15%. Aceita SITE (não é só influencer) | Candidato ideal para integração automatizada no comparador. Natura/Avon oficiais lá desde 03/07/2026 |
| **Mercado Livre Afiliados** | Programa próprio (CPF ou CNPJ, aprovação ~2 dias) | Beleza ~16% direta / ~8% indireta. Deep link por produto existe (painel/app) | **Sem API de afiliados** — geração de link é manual/semi-automatizada. Combinar com a Onda 2 (IDs curados): busca de dados via scraper/`/items/{id}` + link afiliado gerado 1x por produto curado |
| **Amazon BR** | Associates (tag `pmfc-20` já ativa) | Já em uso | **Regra nova (nov/2025): PA-API exige 10 vendas qualificadas nos ÚLTIMOS 30 dias (regra corrente)** — não basta desbloquear uma vez. Enquanto isso: ASINs curados manualmente dão link direto de produto SEM API (`/dp/ASIN?tag=pmfc-20`) |
| **AliExpress** | Portals (programa próprio com API) | Beleza ~7-9%, API oficial usada por comparadores | Entrega BR ok (Remessa Conforme). Prazo de entrega longo — decidir se combina com a proposta premium do site |

## TIER 3 — Farmácias e complementares (bom para "onde tem CeraVe/La Roche")

| Loja | Caminho | Observações |
|---|---|---|
| **Drogasil / Droga Raia** (RD Saúde) | Rakuten | Case oficial da Rakuten com o grupo RD. Dermocosméticos fortes (CeraVe, La Roche, Vichy) — encaixe perfeito com o catálogo do site |
| **Pague Menos** | Awin (merchant 64086), ~5% | Há reclamações de comissões não pagas no Reclame Aqui — monitorar |
| **Drogaria Araujo** | Awin (merchant 17919) | Atenção: taxa Awin de 25% sobre comissão e pagamento em EUR nesse programa |
| **Sallve** | Actionpay (CPA) ou programa próprio (10%, foco creators) | Marca de skincare quente com o público do quiz. Actionpay é a rota para sites |
| **Vult** (Grupo Boticário) | Awin (merchant 21055) | Maquiagem nacional, preço acessível |
| **Drogal** | Awin (merchant 68224) | Drogaria com e-commerce nacional |
| **Osang** (K-Beauty) | Awin (merchant 124568) | Skincare coreano — nicho em alta |

## FICA DE FORA (por enquanto) — e por quê

- **Panvel, Ultrafarma, Ikesaki, Mundo dos Cosméticos, Belezinha**: sem programa de afiliados viável encontrado.
- **The Beauty Box**: marca encerrada pelo Grupo Boticário.
- **Magalu**: sem programa tradicional; só a loja-espelho "magazinevoce" (domínio diferente, sem API) — UX ruim para comparador.
- **Americanas**: tecnicamente viável via Awin, mas com histórico de calote em afiliados pós-recuperação judicial — risco.
- **Temu / Shein**: pagam quase só por usuário NOVO (na Shein, beleza SÓ comissiona novo usuário) — modelo incompatível com tráfego recorrente de comparação.
- **Lomadee**: em reconstrução após venda/reaquisição, com reclamações de pagamento — não usar como fonte primária.
- **Creamy**: recompensa em produto, não em dinheiro. **Principia / Bruna Tavares / Océane**: sem programa próprio confirmado (Océane e Bruna Tavares vendem via Beleza na Web — cobertas pelo Tier 1).

---

## Plano de ação (ordem prática — já alinhado à decisão "tudo por Portugal")

1. **Na conta Awin PT da Priscila**: candidatar-se aos anunciantes BR — Beleza na Web (prioridade nº 1), Vult, Pague Menos, Drogal, Osang; Boticário e Época por tentativa (exigem PJ — usar o registro fiscal português dela). Explicar o modelo comparador na candidatura.
2. **Na mesma conta Awin**: candidatar-se aos anunciantes EUROPEUS para o lado PT do site (Sephora ES, Douglas, Sweetcare e afins) — sem taxa internacional.
3. **Cadastro na Rakuten Advertising** (aceita publisher internacional) → candidatar Sephora Brasil e Drogasil/Droga Raia.
4. **AliExpress Portals** (opcional, internacional) → beleza 7-9% com API.
5. Conforme os feeds forem sendo aprovados, plugar cada um no pipeline da Onda 2 (identidade canônica) — cada feed novo = uma coluna de preço fiel no comparador.

Fora do plano enquanto valer a decisão de não ter presença fiscal no Brasil: Natura/Avon, Minha BLZ, Mercado Livre Afiliados, Shopee BR (o ML permanece no site como comparação sem comissão).

## Fontes principais

- Awin merchant profiles: ui.awin.com/merchant-profile/29407 (Beleza na Web), 17659 (Boticário), 17658 (Natura), 17837 (Eudora), 21055 (Vult), 64086 (Pague Menos), 17919 (Araujo), 68224 (Drogal), 124568 (Osang)
- Feed Awin: developer.awin.com/docs/product-feed-publisher-guide-intro
- Sephora×Rakuten: sephora.com.br/regulamento-afiliados-sephora-rakuten.html
- Rakuten feeds/APIs: pubhelp.rakutenadvertising.com (Product Catalog + Product Search API)
- Case RD×Rakuten: rakutenadvertising.com/pt-br/resources/case-study-grupo-rd/
- Natura afiliados: afiliadosnatura.com.br | Natura/Avon na Shopee: mercadoeconsumo.com.br (03/07/2026)
- Shopee Open API: affiliate.shopee.com.br/open_api
- ML Afiliados: mercadolivre.com.br/l/afiliados-home (sem API de afiliados — reclamação registrada no Reclame Aqui)
- Amazon PA-API regra 10 vendas/30 dias: associados.amazon.com.br/help/topic/paapi + keywordrush.com/blog/amazon-pa-api-associatenoteligible-error
- Sallve: sallve.com.br/pages/q-a-afiliados-sallve + actionpay.com.br (oferta 16271)
- Minha BLZ: belezanaweb.com.br/minha-blz/
- Lomadee/A&EIGHT: meioemensagem.com.br (retomada do nome Lomadee)
