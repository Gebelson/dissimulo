# Relatório de Testes Automatizados — ÁLIBI

**Data de Execução:** 29/10/2026  
**Ambiente:** Node.js v24.13.1 · Windows 11 · Vitest v3.2.7 · pnpm v12.8.1

---

## 1. Resumo Executivo

| Suíte de Teste | Quantidade | Aprovados | Falhas | Tempo de Execução |
|---|---|---|---|---|
| **Invariantes Críticas de Regras & Armadilhas** | 7 | 7 | 0 | 4 ms |
| **Validação dos 12 Minigames** | 12 | 12 | 0 | 5 ms |
| **Simulador E2E de 8 Jogadores Concorrentes** | 1 ciclo completo | 1 | 0 | 45 ms |
| **Total** | **19 testes unitários + 1 E2E** | **100% PASS** | **0** | **< 1s** |

---

## 2. Testes de Regras Críticas Validados

1. **`O assassino só consegue criar exatamente uma armadilha ativa por vez`**  
   - *Status:* **PASSOU**.  
   - *Evidência:* Tentativa simultânea de armar a segunda armadilha rejeitada pelo servidor com a exceção `"O assassino já possui uma armadilha ativa no servidor."`

2. **`A vítima NUNCA recebe ou mantém missão que neutralize sua própria armadilha`**  
   - *Status:* **PASSOU**.  
   - *Evidência:* O agendador verifica todos os identificadores e exclui categoricamente a vítima de qualquer tarefa neutralizadora.

3. **`Tocar em 'Iniciar missão' elimina a vítima IMEDIATAMENTE quando a armadilha está ativa`**  
   - *Status:* **PASSOU**.  
   - *Evidência:* A chamada a `startMission` retorna `{ lethal: true }`, o status da vítima passa a `DEAD_UNDISCOVERED` e o código de confirmação de 4 dígitos é gerado. Nenhum minigame abre.

4. **`Terceiro sobrevivente pode neutralizar a armadilha e liberar o slot do assassino`**  
   - *Status:* **PASSOU**.  
   - *Evidência:* Conclusão da missão pelo sobrevivente neutralizador comuta o status para `DISARMED`, notifica ambos em sigilo e permite ao assassino armar uma nova armadilha imediatamente.

5. **`Missão falsa desarmada se torna inofensiva e não elimina a vítima`**  
   - *Status:* **PASSOU**.  
   - *Evidência:* Vítima executou `startMission` após neutralização; retorno `{ lethal: false }`, status permaneceu `ALIVE`.

6. **`Jogadores eliminados não conseguem votar`**  
   - *Status:* **PASSOU**.  
   - *Evidência:* Voto de jogador eliminado rejeitado com `"Jogadores eliminados ou Ecos não possuem direito a voto."`

7. **`Provedor manual de localização funciona perfeitamente sem beacons`**  
   - *Status:* **PASSOU**.  
   - *Evidência:* Transição imediata de cômodo com confiabilidade `"declared"`.

---

## 3. Validação dos 12 Minigames

- [x] **MG01 (Circuitos):** Rotação contínua e busca em largura (BFS) validando condutividade.
- [x] **MG02 (Cifra):** Decodificação por deslocamento de César e palavras periciais.
- [x] **MG03 (Documento):** Ordenação sequencial de tiras de relatório picotado.
- [x] **MG04 (Auditoria de Logs):** Detecção exata das 2 linhas adulteradas.
- [x] **MG05 (Memória de Sinais):** Entrada sequencial Simon Says em relés.
- [x] **MG06 (Análise de Vestígios):** Comparação biométrica/espectrográfica.
- [x] **MG07 (Cronologia):** Ordenação temporal estrita.
- [x] **MG08 (Frequência):** Ajuste de onda senoidal dentro da margem de tolerância.
- [x] **MG09 (Anomalia):** Identificação de setores alterados em planta.
- [x] **MG10 (Selo Digital):** Alinhamento angular de 3 anéis concêntricos.
- [x] **MG11 (Terminais):** Handshake de soma criptográfica.
- [x] **MG12 (Transmissão):** Montagem lógica de pacotes TCP na sequência correta.
