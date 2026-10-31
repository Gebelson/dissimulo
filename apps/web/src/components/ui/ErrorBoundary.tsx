import React, { Component, ErrorInfo, ReactNode } from "react";
import { DissimuloLogo } from "./DissimuloLogo";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Dissimulo ErrorBoundary caught error]:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetSession = () => {
    sessionStorage.removeItem("dissimulo_player_id");
    sessionStorage.removeItem("alibi_player_id");
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0C0B0A] flex flex-col items-center justify-center p-6 text-center select-none max-w-sm mx-auto">
          <DissimuloLogo size="sm" subtitle={false} />

          <div className="my-6 p-6 rounded-2xl bg-[#171411] border-2 border-[#9F3D3D] shadow-noir-crimson space-y-4 w-full">
            <div className="w-12 h-12 rounded-full bg-[#2A1114] border border-[#9F3D3D] flex items-center justify-center text-[#F1A8A4] mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="stamp-confidential text-[9px]">OCORRÊNCIA ANÔMALA</span>
              <h2 className="text-base font-serif font-bold text-[#F2EDE4] leading-snug">
                FALHA NA INTERFACE PERICIAL
              </h2>
              <p className="text-xs font-sans text-[#C2B7AA] leading-relaxed">
                Um erro inesperado interrompeu a renderização. Seus dados de jogo continuam preservados no servidor.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3.5 noir-btn-primary rounded-xl font-serif font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4 text-[#F1A8A4]" />
                <span>Recarregar Investigação</span>
              </button>

              <button
                onClick={this.handleResetSession}
                className="w-full py-3 noir-btn-secondary rounded-xl font-serif font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 text-[#B79A70]" />
                <span>Reiniciar do Começo</span>
              </button>
            </div>
          </div>

          <span className="text-[10px] font-mono text-[#8C8074] uppercase tracking-widest">
            DISSIMULO // SEGURANÇA & DEDUÇÃO SOCIAL
          </span>
        </div>
      );
    }

    return this.props.children;
  }
}
