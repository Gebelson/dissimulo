# Guia de Hospedagem e Deploy — ÁLIBI

## 1. Conexões Persistentes (Requisito Crítico)

> **IMPORTANTE:** O ÁLIBI utiliza conexões persistentes WebSocket com estado em tempo real. **Não hospede o servidor multiplayer em funções serverless de borda efêmeras** (como Vercel Serverless Functions ou AWS Lambda padrão), pois elas encerram conexões persistentes após alguns segundos.

O servidor `apps/game-server` deve rodar como um processo contínuo em:
- Um container Docker (em Railway, Render, Fly.io, VPS Linux ou AWS ECS/EC2)
- Uma máquina local na mesma rede Wi-Fi da casa durante a partida

---

## 2. Jogando Hoje na Mesma Casa (Rede Local Wi-Fi)

Para jogar com 8 pessoas em uma casa real sem custos de nuvem:

1. Conecte o computador do anfitrião e os 8 celulares na **mesma rede Wi-Fi** da casa.
2. Descubra o IP local do computador (no PowerShell: `ipconfig` -> ex: `192.168.1.105`).
3. Inicie o projeto na raiz:
   ```bash
   pnpm dev
   ```
4. Peça aos outros 7 participantes para abrirem o navegador do celular no endereço:
   `http://192.168.1.105:3000`
5. Todos digitam seu nome, o código da sala (ex: `CASA8`), marcam **"Confirmar Que Estou Pronto"** e o anfitrião toca em **"Iniciar Partida"**!

---

## 3. Deploy em Nuvem com Docker

Criamos o arquivo `Dockerfile` na raiz do projeto:

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/ ./apps/
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @alibi/web build

FROM node:22-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app ./
EXPOSE 4000 3000
CMD ["pnpm", "dev"]
```

### Variáveis de Ambiente
- `PORT`: Porta do servidor WebSocket (padrão: `4000`).
- `NODE_ENV`: `production`.
