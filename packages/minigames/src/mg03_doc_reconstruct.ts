// 03: Reconstruir Documento
// Reassembling shredded document strips into proper sequence

export interface DocFragment {
  id: number;
  originalIndex: number;
  textSnippet: string;
}

export interface DocReconstructChallenge {
  title: string;
  fragments: DocFragment[];
  totalFragments: number;
}

const DOCUMENT_PRESETS = [
  {
    title: "Relatório de Plantão da Segurança",
    lines: [
      "[21:00] Início da vigilância no setor social.",
      "[21:15] Circuito auxiliar apresentou queda de tensão.",
      "[21:30] Acesso anômalo registrado no terminal do escritório.",
      "[21:45] Porta da varanda trancada pelo lado externo.",
    ],
  },
  {
    title: "Laudo Pericial de Acesso",
    lines: [
      "ITEM 1: Credencial número 409 foi duplicada.",
      "ITEM 2: Horário de ativação coincide com o blefe.",
      "ITEM 3: Nenhuma falha mecânica detectada no sistema.",
      "ITEM 4: Assinatura digital diverge do registro mestre.",
    ],
  },
];

export class DocReconstructGame {
  public static generate(): DocReconstructChallenge {
    const preset = DOCUMENT_PRESETS[Math.floor(Math.random() * DOCUMENT_PRESETS.length)];
    const fragments: DocFragment[] = preset.lines.map((text, idx) => ({
      id: idx + 1,
      originalIndex: idx,
      textSnippet: text,
    }));

    // Scramble order
    const scrambled = [...fragments].sort(() => Math.random() - 0.5);

    return {
      title: preset.title,
      fragments: scrambled,
      totalFragments: fragments.length,
    };
  }

  public static isSolved(currentOrder: number[]): boolean {
    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i] !== i + 1) return false;
    }
    return true;
  }
}
