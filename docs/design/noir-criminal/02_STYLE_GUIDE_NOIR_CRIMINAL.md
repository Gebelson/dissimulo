# DISSIMULO — STYLE GUIDE OFICIAL | NOIR CRIMINAL

**Versão 1.0 — referência visual e implementação mobile**

## 1. PERSONALIDADE

**Promessa:** uma história de assassinato e segredo acontece entre os jogadores. O aplicativo é uma extensão elegante do caso, não um computador futurista.

Adjetivos: cinematográfico, sombrio, tenso, investigativo, humano, táctil, refinado.

Não é: hacker, cyberpunk, neon, corporativo, gótico exagerado, terror gore, fantasia medieval, dashboard analítico.

**Fórmula visual:** 70% UI legível + 20% atmosfera + 10% ornamentação narrativa. A estética nunca deve ocultar ações urgentes.

## 2. REFERÊNCIA DE COMPOSIÇÃO

A imagem aprovada mostra dez mockups de celular: abertura com casa à noite, lobby de retratos, missão sobre papel confidencial, assassino em vermelho escuro, evidências em fichas e fotos, dossiê com fios, morte, reunião/votação, Eco azulado e puzzle de impressão. Adotar a harmonia e a linguagem, não replicar imagens textuais integralmente.

### Fotografia e arte
- Interiores noturnos, arquitetura clássica discreta, planos em sombra, chuva/luz de janela como art direction, não obrigação de gameplay.
- Retratos de personagens **fictícios e consistentes**, sem sugerir que o app usa identificação de pessoas reais.
- Evidências com papel envelhecido, envelopes, tinta, carimbo e fotocópia; sem texto importante rasterizado em textura.
- Alfinetes e fios aparecem no dossiê (um visual de poucas conexões), não em todas as telas.
- Violência simbólica, não explícita: lacre vermelho, silhueta, marca de tinta. Sem gore.

## 3. CORES E TOKENS

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#0C0B0A` | fundo principal |
| `--surface` | `#171411` | conteúdo básico |
| `--surface-raised` | `#221D19` | cartões e sheets |
| `--surface-ink` | `#111011` | telas de ameaça |
| `--paper` | `#D8C8AC` | cartões de documento de alto destaque |
| `--paper-ink` | `#30231C` | texto sobre papel |
| `--text` | `#F2EDE4` | textos principais no escuro |
| `--text-muted` | `#C2B7AA` | texto secundário |
| `--border` | `#4A3A32` | bordas discretas |
| `--brass` | `#B79A70` | destaque investigativo |
| `--crimson` | `#9F3D3D` | perigo, assassino |
| `--crimson-light` | `#F1A8A4` | texto claro em área perigosa |
| `--safe` | `#73917B` | neutralização/proteção |
| `--ghost` | `#7B849D` | Eco, atmosfera fria |
| `--focus` | `#EBC28D` | foco visível |

**Nota de acessibilidade:** ajustar pares de fundo/texto para WCAG AA (4,5:1 para texto normal, 3:1 para texto grande). Não utilizar vermelho `#9F3D3D` com texto preto para mensagens críticas. Cor nunca é única indicação de estado.

### CSS inicial

```css
:root {
  color-scheme: dark;
  --bg:#0C0B0A; --surface:#171411; --surface-raised:#221D19;
  --paper:#D8C8AC; --paper-ink:#30231C;
  --text:#F2EDE4; --text-muted:#C2B7AA;
  --border:#4A3A32; --brass:#B79A70; --crimson:#9F3D3D;
  --crimson-light:#F1A8A4; --safe:#73917B; --ghost:#7B849D;
  --focus:#EBC28D;
  --radius-sm:8px; --radius-md:12px; --radius-lg:18px;
  --tap-min:44px;
}
```

## 4. TIPOGRAFIA

- **Display:** `Cormorant Garamond` (ou `Bodoni Moda` caso performance e legibilidade permitam). Usar em logo, capítulos, casos e momentos dramáticos.
- **Corpo e controles:** `Manrope` ou `Inter` (preferir Manrope para humanizar; manter fallback system).
- **Metadados:** `IBM Plex Mono`, somente códigos/horários, caixa alta, tamanho 11–12 px, nunca para blocos longos.

| Uso | Tamanho mobile recomendado | Peso |
|---|---:|---|
| Abertura/marca | 44–64 px | serif regular |
| Título de tela | 28–34 px | serif semibold |
| Título de cartão | 21–25 px | serif semibold ou sans bold |
| Texto principal | 15–17 px | sans regular |
| Controle/CTA | 15–16 px | sans semibold |
| Legenda/metadata | 12–13 px | sans medium |

Evitar caixa alta em parágrafos. `line-height` de corpo 1.45–1.6; evitar letter-spacing excessivo. Não colocar detalhes pequenos em fontes serif decorativas.

## 5. GRID, ESPAÇAMENTO E RESPONSIVIDADE

Base de espaçamento: 4, 8, 12, 16, 20, 24, 32, 40, 48 px. Padding horizontal 16 px em 320–375; 20 px em 390–430; 24–32 px em tablet. Conteúdo mobile 100% com max-width adequado, respeitando safe area.

