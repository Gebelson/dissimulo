import React from "react";

interface DissimuloLogoProps {
  size?: "sm" | "md" | "lg";
  subtitle?: boolean;
}

export const DissimuloLogo: React.FC<DissimuloLogoProps> = ({ size = "md", subtitle = true }) => {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div className="flex flex-col items-center select-none text-center">
      <div className="flex items-center gap-3.5">
        {/* Antique Brass & Wax Seal "D" Medallion */}
        <div
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#2D1214] via-[#1B0B0C] to-[#0D0506] border border-[#B79A70]/60 shadow-noir-card transition-transform ${
            isSm ? "w-8 h-8" : isLg ? "w-16 h-16" : "w-11 h-11"
          }`}
        >
          {/* Inner Medallion Rim */}
          <div className="absolute inset-0.5 rounded-full border border-[#9F3D3D]/40" />

          {/* Stylized Serif "D" with Crime Investigation Cut */}
          <span
            className={`font-serif font-bold text-[#F2EDE4] leading-none select-none drop-shadow ${
              isSm ? "text-base" : isLg ? "text-3xl" : "text-xl"
            }`}
            style={{ fontStyle: "italic" }}
          >
            D
          </span>

          {/* Micro Wax Dot */}
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#9F3D3D] border border-[#0C0B0A]" />
        </div>

        {/* Editorial Title Typography */}
        <div className="text-left">
          <h1
            className={`font-serif font-bold tracking-[0.22em] text-[#F2EDE4] uppercase leading-none ${
              isSm ? "text-lg" : isLg ? "text-4xl" : "text-2xl"
            }`}
          >
            DISSIMULO
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1 h-1 rounded-full bg-[#B79A70]" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#B79A70] uppercase font-semibold">
              CASO PENAL
            </span>
            <span className="w-1 h-1 rounded-full bg-[#B79A70]" />
          </div>
        </div>
      </div>

      {subtitle && (
        <p className="text-xs text-[#C2B7AA] italic font-serif mt-2 tracking-wide font-normal">
          "Ninguém tem a história inteira."
        </p>
      )}
    </div>
  );
};

// Backward compatibility alias
export const AlibiLogo = DissimuloLogo;
