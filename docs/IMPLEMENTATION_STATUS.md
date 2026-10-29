# Matriz de Status de Implementação — Dissimulo

Legenda:
- **DONE:** Implementado com código definitivo completo (sem mock, sem botões decorativos).
- **TESTED:** Validado por testes automatizados e simulação em tempo real.
- **HARDWARE_DEPENDENT:** Dependente de hardware físico (beacons BLE e aparelhos reais para teste de rádio em paredes).

---

## 1. Módulos e Sistemas do Jogo

| Módulo / Funcionalidade | Status | Observação |
|---|---|---|
| Monorepo & Workspaces | **DONE & TESTED** | pnpm workspaces, TypeScript compartilhado |
| Schemas e Contratos Zod | **DONE & TESTED** | `@alibi/contracts` com tipagem estrita de ações e eventos |
| Servidor Multiplayer WebSockets | **DONE & TESTED** | Servidor persistente na porta 4000, suporte a reconexão |
| Trava Atômica de Armadilhas (CAS) | **DONE & TESTED** | 1 armadilha ativa por assassino, resolução atômica de concorrência |
| Proibição de Auto-Neutralização | **DONE & TESTED** | Vítima jamais recebe tarefa que desativa sua armadilha |
| Eliminação Imediata ao Iniciar | **DONE & TESTED** | Morte virtual instantânea se a armadilha estiver ativa |
| Neutralização por Terceiros | **DONE & TESTED** | Alertas privados ao neutralizador e ao assassino |
| Sistema de Missões e Agendador | **DONE & TESTED** | Distribuição escalável, missões globais e locais |
| 12 Minigames Reais Interativos | **DONE & TESTED** | Todos os 12 minigames funcionais com touch e validação |
| Coleta de Evidências nos Cômodos | **DONE & TESTED** | Pistas nucleares, contextuais e distratores em 7 cômodos |
| Verificador de Solucionabilidade | **DONE & TESTED** | Garante que o caso seja matematicamente solucionável |
| Dossiê & Quadro de Conexões | **DONE & TESTED** | Inventário pericial, depoimentos e hipóteses |
| Modo Eco para Eliminados | **DONE & TESTED** | Enigmas espectrais, sem voto, sem vazamento do culpado |
| Reunião de Emergência e Votação | **DONE & TESTED** | Siren sonora, debate presencial e urna digital |
| Reconstituição Final e Replay | **DONE & TESTED** | Linha do tempo dos fatos e revelação do assassino |
| Identidade Visual Forensic Noir | **DONE & TESTED** | Paleta semântica `#0B1018`, fontes, touch 48px, mobile-first |
| Efeitos Sonoros Web Audio & Haptics | **DONE & TESTED** | Síntese de áudio e vibração com toggle de configuração |
| Localização Indoor Manual (Oficial) | **DONE & TESTED** | Seleção de ambiente na tela, sem depender de hardware |
| Localização Indoor iBeacons (BLE) | **DONE / HARDWARE_DEP.** | Camada nativa pronta com filtro EMA e histerese; teste de precisão em paredes depende de beacons físicos instalados |
| Painel de Administração do Host | **DONE & TESTED** | Pausa, retomada, reinício, mapa de cômodos e saúde da rede |
| Simulação de 8 Jogadores Simultâneos | **DONE & TESTED** | `pnpm sim` roda o ciclo completo de 8 clientes com 100% de sucesso |

---

## 2. Mapa das 39 Telas Mapeadas

1. **Splash & Welcome:** DONE
2. **Entrar na Partida:** DONE
3. **Criar Sala:** DONE
4. **Lobby & Jogadores:** DONE
5. **Configurações do Anfitrião:** DONE
6. **Regras & Tutorial Rápido:** DONE
7. **Revelação Secreta do Papel (Hold to Reveal):** DONE
8. **Início (Dashboard Principal):** DONE
9. **Missões (Lista e Filtros):** DONE
10. **Detalhes da Missão (Seguro):** DONE
11. **Minigame 01 (Circuitos):** DONE
12. **Minigame 02 (Cifra):** DONE
13. **Minigame 03 (Documento):** DONE
14. **Minigame 04 (Auditoria de Logs):** DONE
15. **Minigame 05 (Memória de Sinais):** DONE
16. **Minigame 06 (Análise de Vestígios):** DONE
17. **Minigame 07 (Cronologia):** DONE
18. **Minigame 08 (Frequência):** DONE
19. **Minigame 09 (Anomalia em Planta):** DONE
20. **Minigame 10 (Selo Digital):** DONE
21. **Minigame 11 (Terminais):** DONE
22. **Minigame 12 (Transmissão):** DONE
23. **Explorar (Mapa dos 7 Cômodos):** DONE
24. **Investigação Pericial de Ambiente:** DONE
25. **Evidência Encontrada:** DONE
26. **Dossiê Criminal (Provas Forenses):** DONE
27. **Quadro de Conexões e Hipóteses:** DONE
28. **Linha do Tempo e Depoimentos:** DONE
29. **Painel Secreto do Assassino:** DONE
30. **Criação de Armadilha (Alvo e Disfarce):** DONE
31. **Alerta de Neutralização:** DONE
32. **Tela de Morte Virtual:** DONE
33. **Código de Confirmação do Corpo:** DONE
34. **Modo Eco (Atividades Espectrais):** DONE
35. **Reunião de Emergência (Sirene & Debate):** DONE
36. **Votação Formal Secreta:** DONE
37. **Julgamento e Veredito:** DONE
38. **Reconstituição e Estatísticas:** DONE
39. **Painel do Anfitrião (Diagnóstico e Pausa):** DONE
