# Regras Completas do Jogo — Dissimulo

## 1. Visão Geral
- **Gênero:** Dedução social, investigação criminal presencial e sobrevivência.
- **Participantes:** 4 a 20 jogadores (configuração principal: **8 jogadores**).
- **Ambiente:** Uma residência real com 7 cômodos mapeados.
- **Duração:** 35 a 50 minutos.
- **Princípio:** Todos os assassinatos e sabotagens são **100% virtuais**. Proibido qualquer contato físico, toque corporal ou encenação de agressão.

---

## 2. A Casa e os 7 Ambientes

| Ambiente | Categoria | Função Investigativa | Regra Física de Segurança |
|---|---|---|---|
| **Sala** | Social | Ponto central de reuniões e depoimentos | Ponto de encontro de todos os participantes |
| **Escritório** | Pericial | Terminais, logs de acesso e credenciais | Interação virtual no smartphone |
| **Varanda** | Trânsito | Mensagens interceptadas e rádio | Sinal de rádio sujeito a paredes |
| **Suíte** | Privado | Arquivos e credenciais | **Interação na porta**. Nunca invadir privacidade |
| **Banheiro Social** | Privado | Vestígios indiretos | **Interação na porta**. Não exige entrada física |
| **Cozinha** | Social | Dispositivos digitais e relés | **Nunca tocar em trituradores, tomadas ou gás** |
| **Área da Piscina** | Externo | Monitoramento perimetral | **Zona seca segura**. Proibido entrar na água ou correr |

---

## 3. Papéis para 8 Jogadores

1. **Assassino (1):**
   - Cria armadilhas fatais disfarçadas de missões normais contra qualquer sobrevivente.
   - Pode manter no máximo 1 armadilha ativa por vez.
   - Tenta eliminar até 2 vítimas sem ser descoberto nas reuniões.

2. **Detetive (1):**
   - Possui ferramentas de perícia ampliada para correlacionar evidências e logs de horários.
   - Não recebe a identidade do assassino pronta; precisa investigar.

3. **Médico (1):**
   - Recebe missões de proteção preventiva que neutralizam armadilhas ativas.
   - Pode ser alvo do assassino como qualquer outro participante.

4. **Técnico (1):**
   - Especializado em reparos de circuitos, restauração de frequências e inspeção de esquemas.

5. **Informante (1):**
   - Recebe fragmentos de mensagens interceptadas e decide com quem negociar álibis.

6. **Civis (3):**
   - Coletam evidências nos cômodos, cumprem tarefas de manutenção e podem desativar armadilhas por meio de missões compatíveis.

---

## 4. O Sistema de Armadilhas (Regra Suprema)

- O assassino abre seu painel secreto, escolhe um sobrevivente vivo e um modelo de missão disfarçada.
- A vítima recebe a missão no seu aplicativo. O visual, o ícone e o texto são idênticos aos de uma missão legítima.
- **Se a vítima tocar em "Iniciar missão" enquanto a armadilha estiver armada, morre virtualmente no mesmo instante.** Nenhum minigame abre.
- **Tocar em "Detalhes" não mata.** A leitura das instruções é segura.
- **A vítima JAMAIS recebe uma missão capaz de neutralizar sua própria armadilha.** O servidor bloqueia essa possibilidade em nível de banco/agendador.
- Outro sobrevivente pode concluir uma missão neutralizadora:
  - A armadilha é desativada.
  - A vítima não morre e sua missão vira um minigame inofensivo.
  - O neutralizador recebe aviso privado de que impediu um crime.
  - O assassino recebe aviso privado de que sua armadilha caiu (sem saber quem desarmou).
  - O slot do assassino é liberado para criar outra armadilha.

---

## 5. Morte, Descoberta do Corpo e Modo Eco

- Quando a vítima morre, a tela do celular entra em colapso com um **Código de Confirmação de 4 dígitos** (ex: `8421`).
- A vítima permanece em silêncio no cômodo.
- Quando outro participante entrar no cômodo e encontrar a vítima, solicita o código e toca em **"Reportar Corpo"**.
- O alarme soa em todos os celulares da casa e uma **Reunião de Emergência** é iniciada na Sala.
- A vítima transiciona para o **Modo Eco**: continua jogando, resolvendo quebra-cabeças espectrais no celular, mas perde o direito de voto e não pode revelar quem a matou.

---

## 6. Julgamento e Veredito

- Durante a reunião, todos debatem presencialmente seus álibis e as provas coletadas.
- Em seguida, abre-se a votação com sigilo digital no aplicativo.
- O mais votado vai a julgamento:
  - Se os sobreviventes acusarem o verdadeiro Assassino: **Vitória dos Sobreviventes!**
  - Se acusarem um inocente ou o Assassino atingir o limite de eliminações: **Vitória do Assassino!**
- Ao término, o aplicativo exibe a **Reconstituição Cronológica Completa** de tudo o que aconteceu na casa.
