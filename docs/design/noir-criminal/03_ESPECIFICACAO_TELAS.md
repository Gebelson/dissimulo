# DISSIMULO — ESPECIFICAÇÃO TELA POR TELA

**Referência:** colagem de 10 telas aprovada pelo usuário. Todos os elementos retratados são inspiração visual; comportamentos reais devem ser conectados ao estado da partida.

## ESTRUTURA GLOBAL

Fase de entrada: sem navbar persistente. Fase de jogo: footer **Início / Missões / Explorar / Dossiê**, com áreas secretas via ação contextual apenas para papéis autorizados. Margens 16–20 px; header útil; conteúdo rolável. Aplicar identidade Noir Criminal e requisitos do style guide.

### 1. Tela inicial — hero de mistério
- **Composição:** fotografia/ilustração noturna com casa enigmática, vinheta, logo serif DISSIMULO, frase ‘Ninguém tem a história inteira.’; duas ações bem claras `Entrar em partida` e `Criar partida`.
- **UX:** CTA acessível sem rolagem em telefone curto; ajuda e configurações discretas; offline visível se necessário.
- **Evitar:** hero gigante que empurra o botão para fora da tela, casa apresentada como planta real do usuário.

### 2. Entrar ou criar partida
- **Composição:** painel curto como ficha de arquivo, campo código em destaque, nome/avatar e ação primária; estados de erro de sala.
- **UX:** teclado numérico para códigos quando apropriado, copiar/colar convite, validação inline, cancelar/voltar.

### 3. Lobby / participantes
- **Composição:** grade 2×N de retratos/fichas como na imagem aprovada, nome e prontidão; cabeçalho com código da sala e cópia; contador dos jogadores; ação do anfitrião no rodapé sem obstrução.
- **UX:** conectar/reconectar, nomes longos, espera por pessoas, convidar; quem não é host vê estado e não botão de iniciar.
- **Evitar:** nomes e fotos de personagens fictícios confundidos com identidade dos participantes reais.

### 4. Revelação secreta do papel
- **Composição:** carta cinematográfica com símbolo, papel e frase de objetivo; assassino recebe cor vinho, demais papéis têm cores contidas.
- **UX:** tela de privacidade `Toque e segure para revelar` opcional; confirmação do jogador; não expor segredo em notificações ou preview do app.

### 5. Início da partida / estado atual
- **Composição:** título de capítulo do caso, tempo, estado coletivo, missão prioritária, últimos acontecimentos públicos; espaço de suspense moderado.
- **UX:** mostrar a próxima ação em até um olhar; navegação inferior fixa; não despejar 10 cards iguais.

### 6. Missões / lista
- **Composição:** categorias `Disponíveis`, `Em andamento`, `Concluídas`; missões como pequenas ordens confidenciais; prioridade visual sem mostrar natureza falsa.
- **UX:** objetivos, prazo quando existir, destino opcional, progresso, CTA; estados vazios com orientação.

### 7. Missão / detalhes
- **Composição:** documento em papel envelhecido como a tela 3 da referência; cabeçalho `ORDEM RECEBIDA`, breve instrução, possível recompensa e CTA `Iniciar missão`.
- **UX:** texto curto, tutorial no primeiro acesso, validação de cômodo quando necessário; **missões verdadeiras e falsas visualmente idênticas**. Se a missão for fatal e ativa, morte no toque de iniciar (validação servidor).

### 8. Minigames — moldura geral
- **Composição:** área de jogo central de grande contraste, instrução de uma frase, botão de ajuda, tempo se houver, feedback de sucesso/falha; impressão digital como referência de atmosfera, não restrição temática.
- **UX:** adaptado a toque, 320 px, orientação vertical, estado salvo/reconexão conforme regras.
- **Aplicação:** os 12 minigames existentes devem compartilhar um quadro visual consistente, mas manter gameplay próprios.

### 9. Explorar / mapa de cômodos
- **Composição:** cartões/diagrama de ambientes personalizados para varanda, sala, escritório, suíte, banheiro social, cozinha, piscina; presença atual destacada sem neon.
- **UX:** localizar-se, selecionar ambiente, ir a investigar. Mostra `presença estimada` ou `manual`, nunca precisão fictícia. Não revela antecipadamente quais cômodos têm pista valiosa.

### 10. Investigar cômodo
- **Composição:** título do ambiente, foto/ilustração contextual opcional, 2–4 ações de investigação e registros descobertos.
- **UX:** coleta exige validação de presença quando aplicável; estados `não disponível`, `já investigado`, `novo vestígio` com explicação. Quarto/banheiro podem ter pontos externos; piscina somente área seca.

### 11. Evidência encontrada
- **Composição:** ficha que aparece em breve revelação, selo e carimbo; título legível, origem, código e fragmento descoberto.
- **UX:** opção `Examinar` e `Guardar no dossiê`; não forçar animação longa; informação que comprova fato vs. hipótese deve ser distinguida.

