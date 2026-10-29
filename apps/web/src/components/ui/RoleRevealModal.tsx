import React, { useState, useEffect } from "react";
import { Role } from "@alibi/contracts";
import { sound } from "../../lib/audio";
import {
  Shield,
  Skull,
  Search,
  Lock,
  CheckCircle,
  Eye,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { ConfidentialStamp } from "./NoirComponents";

interface RoleRevealModalProps {
  role?: Role;
  playerName: string;
  onDismiss: () => void;
}

export const RoleRevealModal: React.FC<RoleRevealModalProps> = ({
  role = "CIVILIAN",
  playerName,
  onDismiss,
}) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (holding && !revealed) {
      sound.playTypewriterClick();
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setRevealed(true);
            if (role === "KILLER") {
              sound.playHeartbeat();
            } else {
              sound.playPaperRustle();
            }
            return 100;
          }
          sound.vibrate(15);
          return prev + 12;
        });
      }, 90);
    } else if (!revealed) {
      setProgress(0);
    }
    return () => clearInterval(timer);
  }, [holding, revealed, role]);

  const isKiller = role === "KILLER";

  const getRoleDetails = () => {
    switch (role) {
      case "KILLER":
        return {
          title: "O Assassino",
          subtitle: "ELIMINE OS SOBREVIVENTES EM SEGREDO",
          badge: "ALERTA MÁXIMO // CULPADO",
          desc: "Você é o autor do crime nesta residência. Use seu console secreto para armar armadilhas disfarçadas. Se o alvo iniciar sua armadilha ativa, ele morrerá instantaneamente. Mantenha seu disfarce e confunda os demais nos debates.",
          objective: "Elimine sobreviventes até alcançar a paridade numérica sem ser desmascarado nas votações.",
        };
      case "DETECTIVE":
        return {
          title: "O Detetive",
          subtitle: "LÍDER DA INVESTIGAÇÃO FORENSE",
          badge: "AUTORIDADE PERICIAL",
          desc: "Você possui autoridade para autenticar provas cruciais nos cômodos da casa e cruzar contradições de horários e álibis dos outros participantes.",
          objective: "Descubra as evidências nucleares e acuse o verdadeiro assassino na reunião de emergência.",
        };
      case "MEDIC":
        return {
          title: "O Legista / Médico",
          subtitle: "AUTÓPSIAS E PERÍCIA BIOLÓGICA",
          badge: "CORPO DE DELITO",
          desc: "Você analisa laudos químicos e vestígios biológicos deixados nos cômodos. É capaz de estimar horários de morte quando um corpo for encontrado.",
          objective: "Verifique o tempo dos crimes e elimine suspeitos com álibis incompatíveis.",
        };
      case "TECHNICIAN":
        return {
          title: "O Técnico de Sistemas",
          subtitle: "MANUTENÇÃO E NEUTRALIZAÇÃO",
          badge: "CONTROLE DE INFRAESTRUTURA",
          desc: "Você tem facilidade para reparar circuitos e terminais. Suas tarefas de manutenção têm alta probabilidade de desativar armadilhas fatais antes das vítimas iniciarem.",
          objective: "Restaure os sistemas da casa e proteja seus aliados neutralizando armadilhas.",
        };
      case "INFORMANT":
        return {
          title: "O Informante",
          subtitle: "INTERCEPTAÇÃO DE SINAIS",
          badge: "COMUNICAÇÃO RESERVADA",
          desc: "Você intercepta pistas parciais de movimentos da residência e sabe quem estava em cômodos adjacentes nos momentos críticos.",
          objective: "Negocie informações com cautela sem se expor como alvo prioritário.",
        };
      default:
        return {
          title: "Sobrevivente",
          subtitle: "INVESTIGAÇÃO E SOBREVIVÊNCIA",
          badge: "INVESTIGADOR DE CAMPO",
          desc: "Você está preso nesta residência com um assassino oculto. Conclua tarefas de perícia nos cômodos para recuperar pistas, desconfie de missões suspeitas e vote com sabedoria.",
          objective: "Colete evidências reais, sobreviva às armadilhas e vote no culpado correto.",
        };
    }
  };

  const details = getRoleDetails();

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm flex flex-col items-center">
        {!revealed ? (
          /* HOLD TO REVEAL PRIVACY SHIELD */
          <div className="w-full noir-card p-6 text-center space-y-6 border-[#4A3A32] shadow-2xl">
            <div className="space-y-1.5">
              <span className="stamp-confidential text-[10px]">DOCUMENTO CLASSIFICADO</span>
              <h2 className="text-xl font-serif font-bold text-[#F2EDE4] pt-2">
                Dossiê Individual de Papel
              </h2>
              <p className="text-xs text-[#C2B7AA] leading-relaxed">
                Certifique-se de que nenhum outro jogador esteja olhando para sua tela.
              </p>
            </div>

            {/* Wax Seal Press and Hold Target */}
            <div className="py-4 flex flex-col items-center space-y-3">
              <div
                onMouseDown={() => setHolding(true)}
                onMouseUp={() => setHolding(false)}
                onTouchStart={() => setHolding(true)}
                onTouchEnd={() => setHolding(false)}
                className={`w-28 h-28 rounded-full border-2 transition-all flex flex-col items-center justify-center cursor-pointer relative shadow-2xl ${
                  holding
                    ? "scale-95 border-[#9F3D3D] bg-[#2D1214]"
                    : "border-[#B79A70] bg-[#1C1814] hover:bg-[#25201C]"
                }`}
              >
                {/* SVG Progress Circle */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="52"
                    fill="none"
                    stroke="#B79A70"
                    strokeWidth="4"
                    strokeDasharray="326"
                    strokeDashoffset={326 - (326 * progress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-75"
                  />
                </svg>

                {/* Wax Seal Stamp Icon */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9F3D3D] to-[#4A1616] border border-[#F1A8A4]/30 flex items-center justify-center shadow-md">
                  <Lock className="w-5 h-5 text-[#F2EDE4]" />
                </div>
                <span className="text-[10px] font-mono text-[#F2EDE4] mt-1 font-bold">
                  {progress > 0 ? `${progress}%` : "SEGURE"}
                </span>
              </div>

              <span className="text-[11px] font-mono text-[#C2B7AA]">
                Pressione e segure o lacre para romper o sigilo
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0C0B0A] border border-[#4A3A32]/60 text-[10px] font-mono text-[#B79A70]">
              DESTINATÁRIO: {playerName.toUpperCase()}
            </div>
          </div>
        ) : (
          /* REVEALED DOSSIER CARD */
          <div
            className={`w-full p-6 rounded-2xl shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 border ${
              isKiller
                ? "noir-panel-threat border-[#9F3D3D]"
                : "noir-paper border-[#B09B7A]"
            }`}
          >
            {/* Header Stamp */}
            <div className="flex items-start justify-between border-b pb-2 border-current/20">
              <div>
                <span className={isKiller ? "stamp-confidential" : "stamp-order"}>
                  {details.badge}
                </span>
                <span className="text-[10px] font-mono block mt-1 opacity-70">
                  PARTICIPANTE: {playerName.toUpperCase()}
                </span>
              </div>
              {isKiller ? (
                <Skull className="w-6 h-6 text-[#F1A8A4]" />
              ) : (
                <Shield className="w-6 h-6 text-[#30231C]" />
              )}
            </div>

            {/* Role Title */}
            <div>
              <h1
                className={`font-serif font-bold text-2xl tracking-wide ${
                  isKiller ? "text-[#F1A8A4]" : "text-[#30231C]"
                }`}
              >
                {details.title}
              </h1>
              <p
                className={`text-xs font-mono font-bold tracking-wider uppercase mt-0.5 ${
                  isKiller ? "text-[#C2B7AA]" : "text-[#5A4335]"
                }`}
              >
                {details.subtitle}
              </p>
            </div>

            {/* Description */}
            <p
              className={`text-xs leading-relaxed font-sans ${
                isKiller ? "text-[#F2EDE4]" : "text-[#30231C]"
              }`}
            >
              {details.desc}
            </p>

            {/* Objective Box */}
            <div
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                isKiller
                  ? "bg-[#1B0B0D] border-[#9F3D3D]/50 text-[#F2EDE4]"
                  : "bg-[#C8B89C] border-[#B09B7A] text-[#30231C]"
              }`}
            >
              <span className="font-mono font-bold uppercase tracking-wide block text-[10px]">
                Seu Objetivo Principal:
              </span>
              <p className="font-serif italic leading-snug">{details.objective}</p>
            </div>

            {/* Confirmation CTA */}
            <button
              onClick={() => {
                sound.playPaperRustle();
                onDismiss();
              }}
              className={`w-full py-3.5 rounded-xl font-serif font-bold text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2 ${
                isKiller
                  ? "noir-btn-danger"
                  : "noir-btn-paper"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Memorizei Meu Papel</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
