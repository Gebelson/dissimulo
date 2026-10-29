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
      title: "01. A Mansão Real (7 Cômodos)",
      subtitle: "INVESTIGAÇÃO PRESENCIAL",
      icon: <Compass className="w-10 h-10 text-investigation" />,
      text: "Vocês estão fisicamente em uma casa com 7 cômodos. Na aba Explorar, você visualiza a planta e declara o ambiente onde está. Lembre-se: banheiro e suíte têm checagem na porta!",
      color: "border-investigation shadow-hud-cyan",
    },
    {
      title: "02. Perícia & Dossiê Coletivo",
      subtitle: "RECUPERAÇÃO DE PROVAS REAIS",
      icon: <FileSearch className="w-10 h-10 text-protection" />,
      text: "Vá aos cômodos e toque em 'Investigar Este Ambiente' para desbloquear laudos, registros e depoimentos reais. Resolva os minigames para restabelecer os sistemas.",
      color: "border-protection",
    },
    {
      title: "03. Armadilhas Mortais Virtuais",
      subtitle: "NÃO CONFIE EM NINGUÉM",
      icon: <Skull className="w-10 h-10 text-danger" />,
      text: "Um de vocês é o assassino! Ele cria missões falsas idênticas às normais. Se você iniciar a armadilha armada, morrerá imediatamente. Sobreviventes podem neutralizá-las antes!",
      color: "border-danger shadow-hud-crimson",
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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-5 flex flex-col justify-between min-h-[380px]">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-investigation font-bold tracking-widest">
            BRIEFING TÁTICO // PASSO {slide + 1} DE 3
          </span>
          <button
            onClick={() => {
              sound.playTap();
              onDismiss();
            }}
            className="text-secondary hover:text-primary p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="space-y-4 text-center my-auto">
          <div
            className={`w-20 h-20 mx-auto rounded-2xl bg-surface-elevated flex items-center justify-center border ${current.color}`}
          >
            {current.icon}
          </div>

          <div>
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
              {current.subtitle}
            </span>
            <h3 className="text-lg font-bold font-display text-primary mt-0.5">
              {current.title}
            </h3>
          </div>

          <p className="text-xs text-secondary leading-relaxed px-2">
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
                className={`w-2 h-2 rounded-full transition-all ${
                  i === slide ? "bg-investigation w-6" : "bg-border"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 tactile-btn-primary flex items-center justify-center gap-1.5 active:scale-95 text-xs font-bold uppercase tracking-wider"
          >
            <span>{slide === slides.length - 1 ? "Entendido, Começar!" : "Próximo Passo"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
