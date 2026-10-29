import { Evidence } from "@alibi/contracts";

export interface SolvabilityReport {
  isSolvable: boolean;
  killerId: string;
  compatibleSuspectIds: string[];
  coreEvidenceCount: number;
  unlockedEvidenceCount: number;
  recommendation?: "BALANCED" | "ADD_DISCRIMINATING_CLUE" | "REPLACE_LOST_CLUE";
}

export class SolvabilityVerifier {
  /**
   * Verifies if the set of unlocked/available evidence allows fair mathematical deduction of the killer.
   */
  public static verifyCase(params: {
    killerId: string;
    allPlayerIds: string[];
    availableEvidence: Evidence[];
    deadPlayerIds: string[];
  }): SolvabilityReport {
    const { killerId, allPlayerIds, availableEvidence, deadPlayerIds } = params;

    const coreClues = availableEvidence.filter(
      (e) => e.tier === "CORE" && e.authenticityVerified
    );

    // Living suspects (excluding known dead players)
    const livingSuspects = allPlayerIds.filter((id) => !deadPlayerIds.includes(id));

    // For each core evidence, check which suspects are compatible
    let compatibleSuspects = new Set<string>(livingSuspects);

    for (const clue of coreClues) {
      if (clue.suspectIds && clue.suspectIds.length > 0) {
        compatibleSuspects = new Set(
          Array.from(compatibleSuspects).filter((id) => clue.suspectIds.includes(id))
        );
      }
    }

    const compatibleList = Array.from(compatibleSuspects);
    const killerIncluded = compatibleList.includes(killerId);

    // If killer is not among compatible suspects, there is a contradiction
    if (!killerIncluded) {
      return {
        isSolvable: false,
        killerId,
        compatibleSuspectIds: compatibleList,
        coreEvidenceCount: coreClues.length,
        unlockedEvidenceCount: availableEvidence.length,
        recommendation: "REPLACE_LOST_CLUE",
      };
    }

    // If core clues uniquely isolate the killer or killer + at most 1 other suspect (fair for 8 players)
    const isSolvable = coreClues.length >= 2 && compatibleList.length <= 2;

    return {
      isSolvable,
      killerId,
      compatibleSuspectIds: compatibleList,
      coreEvidenceCount: coreClues.length,
      unlockedEvidenceCount: availableEvidence.length,
      recommendation: isSolvable
        ? "BALANCED"
        : coreClues.length < 2
        ? "REPLACE_LOST_CLUE"
        : "ADD_DISCRIMINATING_CLUE",
    };
  }
}
