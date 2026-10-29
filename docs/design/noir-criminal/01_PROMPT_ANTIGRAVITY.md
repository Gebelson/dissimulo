# DISSIMULO — PROMPT MESTRE DE REDESIGN NOIR CRIMINAL

## CONTEXTO E OBJETIVO

Você está trabalhando em um projeto existente e funcional chamado **Dissimulo**, jogo mobile-first de investigação criminal, dedução social e assassinatos virtuais durante uma partida presencial. O visual atual parece tecnológico, genérico e pouco profissional. **Redesenhe a experiência inteira com a direção artística Noir Criminal**, seguindo os dois arquivos anexos `02_STYLE_GUIDE_NOIR_CRIMINAL.md` e `03_ESPECIFICACAO_TELAS.md` como fonte de verdade, além da imagem de referência aprovada pelo proprietário (colagem com dez telas de telefones em ambiente noir). A imagem é referência de ATMOSFERA e COMPOSIÇÃO, não licença para copiar elementos literalmente, sacrificar acessibilidade ou alterar regras do jogo.

O resultado deve parecer **um thriller de mistério jogável**, com dossiês, retratos de suspeitos, fotografia noturna, papel envelhecido, pistas e detalhes de tinta vermelha escura. **Não pode parecer SaaS, dashboard, terminal hacker, ficção científica ou app corporativo**. O objetivo não é criar um mockup bonito: é integrar a estética ao aplicativo real, com dados reais do jogo.

**Não recrie o projeto do zero. Não remova nem reescreva regras ou backend sem necessidade. Não abandone a tarefa após um plano ou screenshots.**

## 1. PREPARAÇÃO E SEGURANÇA

1. Inspecione dependências, routes, componentes, temas, assets, minigames, estados, chamadas de API e permissões por papel.
2. Verifique o estado do Git; não descarte trabalho não commitado. Crie branch de redesign e checkpoint restaurável.
3. Abra a aplicação existente no navegador, capture screenshots dos principais fluxos (mobile 320, 360, 390, 430 px; tablet 768 px; desktop), incluindo assassinato, vítima, Eco e anfitrião. Registre problemas de overflow, legibilidade, áreas de toque, estado e hierarquia.
4. Localize skills disponíveis em `.agent/skills`, `.agents/skills` e outros caminhos que o Antigravity documentar. Leia as instruções de **UI/UX Pro Max**, **Game UI/UX**, **Game UI Design**, **Mobile Game Dev**, **Game Feel**, **Player Onboarding** e **Impeccable** se estiverem instaladas. Não invente suporte, comandos ou sucesso de instalação; instale somente seguindo documentação verificada e informe dependências faltantes.
5. Estabeleça baseline de build, testes e screenshots antes de alterar a UI.

## 2. DIREÇÃO DE ARTE OBRIGATÓRIA

Identidade: **DISSIMULO — NOIR CRIMINAL**.

Palavras-chave: segredo, suspeita, silêncio, tensão, investigação, crime, dossier, recorte de jornal, envelope, tinta, papel antigo, retrato de personagem, luz baixa. Inspiração de linguagem: pôster cinematográfico de suspense + arquivo policial clássico reinterpretado como produto mobile contemporâneo.

Não usar como predominantes: neon ciano, hologramas, grids sci-fi, dashboards com KPIs, glassmorphism, gradientes coloridos, painéis de terminal, brilho RGB, sliders futuristas, bordas luminosas.

Usar o design system descrito no arquivo 02, com tokens implementados em CSS e componentes. Paleta: preto sépia e carvão como base; marfim quente para tipografia; vinho e vermelho seco para assassinato; latão envelhecido como destaque investigativo; verde dessaturado para neutralização; azul cinza muito escuro para Modo Eco. Typography: serif editorial SOMENTE em títulos e momentos dramáticos; sans legível para controles e textos; mono discreta para carimbos, códigos e horário.

**Priorizar clareza.** Textura de papel e arranhões apenas em fundos ou detalhes, nunca em cima de textos essenciais. Ilustração atmosférica não pode esconder CTAs. Respeitar contraste WCAG AA para controles/texto e reduzir animações quando preferido pelo sistema.

## 3. DESIGN SYSTEM E COMPONENTES

Criar/centralizar tokens em um único lugar e componentes reutilizáveis para:
- PageShell responsivo com safe areas, scroll e barra inferior.
- TopBar (voltar, marca/etapa, ações contextuais).
- PrimaryAction, SecondaryAction, DangerousAction com loading/disabled/focus.
- DossierCard, EvidenceCard, SuspectCard, MissionCard, CharacterPortrait.
- Seals: CONFIDENCIAL, EVIDÊNCIA, INTERDITADO, INVESTIGADO (sem usar badges decorativos em excesso).
- BottomSheet, modal de confirmação, toast, aviso urgente, indicador de rede.
- Timeline, alfinetes/conexões de dossiê, tags de fonte e verificação.
- Componentes de onboarding, empty state, skeleton, erro e reconexão.

Tamanhos de toque >=44x44 CSS px; botões de ação primária preferencialmente 48–56 px. Área de conteúdo sem obstrução do footer e safe area. Linha de leitura confortável. Fotografias e texturas devem ter versões leves e placeholders seguros. Sem emojis como iconografia principal.

## 4. ARQUITETURA MOBILE E NAVEGAÇÃO

Implementar mobile-first nos tamanhos 320×568, 360×640, 375×667, 390×844, 414×896, 430×932; tablet 768×1024; desktop 1024+. Validar dispositivos com teclado aberto, zoom, texto aumentado e orientação. Nenhum corte, sobreposição, scroll horizontal acidental, modal sem saída ou botão fora da viewport.

