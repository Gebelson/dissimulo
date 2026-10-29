# Balanceamento de Partida e Conteúdo — ÁLIBI

## 1. Tabela de Dimensionamento (4 a 20 Jogadores)

| Jogadores (N) | Assassinos | Detetive | Médico | Técnico | Informante | Civis | Máx. Mortes | Missões Totais | Pistas Disponíveis |
|---|---|---|---|---|---|---|---|---|---|
| **4** | 1 | 1 | 0 | 0 | 0 | 2 | 1 | 12 | 6 |
| **5** | 1 | 1 | 1 | 0 | 0 | 2 | 1 | 15 | 8 |
| **6** | 1 | 1 | 1 | 1 | 0 | 2 | 1 | 18 | 9 |
| **7** | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 21 | 11 |
| **8 (Padrão)** | **1** | **1** | **1** | **1** | **1** | **3** | **2** | **24** | **12** |
| **10** | 2 | 1 | 1 | 1 | 1 | 4 | 3 | 30 | 15 |
| **12** | 2 | 1 | 1 | 1 | 1 | 6 | 3 | 36 | 18 |
| **16** | 3 | 2 | 2 | 1 | 1 | 7 | 4 | 48 | 24 |
| **20** | 3 | 2 | 2 | 2 | 2 | 9 | 5 | 60 | 30 |

---

## 2. Conteúdo da Partida Padrão (8 Jogadores)

### Missões (24 programadas)
- **17 Investigativas:** Recuperação de arquivos, checagem de logs, comparação pericial e decodificação.
- **5 de Sobrevivência / Proteção:** Restauração de circuitos, estabilização de frequência e autenticação de relés (capazes de neutralizar armadilhas).
- **2 Posições de Armadilha:** Reservadas para as ações clandestinas do assassino.

### Provas Materiais (12 pistas potenciais)
- **4 Provas Nucleares:** O conjunto mínimo matematicamente necessário para isolar o assassino por meio de interseção de suspeitos e contradição de álibis.
- **6 Provas Contextuais:** Corroboram horários, acessos e trajetos, apontando para múltiplos suspeitos plausíveis.
- **2 Distratores Honestos:** Fatos reais inocentes (ex: crachá de manutenção antigo, visita autorizada à despensa) que parecem suspeitos à primeira vista, mas não forjam fatos inexistentes.

---

## 3. Verificador de Solucionabilidade (Solvability Verifier)

O servidor executa o algoritmo `SolvabilityVerifier` a cada coleta ou perda de evidência:

1. Identifica os suspeitos vivos compatíveis com todas as pistas nucleares autenticadas disponíveis.
2. Verifica se o conjunto intersecta e isola o verdadeiro assassino.
3. Se um sobrevivente morrer antes de recolher uma pista nuclear essencial, o motor de eventos **redireciona** uma prova equivalente para outro cômodo acessível, garantindo que a partida nunca se torne insolúvel por azar ou eliminação prematura.