- Botões: 48–56 px altura; alvos >=44×44 px.
- Navbar inferior: ~64 px + `env(safe-area-inset-bottom)`; sem cobrir último item.
- Bottom sheets: max-height de viewport disponível, scroll interno, grip opcional e fechar acessível.
- Cards: raio 12–18 px, borda finíssima e sombras internas discretas; evitar card dentro de card.
- Documentos: papel como destaque 1–2 vezes por tela, não todo conteúdo.
- Imagens hero: 140–260 px mobile conforme altura, com contraste para CTA.
- Layout relativo: `minmax(0,1fr)` para grids, `min-width:0` em flex children, wrapping de nomes longos.
- Evitar `100vh` simples onde o teclado e barras móveis afetam altura; usar `100dvh` com fallback.

Breakpoints de revisão: 320×568, 360×640, 375×667, 390×844, 414×896, 430×932, 768×1024, 1024+. Validar textos ampliados e orientação horizontal.

## 6. TEXTURAS E SUPERFÍCIES

- Fundo: vinheta suave e grão finíssimo, sem interferir na leitura (2–6% de opacidade efetiva).
- Papel: ruído e bordas envelhecidas discretas; conteúdos importantes continuam texto HTML semântico.
- Vermelho: lacre, linhas de alerta e ações do assassino. Não usar como fundo padrão de todos os cartões.
- Latão: separadores, marcas de caso, detalhes editoriais.
- Luz: pontos de iluminação na fotografia, não em neon nos botões.

## 7. ÍCONES E ASSETS

Conjunto principal: Lucide para ações comuns, ícones autorais para evidências e papéis. Tamanho 20–24 px, stroke 1.75–2, alinhamento consistente. Selo confidencial, envelope, carimbo, chave, fita, marcador, cronômetro, impressão digital, alfinete. Não depender de emoji. Imagens em WebP/AVIF, SVG para vetores. Textos relevantes nunca embutidos em imagens. Registrar licenças.

## 8. COMPONENTES E ESTADOS

**Botão primário:** vinho escuro com texto marfim em alto contraste, realce tátil discreto. **Secundário:** fundo carvão + borda latão sutil. **Perigo:** reservado a ação irreversível explícita (exceto missão falsa — não denunciar a armadilha). **Desabilitado:** opacidade e explicação de requisito. **Loading:** feedback local, sem travar toda tela.

**Missão:** cartão de ordem sigilosa, título, objetivo curto, destino opcional e CTA. Missão falsa deve parecer totalmente igual a verdadeira para o alvo.

**Evidência:** ficha com categoria, origem, data, código e botão examinar. Papel envelhecido como variação editorial, não única versão.

**Suspeito:** retrato, nome, estado público e acesso a evidências; sem mostrar culpabilidade oculta.

**Notificações:** toast curto para rotina, modal grande apenas para eventos narrativos significativos.

**Estados:** normal, hover desktop, pressed, focus-visible, disabled, loading, success, error, offline. Não usar somente cores para comunicá-los.

## 9. ANIMAÇÕES E SONS

- Toque/hover: 100–180 ms.
- Navegação: 180–260 ms.
- Revelação da carta: 350–600 ms, com alternativa reduzida.
- Evidência: 250–450 ms.
- Morte: 400–900 ms (não atrapalhar acesso ao próximo passo).
- Sons: papel, madeira, clique mecânico, carimbo, pulso grave, sino abafado. Volumes baixos, mute global.
- Preferir opacity/transform; evitar grandes filtros blur permanentes e animações de layout custosas.

## 10. COPY E TOM

Curto, tenso, humano, sem linguagem de produto SaaS. Exemplos:
- `O caso começou.`
- `Nova ordem recebida.`
- `Examinar evidência`
- `Investigar cômodo`
- `Um registro não confere.`
- `Armadilha neutralizada.` (somente para quem sabe disso)
- `Você foi assassinado.`
- `Reunir os sobreviventes`
- `Encerrar investigação`

Não chamar jogadores de usuários o tempo inteiro; usar participantes, suspeitos e sobreviventes conforme o contexto. Não chamar todas as etapas de 'sincronizar sistema'.

## 11. MATRIZ DE QA VISUAL

Verificar por tela e estado: leitura em 320 px, retorno/fechar, toque com uma mão, contraste, texto grande, teclado, orientação, barra inferior, offline, loading, erro, vazamento de segredos, movimento reduzido. Comparar screenshots reais com a imagem aprovada por **atmosfera e composição**, não apenas cor.

## 12. REGRAS DE NÃO REGRESSÃO

- Só o servidor conhece qual missão contém armadilha.
- A vítima morre no ato de iniciar missão armadilhada ativa, não depois do minigame.
- A vítima nunca recebe missão que neutraliza sua própria armadilha.
- Há uma única armadilha ativa por vez.
- Missões chegam globalmente; evidências são encontradas em ambientes específicos.
- A interface não sugere prova conclusiva onde há apenas estimativa indoor.
- Dossiê e notificações não expõem segredos indevidos.
