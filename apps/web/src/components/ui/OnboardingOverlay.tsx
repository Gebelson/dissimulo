import React, { useState } from "react";
import { sound } from "../../lib/audio";
import {
  MapPin,
  FileSearch,
  Skull,
  ChevronRight,
  CheckCircle,
  X,
  Compass,
  AlertTriangle,
} from "lucide-react";

interface OnboardingOverlayProps {
  onDismiss: () => void;
}

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ onDismiss }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: "01. A Mansão Real (7 Ambientes)",
      subtitle: "INVESTIGAÇÃO PRESENCIAL",
      icon: <Compass className="w-10 h-10 text-[#B79A70]" />,
      text: "Vocês estão fisicamente em uma casa real com 7 cômodos mapeados. Na aba Explorar, você declara o ambiente onde está. Lembre-se: banheiro e suíte possuem checagem na porta!",
      badge: "PROTOCOLO DE LOCALIZAÇÃO",
    },
    {
      title: "02. Perícia & Dossiê do Caso",
      subtitle: "RECUPERAÇÃO DE PROVAS REAIS",
      icon: <FileSearch className="w-10 h-10 text-[#73917B]" />,
      text: "Dirija-se aos cômodos da casa e toque em 'Investigar Este Ambiente' para desbloquear laudos, registros e depoimentos. Resolva as perícias para desvendar o assassino.",
      badge: "COLETA FORENSE",
    },
    {
      title: "03. Armadilhas Mortais Virtuais",
      subtitle: "NÃO CONFIE EM NINGUÉM",
      icon: <Skull className="w-10 h-10 text-[#F1A8A4]" />,
      text: "Um de vocês é o assassino! Ele cria ordens disfarçadas que parecem legítimas. Se você iniciar a armadilha armada, morrerá imediatamente. Sobreviventes podem neutralizá-las antes!",
      badge: "ALERTA MÁXIMO",
    },
  ];

  const current = slides[slide];

  const handleNext = () => {
    sound.playTap();
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      onDismiss();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm noir-card p-6 shadow-2xl space-y-5 flex flex-col justify-between min-h-[400px] border-[#4A3A32]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#4A3A32]/60 pb-2">
          <span className="text-[10px] font-mono uppercase text-[#B79A70] font-bold tracking-[0.2em]">
            INSTRUÇÕES DO CASO // {slide + 1} DE 3
          </span>
          <button
            onClick={() => {
              sound.playTap();
              onDismiss();
            }}
            className="text-[#C2B7AA] hover:text-[#F2EDE4] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="space-y-4 text-center my-auto">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[#1C1814] flex items-center justify-center border border-[#4A3A32] shadow-noir-card">
            {current.icon}
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#B79A70] uppercase tracking-wider block">
              {current.badge}
            </span>
            <h3 className="text-xl font-serif font-bold text-[#F2EDE4] mt-0.5">
              {current.title}
            </h3>
          </div>

          <p className="text-xs text-[#C2B7AA] leading-relaxed px-2 font-sans">
            {current.text}
          </p>
        </div>

        {/* Footer controls & dots */}
        <div className="space-y-3 pt-2">
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === slide ? "bg-[#B79A70] w-6" : "bg-[#4A3A32] w-1.5"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3.5 noir-btn-primary flex items-center justify-center gap-1.5 active:scale-95 text-xs font-serif font-bold uppercase tracking-widest shadow-md"
          >
            <span>{slide === slides.length - 1 ? "Entendido, Começar!" : "Avançar"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
