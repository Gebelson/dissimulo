import React from "react";

// 1. Editorial Section Header
export const NoirSectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, badge, action }) => (
  <div className="flex items-start justify-between border-b border-[#4A3A32]/60 pb-2 mb-4">
    <div>
      {badge && (
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B79A70] font-semibold block mb-0.5">
          {badge}
        </span>
      )}
      <h2 className="text-xl font-serif font-bold tracking-wide text-[#F2EDE4] leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-[#C2B7AA] font-sans mt-0.5">{subtitle}</p>
      )}
    </div>
    {action && <div className="ml-2 flex-shrink-0">{action}</div>}
  </div>
);

// 2. Stamps
export const ConfidentialStamp: React.FC<{ text?: string; className?: string }> = ({
  text = "CONFIDENCIAL",
  className = "",
}) => (
  <span className={`stamp-confidential text-[10px] ${className}`}>
    {text}
  </span>
);

export const EvidenceStamp: React.FC<{ code: string; className?: string }> = ({
  code,
  className = "",
}) => (
  <span className={`stamp-evidence text-[10px] ${className}`}>
    PEÇA FORENSE #{code}
  </span>
);

export const NeutralizedStamp: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span className={`stamp-neutralized text-[10px] ${className}`}>
    AMEAÇA NEUTRALIZADA
  </span>
);

// 3. Suspect / Player Portrait in Noir Chiaroscuro
export const CharacterPortrait: React.FC<{
  name: string;
  status?: "ALIVE" | "DEAD_UNDISCOVERED" | "ECO";
  isReady?: boolean;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  onClick?: () => void;
}> = ({ name, status = "ALIVE", isReady, size = "md", selected, onClick }) => {
  const isDead = status === "DEAD_UNDISCOVERED" || status === "ECO";
  const isLg = size === "lg";
  const isSm = size === "sm";

  // Generate consistent initial/seed from safe name
  const safeName = (name || "Investigador").trim();
  const initial = safeName.charAt(0).toUpperCase() || "?";

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col items-center select-none ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div
        className={`relative rounded-xl border transition-all overflow-hidden ${
          isSm ? "w-10 h-10" : isLg ? "w-20 h-20" : "w-14 h-14"
        } ${
          selected
            ? "border-[#B79A70] ring-2 ring-[#B79A70]/50 shadow-noir-brass scale-105"
            : isDead
            ? "border-[#4A3A32]/40 bg-[#121010] opacity-60"
            : "border-[#4A3A32] bg-[#1E1915] shadow-noir-card"
        }`}
      >
        {/* Chiaroscuro Atmospheric Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-[#1C1814] to-[#2E2721]" />

        {/* Silhouette / Monogram Avatar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-serif font-bold text-[#D8C8AC] select-none ${
              isSm ? "text-sm" : isLg ? "text-2xl" : "text-lg"
            }`}
          >
            {initial}
          </span>
        </div>

        {/* Cross-hatch film shadow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

        {/* Status Indicators */}
        {status === "ECO" && (
          <div className="absolute inset-0 bg-[#161A22]/80 flex items-center justify-center">
            <span className="text-[9px] font-mono text-[#7B849D] font-bold tracking-wider">
              ECO
            </span>
          </div>
        )}
        {status === "DEAD_UNDISCOVERED" && (
          <div className="absolute inset-0 bg-[#241113]/85 flex items-center justify-center">
            <span className="text-[9px] font-mono text-[#F1A8A4] font-bold tracking-wider">
              FATAL
            </span>
          </div>
        )}
      </div>

      {/* Name and State Underneath */}
      <span
        className={`mt-1 font-sans text-center truncate max-w-[80px] font-medium leading-tight ${
          isSm ? "text-[10px]" : "text-xs"
        } ${isDead ? "text-[#C2B7AA]/50 line-through" : "text-[#F2EDE4]"}`}
      >
        {safeName}
      </span>

      {isReady !== undefined && (
        <span
          className={`text-[9px] font-mono mt-0.5 tracking-wider ${
            isReady ? "text-[#73917B]" : "text-[#C2B7AA]/60"
          }`}
        >
          {isReady ? "PRONTO" : "AGUARDANDO"}
        </span>
      )}
    </div>
  );
};
