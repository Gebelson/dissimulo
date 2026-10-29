import { Evidence, GameEventLogEntry, Testimony } from "@alibi/contracts";

export interface InvestigationNode {
  id: string;
  type: "suspect" | "evidence" | "room" | "testimony";
  label: string;
  data: Record<string, any>;
}

export interface InvestigationEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ForensicContradictionReport {
  hasContradiction: boolean;
  testimonyId: string;
  suspectId: string;
  claimedRoomId: string;
  actualRoomId?: string;
  details: string;
}

export class ForensicsEngine {
  /**
   * Compares testimony statements against real room logs to spot discrepancies
   */
  public static auditTestimonies(
    testimonies: Testimony[],
    eventLogs: GameEventLogEntry[]
  ): ForensicContradictionReport[] {
    const reports: ForensicContradictionReport[] = [];

    for (const t of testimonies) {
      // Find room events for author around that time window
      const roomEvents = eventLogs.filter(
        (e) => e.type === "ROOM_CHANGED" && e.actorPlayerId === t.authorPlayerId
      );

      if (roomEvents.length > 0) {
        const lastRoom = roomEvents[roomEvents.length - 1].roomId;
        if (lastRoom && lastRoom !== t.claimedRoomId) {
          reports.push({
            hasContradiction: true,
            testimonyId: t.id,
            suspectId: t.authorPlayerId,
            claimedRoomId: t.claimedRoomId,
            actualRoomId: lastRoom,
            details: `Depoimento alega presença em '${t.claimedRoomId}', mas os registros de rede confirmam trânsito em '${lastRoom}'.`,
          });
        }
      }
    }

    return reports;
  }

  /**
   * Generates graph representation suitable for React Flow or canvas rendering
   */
  public static buildGraph(
    evidenceList: Evidence[],
    suspects: Array<{ id: string; name: string }>,
    testimonies: Testimony[]
  ): { nodes: InvestigationNode[]; edges: InvestigationEdge[] } {
    const nodes: InvestigationNode[] = [];
    const edges: InvestigationEdge[] = [];

    // Add Suspect Nodes
    suspects.forEach((s) => {
      nodes.push({
        id: `suspect_${s.id}`,
        type: "suspect",
        label: s.name,
        data: { suspectId: s.id },
      });
    });

    // Add Evidence Nodes & Edges
    evidenceList.forEach((e) => {
      nodes.push({
        id: `ev_${e.id}`,
        type: "evidence",
        label: e.title,
        data: e,
      });

      e.suspectIds.forEach((suspectId) => {
        edges.push({
          id: `edge_${e.id}_${suspectId}`,
          source: `ev_${e.id}`,
          target: `suspect_${suspectId}`,
          label: e.tier === "CORE" ? "Forte Indício" : "Corroboração",
        });
      });
    });

    // Add Testimony Nodes
    testimonies.forEach((t) => {
      nodes.push({
        id: `test_${t.id}`,
        type: "testimony",
        label: `Depoimento #${t.id.slice(-4)}`,
        data: t,
      });

      edges.push({
        id: `edge_test_${t.id}_author`,
        source: `test_${t.id}`,
        target: `suspect_${t.authorPlayerId}`,
        label: "Declarou",
      });
    });

    return { nodes, edges };
  }
}