### 12. Arquivo de evidências
- **Composição:** grade/lista 2 colunas com recortes, fotos e documentos como a tela 5, com filtros por tipo/origem/caso.
- **UX:** cards responsivos; texto legível em 320 px; imagens decorativas não escondem valor da evidência.

### 13. Dossiê do caso / quadro de conexões
- **Composição:** mural com fotos de suspeitos, bilhetes, carimbos e fios discretos como na tela 6; não repetir fios por todos os módulos.
- **UX:** no mobile, alternar `Visão geral`, `Linha do tempo`, `Conexões`; permitir abrir relação em sheet/lista acessível sem exigir pan/zoom extensos. Documentar origem e confiabilidade.

### 14. Detalhes do suspeito
- **Composição:** retrato maior, nome, depoimentos públicos, evidências associadas, linha temporal parcial.
- **UX:** registrar hipótese e compartilhar sem declarar culpabilidade que o servidor ainda não revelou.

### 15. Painel secreto do assassino
- **Composição:** fundo carvão/vinho, silhueta abstrata, título `ESCOLHA SUA PRÓXIMA VÍTIMA`, lista de sobreviventes em cartões compactos; referências à tela 4.
- **UX:** privacidade, seleção de alvo, modelo de missão falsa, condições, confirmação de armadilha; indicação clara `0/1` ou `1/1`. Não exibir ação habilitada durante armadilha ativa. Não expor via notificações de lock screen.

### 16. Armadilha ativa / neutralização
- **Composição:** cartão de operação em andamento e estado; em neutralização, registro fechado com selo vermelho para assassino e confirmação protetiva para neutralizador.
- **UX:** assassino não descobre automaticamente desarmador; vítima não recebe aviso de que quase morreu; missão desarmada pode continuar inofensiva.

### 17. Tela de morte
- **Composição:** espaço escuro quase vazio, marca vermelha abstrata/silhueta, título `VOCÊ FOI ASSASSINADO`, passo seguinte; referência à tela 7.
- **UX:** imediato e privado, sem contato físico; não atrapalhar a continuidade. Instrução para aguardar descoberta do corpo, se regra atual.

### 18. Descoberta do corpo
- **Composição:** ocorrência em vermelho seco e documentos, nome público da vítima, hora, opção `Convocar reunião` ou confirmação de encontro.
- **UX:** confirmar a descoberta com código temporário entre aparelhos ou mecanismo existente, sem QR obrigatório; prevenir denúncias falsas.

### 19. Reunião de emergência
- **Composição:** título editorial `REUNIÃO`, contagem regressiva vermelho discreto, rostos dos suspeitos, regras resumidas.
- **UX:** todos consultam dossiê, discussão presencial livre; estados `debate`, `votação` e `resultado` claros.

### 20. Votação
- **Composição:** lista de retratos com `Votar`, ação `Pular`, destaque somente na seleção, como tela 8.
- **UX:** não votar em mortos, confirmação se necessário, impedir votos duplos, esconder contagens conforme regras.

### 21. Modo Eco
- **Composição:** azul-carvão frio, personagem/forma translúcida ou fundo de névoa leve, opções exclusivas `Memórias`, `Fragmentos`, `Acompanhar`, referência à tela 9.
- **UX:** morto continua jogando sem influenciar indevidamente os vivos; não enviar informações secretas.

### 22. Resultado e reconstituição
- **Composição:** abertura de dossiê `CASO ENCERRADO`, revelação final, sequência cronológica de cartões/horários/ações, vitórias e estatísticas discretas.
- **UX:** tocar para avançar, pular cenas, exportar resumo quando existente; não mostrar dados inventados.

### 23. Painel do anfitrião
- **Composição:** visual noir ainda consistente, mas mais objetivo; usar listas, switches e formulários de fácil leitura. Separar configuração de jogo de informações secretas.
- **UX:** criar sala, escolher 4–20 jogadores, configurar fases, cômodos, dificuldade, localização, recomeçar/encerrar com proteção e feedback.

### 24. Calibração de localização indoor
- **Composição:** mapa simples dos cômodos e leitura de sinais representada sem animação sci-fi; status real de beacon e modo manual.
- **UX:** explicar `estimativa de proximidade`, falta de permissões, como testar e confirmar ambiente; fallback sempre utilizável.

### 25. Offline, erro, carregamento e reconexão
- **Composição:** curtíssimo aviso narrativo (`A conexão com o caso foi interrompida`), CTA `Reconectar` e estado seguro.
- **UX:** conservar sessão, evitar estado falso de missão concluída/morte, nunca mostrar papel errado; `loading` claro.

## CHECKLIST PARA APROVAÇÃO DE CADA TELA

- Está coerente com o Noir Criminal, sem dashboard/sci-fi?
- Legível e tocável com uma mão em 320–430 px?
- CTA primário é visível e ação compreensível?
- Elementos não cobrem safe areas e nav?
- Há estados de erro, loading, vazio e offline?
- Foto, papel, tinta e texturas não prejudicam leitura?
- O que aparece corresponde a dados reais e permissões do jogador?
- Não revela papel, armadilha ou pista oculta indevidamente?
- Screenshot real foi revisada e problemas corrigidos?
