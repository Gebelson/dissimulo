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
  // Investigative missions
  {
    id: "tmpl_circuit_main",
    title: "Reconectar Circuito Auxiliar",
    description: "Restaure a alimentação do painel de monitoramento da casa para recuperar logs de acesso.",
    category: "SURVIVAL",
    minigameId: "circuit_reconnect",
    durationSeconds: 30,
    requiredRoomId: "sala",
    isDisarmCapable: true,
    difficulty: 2,
  },
  {
    id: "tmpl_cipher_intercept",
    title: "Decifrar Credencial Interceptada",
    description: "Uma transmissão codificada foi capturada na rede local. Decifre a chave criptográfica.",
    category: "INVESTIGATION",
    minigameId: "cipher_breaker",
    durationSeconds: 35,
    requiredRoomId: "escritorio",
    isDisarmCapable: false,
    difficulty: 2,
  },
  {
    id: "tmpl_doc_shredded",
    title: "Reconstruir Arquivo Destruído",
    description: "Um relatório impresso foi picotado e deixado na mesa. Reconstitua os fragmentos originais.",
    category: "INVESTIGATION",
    minigameId: "doc_reconstruct",
    durationSeconds: 25,
    requiredRoomId: "escritorio",
    isDisarmCapable: false,
    difficulty: 2,
  },
  {
    id: "tmpl_log_audit",
    title: "Auditar Discrepâncias de Acesso",
    description: "Compare os dois relatórios de presença da última hora para encontrar inconsistências.",
    category: "INVESTIGATION",
    minigameId: "log_audit",
    durationSeconds: 25,
    requiredRoomId: "sala",
    isDisarmCapable: false,
    difficulty: 2,
  },
  {
    id: "tmpl_signal_memory",
    title: "Autenticar Pacote de Rede",
    description: "Repita a sequência luminosa dos relés de segurança para confirmar integridade.",
    category: "SURVIVAL",
    minigameId: "signal_memory",
    durationSeconds: 20,
    requiredRoomId: "cozinha",
    isDisarmCapable: true,
    difficulty: 1,
  },
  {
    id: "tmpl_trace_forensics",
    title: "Análise Pericial de Vestígio",
    description: "Examine a assinatura espectrográfica encontrada na maçaneta e classifique o padrão.",
    category: "INVESTIGATION",
    minigameId: "trace_pattern",
    durationSeconds: 30,
    requiredRoomId: "suite",
    isDisarmCapable: false,
    difficulty: 3,
  },
  {
    id: "tmpl_chronology_order",
    title: "Reconstruir Linha do Tempo",
    description: "Organize os eventos recentes em ordem cronológica estrita para detectar contradições.",
    category: "INVESTIGATION",
    minigameId: "chronology_order",
    durationSeconds: 30,
    isDisarmCapable: false,
    difficulty: 2,
  },
  {
    id: "tmpl_frequency_radio",
    title: "Estabilizar Frequência de Emergência",
    description: "Sintonize a frequência dos sensores externos ajustando a onda portadora.",
    category: "SURVIVAL",
    minigameId: "frequency_tune",
    durationSeconds: 25,
    requiredRoomId: "varanda",
    isDisarmCapable: true,
    difficulty: 2,
  },
  {
    id: "tmpl_anomaly_schematic",
    title: "Localizar Anomalia em Planta",
    description: "Detecte a adulteração comparando o esquema elétrico original com a leitura do sensor.",
    category: "INVESTIGATION",
    minigameId: "anomaly_detect",
    durationSeconds: 25,
    requiredRoomId: "cozinha",
    isDisarmCapable: false,
    difficulty: 2,
  },
  {
    id: "tmpl_seal_auth",
    title: "Autenticar Selo Digital",
    description: "Monte a chancela criptográfica necessária para liberar o arquivo de álibi.",
    category: "INVESTIGATION",
    minigameId: "seal_auth",
    durationSeconds: 25,
    requiredRoomId: "banheiro_social",
    isDisarmCapable: false,
    difficulty: 2,
  },
  {
    id: "tmpl_terminal_sync",
    title: "Sincronizar Terminais Seguros",
    description: "Execute o handshake de proteção mútua entre dois nós da rede.",
    category: "SURVIVAL",
    minigameId: "terminal_sync",
    durationSeconds: 30,
    isDisarmCapable: true,
    difficulty: 3,
  },
  {
    id: "tmpl_packet_reassembly",
    title: "Reconstruir Transmissão Interceptada",
    description: "Vincule os fragmentos da conversa interceptada na ordem lógica do protocolo.",
    category: "INVESTIGATION",
    minigameId: "packet_reassembly",
    durationSeconds: 35,
    requiredRoomId: "piscina",
    isDisarmCapable: false,
    difficulty: 3,
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
