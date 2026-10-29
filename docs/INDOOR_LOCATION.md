# Localização Indoor — iBeacons e Modo Manual

O Dissimulo suporta três modos intercambiáveis de localização através da abstração `LocationProvider`.

---

## 1. Modo Manual (Oficial para Web & PWA — Jogar Hoje)

- **Como funciona:** O jogador toca no ambiente da casa em que se encontra na aba **"Explorar"**.
- **Vantagem:** Funciona em **qualquer smartphone com navegador web**, sem necessidade de instalar aplicativos nativos, sem pedir permissões intrusivas e sem comprar hardware de beacons.
- **Rótulo no Servidor:** As posições manuais são registradas como `locationReliability: "declared"`.
- **Integridade:** O anfitrião pode visualizar a saúde de conexões de todos os participantes no Painel de Administração e conferir os cômodos declarados.

---

## 2. Modo Nativo com iBeacons (Capacitor BLE)

Quando executado no aplicativo nativo Android ou iOS com transmissores instalados na casa:

### Especificação dos Beacons
- **Protocolo:** Apple iBeacon (Bluetooth Low Energy / advertise packet 0x004c).
- **UUID Padrão:** `e2c56db5-dffb-48d2-b060-d0f5a71096e0`
- **Major:** `1` (identifica a residência)
- **Minor:** `1` a `7` (cada número mapeia um cômodo específico):
  1. Sala
  2. Escritório
  3. Varanda
  4. Suíte (colocado na porta externa)
  5. Banheiro Social (colocado na porta externa)
  6. Cozinha
  7. Área da Piscina (colocado na área coberta seca)

### Tratamento de Sinal contra "Vazamento em Paredes"
Sinais de rádio de 2.4 GHz atravessam paredes de alvenaria. Para impedir que o celular fique alternando indevidamente de cômodo:
1. **Filtro EMA (Exponential Moving Average):**
   $$\text{RSSI}_{\text{suavizado}} = \alpha \cdot \text{RSSI}_{\text{atual}} + (1 - \alpha) \cdot \text{RSSI}_{\text{anterior}}$$
   com $\alpha = 0.35$.
2. **Janela de Histerese (4.0 dBm):** O sinal de um novo cômodo precisa superar o cômodo atual em pelo menos 4 dBm para efetivar a transição.
3. **Cálculo de Confiança:** Baseado na intensidade absoluta (-60 dBm = 100% de confiança; -95 dBm = 20% de confiança).

---

## 3. Modo Simulador de Desenvolvimento

- Integrado no pacote `@alibi/location` como `DevLocationSimulator`.
- Permite que robôs ou testes automatizados simulem a movimentação dos 8 jogadores entre os 7 cômodos com marcação de tempo.
