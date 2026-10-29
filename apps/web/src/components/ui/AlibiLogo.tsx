import React from "react";

interface AlibiLogoProps {
  size?: "sm" | "md" | "lg";
  subtitle?: boolean;
}

export const AlibiLogo: React.FC<AlibiLogoProps> = ({ size = "md", subtitle = true }) => {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex items-center gap-2.5">
        {/* Bespoke Fingerprint / Forensic Eye Vector Insignia */}
        <div
          className={`relative flex items-center justify-center rounded-xl bg-gradient-to-b from-investigation/20 to-surface border border-investigation/40 shadow-hud-cyan ${
            isSm ? "w-7 h-7" : isLg ? "w-14 h-14" : "w-10 h-10"
          }`}
        >
          <svg
            className={`${isSm ? "w-4 h-4" : isLg ? "w-8 h-8" : "w-6 h-6"} text-investigation`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Abstract Biometric Arch & Crosshair */}
            <path d="M12 2a10 10 0 0 0-10 10c0 4.4 2.9 8.2 7 9.5" />
            <path d="M12 6a6 6 0 0 0-6 6c0 2.6 1.7 4.9 4.2 5.7" />
            <path d="M12 10a2 2 0 0 0-2 2c0 .9.6 1.6 1.4 1.9" />
            <circle cx="12" cy="12" r="1" fill="#FF2A55" />
            <line x1="22" y1="12" x2="16" y2="12" stroke="#FF2A55" strokeWidth="2.5" />
            <line x1="12" y1="2" x2="12" y2="4" stroke="#00F0FF" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-danger animate-pulse" />
        </div>

        {/* Title Typography */}
        <div className="text-left">
          <h1
            className={`font-display font-extrabold tracking-wider text-primary leading-none ${
              isSm ? "text-lg" : isLg ? "text-4xl" : "text-2xl"
            }`}
          >
            ÁLIBI
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
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
