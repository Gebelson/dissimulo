# GUIA DEFINITIVO: CONEXÃO MULTIPLAYER E HOSPEDAGEM DO DISSIMULO

Este documento explica como funciona a infraestrutura multiplayer do **Dissimulo**, como jogar presencialmente em rede local (Wi-Fi) com 8 celulares e como configurar o deploy de produção de forma profissional.

---

## 1. ARQUITETURA MULTIPLAYER

O Dissimulo é composto por:

- **Frontend Web (`apps/web`):** Aplicação SPA em React 18 + Vite + Tailwind CSS. Pode ser hospedada estaticamente em qualquer CDN ou plataforma (Vercel, Cloudflare Pages, Netlify).
- **Backend Multiplayer Game Server (`apps/game-server`):** Processo Node.js persistente com servidor HTTP nativo e WebSockets (`ws`). Mantém a autoridade total sobre o estado do jogo (armadilhas, sorteio de papéis, missões fatais, votações e evidências).

### Por que a Vercel sozinha não suporta WebSockets persistentes?
A Vercel é uma plataforma orientada a **Serverless Functions** (funções efêmeras com tempo de execução limitado a alguns segundos). Jogos multiplayer com partidas contínuas de 40 minutos e sincronização de 8 jogadores exigem um **processo em memória persistente** com conexões TCP/WebSocket ativas.

Portanto:
- **Frontend:** Hospedado na Vercel (ou executado localmente via Vite).
- **Backend:** Hospedado em um serviço compatível com processos persistentes (Render, Railway, Fly.io ou VPS Docker) OU executado no computador anfitrião na rede Wi-Fi.

---

## 2. DESENVOLVIMENTO LOCAL INTEGRADO (1 COMANDO)

Para iniciar o frontend e o backend simultaneamente com recarregamento a quente:

```bash
pnpm dev
```

Este comando utiliza `concurrently` para iniciar em paralelo:
- **Backend Game Server:** `http://0.0.0.0:4000` (WebSocket ativo em `ws://0.0.0.0:4000`)
- **Frontend Vite:** `http://0.0.0.0:3000` (Acessível na rede local pelo IP da sua máquina)

Ambos os serviços estarão prontos para receber conexões imediatamente.

---

## 3. JOGANDO PRESENCIALMENTE COM 8 CELULARES NA MESMA CASA (WI-FI)

Não é necessário publicar o jogo na internet para uma partida presencial!

1. Conecte o computador e os celulares na **mesma rede Wi-Fi**.
2. No computador anfitrião, execute:
   ```bash
   pnpm dev
   ```
3. O terminal exibirá o endereço de rede, por exemplo:
   ```
   ➜ Network: http://192.168.1.15:3000/
   ```
4. Cada participante abre o navegador do celular e acessa `http://192.168.1.15:3000`.
5. O frontend detecta automaticamente o IP `192.168.1.15` e conecta a `ws://192.168.1.15:4000`.
6. O anfitrião clica em **"Criar Nova Partida"** e informa o código (ex: `CASA8`). Os outros 7 jogadores digitam seus codinomes, o código `CASA8` e tocam em **"Conectar ao Caso"**.

### Se o Firewall do Windows bloquear a porta 4000:
Na tela inicial do jogo, o jogador pode clicar no botão **"Servidor"** no topo ou, caso ocorra falha, em **"Configurar Servidor"**. O sistema permite inserir manualmente o endereço desejado e possui o botão **"Testar Conexão"**, que mede a latência em milissegundos.

---

## 4. DEPLOY DE PRODUÇÃO EM NUVEM (HTTPS / WSS)

### Passo 1: Hospedar o Backend Multiplayer (Render ou Railway)

#### Opção A: Render (Gratuito com Docker)
1. Crie uma conta em [render.com](https://render.com).
2. Conecte o repositório GitHub `Gebelson/dissimulo`.
3. Crie um novo **Web Service**.
4. Selecione a opção **Docker** e informe o caminho do Dockerfile:
   - **Dockerfile Path:** `apps/game-server/Dockerfile`
5. Em **Environment Variables**, adicione:
   - `PORT`: `4000`
   - `HOST`: `0.0.0.0`
6. O Render fornecerá uma URL pública HTTPS/WSS, por exemplo:
   `https://dissimulo-server.onrender.com`

#### Opção B: Railway
1. Crie uma conta em [railway.app](https://railway.app).
2. Crie um **New Project** a partir do GitHub `Gebelson/dissimulo`.
3. O Railway detectará o arquivo `railway.json` na raiz e compilará o `apps/game-server/Dockerfile`.
4. Em **Networking**, gere um domínio público, por exemplo:
   `dissimulo-server.up.railway.app`

### Passo 2: Configurar o Frontend na Vercel
1. No painel do seu projeto na Vercel, acesse **Settings > Environment Variables**.
2. Adicione a variável:
   - **Nome:** `VITE_WS_URL`
   - **Valor:** `wss://seu-backend.onrender.com` (ou `.up.railway.app`)
3. Faça o redeploy do frontend na Vercel.
4. Agora, qualquer pessoa acessando pelo link da Vercel conectará automaticamente ao backend em nuvem com segurança TLS (WSS).

---

## 5. RECURSOS DE RESILIÊNCIA E DIAGNÓSTICO IMPLEMENTADOS

- **Resolução Inteligente de Endereços:** Prioriza configuração customizada salva no dispositivo, variáveis de ambiente ou detecção de rede local.
- **Heartbeat & Keepalive:** Pings periódicos (a cada 20s no cliente e 30s no servidor) evitam que roteadores Wi-Fi ou conexões móveis derrubem a conexão por inatividade.
- **Tolerância a Quedas e Reconexão:** Quando um celular bloqueia a tela ou reconecta ao Wi-Fi, o jogador mantém seu papel, missões e dados preservados no servidor.
- **Feedback Visual Completo:** Fim definitivo de telas pretas ou mensagens genéricas; a interface indica o endereço testado, a latência e orienta a resolução em caso de inconsistência.