Barra inferior persistente na fase jogável: **Início / Missões / Explorar / Dossiê**, com seleção clara e ícones enxutos. Ações contextuais do assassino acessíveis em área PRIVADA, protegidas contra exibição casual; não criar quinta aba fixa desnecessária. Organizar tarefas pelo que é relevante agora, nunca apenas por ordem cronológica. Rotas e histórico de navegação consistentes. Modais sensíveis com fechar/voltar claro.

A interface deve levar o jogador a descobrir o que fazer em segundos, sem perder clima. Evitar textos longos no fluxo principal e fornecer detalhes quando solicitados.

## 5. REFAÇA TODAS AS TELAS (VER ARQUIVO 03)

Revisar e implementar, sem deixar telas com o tema anterior: abertura; entrar/criar sala; lobby; revelar papel; início da partida; missões/lista; missão/detalhes; minigames; explorar/casa; investigar cômodo; evidência encontrada; arquivo de evidências; dossiê e conexões; suspeitos; assassino/seleção; armadilha ativa; aviso de neutralização; morte; descoberta do corpo; reunião; votação; modo Eco; resultado/reconstituição; configurações do anfitrião; calibração indoor; desconexão/erro.

**Telas-âncora da imagem aprovada**: tela inicial com casa noturna; lobby com retratos envelhecidos; missão como carta confidencial; assassino com atmosfera vinho escuro; evidências como arquivos e fotos; dossiê como mural de investigação com linhas; morte minimalista e dramática; reunião com votação clara; Eco em paleta azul acinzentada; minigame de impressão digital estilizado. Preserve a atmosfera, mas não use uma mansão como se fosse planta real da casa: a casa é apenas arte narrativa.

## 6. NÃO QUEBRAR REGRAS CRÍTICAS

Preserve API, estado e sincronização multiplayer. Se for inevitável alterar contratos, faça migração e testes.

- Assassino escolhe livremente um sobrevivente alvo e cria missão falsa.
- Apenas **uma armadilha ativa por assassino**.
- Vítima **morre imediatamente quando inicia** a missão falsa armadilhada ativa, após validação das condições. Apenas ver a missão não mata.
- Vítima **nunca pode receber** missão que direta ou indiretamente neutralize a própria armadilha.
- Outros sobreviventes elegíveis neutralizam por missões legítimas; neutralizador e assassino recebem avisos privados. Assassino não identifica automaticamente quem desarmou.
- Armadilha resolvida libera nova criação, respeitando limites da partida.
- Missões podem ser recebidas em qualquer lugar; **evidências são coletadas investigando cômodos específicos**.
- Localização indoor via beacon quando disponível, com modo manual funcional; UI não pode fingir precisão que não possui.
- Modo Eco, reuniões, votação e desfecho permanecem funcionais.
- **Missões falsas e verdadeiras indistinguíveis visualmente para a vítima.** Não vazar estado secreto em props, JS, DOM, payload ou notificações.

## 7. GAME FEEL, ÁUDIO E ASSETS

Adicionar feedback controlado para entrar, criar sala, revelar papel, nova missão, evidência recuperada, conclusão de minigame, armadilha neutralizada, morte, descoberta de corpo, reunião e julgamento. Estilo: seco, contido e tenso. Sem flashes agressivos ou efeitos de sangue explícitos; violência apenas sugerida. Usar áudio opcional, vibração onde suportada e `prefers-reduced-motion`.

Criar um pacote de assets originais/licenciados: logo Dissimulo, monograma D, fundo noturno, textura de papel, polaroids genéricas, ícones, carimbos, fragmentos de documento, linhas e alfinetes, estados do jogador, cartas de missão, cenas do julgamento. Usar máscaras, CSS, SVG e imagens otimizadas WebP/AVIF; licenças documentadas em `ASSET_LICENSES.md`. Não reproduzir personagens ou fotos de pessoas reais sem autorização.

## 8. PROCESSO DE IMPLEMENTAÇÃO OBRIGATÓRIO

1. Auditar e registrar baseline visual.
2. Criar tokens + componentes compartilhados.
3. Redesenhar primeiro três telas âncora (Inicial, Missões, Dossiê), capturar screenshots e avaliar a linguagem.
4. Aplicar consistentemente ao restante das telas, incluindo estados de papel e todos os minigames.
5. Testar todas as rotas, states, ações e conexões reais.
6. Revisar screenshot **antes/depois** em todas as larguras; detectar overflow, contraste, teclado, safes areas, erros e travamentos.
7. Rodar testes existentes e adicionar regressões. Validar ao menos um fluxo de oito clientes em simulação multiplayer quando disponível.
8. Executar auditoria visual final com Impeccable ou processo equivalente e corrigir achados.
9. Entregar relatório `REDESIGN_REPORT.md` com screenshots reais, links internos, arquivos alterados, testes executados e limitações.

## 9. CRITÉRIOS DE ACEITAÇÃO

- Toda tela usa o mesmo design system e linguagem noir.
- Um participante novo consegue entrar, localizar missão, investigar e votar com navegação intuitiva.
- Não há UI tech/corporativa dominante.
- Não há telas cortadas/overflows nas larguras definidas.
- Minigames são jogáveis por toque, não peças de decoração.
- Identidades e dados secretos não vazam, e as missões falsas parecem legítimas.
- Build/testes/regressões passam; não se afirma teste não executado.
- Screenshots reais de todos os fluxos principais foram revisadas.
- Contraste, foco, touch targets e opções de movimento reduzido passam na auditoria.
- Nenhuma regra do jogo foi sacrificada por estética.

**EXECUTE NO CÓDIGO REAL AGORA. Não pare em um conceito ou outro plano. O resultado final deve parecer um thriller interativo premium que as pessoas jogam de verdade no celular.**
