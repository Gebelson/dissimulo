import React from "react";

interface DissimuloLogoProps {
  size?: "sm" | "md" | "lg";
  subtitle?: boolean;
}

export const DissimuloLogo: React.FC<DissimuloLogoProps> = ({ size = "md", subtitle = true }) => {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex items-center gap-3">
        {/* Bespoke Forensic "D" Monogram Insignia */}
        <div
          className={`relative flex items-center justify-center rounded-xl bg-gradient-to-b from-investigation/20 to-surface border border-investigation/40 shadow-hud-cyan transition-transform ${
            isSm ? "w-8 h-8" : isLg ? "w-16 h-16" : "w-11 h-11"
          }`}
        >
          <svg
            className={`${isSm ? "w-5 h-5" : isLg ? "w-10 h-10" : "w-7 h-7"} text-investigation`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Left Vertical Spine with Forensic Measurement Calibrations */}
            <path d="M5 3v18" stroke="#00F0FF" strokeWidth="2.5" />
            <line x1="3" y1="6" x2="5" y2="6" stroke="#00F0FF" strokeWidth="1.5" />
            <line x1="2" y1="12" x2="5" y2="12" stroke="#FF2A55" strokeWidth="2" />
            <line x1="3" y1="18" x2="5" y2="18" stroke="#00F0FF" strokeWidth="1.5" />

            {/* Stylized "D" Outer Biometric Arch */}
            <path
              d="M5 3h6.5a8.5 8.5 0 0 1 8.5 8.5v1a8.5 8.5 0 0 1-8.5 8.5H5"
              stroke="#00F0FF"
              strokeWidth="2"
            />

            {/* Concentric Biometric Ridge 1 (Inner Loop) */}
            <path
              d="M8 7h3.5a4.5 4.5 0 0 1 4.5 4.5v1a4.5 4.5 0 0 1-4.5 4.5H8"
              stroke="#00F0FF"
              strokeWidth="1.25"
              strokeOpacity="0.7"
            />

            {/* Concentric Biometric Ridge 2 (Core) */}
            <path
              d="M9.5 10.5h1.8a1.8 1.8 0 0 1 1.8 1.8v-.2a1.8 1.8 0 0 1-1.8 1.8H9.5"
              stroke="#00F0FF"
              strokeWidth="1"
              strokeOpacity="0.4"
            />

            {/* Forensic Focal Crosshair Reticle */}
            <circle cx="12" cy="12" r="1.2" fill="#FF2A55" stroke="none" />
            <line x1="18.5" y1="12" x2="22.5" y2="12" stroke="#FF2A55" strokeWidth="2" />
            <line x1="12" y1="1.5" x2="12" y2="3" stroke="#00F0FF" strokeWidth="1.5" />
          </svg>

          {/* Crimson Warning Ping on Upper Edge */}
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-danger animate-pulse border border-surface" />
        </div>

        {/* Title Typography */}
        <div className="text-left">
          <h1
            className={`font-display font-extrabold tracking-widest text-primary leading-none ${
              isSm ? "text-lg" : isLg ? "text-4xl" : "text-2xl"
            }`}
          >
            DISSIMULO
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-investigation animate-ping" />
            <span className="text-[9px] font-mono tracking-widest text-secondary font-bold uppercase">
              FORENSIC NOIR
            </span>
          </div>
        </div>
      </div>

      {subtitle && (
        <p className="text-[11px] text-muted italic font-mono mt-2 tracking-wide">
          "Ninguém tem a história inteira."
        </p>
      )}
    </div>
  );
};

// Backwards compatibility alias
export const AlibiLogo = DissimuloLogo;
