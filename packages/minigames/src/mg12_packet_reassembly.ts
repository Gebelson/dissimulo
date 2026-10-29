// 12: Reconstruir Transmissão
// Intercepted packet reassembly into coherent message

export interface NetworkPacket {
  seqId: number;
  payload: string;
}

export interface PacketReassemblyChallenge {
  scrambledPackets: NetworkPacket[];
  assembledTargetText: string;
}

export class PacketReassemblyGame {
  public static generate(): PacketReassemblyChallenge {
    const packets: NetworkPacket[] = [
      { seqId: 1, payload: "RELATÓRIO CONFIDENCIAL:" },
      { seqId: 2, payload: "SUSPEITO ACESSOU A SALA" },
      { seqId: 3, payload: "PORTANDO CHAVE RESERVA" },
      { seqId: 4, payload: "E TRANSMITIU DADOS." },
    ];

    const scrambled = [...packets].sort(() => Math.random() - 0.5);

    return {
      scrambledPackets: scrambled,
      assembledTargetText: packets.map((p) => p.payload).join(" "),
    };
  }

  public static isCorrect(orderedSequence: number[]): boolean {
    for (let i = 0; i < orderedSequence.length; i++) {
      if (orderedSequence[i] !== i + 1) return false;
    }
    return true;
  }
}
