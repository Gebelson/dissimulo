# Dissimulo — Ninguém tem a história inteira

> **Jogo completo de dedução social e investigação criminal presencial em tempo real, controlado por smartphone.**

O **Dissimulo** acontece fisicamente em uma casa real de sete cômodos. Cada jogador utiliza seu próprio smartphone, recebe informações secretas, realiza missões forenses, soluciona desafios em minigames reais, coleta evidências físicas nos ambientes e interage presencialmente com os demais para desvendar o assassino antes do tempo esgotar.

---

## ⚡ Como Rodar e Jogar Hoje (8 Pessoas na Mesma Casa)

O projeto foi projetado com prioridade mobile-first e arquitetura web/PWA conectada a um servidor persistente Node.js com WebSockets.

### 1. Pré-requisitos
- Node.js v20+ ou v24+
- `pnpm` (ou `npm`)

### 2. Inicialização Rápida

Na raiz do projeto:

```bash
# 1. Instalar dependências de todos os pacotes
pnpm install

# 2. Executar a suíte de testes automatizados (27 testes de regras e minigames)
pnpm test

# 3. Executar o simulador de 8 jogadores simultâneos
pnpm sim

# 4. Iniciar o servidor de jogo e o cliente web mobile simultaneamente
pnpm dev
```

- **Servidor Multiplayer:** `http://localhost:4000` (WebSocket em `ws://localhost:4000`)
- **Web Mobile Client:** `http://localhost:3000`
- **Acesso na Rede Local (Wi-Fi):** Basta os 8 jogadores conectarem no IP da máquina (ex: `http://192.168.1.100:3000`) pelo navegador do celular!

---

## 🎮 Os 8 Minigames Forenses (Mobile-First, 5 a 15 segundos)

1. **Reconectar Circuito (`circuit_reconnect`):** Conexão rápida de fios coloridos (Carmesim, Latão, Ardósia, Cobre) em caixa de fusíveis de época.
2. **Analisar Digital (`fingerprint_match`):** Alinhamento tátil de 3 fatias de impressão digital sob lente pericial.
3. **Abrir Arquivo (`archive_lock`):** Giro de disco mecânico de segredo até a posição indicada na evidência.
4. **Restaurar Energia (`timing_power`):** Acionamento do galvanômetro no instante de tolerância com um toque.
5. **Recuperar Documento (`doc_reconstruct`):** Recomposição de 3 a 4 fragmentos de relatório confidencial rasgado.
6. **Decifrar Código (`cipher_breaker`):** Inserção de senha curta em teclado mecânico obtida em telegrama pericial.
7. **Interceptar Sinal (`signal_memory`):** Repetição de sequência de 3 a 4 pulsos luminosos de telégrafo.
8. **Analisar Evidência (`evidence_analysis`):** Identificação de discrepâncias e adulterações entre fotografias da cena.

---

## 🏛️ Estrutura do Monorepo

```
dissimulo/
├── apps/
│   ├── web/             # Frontend React 18 + Vite + Tailwind CSS (Identidade Noir Criminal)
│   ├── game-server/     # Servidor multiplayer com WebSockets, lock atômico e CAS
│   └── mobile/          # Estrutura nativa Capacitor Android & iOS com iBeacon BLE
├── packages/
│   ├── contracts/       # Schemas Zod, tipos TypeScript, DTOs e mensagens tipadas
│   ├── game-engine/     # Regras puras, máquina de estados, agendador atômico de armadilhas
│   ├── minigames/       # 8 minigames interativos com validação algorítmica e retrocompatibilidade
│   ├── location/        # Provedores de cômodo: ManualRoomProvider, BeaconRoomProvider, DevSimulator
│   └── evidence-engine/ # Grafo investigativo, cruzamento pericial e detecção de contradições
├── tests/               # Suíte Vitest (27 testes de invariantes e minigames)
└── docs/                # Documentação técnica e design system Noir Criminal
```

---

## 🔍 Invariantes Críticas de Regras

1. **Apenas 1 Armadilha Ativa:** O assassino só pode manter exatamente uma armadilha armada por vez no servidor, garantida por trava atômica.
2. **Eliminação Imediata:** Se a vítima tocar em **"Iniciar missão"** na missão disfarçada armada, ela morre virtualmente no mesmo milissegundo. Nenhum minigame é aberto e nenhum aviso prévio é dado.
3. **Visualizar Detalhes Não Mata:** O jogador pode ler o texto da missão e seus requisitos com total segurança.
4. **Proibição Absoluta de Auto-Neutralização:** A vítima **jamais** recebe, mantém ou conclui missão capaz de desativar sua própria armadilha. O agendador do servidor valida todas as tarefas pendentes e futuras antes da ativação.
5. **Neutralização por Terceiros:** Outro sobrevivente vivo pode neutralizar a armadilha por meio de uma missão legítima, recebendo confirmação privada e liberando imediatamente o slot do assassino para armar novamente.
6. **Modo Eco:** Jogadores mortos descobertos participam como Ecos, resolvendo quebra-cabeças espectrais, mas perdem direito a voto e não revelam o assassino.
7. **Modo Manual Oficial:** Não exige beacons para jogar hoje. O seletor manual de cômodo funciona perfeitamente em qualquer smartphone.
