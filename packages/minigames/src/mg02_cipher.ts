// 02: Decifrar Código (Keypad Pin) & Quebra de Cifra
// Keypad PIN entry with short code obtained in forensic evidence stamp.
// Preserves legacy Caesar cipher for compatibility.

export interface CodeDecipherChallenge {
  code: string;
  codeLength: number;
  label: string;
  clueStamp: string;
}

export class CodeDecipherGame {
  public static generate(difficulty: "CASUAL" | "STANDARD" | "TENSION" | number = "STANDARD"): CodeDecipherChallenge {
    let length = 4;
    if (difficulty === "CASUAL" || difficulty === 1) {
      length = 3;
    }

    let code = "";
    for (let i = 0; i < length; i++) {
      code += Math.floor(Math.random() * 9) + 1; // 1-9
    }

    return {
      code,
      codeLength: length,
      label: "Terminal de Acesso Criptografado",
      clueStamp: `REGISTRO PERICIAL: CHAVE [ ${code.split("").join(" ")} ]`,
    };
  }

  public static verify(enteredCode: string, targetCode: string): boolean {
    return enteredCode.trim() === targetCode.trim();
  }
}

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
  public static generateKeypad(difficulty?: any): CodeDecipherChallenge {
    return CodeDecipherGame.generate(difficulty);
  }

  public static verifyKeypad(entered: string, target: string): boolean {
    return CodeDecipherGame.verify(entered, target);
  }

  public static generate(difficulty = 2): CipherChallenge {
    const item = WORDS[Math.floor(Math.random() * WORDS.length)];
    const shift = (difficulty * 2 + 1) % 25 + 1;
    const encrypted = this.applyShift(item.word, shift);

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
