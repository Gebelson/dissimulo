import React from "react";
import { BookOpen, X, ShieldAlert, CheckCircle2, Crosshair } from "lucide-react";
import { sound } from "../lib/audio";
import { ConfidentialStamp } from "./ui/NoirComponents";

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md noir-card p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto space-y-4 border-[#4A3A32]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#4A3A32]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#B79A70]" />
            <h3 className="text-base font-serif font-bold uppercase tracking-wider text-[#F2EDE4]">
              Manual do Caso Dissimulo
            </h3>
          </div>
          <button onClick={onClose} className="text-[#C2B7AA] hover:text-[#F2EDE4] p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules Content */}
        <div className="space-y-3.5 text-xs text-[#C2B7AA] leading-relaxed">
          <div className="p-3 bg-[#14110E] rounded-xl border border-[#4A3A32]">
            <strong className="text-[#F2EDE4] font-serif block mb-1 text-sm">
              01. O Cenário & Participantes
            </strong>
            Vocês estão em uma casa real com 7 cômodos mapeados. No <strong>Dissimulo</strong>, um participante é sorteado secretamente como o <strong>Assassino</strong>. Os demais são sobreviventes com diferentes funções investigativas.
          </div>

          <div className="p-3 bg-[#14110E] rounded-xl border border-[#4A3A32]">
            <strong className="text-[#F2EDE4] font-serif block mb-1 text-sm">
              02. Armadilhas Digitais (100% Virtuais)
            </strong>
            Não há contato físico ou encenações corporais! O assassino arma tarefas disfarçadas. Se o alvo tocar em <strong>"Iniciar Ordem"</strong> na armadilha armada, a eliminação virtual é instantânea.
          </div>

          <div className="p-3 bg-[#14110E] rounded-xl border border-[#4A3A32]">
            <strong className="text-[#F2EDE4] font-serif block mb-1 text-sm">
              03. Neutralização por Terceiros
            </strong>
            Outros sobreviventes recebem tarefas que desarmam a armadilha antes da vítima tocá-la. A vítima <em>nunca recebe uma tarefa que desarme sua própria armadilha</em>.
          </div>

          <div className="p-3 bg-[#14110E] rounded-xl border border-[#4A3A32]">
            <strong className="text-[#F2EDE4] font-serif block mb-1 text-sm">
              04. Perícia & Provas Reais
            </strong>
            Vá fisicamente até os cômodos da residência na aba <strong>Explorar</strong> para recuperar laudos periciais, vestígios e registros do servidor.
          </div>

          <div className="p-3 bg-[#14110E] rounded-xl border border-[#4A3A32]">
            <strong className="text-[#F2EDE4] font-serif block mb-1 text-sm">
              05. Modo Eco & Julgamento
            </strong>
            Eliminados viram <strong>Ecos</strong>, resolvendo enigmas silenciosos sem direito a voto. Quando um corpo for encontrado, todos se reúnem na Sala para debate oral e votação na urna.
          </div>
        </div>

        <button
          onClick={() => {
            sound.playPaperRustle();
            onClose();
          }}
          className="w-full py-3 noir-btn-primary rounded-xl text-xs font-serif font-bold uppercase tracking-widest shadow-md"
        >
          Entendido, Fechar Manual
        </button>
      </div>
    </div>
  );
};
