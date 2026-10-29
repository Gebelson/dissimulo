// 02: Quebra de Cifra
// Player decodes a forensic transmission using an encryption key / Caesar shift

export interface CipherChallenge {
  encryptedText: string;
  targetSolution: string;
  shift: number;
  clue: string;
  options: string[];
}

const WORDS = [
  { word: "ALIBI", clue: "Declaração de presença em outro local durante o crime." },
  { word: "BEACON", clue: "Transmissor Bluetooth de proximidade usado em cômodos." },
  { word: "PERICIA", clue: "Análise forense de vestígios e impressões digitais." },
  { word: "VESTIGIO", clue: "Marca ou rastro físico deixado na cena do crime." },
  { word: "EVIDENCIA", clue: "Prova material utilizada no dossiê de acusação." },
];

export class CipherGame {
  public static generate(difficulty = 2): CipherChallenge {
    const item = WORDS[Math.floor(Math.random() * WORDS.length)];
    const shift = (difficulty * 2 + 1) % 25 + 1; // 3 to 7
    const encrypted = this.applyShift(item.word, shift);

    // Generate 3 distractors
    const options = [item.word];
    while (options.length < 4) {
      const candidate = WORDS[Math.floor(Math.random() * WORDS.length)].word;
      if (!options.includes(candidate)) options.push(candidate);
    }

    return {
      encryptedText: encrypted,
      targetSolution: item.word,
      shift,
      clue: item.clue,
      options: options.sort(() => Math.random() - 0.5),
    };
  }

  public static applyShift(text: string, shift: number): string {
    return text
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        return char;
      })
      .join("");
  }

  public static verify(challenge: CipherChallenge, selectedWord: string): boolean {
    return challenge.targetSolution === selectedWord.toUpperCase().trim();
  }
}
