import React from "react";
import { BookOpen, XCircle, ShieldAlert, CheckCircle2, Crosshair } from "lucide-react";
import { sound } from "../lib/audio";

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-investigation/40 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2 text-investigation">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-primary">
              Manual do Jogo ÁLIBI
            </h3>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Rules Content */}
        <div className="space-y-3.5 text-xs text-secondary leading-relaxed">
          <div className="p-3 bg-surface-elevated rounded-xl border border-border">
            <strong className="text-primary block mb-1">01. O Conceito</strong>
            Vocês estão em uma casa real com 7 ambientes. Um dos participantes foi secretamente sorteado como o <strong>Assassino</strong>. Os demais são sobreviventes com diferentes funções investigativas.
          </div>

          <div className="p-3 bg-surface-elevated rounded-xl border border-border">
            <strong className="text-primary block mb-1">02. Armadilhas Digitais (100% Virtual)</strong>
            Não há contato físico ou encenações corporais! O assassino arma missões falsas em seu celular. Se o alvo tocar em <strong>"Iniciar missão"</strong> na missão disfarçada, é eliminado virtualmente.
          </div>

          <div className="p-3 bg-surface-elevated rounded-xl border border-border">
            <strong className="text-primary block mb-1">03. Neutralização por Terceiros</strong>
            Outros sobreviventes recebem tarefas que podem neutralizar a armadilha do assassino antes que a vítima a inicie. Mas atenção: <em>a vítima nunca é capaz de desarmar a própria armadilha!</em>
          </div>

          <div className="p-3 bg-surface-elevated rounded-xl border border-border">
            <strong className="text-primary block mb-1">04. Investigação & Evidências Reais</strong>
            Provas não surgem do nada: você precisa ir aos cômodos da casa e tocar em <strong>"Investigar Este Ambiente"</strong> para recuperar laudos, fragmentos e logs reais do servidor.
          </div>

          <div className="p-3 bg-surface-elevated rounded-xl border border-border">
            <strong className="text-primary block mb-1">05. Modo Eco & Reuniões</strong>
            Se for eliminado, você continuará jogando como <strong>Eco</strong>, resolvendo enigmas sem poder votar. Quando um corpo for encontrado, haverá reunião de emergência com debate presencial e votação formal.
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="w-full py-2.5 bg-investigation text-background rounded-xl text-xs font-bold active:scale-95"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
