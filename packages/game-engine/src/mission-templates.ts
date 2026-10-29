import { MinigameId, MissionCategory } from "@alibi/contracts";

export interface MissionTemplate {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  minigameId: MinigameId;
  durationSeconds: number;
  requiredRoomId?: string;
  isDisarmCapable?: boolean;
  difficulty: number; // 1 to 5
}

export const MISSION_TEMPLATES: MissionTemplate[] = [
  // 1. Reconectar Circuito
  {
    id: "tmpl_circuit_main",
    title: "Reconectar Fios de Emergência",
    description: "Ligue os fios de mesma cor na caixa de fusíveis para restaurar a energia do setor.",
    category: "SURVIVAL",
    minigameId: "circuit_reconnect",
    durationSeconds: 25,
    requiredRoomId: "sala",
    isDisarmCapable: true,
    difficulty: 2,
  },
  // 2. Analisar Digital
  {
    id: "tmpl_fingerprint_match",
    title: "Analisar Impressão Digital",
    description: "Alinhe os 3 fragmentos da impressão digital colhida no local para identificar o suspeito.",
    category: "INVESTIGATION",
    minigameId: "fingerprint_match",
    durationSeconds: 25,
    requiredRoomId: "suite",
    isDisarmCapable: false,
    difficulty: 2,
  },
  // 3. Abrir Arquivo
  {
    id: "tmpl_archive_lock",
    title: "Abrir Arquivo Confidencial",
    description: "Gire o disco do mecanismo até a posição indicada na evidência para destravar a gaveta.",
    category: "INVESTIGATION",
    minigameId: "archive_lock",
    durationSeconds: 25,
    requiredRoomId: "escritorio",
    isDisarmCapable: false,
    difficulty: 2,
  },
  // 4. Restaurar Energia
  {
    id: "tmpl_timing_power",
    title: "Restaurar Energia do Painel",
    description: "Acione o contato no instante exato em que o ponteiro passar pela zona de tolerância.",
    category: "SURVIVAL",
    minigameId: "timing_power",
    durationSeconds: 20,
    requiredRoomId: "varanda",
    isDisarmCapable: true,
    difficulty: 2,
  },
  // 5. Recuperar Documento
  {
    id: "tmpl_doc_shredded",
    title: "Recuperar Documento Rasgado",
    description: "Monte os fragmentos do relatório confidencial picotado na mesa da perícia.",
    category: "INVESTIGATION",
    minigameId: "doc_reconstruct",
    durationSeconds: 25,
    requiredRoomId: "escritorio",
    isDisarmCapable: false,
    difficulty: 2,
  },
  // 6. Decifrar Código
  {
    id: "tmpl_cipher_intercept",
    title: "Decifrar Código da Chave",
    description: "Digite a senha curta pericial no teclado mecânico para liberar o compartimento.",
    category: "INVESTIGATION",
    minigameId: "cipher_breaker",
    durationSeconds: 25,
    requiredRoomId: "sala",
    isDisarmCapable: false,
    difficulty: 2,
  },
  // 7. Interceptar Sinal
  {
    id: "tmpl_signal_memory",
    title: "Interceptar Sinal do Telégrafo",
    description: "Repita a sequência de pulsos luminosos transmitida pelo telégrafo de emergência.",
    category: "SURVIVAL",
    minigameId: "signal_memory",
    durationSeconds: 20,
    requiredRoomId: "cozinha",
    isDisarmCapable: true,
    difficulty: 1,
  },
  // 8. Analisar Evidência
  {
    id: "tmpl_evidence_analysis",
    title: "Analisar Evidência Pericial",
    description: "Identifique as discrepâncias comparando a fotografia original com a cena periciada.",
    category: "INVESTIGATION",
    minigameId: "evidence_analysis",
    durationSeconds: 25,
    requiredRoomId: "cozinha",
    isDisarmCapable: false,
    difficulty: 2,
  },
];

// Disguise templates used by the killer to disguise a lethal trap!
export const DISGUISE_TRAP_TEMPLATES: MissionTemplate[] = [
  {
    id: "trap_tmpl_circuit",
    title: "Calibrar Sensor de Presença",
    description: "Ajuste os contatos do sensor elétrico para restabelecer os alertas perimetrais.",
    category: "DISGUISE_TRAP",
    minigameId: "circuit_reconnect",
    durationSeconds: 25,
    difficulty: 2,
  },
  {
    id: "trap_tmpl_terminal",
    title: "Verificar Terminal de Segurança",
    description: "Acesse o console de logs para liberar o relatório de segurança do perímetro.",
    category: "DISGUISE_TRAP",
    minigameId: "cipher_breaker",
    durationSeconds: 30,
    difficulty: 2,
  },
  {
    id: "trap_tmpl_frequency",
    title: "Alinhar Antena da Varanda",
    description: "Estabilize a recepção de sinais de rádio para sincronizar os horários das câmeras.",
    category: "DISGUISE_TRAP",
    minigameId: "frequency_tune",
    durationSeconds: 25,
    difficulty: 2,
  },
  {
    id: "trap_tmpl_doc",
    title: "Revalidar Registro de Visitante",
    description: "Confirme os dados cadastrais da credencial de convidado no sistema central.",
    category: "DISGUISE_TRAP",
    minigameId: "doc_reconstruct",
    durationSeconds: 25,
    difficulty: 2,
  },
];

// Eco puzzles (exclusive for eliminated players in Eco Mode)
export const ECO_PUZZLE_TEMPLATES: MissionTemplate[] = [
  {
    id: "eco_tmpl_spectral",
    title: "Decodificar Frequência Espectral",
    description: "Sintonize a perturbação eletromagnética para extrair um fragmento informativo.",
    category: "ECO",
    minigameId: "frequency_tune",
    durationSeconds: 20,
    difficulty: 1,
  },
  {
    id: "eco_tmpl_memory",
    title: "Ressonância de Memória",
    description: "Reconstitua os impulsos residuais deixados nos circuitos para clarear os fatos.",
    category: "ECO",
    minigameId: "signal_memory",
    durationSeconds: 20,
    difficulty: 1,
  },
];
